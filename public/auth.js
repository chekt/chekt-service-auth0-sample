const AUTH0_CALLBACK_URL = 'http://localhost:3000';
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

const authorizationParams = {
  redirect_uri: AUTH0_CALLBACK_URL,
  // prompt: 'consent', // 'consent' | 'login' | 'none' | 'select_account'
  audience: window.AUTH0_AUDIENCE,
  scope
};

const auth0Client = new auth0.Auth0Client({
  domain:  window.AUTH0_DOMAIN,
  clientId: window.AUTH0_CLIENT_ID,
  useRefreshTokens: true,
  // cacheLocation: 'localstorage',
  authorizationParams
});

async function updateUI() {
  const isAuthenticated = await auth0Client.isAuthenticated();
  const logInButton = document.getElementById('loginBtn');
  const logOuteButton = document.getElementById('logoutBtn');

  if (isAuthenticated) {
    logInButton.style.display = 'none';
    logOuteButton.style.display = 'block';
  } else {
    logInButton.style.display = 'block';
    logOuteButton.style.display = 'none';
  }
}

document.getElementById('loginBtn').addEventListener('click', async (e) => {
  // e.preventDefault();
  await auth0Client.loginWithRedirect();
  // await auth0Client.loginWithPopup();
});

document.getElementById('refreshBtn').addEventListener('click', async () => {
  const accessToken = await auth0Client.getTokenSilently({
    authorizationParams,
    cacheMode: 'off'
  });
  console.log('Access token', accessToken);
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await auth0Client.logout({
    returnTo: AUTH0_CALLBACK_URL
  });
});

window.addEventListener('load', async () => {
  try {
    const appState = await auth0Client.handleRedirectCallback();
    if (!appState) {
      return;
    }
    console.log('AppState Info', appState);

    const accessToken = await auth0Client.getTokenSilently({ authorizationParams });
    console.log('Access token', accessToken);

    const user = await auth0Client.getUser();
    console.log("User info:", user);

    updateUI();
  } catch (err) {
    console.log('ERROR: ' + err.message);
  }
});

updateUI();
