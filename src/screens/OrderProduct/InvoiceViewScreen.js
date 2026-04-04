import React from 'react';
import { View, Text, FlatList } from 'react-native';
import Header from '../../components/Header';
import styles from './InvoiceViewStyle';

const InvoiceViewScreen = ({ route }) => {
  const { invoice } = route.params;

  return (
    <View style={styles.container}>
      <Header title="Invoice Details" />

      <View style={styles.content}>
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
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default InvoiceViewScreen;
