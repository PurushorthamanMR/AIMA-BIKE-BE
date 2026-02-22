# Models Folder – Table Data (Database Schema)

Sequelize models in `models/` and their corresponding database tables. All tables use `timestamps: false`.

---

## 1. User (`user`)

| Column        | Type    | Null | Default | Notes              |
|---------------|---------|------|---------|--------------------|
| id            | INTEGER | No   | —       | PK, autoIncrement  |
| firstName     | STRING  | No   | —       |                    |
| lastName      | STRING  | No   | —       |                    |
| password      | STRING  | No   | —       |                    |
| address       | STRING  | Yes  | —       |                    |
| emailAddress  | STRING  | No   | —       | unique             |
| mobileNumber  | STRING  | Yes  | —       |                    |
| createdDate   | DATE    | Yes  | NOW     |                    |
| modifiedDate  | DATE    | Yes  | —       |                    |
| isActive      | BOOLEAN | Yes  | true    |                    |
| userRoleId    | INTEGER | No   | —       | FK → userRole.id  |

**Model file:** `models/User.js`

---

## 2. UserRole (`userRole`)

| Column   | Type    | Null | Default | Notes             |
|----------|---------|------|---------|-------------------|
| id       | INTEGER | No   | —       | PK, autoIncrement |
| userRole | STRING  | No   | —       |                   |
| isActive | BOOLEAN | Yes  | true    |                   |

**Model file:** `models/UserRole.js`

---

## 3. UserLogs (`userLogs`)

| Column   | Type    | Null | Default | Notes             |
|----------|---------|------|---------|-------------------|
| id       | INTEGER | No   | —       | PK, autoIncrement |
| action   | STRING  | Yes  | —       |                   |
| timestamp| DATE    | Yes  | NOW     |                   |
| userId   | INTEGER | No   | —       | FK → user.id      |

**Model file:** `models/UserLogs.js`

---

## 4. Category (`category`)

| Column   | Type    | Null | Default | Notes             |
|----------|---------|------|---------|-------------------|
| id       | INTEGER | No   | —       | PK, autoIncrement |
| name     | STRING  | No   | —       |                   |
| isActive | BOOLEAN | Yes  | true    |                   |

**Model file:** `models/Category.js`

---

## 5. Model (`model`)

| Column     | Type    | Null | Default | Notes              |
|------------|---------|------|---------|--------------------|
| id         | INTEGER | No   | —       | PK, autoIncrement  |
| categoryId | INTEGER | No   | —       | FK → category.id   |
| name       | STRING  | No   | —       |                    |
| imageUrl   | STRING  | Yes  | —       |                    |
| isActive   | BOOLEAN | Yes  | true    |                    |

**Model file:** `models/Model.js`

---

## 6. Stock (`stock`)

| Column        | Type    | Null | Default | Notes             |
|---------------|---------|------|---------|-------------------|
| id            | INTEGER | No   | —       | PK, autoIncrement |
| modelId       | INTEGER | No   | —       | FK → model.id     |
| name          | STRING  | No   | —       |                   |
| color         | STRING  | No   | —       |                   |
| sellingAmount | DOUBLE  | Yes  | —       |                   |
| quantity      | INTEGER | Yes  | —       |                   |
| imageUrl      | STRING  | Yes  | —       |                   |
| isActive      | BOOLEAN | Yes  | true    |                   |

**Model file:** `models/Stock.js`

---

## 7. Payment (`payment`)

| Column   | Type    | Null | Default | Notes             |
|----------|---------|------|---------|-------------------|
| id       | INTEGER | No   | —       | PK, autoIncrement |
| name     | STRING  | Yes  | —       |                   |
| isActive | BOOLEAN | Yes  | true    |                   |

**Model file:** `models/Payment.js`

---

## 8. Cash (`cash`)

| Column        | Type    | Null | Default | Notes             |
|---------------|---------|------|---------|-------------------|
| id            | INTEGER | No   | —       | PK, autoIncrement |
| customerId    | INTEGER | No   | —       | ref → customer.id |
| copyOfNic     | STRING  | Yes  | —       |                   |
| photographOne | STRING  | Yes  | —       |                   |
| photographTwo | STRING  | Yes  | —       |                   |
| paymentReceipt| STRING  | Yes  | —       |                   |
| mta2          | STRING  | Yes  | —       |                   |
| slip          | STRING  | Yes  | —       |                   |
| chequeNumber  | INTEGER | Yes  | —       | allowNull: true   |
| isActive      | BOOLEAN | Yes  | true    |                   |

**Model file:** `models/Cash.js`

---

## 9. Lease (`lease`)

| Column              | Type    | Null | Default | Notes             |
|---------------------|---------|------|---------|-------------------|
| id                  | INTEGER | No   | —       | PK, autoIncrement |
| customerId          | INTEGER | No   | —       | ref → customer.id |
| companyName         | STRING  | Yes  | —       |                   |
| purchaseOrderNumber | INTEGER | Yes  | —       |                   |
| copyOfNic           | STRING  | Yes  | —       |                   |
| photographOne       | STRING  | Yes  | —       |                   |
| photographTwo       | STRING  | Yes  | —       |                   |
| paymentReceipt      | STRING  | Yes  | —       |                   |
| mta2                | STRING  | Yes  | —       |                   |
| mta3                | STRING  | Yes  | —       |                   |
| chequeNumber        | INTEGER | Yes  | —       | allowNull: true   |
| isActive            | BOOLEAN | Yes  | true    |                   |

**Model file:** `models/Lease.js`

---

## 10. Customer (`customer`)

| Column                | Type     | Null | Default | Notes              |
|-----------------------|----------|------|---------|--------------------|
| id                    | INTEGER  | No   | —       | PK, autoIncrement  |
| name                  | STRING   | No   | —       |                    |
| address               | STRING   | No   | —       |                    |
| province              | STRING   | No   | —       |                    |
| district              | STRING   | No   | —       |                    |
| occupation            | STRING   | No   | —       |                    |
| dateOfBirth           | DATEONLY | Yes  | —       |                    |
| religion              | STRING   | No   | —       |                    |
| contactNumber         | INTEGER  | Yes  | —       |                    |
| whatsappNumber        | INTEGER  | Yes  | —       |                    |
| nic                   | STRING   | No   | —       |                    |
| modelId               | INTEGER  | No   | —       | FK → model.id      |
| chassisNumber         | STRING   | No   | —       |                    |
| motorNumber           | STRING   | No   | —       |                    |
| colorOfVehicle        | STRING   | No   | —       |                    |
| dateOfPurchase        | DATEONLY | Yes  | —       |                    |
| loyalityCardNo        | INTEGER  | Yes  | —       |                    |
| dateOfDelivery        | DATEONLY | Yes  | —       |                    |
| sellingAmount         | DOUBLE   | Yes  | —       |                    |
| registrationFees      | DOUBLE   | Yes  | —       |                    |
| advancePaymentAmount  | DOUBLE   | Yes  | —       |                    |
| advancePaymentDate    | DATEONLY | Yes  | —       |                    |
| balancePaymentAmount  | DOUBLE   | Yes  | —       |                    |
| balancePaymentDate    | DATEONLY | Yes  | —       |                    |
| paymentId             | INTEGER  | No   | —       | FK → payment.id    |
| isActive              | BOOLEAN  | Yes  | true    |                    |

**Model file:** `models/Customer.js`

---

## Associations (from `models/index.js`)

| From     | To       | Relationship   | Foreign Key  |
|----------|----------|----------------|--------------|
| UserRole | User     | hasMany        | userRoleId   |
| User     | UserRole | belongsTo      | userRoleId   |
| User     | UserLogs | hasMany (implied by UserLogs.userId) | — |
| UserLogs | User     | belongsTo      | userId       |
| Category | Model    | hasMany        | categoryId   |
| Model    | Category | belongsTo      | categoryId   |
| Model    | Stock    | hasMany        | modelId      |
| Stock    | Model    | belongsTo      | modelId      |
| Model    | Customer | hasMany        | modelId      |
| Customer | Model    | belongsTo      | modelId      |
| Payment  | Customer | hasMany        | paymentId    |
| Customer | Payment  | belongsTo      | paymentId    |

**Note:** `Cash` and `Lease` reference `customerId` by value only; no Customer association is defined in `models/index.js`.
