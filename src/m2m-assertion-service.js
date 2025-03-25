'use strict';

const jwt = require('jsonwebtoken');
const querystring = require('querystring');
const axios = require('axios');
const uuid = require('uuid');

const OAUTH = {
  GRANT_TYPE: 'client_credentials',
  ASSERTION_TYPE: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
};

const createClientAssertionJwt = ({ clientId, kid, domain, privateKey }) => {
  return jwt.sign(
    {
      iss: clientId,
      sub: clientId,
      aud: `https://${domain}/`,
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
    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        return callback(err);
      }
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    });
  };
};

const verifyAccessToken = ({ clientId, audience, domain, client }, token) => {
  return new Promise((resolve, reject) => {
    const opts = {
      algorithms: ['RS256'],
      audience,
      issuer: `https://${domain}/`,
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

const requestAccessTokenWithAssertion = async ({ domain, audience }, jwtAssertion) => {
  const url = `https://${domain}/oauth/token`;
  const query = querystring.stringify({
    grant_type: OAUTH.GRANT_TYPE,
    client_assertion_type: OAUTH.ASSERTION_TYPE,
    client_assertion: jwtAssertion,
    audience
  });
  const opts = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };

  const response = await axios.post(url, query, opts);
  return response.data;
}

module.exports = {
  createClientAssertionJwt,
  requestAccessTokenWithAssertion,
  verifyAccessToken
};
