// ─────────────────────────────────────────────────────────────
// stockStore.js  —  Single source of truth for stock across:
//   CentralStock, StockVisibility, ProductList, OrderBilling
//
// In a real app replace this with Redux / Context / Zustand / API.
// ─────────────────────────────────────────────────────────────

// Thresholds
const LOW_STOCK_THRESHOLD = 20;

// Master stock registry
let STOCK = {
  "RDN001": {
    id:    "RDN001",
    name:  "Fast Charger 25W",
    sku:   "RDN001",
    productListId: 1,           // matches ProductList product id
    retailerPrice:    850,
    distributorPrice: 780,
    mrp: 999,
    moq: 5,
    image: "https://www.portronics.com/cdn/shop/files/Portronics_Adapto_100_Multiport_100w_Charger.png?v=1738651493",
    qty:  500,
    value: 42500,
  },
  "RDN002": {
    id:    "RDN002",
    name:  "Type-C Cable 1.5m",
    sku:   "RDN002",
    productListId: 2,
    retailerPrice:    320,
    distributorPrice: 290,
    mrp: 399,
    moq: 10,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr-qYBo49olQ7YpjOk9oO2t7j-sKiEB1TETw&s",
    qty:  500,
    value: 65000,
  },
  "RDN003": {
    id:    "RDN003",
    name:  "Product C",
    sku:   "RDN003",
    productListId: 3,
    retailerPrice:    500,
    distributorPrice: 450,
    mrp: 599,
    moq: 5,
    image: null,
    qty:  500,
    value: 85000,
  },
};

// Inward / Outward history log
let HISTORY = [
  { id: "h1", type: "INWARD",  sku: "RDN001", name: "Fast Charger 25W",  date: "30 Jan 2026", qty: 200, note: "Opening stock" },
  { id: "h2", type: "OUTWARD", sku: "RDN002", name: "Type-C Cable 1.5m", date: "29 Jan 2026", qty: 50,  note: "Dispatched to distributor" },
];

// ── Listeners (screens subscribe to re-render on stock change) ──
let listeners = [];
export const subscribeStock = (fn) => {
  listeners.push(fn);
  return () => { listeners = listeners.filter((l) => l !== fn); };
};
const notify = () => listeners.forEach((fn) => fn());

// ── Getters ────────────────────────────────────────────────────
export const getAllStock = () => Object.values(STOCK);

export const getStockBySku = (sku) => STOCK[sku] || null;

export const getStockStatus = (qty) => {
  if (qty <= 0)                  return "OUT_OF_STOCK";
  if (qty <= LOW_STOCK_THRESHOLD) return "LOW_STOCK";
  return "IN_STOCK";
};

export const getTotalStockValue = () =>
  Object.values(STOCK).reduce((sum, item) => sum + item.qty * item.retailerPrice, 0);

export const getInwardHistory  = () => HISTORY.filter((h) => h.type === "INWARD");
export const getOutwardHistory = () => HISTORY.filter((h) => h.type === "OUTWARD");

// ── Mutators ───────────────────────────────────────────────────

/**
 * Add inward stock (goods received).
 * Called when: new stock arrives at central warehouse.
 */
export const addInward = (sku, qty, note = "Stock received") => {
  if (!STOCK[sku]) return;
  STOCK[sku].qty   += qty;
  STOCK[sku].value  = STOCK[sku].qty * STOCK[sku].retailerPrice;
  HISTORY.unshift({
    id:   "h" + Date.now(),
    type: "INWARD",
    sku,
    name: STOCK[sku].name,
    date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    qty,
    note,
  });
  notify();
};

/**
 * Deduct outward stock (order dispatched).
 * Called when: OrderBilling marks an order as DISPATCHED.
 * Returns false if insufficient stock.
 */
export const deductOutward = (items, note = "Order dispatched") => {
  // Validate stock availability first
  for (const item of items) {
    const stockItem = Object.values(STOCK).find(
      (s) => s.name === item.name || s.productListId === item.id
    );
    if (stockItem && stockItem.qty < item.qty) {
      return { success: false, message: `Insufficient stock for ${item.name}. Available: ${stockItem.qty}` };
    }
  }

  // Deduct
  for (const item of items) {
    const stockItem = Object.values(STOCK).find(
      (s) => s.name === item.name || s.productListId === item.id
    );
    if (stockItem) {
      STOCK[stockItem.sku].qty  -= item.qty;
      STOCK[stockItem.sku].value = STOCK[stockItem.sku].qty * stockItem.retailerPrice;
      HISTORY.unshift({
        id:   "h" + Date.now() + stockItem.sku,
        type: "OUTWARD",
        sku:  stockItem.sku,
        name: stockItem.name,
        date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        qty:  item.qty,
        note,
      });
    }
  }

  notify();
  return { success: true };
};