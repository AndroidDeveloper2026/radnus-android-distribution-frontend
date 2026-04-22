// import RNPrint from 'react-native-print';
// import RNFS from 'react-native-fs';
// import Share from 'react-native-share';
// import { Platform, PermissionsAndroid } from 'react-native';

// // Request storage permission (Android only)
// export const requestStoragePermission = async () => {
//   if (Platform.OS === 'android') {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         {
//           title: 'Storage Permission',
//           message: 'App needs access to save PDF invoices.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         }
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     } catch (err) {
//       console.warn(err);
//       return false;
//     }
//   }
//   return true;
// };

// // Ensure directory exists before writing file
// const ensureDirectoryExists = async (path) => {
//   try {
//     const exists = await RNFS.exists(path);
//     if (!exists) {
//       await RNFS.mkdir(path);
//       console.log('Directory created:', path);
//     }
//     return true;
//   } catch (error) {
//     console.error('Error creating directory:', error);
//     return false;
//   }
// };

// // Sanitize filename (remove invalid characters like / \ ? % * : | " < >)
// const sanitizeFilename = (filename) => {
//   return filename.replace(/[/\\?%*:|"<>]/g, '_');
// };

// // Generate PDF using native print dialog (user can Save as PDF)
// export const generateAndSavePDF = async (html, invoiceNumber) => {
//   try {
//     const sanitizedInvoiceNo = sanitizeFilename(invoiceNumber);
//     const dirPath = `${RNFS.DocumentDirectoryPath}/Invoices`;
//     const filePath = `${dirPath}/Invoice_${sanitizedInvoiceNo}.html`;

//     // Ensure directory exists
//     await ensureDirectoryExists(dirPath);

//     // Write HTML to temporary file
//     await RNFS.writeFile(filePath, html, 'utf8');
//     console.log('HTML saved at:', filePath);

//     // For iOS, we can directly print HTML; for Android, use file path
//     if (Platform.OS === 'ios') {
//       await RNPrint.print({ html });
//     } else {
//       await RNPrint.print({ filePath });
//     }
//     return true;
//   } catch (error) {
//     console.error('Print failed:', error);
//     throw error;
//   }
// };

// // Share HTML file (optional)
// export const sharePDF = async (html, invoiceNumber) => {
//   const sanitizedInvoiceNo = sanitizeFilename(invoiceNumber);
//   const dirPath = `${RNFS.DocumentDirectoryPath}/Invoices`;
//   const filePath = `${dirPath}/Invoice_${sanitizedInvoiceNo}.html`;
//   await ensureDirectoryExists(dirPath);
//   await RNFS.writeFile(filePath, html, 'utf8');
//   await Share.open({
//     url: `file://${filePath}`,
//     type: 'text/html',
//     title: 'Share Invoice',
//   });
// };

// // Build the HTML invoice (same as before)
// export const buildInvoiceHTML = (data) => {
//   const {
//     invoiceNumber,
//     items,
//     total,
//     paymentMode,
//     date,
//     buyerName,
//     buyerPhone,
//     buyerAddress,
//     buyerCity,
//     buyerState,
//     courierCharge,
//     salesperson,
//     referenceNo,
//     grandTotal,
//     grandTotalWords,
//     totalQty,
//   } = data;

//   const buyerLine1 = buyerName + (buyerPhone ? ` - ${buyerPhone}` : '');
//   const buyerLine2 = buyerAddress || '';
//   const buyerLine3 = [buyerCity, buyerState].filter(Boolean).join(' - ');

//   const formatReferenceNo = () => {
//     if (!referenceNo) return '';
//     const formattedDate = new Date(date).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//     });
//     return `${referenceNo}  dt. ${formattedDate}`;
//   };

//   const itemsRows = items.map((item, idx) => {
//     const amount = item.qty * item.price;
//     return `
//       <tr>
//         <td style="text-align:center;padding:6px;border:1px solid #000">${idx + 1}</td>
//         <td style="padding:6px;border:1px solid #000">${item.name}</td>
//         <td style="text-align:center;padding:6px;border:1px solid #000">-</td>
//         <td style="text-align:center;padding:6px;border:1px solid #000">${item.qty} NOS</td>
//         <td style="text-align:right;padding:6px;border:1px solid #000">&#8377;${item.price}</td>
//         <td style="text-align:center;padding:6px;border:1px solid #000">NOS</td>
//         <td style="text-align:right;padding:6px;border:1px solid #000">&#8377;${amount}.00</td>
//       </tr>
//     `;
//   }).join('');

//   return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
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
//           <table style="width:100%">
//             <tr><th style="border:1px solid #000;padding:4px"><b>Invoice No.</b></th><td style="border:1px solid #000;padding:4px">${invoiceNumber}</td></tr>
//             <tr><th style="border:1px solid #000;padding:4px"><b>Dated</b></th><td style="border:1px solid #000;padding:4px">${new Date(date).toDateString()}</td></tr>
//             <tr><th style="border:1px solid #000;padding:4px"><b>Delivery Note</b></th><td style="border:1px solid #000;padding:4px"></td></tr>
//             <tr><th style="border:1px solid #000;padding:4px"><b>Mode/Terms of Payment</b></th><td style="border:1px solid #000;padding:4px">${paymentMode.toUpperCase()}</td></tr>
//             <tr><th style="border:1px solid #000;padding:4px"><b>Salesperson</b></th><td style="border:1px solid #000;padding:4px">${salesperson}</td></tr>
//             <tr><th style="border:1px solid #000;padding:4px"><b>Reference No. &amp; Date</b></th><td style="border:1px solid #000;padding:4px">${formatReferenceNo()}</td></tr>
//             <tr><th style="border:1px solid #000;padding:4px"><b>Buyer's Order No.</b></th><td style="border:1px solid #000;padding:4px"></td></tr>
//             <tr><th style="border:1px solid #000;padding:4px"><b>Dispatched through</b></th><td style="border:1px solid #000;padding:4px"></td></tr>
//             <tr><th style="border:1px solid #000;padding:4px"><b>Destination</b></th><td style="border:1px solid #000;padding:4px">${buyerLine3}</td></tr>
//             <tr><th style="border:1px solid #000;padding:4px"><b>Terms of Delivery</b></th><td style="border:1px solid #000;padding:4px"></td></tr>
//           </table>
//         </div>
//       </div>
//       <table>
//         <thead><tr><th style="width:5%">Sl No.</th><th style="width:30%">Description of Goods and Services</th><th style="width:10%">HSN/SAC</th><th style="width:12%">Quantity</th><th style="width:12%">Rate</th><th style="width:8%">Per</th><th style="width:13%">Amount</th></tr></thead>
//         <tbody>
//           ${itemsRows}
//           <tr><td></td><td>COURIER CHARGE</td><td></td><td></td><td></td><td></td><td style="text-align:right">&#8377;${courierCharge}.00</td></tr>
//           <tr><td></td><td><b>Total</b></td><td></td><td style="text-align:center"><b>${totalQty} NOS</b></td><td></td><td></td><td style="text-align:right"><b>&#8377;${grandTotal}.00</b></td></tr>
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
//     </html>
//   `;
// };