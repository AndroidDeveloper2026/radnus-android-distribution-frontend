// CartReviewScreen.js
// The dedicated "cart" screen — reached by tapping the floating mini cart
// bar on OrderCart, same as Zepto / Instamart. Shows everything the user
// selected, lets them adjust quantities or remove items, and places the
// order.
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingBag, Minus, Plus, Trash2, Package } from 'lucide-react-native';

import Header from '../../components/Header';
import { useCart } from '../../context/CartContext';
import styles from './CartReviewStyle';

const ACCENT = '#D32F2F';
const WHITE = '#FFFFFF';
const GREY = '#666';

const CartLineItem = React.memo(
  ({ item, onIncrement, onDecrement, onRemove }) => {
    const unitPrice = item.totalQty > 0 ? item.totalAmount / item.totalQty : 0;

    return (
      <View style={styles.card}>
        {/* ── Top: image + name/sku/unit-price + remove ── */}
        <View style={styles.topRow}>
          <View style={styles.imageBox}>
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Package size={22} color="#ccc" />
              </View>
            )}
          </View>

          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.meta}>SKU: {item.sku}</Text>
            <Text style={styles.unitPrice}>
              ₹{unitPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}{' '}
              <Text style={styles.unitPriceSuffix}>/ unit</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => onRemove(item.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Trash2 size={16} color={ACCENT} />
          </TouchableOpacity>
        </View>

        {/* ── Divider ── */}
        <View style={styles.divider} />

        {/* ── Bottom: quantity stepper + line subtotal, clearly separated ── */}
        <View style={styles.bottomRow}>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => onDecrement(item)}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Minus size={15} color="#212121" />
            </TouchableOpacity>
            <Text style={styles.stepQty}>{item.totalQty}</Text>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => onIncrement(item)}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Plus size={15} color="#212121" />
            </TouchableOpacity>
          </View>

          <View style={styles.subtotalBlock}>
            <Text style={styles.subtotalLabel}>Subtotal</Text>
            <Text style={styles.subtotal}>
              ₹{item.totalAmount.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>
      </View>
    );
  }
);

const CartReviewScreen = ({ navigation }) => {
  const {
    cartItems,
    totalItems,
    totalAmount,
    priceType,
    productBatches,
    batchAvailability,
    updateBatchQty,
    removeItem,
    clearOrderedItems,
  } = useCart();

  const [placing, setPlacing] = useState(false);

  // Resolve which batch to bump for +/- taps: prefer the currently
  // selected batch, otherwise fall back to whichever batch already has
  // stock allocated.
  const resolveBatchNo = useCallback((item) => {
    if (item.selectedBatchNo) return item.selectedBatchNo;
    const keys = Object.keys(item.batchQuantities || {});
    return keys.length ? keys[0] : 'default';
  }, []);

  const handleIncrement = useCallback(
    (item) => {
      const batchNo = resolveBatchNo(item);
      const avail = batchAvailability[item.id] || [];
      const ab = avail.find((b) => b.batchNo === batchNo);
      const cap = ab ? ab.quantityAvailable : item.currentStock || 999;
      const current = item.batchQuantities[batchNo] || 0;
      if (current >= cap) {
        Alert.alert('Stock limit', `Only ${cap} units available for this batch.`);
        return;
      }
      updateBatchQty(item.id, batchNo, current + 1);
    },
    [batchAvailability, resolveBatchNo, updateBatchQty]
  );

  const handleDecrement = useCallback(
    (item) => {
      const batchNo = resolveBatchNo(item);
      const current = item.batchQuantities[batchNo] || 0;
      updateBatchQty(item.id, batchNo, Math.max(0, current - 1));
    },
    [resolveBatchNo, updateBatchQty]
  );

  const handleRemove = useCallback(
    (productId) => {
      removeItem(productId);
    },
    [removeItem]
  );

  const handlePlaceOrder = useCallback(async () => {
    if (!cartItems.length) {
      Alert.alert('Empty Cart', 'Add at least one item.');
      return;
    }

    const errors = [];
    const batchSelections = {};

    cartItems.forEach((item) => {
      const hasBatches = (productBatches[item.id] || []).length > 0;
      const avail = batchAvailability[item.id] || [];
      const allocations = [];

      if (hasBatches && Object.keys(item.batchQuantities).length > 0) {
        Object.entries(item.batchQuantities).forEach(([batchNo, qty]) => {
          if (qty > 0) {
            const ab = avail.find((b) => b.batchNo === batchNo);
            const availQty = ab?.quantityAvailable || 0;
            if (qty > availQty) {
              errors.push(
                `${item.name} (${batchNo}): requested ${qty}, available ${availQty}`
              );
              return;
            }
            const batch = productBatches[item.id]?.find((b) => b.batchNo === batchNo);
            const price = batch?.[priceType] || batch?.purchasePrice || item[priceType] || 0;
            allocations.push({
              batchNumber: batchNo,
              qty,
              purchaseCost: batch?.purchasePrice || 0,
              sellingPrice: Number(price) || 0,
            });
          }
        });
      } else {
        allocations.push({
          batchNumber: 'default',
          qty: item.totalQty,
          purchaseCost: 0,
          sellingPrice: Number(item[priceType]) || 0,
        });
      }

      if (allocations.length > 0) {
        batchSelections[item.id] = {
          productId: item.id,
          name: item.name,
          totalQty: item.totalQty,
          batchAllocations: allocations,
        };
      }
    });

    if (errors.length) {
      Alert.alert('Stock Error', errors.join('\n'));
      return;
    }

    setPlacing(true);
    try {
      const orderedItems = cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        qty: item.totalQty,
        price: item.totalAmount / item.totalQty,
        batchAllocations: batchSelections[item.id]?.batchAllocations || [],
      }));
      const orderedIds = cartItems.map((i) => i.id);

      navigation.navigate('OrderSuccess', {
        cartItems: orderedItems,
        grandTotal: totalAmount,
        paymentMode: 'Cash',
        date: new Date().toISOString(),
        priceType,
        batchSelections,
        showBatchSelector: true,
        multiBatchOrder: true,
      });

      clearOrderedItems(orderedIds);
    } catch (e) {
      Alert.alert('Error', 'Failed to proceed. Please try again.');
    } finally {
      setPlacing(false);
    }
  }, [
    cartItems,
    totalAmount,
    priceType,
    productBatches,
    batchAvailability,
    clearOrderedItems,
    navigation,
  ]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Header title={`Your Cart (${totalItems})`} />

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ShoppingBag size={52} color="#ddd" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>
            Add some products to see them here.
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.browseBtnText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(i) => i.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <CartLineItem
                item={item}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                onRemove={handleRemove}
              />
            )}
            ListFooterComponent={
              <TouchableOpacity
                style={styles.addMoreBtn}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Text style={styles.addMoreBtnText}>+ Add more items</Text>
              </TouchableOpacity>
            }
          />

          <View style={styles.footer}>
            <View>
              <Text style={styles.footerLabel}>Total ({totalItems} items)</Text>
              <Text style={styles.footerTotal}>
                ₹{totalAmount.toLocaleString('en-IN')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.placeBtn}
              onPress={handlePlaceOrder}
              disabled={placing}
            >
              {placing ? (
                <ActivityIndicator size="small" color={WHITE} />
              ) : (
                <Text style={styles.placeBtnText}>PLACE ORDER</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default CartReviewScreen;

//------------- 02.09.2026 ---------------------
// // CartReviewScreen.js
// // The dedicated "cart" screen — reached by tapping the floating mini cart
// // bar on OrderCart, same as Zepto / Instamart. Shows everything the user
// // selected, lets them adjust quantities or remove items, and places the
// // order.
// import React, { useCallback, useMemo, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   FlatList,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { ShoppingBag, Minus, Plus, Trash2, Package } from 'lucide-react-native';

// import Header from '../../components/Header';
// import { useCart } from '../../context/CartContext';
// import styles from './CartReviewStyle';

// const ACCENT = '#D32F2F';
// const WHITE = '#FFFFFF';
// const GREY = '#666';

// const CartLineItem = React.memo(
//   ({ item, onIncrement, onDecrement, onRemove }) => {
//     const unitPrice = item.totalQty > 0 ? item.totalAmount / item.totalQty : 0;

//     return (
//       <View style={styles.card}>
//         <View style={styles.imageBox}>
//           {item.image ? (
//             <Image
//               source={{ uri: item.image }}
//               style={styles.image}
//               resizeMode="cover"
//             />
//           ) : (
//             <View style={styles.imagePlaceholder}>
//               <Package size={20} color="#ccc" />
//             </View>
//           )}
//         </View>

//         <View style={styles.info}>
//           <Text style={styles.name} numberOfLines={2}>
//             {item.name}
//           </Text>
//           <Text style={styles.meta}>SKU: {item.sku}</Text>
//           <Text style={styles.unitPrice}>
//             ₹{unitPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })} / unit
//           </Text>
//         </View>

//         <View style={styles.rightCol}>
//           <TouchableOpacity
//             style={styles.removeBtn}
//             onPress={() => onRemove(item.id)}
//             hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//           >
//             <Trash2 size={14} color={ACCENT} />
//           </TouchableOpacity>

//           <View style={styles.stepper}>
//             <TouchableOpacity
//               style={styles.stepBtn}
//               onPress={() => onDecrement(item)}
//             >
//               <Minus size={14} color="#212121" />
//             </TouchableOpacity>
//             <Text style={styles.stepQty}>{item.totalQty}</Text>
//             <TouchableOpacity
//               style={styles.stepBtn}
//               onPress={() => onIncrement(item)}
//             >
//               <Plus size={14} color="#212121" />
//             </TouchableOpacity>
//           </View>

//           <Text style={styles.subtotal}>
//             ₹{item.totalAmount.toLocaleString('en-IN')}
//           </Text>
//         </View>
//       </View>
//     );
//   }
// );

// const CartReviewScreen = ({ navigation }) => {
//   const {
//     cartItems,
//     totalItems,
//     totalAmount,
//     priceType,
//     productBatches,
//     batchAvailability,
//     updateBatchQty,
//     removeItem,
//     clearOrderedItems,
//   } = useCart();

//   const [placing, setPlacing] = useState(false);

//   // Resolve which batch to bump for +/- taps: prefer the currently
//   // selected batch, otherwise fall back to whichever batch already has
//   // stock allocated.
//   const resolveBatchNo = useCallback((item) => {
//     if (item.selectedBatchNo) return item.selectedBatchNo;
//     const keys = Object.keys(item.batchQuantities || {});
//     return keys.length ? keys[0] : 'default';
//   }, []);

//   const handleIncrement = useCallback(
//     (item) => {
//       const batchNo = resolveBatchNo(item);
//       const avail = batchAvailability[item.id] || [];
//       const ab = avail.find((b) => b.batchNo === batchNo);
//       const cap = ab ? ab.quantityAvailable : item.currentStock || 999;
//       const current = item.batchQuantities[batchNo] || 0;
//       if (current >= cap) {
//         Alert.alert('Stock limit', `Only ${cap} units available for this batch.`);
//         return;
//       }
//       updateBatchQty(item.id, batchNo, current + 1);
//     },
//     [batchAvailability, resolveBatchNo, updateBatchQty]
//   );

//   const handleDecrement = useCallback(
//     (item) => {
//       const batchNo = resolveBatchNo(item);
//       const current = item.batchQuantities[batchNo] || 0;
//       updateBatchQty(item.id, batchNo, Math.max(0, current - 1));
//     },
//     [resolveBatchNo, updateBatchQty]
//   );

//   const handleRemove = useCallback(
//     (productId) => {
//       removeItem(productId);
//     },
//     [removeItem]
//   );

//   const handlePlaceOrder = useCallback(async () => {
//     if (!cartItems.length) {
//       Alert.alert('Empty Cart', 'Add at least one item.');
//       return;
//     }

//     const errors = [];
//     const batchSelections = {};

//     cartItems.forEach((item) => {
//       const hasBatches = (productBatches[item.id] || []).length > 0;
//       const avail = batchAvailability[item.id] || [];
//       const allocations = [];

//       if (hasBatches && Object.keys(item.batchQuantities).length > 0) {
//         Object.entries(item.batchQuantities).forEach(([batchNo, qty]) => {
//           if (qty > 0) {
//             const ab = avail.find((b) => b.batchNo === batchNo);
//             const availQty = ab?.quantityAvailable || 0;
//             if (qty > availQty) {
//               errors.push(
//                 `${item.name} (${batchNo}): requested ${qty}, available ${availQty}`
//               );
//               return;
//             }
//             const batch = productBatches[item.id]?.find((b) => b.batchNo === batchNo);
//             const price = batch?.[priceType] || batch?.purchasePrice || item[priceType] || 0;
//             allocations.push({
//               batchNumber: batchNo,
//               qty,
//               purchaseCost: batch?.purchasePrice || 0,
//               sellingPrice: Number(price) || 0,
//             });
//           }
//         });
//       } else {
//         allocations.push({
//           batchNumber: 'default',
//           qty: item.totalQty,
//           purchaseCost: 0,
//           sellingPrice: Number(item[priceType]) || 0,
//         });
//       }

//       if (allocations.length > 0) {
//         batchSelections[item.id] = {
//           productId: item.id,
//           name: item.name,
//           totalQty: item.totalQty,
//           batchAllocations: allocations,
//         };
//       }
//     });

//     if (errors.length) {
//       Alert.alert('Stock Error', errors.join('\n'));
//       return;
//     }

//     setPlacing(true);
//     try {
//       const orderedItems = cartItems.map((item) => ({
//         id: item.id,
//         name: item.name,
//         qty: item.totalQty,
//         price: item.totalAmount / item.totalQty,
//         batchAllocations: batchSelections[item.id]?.batchAllocations || [],
//       }));
//       const orderedIds = cartItems.map((i) => i.id);

//       navigation.navigate('OrderSuccess', {
//         cartItems: orderedItems,
//         grandTotal: totalAmount,
//         paymentMode: 'Cash',
//         date: new Date().toISOString(),
//         priceType,
//         batchSelections,
//         showBatchSelector: true,
//         multiBatchOrder: true,
//       });

//       clearOrderedItems(orderedIds);
//     } catch (e) {
//       Alert.alert('Error', 'Failed to proceed. Please try again.');
//     } finally {
//       setPlacing(false);
//     }
//   }, [
//     cartItems,
//     totalAmount,
//     priceType,
//     productBatches,
//     batchAvailability,
//     clearOrderedItems,
//     navigation,
//   ]);

//   return (
//     <SafeAreaView style={styles.container} edges={['bottom']}>
//       <Header title={`Your Cart (${totalItems})`} />

//       {cartItems.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <ShoppingBag size={52} color="#ddd" />
//           <Text style={styles.emptyTitle}>Your cart is empty</Text>
//           <Text style={styles.emptyText}>
//             Add some products to see them here.
//           </Text>
//           <TouchableOpacity
//             style={styles.browseBtn}
//             onPress={() => navigation.goBack()}
//           >
//             <Text style={styles.browseBtnText}>Browse Products</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <>
//           <FlatList
//             data={cartItems}
//             keyExtractor={(i) => i.id}
//             contentContainerStyle={styles.listContent}
//             renderItem={({ item }) => (
//               <CartLineItem
//                 item={item}
//                 onIncrement={handleIncrement}
//                 onDecrement={handleDecrement}
//                 onRemove={handleRemove}
//               />
//             )}
//           />

//           <View style={styles.footer}>
//             <View>
//               <Text style={styles.footerLabel}>Total ({totalItems} items)</Text>
//               <Text style={styles.footerTotal}>
//                 ₹{totalAmount.toLocaleString('en-IN')}
//               </Text>
//             </View>
//             <TouchableOpacity
//               style={styles.placeBtn}
//               onPress={handlePlaceOrder}
//               disabled={placing}
//             >
//               {placing ? (
//                 <ActivityIndicator size="small" color={WHITE} />
//               ) : (
//                 <Text style={styles.placeBtnText}>PLACE ORDER</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </>
//       )}
//     </SafeAreaView>
//   );
// };

// export default CartReviewScreen;
