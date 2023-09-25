# 2fa-authenticate
2fa 인증을 위해 간단히 외부 프로그램 형태로 생성 및 검증 작업을 할 수 있도록 한다.

## 결과물
윈도우용: 2fa-authenticate-win.exe
리눅스용: 2fa-authencitate-linux

## 사용법 확인
```bash
2fa-authenticate-win --help

2fa-authenticate-win gen --help

2fa-authenticate-win qrcode --help

2fa-authenticate-win verify --help
```

## 사용 예제
secret key 생성
```bash
2fa-authenticate-win.exe gen
```

QR code 생성
```bash
2fa-authenticate-win.exe qrcode [secret key]
```

토큰을 통한 검증(토큰은 authenticater를 통해서 생성된 OTP)
```
2fa-authenticate-win.exe verify 123456 --secret [secret key]
```
