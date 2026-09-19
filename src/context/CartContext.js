// CartContext.js
// Shared cart state so the product-browsing screen (OrderCart) and the
// dedicated checkout screen (CartReview) always stay perfectly in sync —
// same pattern used by Zepto / Instamart: browse -> tiny "View Cart" bar
// appears -> tap it -> full cart/checkout screen -> Place Order.
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../services/features/products/productSlice';
import {
  fetchProductBatches,
  fetchAllBatchAvailability,
} from '../services/features/purchase/purchaseSlice';

export const PRICE_TYPES = [
  { label: 'Retailer', value: 'retailerPrice' },
  { label: 'Distributor', value: 'distributorPrice' },
  { label: 'Walk-in', value: 'walkinPrice' },
  { label: 'MRP', value: 'mrp' },
];

const getNum = (obj, key) => {
  const v = obj?.[key];
  return v !== undefined && v !== null ? Number(v) || 0 : 0;
};

const getStr = (obj, key) => {
  const v = obj?.[key];
  return v !== undefined && v !== null ? String(v).trim() : '';
};

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const dispatch = useDispatch();
  const products = useSelector((s) => s.products.list);
  const productBatches = useSelector((s) => s.purchase.productBatches);
  const batchAvailability = useSelector((s) => s.purchase.batchAvailability);

  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [priceType, setPriceType] = useState('retailerPrice');
  const [editingPriceId, setEditingPriceId] = useState(null);

  const hasInit = useRef(false);
  const batchInit = useRef(false);
  const fetchStarted = useRef(false);

  // ── Load products ──
  // NOTE: this is intentionally NOT an effect that runs when the provider
  // mounts. The provider now lives above the whole navigator (so OrderCart
  // and CartReview can share state), which includes the Splash/Login
  // screens — firing an authenticated API call before login caused 401 →
  // refresh-fail → logout loops ("Maximum update depth exceeded").
  // Instead, OrderCart calls `ensureProductsLoaded()` itself once it mounts
  // (i.e. once the user is actually logged in and on that screen), exactly
  // like the original screen-owned fetch did.
  const ensureProductsLoaded = useCallback(async () => {
    if (fetchStarted.current) return;
    fetchStarted.current = true;
    try {
      await dispatch(fetchProducts());
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const categories = useMemo(() => {
    const s = new Set();
    products.forEach((p) => {
      if (p.category) s.add(p.category);
    });
    return Array.from(s).sort();
  }, [products]);

  // ── Build cart rows from products (once) ──
  useEffect(() => {
    if (!products.length || hasInit.current) return;

    const newCart = products.map((p) => ({
      id: getStr(p, '_id') || getStr(p, 'id'),
      name: getStr(p, 'name'),
      sku: getStr(p, 'sku'),
      category: getStr(p, 'category'),
      retailerPrice: getNum(p, 'retailerPrice'),
      distributorPrice: getNum(p, 'distributorPrice'),
      walkinPrice: getNum(p, 'walkinPrice'),
      mrp: getNum(p, 'mrp'),
      image: p.image ?? null,
      currentStock: Math.max(
        0,
        getNum(p, 'moq') || getNum(p, 'currentStock') || getNum(p, 'stock') || 999
      ),
      batchQuantities: {},
      selectedBatchNo: null,
      totalQty: 0,
      batchCustomPrices: {},
      customDefaultPrice: {},
      addedToCartAt: null,
    }));

    setCart(newCart);
    hasInit.current = true;
  }, [products]);

  // ── Fetch batches ──
  useEffect(() => {
    if (!cart.length || batchInit.current) return;
    const ids = cart.map((i) => i.id).filter(Boolean);
    if (!ids.length) return;

    dispatch(fetchProductBatches(ids));
    // ✅ FIX: was `ids.forEach(id => dispatch(fetchBatchAvailability(id)))` —
    // one Redux dispatch PER PRODUCT, causing N rapid-fire state updates
    // (each re-running the auto-select effect over the whole cart) which
    // is what was tripping "Maximum update depth exceeded" and making the
    // screen slow. This fires the same underlying requests but resolves
    // them together and updates Redux exactly once.
    dispatch(fetchAllBatchAvailability(ids));
    batchInit.current = true;
  }, [cart, dispatch]);

  // ── Auto-select first available batch ──
  useEffect(() => {
    if (!Object.keys(productBatches).length) return;

    setCart((prev) => {
      let changed = false;
      const next = prev.map((item) => {
        const avail = batchAvailability[item.id] || [];
        if (!item.selectedBatchNo && avail.length > 0) {
          const first = avail.find((b) => b.quantityAvailable > 0);
          if (first) {
            changed = true;
            return { ...item, selectedBatchNo: first.batchNo };
          }
        }
        return item;
      });
      return changed ? next : prev;
    });
  }, [productBatches, batchAvailability]);

  // ── Cart actions ──
  const updateBatchQty = useCallback((productId, batchNo, newQty) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === productId);
      if (idx === -1) return prev;
      const item = prev[idx];
      const bq = { ...item.batchQuantities };

      if (newQty <= 0) {
        delete bq[batchNo];
      } else {
        bq[batchNo] = newQty;
      }

      const total = Object.values(bq).reduce((s, q) => s + q, 0);
      const next = [...prev];
      next[idx] = {
        ...item,
        batchQuantities: bq,
        totalQty: total,
        addedToCartAt: total > 0 ? item.addedToCartAt || Date.now() : null,
      };
      return next;
    });
  }, []);

  // Remove every unit of a product from the cart in one tap (used on the
  // Cart Review screen).
  const removeItem = useCallback((productId) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === productId);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = {
        ...prev[idx],
        batchQuantities: {},
        totalQty: 0,
        addedToCartAt: null,
      };
      return next;
    });
  }, []);

  const handleSelectBatch = useCallback(
    (productId, batchNo) => {
      const avail = batchAvailability[productId] || [];
      const batch = avail.find((b) => b.batchNo === batchNo);
      if (!batch || batch.quantityAvailable <= 0) return;

      setCart((prev) => {
        const idx = prev.findIndex((i) => i.id === productId);
        if (idx === -1) return prev;
        const next = [...prev];
        next[idx] = { ...prev[idx], selectedBatchNo: batchNo };
        return next;
      });
    },
    [batchAvailability]
  );

  const saveBatchCustomPrice = useCallback(
    (productId, batchNo, price) => {
      setCart((prev) => {
        const idx = prev.findIndex((i) => i.id === productId);
        if (idx === -1) return prev;
        const item = prev[idx];
        const bp = {
          ...item.batchCustomPrices,
          [batchNo]: {
            ...(item.batchCustomPrices[batchNo] || {}),
            [priceType]: price,
          },
        };
        const next = [...prev];
        next[idx] = { ...item, batchCustomPrices: bp };
        return next;
      });
    },
    [priceType]
  );

  const saveDefaultPrice = useCallback(
    (productId, price) => {
      setCart((prev) => {
        const idx = prev.findIndex((i) => i.id === productId);
        if (idx === -1) return prev;
        const next = [...prev];
        next[idx] = {
          ...prev[idx],
          customDefaultPrice: {
            ...prev[idx].customDefaultPrice,
            [priceType]: price,
          },
        };
        return next;
      });
    },
    [priceType]
  );

  const togglePriceEdit = useCallback((id) => {
    setEditingPriceId((prev) => (prev === id ? null : id));
  }, []);

  // ── Derived: items actually in the cart, with computed price/subtotal ──
  const cartItems = useMemo(() => {
    return cart
      .filter((i) => i.totalQty > 0)
      .map((item) => {
        let totalAmount = 0;
        const breakdown = [];

        if (Object.keys(item.batchQuantities).length > 0) {
          Object.entries(item.batchQuantities).forEach(([batchNo, qty]) => {
            if (qty > 0) {
              const batch = productBatches[item.id]?.find((b) => b.batchNo === batchNo);
              let price = 0;
              if (batch && batch[priceType] !== undefined && batch[priceType] !== null) {
                price = Number(batch[priceType]) || 0;
              } else if (batch) {
                price = Number(batch.purchasePrice) || 0;
              } else {
                price = Number(item[priceType]) || 0;
              }
              const subtotal = qty * price;
              totalAmount += subtotal;
              breakdown.push({ batchNo, qty, price, subtotal });
            }
          });
        } else {
          const price = Number(item[priceType]) || 0;
          totalAmount = item.totalQty * price;
          breakdown.push({ batchNo: 'default', qty: item.totalQty, price, subtotal: totalAmount });
        }

        return {
          ...item,
          batchBreakdown: breakdown,
          totalAmount,
        };
      })
      .sort((a, b) => (a.addedToCartAt || 0) - (b.addedToCartAt || 0));
  }, [cart, productBatches, priceType]);

  const totalItems = useMemo(
    () => cartItems.reduce((s, i) => s + i.totalQty, 0),
    [cartItems]
  );
  const totalAmount = useMemo(
    () => cartItems.reduce((s, i) => s + i.totalAmount, 0),
    [cartItems]
  );

  // Clear only the items that were just placed into an order.
  const clearOrderedItems = useCallback((orderedIds) => {
    setCart((prev) =>
      prev.map((item) =>
        orderedIds.includes(item.id)
          ? { ...item, batchQuantities: {}, totalQty: 0, addedToCartAt: null }
          : item
      )
    );
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      ensureProductsLoaded,
      cart,
      categories,
      productBatches,
      batchAvailability,
      priceType,
      setPriceType,
      editingPriceId,
      togglePriceEdit,
      updateBatchQty,
      removeItem,
      handleSelectBatch,
      saveBatchCustomPrice,
      saveDefaultPrice,
      cartItems,
      totalItems,
      totalAmount,
      clearOrderedItems,
    }),
    [
      isLoading,
      ensureProductsLoaded,
      cart,
      categories,
      productBatches,
      batchAvailability,
      priceType,
      editingPriceId,
      togglePriceEdit,
      updateBatchQty,
      removeItem,
      handleSelectBatch,
      saveBatchCustomPrice,
      saveDefaultPrice,
      cartItems,
      totalItems,
      totalAmount,
      clearOrderedItems,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
};

//------------- 02.09.2026 ---------------------------
// import React, {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchProducts } from '../services/features/products/productSlice';
// import {
//   fetchProductBatches,
//   fetchBatchAvailability,
// } from '../services/features/purchase/purchaseSlice';

// export const PRICE_TYPES = [
//   { label: 'Retailer', value: 'retailerPrice' },
//   { label: 'Distributor', value: 'distributorPrice' },
//   { label: 'Walk-in', value: 'walkinPrice' },
//   { label: 'MRP', value: 'mrp' },
// ];

// const getNum = (obj, key) => {
//   const v = obj?.[key];
//   return v !== undefined && v !== null ? Number(v) || 0 : 0;
// };

// const getStr = (obj, key) => {
//   const v = obj?.[key];
//   return v !== undefined && v !== null ? String(v).trim() : '';
// };

// const CartContext = createContext(null);

// export const CartProvider = ({ children }) => {
//   const dispatch = useDispatch();
//   const products = useSelector((s) => s.products.list);
//   const productBatches = useSelector((s) => s.purchase.productBatches);
//   const batchAvailability = useSelector((s) => s.purchase.batchAvailability);

//   const [isLoading, setIsLoading] = useState(true);
//   const [cart, setCart] = useState([]);
//   const [priceType, setPriceType] = useState('retailerPrice');
//   const [editingPriceId, setEditingPriceId] = useState(null);

//   const hasInit = useRef(false);
//   const batchInit = useRef(false);
//   const fetchStarted = useRef(false);

//   // ── Load products ──
//   // NOTE: this is intentionally NOT an effect that runs when the provider
//   // mounts. The provider now lives above the whole navigator (so OrderCart
//   // and CartReview can share state), which includes the Splash/Login
//   // screens — firing an authenticated API call before login caused 401 →
//   // refresh-fail → logout loops ("Maximum update depth exceeded").
//   // Instead, OrderCart calls `ensureProductsLoaded()` itself once it mounts
//   // (i.e. once the user is actually logged in and on that screen), exactly
//   // like the original screen-owned fetch did.
//   const ensureProductsLoaded = useCallback(async () => {
//     if (fetchStarted.current) return;
//     fetchStarted.current = true;
//     try {
//       await dispatch(fetchProducts());
//     } catch (error) {
//       console.error('Error loading products:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [dispatch]);

//   const categories = useMemo(() => {
//     const s = new Set();
//     products.forEach((p) => {
//       if (p.category) s.add(p.category);
//     });
//     return Array.from(s).sort();
//   }, [products]);

//   // ── Build cart rows from products (once) ──
//   useEffect(() => {
//     if (!products.length || hasInit.current) return;

//     const newCart = products.map((p) => ({
//       id: getStr(p, '_id') || getStr(p, 'id'),
//       name: getStr(p, 'name'),
//       sku: getStr(p, 'sku'),
//       category: getStr(p, 'category'),
//       retailerPrice: getNum(p, 'retailerPrice'),
//       distributorPrice: getNum(p, 'distributorPrice'),
//       walkinPrice: getNum(p, 'walkinPrice'),
//       mrp: getNum(p, 'mrp'),
//       image: p.image ?? null,
//       currentStock: Math.max(
//         0,
//         getNum(p, 'moq') || getNum(p, 'currentStock') || getNum(p, 'stock') || 999
//       ),
//       batchQuantities: {},
//       selectedBatchNo: null,
//       totalQty: 0,
//       batchCustomPrices: {},
//       customDefaultPrice: {},
//       addedToCartAt: null,
//     }));

//     setCart(newCart);
//     hasInit.current = true;
//   }, [products]);

//   // ── Fetch batches ──
//   useEffect(() => {
//     if (!cart.length || batchInit.current) return;
//     const ids = cart.map((i) => i.id).filter(Boolean);
//     if (!ids.length) return;

//     dispatch(fetchProductBatches(ids));
//     ids.forEach((id) => dispatch(fetchBatchAvailability(id)));
//     batchInit.current = true;
//   }, [cart, dispatch]);

//   // ── Auto-select first available batch ──
//   useEffect(() => {
//     if (!Object.keys(productBatches).length) return;

//     setCart((prev) => {
//       let changed = false;
//       const next = prev.map((item) => {
//         const avail = batchAvailability[item.id] || [];
//         if (!item.selectedBatchNo && avail.length > 0) {
//           const first = avail.find((b) => b.quantityAvailable > 0);
//           if (first) {
//             changed = true;
//             return { ...item, selectedBatchNo: first.batchNo };
//           }
//         }
//         return item;
//       });
//       return changed ? next : prev;
//     });
//   }, [productBatches, batchAvailability]);

//   // ── Cart actions ──
//   const updateBatchQty = useCallback((productId, batchNo, newQty) => {
//     setCart((prev) => {
//       const idx = prev.findIndex((i) => i.id === productId);
//       if (idx === -1) return prev;
//       const item = prev[idx];
//       const bq = { ...item.batchQuantities };

//       if (newQty <= 0) {
//         delete bq[batchNo];
//       } else {
//         bq[batchNo] = newQty;
//       }

//       const total = Object.values(bq).reduce((s, q) => s + q, 0);
//       const next = [...prev];
//       next[idx] = {
//         ...item,
//         batchQuantities: bq,
//         totalQty: total,
//         addedToCartAt: total > 0 ? item.addedToCartAt || Date.now() : null,
//       };
//       return next;
//     });
//   }, []);

//   // Remove every unit of a product from the cart in one tap (used on the
//   // Cart Review screen).
//   const removeItem = useCallback((productId) => {
//     setCart((prev) => {
//       const idx = prev.findIndex((i) => i.id === productId);
//       if (idx === -1) return prev;
//       const next = [...prev];
//       next[idx] = {
//         ...prev[idx],
//         batchQuantities: {},
//         totalQty: 0,
//         addedToCartAt: null,
//       };
//       return next;
//     });
//   }, []);

//   const handleSelectBatch = useCallback(
//     (productId, batchNo) => {
//       const avail = batchAvailability[productId] || [];
//       const batch = avail.find((b) => b.batchNo === batchNo);
//       if (!batch || batch.quantityAvailable <= 0) return;

//       setCart((prev) => {
//         const idx = prev.findIndex((i) => i.id === productId);
//         if (idx === -1) return prev;
//         const next = [...prev];
//         next[idx] = { ...prev[idx], selectedBatchNo: batchNo };
//         return next;
//       });
//     },
//     [batchAvailability]
//   );

//   const saveBatchCustomPrice = useCallback(
//     (productId, batchNo, price) => {
//       setCart((prev) => {
//         const idx = prev.findIndex((i) => i.id === productId);
//         if (idx === -1) return prev;
//         const item = prev[idx];
//         const bp = {
//           ...item.batchCustomPrices,
//           [batchNo]: {
//             ...(item.batchCustomPrices[batchNo] || {}),
//             [priceType]: price,
//           },
//         };
//         const next = [...prev];
//         next[idx] = { ...item, batchCustomPrices: bp };
//         return next;
//       });
//     },
//     [priceType]
//   );

//   const saveDefaultPrice = useCallback(
//     (productId, price) => {
//       setCart((prev) => {
//         const idx = prev.findIndex((i) => i.id === productId);
//         if (idx === -1) return prev;
//         const next = [...prev];
//         next[idx] = {
//           ...prev[idx],
//           customDefaultPrice: {
//             ...prev[idx].customDefaultPrice,
//             [priceType]: price,
//           },
//         };
//         return next;
//       });
//     },
//     [priceType]
//   );

//   const togglePriceEdit = useCallback((id) => {
//     setEditingPriceId((prev) => (prev === id ? null : id));
//   }, []);

//   // ── Derived: items actually in the cart, with computed price/subtotal ──
//   const cartItems = useMemo(() => {
//     return cart
//       .filter((i) => i.totalQty > 0)
//       .map((item) => {
//         let totalAmount = 0;
//         const breakdown = [];

//         if (Object.keys(item.batchQuantities).length > 0) {
//           Object.entries(item.batchQuantities).forEach(([batchNo, qty]) => {
//             if (qty > 0) {
//               const batch = productBatches[item.id]?.find((b) => b.batchNo === batchNo);
//               let price = 0;
//               if (batch && batch[priceType] !== undefined && batch[priceType] !== null) {
//                 price = Number(batch[priceType]) || 0;
//               } else if (batch) {
//                 price = Number(batch.purchasePrice) || 0;
//               } else {
//                 price = Number(item[priceType]) || 0;
//               }
//               const subtotal = qty * price;
//               totalAmount += subtotal;
//               breakdown.push({ batchNo, qty, price, subtotal });
//             }
//           });
//         } else {
//           const price = Number(item[priceType]) || 0;
//           totalAmount = item.totalQty * price;
//           breakdown.push({ batchNo: 'default', qty: item.totalQty, price, subtotal: totalAmount });
//         }

//         return {
//           ...item,
//           batchBreakdown: breakdown,
//           totalAmount,
//         };
//       })
//       .sort((a, b) => (a.addedToCartAt || 0) - (b.addedToCartAt || 0));
//   }, [cart, productBatches, priceType]);

//   const totalItems = useMemo(
//     () => cartItems.reduce((s, i) => s + i.totalQty, 0),
//     [cartItems]
//   );
//   const totalAmount = useMemo(
//     () => cartItems.reduce((s, i) => s + i.totalAmount, 0),
//     [cartItems]
//   );

//   // Clear only the items that were just placed into an order.
//   const clearOrderedItems = useCallback((orderedIds) => {
//     setCart((prev) =>
//       prev.map((item) =>
//         orderedIds.includes(item.id)
//           ? { ...item, batchQuantities: {}, totalQty: 0, addedToCartAt: null }
//           : item
//       )
//     );
//   }, []);

//   const value = useMemo(
//     () => ({
//       isLoading,
//       ensureProductsLoaded,
//       cart,
//       categories,
//       productBatches,
//       batchAvailability,
//       priceType,
//       setPriceType,
//       editingPriceId,
//       togglePriceEdit,
//       updateBatchQty,
//       removeItem,
//       handleSelectBatch,
//       saveBatchCustomPrice,
//       saveDefaultPrice,
//       cartItems,
//       totalItems,
//       totalAmount,
//       clearOrderedItems,
//     }),
//     [
//       isLoading,
//       ensureProductsLoaded,
//       cart,
//       categories,
//       productBatches,
//       batchAvailability,
//       priceType,
//       editingPriceId,
//       togglePriceEdit,
//       updateBatchQty,
//       removeItem,
//       handleSelectBatch,
//       saveBatchCustomPrice,
//       saveDefaultPrice,
//       cartItems,
//       totalItems,
//       totalAmount,
//       clearOrderedItems,
//     ]
//   );

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };

// export const useCart = () => {
//   const ctx = useContext(CartContext);
//   if (!ctx) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return ctx;
// };
