# Документация к API проекта

Для сокращения длины документации, были опущены коды типичных ошибок. Везде, где они явно не указаны, стоит подразумевать:

| **Код** | **Описание**                                           |
| ------- | ------------------------------------------------------ | --- |
| `200`   | Успешное выполнение запроса                            |
| `400`   | Неверно составлен запрос. Подробности в поле `message` |
| `403`   | Доступ запрещён                                        |
| `404`   | Не существует запрашиваемой сущности или запроса       |     |

## ШАБЛОН Название модуля

### `GET POST DELETE PATCH` /endpoint? query1 & query2

Описание запроса

#### Query

- `query1`: type - description
- `query2`: type - description

#### Response

##### 200 400 403 404

Описание ответа

```json
{
    key: type,
}
```
