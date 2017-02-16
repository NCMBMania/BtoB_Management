let NCMB = require('ncmb');
const config = require('../config');
let ncmb = new NCMB(config.application_key, config.client_key);
module.exports = ncmb;
