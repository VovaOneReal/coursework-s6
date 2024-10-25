## Модуль User

### `GET` /user? ulogin & rlogin

Получить информацию о профиле пользователя

#### Query

- `ulogin`: str(32) - логин пользователя, по которому нужна информация
- `rlogin`: str(32) - логин пользователя, который запрашивает информацию

#### Response

##### 200

Успешное получение данных. Набор данных зависит от роли пользователя rlogin:

- владелец аккаунта получит всю информацию о себе
- сторонний user получит информацию только публичные рецепты и коллекции
- editor увидит публичные рецепты и коллекции, а также рецепты требующие модерации
- admin увидит всю информацию о пользователе

```json
{
    login: str(32),
    collections?: [
        {
            [prefix: collection_]
            id: int,
            name: str(80),
            creation_date: str,
            status: str
        }
    ],
    diets?: [
        {
            [prefix: diet_]
            id: int,
            name: str(80),
            creation_date: str,
            date: str // дата, на которую запланирован рацион
        }
    ],
    recipes?: [
        {
            [prefix: recipe_]
            id: int,
            editor_login?: str(32),
            name: str(120),
            description?: str,
            category: str(32),
            creation_date: str,
            moderation_date?: str,
            status: str // статус публикации
        }
    ]
}
```

### `DELETE` /user? ulogin & rlogin

Удалить профиль пользователя. Удалить профиль может только пользователь с ролью admin.

#### Query

- `ulogin`: str(32) - логин пользователя, профиль которого нужно удалить
- `rlogin`: str(32) - логин пользователя (или администратора), который удаляет профиль

### `GET` /user/role? ulogin

Запрос роли пользователя

#### Query

- `ulogin`: str(32) - логин пользователя, по которому нужна информация

#### Response

##### 200

Описание ответа. Возможные значения:

- user
- editor
- admin

```json
{
    role: str(24),
}
```

### `PATCH` /user/role? ulogin & rlogin & role

Изменение роли пользователя

#### Query

- `ulogin`: str(32) - логин пользователя, по которому нужна информация
- `rlogin`: str(32) - логин пользователя, который запрашивает информацию
- `role`: str(24) - роль, на которую нужно изменить

### `GET` /users? rlogin

Получить список пользователей

#### Query

- `rlogin`: str(32) - логин пользователя, который запрашивает информацию

#### Response

##### 200

Успешное получение данных.

Доступ к запросу имеет только admin.

```json
{
    login: str(32),
    registration_date: str,
    role: str,
    recipes_amount: int,
    collections_amount: int,
    diets_amount: int
}
```
