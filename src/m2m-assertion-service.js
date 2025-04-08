'use strict';

const jwt = require('jsonwebtoken');
const querystring = require('querystring');
const axios = require('axios');
const uuid = require('uuid');

const OAUTH = {
  GRANT_TYPE: 'client_credentials',
  ASSERTION_TYPE: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
};

const createClientAssertionJwt = ({ clientId, kid, assertionAudience, privateKey }) => {
  return jwt.sign(
    {
      iss: clientId,
      sub: clientId,
      aud: assertionAudience,
      iat: Math.floor(Date.now() / 1000),
      jti: uuid.v4()
    },
    privateKey,
    {
      algorithm: 'RS256',
      expiresIn: '5m',
      header: { kid }
    }
  );
};

const getKey = (client) => {
  return (header, callback) => {
    console.log(header);
    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        return callback(err);
      }
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    });
  };
};

const verifyAccessToken = ({ clientId, audience, issuer, client }, token) => {
  return new Promise((resolve, reject) => {
    const opts = {
      algorithms: ['RS256'],
      audience,
      issuer
    };

    jwt.verify(token, getKey(client), opts, (err, decoded) => {
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

const requestAccessTokenWithAssertion = async ({ audience, tokenUrl }, jwtAssertion) => {
  const CUSTOM_CLAIM_NAME = 'https://api.chektdev.com/claims/partner';

  const custom_claims = {
    dealer_id: '1234567890',
    site_id: '1234567890'
  };

  const body = {
    grant_type: OAUTH.GRANT_TYPE,
    client_assertion_type: OAUTH.ASSERTION_TYPE,
    client_assertion: jwtAssertion,
    audience
  };

  body[CUSTOM_CLAIM_NAME] = JSON.stringify(custom_claims);

  const query = querystring.stringify(body);

  console.log('requestAccessTokenWithAssertion', query);

  const opts = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
  const response = await axios.post(tokenUrl, query, opts);
  return response.data;
}

module.exports = {
  createClientAssertionJwt,
  requestAccessTokenWithAssertion,
  verifyAccessToken
};
