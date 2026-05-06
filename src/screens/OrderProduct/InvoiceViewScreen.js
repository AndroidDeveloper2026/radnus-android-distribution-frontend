import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import RNPrint from 'react-native-print';
import { Download, FileText, MapPin, Phone, CreditCard, Calendar } from 'lucide-react-native';
import Header from '../../components/Header';
import styles from './InvoiceViewStyle'; // 👈 Ensure this file exists and is the new one I gave

const InvoiceViewScreen = ({ route }) => {
  const { invoice } = route.params;
  const [downloading, setDownloading] = useState(false);

  // Extract data
  const {
    invoiceNumber,
    createdAt,
    customerName,
    customerPhone,
    customerAddress,
    customerCity,
    customerState,
    customerType,
    shopName,
    sameAsBuyer,
    shippingAddress,
    items = [],
    totalAmount,
    paymentMode,
    subtotal: storeSubtotal,
    discount = 0,
    courierCharge = 0,
    billerName,
    salesperson,
    referenceNo,
  } = invoice;

  // Computed subtotal (fallback to items calculation)
  const subtotal =
    storeSubtotal ||
    items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const grandTotal = totalAmount;

  // ── PDF Generator ──────────────────────────────────────
  const generateInvoiceHTML = () => {
    const buyerDisplay =
      customerType === 'shop' && shopName
        ? `${shopName} (${customerName})`
        : customerName;

    const buyerLine1 = `${buyerDisplay} - ${customerPhone}`;
    const buyerLine2 = customerAddress || '';
    const buyerLine3 = [customerCity, customerState].filter(Boolean).join(' - ');

    // Shipping details
    let shipName = buyerDisplay;
    let shipPhone = customerPhone;
    let shipAddress = customerAddress;
    let shipCity = customerCity;
    let shipState = customerState;
    if (!sameAsBuyer && shippingAddress) {
      shipName = shippingAddress.name || buyerDisplay;
      shipPhone = shippingAddress.phone || customerPhone;
      shipAddress = shippingAddress.address || '';
      shipCity = shippingAddress.city || '';
      shipState = shippingAddress.state || '';
    }
    const shipLine1 = `${shipName} - ${shipPhone}`;
    const shipLine2 = shipAddress || '';
    const shipLine3 = [shipCity, shipState].filter(Boolean).join(' - ');

    // Item rows
    let itemsRows = '';
    items.forEach((item, idx) => {
      const amount = item.qty * item.price;
      itemsRows += `
        <tr>
          <td style="text-align:center;padding:6px;border:1px solid #000">${idx + 1}</td>
          <td style="padding:6px;border:1px solid #000">${item.name}</td>
          <td style="text-align:center;padding:6px;border:1px solid #000">-</td>
          <td style="text-align:center;padding:6px;border:1px solid #000">${item.qty} NOS</td>
          <td style="text-align:right;padding:6px;border:1px solid #000">₹${item.price}</td>
          <td style="text-align:center;padding:6px;border:1px solid #000">NOS</td>
          <td style="text-align:right;padding:6px;border:1px solid #000">₹${amount}.00</td>
        </tr>`;
    });

    // Discount row
    const discountRow = discount > 0
      ? `
      <tr>
        <td style="border:1px solid #000;padding:6px"> </td>
        <td style="border:1px solid #000;padding:6px">DISCOUNT</td>
        <td style="border:1px solid #000;padding:6px"> </td>
        <td style="border:1px solid #000;padding:6px"> </td>
        <td style="border:1px solid #000;padding:6px"> </td>
        <td style="border:1px solid #000;padding:6px"> </td>
        <td style="border:1px solid #000;padding:6px;text-align:right">₹${discount}.00</td>
      </tr>`
      : '';

    const totalQty = items.reduce((sum, i) => sum + i.qty, 0);

    // Amount in words
    const amountInWords = (num) => {
      const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
      const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
      if (num === 0) return 'Zero';
      if (num < 20) return ones[num];
      if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
      if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + amountInWords(num % 100) : '');
      if (num < 100000) return amountInWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + amountInWords(num % 1000) : '');
      return amountInWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + amountInWords(num % 100000) : '');
    };
    const grandTotalWords = `INR ${amountInWords(grandTotal)} Only`;

    const refDate = createdAt
      ? new Date(createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : '';
    const refDisplay = referenceNo ? `${referenceNo} dt. ${refDate}` : '';

    return `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; font-size: 11px; margin: 0; padding: 15px; }
          .outer-border { border: 2px solid #000; }
          .header-section { border-bottom: 1px solid #000; padding: 8px; text-align: center; }
          .company-name { font-size: 16px; font-weight: bold; margin: 0; }
          .company-address { font-size: 10px; margin: 2px 0; }
          .two-col { display: flex; border-bottom: 1px solid #000; }
          .col-left { width: 50%; padding: 8px; border-right: 1px solid #000; }
          .col-right { width: 50%; padding: 8px; }
          .section-title { font-weight: bold; font-size: 10px; margin-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; font-size: 10px; }
          th { background: #f0f0f0; font-weight: bold; padding: 6px; border: 1px solid #000; text-align: center; }
          .amount-words { padding: 6px 8px; border-bottom: 1px solid #000; font-size: 10px; }
          .declaration { padding: 6px 8px; font-size: 9px; border-bottom: 1px solid #000; }
          .signature-section { display: flex; }
          .sig-left { width: 60%; padding: 8px; border-right: 1px solid #000; font-size: 9px; }
          .sig-right { width: 40%; padding: 8px; text-align: right; font-size: 10px; }
          .sig-line { margin-top: 40px; border-top: 1px solid #000; font-size: 9px; text-align: center; }
          .footer { text-align: center; padding: 4px; font-size: 9px; border-top: 1px solid #000; }
        </style>
      </head>
      <body>
      <div class="outer-border">
        <div class="header-section">
          <p class="company-name">RADNUS COMMUNICATION</p>
          <p class="company-address">No.242/44, MG Road, Sinnaya Plaza, Near Fish Market</p>
          <p class="company-address">Puducherry - 605001</p>
          <p class="company-address">State Name: Puducherry, Code: 605001</p>
          <p class="company-address">E-Mail: sundar12134@gmail.com</p>
        </div>
        <div style="text-align:center;font-weight:bold;font-size:13px;padding:6px;border-bottom:1px solid #000;">INVOICE</div>
        <div class="two-col">
          <div class="col-left">
            <div class="section-title">Consignee (Ship to)</div>
            <p style="margin:2px 0">${shipLine1}</p>
            ${shipLine2 ? `<p style="margin:2px 0">${shipLine2}</p>` : ''}
            ${shipLine3 ? `<p style="margin:2px 0">${shipLine3}</p>` : ''}
            <div class="section-title" style="margin-top:10px">Buyer (Bill to)</div>
            <p style="margin:2px 0">${buyerLine1}</p>
            ${buyerLine2 ? `<p style="margin:2px 0">${buyerLine2}</p>` : ''}
            ${buyerLine3 ? `<p style="margin:2px 0">${buyerLine3}</p>` : ''}
          </div>
          <div class="col-right">
            <table>
              <tr><td style="border:1px solid #000;padding:4px"><b>Invoice No.</b></td><td style="border:1px solid #000;padding:4px">${invoiceNumber}</td></tr>
              <tr><td style="border:1px solid #000;padding:4px"><b>Dated</b></td><td style="border:1px solid #000;padding:4px">${new Date(createdAt).toDateString()}</td></tr>
              <tr><td style="border:1px solid #000;padding:4px"><b>Delivery Note</b></td><td style="border:1px solid #000;padding:4px"></td></tr>
              <tr><td style="border:1px solid #000;padding:4px"><b>Mode/Terms of Payment</b></td><td style="border:1px solid #000;padding:4px">${paymentMode?.toUpperCase()}</td></tr>
              <tr><td style="border:1px solid #000;padding:4px"><b>Salesperson</b></td><td style="border:1px solid #000;padding:4px">${salesperson || ''}</td></tr>
              <tr><td style="border:1px solid #000;padding:4px"><b>Reference No. &amp; Date</b></td><td style="border:1px solid #000;padding:4px">${refDisplay}</td></tr>
              <tr><td style="border:1px solid #000;padding:4px"><b>Buyer's Order No.</b></td><td style="border:1px solid #000;padding:4px"></td></tr>
              <tr><td style="border:1px solid #000;padding:4px"><b>Dispatched through</b></td><td style="border:1px solid #000;padding:4px"></td></tr>
              <tr><td style="border:1px solid #000;padding:4px"><b>Destination</b></td><td style="border:1px solid #000;padding:4px">${buyerLine3}</td></tr>
              <tr><td style="border:1px solid #000;padding:4px"><b>Terms of Delivery</b></td><td style="border:1px solid #000;padding:4px"></td></tr>
            </table>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width:5%">Sl No.</th>
              <th style="width:30%">Description of Goods and Services</th>
              <th style="width:10%">HSN/SAC</th>
              <th style="width:12%">Quantity</th>
              <th style="width:12%">Rate</th>
              <th style="width:8%">Per</th>
              <th style="width:13%">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
            ${discountRow}
            <tr>
              <td style="border:1px solid #000;padding:6px"> </td>
              <td style="border:1px solid #000;padding:6px">COURIER CHARGE</td>
              <td style="border:1px solid #000;padding:6px"> </td>
              <td style="border:1px solid #000;padding:6px"> </td>
              <td style="border:1px solid #000;padding:6px"> </td>
              <td style="border:1px solid #000;padding:6px"> </td>
              <td style="border:1px solid #000;padding:6px;text-align:right">₹${courierCharge}.00</td>
            </tr>
            <tr>
              <td style="border:1px solid #000;padding:6px"> </td>
              <td style="border:1px solid #000;padding:6px"><b>Total</b></td>
              <td style="border:1px solid #000;padding:6px"> </td>
              <td style="border:1px solid #000;padding:6px;text-align:center"><b>${totalQty} NOS</b></td>
              <td style="border:1px solid #000;padding:6px"> </td>
              <td style="border:1px solid #000;padding:6px"> </td>
              <td style="border:1px solid #000;padding:6px;text-align:right"><b>₹${grandTotal}.00</b></td>
            </tr>
          </tbody>
        </table>
        <div class="amount-words"><b>Amount Chargeable (in words)</b><br/><b>${grandTotalWords}</b></div>
        <div class="declaration"><b>Declaration</b><br/>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</div>
        <div class="signature-section">
          <div class="sig-left">E. &amp; O.E</div>
          <div class="sig-right"><b>for RADNUS COMMUNICATION</b><div class="sig-line">Authorised Signatory</div></div>
        </div>
        <div class="footer">This is a Computer Generated Invoice</div>
      </div>
      </body>
      </html>`;
  };

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const html = generateInvoiceHTML(invoice);
      await RNPrint.print({ html });
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF.');
      console.error(error);
    } finally {
      setDownloading(false);
    }
  };

  // ── UI ─────────────────────────────────────────────────
  const customerDisplay = customerName || '—';
  const addressParts = [
    customerAddress,
    customerCity,
    customerState,
  ].filter(Boolean).join(', ') || '—';

  return (
    <View style={styles.container}>
      <Header title="Invoice Details" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Invoice Meta + Customer */}
        <View style={styles.card}>
          <View style={styles.invoiceHeaderRow}>
            <Text style={styles.invoiceNumber}>{invoiceNumber}</Text>
            <View style={styles.dateBadge}>
              <Calendar size={12} color="#B45309" />
              <Text style={styles.dateText}>
                {new Date(createdAt).toDateString()}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <FileText size={16} color="#6B7280" style={styles.infoIcon} />
            <Text style={styles.infoText}>Biller: {billerName || '—'}</Text>
          </View>
          {salesperson ? (
            <View style={styles.infoRow}>
              <FileText size={16} color="#6B7280" style={styles.infoIcon} />
              <Text style={styles.infoText}>Salesperson: {salesperson}</Text>
            </View>
          ) : null}

          <View style={styles.divider} />

          <Text style={styles.cardTitle}>Customer</Text>
          <View style={styles.infoRow}>
            <Phone size={16} color="#6B7280" style={styles.infoIcon} />
            <Text style={styles.infoText}>
              {customerDisplay} – {customerPhone || '—'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={16} color="#6B7280" style={styles.infoIcon} />
            <Text style={styles.infoText}>{addressParts}</Text>
          </View>
          <View style={styles.infoRow}>
            <CreditCard size={16} color="#6B7280" style={styles.infoIcon} />
            <Text style={styles.infoText}>
              Payment: {paymentMode?.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Items */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Items ({items.length})</Text>
          <View style={styles.itemsHeader}>
            <Text style={[styles.headerText, styles.itemNameFlex]}>Item</Text>
            <Text style={[styles.headerText, styles.itemQtyFlex]}>Qty</Text>
            <Text style={[styles.headerText, styles.itemPriceFlex]}>Price</Text>
          </View>
          {items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQty}>{item.qty}</Text>
              <Text style={styles.itemPrice}>₹{item.qty * item.price}</Text>
            </View>
          ))}
        </View>

        {/* Payment Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Summary</Text>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Subtotal</Text>
            <Text style={styles.breakdownValue}>₹{subtotal}</Text>
          </View>

          {discount > 0 && (
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Discount</Text>
              <Text style={[styles.breakdownValue, styles.discountValue]}>
                - ₹{discount}
              </Text>
            </View>
          )}

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Courier Charge</Text>
            <Text style={styles.breakdownValue}>₹{courierCharge}</Text>
          </View>

          <View style={[styles.breakdownRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>₹{grandTotal}</Text>
          </View>
        </View>

        {/* Download Button */}
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={downloadPDF}
          disabled={downloading}
        >
          {downloading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <>
              <Download size={20} color="#FFFFFF" />
              <Text style={styles.downloadText}>Download Invoice PDF</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default InvoiceViewScreen;