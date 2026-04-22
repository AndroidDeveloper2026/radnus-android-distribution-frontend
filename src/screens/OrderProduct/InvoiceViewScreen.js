// import React from 'react';
// import { View, Text, FlatList } from 'react-native';
// import Header from '../../components/Header';
// import styles from './InvoiceViewStyle';

// const InvoiceViewScreen = ({ route }) => {
//   const { invoice } = route.params;

//   return (
//     <View style={styles.container}>
//       <Header title="Invoice Details" />

//       <View style={styles.content}>
//         {/* Invoice Info Card */}
//         <View style={styles.card}>
//           <Text style={styles.title}>Invoice Info</Text>

//           <View style={styles.row}>
//             <Text style={styles.label}>Invoice No</Text>
//             <Text style={styles.value}>{invoice.invoiceNumber}</Text>
//           </View>

//           <View style={styles.row}>
//             <Text style={styles.label}>Biller</Text>
//             <Text style={styles.value}>{invoice.billerName}</Text>
//           </View>

//           <View style={styles.row}>
//             <Text style={styles.label}>Date</Text>
//             <Text style={styles.value}>
//               {new Date(invoice.createdAt).toDateString()}
//             </Text>
//           </View>

//           <View style={styles.row}>
//             <Text style={styles.label}>Payment Mode</Text>
//             <Text style={styles.value}>{invoice.paymentMode}</Text>
//           </View>

//           <View style={styles.divider} />

//           <View style={styles.row}>
//             <Text style={styles.label}>Total Amount</Text>
//             <Text style={styles.total}>₹{invoice.totalAmount}</Text>
//           </View>
//         </View>

//         {/* Items Card */}
//         <View style={styles.card}>
//           <Text style={styles.title}>Items</Text>

//           {/* Header */}
//           <View style={styles.itemHeader}>
//             <Text style={[styles.itemName, { fontWeight: 'bold' }]}>Item</Text>
//             <Text style={[styles.itemText, { fontWeight: 'bold' }]}>Qty</Text>
//             <Text style={[styles.itemText, { fontWeight: 'bold' }]}>Price</Text>
//           </View>

//           {invoice.items?.length === 0 ? (
//             <Text style={styles.emptyText}>No items found</Text>
//           ) : (
//             <FlatList
//               data={invoice.items}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={({ item }) => (
//                 <View style={styles.itemRow}>
//                   <Text style={styles.itemName}>{item.name}</Text>
//                   <Text style={styles.itemText}>{item.qty}</Text>
//                   <Text style={styles.itemText}>₹{item.price}</Text>
//                 </View>
//               )}
//             />
//           )}
//         </View>
//       </View>
//     </View>
//   );
// };

// export default InvoiceViewScreen;

//----------------------

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import RNPrint from 'react-native-print';
import { Download } from 'lucide-react-native';
import Header from '../../components/Header';
import styles from './InvoiceViewStyle';

const InvoiceViewScreen = ({ route }) => {
  const { invoice } = route.params;
  const [downloading, setDownloading] = useState(false);

  // Helper to generate invoice HTML from invoice object (same as InvoiceListScreen)
  const generateInvoiceHTML = (invoice) => {
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
      items,
      courierCharge,
      totalAmount,
      paymentMode,
      salesperson,
      referenceNo,
      billerName: biller,
    } = invoice;

    // Buyer display name
    const buyerDisplay = customerType === 'shop' && shopName
      ? `${shopName} (${customerName})`
      : customerName;

    // Buyer address lines
    const buyerLine1 = `${buyerDisplay} - ${customerPhone}`;
    const buyerLine2 = customerAddress || '';
    const buyerLine3 = [customerCity, customerState].filter(Boolean).join(' - ');

    // Consignee (ship to) details
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

    // Items rows
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
        </tr>
      `;
    });

    // Courier row
    const courierRow = `
      <tr>
        <td style="border:1px solid #000;padding:6px"> </td>
        <td style="border:1px solid #000;padding:6px">COURIER CHARGE</td>
        <td style="border:1px solid #000;padding:6px"> </td>
        <td style="border:1px solid #000;padding:6px"> </td>
        <td style="border:1px solid #000;padding:6px"> </td>
        <td style="border:1px solid #000;padding:6px"> </td>
        <td style="border:1px solid #000;padding:6px;text-align:right">₹${courierCharge || 0}.00</td>
      </tr>
    `;

    // Total row
    const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
    const totalRow = `
      <tr>
        <td style="border:1px solid #000;padding:6px"> </td>
        <td style="border:1px solid #000;padding:6px"><b>Total</b></td>
        <td style="border:1px solid #000;padding:6px"> </td>
        <td style="border:1px solid #000;padding:6px;text-align:center"><b>${totalQty} NOS</b></td>
        <td style="border:1px solid #000;padding:6px"> </td>
        <td style="border:1px solid #000;padding:6px"> </td>
        <td style="border:1px solid #000;padding:6px;text-align:right"><b>₹${totalAmount}.00</b></td>
      </tr>
    `;

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
    const grandTotalWords = `INR ${amountInWords(totalAmount)} Only`;

    // Reference No with date
    const refDate = createdAt ? new Date(createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
    const refDisplay = referenceNo ? `${referenceNo} dt. ${refDate}` : '';

    // Build HTML
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
          <p class="company-address">State Name: Puducherry, Code: 34</p>
          <p class="company-address">E-Mail: sundar12134@gmail.com</p>
          <p class="company-address"><b>GST: 34AAHFR8679B</b></p>
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
            <table style="width:100%; border-collapse:collapse;">
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
            ${courierRow}
            ${totalRow}
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
      </html>
    `;
  };

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const html = generateInvoiceHTML(invoice);
      await RNPrint.print({ html });
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
      console.error(error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Invoice Details" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Invoice Info Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Invoice Info</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Invoice No</Text>
            <Text style={styles.value}>{invoice.invoiceNumber}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Biller</Text>
            <Text style={styles.value}>{invoice.billerName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>
              {new Date(invoice.createdAt).toDateString()}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Payment Mode</Text>
            <Text style={styles.value}>{invoice.paymentMode}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Total Amount</Text>
            <Text style={styles.total}>₹{invoice.totalAmount}</Text>
          </View>
        </View>

        {/* Items Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Items</Text>

          {/* Header */}
          <View style={styles.itemHeader}>
            <Text style={[styles.itemName, { fontWeight: 'bold' }]}>Item</Text>
            <Text style={[styles.itemText, { fontWeight: 'bold' }]}>Qty</Text>
            <Text style={[styles.itemText, { fontWeight: 'bold' }]}>Price</Text>
          </View>

          {invoice.items?.length === 0 ? (
            <Text style={styles.emptyText}>No items found</Text>
          ) : (
            <FlatList
              data={invoice.items}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.itemRow}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemText}>{item.qty}</Text>
                  <Text style={styles.itemText}>₹{item.price}</Text>
                </View>
              )}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* Download PDF Button */}
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={downloadPDF}
          disabled={downloading}
        >
          {downloading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Download size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.downloadButtonText}>Download PDF</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default InvoiceViewScreen;