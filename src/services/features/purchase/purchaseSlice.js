import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../API/api';

// ─── Suppliers ────────────────────────────────────────────────────

export const fetchSuppliers = createAsyncThunk(
  'purchase/fetchSuppliers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/api/suppliers');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to fetch suppliers');
    }
  }
);

export const addSupplier = createAsyncThunk(
  'purchase/addSupplier',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await API.post('/api/suppliers', payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to add supplier');
    }
  }
);

// ─── Purchase Entries ─────────────────────────────────────────────

export const fetchPurchases = createAsyncThunk(
  'purchase/fetchPurchases',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') params.set(k, v);
      });
      const qs = params.toString();
      const res = await API.get(`/api/purchases${qs ? `?${qs}` : ''}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to fetch purchases');
    }
  }
);

export const createPurchase = createAsyncThunk(
  'purchase/createPurchase',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await API.post('/api/purchases', payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to save purchase entry');
    }
  }
);

export const updatePurchase = createAsyncThunk(
  'purchase/updatePurchase',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/api/purchases/${id}`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to update purchase');
    }
  }
);

// ─── Product Price History ────────────────────────────────────────

export const fetchProductPriceHistory = createAsyncThunk(
  'purchase/fetchProductPriceHistory',
  async (productId, { rejectWithValue }) => {
    try {
      const res = await API.get(`/api/purchases/product-price-history/${productId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to fetch price history');
    }
  }
);

// ─── Stock Batches (Data Explorer) ───────────────────────────────

export const fetchStockBatches = createAsyncThunk(
  'purchase/fetchStockBatches',
  async (params = {}, { rejectWithValue }) => {
    try {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '' && v !== 'all') qs.set(k, v);
      });
      const res = await API.get(`/api/purchases/stock-batches?${qs.toString()}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to fetch stock batches');
    }
  }
);

export const fetchFilterOptions = createAsyncThunk(
  'purchase/fetchFilterOptions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/api/purchases/filter-options');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to fetch filter options');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState: {
    // Suppliers
    suppliers: [],
    suppliersLoading: false,
    suppliersError: null,

    // Purchase list
    purchases: [],
    purchasesLoading: false,
    purchasesError: null,

    // Create / update
    submitting: false,
    submitError: null,

    // Product price history
    productPriceHistory: null,
    priceHistoryLoading: false,
    priceHistoryError: null,

    // Stock batches (Data Explorer)
    stockBatches: [],
    stockBatchesLoading: false,
    stockBatchesError: null,
    stockBatchesTotal: 0,
    stockBatchesTotalPages: 1,

    // Filter options
    filterOptions: {},
    filterOptionsLoading: false,

    // Product batches (for OrderCart)
    productBatches: {},
    productBatchesLoading: false,
    batchAvailability: {},
  },
  reducers: {
    clearPriceHistory(state) {
      state.productPriceHistory = null;
      state.priceHistoryError = null;
    },
    clearStockBatches(state) {
      state.stockBatches = [];
      state.stockBatchesTotal = 0;
    },
    clearSubmitError(state) {
      state.submitError = null;
    },
  },
  extraReducers: builder => {
    // ── Suppliers
    builder
      .addCase(fetchSuppliers.pending, s => { s.suppliersLoading = true; s.suppliersError = null; })
      .addCase(fetchSuppliers.fulfilled, (s, a) => { s.suppliersLoading = false; s.suppliers = a.payload; })
      .addCase(fetchSuppliers.rejected, (s, a) => { s.suppliersLoading = false; s.suppliersError = a.payload; })

      .addCase(addSupplier.fulfilled, (s, a) => { s.suppliers = [...s.suppliers, a.payload]; })

    // ── Purchases
      .addCase(fetchPurchases.pending, s => { s.purchasesLoading = true; s.purchasesError = null; })
      .addCase(fetchPurchases.fulfilled, (s, a) => { s.purchasesLoading = false; s.purchases = a.payload; })
      .addCase(fetchPurchases.rejected, (s, a) => { s.purchasesLoading = false; s.purchasesError = a.payload; })

      .addCase(createPurchase.pending, s => { s.submitting = true; s.submitError = null; })
      .addCase(createPurchase.fulfilled, (s, a) => { s.submitting = false; s.purchases = [a.payload, ...s.purchases]; })
      .addCase(createPurchase.rejected, (s, a) => { s.submitting = false; s.submitError = a.payload; })

      .addCase(updatePurchase.pending, s => { s.submitting = true; s.submitError = null; })
      .addCase(updatePurchase.fulfilled, (s, a) => {
        s.submitting = false;
        s.purchases = s.purchases.map(p => p._id === a.payload._id ? a.payload : p);
      })
      .addCase(updatePurchase.rejected, (s, a) => { s.submitting = false; s.submitError = a.payload; })

    // ── Price History
      .addCase(fetchProductPriceHistory.pending, s => { s.priceHistoryLoading = true; s.priceHistoryError = null; })
      .addCase(fetchProductPriceHistory.fulfilled, (s, a) => { s.priceHistoryLoading = false; s.productPriceHistory = a.payload; })
      .addCase(fetchProductPriceHistory.rejected, (s, a) => { s.priceHistoryLoading = false; s.priceHistoryError = a.payload; })

    // ── Stock Batches
      .addCase(fetchStockBatches.pending, s => { s.stockBatchesLoading = true; s.stockBatchesError = null; })
      .addCase(fetchStockBatches.fulfilled, (s, a) => {
        s.stockBatchesLoading = false;
        s.stockBatches = a.payload.batches || a.payload.data || a.payload;
        s.stockBatchesTotal = a.payload.total || 0;
        s.stockBatchesTotalPages = a.payload.totalPages || 1;
      })
      .addCase(fetchStockBatches.rejected, (s, a) => { s.stockBatchesLoading = false; s.stockBatchesError = a.payload; })

      .addCase(fetchFilterOptions.pending, s => { s.filterOptionsLoading = true; })
      .addCase(fetchFilterOptions.fulfilled, (s, a) => { s.filterOptionsLoading = false; s.filterOptions = a.payload; })
      .addCase(fetchFilterOptions.rejected, s => { s.filterOptionsLoading = false; })

      // ── Product Batches (OrderCart)
      .addCase(fetchProductBatches.pending, s => { s.productBatchesLoading = true; })
      .addCase(fetchProductBatches.fulfilled, (s, a) => { s.productBatchesLoading = false; s.productBatches = { ...s.productBatches, ...a.payload }; })
      .addCase(fetchProductBatches.rejected, s => { s.productBatchesLoading = false; })

      // ── Batch Availability
      .addCase(fetchBatchAvailability.fulfilled, (s, a) => {
        s.batchAvailability[a.payload.productId] = a.payload.batches;
      })

      // ✅ FIX: bulk version — merges every product's availability into
      // Redux in a single state update instead of one-per-product.
      .addCase(fetchAllBatchAvailability.fulfilled, (s, a) => {
        s.batchAvailability = { ...s.batchAvailability, ...a.payload };
      });
  },
});

export const { clearPriceHistory, clearStockBatches, clearSubmitError } = purchaseSlice.actions;
export default purchaseSlice.reducer;

// ─── Batch Queue (for OrderCart) ──────────────────────────────
export const fetchProductBatches = createAsyncThunk(
  'purchase/fetchProductBatches',
  async (productIds, { rejectWithValue }) => {
    try {
      const results = await Promise.all(
        productIds.map(id =>
          API.get(`/api/purchases/product-batches/${id}`)
            .then(r => ({ productId: id, batches: r.data?.batches || r.data || [] }))
            .catch(() => ({ productId: id, batches: [] }))
        )
      );
      const map = {};
      results.forEach(({ productId, batches }) => { map[productId] = batches; });
      return map;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to fetch batches');
    }
  }
);

export const fetchBatchAvailability = createAsyncThunk(
  'purchase/fetchBatchAvailability',
  async (productId, { rejectWithValue }) => {
    try {
      const res = await API.get(`/api/invoices/batch-queue/${productId}`);
      const batches = (res.data?.queue || res.data?.batches || []).map(b => ({
        batchNo: b.batchNo,
        quantityAvailable: b.quantityAvailable ?? b.availableQty ?? 0,
        ...b,
      }));
      return { productId, batches };
    } catch (err) {
      return { productId, batches: [] };
    }
  }
);

// ✅ FIX: OrderCart was calling fetchBatchAvailability ONCE PER PRODUCT via
// `ids.forEach(id => dispatch(fetchBatchAvailability(id)))` in CartContext.
// For a catalog of N products that meant N separate HTTP requests fired
// simultaneously AND N separate Redux state updates in rapid succession —
// each one independently re-triggering the "auto-select first batch"
// effect, which re-scans the ENTIRE cart array every time (O(N²) work).
// On real devices that update storm is what was tripping React's
// "Maximum update depth exceeded" ceiling and making the screen crawl.
//
// This does the same N network calls (still needed — there's no bulk
// endpoint on the backend for this), but via Promise.all, then dispatches
// ONE fulfilled action with the whole map. That takes Redux from N updates
// down to 1, so the auto-select effect (and every re-render it causes)
// runs once instead of N times.
export const fetchAllBatchAvailability = createAsyncThunk(
  'purchase/fetchAllBatchAvailability',
  async (productIds, { rejectWithValue }) => {
    try {
      const results = await Promise.all(
        productIds.map(id =>
          API.get(`/api/invoices/batch-queue/${id}`)
            .then(res => {
              const batches = (res.data?.queue || res.data?.batches || []).map(b => ({
                batchNo: b.batchNo,
                quantityAvailable: b.quantityAvailable ?? b.availableQty ?? 0,
                ...b,
              }));
              return { productId: id, batches };
            })
            .catch(() => ({ productId: id, batches: [] }))
        )
      );
      const map = {};
      results.forEach(({ productId, batches }) => { map[productId] = batches; });
      return map;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to fetch batch availability');
    }
  }
); 

//-------------- 02.09.2026 -----------------------------
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import API from '../../API/api';

// // ─── Suppliers ────────────────────────────────────────────────────

// export const fetchSuppliers = createAsyncThunk(
//   'purchase/fetchSuppliers',
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await API.get('/api/suppliers');
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.msg || 'Failed to fetch suppliers');
//     }
//   }
// );

// export const addSupplier = createAsyncThunk(
//   'purchase/addSupplier',
//   async (payload, { rejectWithValue }) => {
//     try {
//       const res = await API.post('/api/suppliers', payload);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.msg || 'Failed to add supplier');
//     }
//   }
// );

// // ─── Purchase Entries ─────────────────────────────────────────────

// export const fetchPurchases = createAsyncThunk(
//   'purchase/fetchPurchases',
//   async (filters = {}, { rejectWithValue }) => {
//     try {
//       const params = new URLSearchParams();
//       Object.entries(filters).forEach(([k, v]) => {
//         if (v !== undefined && v !== null && v !== '') params.set(k, v);
//       });
//       const qs = params.toString();
//       const res = await API.get(`/api/purchases${qs ? `?${qs}` : ''}`);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.msg || 'Failed to fetch purchases');
//     }
//   }
// );

// export const createPurchase = createAsyncThunk(
//   'purchase/createPurchase',
//   async (payload, { rejectWithValue }) => {
//     try {
//       const res = await API.post('/api/purchases', payload);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.msg || 'Failed to save purchase entry');
//     }
//   }
// );

// export const updatePurchase = createAsyncThunk(
//   'purchase/updatePurchase',
//   async ({ id, payload }, { rejectWithValue }) => {
//     try {
//       const res = await API.put(`/api/purchases/${id}`, payload);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.msg || 'Failed to update purchase');
//     }
//   }
// );

// // ─── Product Price History ────────────────────────────────────────

// export const fetchProductPriceHistory = createAsyncThunk(
//   'purchase/fetchProductPriceHistory',
//   async (productId, { rejectWithValue }) => {
//     try {
//       const res = await API.get(`/api/purchases/product-price-history/${productId}`);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.msg || 'Failed to fetch price history');
//     }
//   }
// );

// // ─── Stock Batches (Data Explorer) ───────────────────────────────

// export const fetchStockBatches = createAsyncThunk(
//   'purchase/fetchStockBatches',
//   async (params = {}, { rejectWithValue }) => {
//     try {
//       const qs = new URLSearchParams();
//       Object.entries(params).forEach(([k, v]) => {
//         if (v !== undefined && v !== null && v !== '' && v !== 'all') qs.set(k, v);
//       });
//       const res = await API.get(`/api/purchases/stock-batches?${qs.toString()}`);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.msg || 'Failed to fetch stock batches');
//     }
//   }
// );

// export const fetchFilterOptions = createAsyncThunk(
//   'purchase/fetchFilterOptions',
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await API.get('/api/purchases/filter-options');
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.msg || 'Failed to fetch filter options');
//     }
//   }
// );

// // ─── Slice ────────────────────────────────────────────────────────

// const purchaseSlice = createSlice({
//   name: 'purchase',
//   initialState: {
//     // Suppliers
//     suppliers: [],
//     suppliersLoading: false,
//     suppliersError: null,

//     // Purchase list
//     purchases: [],
//     purchasesLoading: false,
//     purchasesError: null,

//     // Create / update
//     submitting: false,
//     submitError: null,

//     // Product price history
//     productPriceHistory: null,
//     priceHistoryLoading: false,
//     priceHistoryError: null,

//     // Stock batches (Data Explorer)
//     stockBatches: [],
//     stockBatchesLoading: false,
//     stockBatchesError: null,
//     stockBatchesTotal: 0,
//     stockBatchesTotalPages: 1,

//     // Filter options
//     filterOptions: {},
//     filterOptionsLoading: false,

//     // Product batches (for OrderCart)
//     productBatches: {},
//     productBatchesLoading: false,
//     batchAvailability: {},
//   },
//   reducers: {
//     clearPriceHistory(state) {
//       state.productPriceHistory = null;
//       state.priceHistoryError = null;
//     },
//     clearStockBatches(state) {
//       state.stockBatches = [];
//       state.stockBatchesTotal = 0;
//     },
//     clearSubmitError(state) {
//       state.submitError = null;
//     },
//   },
//   extraReducers: builder => {
//     // ── Suppliers
//     builder
//       .addCase(fetchSuppliers.pending, s => { s.suppliersLoading = true; s.suppliersError = null; })
//       .addCase(fetchSuppliers.fulfilled, (s, a) => { s.suppliersLoading = false; s.suppliers = a.payload; })
//       .addCase(fetchSuppliers.rejected, (s, a) => { s.suppliersLoading = false; s.suppliersError = a.payload; })

//       .addCase(addSupplier.fulfilled, (s, a) => { s.suppliers = [...s.suppliers, a.payload]; })

//     // ── Purchases
//       .addCase(fetchPurchases.pending, s => { s.purchasesLoading = true; s.purchasesError = null; })
//       .addCase(fetchPurchases.fulfilled, (s, a) => { s.purchasesLoading = false; s.purchases = a.payload; })
//       .addCase(fetchPurchases.rejected, (s, a) => { s.purchasesLoading = false; s.purchasesError = a.payload; })

//       .addCase(createPurchase.pending, s => { s.submitting = true; s.submitError = null; })
//       .addCase(createPurchase.fulfilled, (s, a) => { s.submitting = false; s.purchases = [a.payload, ...s.purchases]; })
//       .addCase(createPurchase.rejected, (s, a) => { s.submitting = false; s.submitError = a.payload; })

//       .addCase(updatePurchase.pending, s => { s.submitting = true; s.submitError = null; })
//       .addCase(updatePurchase.fulfilled, (s, a) => {
//         s.submitting = false;
//         s.purchases = s.purchases.map(p => p._id === a.payload._id ? a.payload : p);
//       })
//       .addCase(updatePurchase.rejected, (s, a) => { s.submitting = false; s.submitError = a.payload; })

//     // ── Price History
//       .addCase(fetchProductPriceHistory.pending, s => { s.priceHistoryLoading = true; s.priceHistoryError = null; })
//       .addCase(fetchProductPriceHistory.fulfilled, (s, a) => { s.priceHistoryLoading = false; s.productPriceHistory = a.payload; })
//       .addCase(fetchProductPriceHistory.rejected, (s, a) => { s.priceHistoryLoading = false; s.priceHistoryError = a.payload; })

//     // ── Stock Batches
//       .addCase(fetchStockBatches.pending, s => { s.stockBatchesLoading = true; s.stockBatchesError = null; })
//       .addCase(fetchStockBatches.fulfilled, (s, a) => {
//         s.stockBatchesLoading = false;
//         s.stockBatches = a.payload.batches || a.payload.data || a.payload;
//         s.stockBatchesTotal = a.payload.total || 0;
//         s.stockBatchesTotalPages = a.payload.totalPages || 1;
//       })
//       .addCase(fetchStockBatches.rejected, (s, a) => { s.stockBatchesLoading = false; s.stockBatchesError = a.payload; })

//       .addCase(fetchFilterOptions.pending, s => { s.filterOptionsLoading = true; })
//       .addCase(fetchFilterOptions.fulfilled, (s, a) => { s.filterOptionsLoading = false; s.filterOptions = a.payload; })
//       .addCase(fetchFilterOptions.rejected, s => { s.filterOptionsLoading = false; })

//       // ── Product Batches (OrderCart)
//       .addCase(fetchProductBatches.pending, s => { s.productBatchesLoading = true; })
//       .addCase(fetchProductBatches.fulfilled, (s, a) => { s.productBatchesLoading = false; s.productBatches = { ...s.productBatches, ...a.payload }; })
//       .addCase(fetchProductBatches.rejected, s => { s.productBatchesLoading = false; })

//       // ── Batch Availability
//       .addCase(fetchBatchAvailability.fulfilled, (s, a) => {
//         s.batchAvailability[a.payload.productId] = a.payload.batches;
//       });
//   },
// });

// export const { clearPriceHistory, clearStockBatches, clearSubmitError } = purchaseSlice.actions;
// export default purchaseSlice.reducer;

// // ─── Batch Queue (for OrderCart) ──────────────────────────────
// export const fetchProductBatches = createAsyncThunk(
//   'purchase/fetchProductBatches',
//   async (productIds, { rejectWithValue }) => {
//     try {
//       const results = await Promise.all(
//         productIds.map(id =>
//           API.get(`/api/purchases/product-batches/${id}`)
//             .then(r => ({ productId: id, batches: r.data?.batches || r.data || [] }))
//             .catch(() => ({ productId: id, batches: [] }))
//         )
//       );
//       const map = {};
//       results.forEach(({ productId, batches }) => { map[productId] = batches; });
//       return map;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.msg || 'Failed to fetch batches');
//     }
//   }
// );

// export const fetchBatchAvailability = createAsyncThunk(
//   'purchase/fetchBatchAvailability',
//   async (productId, { rejectWithValue }) => {
//     try {
//       const res = await API.get(`/api/invoices/batch-queue/${productId}`);
//       const batches = (res.data?.queue || res.data?.batches || []).map(b => ({
//         batchNo: b.batchNo,
//         quantityAvailable: b.quantityAvailable ?? b.availableQty ?? 0,
//         ...b,
//       }));
//       return { productId, batches };
//     } catch (err) {
//       return { productId, batches: [] };
//     }
//   }
// );

//------------ 29.08.26 ----------------------------------------------
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import API from '../../API/api';

// // ─── Suppliers ────────────────────────────────────────────────────

// export const fetchSuppliers = createAsyncThunk(
//   'purchase/fetchSuppliers',
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await API.get('/api/suppliers');
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.msg || 'Failed to fetch suppliers');
//     }
//   }
// );

// export const addSupplier = createAsyncThunk(
//   'purchase/addSupplier',
//   async (payload, { rejectWithValue }) => {
//     try {
//       const res = await API.post('/api/suppliers', payload);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.msg || 'Failed to add supplier');
//     }
//   }
// );

// // ─── Purchase Entries ─────────────────────────────────────────────

// export const fetchPurchases = createAsyncThunk(
//   'purchase/fetchPurchases',
//   async (filters = {}, { rejectWithValue }) => {
//     try {
//       const params = new URLSearchParams();
//       Object.entries(filters).forEach(([k, v]) => {
//         if (v !== undefined && v !== null && v !== '') params.set(k, v);
//       });
//       const qs = params.toString();
//       const res = await API.get(`/api/purchases${qs ? `?${qs}` : ''}`);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.msg || 'Failed to fetch purchases');
//     }
//   }
// );

// export const createPurchase = createAsyncThunk(
//   'purchase/createPurchase',
//   async (payload, { rejectWithValue }) => {
//     try {
//       const res = await API.post('/api/purchases', payload);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.msg || 'Failed to save purchase entry');
//     }
//   }
// );

// export const updatePurchase = createAsyncThunk(
//   'purchase/updatePurchase',
//   async ({ id, payload }, { rejectWithValue }) => {
//     try {
//       const res = await API.put(`/api/purchases/${id}`, payload);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.msg || 'Failed to update purchase');
//     }
//   }
// );

// // ─── Product Price History ────────────────────────────────────────

// export const fetchProductPriceHistory = createAsyncThunk(
//   'purchase/fetchProductPriceHistory',
//   async (productId, { rejectWithValue }) => {
//     try {
//       const res = await API.get(`/api/purchases/product-price-history/${productId}`);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.msg || 'Failed to fetch price history');
//     }
//   }
// );

// // ─── Stock Batches (Data Explorer) ───────────────────────────────

// export const fetchStockBatches = createAsyncThunk(
//   'purchase/fetchStockBatches',
//   async (params = {}, { rejectWithValue }) => {
//     try {
//       const qs = new URLSearchParams();
//       Object.entries(params).forEach(([k, v]) => {
//         if (v !== undefined && v !== null && v !== '' && v !== 'all') qs.set(k, v);
//       });
//       const res = await API.get(`/api/purchases/stock-batches?${qs.toString()}`);
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.msg || 'Failed to fetch stock batches');
//     }
//   }
// );

// export const fetchFilterOptions = createAsyncThunk(
//   'purchase/fetchFilterOptions',
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await API.get('/api/purchases/filter-options');
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.msg || 'Failed to fetch filter options');
//     }
//   }
// );

// // ─── Slice ────────────────────────────────────────────────────────

// const purchaseSlice = createSlice({
//   name: 'purchase',
//   initialState: {
//     // Suppliers
//     suppliers: [],
//     suppliersLoading: false,
//     suppliersError: null,

//     // Purchase list
//     purchases: [],
//     purchasesLoading: false,
//     purchasesError: null,

//     // Create / update
//     submitting: false,
//     submitError: null,

//     // Product price history
//     productPriceHistory: null,
//     priceHistoryLoading: false,
//     priceHistoryError: null,

//     // Stock batches (Data Explorer)
//     stockBatches: [],
//     stockBatchesLoading: false,
//     stockBatchesError: null,
//     stockBatchesTotal: 0,
//     stockBatchesTotalPages: 1,

//     // Filter options
//     filterOptions: {},
//     filterOptionsLoading: false,
//   },
//   reducers: {
//     clearPriceHistory(state) {
//       state.productPriceHistory = null;
//       state.priceHistoryError = null;
//     },
//     clearStockBatches(state) {
//       state.stockBatches = [];
//       state.stockBatchesTotal = 0;
//     },
//     clearSubmitError(state) {
//       state.submitError = null;
//     },
//   },
//   extraReducers: builder => {
//     // ── Suppliers
//     builder
//       .addCase(fetchSuppliers.pending, s => { s.suppliersLoading = true; s.suppliersError = null; })
//       .addCase(fetchSuppliers.fulfilled, (s, a) => { s.suppliersLoading = false; s.suppliers = a.payload; })
//       .addCase(fetchSuppliers.rejected, (s, a) => { s.suppliersLoading = false; s.suppliersError = a.payload; })

//       .addCase(addSupplier.fulfilled, (s, a) => { s.suppliers = [...s.suppliers, a.payload]; })

//     // ── Purchases
//       .addCase(fetchPurchases.pending, s => { s.purchasesLoading = true; s.purchasesError = null; })
//       .addCase(fetchPurchases.fulfilled, (s, a) => { s.purchasesLoading = false; s.purchases = a.payload; })
//       .addCase(fetchPurchases.rejected, (s, a) => { s.purchasesLoading = false; s.purchasesError = a.payload; })

//       .addCase(createPurchase.pending, s => { s.submitting = true; s.submitError = null; })
//       .addCase(createPurchase.fulfilled, (s, a) => { s.submitting = false; s.purchases = [a.payload, ...s.purchases]; })
//       .addCase(createPurchase.rejected, (s, a) => { s.submitting = false; s.submitError = a.payload; })

//       .addCase(updatePurchase.pending, s => { s.submitting = true; s.submitError = null; })
//       .addCase(updatePurchase.fulfilled, (s, a) => {
//         s.submitting = false;
//         s.purchases = s.purchases.map(p => p._id === a.payload._id ? a.payload : p);
//       })
//       .addCase(updatePurchase.rejected, (s, a) => { s.submitting = false; s.submitError = a.payload; })

//     // ── Price History
//       .addCase(fetchProductPriceHistory.pending, s => { s.priceHistoryLoading = true; s.priceHistoryError = null; })
//       .addCase(fetchProductPriceHistory.fulfilled, (s, a) => { s.priceHistoryLoading = false; s.productPriceHistory = a.payload; })
//       .addCase(fetchProductPriceHistory.rejected, (s, a) => { s.priceHistoryLoading = false; s.priceHistoryError = a.payload; })

//     // ── Stock Batches
//       .addCase(fetchStockBatches.pending, s => { s.stockBatchesLoading = true; s.stockBatchesError = null; })
//       .addCase(fetchStockBatches.fulfilled, (s, a) => {
//         s.stockBatchesLoading = false;
//         s.stockBatches = a.payload.batches || a.payload.data || a.payload;
//         s.stockBatchesTotal = a.payload.total || 0;
//         s.stockBatchesTotalPages = a.payload.totalPages || 1;
//       })
//       .addCase(fetchStockBatches.rejected, (s, a) => { s.stockBatchesLoading = false; s.stockBatchesError = a.payload; })

//       .addCase(fetchFilterOptions.pending, s => { s.filterOptionsLoading = true; })
//       .addCase(fetchFilterOptions.fulfilled, (s, a) => { s.filterOptionsLoading = false; s.filterOptions = a.payload; })
//       .addCase(fetchFilterOptions.rejected, s => { s.filterOptionsLoading = false; });
//   },
// });

// export const { clearPriceHistory, clearStockBatches, clearSubmitError } = purchaseSlice.actions;
// export default purchaseSlice.reducer;