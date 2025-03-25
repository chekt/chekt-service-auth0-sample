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

## 문서 페이지

```
http://localhost:3000/docs
```

## 참고 링크

- [Auth0 Docs: Backend Libraries](https://auth0.com/docs/libraries)
- [Auth0 Docs: Authenticate with Private Key JWT](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authenticate-with-private-key-jwt)

