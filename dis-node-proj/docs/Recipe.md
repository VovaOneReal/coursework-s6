## Модуль Recipe

### **POST** /recipe? ulogin

Добавление рецепта в профиль пользователя.

#### Query

- `ulogin`: str(32) - логин пользователя, который добавляет рецепт

#### Body

```json
{
    name: str(120),
    description: str,
    category: str(32),
    ingredients: [
        {
            name: str(255),
            amount: float,
            measurement: str(24)
        }
    ]
}
```

#### Response

##### 200

Успешное создание рецепта

```json
{
    id: int, // id нового рецепта
}
```

### **GET** /recipe? rid & rlogin

Запрос информации по рецепту.

#### Query

- `rid`: int - ID рецепта, по которому нужна информация
- `rlogin`: str(32) - логин пользователя, который запрашивает информацию

#### Response

##### 200

Успешное получение данных

```json
{
    id: int,
    user_login: str(32)
    editor_login?: str(32),
    name: str(120),
    description: str,
    category: str(32),
    creation_date: str,
    moderation_date?: str,
    status: str // статус публикации,
    ingredients: [
        {
            name: str(255),
            amount: float,
            measurement: str(24),
            fats: float,
            proteins: float,
            carbo: float,
            calories: float
        }
    ]
}
```

### **PATCH** /recipe? rid & rlogin

Обновление информации о рецепте.

#### Query

- `rid`: int - ID рецепта, по которому нужна информация
- `rlogin`: str(32) - логин пользователя, пытающегося редактировать

#### Body

```json
{
    name: str(120),
    description: str,
    category: str(32),
    ingredients: [
        {
            name: str(255),
            amount: float,
            measurement: str(24)
        }
    ]
}
```

### **DELETE** /recipe ? rid & rlogin

Удаление рецепта

#### Query

- `rid`: id - ID рецепта
- `rlogin`: str(32) - логин пользователя (редактора или администратора), который удаляет рецепт

### **PATCH** /recipe/moderation ? rid & rlogin

Отправка на модерацию

#### Query

- `rid`: id - ID рецепта
- `rlogin`: str(32) - логин пользователя

### **PATCH** /recipe/moderation/ok ? rid & rlogin

Одобрение модерации рецепта

#### Query

- `rid`: id - ID рецепта
- `rlogin`: str(32) - логин редактора

### **PATCH** /recipe/moderation/decline ? rid & rlogin

Отклонение модерации рецепта

#### Query

- `rid`: id - ID рецепта
- `rlogin`: str(32) - логин редактора или владельца рецепта
