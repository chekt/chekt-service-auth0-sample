#!/usr/bin/env node

const appRoot = require('app-root-path');
require('dotenv').config({ path: appRoot + '/.env' });
const m2mAssertionService = require('./m2m-assertion-service');
const config = require('./config');

(async () => {
  try {
    const m2mConfig = config.getM2MConfig();
    const jwtAssertion = m2mAssertionService.createClientAssertionJwt(m2mConfig);
    const tokenInfo = await m2mAssertionService.requestAccessTokenWithAssertion(m2mConfig, jwtAssertion);
    console.log(tokenInfo);
    const decoded = await m2mAssertionService.verifyAccessToken(m2mConfig, tokenInfo.access_token);
    console.log(decoded);
  } catch (err) {
    console.error('Failed to get access token:', err?.response?.data || err.message);
  }
})();
