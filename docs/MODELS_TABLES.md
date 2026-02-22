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
| itemCode      | STRING  | Yes  | —       |                   |
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

## 11. DealerConsignmentNote (`dealerConsignmentNote`)

| Column            | Type    | Null | Default | Notes             |
|-------------------|---------|------|---------|-------------------|
| id                | INTEGER | No   | —       | PK, autoIncrement |
| dealerCode        | STRING  | No   | —       |                   |
| dealerName        | STRING  | No   | —       |                   |
| address           | STRING  | Yes  | —       |                   |
| consignmentNoteNo | STRING  | No   | —       |                   |
| date              | DATEONLY| Yes  | —       |                   |
| deliveryMode      | STRING  | Yes  | —       |                   |
| vehicleNo         | STRING  | Yes  | —       |                   |
| references        | STRING  | Yes  | —       |                   |
| contactPerson     | STRING  | Yes  | —       |                   |
| isActive          | BOOLEAN | Yes  | true    |                   |

**Model file:** `models/DealerConsignmentNote.js`

---

## 12. DealerConsignmentNoteItem (`dealerConsignmentNoteItem`)

| Column        | Type    | Null | Default | Notes                          |
|---------------|---------|------|---------|--------------------------------|
| id            | INTEGER | No   | —       | PK, autoIncrement              |
| noteId        | INTEGER | No   | —       | FK → dealerConsignmentNote.id  |
| modelId       | INTEGER | No   | —       | FK → model.id                  |
| itemCode      | STRING  | Yes  | —       |                                |
| chassisNumber | STRING  | Yes  | —       |                                |
| motorNumber   | STRING  | Yes  | —       |                                |
| color         | STRING  | Yes  | —       |                                |
| quantity      | INTEGER | Yes  | 1       |                                |

**Model file:** `models/DealerConsignmentNoteItem.js`

---

## 13. ShopDetail (`shopDetails`)

| Column      | Type    | Null | Default | Notes             |
|-------------|---------|------|---------|-------------------|
| id          | INTEGER | No   | —       | PK, autoIncrement |
| name        | STRING  | No   | —       |                   |
| logo        | STRING  | Yes  | —       |                   |
| address     | STRING  | Yes  | —       |                   |
| phoneNumber | STRING  | Yes  | —       |                   |
| isActive    | BOOLEAN | Yes  | true    |                   |

**Model file:** `models/ShopDetail.js`

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
| DealerConsignmentNote | DealerConsignmentNoteItem | hasMany   | noteId        |
| DealerConsignmentNoteItem | DealerConsignmentNote | belongsTo | noteId        |
| DealerConsignmentNoteItem | Model    | belongsTo      | modelId      |
| Model    | DealerConsignmentNoteItem | hasMany | modelId       |

**Note:** `Cash` and `Lease` reference `customerId` by value only; no Customer association is defined in `models/index.js`.

---

## APIs by resource

### User (`/user`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /user/register | Register user |
| POST | /user/login | Login |
| GET | /user/getAllPage | Get all (paginated) |
| GET | /user/getById | Get by ID |
| GET | /user/getByName | Get by name |
| GET | /user/getByEmailAddress | Get by email |
| GET | /user/getByRole | Get by role |
| POST | /user/update | Update user |
| PUT | /user/updateStatus | Update status |
| PUT | /user/updatePassword | Update password |

### UserRole (`/userRole`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /userRole/save | Save role |
| GET | /userRole/getAll | Get all |

### UserLogs (`/userLogs`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /userLogs/save | Save log |
| GET | /userLogs/getAll | Get all (paginated) |

### Category (`/category`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /category/save | Save category |
| GET | /category/getAllPage | Get all (paginated) |
| GET | /category/getByName | Get by name |
| POST | /category/update | Update category |
| PUT | /category/updateStatus | Update status |

### Model (`/model`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /model/save | Save model |
| GET | /model/getAllPage | Get all (paginated) |
| GET | /model/getByName | Get by name |
| GET | /model/getByCategory | Get by category |
| POST | /model/update | Update model |
| PUT | /model/updateStatus | Update status |

### Stock (`/stock`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /stock/save | Save stock |
| GET | /stock/getAllPage | Get all (paginated) |
| GET | /stock/getByName | Get by name |
| GET | /stock/getByColor | Get by color |
| GET | /stock/getByModel | Get by model |
| POST | /stock/update | Update stock |
| PUT | /stock/updateStatus | Update status |
| PUT | /stock/updateQuantity | Update quantity |

### Payment (`/payment`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /payment/save | Save payment |
| GET | /payment/getByName | Get by name |
| POST | /payment/update | Update payment |
| PUT | /payment/updateStatus | Update status |

### Cash (`/cash`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /cash/save | Save cash |
| GET | /cash/getByCustomer | Get by customer |
| POST | /cash/update | Update cash |
| PUT | /cash/updateStatus | Update status |

### Lease (`/lease`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /lease/save | Save lease |
| GET | /lease/getByCustomer | Get by customer |
| GET | /lease/getByCompany | Get by company |
| POST | /lease/update | Update lease |
| PUT | /lease/updateStatus | Update status |

### Customer (`/customer`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /customer/saveWithPaymentOption | Save with lease/cash |
| GET | /customer/getAllPage | Get all (paginated) |
| GET | /customer/getByName | Get by name |
| GET | /customer/getByColor | Get by color |
| GET | /customer/getByModel | Get by model |
| GET | /customer/getByPayment | Get by payment |
| POST | /customer/update | Update customer |
| PUT | /customer/updateStatus | Update status |

### DealerConsignmentNote (`/dealerConsignmentNote`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /dealerConsignmentNote/save | Save note (header + items) |
| GET | /dealerConsignmentNote/getAllPage | Get all (paginated) |
| GET | /dealerConsignmentNote/getByDealerCode | Get by dealer code |
| GET | /dealerConsignmentNote/getByDealerName | Get by dealer name |
| GET | /dealerConsignmentNote/getByConsignmentNoteNo | Get by consignment note no |
| POST | /dealerConsignmentNote/update | Update note (header + items) |
| PUT | /dealerConsignmentNote/updateStatus | Update status |

### ShopDetails (`/shopDetails`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /shopDetails/save | Save shop detail |
| GET | /shopDetails/getAll | Get all |
| POST | /shopDetails/update | Update shop detail |
| PUT | /shopDetails/updateStatus | Update status |
