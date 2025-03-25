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

## Access the Docs Page

Open the following URL to view API documentation:

```
http://localhost:3000/docs
```

## Reference Links

- [Auth0 Docs: Backend Libraries](https://auth0.com/docs/libraries)
- [Auth0 Docs: Authenticate with Private Key JWT](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authenticate-with-private-key-jwt)

