const { Op } = require('sequelize');
const { Customer, Model, Payment } = require('../models');
const logger = require('../config/logger');

/**
 * Get sales report aggregated by period (daily | monthly | yearly).
 * Uses completed customers only. Returns chart-ready data + summary.
 */
async function getSalesReport(period = 'daily') {
  logger.info('ReportService.getSalesReport() invoked', { period });

  const where = { status: 'complete', isActive: true };

  const today = new Date().toISOString().split('T')[0];
  if (period === 'daily') {
    const from = new Date();
    from.setDate(from.getDate() - 30);
    where.dateOfPurchase = { [Op.gte]: from.toISOString().split('T')[0], [Op.lte]: today };
  } else if (period === 'monthly') {
    const from = new Date();
    from.setDate(from.getDate() - 365);
    where.dateOfPurchase = { [Op.gte]: from.toISOString().split('T')[0], [Op.lte]: today };
  }
  // yearly: no date filter

  const rows = await Customer.findAll({
    where,
    attributes: ['id', 'name', 'dateOfPurchase', 'dateOfDelivery', 'sellingAmount'],
    include: [
      { model: Model, as: 'model', attributes: ['name'], required: false },
      { model: Payment, as: 'payment', attributes: ['name'], required: false },
    ],
    order: [['dateOfPurchase', 'ASC']],
  });

  const sales = rows.map((c) => ({
    id: c.id,
    date: c.dateOfPurchase || c.dateOfDelivery || '',
    amount: Number(c.sellingAmount) || 0,
    customerName: c.name || '',
    model: c.model?.name || '-',
    paymentType: c.payment?.name || '-',
  }));

  const byDate = {};
  sales.forEach((s) => {
    const d = s.date;
    if (!d) return;
    if (!byDate[d]) byDate[d] = { count: 0, total: 0 };
    byDate[d].count += 1;
    byDate[d].total += s.amount;
  });

  let chartData = [];
  if (period === 'daily') {
    const days = 30;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const data = byDate[key] || { count: 0, total: 0 };
      chartData.push({
        label: key.slice(5),
        sales: data.total,
        count: data.count,
      });
    }
  } else if (period === 'monthly') {
    const months = {};
    sales.forEach((s) => {
      if (!s.date) return;
      const [y, m] = s.date.split('-');
      const key = `${y}-${m}`;
      if (!months[key]) months[key] = { count: 0, total: 0 };
      months[key].count += 1;
      months[key].total += s.amount;
    });
    chartData = Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([key, data]) => ({ label: key, sales: data.total, count: data.count }));
  } else {
    const years = {};
    sales.forEach((s) => {
      if (!s.date) return;
      const y = s.date.split('-')[0];
      if (!years[y]) years[y] = { count: 0, total: 0 };
      years[y].count += 1;
      years[y].total += s.amount;
    });
    chartData = Object.entries(years)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, data]) => ({ label: key, sales: data.total, count: data.count }));
  }

  const paymentBreakdown = {};
  sales.forEach((s) => {
    const key = s.paymentType || 'other';
    paymentBreakdown[key] = (paymentBreakdown[key] || 0) + s.amount;
  });
  const paymentData = Object.entries(paymentBreakdown).map(([name, value]) => ({ name, value }));

  const modelSales = {};
  sales.forEach((s) => {
    const key = s.model || '-';
    if (!modelSales[key]) modelSales[key] = { qty: 0, total: 0 };
    modelSales[key].qty += 1;
    modelSales[key].total += s.amount;
  });
  const itemWiseList = Object.entries(modelSales)
    .map(([name, data]) => ({ name, qty: data.qty, total: data.total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const customerData = {};
  sales.forEach((s) => {
    const name = s.customerName || 'Unknown';
    if (!customerData[name]) customerData[name] = { count: 0, total: 0 };
    customerData[name].count += 1;
    customerData[name].total += s.amount;
  });
  const customerList = Object.entries(customerData).map(([name, data]) => ({ name, count: data.count, total: data.total }));

  const totalSales = sales.reduce((sum, s) => sum + s.amount, 0);
  const totalCount = sales.length;

  return {
    summary: {
      totalSales,
      totalCount,
      avgPerSale: totalCount > 0 ? totalSales / totalCount : 0,
    },
    chartData,
    paymentData,
    itemWiseList,
    customerData: customerList,
  };
}

module.exports = {
  getSalesReport,
};
