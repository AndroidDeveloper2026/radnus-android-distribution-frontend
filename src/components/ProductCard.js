import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Edit, Trash2 } from 'lucide-react-native';

const GREEN = '#2E7D32';
const RED = '#D32F2F';
const GRAY = '#757575';

const ProductCard = ({ item, onEdit, onDelete }) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          {/* PRODUCT IMAGE */}
          <Image
            source={{
              uri: item.image || 'https://via.placeholder.com/120',
            }}
            style={styles.image}
          />
          {/* STATUS */}
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        {/* PRODUCT INFO */}
        <View style={styles.info}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.sku}>SKU: {item.sku}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.label}>MRP</Text>
            <Text style={styles.value}>₹{item.mrp}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.label}>Distributor</Text>
            <Text style={styles.value}>₹{item.distributorPrice}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.label}>Retailer</Text>
            <Text style={styles.value}>₹{item.retailerPrice}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.label}>GST</Text>
            <Text style={styles.value}>{item.gst}%</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.label}>MOQ</Text>
            <Text style={styles.value}>{item.moq}</Text>
          </View>
        </View>

        {/* ACTIONS */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconBtn} onPress={onDelete}>
            <Trash2 size={18} color={RED} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn} onPress={onEdit}>
            <Edit size={18} color={RED} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDECEA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212121',
  },

  sku: {
    fontSize: 12,
    color: GRAY,
    marginTop: 2,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },

  label: {
    fontSize: 13,
    color: GRAY,
  },

  value: {
    fontSize: 13,
    fontWeight: '600',
    color: '#212121',
  },

  statusBadge: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: GREEN,
  },

  topRow: {
    flexDirection: 'row',
  },

  image: {
    // flex:1,
    width: 130,
    height: 160,
    borderRadius: 14,
    backgroundColor: '#F6F6F6',
  },

  info: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 25,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },

  actions: {
    justifyContent: '',
  },

  iconBtn: {
    backgroundColor: '#FDECEA',
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
});

export default ProductCard;
