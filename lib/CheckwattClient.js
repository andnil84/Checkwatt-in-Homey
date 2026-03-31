'use strict';

const BASE_URL = 'https://api.checkwatt.se';
const KILL_SWITCH_URL = 'https://checkwatt.se/ha-killswitch.txt';

function kwFieldToWatts(energyData, key) {
  if (!energyData || typeof energyData[key] !== 'number' || !Number.isFinite(energyData[key])) {
    return null;
  }
  return Math.round(energyData[key] * 1000);
}

function baseHeaders(application) {
  return {
    accept: 'application/json, text/plain, */*',
    'accept-language': 'sv-SE,sv;q=0.9,en-SE;q=0.8,en;q=0.7,en-US;q=0.6',
    'content-type': 'application/json',
    'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'wslog-os': '',
    'wslog-platform': 'controlpanel',
    'X-pyCheckwatt-Application': application,
  };
}

/**
 * Port of the unofficial EnergyInBalance API used by pyCheckwatt / ha-checkwatt.
 * @see https://github.com/faanskit/pyCheckwatt
 */
class CheckwattClient {
  constructor(application = 'HomeyCheckwatt') {
    this.application = application;
    this.jwtToken = null;
    this.refreshToken = null;
    this.customerDetails = null;
    this.displayName = null;
    this.energyData = null;
    this.revenue = null;
    this.revenueYearTotal = 0;
    this.siteId = null;
    this.meterData = null;
    this.emsPending = null;
  }

  getMeterId() {
    if (!this.customerDetails) return null;
    const meters = this.customerDetails.Meter || [];
    const soc = meters.find((m) => m.InstallationType === 'SoC');
    return soc && soc.Id != null ? soc.Id : null;
  }

  /**
   * SoC-mätare / CM (CM10/CM30) status — samma endpoint som pyCheckwatt get_meter_status.
   */
  async getMeterStatus() {
    const meterId = this.getMeterId();
    if (!meterId) {
      return false;
    }
    const res = await fetch(
      `${BASE_URL}/asset/status?meterId=${encodeURIComponent(meterId)}`,
      { headers: this.authHeaders() },
    );
    if (!res.ok) {
      return false;
    }
    this.meterData = await res.json();
    return true;
  }

  /**
   * Enum: ok | offline | test — för läsbar status (inte 0/1).
   * Null om ingen meterdata.
   */
  get meterLinkStatus() {
    if (!this.meterData) return null;
    const label = String(this.meterData.Label || '').toLowerCase();
    if (label === 'offline') return 'offline';
    const ver = String(this.meterData.Version || '');
    if (ver.endsWith('.83')) return 'test';
    return 'ok';
  }

  get meterStatusLabel() {
    if (!this.meterData) return '';
    return String(this.meterData.Label || this.meterData.Status || '');
  }

  /**
   * Driftläge enligt /ems/service/Pending (samma som pyCheckwatt get_ems_settings).
   */
  async getEmsPending() {
    const serial = this.getRpiSerial();
    if (!serial) {
      return false;
    }
    const res = await fetch(
      `${BASE_URL}/ems/service/Pending?Serial=${encodeURIComponent(serial)}`,
      { headers: this.authHeaders() },
    );
    if (!res.ok) {
      return false;
    }
    this.emsPending = await res.json();
    return true;
  }

  /**
   * Kort text för platta: mätstatus + ev. driftläge (fcrd/sc).
   * Portalens "TESTAR" motsvaras ofta av test-firmware (.83) eller mätarens Label.
   */
  get eibStatusDisplay() {
    const parts = [];
    if (this.meterData) {
      const raw = String(this.meterData.Label || this.meterData.Status || '').trim();
      if (raw) {
        parts.push(raw);
      }
      const ver = String(this.meterData.Version || '');
      if (ver.endsWith('.83')) {
        parts.push('Test');
      }
    }
    if (this.emsPending && Array.isArray(this.emsPending) && this.emsPending.length > 0) {
      const mode = String(this.emsPending[0] || '').toLowerCase();
      if (mode === 'fcrd') {
        parts.push('CO');
      } else if (mode === 'sc') {
        parts.push('SC');
      } else if (mode) {
        parts.push(mode.toUpperCase());
      }
    }
    if (parts.length === 0) {
      return '—';
    }
    return [...new Set(parts)].join(' · ');
  }

  authHeaders() {
    return {
      ...baseHeaders(this.application),
      authorization: `Bearer ${this.jwtToken}`,
    };
  }

  async killSwitchAllows() {
    const res = await fetch(KILL_SWITCH_URL, { headers: baseHeaders(this.application) });
    if (res.status === 401) return false;
    if (res.status !== 200) return false;
    const text = (await res.text()).trim();
    return text === '0';
  }

  async login(username, password) {
    if (!(await this.killSwitchAllows())) {
      throw new Error('CheckWatt har begärt att integrationer pausar (kill-switch).');
    }

    const credentials = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
    const res = await fetch(`${BASE_URL}/user/Login?audience=eib`, {
      method: 'POST',
      headers: {
        ...baseHeaders(this.application),
        authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({ OneTimePassword: '' }),
    });

    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      throw new Error('Fel användarnamn eller lösenord.');
    }
    if (res.status !== 200) {
      throw new Error(`Inloggning misslyckades (${res.status}).`);
    }

    this.jwtToken = data.JwtToken;
    this.refreshToken = data.RefreshToken;
    return true;
  }

  async getCustomerDetails() {
    const res = await fetch(`${BASE_URL}/controlpanel/CustomerDetail`, {
      headers: this.authHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Kunde inte hämta kunddata (${res.status}).`);
    }
    this.customerDetails = await res.json();

    const meters = this.customerDetails.Meter || [];
    const socMeter = meters.find((m) => m.InstallationType === 'SoC');
    if (!socMeter) {
      throw new Error('Ingen SoC-mätare hittades i EnergyInBalance.');
    }

    this.displayName = socMeter.DisplayName || 'CheckWatt';
    return true;
  }

  getRpiSerial() {
    if (!this.customerDetails) return null;
    const meters = this.customerDetails.Meter || [];
    for (const meter of meters) {
      if (meter.RpiSerial) return String(meter.RpiSerial).toUpperCase();
    }
    return null;
  }

  async getSiteId() {
    if (this.siteId) return this.siteId;
    const serial = this.getRpiSerial();
    if (!serial) {
      throw new Error('Saknar RPi-serienummer för anläggningen.');
    }
    const res = await fetch(`${BASE_URL}/Site/SiteIdBySerial?serial=${encodeURIComponent(serial)}`, {
      headers: this.authHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Kunde inte hämta site-id (${res.status}).`);
    }
    const raw = await res.text();
    try {
      const parsed = JSON.parse(raw);
      this.siteId = String(parsed.SiteId);
    } catch {
      this.siteId = raw.replace(/"/g, '').trim();
    }
    return this.siteId;
  }

  async getEnergyFlow() {
    const res = await fetch(`${BASE_URL}/ems/energyflow`, {
      headers: this.authHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Kunde inte hämta energiflöde (${res.status}).`);
    }
    this.energyData = await res.json();
    return true;
  }

  async getFcrdTodayNetRevenue() {
    const siteId = await this.getSiteId();
    const fromDate = new Date();
    const from = `${fromDate.getFullYear()}-${String(fromDate.getMonth() + 1).padStart(2, '0')}-${String(fromDate.getDate()).padStart(2, '0')}`;
    const end = new Date(fromDate);
    end.setDate(end.getDate() + 2);
    const to = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;

    const res = await fetch(
      `${BASE_URL}/revenue/${siteId}?from=${from}&to=${to}&resolution=day`,
      { headers: this.authHeaders() },
    );
    if (!res.ok) {
      throw new Error(`Kunde inte hämta dagsintäkter (${res.status}).`);
    }
    this.revenue = await res.json();
    return true;
  }

  async getFcrdYearNetRevenue() {
    const siteId = await this.getSiteId();
    this.revenueYearTotal = 0;

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const y = now.getFullYear();
    const pad = (n) => String(n).padStart(2, '0');
    const yesterdayDateStr = `-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;

    const fetchRange = async (from, to) => {
      const res = await fetch(
        `${BASE_URL}/revenue/${siteId}?from=${from}&to=${to}&resolution=day`,
        { headers: this.authHeaders() },
      );
      if (!res.ok) return false;
      const body = await res.json();
      for (const row of body.Revenue || []) {
        if (typeof row.NetRevenue === 'number') this.revenueYearTotal += row.NetRevenue;
      }
      return true;
    };

    if (yesterdayDateStr <= '-07-01') {
      const from = `${y}-01-01`;
      const to = `${y}${yesterdayDateStr}`;
      return fetchRange(from, to);
    }

    const months = ['-01-01', '-06-30', '-07-01', yesterdayDateStr];
    let loop = 0;
    while (loop < 3) {
      const from = `${y}${months[loop]}`;
      const to = `${y}${months[loop + 1]}`;
      await fetchRange(from, to);
      loop += 2;
    }
    return true;
  }

  get fcrdTodayNetRevenue() {
    if (!this.revenue || !this.revenue.Revenue || !this.revenue.Revenue.length) return null;
    const r0 = this.revenue.Revenue[0];
    return typeof r0.NetRevenue === 'number' ? r0.NetRevenue : null;
  }

  get fcrdTomorrowNetRevenue() {
    if (!this.revenue || !this.revenue.Revenue || this.revenue.Revenue.length < 2) return null;
    const r1 = this.revenue.Revenue[1];
    return typeof r1.NetRevenue === 'number' ? r1.NetRevenue : null;
  }

  get batterySoc() {
    if (!this.energyData || typeof this.energyData.BatterySoC !== 'number') return null;
    return this.energyData.BatterySoC;
  }

  /** Momentan elnätseffekt (API i kW → W). GridNow — samma fält som pyCheckwatt `grid_power`. */
  get gridPowerW() {
    return kwFieldToWatts(this.energyData, 'GridNow');
  }

  /** Momentan batterieffekt (API i kW → W). */
  get batteryPowerW() {
    return kwFieldToWatts(this.energyData, 'BatteryNow');
  }

  /** Momentan soleffekt (API i kW → W). */
  get solarPowerW() {
    return kwFieldToWatts(this.energyData, 'SolarNow');
  }

  /**
   * Full poll used by the device: login required before, or call after fresh login.
   */
  async fetchSnapshot({ includeAnnual = true } = {}) {
    await this.getEnergyFlow();
    await this.getFcrdTodayNetRevenue();
    if (includeAnnual) {
      await this.getFcrdYearNetRevenue();
    }
    await this.getMeterStatus();
    await this.getEmsPending();
  }
}

module.exports = CheckwattClient;
