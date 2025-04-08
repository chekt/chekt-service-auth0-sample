# Auth0 Login Sample Project

This project demonstrates how to implement login functionality using **Auth0**.  
It includes frontend-only authentication, backend authentication, and M2M (Machine-to-Machine) token testing.

---

## Installation Guide

### 1. Install nvm

Follow the [nvm installation guide](https://github.com/nvm-sh/nvm) to install **nvm (Node Version Manager)**.

### 2. Install Node.js v22

```bash
nvm install v22
```

### 3. Install dependencies

```bash
npm install
```

## Run the Web Server

Start the development server:

```bash
npm start
```

Once running, open your browser and navigate to:

```
http://localhost:3000
```

## Authentication and Authorization

### 1. Frontend-only Authentication

1. Open the following URL in your browser:

```
http://localhost:3000
```
2. Click the **Sign In** button  
3. Complete the login process via Auth0

### 2. Backend Authentication

1. Open the following URL in your browser:

```
http://localhost:3000/login
```

2. Complete the login process via Auth0

## M2M (Machine-to-Machine) Assertion Test

### 1. Generate RSA Keys

Generate RSA 2048-bit asymmetric keys for M2M authentication:

```bash
scripts/key.sh
```

After generating the keys, restart the web server to apply the changes.

### 2. Test via CLI

Run the following script:

```bash
node src/m2m.js
```

### 3. Test via Web

Open the following URL in your browser:

```
http://localhost:3000/m2m/access-token
```

## How to Add a Custom Claim

### Available Custom Claim Name
  `https://api.chektdev.com/claims/partner`

### Supported Value Types  
  - `number`  
  - `string`  
  - `object` (must be converted to a JSON string when assigning)

### Why convert object to a string?
  When the request uses `Content-Type: application/x-www-form-urlencoded`, all data must be encoded as key-value pairs.  
  This format does not support nested objects directly, so `object` values must be converted to a string using `JSON.stringify()`.

### Important Note  
  When an `object` is added as a string (via `JSON.stringify`), it will be automatically parsed back into an object in the final Access Token.

---

## Example Code

```javascript
const CUSTOM_CLAIM_NAME = 'https://api.chektdev.com/claims/partner';

const custom_claims = {
  dealer_id: '1234567890',
  site_id: '1234567890'
};

// Basic request body
const body = {
  grant_type: 'client_credentials',
  client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
  client_assertion: 'jwt-assert-token',
  audience: 'https://adc-m2m.chektdev.com/'
};

// Add the custom claim as a JSON string
body[CUSTOM_CLAIM_NAME] = JSON.stringify(custom_claims);

// ...
// Response example
{
  'https://api.chektdev.com/claims/partner': { dealer_id: '1234567890', site_id: '1234567890' },
  iss: 'https://chektdev-m2m.us.auth0.com/',
  sub: 'jHEsEhX2b46RyAChhh4s2PgHahWOB67G@clients',
  aud: 'https://adc-m2m.chektdev.com/',
  iat: 1744173568,
  exp: 1744259968,
  scope: 'read:dealer update:dealer create:sites read:sites update:sites delete:sites read:site_contacts create:site_contacts update:site_contacts delete:site_contacts create:devices read:devices update:devices delete:devices create:monitoring_stations read:monitoring_stations update:monitoring_stations delete:monitoring_stations',
  gty: 'client-credentials',
  azp: 'jHEsEhX2b46RyAChhh4s2PgHahWOB67G'
}
```

## Access the Docs Page

Open the following URL to view API documentation:

```
http://localhost:3000/docs
```

## Reference Links

- [Auth0 Docs: Backend Libraries](https://auth0.com/docs/libraries)
- [Auth0 Docs: Authenticate with Private Key JWT](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authenticate-with-private-key-jwt)

