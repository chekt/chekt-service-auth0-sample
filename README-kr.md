# Auth0 로그인 샘플 프로젝트

이 프로젝트는 **Auth0**를 사용한 로그인 기능 구현을 시연합니다.  
프론트엔드 전용 인증, 백엔드 인증, 그리고 M2M (Machine-to-Machine) 토큰 테스트를 포함하고 있습니다.

---

## 설치 가이드

### 1. nvm 설치

[nvm 설치 가이드](https://github.com/nvm-sh/nvm)를 참고하여 **nvm (Node Version Manager)**을 설치합니다.

### 2. Node.js v22 설치

```bash
nvm install v22
```

### 3. 의존성 설치

```bash
npm install
```

## 웹 서버 실행

```bash
npm start
```

서버 실행 후, 브라우저에서 다음 주소로 접속합니다:

```
http://localhost:3000
```

## 인증 및 인가

### 1. FE 인증

1. 브라우저에서 다음 주소로 접속합니다:

```
http://localhost:3000
```
2. Sign In 버튼 클릭
3. Auth0를 통해 로그인 진행

### 2. BE 인증

1. 브라우저에서 다음 주소로 접속합니다:

```
http://localhost:3000/login
```

2. Auth0를 통해 로그인 진행

## M2M (Machine-to-Machine) Assertion 테스트

### 1. RSA 키 생성

M2M 인증을 위한 RSA 2048 비대칭 키를 생성합니다:

```bash
scripts/key.sh
```

변경을 적용하기 위해 웹서버를 다시 시작해야 합니다.

### 2. CLI 테스트

```bash
node src/m2m.js
```

### 3. 웹에서 테스트

```
http://localhost:3000/m2m/access-token

```

## 커스텀 클레임(Custom Claim) 추가 방법

- **사용 가능한 커스텀 클레임 이름**:  
  `https://api.chektdev.com/claims/partner`

- **지원되는 값 타입**:  
  - `number`  
  - `string`  
  - `object` (※ 값을 추가할 때는 반드시 JSON 문자열로 변환해야 함)

- **왜 object를 문자열로 변환해야 하나요?**  
  요청의 `Content-Type`이 `'application/x-www-form-urlencoded'`인 경우, 모든 데이터는 키-값 쌍으로 인코딩되어야 합니다.  
  따라서 `object` 타입은 직접 전송할 수 없고, `JSON.stringify()`를 사용하여 문자열로 변환해야 합니다.  

- **주의사항**:  
  `object` 타입을 문자열(JSON string)로 추가하더라도, 최종적으로 발급된 Access Token에서는 해당 값이 다시 객체(Object)로 처리됩니다.

---

## 예시 코드

```javascript
const CUSTOM_CLAIM_NAME = 'https://api.chektdev.com/claims/partner';

const custom_claims = {
  dealer_id: '1234567890',
  site_id: '1234567890'
};

// 기본 요청 바디
const body = {
  grant_type: 'client_credentials',
  client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
  client_assertion: 'jwt-assert-token',
  audience: 'https://adc-m2m.chektdev.com/'
};

// 커스텀 클레임을 JSON 문자열로 변환하여 추가
body[CUSTOM_CLAIM_NAME] = JSON.stringify(custom_claims);

// ...
// 응답 예
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

## 문서 페이지

```
http://localhost:3000/docs
```

## 참고 링크

- [Auth0 Docs: Backend Libraries](https://auth0.com/docs/libraries)
- [Auth0 Docs: Authenticate with Private Key JWT](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authenticate-with-private-key-jwt)

