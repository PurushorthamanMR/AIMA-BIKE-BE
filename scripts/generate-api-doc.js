/**
 * Generates API_Table.docx with a table of all APIs.
 * Run: node scripts/generate-api-doc.js
 */
const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, BorderStyle, TextRun, AlignmentType } = require('docx');

const BASE_URL = 'http://localhost:8081';

const apis = [
  // Authentication
  { Module: 'Authentication', Method: 'POST', Endpoint: '/user/register', Description: 'Register a new user', Auth: 'No' },
  { Module: 'Authentication', Method: 'POST', Endpoint: '/user/login', Description: 'Login (returns JWT). Saves token to env.', Auth: 'No' },
  // User
  { Module: 'User', Method: 'GET', Endpoint: '/user/getAllPage', Description: 'Get all users (paginated). Query: pageNumber, pageSize, status?, firstName?, lastName?, emailAddress?', Auth: 'Yes' },
  { Module: 'User', Method: 'GET', Endpoint: '/user/getById', Description: 'Get user by ID. Query: id', Auth: 'Yes' },
  { Module: 'User', Method: 'GET', Endpoint: '/user/getByName', Description: 'Get users by name. Query: firstName, lastName', Auth: 'Yes' },
  { Module: 'User', Method: 'GET', Endpoint: '/user/getByEmailAddress', Description: 'Get user by email. Query: emailAddress', Auth: 'No' },
  { Module: 'User', Method: 'GET', Endpoint: '/user/getByRole', Description: 'Get users by role. Query: userRole', Auth: 'Yes' },
  { Module: 'User', Method: 'POST', Endpoint: '/user/update', Description: 'Update user. Body: id, firstName, lastName, address, emailAddress, mobileNumber, userRoleId', Auth: 'Yes' },
  { Module: 'User', Method: 'PUT', Endpoint: '/user/updateStatus', Description: 'Update user status. Query: userId, status', Auth: 'Yes' },
  { Module: 'User', Method: 'PUT', Endpoint: '/user/updatePassword', Description: 'Update password. Query: userId, password, changedByUserId', Auth: 'Yes' },
  // User Role
  { Module: 'User Role', Method: 'POST', Endpoint: '/userRole/save', Description: 'Save user role. Body: userRole, isActive', Auth: 'Yes' },
  { Module: 'User Role', Method: 'GET', Endpoint: '/userRole/getAll', Description: 'Get all user roles', Auth: 'Yes' },
  // User Logs
  { Module: 'User Logs', Method: 'POST', Endpoint: '/userLogs/save', Description: 'Save user log. Body: userId, action?, timestamp?', Auth: 'Yes' },
  { Module: 'User Logs', Method: 'GET', Endpoint: '/userLogs/getAll', Description: 'Get all user logs (paginated). Query: pageNumber, pageSize, status?, action?', Auth: 'Yes' },
  // Category
  { Module: 'Category', Method: 'POST', Endpoint: '/category/save', Description: 'Save category. Body: name, isActive?', Auth: 'Yes' },
  { Module: 'Category', Method: 'GET', Endpoint: '/category/getAllPage', Description: 'Get all categories (paginated). Query: pageNumber, pageSize, status?, name?', Auth: 'Yes' },
  { Module: 'Category', Method: 'GET', Endpoint: '/category/getByName', Description: 'Get categories by name. Query: name', Auth: 'Yes' },
  { Module: 'Category', Method: 'POST', Endpoint: '/category/update', Description: 'Update category. Body: id, name, isActive?', Auth: 'Yes' },
  { Module: 'Category', Method: 'PUT', Endpoint: '/category/updateStatus', Description: 'Update category status. Query: categoryId, status', Auth: 'Yes' },
  // Model
  { Module: 'Model', Method: 'POST', Endpoint: '/model/save', Description: 'Save model. Body: categoryId, name, imageUrl?, isActive?', Auth: 'Yes' },
  { Module: 'Model', Method: 'GET', Endpoint: '/model/getAllPage', Description: 'Get all models (paginated). Query: pageNumber, pageSize, status?, name?, categoryId?', Auth: 'Yes' },
  { Module: 'Model', Method: 'GET', Endpoint: '/model/getByName', Description: 'Get models by name. Query: name', Auth: 'Yes' },
  { Module: 'Model', Method: 'GET', Endpoint: '/model/getByCategory', Description: 'Get models by category. Query: categoryId', Auth: 'Yes' },
  { Module: 'Model', Method: 'POST', Endpoint: '/model/update', Description: 'Update model. Body: id, categoryId?, name, imageUrl?, isActive?', Auth: 'Yes' },
  { Module: 'Model', Method: 'PUT', Endpoint: '/model/updateStatus', Description: 'Update model status. Query: modelId, status', Auth: 'Yes' },
  // Stock
  { Module: 'Stock', Method: 'POST', Endpoint: '/stock/save', Description: 'Save stock. Body: modelId, name, color, sellingAmount?, quantity?, imageUrl?, isActive?', Auth: 'Yes' },
  { Module: 'Stock', Method: 'GET', Endpoint: '/stock/getAllPage', Description: 'Get all stock (paginated). Query: pageNumber, pageSize, status?, name?, color?, modelId?', Auth: 'Yes' },
  { Module: 'Stock', Method: 'GET', Endpoint: '/stock/getByName', Description: 'Get stock by name. Query: name', Auth: 'Yes' },
  { Module: 'Stock', Method: 'GET', Endpoint: '/stock/getByColor', Description: 'Get stock by color. Query: color', Auth: 'Yes' },
  { Module: 'Stock', Method: 'GET', Endpoint: '/stock/getByModel', Description: 'Get stock by model. Query: modelId', Auth: 'Yes' },
  { Module: 'Stock', Method: 'POST', Endpoint: '/stock/update', Description: 'Update stock. Body: id, modelId?, name, color, sellingAmount?, quantity?, imageUrl?, isActive?', Auth: 'Yes' },
  { Module: 'Stock', Method: 'PUT', Endpoint: '/stock/updateStatus', Description: 'Update stock status. Query: stockId, status', Auth: 'Yes' },
  { Module: 'Stock', Method: 'PUT', Endpoint: '/stock/updateQuantity', Description: 'Add quantity to stock. Query: stockId, quantity (amount to add)', Auth: 'Yes' },
  // Payment
  { Module: 'Payment', Method: 'POST', Endpoint: '/payment/save', Description: 'Save payment. Body: name?, isActive?', Auth: 'Yes' },
  { Module: 'Payment', Method: 'GET', Endpoint: '/payment/getByName', Description: 'Get payments by name. Query: name', Auth: 'Yes' },
  { Module: 'Payment', Method: 'POST', Endpoint: '/payment/update', Description: 'Update payment. Body: id, name?, isActive?', Auth: 'Yes' },
  { Module: 'Payment', Method: 'PUT', Endpoint: '/payment/updateStatus', Description: 'Update payment status. Query: paymentId, status', Auth: 'Yes' },
  // Cash
  { Module: 'Cash', Method: 'POST', Endpoint: '/cash/save', Description: 'Save cash. Body: customerId, copyOfNic?, photographOne?, photographTwo?, paymentReceipt?, mta2?, slip?, chequeNumber?, isActive?', Auth: 'Yes' },
  { Module: 'Cash', Method: 'POST', Endpoint: '/cash/update', Description: 'Update cash. Body: id, customerId?, copyOfNic?, photographOne?, photographTwo?, paymentReceipt?, mta2?, slip?, chequeNumber?, isActive?', Auth: 'Yes' },
  { Module: 'Cash', Method: 'PUT', Endpoint: '/cash/updateStatus', Description: 'Update cash status. Query: cashId, status', Auth: 'Yes' },
  { Module: 'Cash', Method: 'GET', Endpoint: '/cash/getByCustomer', Description: 'Get cash by customer. Query: customerId', Auth: 'Yes' },
  // Lease
  { Module: 'Lease', Method: 'POST', Endpoint: '/lease/save', Description: 'Save lease. Body: customerId, companyName?, purchaseOrderNumber?, copyOfNic?, photographOne?, photographTwo?, paymentReceipt?, mta2?, mta3?, chequeNumber?, isActive?', Auth: 'Yes' },
  { Module: 'Lease', Method: 'POST', Endpoint: '/lease/update', Description: 'Update lease. Body: id, customerId?, companyName?, ...', Auth: 'Yes' },
  { Module: 'Lease', Method: 'PUT', Endpoint: '/lease/updateStatus', Description: 'Update lease status. Query: leaseId, status', Auth: 'Yes' },
  { Module: 'Lease', Method: 'GET', Endpoint: '/lease/getByCustomer', Description: 'Get lease by customer. Query: customerId', Auth: 'Yes' },
  { Module: 'Lease', Method: 'GET', Endpoint: '/lease/getByCompany', Description: 'Get lease by company name. Query: companyName', Auth: 'Yes' },
  // Customer
  { Module: 'Customer', Method: 'POST', Endpoint: '/customer/save', Description: 'Save customer. Body: name, address, province, district, occupation, religion, nic, modelId, chassisNumber, motorNumber, colorOfVehicle, paymentId, ...', Auth: 'Yes' },
  { Module: 'Customer', Method: 'GET', Endpoint: '/customer/getAllPage', Description: 'Get all customers (paginated). Query: pageNumber, pageSize, status?, name?, colorOfVehicle?, modelId?, paymentId?', Auth: 'Yes' },
  { Module: 'Customer', Method: 'GET', Endpoint: '/customer/getByName', Description: 'Get customers by name. Query: name', Auth: 'Yes' },
  { Module: 'Customer', Method: 'GET', Endpoint: '/customer/getByColor', Description: 'Get customers by vehicle color. Query: colorOfVehicle', Auth: 'Yes' },
  { Module: 'Customer', Method: 'GET', Endpoint: '/customer/getByModel', Description: 'Get customers by model. Query: modelId', Auth: 'Yes' },
  { Module: 'Customer', Method: 'GET', Endpoint: '/customer/getByPayment', Description: 'Get customers by payment. Query: paymentId', Auth: 'Yes' },
  { Module: 'Customer', Method: 'POST', Endpoint: '/customer/update', Description: 'Update customer. Body: id, name, address, province, district, occupation, religion, nic, modelId, chassisNumber, motorNumber, colorOfVehicle, paymentId, ...', Auth: 'Yes' },
  { Module: 'Customer', Method: 'PUT', Endpoint: '/customer/updateStatus', Description: 'Update customer status. Query: customerId, status', Auth: 'Yes' },
];

function createTableCell(text) {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text: String(text), size: 20 })] })],
    width: { size: text.length > 40 ? 5000 : 2500, type: WidthType.DXA },
  });
}

const tableRows = [
  new TableRow({
    tableHeader: true,
    children: [
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Module', bold: true })] })], width: { size: 1500, type: WidthType.DXA } }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Method', bold: true })] })], width: { size: 800, type: WidthType.DXA } }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Endpoint', bold: true })] })], width: { size: 2500, type: WidthType.DXA } }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Description', bold: true })] })], width: { size: 5500, type: WidthType.DXA } }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Auth', bold: true })] })], width: { size: 600, type: WidthType.DXA } }),
    ],
  }),
  ...apis.map(api =>
    new TableRow({
      children: [
        createTableCell(api.Module),
        createTableCell(api.Method),
        createTableCell(BASE_URL + api.Endpoint),
        createTableCell(api.Description),
        createTableCell(api.Auth),
      ],
    })
  ),
];

const doc = new Document({
  sections: [{
    children: [
      new Paragraph({
        children: [new TextRun({ text: 'AimaBike POS API – Endpoints', bold: true, size: 32 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Base URL: ' + BASE_URL + '. Auth: Bearer token (except Login/Register/getByEmailAddress). Roles: ADMIN, MANAGER, STAFF.', size: 22 })],
        spacing: { after: 200 },
      }),
      new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1 },
          bottom: { style: BorderStyle.SINGLE, size: 1 },
          left: { style: BorderStyle.SINGLE, size: 1 },
          right: { style: BorderStyle.SINGLE, size: 1 },
        },
      }),
    ],
  }],
});

const outDir = path.join(__dirname, '..', 'docs');
const outPath = path.join(outDir, 'API_Table.docx');

fs.mkdirSync(outDir, { recursive: true });

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outPath, buffer);
  console.log('Generated: ' + outPath);
}).catch((err) => {
  console.error('Error generating docx:', err);
  process.exit(1);
});
