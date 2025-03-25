'use strict';

const axios = require('axios');
const querystring = require('querystring');
const jwt = require('jsonwebtoken');

const FORM_HEADER = { 'Content-Type': 'application/x-www-form-urlencoded' };

const buildAuthorizationUrl = (config) => {
  const scope = [
    'openid',
    'profile',
    'email',
    'offline_access',
    'read:dealer',
    'update:dealer',
    'create:sites',
    'read:sites',
    'update:sites',
    'delete:sites',
    'create:devices',
    'read:devices',
    'update:devices',
    'delete:devices'
  ].join(' ');

  const query = querystring.stringify({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope,
    audience: config.audience
  });

  return `https://${config.domain}/authorize?${query}`;
};

const requestAccessToken = async (config, code) => {
  const {
    domain,
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: redirect_uri
  } = config;

  const url = `https://${domain}/oauth/token`;
  const query = querystring.stringify({
    grant_type: 'authorization_code',
    client_id,
    client_secret,
    code,
    redirect_uri
  });
  const opts = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }

  const tokenResponse = await axios.post(url, query, opts);
  if (tokenResponse?.data?.refresh_token) {
    config.storeRefreshToken(tokenResponse.data.refresh_token);
  }

  return tokenResponse.data;
};

const refreshAccessToken = async (config) => {
  const {
    domain,
    clientId: client_id,
    clientSecret: client_secret
  } = config;

  const refresh_token = config.getRefreshToken();
  const url = `https://${domain}/oauth/token`;
  const query = querystring.stringify({
    grant_type: 'refresh_token',
    client_id,
    client_secret,
    refresh_token
  });
  const opts = { headers: FORM_HEADER };

  const refreshResponse = await axios.post(url, query, opts);
  if (refreshResponse?.data?.refresh_token) {
    config.storeRefreshToken(refreshResponse.data.refresh_token);
  }
  return refreshResponse.data;
};

const buildLogoutUrl = (config, returnTo='http://localhost:3000') => {
  const { domain, clientId } = config;
  config.storeRefreshToken(null);
  return `https://${domain}/v2/logout?client_id=${clientId}&returnTo=${returnTo}`;
};

const revokeRefreshToken = async (config) => {
  const {
    domain,
    clientId: client_id,
    clientSecret: client_secret
  } = config;

  const token = config.getRefreshToken();

  const url = `https://${domain}/oauth/revoke`;
  const query = querystring.stringify({
    client_id,
    client_secret,
    token
  });
  const opts = { headers: FORM_HEADER };

  await axios.post(url, query, opts);
  config.storeRefreshToken(null);
};

const getKey = (client) => {
  return (header, callback) => {
    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        return callback(err);
      }
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    });
  };
};

const verifyAccessToken = ({ audience, domain, clientId, client }, token) => {
  return new Promise((resolve, reject) => {
    const opts = {
      algorithms: ['RS256'],
      audience,
      issuer: `https://${domain}/`,
    };

    jwt.verify(token, getKey(client), opts, (err, decoded) => {
      console.log(err);
      if (err) {
        return reject(err);
      }
      if (decoded.azp !== clientId) {
        return reject(new Error('Unauthorized Client'));
      }
      resolve(decoded);
    });
  });
};

module.exports = {
  buildAuthorizationUrl,
  buildLogoutUrl,
  requestAccessToken,
  refreshAccessToken,
  revokeRefreshToken,
  verifyAccessToken
};
