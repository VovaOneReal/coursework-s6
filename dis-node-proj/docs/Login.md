## Модуль Login

### **POST** /login

Войти в систему

#### Body

```json
{
    login: str(32)
    password: str // предоставляется в захешированном MD5 виде.
}
```

#### Response

##### 200

Успешный вход

```json
{
    ulogin: str(32)
}
```

##### 403

Неуспешный вход, подробности в message.
