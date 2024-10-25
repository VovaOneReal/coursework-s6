## Модуль Ingredient

### **GET** /ingredient

Получить информацию о всех ингредиентах.

#### Response

##### 200

Успешное получение информации

```json
[
    {
        [prefix: ingredient_]
        name: str(255),
        fats: float,
        proteins: float,
        carbo: float,
        calories: int
    }
]
```

### **POST** /ingredient ? rlogin

Добавить ингредиент в систему

#### Query

- `rlogin`: str(32) - логин администратора, который добавляет ингредиент

#### Body

```json
{
    name: str(255),
    fats: float,
    proteins: float,
    carbo: float,
    calories: int
}
```

### **PATCH** /ingredient ? iname & rlogin

Изменить информацию об ингредиенте.

#### Query

- `iname`: str(255) - название ингредиента
- `rlogin`: str(32) - логин администратора, который изменяет информацию

#### Body

```json
{
    name: str(255),
    fats: float,
    proteins: float,
    carbo: float,
    calories: int
}
```

### **DELETE** /ingredient ? iname & rlogin

Удалить ингредиент.

#### Query

- `iname`: str(255) - название ингредиента
- `rlogin`: str(32) - логин администратора, который удаляет план
