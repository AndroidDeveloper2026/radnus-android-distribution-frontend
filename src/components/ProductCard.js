// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
// import { Edit, Trash2 } from 'lucide-react-native';

// const GREEN = '#2E7D32';
// const RED = '#D32F2F';
// const GRAY = '#757575';

// const ProductCard = ({ item, onEdit, onDelete }) => {
//   return (
//     <View style={styles.card}>
//       {/* TOP — image + actions */}
//       <View style={styles.topRow}>
//         <Image
//           source={{ uri: item.image || 'https://via.placeholder.com/120' }}
//           style={styles.image}
//         />

//         <View style={styles.info}>
//           <Text style={styles.productName} numberOfLines={2}>
//             {item.name}
//           </Text>
//           <Text style={styles.sku}>SKU: {item.sku}</Text>
//           <Text style={styles.stockText}>Stock: {item.moq ?? 0}</Text>

//           {/* STATUS BADGE */}
//           <View style={styles.statusBadge}>
//             <Text style={styles.statusText}>{item.status}</Text>
//           </View>
          
//         </View>

//         {/* ACTIONS */}
//         <View style={styles.actions}>
//           <TouchableOpacity style={styles.iconBtn} onPress={onDelete}>
//             <Trash2 size={18} color={RED} />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.iconBtn} onPress={onEdit}>
//             <Edit size={18} color={RED} />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* DIVIDER */}
//       <View style={styles.divider} />

//       {/* PRICE GRID — 2 columns */}
//       <View style={styles.grid}>
//         <PriceItem label="Item Cost" value={`₹${item.itemCost ?? 0}`} />
//         <PriceItem
//           label="Distributor"
//           value={`₹${item.distributorPrice ?? 0}`}
//         />
//         <PriceItem label="Retailer" value={`₹${item.retailerPrice ?? 0}`} />
//         <PriceItem label="Walk-in" value={`₹${item.walkinPrice ?? 0}`} />
//         <PriceItem label="MRP" value={`₹${item.mrp ?? 0}`} />
//         <PriceItem label="GST" value={`${item.gst ?? 0}%`} />
//         {/* <PriceItem label="MOQ"             value={`${item.moq ?? 1}`} /> */}
//       </View>
//     </View>
//   );
// };

// /* Small reusable price cell */
// const PriceItem = ({ label, value }) => (
//   <View style={styles.priceItem}>
//     <Text style={styles.priceLabel}>{label}</Text>
//     <Text style={styles.priceValue}>{value}</Text>
//   </View>
// );

// export const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 14,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.06,
//     shadowRadius: 4,
//     elevation: 2,
//   },

//   /* ── TOP ROW ── */
//   topRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },

//   image: {
//     width: 90,
//     height: 90,
//     borderRadius: 12,
//     backgroundColor: '#F6F6F6',
//     resizeMode: 'cover',
//   },

//   info: {
//     flex: 1,
//     marginLeft: 12,
//   },

//   productName: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#212121',
//     lineHeight: 20,
//   },

//   sku: {
//     fontSize: 12,
//     color: GRAY,
//     marginTop: 3,
//     marginBottom: 5,
//   },

//   statusBadge: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#E8F5E9',
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     borderRadius: 20,
//   },

//   statusText: {
//     fontSize: 11,
//     fontWeight: '700',
//     color: GREEN,
//   },

//   stockText: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: GREEN,
//     marginBottom: 5,
//   },

//   actions: {
//     gap: 6,
//     marginLeft: 8,
//   },

//   iconBtn: {
//     backgroundColor: '#FDECEA',
//     padding: 8,
//     borderRadius: 8,
//   },

//   /* ── DIVIDER ── */
//   divider: {
//     height: 1,
//     backgroundColor: '#F0F0F0',
//     marginVertical: 12,
//   },

//   /* ── PRICE GRID ── */
//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },

//   priceItem: {
//     width: '33.33%', // ✅ 3 columns
//     marginBottom: 10,
//     paddingRight: 8,
//   },

//   priceLabel: {
//     fontSize: 11,
//     color: GRAY,
//     marginBottom: 2,
//   },

//   priceValue: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: '#212121',
//   },
// });

// export default ProductCard;

//--------------------------

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Edit, Trash2 } from 'lucide-react-native';

const GREEN = '#2E7D32';
const RED = '#D32F2F';
const GRAY = '#757575';

const ProductCard = ({ item, onEdit, onDelete }) => {
  return (
    <View style={styles.card}>
      {/* TOP — image + actions */}
      <View style={styles.topRow}>
        <Image
          source={{ uri: item.image || 'https://via.placeholder.com/120' }}
          style={styles.image}
        />

        <View style={styles.info}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.sku}>SKU: {item.sku}</Text>
          <Text style={styles.vendor}>Vendor: {item.vendorName || '—'}</Text>
          <Text style={styles.stockText}>Stock: {item.moq ?? 0}</Text>

          {/* STATUS BADGE */}
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
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

      {/* DIVIDER */}
      <View style={styles.divider} />

      {/* PRICE GRID — 2 columns */}
      <View style={styles.grid}>
        <PriceItem label="Item Cost" value={`₹${item.itemCost ?? 0}`} />
        <PriceItem
          label="Distributor"
          value={`₹${item.distributorPrice ?? 0}`}
        />
        <PriceItem label="Retailer" value={`₹${item.retailerPrice ?? 0}`} />
        <PriceItem label="Walk-in" value={`₹${item.walkinPrice ?? 0}`} />
        <PriceItem label="MRP" value={`₹${item.mrp ?? 0}`} />
        <PriceItem label="GST" value={`${item.gst ?? 0}%`} />
      </View>
    </View>
  );
};

/* Small reusable price cell */
const PriceItem = ({ label, value }) => (
  <View style={styles.priceItem}>
    <Text style={styles.priceLabel}>{label}</Text>
    <Text style={styles.priceValue}>{value}</Text>
  </View>
);

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  /* ── TOP ROW ── */
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F6F6F6',
    resizeMode: 'cover',
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212121',
    lineHeight: 20,
  },

  sku: {
    fontSize: 12,
    color: GRAY,
    marginTop: 3,
  },

  vendor: {
    fontSize: 12,
    color: GRAY,
    marginTop: 3,
  },

  stockText: {
    fontSize: 14,
    fontWeight: '700',
    color: GREEN,
    marginTop: 5,
    marginBottom: 5,
  },

  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: GREEN,
  },

  actions: {
    gap: 6,
    marginLeft: 8,
  },

  iconBtn: {
    backgroundColor: '#FDECEA',
    padding: 8,
    borderRadius: 8,
  },

  /* ── DIVIDER ── */
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },

  /* ── PRICE GRID ── */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  priceItem: {
    width: '33.33%',
    marginBottom: 10,
    paddingRight: 8,
  },

  priceLabel: {
    fontSize: 11,
    color: GRAY,
    marginBottom: 2,
  },

  priceValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#212121',
  },
});

export default ProductCard;