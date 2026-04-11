// import React from 'react';
// import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { FileDown, Home } from 'lucide-react-native';
// import RNPrint from 'react-native-print';

// import styles from './InvoiceStyle';
// import Header from '../../components/Header';

// const InvoiceScreen = ({ route, navigation }) => {
//   const {
//     invoiceNumber,
//     items,
//     total,
//     paymentMode,
//     date,
//     buyerName = '—',
//     buyerPhone = '',
//     buyerAddress = '—',
//     buyerCity = '',
//     buyerState = '',
//     courierCharge = 80,
//     salesperson = '',
//     referenceNo = '',
//   } = route.params;

//   const grandTotal = total + courierCharge;
//   const totalQty = items.reduce((sum, item) => sum + item.qty, 0);

//   // Buyer display helpers
//   const buyerLine1 = buyerName + (buyerPhone ? ` - ${buyerPhone}` : '');
//   const buyerLine2 = buyerAddress || '';
//   const buyerLine3 = [buyerCity, buyerState].filter(Boolean).join(' - ');

//   const amountInWords = num => {
//     const ones = [
//       '',
//       'One',
//       'Two',
//       'Three',
//       'Four',
//       'Five',
//       'Six',
//       'Seven',
//       'Eight',
//       'Nine',
//       'Ten',
//       'Eleven',
//       'Twelve',
//       'Thirteen',
//       'Fourteen',
//       'Fifteen',
//       'Sixteen',
//       'Seventeen',
//       'Eighteen',
//       'Nineteen',
//     ];
//     const tens = [
//       '',
//       '',
//       'Twenty',
//       'Thirty',
//       'Forty',
//       'Fifty',
//       'Sixty',
//       'Seventy',
//       'Eighty',
//       'Ninety',
//     ];
//     if (num === 0) return 'Zero';
//     if (num < 20) return ones[num];
//     if (num < 100)
//       return (
//         tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '')
//       );
//     if (num < 1000)
//       return (
//         ones[Math.floor(num / 100)] +
//         ' Hundred' +
//         (num % 100 ? ' ' + amountInWords(num % 100) : '')
//       );
//     if (num < 100000)
//       return (
//         amountInWords(Math.floor(num / 1000)) +
//         ' Thousand' +
//         (num % 1000 ? ' ' + amountInWords(num % 1000) : '')
//       );
//     return (
//       amountInWords(Math.floor(num / 100000)) +
//       ' Lakh' +
//       (num % 100000 ? ' ' + amountInWords(num % 100000) : '')
//     );
//   };

//   const grandTotalWords = `INR ${amountInWords(grandTotal)} Only`;

//   const formatReferenceNo = () => {
//     if (!referenceNo) return '';
//     const formattedDate = new Date(date).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//     });
//     return `${referenceNo}  dt. ${formattedDate}`;
//   };

//   const generateInvoiceHTML = () => {
//     const rows = items
//       .map((item, index) => {
//         const price = item.retailerPrice;
//         const amount = item.qty * price;
//         return `
//         <tr>
//           <td style="text-align:center;padding:6px;border:1px solid #000">${
//             index + 1
//           }</td>
//           <td style="padding:6px;border:1px solid #000">${item.name}</td>
//           <td style="text-align:center;padding:6px;border:1px solid #000">-</td>
//           <td style="text-align:center;padding:6px;border:1px solid #000">${
//             item.qty
//           } NOS</td>
//           <td style="text-align:right;padding:6px;border:1px solid #000">&#8377;${price}</td>
//           <td style="text-align:center;padding:6px;border:1px solid #000">NOS</td>
//           <td style="text-align:right;padding:6px;border:1px solid #000">&#8377;${amount}.00</td>
//         </tr>`;
//       })
//       .join('');

//     return `
//     <html>
//     <head>
//       <style>
//         body { font-family: Arial, sans-serif; font-size: 11px; margin: 0; padding: 15px; }
//         .outer-border { border: 2px solid #000; }
//         .header-section { border-bottom: 1px solid #000; padding: 8px; text-align: center; }
//         .company-name { font-size: 16px; font-weight: bold; margin: 0; }
//         .company-address { font-size: 10px; margin: 2px 0; }
//         .two-col { display: flex; border-bottom: 1px solid #000; }
//         .col-left { width: 50%; padding: 8px; border-right: 1px solid #000; }
//         .col-right { width: 50%; padding: 8px; }
//         .section-title { font-weight: bold; font-size: 10px; margin-bottom: 4px; }
//         table { width: 100%; border-collapse: collapse; font-size: 10px; }
//         th { background: #f0f0f0; font-weight: bold; padding: 6px; border: 1px solid #000; text-align: center; }
//         .amount-words { padding: 6px 8px; border-bottom: 1px solid #000; font-size: 10px; }
//         .declaration { padding: 6px 8px; font-size: 9px; border-bottom: 1px solid #000; }
//         .signature-section { display: flex; }
//         .sig-left { width: 60%; padding: 8px; border-right: 1px solid #000; font-size: 9px; }
//         .sig-right { width: 40%; padding: 8px; text-align: right; font-size: 10px; }
//         .sig-line { margin-top: 40px; border-top: 1px solid #000; font-size: 9px; text-align: center; }
//         .footer { text-align: center; padding: 4px; font-size: 9px; border-top: 1px solid #000; }
//       </style>
//     </head>
//     <body>
//     <div class="outer-border">
//       <div class="header-section">
//         <p class="company-name">RADNUS COMMUNICATION</p>
//         <p class="company-address">No.242/44, MG Road, Sinnaya Plaza, Near Fish Market</p>
//         <p class="company-address">Puducherry - 605001</p>
//         <p class="company-address">State Name: Puducherry, Code: 34</p>
//         <p class="company-address">E-Mail: sundar12134@gmail.com</p>
//         <p class="company-address"><b>GST: 34AAHFR8679B</b></p>
//       </div>
//       <div style="text-align:center;font-weight:bold;font-size:13px;padding:6px;border-bottom:1px solid #000;">INVOICE</div>
//       <div class="two-col">
//         <div class="col-left">
//           <div class="section-title">Consignee (Ship to)</div>
//           <p style="margin:2px 0">${buyerLine1}</p>
//           ${buyerLine2 ? `<p style="margin:2px 0">${buyerLine2}</p>` : ''}
//           ${buyerLine3 ? `<p style="margin:2px 0">${buyerLine3}</p>` : ''}
//           <div class="section-title" style="margin-top:10px">Buyer (Bill to)</div>
//           <p style="margin:2px 0">${buyerLine1}</p>
//           ${buyerLine2 ? `<p style="margin:2px 0">${buyerLine2}</p>` : ''}
//           ${buyerLine3 ? `<p style="margin:2px 0">${buyerLine3}</p>` : ''}
//         </div>
//         <div class="col-right">
//           <table>
//             <tr><td style="border:1px solid #000;padding:4px"><b>Invoice No.</b></td><td style="border:1px solid #000;padding:4px">${invoiceNumber}</td></tr>
//             <tr><td style="border:1px solid #000;padding:4px"><b>Dated</b></td><td style="border:1px solid #000;padding:4px">${new Date(date).toDateString()}</td></tr>
//             <tr><td style="border:1px solid #000;padding:4px"><b>Delivery Note</b></td><td style="border:1px solid #000;padding:4px"></td></tr>
//             <tr><td style="border:1px solid #000;padding:4px"><b>Mode/Terms of Payment</b></td><td style="border:1px solid #000;padding:4px">${paymentMode.toUpperCase()}</td></tr>
//             <tr><td style="border:1px solid #000;padding:4px"><b>Salesperson</b></td><td style="border:1px solid #000;padding:4px">${salesperson}</td></tr>
//             <tr><td style="border:1px solid #000;padding:4px"><b>Reference No. &amp; Date</b></td><td style="border:1px solid #000;padding:4px">${formatReferenceNo()}</td></tr>
//             <tr><td style="border:1px solid #000;padding:4px"><b>Buyer's Order No.</b></td><td style="border:1px solid #000;padding:4px"></td></tr>
//             <tr><td style="border:1px solid #000;padding:4px"><b>Dispatched through</b></td><td style="border:1px solid #000;padding:4px"></td></tr>
//             <tr><td style="border:1px solid #000;padding:4px"><b>Destination</b></td><td style="border:1px solid #000;padding:4px">${buyerLine3}</td></tr>
//             <tr><td style="border:1px solid #000;padding:4px"><b>Terms of Delivery</b></td><td style="border:1px solid #000;padding:4px"></td></tr>
//           </table>
//         </div>
//       </div>
//       <table>
//         <thead>
//           <tr><th style="width:5%">Sl No.</th><th style="width:30%">Description of Goods and Services</th><th style="width:10%">HSN/SAC</th><th style="width:12%">Quantity</th><th style="width:12%">Rate</th><th style="width:8%">Per</th><th style="width:13%">Amount</th></tr>
//         </thead>
//         <tbody>
//           ${rows}
//           <tr><td style="border:1px solid #000;padding:6px"></td><td style="border:1px solid #000;padding:6px">COURIER CHARGE</td><td style="border:1px solid #000;padding:6px"></td><td style="border:1px solid #000;padding:6px"></td><td style="border:1px solid #000;padding:6px"></td><td style="border:1px solid #000;padding:6px"></td><td style="border:1px solid #000;padding:6px;text-align:right">&#8377;${courierCharge}.00</td></tr>
//           <tr><td style="border:1px solid #000;padding:6px"></td><td style="border:1px solid #000;padding:6px"><b>Total</b></td><td style="border:1px solid #000;padding:6px"></td><td style="border:1px solid #000;padding:6px;text-align:center"><b>${totalQty} NOS</b></td><td style="border:1px solid #000;padding:6px"></td><td style="border:1px solid #000;padding:6px"></td><td style="border:1px solid #000;padding:6px;text-align:right"><b>&#8377;${grandTotal}.00</b></td></tr>
//         </tbody>
//       </table>
//       <div class="amount-words"><b>Amount Chargeable (in words)</b><br/><b>${grandTotalWords}</b></div>
//       <div class="declaration"><b>Declaration</b><br/>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</div>
//       <div class="signature-section">
//         <div class="sig-left">E. &amp; O.E</div>
//         <div class="sig-right"><b>for RADNUS COMMUNICATION</b><div class="sig-line">Authorised Signatory</div></div>
//       </div>
//       <div class="footer">This is a Computer Generated Invoice</div>
//     </div>
//     </body>
//     </html>`;
//   };

//   const generatePDF = async () => {
//     try {
//       const html = generateInvoiceHTML();
//       await RNPrint.print({ html });
//       // After successful print, go back to Dashboard (Home)
//       // Replace current screen so that back button doesn't return to invoice
//       navigation.replace('EmployeeDashboard'); // or 'Dashboard' – use your actual home screen name
//     } catch (error) {
//       console.log('Print Error:', error.message);
//       Alert.alert('Error', error.message || 'Failed to print. Try again.');
//     }
//   };

//   const goToHome = () => {
//     navigation.replace('EmployeeDashboard'); // navigate to home and remove invoice screen from stack
//   };

//   return (
//     <SafeAreaView style={styles.safeArea} edges={['bottom']}>
//       <Header
//         title="Invoice Bill"
//         rightIcon={<Home size={20} color="#FFF" />}
//         onRightIconPress={goToHome}
//       />

//       <ScrollView
//         contentContainerStyle={{ paddingBottom: 100 }}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.outerBorder}>
//           {/* COMPANY HEADER */}
//           <View style={styles.headerSection}>
//             <Text style={styles.companyName}>RADNUS COMMUNICATION</Text>
//             <Text style={styles.companyText}>
//               No.242/44, MG Road, Sinnaya Plaza
//             </Text>
//             <Text style={styles.companyText}>
//               Near Fish Market, Puducherry - 605001
//             </Text>
//             <Text style={styles.companyText}>
//               State Name: Puducherry, Code: 34
//             </Text>
//             <Text style={styles.companyText}>
//               E-Mail: sundar12134@gmail.com
//             </Text>
//             <Text style={styles.companyTextBold}>GST: 34AAHFR8679B</Text>
//           </View>

//           {/* INVOICE TITLE */}
//           <View style={styles.invoiceTitleBox}>
//             <Text style={styles.invoiceTitle}>INVOICE</Text>
//           </View>

//           {/* CONSIGNEE + BUYER + META */}
//           <View style={styles.twoCol}>
//             <View style={styles.colLeft}>
//               <Text style={styles.sectionTitle}>Consignee (Ship To)</Text>
//               <Text style={styles.bodyText}>{buyerLine1}</Text>
//               {buyerLine2 ? <Text style={styles.bodyText}>{buyerLine2}</Text> : null}
//               {buyerLine3 ? <Text style={styles.bodyText}>{buyerLine3}</Text> : null}

//               <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
//                 Buyer (Bill To)
//               </Text>
//               <Text style={styles.bodyText}>{buyerLine1}</Text>
//               {buyerLine2 ? <Text style={styles.bodyText}>{buyerLine2}</Text> : null}
//               {buyerLine3 ? <Text style={styles.bodyText}>{buyerLine3}</Text> : null}
//             </View>

//             <View style={styles.colRight}>
//               {[
//                 ['Invoice No.', invoiceNumber],
//                 ['Dated', new Date(date).toDateString()],
//                 ['Delivery Note', ''],
//                 ['Mode/Terms of Payment', paymentMode?.toUpperCase()],
//                 ['Salesperson', salesperson],
//                 ['Reference No. & Date', formatReferenceNo()],
//                 ["Buyer's Order No.", ''],
//                 ['Dispatched through', ''],
//                 ['Destination', buyerLine3],
//                 ['Terms of Delivery', ''],
//               ].map(([label, value], i) => (
//                 <View key={i} style={styles.metaRow}>
//                   <Text style={styles.metaLabel}>{label}</Text>
//                   <Text style={styles.metaValue}>{value}</Text>
//                 </View>
//               ))}
//             </View>
//           </View>

//           {/* TABLE HEADER */}
//           <View style={styles.tableHeader}>
//             <Text style={[styles.th, { flex: 0.4 }]}>Sl</Text>
//             <Text style={[styles.th, { flex: 2 }]}>Description</Text>
//             <Text style={[styles.th, { flex: 0.8 }]}>HSN</Text>
//             <Text style={[styles.th, { flex: 0.8 }]}>Qty</Text>
//             <Text style={[styles.th, { flex: 0.8 }]}>Rate</Text>
//             <Text style={[styles.th, { flex: 0.5 }]}>Per</Text>
//             <Text style={[styles.th, { flex: 1 }]}>Amount</Text>
//           </View>

//           {/* ITEMS */}
//           {items.map((item, index) => {
//             const price = item.retailerPrice;
//             const amount = item.qty * price;
//             return (
//               <View key={index} style={styles.tableRow}>
//                 <Text style={[styles.td, { flex: 0.4, textAlign: 'center' }]}>
//                   {index + 1}
//                 </Text>
//                 <Text style={[styles.td, { flex: 2 }]}>{item.name}</Text>
//                 <Text style={[styles.td, { flex: 0.8, textAlign: 'center' }]}>
//                   -
//                 </Text>
//                 <Text style={[styles.td, { flex: 0.8, textAlign: 'center' }]}>
//                   {item.qty} NOS
//                 </Text>
//                 <Text style={[styles.td, { flex: 0.8, textAlign: 'right' }]}>
//                   ₹{price}
//                 </Text>
//                 <Text style={[styles.td, { flex: 0.5, textAlign: 'center' }]}>
//                   NOS
//                 </Text>
//                 <Text style={[styles.td, { flex: 1, textAlign: 'right' }]}>
//                   ₹{amount}.00
//                 </Text>
//               </View>
//             );
//           })}

//           {/* COURIER ROW */}
//           <View style={styles.tableRow}>
//             <Text style={[styles.td, { flex: 0.4 }]}></Text>
//             <Text style={[styles.td, { flex: 2 }]}>Courier Charge</Text>
//             <Text style={[styles.td, { flex: 0.8 }]}></Text>
//             <Text style={[styles.td, { flex: 0.8 }]}></Text>
//             <Text style={[styles.td, { flex: 0.8 }]}></Text>
//             <Text style={[styles.td, { flex: 0.5 }]}></Text>
//             <Text style={[styles.td, { flex: 1, textAlign: 'right' }]}>
//               ₹{courierCharge}.00
//             </Text>
//           </View>

//           {/* TOTAL ROW */}
//           <View style={styles.tableRow}>
//             <Text style={[styles.td, { flex: 0.4 }]}></Text>
//             <Text style={[styles.td, { flex: 2, fontWeight: 'bold' }]}>
//               Total
//             </Text>
//             <Text style={[styles.td, { flex: 0.8 }]}></Text>
//             <Text
//               style={[
//                 styles.td,
//                 { flex: 0.8, textAlign: 'center', fontWeight: 'bold' },
//               ]}
//             >
//               {totalQty} NOS
//             </Text>
//             <Text style={[styles.td, { flex: 0.8 }]}></Text>
//             <Text style={[styles.td, { flex: 0.5 }]}></Text>
//             <Text
//               style={[
//                 styles.td,
//                 { flex: 1, textAlign: 'right', fontWeight: 'bold' },
//               ]}
//             >
//               ₹{grandTotal}.00
//             </Text>
//           </View>

//           {/* AMOUNT IN WORDS */}
//           <View style={styles.amountWords}>
//             <Text style={styles.amountWordsLabel}>
//               Amount Chargeable (in words)
//             </Text>
//             <Text style={styles.amountWordsValue}>{grandTotalWords}</Text>
//           </View>

//           {/* DECLARATION */}
//           <View style={styles.declaration}>
//             <Text style={styles.declarationTitle}>Declaration</Text>
//             <Text style={styles.declarationText}>
//               We declare that this invoice shows the actual price of the goods
//               described and that all particulars are true and correct.
//             </Text>
//           </View>

//           {/* SIGNATURE */}
//           <View style={styles.signatureRow}>
//             <View style={styles.sigLeft}>
//               <Text style={styles.bodyText}>E. & O.E</Text>
//             </View>
//             <View style={styles.sigRight}>
//               <Text style={styles.sigCompany}>for RADNUS COMMUNICATION</Text>
//               <View style={styles.sigLine} />
//               <Text style={styles.sigText}>Authorised Signatory</Text>
//             </View>
//           </View>

//           {/* FOOTER */}
//           <View style={styles.footerBox}>
//             <Text style={styles.footerText}>
//               This is a Computer Generated Invoice
//             </Text>
//           </View>
//         </View>
//       </ScrollView>

//       {/* FAB for PDF/Print */}
//       <TouchableOpacity style={styles.fab} onPress={generatePDF}>
//         <FileDown size={24} color="#FFFFFF" strokeWidth={2} />
//         <Text style={styles.fabText}>PDF</Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// };

// export default InvoiceScreen;

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileDown } from 'lucide-react-native';
import RNPrint from 'react-native-print';

import styles from './InvoiceStyle';
import Header from '../../components/Header';

const InvoiceScreen = ({ route }) => {
  const {
    invoiceNumber,
    items,
    total,
    paymentMode,
    date,
    buyerName = '—',
    buyerPhone = '',
    buyerAddress = '—',
    buyerCity = '',
    buyerState = '',
    courierCharge = 80,
    salesperson = '',
    referenceNo = '',
    // New shipping address params
    shipToName = '',
    shipToPhone = '',
    shipToAddress = '',
    shipToCity = '',
    shipToState = '',
  } = route.params;

  const grandTotal = total + courierCharge;
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);

  // Buyer (Bill to) display
  const buyerLine1 = buyerName + (buyerPhone ? ` - ${buyerPhone}` : '');
  const buyerLine2 = buyerAddress || '';
  const buyerLine3 = [buyerCity, buyerState].filter(Boolean).join(' - ');

  // Ship to (Consignee) – if shipToName is provided, use shipping address; otherwise fallback to buyer
  const shipToNameFinal = shipToName || buyerName;
  const shipToPhoneFinal = shipToPhone || buyerPhone;
  const shipToAddressFinal = shipToAddress || buyerAddress;
  const shipToCityFinal = shipToCity || buyerCity;
  const shipToStateFinal = shipToState || buyerState;

  const consigneeLine1 = shipToNameFinal + (shipToPhoneFinal ? ` - ${shipToPhoneFinal}` : '');
  const consigneeLine2 = shipToAddressFinal || '';
  const consigneeLine3 = [shipToCityFinal, shipToStateFinal].filter(Boolean).join(' - ');

  const amountInWords = num => {
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

  const formatReferenceNo = () => {
    if (!referenceNo) return '';
    const formattedDate = new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    return `${referenceNo}  dt. ${formattedDate}`;
  };

  const generateInvoiceHTML = () => {
    const rows = items.map((item, index) => {
      const price = item.retailerPrice;
      const amount = item.qty * price;
      return `
        <tr>
          <td style="text-align:center;padding:6px;border:1px solid #000">${index + 1}</td>
          <td style="padding:6px;border:1px solid #000">${item.name}</td>
          <td style="text-align:center;padding:6px;border:1px solid #000">-</td>
          <td style="text-align:center;padding:6px;border:1px solid #000">${item.qty} NOS</td>
          <td style="text-align:right;padding:6px;border:1px solid #000">&#8377;${price}</td>
          <td style="text-align:center;padding:6px;border:1px solid #000">NOS</td>
          <td style="text-align:right;padding:6px;border:1px solid #000">&#8377;${amount}.00</td>
        </tr>`;
    }).join('');

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
          <p style="margin:2px 0">${consigneeLine1}</p>
          ${consigneeLine2 ? `<p style="margin:2px 0">${consigneeLine2}</p>` : ''}
          ${consigneeLine3 ? `<p style="margin:2px 0">${consigneeLine3}</p>` : ''}
          <div class="section-title" style="margin-top:10px">Buyer (Bill to)</div>
          <p style="margin:2px 0">${buyerLine1}</p>
          ${buyerLine2 ? `<p style="margin:2px 0">${buyerLine2}</p>` : ''}
          ${buyerLine3 ? `<p style="margin:2px 0">${buyerLine3}</p>` : ''}
        </div>
        <div class="col-right">
          <table>
            <tr><td style="border:1px solid #000;padding:4px"><b>Invoice No.</b></td><td style="border:1px solid #000;padding:4px">${invoiceNumber}</td></tr>
            <tr><td style="border:1px solid #000;padding:4px"><b>Dated</b></td><td style="border:1px solid #000;padding:4px">${new Date(date).toDateString()}</td></tr>
            <tr><td style="border:1px solid #000;padding:4px"><b>Delivery Note</b></td><td style="border:1px solid #000;padding:4px"></td></tr>
            <tr><td style="border:1px solid #000;padding:4px"><b>Mode/Terms of Payment</b></td><td style="border:1px solid #000;padding:4px">${paymentMode.toUpperCase()}</td></tr>
            <tr><td style="border:1px solid #000;padding:4px"><b>Salesperson</b></td><td style="border:1px solid #000;padding:4px">${salesperson}</td></tr>
            <tr><td style="border:1px solid #000;padding:4px"><b>Reference No. &amp; Date</b></td><td style="border:1px solid #000;padding:4px">${formatReferenceNo()}</td></tr>
            <tr><td style="border:1px solid #000;padding:4px"><b>Buyer's Order No.</b></td><td style="border:1px solid #000;padding:4px"></td></tr>
            <tr><td style="border:1px solid #000;padding:4px"><b>Dispatched through</b></td><td style="border:1px solid #000;padding:4px"></td></tr>
            <tr><td style="border:1px solid #000;padding:4px"><b>Destination</b></td><td style="border:1px solid #000;padding:4px">${consigneeLine3}</td></tr>
            <tr><td style="border:1px solid #000;padding:4px"><b>Terms of Delivery</b></td><td style="border:1px solid #000;padding:4px"></td></tr>
          </table>
        </div>
      </div>
      <table>
        <thead><tr><th>Sl No.</th><th>Description</th><th>HSN</th><th>Qty</th><th>Rate</th><th>Per</th><th>Amount</th></tr></thead>
        <tbody>
          ${rows}
          <tr><td></td><td>COURIER CHARGE</td><td></td><td></td><td></td><td></td><td style="text-align:right">&#8377;${courierCharge}.00</td></tr>
          <tr><td></td><td><b>Total</b></td><td></td><td style="text-align:center"><b>${totalQty} NOS</b></td><td></td><td></td><td style="text-align:right"><b>&#8377;${grandTotal}.00</b></td></tr>
        </tbody>
      </table>
      <div class="amount-words"><b>Amount Chargeable (in words)</b><br/><b>${grandTotalWords}</b></div>
      <div class="declaration"><b>Declaration</b><br/>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</div>
      <div class="signature-section"><div class="sig-left">E. &amp; O.E</div><div class="sig-right"><b>for RADNUS COMMUNICATION</b><div class="sig-line">Authorised Signatory</div></div></div>
      <div class="footer">This is a Computer Generated Invoice</div>
    </div>
    </body>
    </html>`;
  };

  const generatePDF = async () => {
    try {
      const html = generateInvoiceHTML();
      await RNPrint.print({ html });
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to print. Try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <Header title="Invoice Bill" />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={styles.outerBorder}>
          <View style={styles.headerSection}>
            <Text style={styles.companyName}>RADNUS COMMUNICATION</Text>
            <Text style={styles.companyText}>No.242/44, MG Road, Sinnaya Plaza</Text>
            <Text style={styles.companyText}>Near Fish Market, Puducherry - 605001</Text>
            <Text style={styles.companyText}>State Name: Puducherry, Code: 34</Text>
            <Text style={styles.companyText}>E-Mail: sundar12134@gmail.com</Text>
            <Text style={styles.companyTextBold}>GST: 34AAHFR8679B</Text>
          </View>
          <View style={styles.invoiceTitleBox}><Text style={styles.invoiceTitle}>INVOICE</Text></View>

          <View style={styles.twoCol}>
            <View style={styles.colLeft}>
              <Text style={styles.sectionTitle}>Consignee (Ship To)</Text>
              <Text style={styles.bodyText}>{consigneeLine1}</Text>
              {consigneeLine2 ? <Text style={styles.bodyText}>{consigneeLine2}</Text> : null}
              {consigneeLine3 ? <Text style={styles.bodyText}>{consigneeLine3}</Text> : null}
              <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Buyer (Bill To)</Text>
              <Text style={styles.bodyText}>{buyerLine1}</Text>
              {buyerLine2 ? <Text style={styles.bodyText}>{buyerLine2}</Text> : null}
              {buyerLine3 ? <Text style={styles.bodyText}>{buyerLine3}</Text> : null}
            </View>
            <View style={styles.colRight}>
              {[
                ['Invoice No.', invoiceNumber],
                ['Dated', new Date(date).toDateString()],
                ['Delivery Note', ''],
                ['Mode/Terms of Payment', paymentMode?.toUpperCase()],
                ['Salesperson', salesperson],
                ['Reference No. & Date', formatReferenceNo()],
                ["Buyer's Order No.", ''],
                ['Dispatched through', ''],
                ['Destination', consigneeLine3],
                ['Terms of Delivery', ''],
              ].map(([label, value], i) => (
                <View key={i} style={styles.metaRow}>
                  <Text style={styles.metaLabel}>{label}</Text>
                  <Text style={styles.metaValue}>{value}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 0.4 }]}>Sl</Text>
            <Text style={[styles.th, { flex: 2 }]}>Description</Text>
            <Text style={[styles.th, { flex: 0.8 }]}>HSN</Text>
            <Text style={[styles.th, { flex: 0.8 }]}>Qty</Text>
            <Text style={[styles.th, { flex: 0.8 }]}>Rate</Text>
            <Text style={[styles.th, { flex: 0.5 }]}>Per</Text>
            <Text style={[styles.th, { flex: 1 }]}>Amount</Text>
          </View>

          {items.map((item, index) => {
            const price = item.retailerPrice;
            const amount = item.qty * price;
            return (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.td, { flex: 0.4, textAlign: 'center' }]}>{index + 1}</Text>
                <Text style={[styles.td, { flex: 2 }]}>{item.name}</Text>
                <Text style={[styles.td, { flex: 0.8, textAlign: 'center' }]}>-</Text>
                <Text style={[styles.td, { flex: 0.8, textAlign: 'center' }]}>{item.qty} NOS</Text>
                <Text style={[styles.td, { flex: 0.8, textAlign: 'right' }]}>₹{price}</Text>
                <Text style={[styles.td, { flex: 0.5, textAlign: 'center' }]}>NOS</Text>
                <Text style={[styles.td, { flex: 1, textAlign: 'right' }]}>₹{amount}.00</Text>
              </View>
            );
          })}

          <View style={styles.tableRow}>
            <Text style={[styles.td, { flex: 0.4 }]}></Text>
            <Text style={[styles.td, { flex: 2 }]}>Courier Charge</Text>
            <Text style={[styles.td, { flex: 0.8 }]}></Text>
            <Text style={[styles.td, { flex: 0.8 }]}></Text>
            <Text style={[styles.td, { flex: 0.8 }]}></Text>
            <Text style={[styles.td, { flex: 0.5 }]}></Text>
            <Text style={[styles.td, { flex: 1, textAlign: 'right' }]}>₹{courierCharge}.00</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.td, { flex: 0.4 }]}></Text>
            <Text style={[styles.td, { flex: 2, fontWeight: 'bold' }]}>Total</Text>
            <Text style={[styles.td, { flex: 0.8 }]}></Text>
            <Text style={[styles.td, { flex: 0.8, textAlign: 'center', fontWeight: 'bold' }]}>{totalQty} NOS</Text>
            <Text style={[styles.td, { flex: 0.8 }]}></Text>
            <Text style={[styles.td, { flex: 0.5 }]}></Text>
            <Text style={[styles.td, { flex: 1, textAlign: 'right', fontWeight: 'bold' }]}>₹{grandTotal}.00</Text>
          </View>

          <View style={styles.amountWords}>
            <Text style={styles.amountWordsLabel}>Amount Chargeable (in words)</Text>
            <Text style={styles.amountWordsValue}>{grandTotalWords}</Text>
          </View>

          <View style={styles.declaration}>
            <Text style={styles.declarationTitle}>Declaration</Text>
            <Text style={styles.declarationText}>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</Text>
          </View>

          <View style={styles.signatureRow}>
            <View style={styles.sigLeft}><Text style={styles.bodyText}>E. & O.E</Text></View>
            <View style={styles.sigRight}>
              <Text style={styles.sigCompany}>for RADNUS COMMUNICATION</Text>
              <View style={styles.sigLine} />
              <Text style={styles.sigText}>Authorised Signatory</Text>
            </View>
          </View>

          <View style={styles.footerBox}>
            <Text style={styles.footerText}>This is a Computer Generated Invoice</Text>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.fab} onPress={generatePDF}>
        <FileDown size={24} color="#FFFFFF" strokeWidth={2} />
        <Text style={styles.fabText}>PDF</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default InvoiceScreen;