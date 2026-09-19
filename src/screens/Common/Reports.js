import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  SafeAreaView,
} from "react-native";
import { useSelector } from "react-redux";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import {
  TrendingUp,
  DollarSign,
  RotateCcw,
  RotateCw,
  Package,
  ReceiptText,
  Calendar,
  BarChart3,
  Gem,
  ClipboardList,
  User,
  Search,
  ChevronDown,
  X,
} from "lucide-react-native";
import styles from "./ReportsStyle";
import Header from "../../components/Header";

/* ─── HELPERS ─────────────────────────────────────────────── */
const fmt = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const fmtNum = (n) => Number(n || 0).toLocaleString("en-IN");
const fmtDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  return `${date.getDate().toString().padStart(2, "0")} ${date.toLocaleString("en-IN", { month: "short" })} ${date.getFullYear()}`;
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const filterByPeriod = (list, period, dateField, selMonth, selYear) => {
  const now = new Date();
  return list.filter((item) => {
    const d = new Date(item[dateField]);
    if (!d || isNaN(d)) return true;
    if (period === "day")
      return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (period === "month")
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (period === "year") return d.getFullYear() === now.getFullYear();
    if (period === "custom") {
      const mOk = selMonth === "" ? true : d.getMonth() === Number(selMonth);
      const yOk = selYear === "" ? true : d.getFullYear() === Number(selYear);
      return mOk && yOk;
    }
    return true;
  });
};

/* ─── RING CHART ─────────────────────────────────────────── */
const RingChart = ({ segments, size = 120 }) => {
  const r = size * 0.38;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let offset = 0;
  return (
    <View style={styles.ringContainer}>
      <Svg width={size} height={size}>
        <Circle cx={cx} cy={cy} r={r} fill="none" stroke="#F0F0F0" strokeWidth="13" />
        {segments.map((seg, i) => {
          const dash = (seg.value / total) * c;
          const rot = (offset / total) * 360 - 90;
          offset += seg.value;
          if (seg.value === 0) return null;
          return (
            <Circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color}
              strokeWidth="13" strokeDasharray={[dash, c - dash]}
              rotation={rot} origin={[cx, cy]} strokeLinecap="round" />
          );
        })}
        <SvgText x={cx} y={cy - 7} textAnchor="middle" fill="#1A1A1A" fontSize={size * 0.17} fontWeight="bold">
          {fmtNum(total)}
        </SvgText>
        <SvgText x={cx} y={cy + 13} textAnchor="middle" fill="#AAA" fontSize={10}>
          Total
        </SvgText>
      </Svg>
      <View style={styles.ringLegend}>
        {segments.map((s, i) => {
          const pct = total > 0 ? Math.round((s.value / total) * 100) : 0;
          return (
            <View key={i} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: s.color }]} />
              <Text style={styles.legendLabel} numberOfLines={1}>{s.label}</Text>
              <Text style={styles.legendValue}>{fmtNum(s.value)}</Text>
              <Text style={styles.legendPct}>{pct}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

/* ─── KPI CARD ────────────────────────────────────────────── */
const KpiCard = ({ icon, label, value, sub, color, bg }) => (
  <View style={[styles.kpiCard, { borderLeftColor: color }]}>
    <View style={[styles.kpiIconWrap, { backgroundColor: bg }]}>{icon}</View>
    <View style={styles.kpiContent}>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={[styles.kpiValue, { color }]}>{value}</Text>
      {sub ? <Text style={styles.kpiSub}>{sub}</Text> : null}
    </View>
  </View>
);

/* ─── PERIOD SELECTOR ────────────────────────────────────── */
const PeriodSelector = ({ period, setPeriod, selMonth, setMonth, selYear, setYear, years }) => {
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  return (
    <View style={styles.periodContainer}>
      <View style={styles.periodRow}>
        {[
          { id: "day", label: "Today" },
          { id: "month", label: "Month" },
          { id: "year", label: "Year" },
          { id: "custom", label: "Custom" },
          { id: "all", label: "All" },
        ].map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.periodPill, period === p.id && styles.periodPillActive]}
            onPress={() => setPeriod(p.id)}
          >
            <Text style={[styles.periodPillText, period === p.id && styles.periodPillTextActive]}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity style={[styles.filterChip, { flex: 1 }]} onPress={() => setShowYearPicker(true)}>
          <Calendar size={14} color="#555" />
          <Text style={styles.filterChipText}>{selYear || "All Years"}</Text>
          <ChevronDown size={14} color="#777" />
        </TouchableOpacity>

        {period === "custom" && (
          <TouchableOpacity style={[styles.filterChip, { flex: 1 }]} onPress={() => setShowMonthPicker(true)}>
            <Text style={styles.filterChipText}>{selMonth === "" ? "All Months" : MONTHS[Number(selMonth)]}</Text>
            <ChevronDown size={14} color="#777" />
          </TouchableOpacity>
        )}
      </View>

      {/* Year Picker Modal */}
      <Modal visible={showYearPicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Year</Text>
              <TouchableOpacity onPress={() => setShowYearPicker(false)}>
                <X size={20} color="#777" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={["", ...years]}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.pickerItem, selYear == item && styles.pickerItemSelected]}
                  onPress={() => { setYear(item.toString()); setShowYearPicker(false); }}
                >
                  <Text style={[styles.pickerItemText, selYear == item && styles.pickerItemTextSelected]}>
                    {item === "" ? "All Years" : item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Month Picker Modal */}
      <Modal visible={showMonthPicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Month</Text>
              <TouchableOpacity onPress={() => setShowMonthPicker(false)}>
                <X size={20} color="#777" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={["", ...MONTHS.map((m, i) => ({ label: m, value: i }))]}
              keyExtractor={(item, i) => i.toString()}
              renderItem={({ item }) => {
                const isAll = item === "";
                const val = isAll ? "" : item.value.toString();
                return (
                  <TouchableOpacity
                    style={[styles.pickerItem, selMonth === val && styles.pickerItemSelected]}
                    onPress={() => { setMonth(val); setShowMonthPicker(false); }}
                  >
                    <Text style={[styles.pickerItemText, selMonth === val && styles.pickerItemTextSelected]}>
                      {isAll ? "All Months" : item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

/* ─── SEARCH INPUT ────────────────────────────────────────── */
const SearchInput = ({ value, onChangeText, placeholder }) => (
  <View style={styles.searchWrap}>
    <Search size={15} color="#BBB" style={styles.searchIcon} />
    <TextInput
      style={styles.searchInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#BBB"
    />
    {value.length > 0 && (
      <TouchableOpacity onPress={() => onChangeText("")}>
        <X size={15} color="#BBB" />
      </TouchableOpacity>
    )}
  </View>
);

/* ─── PRODUCTS TAB ───────────────────────────────────────── */
// FIX: No ScrollView wrapper — renders via parent FlatList's ListFooterComponent
const ProductsTab = ({ products, invoices, salesReturns, purchaseReturns, period, selMonth, selYear }) => {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("salesAmt");
  const [sortDir, setSortDir] = useState("desc");

  const fInv = useMemo(() => filterByPeriod(invoices, period, "invoiceDate", selMonth, selYear), [invoices, period, selMonth, selYear]);
  const fSR = useMemo(() => filterByPeriod(salesReturns, period, "createdAt", selMonth, selYear), [salesReturns, period, selMonth, selYear]);
  const fPR = useMemo(() => filterByPeriod(purchaseReturns, period, "createdAt", selMonth, selYear), [purchaseReturns, period, selMonth, selYear]);

  const rows = useMemo(() => {
    return products
      .filter((p) => (p.name || "").toLowerCase().includes(search.toLowerCase()))
      .map((p) => {
        let salesQty = 0, salesAmt = 0, srQty = 0, srAmt = 0, prQty = 0, prAmt = 0;
        fInv.forEach((inv) => (inv.items || []).forEach((it) => {
          if (it.productId === p._id || it.name === p.name) { salesQty += it.qty || 0; salesAmt += (it.qty || 0) * (it.price || 0); }
        }));
        fSR.forEach((r) => (r.items || []).forEach((it) => {
          if (String(it.productId) === String(p._id) || it.name === p.name) { srQty += it.qty || 0; srAmt += (it.qty || 0) * (it.price || 0); }
        }));
        fPR.forEach((r) => (r.items || []).forEach((it) => {
          if (String(it.productId) === String(p._id) || it.name === p.name) { prQty += it.qty || 0; prAmt += (it.qty || 0) * (it.price || 0); }
        }));
        return { id: p._id, name: p.name || "—", sku: p.sku || p.hsnCode || "—", mrp: p.mrp || 0, salesQty, salesAmt, srAmt, prAmt, net: salesAmt - srAmt };
      })
      .sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
        return sortDir === "asc" ? av - bv : bv - av;
      });
  }, [products, fInv, fSR, fPR, search, sortKey, sortDir]);

  const SortTh = ({ col, label, flex }) => (
    <TouchableOpacity style={{ flex }} onPress={() => {
      if (sortKey === col) setSortDir((d) => d === "asc" ? "desc" : "asc");
      else { setSortKey(col); setSortDir("desc"); }
    }}>
      <Text style={styles.thText}>{label}{sortKey === col ? (sortDir === "asc" ? " ▲" : " ▼") : ""}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <SearchInput value={search} onChangeText={setSearch} placeholder="Search product..." />
      <View style={styles.tableHeader}>
        <SortTh col="name" label="Product" flex={2} />
        <Text style={[styles.thText, { flex: 0.9 }]}>SKU</Text>
        <Text style={[styles.thText, { flex: 0.9 }]}>MRP</Text>
        <SortTh col="salesQty" label="Qty" flex={0.7} />
        <SortTh col="salesAmt" label="Sales" flex={1.1} />
        <SortTh col="net" label="Net" flex={1} />
      </View>
      {rows.length === 0
        ? <Text style={styles.emptyText}>No products found.</Text>
        : rows.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={[styles.tdName, { flex: 2 }]} numberOfLines={1}>{item.name}</Text>
            <Text style={[styles.tdMuted, { flex: 0.9 }]}>{item.sku}</Text>
            <Text style={[styles.tdNum, { flex: 0.9 }]}>{fmt(item.mrp)}</Text>
            <Text style={[styles.tdNum, { flex: 0.7 }]}>{item.salesQty > 0 ? fmtNum(item.salesQty) : "—"}</Text>
            <Text style={[styles.tdNum, { flex: 1.1, color: "#00875A" }]}>{item.salesAmt > 0 ? fmt(item.salesAmt) : "—"}</Text>
            <Text style={[styles.tdNum, { flex: 1, color: item.net >= 0 ? "#00875A" : "#D32F2F" }]}>{fmt(item.net)}</Text>
          </View>
        ))
      }
    </View>
  );
};

/* ─── INVOICES TAB ───────────────────────────────────────── */
const InvoicesTab = ({ invoices, period, selMonth, selYear }) => {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => filterByPeriod(invoices, period, "invoiceDate", selMonth, selYear), [invoices, period, selMonth, selYear]);
  const rows = filtered
    .filter((inv) => !search || (inv.customerName || "").toLowerCase().includes(search.toLowerCase()) || (inv.invoiceNumber || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.invoiceDate || b.createdAt) - new Date(a.invoiceDate || a.createdAt));

  return (
    <View>
      <SearchInput value={search} onChangeText={setSearch} placeholder="Search customer or invoice #..." />
      <View style={styles.tableHeader}>
        <Text style={[styles.thText, { flex: 1.1 }]}>#Invoice</Text>
        <Text style={[styles.thText, { flex: 1 }]}>Date</Text>
        <Text style={[styles.thText, { flex: 1.8 }]}>Customer</Text>
        <Text style={[styles.thText, { flex: 1 }]}>Total</Text>
      </View>
      {rows.length === 0
        ? <Text style={styles.emptyText}>No invoices found.</Text>
        : rows.map((item) => (
          <View key={item._id} style={styles.tableRow}>
            <Text style={[styles.tdBadge, { flex: 1.1 }]} numberOfLines={1}>{item.invoiceNumber}</Text>
            <Text style={[styles.tdMuted, { flex: 1 }]}>{fmtDate(item.invoiceDate || item.createdAt)}</Text>
            <Text style={[styles.tdName, { flex: 1.8 }]} numberOfLines={1}>{item.customerName || "—"}</Text>
            <Text style={[styles.tdNum, { flex: 1, color: "#00875A" }]}>{fmt(item.totalAmount)}</Text>
          </View>
        ))
      }
    </View>
  );
};

/* ─── MONTHLY TAB ────────────────────────────────────────── */
const MonthlyTab = ({ invoices, salesReturns, purchaseReturns, year }) => {
  const yr = Number(year) || new Date().getFullYear();
  const data = MONTHS.map((month, mi) => {
    const inv = invoices.filter((i) => { const d = new Date(i.invoiceDate || i.createdAt); return d.getMonth() === mi && d.getFullYear() === yr; });
    const sr = salesReturns.filter((r) => { const d = new Date(r.createdAt); return d.getMonth() === mi && d.getFullYear() === yr; });
    const pr = purchaseReturns.filter((r) => { const d = new Date(r.createdAt); return d.getMonth() === mi && d.getFullYear() === yr; });
    const salesAmt = inv.reduce((s, i) => s + (i.totalAmount || 0), 0);
    const srAmt = sr.reduce((s, r) => s + (r.totalAmount || 0), 0);
    const prAmt = pr.reduce((s, r) => s + (r.totalAmount || 0), 0);
    return { month, salesCount: inv.length, salesAmt, srAmt, prAmt, net: salesAmt - srAmt };
  });
  const maxSales = Math.max(...data.map((d) => d.salesAmt), 1);

  return (
    <View>
      <View style={styles.tableHeader}>
        <Text style={[styles.thText, { flex: 0.8 }]}>Month</Text>
        <Text style={[styles.thText, { flex: 0.7 }]}>Inv.</Text>
        <Text style={[styles.thText, { flex: 1.4 }]}>Sales ₹</Text>
        <Text style={[styles.thText, { flex: 1 }]}>SR ₹</Text>
        <Text style={[styles.thText, { flex: 1 }]}>PR ₹</Text>
        <Text style={[styles.thText, { flex: 1.2 }]}>Net ₹</Text>
      </View>
      {data.map((row, i) => {
        const isEmpty = row.salesCount === 0 && row.srAmt === 0 && row.prAmt === 0;
        return (
          <View key={i} style={[styles.tableRow, { opacity: isEmpty ? 0.45 : 1 }]}>
            <Text style={[styles.tdName, { flex: 0.8 }]}>{row.month}</Text>
            <Text style={[styles.tdNum, { flex: 0.7 }]}>{row.salesCount}</Text>
            <View style={{ flex: 1.4, flexDirection: "column", justifyContent: "center" }}>
              <View style={{ height: 3, borderRadius: 2, backgroundColor: "#00875A", width: `${(row.salesAmt / maxSales) * 100}%`, marginBottom: 3, minWidth: row.salesAmt > 0 ? 4 : 0 }} />
              <Text style={[styles.tdNum, { color: "#00875A", textAlign: "left", fontSize: 11 }]}>{row.salesAmt > 0 ? fmt(row.salesAmt) : "—"}</Text>
            </View>
            <Text style={[styles.tdNum, { flex: 1, color: "#F57C00", fontSize: 11 }]}>{row.srAmt > 0 ? fmt(row.srAmt) : "—"}</Text>
            <Text style={[styles.tdNum, { flex: 1, color: "#D32F2F", fontSize: 11 }]}>{row.prAmt > 0 ? fmt(row.prAmt) : "—"}</Text>
            <Text style={[styles.tdNum, { flex: 1.2, color: row.net >= 0 ? "#00875A" : "#D32F2F", fontSize: 11 }]}>{fmt(row.net)}</Text>
          </View>
        );
      })}
    </View>
  );
};

/* ─── DIVIDER ────────────────────────────────────────────── */
const SectionDivider = ({ title }) => (
  <View style={styles.divider}>
    <Text style={styles.dividerText}>{title}</Text>
  </View>
);

/* ─── MAIN REPORTS SCREEN ────────────────────────────────── */
const Reports = () => {
  const role = useSelector((state) => state.auth?.role || "Radnus");
  const products = useSelector((state) => state.products?.list || []);
  const invoices = useSelector((state) => state.invoice?.data || []);
  const salesReturns = useSelector((state) => state.returns?.salesReturns || []);
  const purchaseReturns = useSelector((state) => state.returns?.purchaseReturns || []);

  const [tab, setTab] = useState("overview");
  const [period, setPeriod] = useState("month");
  const [selMonth, setMonth] = useState("");
  const [selYear, setYear] = useState(String(new Date().getFullYear()));

  const years = useMemo(() => {
    const all = new Set();
    [...invoices, ...salesReturns, ...purchaseReturns].forEach((item) => {
      const d = new Date(item.invoiceDate || item.createdAt);
      if (!isNaN(d.getFullYear())) all.add(d.getFullYear());
    });
    const now = new Date().getFullYear();
    all.add(now); all.add(now - 1);
    return Array.from(all).sort((a, b) => b - a);
  }, [invoices, salesReturns, purchaseReturns]);

  const fInv = useMemo(() => filterByPeriod(invoices, period, "invoiceDate", selMonth, selYear), [invoices, period, selMonth, selYear]);
  const fSR = useMemo(() => filterByPeriod(salesReturns, period, "createdAt", selMonth, selYear), [salesReturns, period, selMonth, selYear]);
  const fPR = useMemo(() => filterByPeriod(purchaseReturns, period, "createdAt", selMonth, selYear), [purchaseReturns, period, selMonth, selYear]);

  const totalSales = fInv.reduce((s, i) => s + (i.totalAmount || 0), 0);
  const totalSR = fSR.reduce((s, r) => s + (r.totalAmount || 0), 0);
  const totalPR = fPR.reduce((s, r) => s + (r.totalAmount || 0), 0);
  const netRevenue = totalSales - totalSR;

  const activeProds = products.filter((p) => p.status === "Active").length;
  const inactiveProds = products.length - activeProds;
  const srPend = salesReturns.filter((r) => r.status === "pending").length;
  const srAppr = salesReturns.filter((r) => r.status === "approved").length;
  const srRej = salesReturns.filter((r) => r.status === "rejected").length;
  const prPend = purchaseReturns.filter((r) => r.status === "pending").length;
  const prAppr = purchaseReturns.filter((r) => r.status === "approved").length;
  const prRej = purchaseReturns.filter((r) => r.status === "rejected").length;

  /* ── Build a single flat data array for FlatList ────────
     This is the KEY FIX: instead of nesting FlatList/VirtualizedList
     inside a ScrollView, we use ONE FlatList with all content
     rendered via ListHeaderComponent + ListFooterComponent.
     Tab-specific content with lists is rendered as plain .map()
     (non-virtualized) since counts are typically small.          */

  const renderContent = () => {
    switch (tab) {
      case "overview":
        return (
          <>
            {/* Product Price Summary */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Gem size={16} color="#D32F2F" />
                <Text style={styles.cardTitle}>Product Price Summary</Text>
              </View>
              <View style={styles.priceGrid}>
                {[
                  { label: "Total MRP", value: products.reduce((s, p) => s + (p.mrp || 0), 0), color: "#D32F2F" },
                  { label: "Retailer Price", value: products.reduce((s, p) => s + (p.retailerPrice || 0), 0), color: "#00875A" },
                  { label: "Distributor Price", value: products.reduce((s, p) => s + (p.distributorPrice || 0), 0), color: "#1565C0" },
                  { label: "Item Cost", value: products.reduce((s, p) => s + (p.itemCost || 0), 0), color: "#F57C00" },
                ].map((item, idx) => (
                  <View key={idx} style={styles.priceCell}>
                    <Text style={styles.priceLabel}>{item.label}</Text>
                    <Text style={[styles.priceValue, { color: item.color }]}>{fmt(item.value)}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Ring Charts */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Package size={15} color="#333" />
                <Text style={styles.cardTitle}>Product Stock</Text>
              </View>
              <RingChart segments={[{ label: "Active", value: activeProds, color: "#00875A" }, { label: "Inactive", value: inactiveProds, color: "#D32F2F" }]} />
            </View>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <RotateCcw size={15} color="#333" />
                <Text style={styles.cardTitle}>Sales Returns</Text>
              </View>
              <RingChart segments={[{ label: "Pending", value: srPend, color: "#F57C00" }, { label: "Approved", value: srAppr, color: "#00875A" }, { label: "Rejected", value: srRej, color: "#D32F2F" }]} />
            </View>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <RotateCw size={15} color="#333" />
                <Text style={styles.cardTitle}>Purchase Returns</Text>
              </View>
              <RingChart segments={[{ label: "Pending", value: prPend, color: "#F57C00" }, { label: "Approved", value: prAppr, color: "#00875A" }, { label: "Rejected", value: prRej, color: "#D32F2F" }]} />
            </View>

            {/* Summary */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <ClipboardList size={16} color="#D32F2F" />
                <Text style={styles.cardTitle}>Summary</Text>
              </View>
              {[
                { label: "Sales (Invoices)", count: fInv.length, value: totalSales, color: "#00875A" },
                { label: "Sales Returns", count: fSR.length, value: totalSR, color: "#F57C00" },
                { label: "Purchase Returns", count: fPR.length, value: totalPR, color: "#D32F2F" },
                { label: "Total Products", count: products.length, value: null },
              ].map((row, i) => (
                <View key={i} style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{row.label}</Text>
                  <View style={styles.summaryCountBadge}><Text style={styles.summaryCount}>{row.count}</Text></View>
                  {row.value !== null
                    ? <Text style={[styles.summaryValue, { color: row.color }]}>{fmt(row.value)}</Text>
                    : <View style={{ flex: 1 }} />}
                </View>
              ))}
              <View style={[styles.summaryRow, { borderBottomWidth: 0, paddingTop: 14, marginTop: 4 }]}>
                <Text style={[styles.summaryLabel, { fontWeight: "800", color: "#1A1A1A" }]}>Net Revenue</Text>
                <View style={{ flex: 1 }} />
                <Text style={[styles.summaryValue, { fontWeight: "800", fontSize: 16, color: netRevenue >= 0 ? "#00875A" : "#D32F2F" }]}>{fmt(netRevenue)}</Text>
              </View>
            </View>
          </>
        );

      case "products":
        return (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Package size={16} color="#D32F2F" />
              <Text style={styles.cardTitle}>Products ({products.length})</Text>
            </View>
            <ProductsTab
              products={products} invoices={invoices}
              salesReturns={salesReturns} purchaseReturns={purchaseReturns}
              period={period} selMonth={selMonth} selYear={selYear}
            />
          </View>
        );

      case "invoices":
        return (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <ReceiptText size={16} color="#D32F2F" />
              <Text style={styles.cardTitle}>Invoices ({fInv.length})</Text>
            </View>
            <InvoicesTab invoices={invoices} period={period} selMonth={selMonth} selYear={selYear} />
          </View>
        );

      case "monthly":
        return (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Calendar size={16} color="#D32F2F" />
              <Text style={styles.cardTitle}>Monthly Breakdown — {selYear || new Date().getFullYear()}</Text>
            </View>
            <MonthlyTab invoices={invoices} salesReturns={salesReturns} purchaseReturns={purchaseReturns} year={selYear} />
          </View>
        );

      default:
        return null;
    }
  };

  /* ── Single FlatList — no nested ScrollView ── */
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Reports" />
      <FlatList
        data={[]}                       // empty — all content in header/footer
        keyExtractor={() => ""}
        renderItem={null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <>
            {/* ── HERO ── */}
            <View style={styles.hero}>
              <View style={{ flex: 1 }}>
                <View style={styles.heroBadge}>
                  <User size={13} color="#D32F2F" />
                  <Text style={styles.heroBadgeText}>{role}</Text>
                </View>
                <Text style={styles.heroTitle}>Reports & Analytics</Text>
                <Text style={styles.heroSub}>Sales · Returns · Inventory</Text>
              </View>
              <View style={styles.heroStats}>
                <Text style={styles.heroRevenue}>{fmt(netRevenue)}</Text>
                <Text style={styles.heroRevenueLabel}>Net Revenue</Text>
                <View style={styles.heroDivider} />
                <Text style={styles.heroInvoiceCount}>{fInv.length} invoices</Text>
              </View>
            </View>

            {/* ── PERIOD ── */}
            <PeriodSelector period={period} setPeriod={setPeriod} selMonth={selMonth}
              setMonth={setMonth} selYear={selYear} setYear={setYear} years={years} />

            {/* ── KPI GRID ── */}
            <View style={styles.kpiGrid}>
              <KpiCard icon={<DollarSign size={18} color="#00875A" />} label="Total Sales" value={fmt(totalSales)} sub={`${fInv.length} invoices`} color="#00875A" bg="rgba(0,135,90,0.1)" />
              <KpiCard icon={<TrendingUp size={18} color="#1565C0" />} label="Net Revenue" value={fmt(netRevenue)} sub="After returns" color="#1565C0" bg="rgba(21,101,192,0.1)" />
              <KpiCard icon={<RotateCcw size={18} color="#F57C00" />} label="Sales Returns" value={fmt(totalSR)} sub={`${fSR.length} returns`} color="#F57C00" bg="rgba(245,124,0,0.1)" />
              <KpiCard icon={<RotateCw size={18} color="#D32F2F" />} label="Purch. Returns" value={fmt(totalPR)} sub={`${fPR.length} returns`} color="#D32F2F" bg="rgba(211,47,47,0.08)" />
            </View>

            {/* ── TAB BAR ── */}
            <View style={styles.tabBar}>
              {[
                { id: "overview", icon: <BarChart3 size={14} />, label: "Overview" },
                { id: "products", icon: <Package size={14} />, label: "Products", count: products.length },
                { id: "invoices", icon: <ReceiptText size={14} />, label: "Invoices", count: fInv.length },
                { id: "monthly", icon: <Calendar size={14} />, label: "Monthly" },
              ].map((t) => (
                <TouchableOpacity key={t.id} style={[styles.tabBtn, tab === t.id && styles.tabBtnActive]} onPress={() => setTab(t.id)}>
                  <View style={tab === t.id ? styles.tabIconActive : styles.tabIcon}>{t.icon}</View>
                  <Text style={[styles.tabBtnText, tab === t.id && styles.tabBtnTextActive]}>{t.label}</Text>
                  {t.count !== undefined && (
                    <View style={[styles.tabCount, tab === t.id && styles.tabCountActive]}>
                      <Text style={[styles.tabCountText, tab === t.id && styles.tabCountTextActive]}>{t.count}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
        ListFooterComponent={
          <View style={{ paddingBottom: 32 }}>
            {renderContent()}
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Reports;