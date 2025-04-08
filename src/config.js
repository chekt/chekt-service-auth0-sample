'use strict';

const fs = require('fs');
const jwksClient = require('jwks-rsa');
const appRoot = require('app-root-path');

const getM2MConfig = (keyPath) => {
  return {
    domain: process.env.M2M_AUTH0_DOMAIN,
    clientId: process.env.M2M_CLIENT_ID,
    audience: process.env.M2M_AUDIENCE,
    kid: process.env.M2M_KID,
    tokenUrl: `https://${process.env.M2M_AUTH0_DOMAIN}/oauth/token`,
    assertionAudience: `https://${process.env.M2M_AUTH0_DOMAIN}/`,
    privateKey: fs.readFileSync(keyPath || appRoot + '/scripts/private.key'),
    client: jwksClient({
      jwksUri: `https://${process.env.M2M_AUTH0_DOMAIN}/.well-known/jwks.json`
    })
  };
};

const getAuthCodeConfig = () => {
  return {
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
    audience: process.env.AUTH0_AUDIENCE,
    client: jwksClient({
      jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    storeRefreshToken: (token) => {
      this.storedRefreshToken = token;
    },
    getRefreshToken: () => {
      return this.storedRefreshToken;
    }
  };
};

module.exports = {
  getAuthCodeConfig,
  getM2MConfig
};
