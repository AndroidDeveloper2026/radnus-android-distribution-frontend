// src/utils/excelExportRN.js
/**
 * React Native Excel export utility.
 *
 * Dependencies (add to your project if not already present):
 *   npm install xlsx react-native-share react-native-fs
 *
 * react-native-share v8+ works on both Android & iOS.
 * On Android the file is written to the app's cache dir and
 * shared via the system share sheet (user can choose Files, Drive, etc.).
 */
import * as XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { Alert } from 'react-native';

// ─── Helpers ──────────────────────────────────────────────────────
const formatDateExcel = (date) => {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return date;
  }
};

const formatNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

const todayStr = () => new Date().toISOString().split('T')[0];

/**
 * Converts a JS data array to an xlsx base64 string, writes it to
 * the cache directory, then triggers the native share sheet.
 */
const shareWorkbook = async (workbook, filename) => {
  try {
    // Write xlsx to base64 string
    const b64 = XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' });

    // Write to temp file
    const path = `${RNFS.CachesDirectoryPath}/${filename}.xlsx`;
    await RNFS.writeFile(path, b64, 'base64');

    // Share via native sheet
    await Share.open({
      url: `file://${path}`,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      filename: `${filename}.xlsx`,
      title: `Export ${filename}`,
      failOnCancel: false,
    });
  } catch (err) {
    console.error('Excel export error:', err);
    Alert.alert('Export Failed', 'Could not export the file. Please try again.');
  }
};

// ─── Export functions ─────────────────────────────────────────────

export const exportInvoicesToExcel = async (
  invoices,
  filename = `Invoices_Summary_${todayStr()}`,
) => {
  if (!invoices?.length) {
    Alert.alert('No Data', 'No invoice data to export');
    return;
  }

  const exportData = invoices.map((invoice, index) => ({
    'S.No': index + 1,
    'Invoice Date': invoice.invoiceDate
      ? formatDateExcel(invoice.invoiceDate)
      : formatDateExcel(invoice.createdAt),
    'Invoice Number': invoice.invoiceNumber || '',
    Salesperson: invoice.salesperson || '',
    'Reference No': invoice.referenceNo || '',
    'Biller Name': invoice.billerName || '',
    'Customer Name': invoice.customerName || '',
    'Customer Type': invoice.customerType === 'shop' ? 'Shop' : 'Customer',
    'Shop Name': invoice.shopName || '',
    'Phone Number': invoice.customerPhone || '',
    Address: invoice.customerAddress || '',
    'Payment Mode': invoice.paymentMode || '',
    Subtotal: formatNumber(invoice.subtotal),
    Discount: formatNumber(invoice.discount),
    'Courier Charge': formatNumber(invoice.courierCharge),
    'Total Amount': formatNumber(invoice.totalAmount),
    Status: invoice.status || 'completed',
    'Created At': formatDateExcel(invoice.createdAt),
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
  await shareWorkbook(wb, filename);
};

export const exportInvoiceItemsToExcel = async (
  invoices,
  filename = `Invoices_Detailed_${todayStr()}`,
) => {
  if (!invoices?.length) {
    Alert.alert('No Data', 'No invoice data to export');
    return;
  }

  const exportData = [];
  invoices.forEach((invoice) => {
    (invoice.items || []).forEach((item, idx) => {
      exportData.push({
        'Invoice Number': invoice.invoiceNumber || '',
        'Invoice Date': invoice.invoiceDate
          ? formatDateExcel(invoice.invoiceDate)
          : formatDateExcel(invoice.createdAt),
        'Customer Name': invoice.customerName || '',
        'Customer Phone': invoice.customerPhone || '',
        'Customer Type': invoice.customerType === 'shop' ? 'Shop' : 'Customer',
        'Shop Name': invoice.shopName || '',
        'S.No': idx + 1,
        'Product Name': item.name || '',
        Quantity: formatNumber(item.qty),
        Price: formatNumber(item.price),
        Amount: formatNumber(item.qty * item.price),
        'Payment Mode': invoice.paymentMode || '',
        Salesperson: invoice.salesperson || '',
        'Reference No': invoice.referenceNo || '',
        'Invoice Total': formatNumber(invoice.totalAmount),
      });
    });
  });

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Invoice Items');
  await shareWorkbook(wb, filename);
};

export const exportSalesReturnsToExcel = async (
  returns,
  filename = `Sales_Returns_Summary_${todayStr()}`,
) => {
  if (!returns?.length) {
    Alert.alert('No Data', 'No sales return data to export');
    return;
  }

  const exportData = returns.map((ret, index) => ({
    'S.No': index + 1,
    'Return Number': ret.returnNumber || '',
    'Return Date': formatDateExcel(ret.createdAt),
    Salesperson: ret.salesperson || '',
    'Customer Name': ret.customerName || '',
    'Reference Invoice': ret.referenceInvoice || '',
    'Total Amount': formatNumber(ret.totalAmount),
    Reason: ret.reason || '',
    Status: ret.status || 'pending',
    'Biller Name': ret.billerName || '',
    'Items Count': ret.items?.length || 0,
    'Created At': formatDateExcel(ret.createdAt),
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sales Returns');
  await shareWorkbook(wb, filename);
};

export const exportSalesReturnItemsToExcel = async (
  returns,
  filename = `Sales_Returns_Detailed_${todayStr()}`,
) => {
  if (!returns?.length) {
    Alert.alert('No Data', 'No sales return data to export');
    return;
  }

  const exportData = [];
  returns.forEach((ret) => {
    (ret.items || []).forEach((item, idx) => {
      exportData.push({
        'Return Number': ret.returnNumber || '',
        'Return Date': formatDateExcel(ret.createdAt),
        Salesperson: ret.salesperson || '',
        'Customer Name': ret.customerName || '',
        'Reference Invoice': ret.referenceInvoice || '',
        'S.No': idx + 1,
        'Product Name': item.name || '',
        Quantity: formatNumber(item.qty),
        Price: formatNumber(item.price),
        Amount: formatNumber(item.qty * item.price),
        Reason: ret.reason || '',
        Status: ret.status || '',
        'Return Total': formatNumber(ret.totalAmount),
      });
    });
  });

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Return Items');
  await shareWorkbook(wb, filename);
};

export const exportPurchaseReturnsToExcel = async (
  returns,
  filename = `Purchase_Returns_Report_${todayStr()}`,
) => {
  if (!returns?.length) {
    Alert.alert('No Data', 'No purchase return data to export');
    return;
  }

  const exportData = returns.map((ret, index) => ({
    'S.No': index + 1,
    'Return Number': ret.returnNumber || '',
    'Return Date': formatDateExcel(ret.createdAt),
    'Supplier Name': ret.supplierName || '',
    'Reference PO': ret.referencePO || '',
    'Total Amount': formatNumber(ret.totalAmount),
    Reason: ret.reason || '',
    Status: ret.status || 'pending',
    'Biller Name': ret.billerName || '',
    'Items Count': ret.items?.length || 0,
    'Created At': formatDateExcel(ret.createdAt),
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Purchase Returns');
  await shareWorkbook(wb, filename);
};

export const exportProductsToExcel = async (
  products,
  filename = `Products_Report_${todayStr()}`,
) => {
  if (!products?.length) {
    Alert.alert('No Data', 'No product data to export');
    return;
  }

  const exportData = products.map((product, index) => ({
    'S.No': index + 1,
    'Product Name': product.name || '',
    SKU: product.sku || '',
    Category: product.category || '',
    MRP: formatNumber(product.mrp),
    'Distributor Price': formatNumber(product.distributorPrice),
    'Retailer Price': formatNumber(product.retailerPrice),
    'Walk-in Price': formatNumber(product.walkinPrice),
    'Item Cost': formatNumber(product.itemCost),
    'GST (%)': formatNumber(product.gst),
    MOQ: formatNumber(product.moq),
    'Batch No': product.batchNo || '',
    'Rack No': product.rackNo || '',
    'Vendor Name': product.vendorName || '',
    Status: product.status || 'Active',
    'Created At': formatDateExcel(product.createdAt),
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Products');
  await shareWorkbook(wb, filename);
};

export const exportCustomersToExcel = async (
  customers,
  filename = `Customers_Report_${todayStr()}`,
) => {
  if (!customers?.length) {
    Alert.alert('No Data', 'No customer data to export');
    return;
  }

  const exportData = customers.map((customer, index) => ({
    'S.No': index + 1,
    Name: customer.name || '',
    Phone: customer.phone || '',
    Type: customer.type === 'shop' ? 'Shop' : 'Customer',
    'Shop Name': customer.shopName || '',
    Address: customer.address || '',
    City: customer.city || '',
    State: customer.state || '',
    'Created At': formatDateExcel(customer.createdAt),
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Customers');
  await shareWorkbook(wb, filename);
};