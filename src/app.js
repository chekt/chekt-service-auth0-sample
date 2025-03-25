require('dotenv').config();
const express = require('express');
require('express-async-errors');
const path = require('path');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/api.json');
const cors = require('cors');
const config = require('./config');
const parseError = require('./parse-error');
const authCodeService = require('./auth-code-service');
const m2mAssertionService = require('./m2m-assertion-service');

const authCodeConfig = config.getAuthCodeConfig();
const m2mConfig = config.getM2MConfig();
const port = 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, '../public')));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/', (req, res) => { res.send('ok'); });

app.get('/login', (req, res) => {
  // #swagger.description = 'This endpoint redirects to Auth0\'s login page. Do not call from Swagger UI.'
  res.redirect(authCodeService.buildAuthorizationUrl(authCodeConfig));
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    throw new Error('400|Authorization code not found.');
  }

  const tokenInfo = await authCodeService.requestAccessToken(authCodeConfig, code);
  res.json(tokenInfo);
});

app.get('/refresh', async (req, res) => {
  if (!authCodeConfig.getRefreshToken()) {
    throw new Error('400|No refresh token available.');
  }

  const tokenInfo = await authCodeService.refreshAccessToken(authCodeConfig);
  res.json(tokenInfo);
});

app.get('/logout', (req, res) => {
  res.redirect(authCodeService.buildLogoutUrl(authCodeConfig));
});

app.get('/revoke', async (req, res) => {
  if (!authCodeConfig.getRefreshToken()) {
    throw new Error('400|No refresh token available.');
  }

  await authCodeService.revokeRefreshToken(authCodeConfig);
  res.json({ message: 'Revoke refresh token successfully!' });
});

app.get('/verify', async (req, res) => {
  const { access_token } = req.query;
  if (!access_token) {
    throw new Error('400|No access token available.');
  }

  const tokenInfo = await authCodeService.verifyAccessToken(authCodeConfig, access_token);
  res.json(tokenInfo);
});

app.get('/m2m/access-token', async (req, res) => {
  const assertionJwt = await m2mAssertionService.createClientAssertionJwt(m2mConfig);
  const tokenInfo = await m2mAssertionService.requestAccessTokenWithAssertion(m2mConfig, assertionJwt);
  res.json(tokenInfo);
});

app.get('/m2m/verify', async (req, res) => {
  const { access_token } = req.query;
  if (!access_token) {
    throw new Error('400|No access token available.');
  }

  const tokenInfo = await m2mAssertionService.verifyAccessToken(m2mConfig, access_token);
  res.json(tokenInfo);
});

app.use((err, req, res, next) => {
  const { code, message } = parseError(err.message);
  res.status(code).json({ message });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
