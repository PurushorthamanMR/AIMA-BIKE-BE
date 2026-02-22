# AIMA-BIKE Backend – API Reference

Base URL: `http://localhost:8081` (or set via `PORT` in `.env`)

**Auth:** Most endpoints require `Authorization: Bearer <accessToken>`. Get token via `POST /user/login`.

**Roles:** `ADMIN`, `MANAGER`, `STAFF` (admin-only routes use `ADMIN`, `MANAGER`).

---

## Tables & APIs Overview

| Table       | Base Path   | Endpoints |
|------------|-------------|-----------|
| User       | `/user`     | register, login, getAllPage, getByName, getById, getByRole, getByEmailAddress, update, updateStatus, updatePassword |
| UserRole   | `/userRole` | save, getAll |
| UserLogs   | `/userLogs` | save, getAll |
| Category   | `/category` | save, getAllPage, getByName, update, updateStatus |
| Model      | `/model`    | save, getAllPage, getByName, getByCategory, update, updateStatus |
| Stock      | `/stock`    | save, getAllPage, getByName, getByColor, getByModel, update, updateStatus, updateQuantity |
| Payment    | `/payment`  | save, getByName, update, updateStatus |
| Cash       | `/cash`     | save, update, updateStatus, getByCustomer |
| Lease      | `/lease`    | save, update, updateStatus, getByCustomer, getByCompany |
| Customer   | `/customer` | save, getAllPage, getByName, getByColor, getByModel, getByPayment, update, updateStatus |

---

## API Details by Resource

### User (`/user`)

| Method | Endpoint           | Auth | Description |
|--------|--------------------|------|-------------|
| POST   | `/user/register`   | No   | Register user. Body: `firstName`, `lastName`, `emailAddress`, `password`, `mobileNumber?`, `address?`, `userRoleId`, `isActive?` |
| POST   | `/user/login`      | No   | Login. Body: `username`, `password`. Returns `accessToken`. |
| GET    | `/user/getAllPage` | Yes  | Paginated. Query: `pageNumber`, `pageSize`, `status?`, `firstName?`, `lastName?`, `emailAddress?` |
| GET    | `/user/getByName`  | Yes  | Query: `firstName`, `lastName` |
| GET    | `/user/getById`    | Yes  | Query: `id` |
| GET    | `/user/getByRole`  | Yes  | Query: `userRole` |
| GET    | `/user/getByEmailAddress` | No  | Query: `emailAddress` |
| POST   | `/user/update`     | Yes  | Body: `id`, `firstName`, `lastName`, `emailAddress`, `mobileNumber?`, `address?`, `userRoleId?` |
| PUT    | `/user/updateStatus` | Yes | Query: `userId`, `status` (true/false) |
| PUT    | `/user/updatePassword` | Yes | Query: `userId`, `password`, `changedByUserId?` |

---

### UserRole (`/userRole`)

| Method | Endpoint        | Auth | Description |
|--------|-----------------|------|-------------|
| POST   | `/userRole/save` | Yes  | Body: `userRole`, `isActive?` (not implemented) |
| GET    | `/userRole/getAll` | Yes | Get all active roles |

---

### UserLogs (`/userLogs`)

| Method | Endpoint           | Auth | Description |
|--------|--------------------|------|-------------|
| POST   | `/userLogs/save`   | Yes  | Body: `userId` or `userDto.id`, `action?`, `timestamp?` |
| GET    | `/userLogs/getAll` | Yes  | Query: `pageNumber`, `pageSize`, `status?`, `action?` |

---

### Category (`/category`)

| Method | Endpoint              | Auth | Description |
|--------|-----------------------|------|-------------|
| POST   | `/category/save`     | Yes  | Body: `name`, `isActive?` |
| GET    | `/category/getAllPage` | Yes | Query: `pageNumber`, `pageSize`, `status?`, `name?` |
| GET    | `/category/getByName` | Yes | Query: `name` |
| POST   | `/category/update`   | Yes  | Body: `id`, `name?`, `isActive?` |
| PUT    | `/category/updateStatus` | Yes | Query: `categoryId`, `status` (true/false) |

---

### Model (`/model`)

| Method | Endpoint              | Auth | Description |
|--------|-----------------------|------|-------------|
| POST   | `/model/save`         | Yes  | Body: `categoryId`, `name`, `imageUrl?`, `isActive?` |
| GET    | `/model/getAllPage`   | Yes  | Query: `pageNumber`, `pageSize`, `status?`, `name?`, `categoryId?` |
| GET    | `/model/getByName`    | Yes  | Query: `name` |
| GET    | `/model/getByCategory` | Yes | Query: `categoryId` |
| POST   | `/model/update`       | Yes  | Body: `id`, `categoryId?`, `name`, `imageUrl?`, `isActive?` |
| PUT    | `/model/updateStatus` | Yes | Query: `modelId`, `status` (true/false) |

---

### Stock (`/stock`)

| Method | Endpoint                | Auth | Description |
|--------|-------------------------|------|-------------|
| POST   | `/stock/save`           | Yes  | Body: `modelId`, `name`, `color`, `sellingAmount?`, `quantity?`, `imageUrl?`, `isActive?` |
| GET    | `/stock/getAllPage`     | Yes  | Query: `pageNumber`, `pageSize`, `status?`, `name?`, `color?`, `modelId?` |
| GET    | `/stock/getByName`      | Yes  | Query: `name` |
| GET    | `/stock/getByColor`     | Yes  | Query: `color` |
| GET    | `/stock/getByModel`     | Yes  | Query: `modelId` |
| POST   | `/stock/update`         | Yes  | Body: `id`, `modelId?`, `name`, `color`, `sellingAmount?`, `quantity?`, `imageUrl?`, `isActive?` |
| PUT    | `/stock/updateStatus`   | Yes  | Query: `stockId`, `status` (true/false) |
| PUT    | `/stock/updateQuantity` | Yes  | Query: `stockId`, `quantity` (amount to **add** to current) |

---

### Payment (`/payment`)

| Method | Endpoint                | Auth | Description |
|--------|-------------------------|------|-------------|
| POST   | `/payment/save`        | Yes  | Body: `name?`, `isActive?` |
| GET    | `/payment/getByName`   | Yes  | Query: `name` |
| POST   | `/payment/update`      | Yes  | Body: `id`, `name?`, `isActive?` |
| PUT    | `/payment/updateStatus` | Yes | Query: `paymentId`, `status` (true/false) |

---

### Cash (`/cash`)

| Method | Endpoint              | Auth | Description |
|--------|-----------------------|------|-------------|
| POST   | `/cash/save`          | Yes  | Body: `customerId`, `copyOfNic?`, `photographOne?`, `photographTwo?`, `paymentReceipt?`, `mta2?`, `slip?`, `chequeNumber?`, `isActive?` |
| POST   | `/cash/update`        | Yes  | Body: `id`, `customerId?`, `copyOfNic?`, `photographOne?`, `photographTwo?`, `paymentReceipt?`, `mta2?`, `slip?`, `chequeNumber?`, `isActive?` |
| PUT    | `/cash/updateStatus`  | Yes  | Query: `cashId`, `status` (true/false) |
| GET    | `/cash/getByCustomer` | Yes  | Query: `customerId` |

---

### Lease (`/lease`)

| Method | Endpoint               | Auth | Description |
|--------|------------------------|------|-------------|
| POST   | `/lease/save`          | Yes  | Body: `customerId`, `companyName?`, `purchaseOrderNumber?`, `copyOfNic?`, `photographOne?`, `photographTwo?`, `paymentReceipt?`, `mta2?`, `mta3?`, `chequeNumber?`, `isActive?` |
| POST   | `/lease/update`        | Yes  | Body: `id`, and any fields to update |
| PUT    | `/lease/updateStatus`  | Yes  | Query: `leaseId`, `status` (true/false) |
| GET    | `/lease/getByCustomer` | Yes  | Query: `customerId` |
| GET    | `/lease/getByCompany`  | Yes  | Query: `companyName` |

---

### Customer (`/customer`)

| Method | Endpoint                 | Auth | Description |
|--------|--------------------------|------|-------------|
| POST   | `/customer/save`        | Yes  | Body: `name`, `address`, `province`, `district`, `occupation`, `religion`, `nic`, `modelId`, `chassisNumber`, `motorNumber`, `colorOfVehicle`, `paymentId`, plus optional: `dateOfBirth`, `contactNumber`, `whatsappNumber`, `dateOfPurchase`, `loyalityCardNo`, `dateOfDelivery`, `sellingAmount`, `registrationFees`, `advancePaymentAmount`, `advancePaymentDate`, `balancePaymentAmount`, `balancePaymentDate`, `isActive` |
| GET    | `/customer/getAllPage`  | Yes  | Query: `pageNumber`, `pageSize`, `status?`, `name?`, `colorOfVehicle?`, `modelId?`, `paymentId?` |
| GET    | `/customer/getByName`   | Yes  | Query: `name` |
| GET    | `/customer/getByColor`  | Yes  | Query: `colorOfVehicle` |
| GET    | `/customer/getByModel`  | Yes  | Query: `modelId` |
| GET    | `/customer/getByPayment`| Yes  | Query: `paymentId` |
| POST   | `/customer/update`     | Yes  | Body: `id`, and any fields to update |
| PUT    | `/customer/updateStatus`| Yes  | Query: `customerId`, `status` (true/false) |

---

## Database Tables (Summary)

| Table     | Key Fields / FKs |
|----------|-------------------|
| user     | userRoleId → userRole |
| userRole | — |
| userLogs | userId → user |
| category | — |
| model    | categoryId → category |
| stock    | modelId → model |
| payment  | — |
| cash     | customerId (ref) |
| lease    | customerId (ref) |
| customer | modelId → model, paymentId → payment |

---

## Response Format

- **Success:** `{ "status": true, "errorCode": 0, "errorDescription": null, "responseDto": <data> }`
- **Error:** `{ "status": false, "errorCode": <code>, "errorDescription": "<message>", "responseDto": null }`
