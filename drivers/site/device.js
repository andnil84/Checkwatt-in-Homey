'use strict';

const Homey = require('homey');
const CheckwattClient = require('../../lib/CheckwattClient');

const INTERVAL_MS = 60 * 1000;
const ANNUAL_EVERY = 15;

class SiteDevice extends Homey.Device {
  async onInit() {
    this._tick = 0;
    this._lastPollOk = true;
    this._lastMeterLinkStatus = undefined;

    if (this.hasCapability('meter_link_ok')) {
      await this.removeCapability('meter_link_ok').catch(() => {});
    }
    if (!this.hasCapability('meter_link_status')) {
      await this.addCapability('meter_link_status').catch(() => {});
    }
    if (this.hasCapability('battery_soc_pct')) {
      await this.removeCapability('battery_soc_pct').catch(() => {});
    }
    if (!this.hasCapability('measure_battery_pct')) {
      await this.addCapability('measure_battery_pct').catch(() => {});
    }
    if (this.hasCapability('eib_status')) {
      await this.removeCapability('eib_status').catch(() => {});
    }
    if (!this.hasCapability('status_eib')) {
      await this.addCapability('status_eib').catch(() => {});
    }
    for (const cap of ['grid_power', 'battery_power', 'solar_power']) {
      if (!this.hasCapability(cap)) {
        await this.addCapability(cap).catch(() => {});
      }
    }
    this._timer = this.homey.setInterval(() => this.poll(), INTERVAL_MS);
    await this.poll();
  }

  async onSettings({ newSettings, changedKeys }) {
    if (!changedKeys.includes('username') && !changedKeys.includes('password')) {
      return;
    }
    const username = String(newSettings.username || '').trim();
    const password = String(newSettings.password || '');
    if (!username || !password) {
      throw new Error('Ange både användarnamn och lösenord för EnergyInBalance.');
    }
    const client = new CheckwattClient();
    await client.login(username, password);
    if (!(await client.getCustomerDetails())) {
      throw new Error('Kunde inte verifiera mot EnergyInBalance.');
    }
    this.homey.setTimeout(() => this.poll(), 500);
  }

  /**
   * Called from the Flow action "Refresh CheckWatt data".
   */
  async triggerRefresh() {
    await this.poll();
  }

  onDeleted() {
    if (this._timer) this.homey.clearInterval(this._timer);
  }

  async poll() {
    const settings = this.getSettings();
    const username = settings.username;
    const password = settings.password;
    if (!username || !password) {
      this.error('Saknar användarnamn eller lösenord. Öppna enheten → kugghjul → EnergyInBalance (EiB).');
      await this.setUnavailable('Saknar EiB-inloggning').catch(() => {});
      if (this._lastPollOk) {
        this._lastPollOk = false;
        this.driver.triggerConnectionLost(this, 'Saknar användarnamn eller lösenord');
      }
      return;
    }

    const includeAnnual = this._tick % ANNUAL_EVERY === 0;
    this._tick += 1;

    try {
      const client = new CheckwattClient();
      await client.login(username, password);
      await client.getCustomerDetails();
      await client.fetchSnapshot({ includeAnnual });

      if (client.fcrdTodayNetRevenue != null) {
        await this.setCapabilityValue('net_income_daily', client.fcrdTodayNetRevenue).catch(() => {});
      }
      if (client.fcrdTomorrowNetRevenue != null) {
        await this.setCapabilityValue('net_income_tomorrow', client.fcrdTomorrowNetRevenue).catch(() => {});
      }
      if (includeAnnual && typeof client.revenueYearTotal === 'number') {
        await this.setCapabilityValue('net_income_annual', client.revenueYearTotal).catch(() => {});
      }
      if (client.batterySoc != null) {
        await this.setCapabilityValue('measure_battery', client.batterySoc).catch(() => {});
        await this.setCapabilityValue('measure_battery_pct', client.batterySoc).catch(() => {});
      }

      if (client.gridPowerW != null) {
        await this.setCapabilityValue('grid_power', client.gridPowerW).catch(() => {});
      }
      if (client.batteryPowerW != null) {
        await this.setCapabilityValue('battery_power', client.batteryPowerW).catch(() => {});
      }
      if (client.solarPowerW != null) {
        await this.setCapabilityValue('solar_power', client.solarPowerW).catch(() => {});
      }

      if (client.meterLinkStatus != null) {
        const next = client.meterLinkStatus;
        const prev = this._lastMeterLinkStatus;
        await this.setCapabilityValue('meter_link_status', next).catch(() => {});
        if (prev !== undefined && prev !== next) {
          this.driver.triggerMeterLinkStatusChanged(this, next);
        }
        this._lastMeterLinkStatus = next;
      }

      await this.setCapabilityValue('status_eib', client.eibStatusDisplay).catch(() => {});

      await this.setAvailable().catch(() => {});
      if (!this._lastPollOk) {
        this.driver.triggerConnectionRestored(this);
      }
      this._lastPollOk = true;
    } catch (err) {
      const msg = err.message || String(err);
      this.error(msg);
      await this.setUnavailable(msg).catch(() => {});
      if (this._lastPollOk) {
        this.driver.triggerConnectionLost(this, msg);
      }
      this._lastPollOk = false;
    }
  }
}

module.exports = SiteDevice;
