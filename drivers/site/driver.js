'use strict';

const Homey = require('homey');
const CheckwattClient = require('../../lib/CheckwattClient');

class SiteDriver extends Homey.Driver {
  async onInit() {
    this.homey.flow
      .getConditionCard('net_income_daily_above')
      .registerRunListener(async (args) => {
        const device = args.device;
        const threshold = Number(args.sek);
        const val = await device.getCapabilityValue('net_income_daily');
        return val != null && !Number.isNaN(threshold) && Number(val) > threshold;
      });

    this.homey.flow
      .getConditionCard('net_income_daily_below')
      .registerRunListener(async (args) => {
        const device = args.device;
        const threshold = Number(args.sek);
        const val = await device.getCapabilityValue('net_income_daily');
        return val != null && !Number.isNaN(threshold) && Number(val) < threshold;
      });

    this.homey.flow
      .getConditionCard('battery_below')
      .registerRunListener(async (args) => {
        const device = args.device;
        const val = await device.getCapabilityValue('measure_battery');
        const thresholdPct = typeof args.pct === 'number' ? args.pct * 100 : null;
        return val != null && thresholdPct != null && Number(val) < thresholdPct;
      });

    this.homey.flow
      .getConditionCard('battery_above')
      .registerRunListener(async (args) => {
        const device = args.device;
        const val = await device.getCapabilityValue('measure_battery');
        const thresholdPct = typeof args.pct === 'number' ? args.pct * 100 : null;
        return val != null && thresholdPct != null && Number(val) > thresholdPct;
      });

    this.homey.flow
      .getActionCard('refresh_now')
      .registerRunListener(async (args) => {
        const device = args.device;
        if (device && typeof device.triggerRefresh === 'function') {
          await device.triggerRefresh();
        }
      });

    this.homey.flow
      .getConditionCard('meter_link_status_is')
      .registerRunListener(async (args) => {
        const device = args.device;
        const val = await device.getCapabilityValue('meter_link_status');
        return val === args.state;
      });

    this.homey.flow
      .getConditionCard('grid_power_above')
      .registerRunListener(async (args) => {
        const device = args.device;
        const threshold = Number(args.w);
        const val = await device.getCapabilityValue('grid_power');
        return val != null && !Number.isNaN(threshold) && Number(val) > threshold;
      });

    this.homey.flow
      .getConditionCard('grid_power_below')
      .registerRunListener(async (args) => {
        const device = args.device;
        const threshold = Number(args.w);
        const val = await device.getCapabilityValue('grid_power');
        return val != null && !Number.isNaN(threshold) && Number(val) < threshold;
      });
  }

  /**
   * @param {Homey.Device} device
   * @param {string} errorText
   */
  triggerConnectionLost(device, errorText) {
    try {
      return this.homey.flow
        .getDeviceTriggerCard('eib_connection_lost')
        .trigger(device, { error: String(errorText || '') }, {});
    } catch (e) {
      this.error(e);
    }
  }

  /**
   * @param {Homey.Device} device
   */
  triggerConnectionRestored(device) {
    try {
      return this.homey.flow
        .getDeviceTriggerCard('eib_connection_restored')
        .trigger(device, {}, {});
    } catch (e) {
      this.error(e);
    }
  }

  /**
   * @param {Homey.Device} device
   * @param {string} status
   */
  triggerMeterLinkStatusChanged(device, status) {
    try {
      return this.homey.flow
        .getDeviceTriggerCard('meter_link_status_changed')
        .trigger(device, { meter_link_status: String(status || '') }, {});
    } catch (e) {
      this.error(e);
    }
  }

  async onPair(session) {
    let username = '';
    let password = '';

    session.setHandler('login', async (data) => {
      username = String(data.username || '').trim();
      password = String(data.password || '');
      if (!username || !password) {
        return false;
      }

      const client = new CheckwattClient();
      await client.login(username, password);
      await client.getCustomerDetails();
      return true;
    });

    session.setHandler('list_devices', async () => {
      const client = new CheckwattClient();
      await client.login(username, password);
      await client.getCustomerDetails();

      const id = client.customerDetails && client.customerDetails.Id
        ? String(client.customerDetails.Id)
        : username;

      return [
        {
          name: client.displayName || 'CheckWatt',
          data: {
            id,
          },
          settings: {
            username,
            password,
          },
        },
      ];
    });
  }
}

module.exports = SiteDriver;
