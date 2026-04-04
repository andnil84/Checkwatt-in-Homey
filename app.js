'use strict';

const Homey = require('homey');

class CheckwattApp extends Homey.App {
  async onInit() {
    this.log('Checkwatt - Unofficial (EnergyInBalance) started');
  }
}

module.exports = CheckwattApp;
