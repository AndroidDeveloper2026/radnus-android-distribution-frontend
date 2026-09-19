// OrderCart.js — Complete Working Fix
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  X,
  ShoppingCart,
  Filter,
  Edit3,
  Save,
  XCircle,
  Tag,
  Calendar,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Layers,
  Package,
} from 'lucide-react-native';

import Header from '../../components/Header';
import { useCart } from '../../context/CartContext';
import styles from './OrderCartStyle';

// ─── Constants ────────────────────────────────────────────────
const ACCENT = '#D32F2F';
const WHITE = '#FFFFFF';
const GREY = '#555';
const GREEN = '#2E7D32';
const ORANGE = '#E65100';

const PRICE_TYPES = [
  { label: 'Retailer', value: 'retailerPrice' },
  { label: 'Distributor', value: 'distributorPrice' },
  { label: 'Walk-in', value: 'walkinPrice' },
  { label: 'MRP', value: 'mrp' },
];

// ─── Helpers ──────────────────────────────────────────────────
const getNum = (obj, key) => {
  const v = obj?.[key];
  return v !== undefined && v !== null ? Number(v) || 0 : 0;
};

const getStr = (obj, key) => {
  const v = obj?.[key];
  return v !== undefined && v !== null ? String(v).trim() : '';
};

// ─── Memoized Batch Picker Sheet ─────────────────────────────
const BatchPickerSheet = React.memo(
  ({
    visible,
    onClose,
    batches,
    availableBatches,
    selectedBatchNo,
    batchQuantities,
    onSelect,
  }) => {
    const [showAll, setShowAll] = useState(false);
    const LIMIT = 3;

    const enriched = useMemo(() => {
      const availMap = {};
      availableBatches.forEach((b) => {
        availMap[b.batchNo] = b.quantityAvailable || 0;
      });
      return batches
        .map((b) => ({
          ...b,
          availableQty: availMap[b.batchNo] || 0,
          selectedQty: batchQuantities[b.batchNo] || 0,
        }))
        .filter((b) => b.availableQty > 0);
    }, [batches, availableBatches, batchQuantities]);

    const display = showAll ? enriched : enriched.slice(0, LIMIT);

    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={[styles.sheet, { maxHeight: '75%' }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select Batch</Text>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={20} color={GREY} />
              </TouchableOpacity>
            </View>
            {enriched.length === 0 ? (
              <View style={styles.emptyBatchContainer}>
                <Text style={styles.emptyBatchText}>⛔ OUT OF STOCK</Text>
                <Text style={styles.emptyBatchSubtext}>
                  No batches available for this product.
                </Text>
              </View>
            ) : (
              <ScrollView keyboardShouldPersistTaps="handled">
                <View style={styles.batchHeaderRow}>
                  <Text style={styles.batchHeaderText}>
                    {enriched.length} batch{enriched.length !== 1 ? 'es' : ''}{' '}
                    available
                  </Text>
                  <Text style={styles.batchHeaderAction}>Tap to select</Text>
                </View>
                {display.map((batch, idx) => {
                  const isSelected = batch.batchNo === selectedBatchNo;
                  const isNewest = idx === 0;
                  const isOldest =
                    idx === enriched.length - 1 && enriched.length > 1;
                  return (
                    <TouchableOpacity
                      key={batch.batchNo}
                      style={[
                        styles.batchRow,
                        isSelected && styles.batchRowActive,
                      ]}
                      onPress={() => {
                        onSelect(batch.batchNo);
                        onClose();
                      }}
                    >
                      <View style={styles.batchRowContent}>
                        <View style={styles.batchRowTop}>
                          <Text
                            style={[
                              styles.batchRowNumber,
                              isSelected && styles.batchRowNumberActive,
                            ]}
                          >
                            {batch.batchNo}
                          </Text>
                          <Text style={styles.batchRowPrice}>
                            ₹{Number(batch.purchasePrice || 0).toFixed(2)}
                          </Text>
                          <View style={styles.batchStockTag}>
                            <Text style={styles.batchStockTagText}>
                              Stock: {batch.availableQty}
                            </Text>
                          </View>
                          {batch.selectedQty > 0 && (
                            <View style={styles.batchQtyTag}>
                              <Text style={styles.batchQtyTagText}>
                                Qty: {batch.selectedQty}
                              </Text>
                            </View>
                          )}
                          {isNewest && (
                            <View style={styles.tagGreen}>
                              <Text style={styles.tagGreenText}>NEWEST</Text>
                            </View>
                          )}
                          {isOldest && (
                            <View style={styles.tagRed}>
                              <Text style={styles.tagRedText}>OLDEST</Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.batchRowBottom}>
                          <Calendar size={10} color="#aaa" />
                          <Text style={styles.batchRowDate}>
                            {batch.invoiceDate
                              ? new Date(batch.invoiceDate).toLocaleDateString(
                                  'en-IN',
                                  {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  }
                                )
                              : '—'}
                          </Text>
                          {batch.invoiceNumber ? (
                            <Text style={styles.batchRowInvoice}>
                              {batch.invoiceNumber}
                            </Text>
                          ) : null}
                        </View>
                      </View>
                      {isSelected && <View style={styles.checkDot} />}
                    </TouchableOpacity>
                  );
                })}
                {enriched.length > LIMIT && (
                  <TouchableOpacity
                    style={styles.showMoreBtn}
                    onPress={() => setShowAll((p) => !p)}
                  >
                    {showAll ? (
                      <ChevronUp size={14} color={GREEN} />
                    ) : (
                      <ChevronDown size={14} color={GREEN} />
                    )}
                    <Text style={styles.showMoreText}>
                      {showAll
                        ? 'Show Less'
                        : `Show All (${enriched.length} batches)`}
                    </Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    );
  }
);

// ─── Product Row ──────────────────────────────────────────────
const ProductRow = React.memo(
  ({
    item,
    batches,
    availableBatches,
    selectedBatchNo,
    batchQuantities,
    priceType,
    isEditingPrice,
    onUpdateBatchQty,
    onSelectBatch,
    onTogglePriceEdit,
    onSaveBatchPrice,
    onSaveDefaultPrice,
  }) => {
    const [localQty, setLocalQty] = useState('');
    const [localPrice, setLocalPrice] = useState('');
    const [batchSheet, setBatchSheet] = useState(false);

    // ✅ CRITICAL FIX: Calculate price directly from item and priceType
    const getPriceForItem = useCallback(() => {
      // If we have a selected batch, try to get price from batches
      if (batches && batches.length > 0 && selectedBatchNo) {
        const batch = batches.find(b => b.batchNo === selectedBatchNo);
        if (batch) {
          // Check if batch has the specific price type
          if (batch[priceType] !== undefined && batch[priceType] !== null) {
            return Number(batch[priceType]) || 0;
          }
          // Fallback to purchase price
          return Number(batch.purchasePrice) || 0;
        }
      }
      
      // Check custom default price
      if (item.customDefaultPrice && item.customDefaultPrice[priceType] !== undefined) {
        return Number(item.customDefaultPrice[priceType]) || 0;
      }
      
      // Get price from item directly
      return Number(item[priceType]) || 0;
    }, [item, batches, selectedBatchNo, priceType]);

    // ✅ Get the current price
    const currentPrice = useMemo(() => {
      return getPriceForItem();
    }, [getPriceForItem]);

    const stock = useMemo(() => item.currentStock || 0, [item.currentStock]);
    const hasBatches = useMemo(() => batches && batches.length > 0, [batches]);
    
    const currentBatchQty = useMemo(
      () => batchQuantities[selectedBatchNo] || 0,
      [batchQuantities, selectedBatchNo]
    );

    const selectedBatchStock = useMemo(() => {
      if (!hasBatches || !selectedBatchNo) return stock;
      const ab = availableBatches.find((b) => b.batchNo === selectedBatchNo);
      return ab ? ab.quantityAvailable || 0 : 0;
    }, [hasBatches, selectedBatchNo, availableBatches, stock]);

    const totalQty = useMemo(
      () => Object.values(batchQuantities).reduce((s, q) => s + q, 0),
      [batchQuantities]
    );

    const batchAllocations = useMemo(() => {
      return Object.entries(batchQuantities)
        .filter(([, qty]) => qty > 0)
        .map(([batchNo, qty]) => {
          const batch = batches?.find(b => b.batchNo === batchNo);
          const price = batch?.[priceType] || batch?.purchasePrice || 0;
          return {
            batchNo,
            qty,
            price: Number(price) || 0,
            subtotal: qty * (Number(price) || 0),
          };
        });
    }, [batchQuantities, batches, priceType]);

    // Sync local state
    useEffect(() => {
      setLocalQty(String(currentBatchQty));
    }, [currentBatchQty]);

    useEffect(() => {
      if (isEditingPrice) {
        setLocalPrice(String(currentPrice));
      }
    }, [currentPrice, isEditingPrice]);

    // Handlers
    const handleQtyChange = useCallback(
      (v) => {
        setLocalQty(v);
        const n = parseInt(v, 10);
        if (!isNaN(n) && n >= 0) {
          const clamped = Math.min(n, selectedBatchStock);
          onUpdateBatchQty(item.id, selectedBatchNo, clamped);
        }
      },
      [item.id, selectedBatchNo, selectedBatchStock, onUpdateBatchQty]
    );

    const handleQtyBlur = useCallback(() => {
      let n = parseInt(localQty, 10);
      if (isNaN(n) || n < 0) n = 0;
      const clamped = Math.min(n, selectedBatchStock);
      onUpdateBatchQty(item.id, selectedBatchNo, clamped);
      setLocalQty(String(clamped));
    }, [localQty, item.id, selectedBatchNo, selectedBatchStock, onUpdateBatchQty]);

    const handleIncrement = useCallback(() => {
      const nq = currentBatchQty + 1;
      const clamped = Math.min(nq, selectedBatchStock);
      onUpdateBatchQty(item.id, selectedBatchNo, clamped);
      setLocalQty(String(clamped));
    }, [currentBatchQty, selectedBatchStock, item.id, selectedBatchNo, onUpdateBatchQty]);

    const handleDecrement = useCallback(() => {
      const nq = currentBatchQty - 1;
      const clamped = Math.max(0, nq);
      onUpdateBatchQty(item.id, selectedBatchNo, clamped);
      setLocalQty(String(clamped));
    }, [currentBatchQty, item.id, selectedBatchNo, onUpdateBatchQty]);

    const savePrice = useCallback(
      (num) => {
        if (hasBatches && selectedBatchNo) {
          onSaveBatchPrice(item.id, selectedBatchNo, num);
        } else {
          onSaveDefaultPrice(item.id, num);
        }
        onTogglePriceEdit(item.id);
      },
      [hasBatches, selectedBatchNo, item.id, onSaveBatchPrice, onSaveDefaultPrice, onTogglePriceEdit]
    );

    const handleSavePrice = useCallback(() => {
      const n = parseFloat(localPrice);
      if (!isNaN(n) && n >= 0) savePrice(n);
    }, [localPrice, savePrice]);

    const handleCancelPriceEdit = useCallback(() => {
      setLocalPrice(String(currentPrice));
      onTogglePriceEdit(item.id);
    }, [currentPrice, onTogglePriceEdit]);

    const isInCart = totalQty > 0;
    const isOOS = hasBatches ? selectedBatchStock <= 0 : stock <= 0;
    const selectedBatch = batches?.find((b) => b.batchNo === selectedBatchNo);
    const availableBatchCount = useMemo(
      () => availableBatches.filter((b) => b.quantityAvailable > 0).length,
      [availableBatches]
    );

    // Get the label for current price type
    const priceTypeLabel = PRICE_TYPES.find(p => p.value === priceType)?.label || 'Retailer';

    return (
      <View style={[styles.card, isInCart && styles.cardActive]}>
        <View style={styles.cardRow}>
          {/* Image */}
          <View style={styles.imageBox}>
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Package size={18} color="#ccc" />
              </View>
            )}
          </View>

          {/* Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.name}
            </Text>

            <View style={styles.metaRow}>
              <Text style={styles.metaText}>SKU: {item.sku}</Text>
              <Text style={styles.metaText}>Stock: {stock}</Text>
            </View>

            {/* ✅ Price row - shows correct price type */}
            <View style={styles.priceRow}>
              {isEditingPrice ? (
                <View style={styles.priceEditContainer}>
                  <Text style={styles.priceCurrency}>₹</Text>
                  <TextInput
                    style={styles.priceInput}
                    keyboardType="numeric"
                    value={localPrice}
                    onChangeText={(v) =>
                      setLocalPrice(v.replace(/[^0-9.]/g, ''))
                    }
                    autoFocus
                  />
                  <TouchableOpacity onPress={handleSavePrice}>
                    <Save size={16} color={GREEN} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleCancelPriceEdit}>
                    <XCircle size={16} color={ACCENT} />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <Text style={styles.price}>
                    ₹{Number(currentPrice).toLocaleString('en-IN')}
                  </Text>
                  {/* ✅ Show which price type is active */}
                  <View style={styles.priceTypeBadge}>
                    <Text style={styles.priceTypeBadgeText}>{priceTypeLabel}</Text>
                  </View>
                  {hasBatches && selectedBatch && (
                    <Text style={styles.batchTag}>
                      ({selectedBatch.batchNo})
                    </Text>
                  )}
                  {!hasBatches && (
                    <Text style={styles.defaultTag}>(default)</Text>
                  )}
                  <TouchableOpacity
                    onPress={() => onTogglePriceEdit(item.id)}
                  >
                    <Edit3 size={14} color={GREY} />
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/* Total selected indicator */}
            {totalQty > 0 && (
              <View style={styles.totalIndicator}>
                <Layers size={11} color="#1565C0" />
                <Text style={styles.totalIndicatorText}>
                  {totalQty} units across{' '}
                  {Object.keys(batchQuantities).filter((k) => batchQuantities[k] > 0)
                    .length}{' '}
                  batch(es)
                </Text>
              </View>
            )}

            {/* Batch selector */}
            {hasBatches ? (
              <TouchableOpacity
                style={styles.batchSelector}
                onPress={() => setBatchSheet(true)}
              >
                <Tag size={11} color={GREY} />
                <Text style={styles.batchSelectorText} numberOfLines={1}>
                  {selectedBatchNo
                    ? `${selectedBatchNo}  ·  ₹${Number(
                        selectedBatch?.purchasePrice || 0
                      ).toFixed(2)}  ·  Stock: ${selectedBatchStock}`
                    : 'Select batch'}
                </Text>
                <View style={styles.availBadge}>
                  <Text style={styles.availBadgeText}>
                    {availableBatchCount} avail
                  </Text>
                </View>
                <ChevronDown size={13} color={GREY} />
              </TouchableOpacity>
            ) : (
              <View style={styles.noBatchTag}>
                <Text style={styles.noBatchText}>
                  No batch history – using default price
                </Text>
              </View>
            )}

            {/* Allocation summary */}
            {batchAllocations.length > 0 && (
              <View style={styles.allocBox}>
                <Text style={styles.allocLabel}>Allocations:</Text>
                {batchAllocations.map((alloc, i) => (
                  <View key={i} style={styles.allocTag}>
                    <Text style={styles.allocTagText}>
                      {alloc.batchNo} · {alloc.qty} × ₹{alloc.price.toFixed(2)} =
                      ₹{alloc.subtotal.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Overstock warning */}
            {hasBatches &&
              selectedBatchNo &&
              currentBatchQty > selectedBatchStock && (
                <View style={styles.warnBox}>
                  <AlertCircle size={11} color={ACCENT} />
                  <Text style={styles.warnText}>
                    Batch {selectedBatchNo} only has {selectedBatchStock} units.
                  </Text>
                </View>
              )}
          </View>

          {/* Stepper */}
          <View style={styles.stepper}>
            <TouchableOpacity
              style={[styles.stepBtn, currentBatchQty === 0 && styles.stepBtnDisabled]}
              disabled={currentBatchQty === 0}
              onPress={handleDecrement}
            >
              <Text style={[styles.stepBtnText, currentBatchQty === 0 && styles.stepBtnTextDisabled]}>
                −
              </Text>
            </TouchableOpacity>
            <TextInput
              style={[styles.stepQtyInput, isInCart && styles.stepQtyInputActive]}
              keyboardType="numeric"
              value={localQty}
              onChangeText={handleQtyChange}
              onBlur={handleQtyBlur}
            />
            <TouchableOpacity
              style={[styles.stepBtn, isOOS && styles.stepBtnDisabled]}
              disabled={isOOS}
              onPress={handleIncrement}
            >
              <Text style={[styles.stepBtnText, isOOS && styles.stepBtnTextDisabled]}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Batch picker sheet */}
        <BatchPickerSheet
          visible={batchSheet}
          onClose={() => setBatchSheet(false)}
          batches={batches}
          availableBatches={availableBatches}
          selectedBatchNo={selectedBatchNo}
          batchQuantities={batchQuantities}
          onSelect={(batchNo) => onSelectBatch(item.id, batchNo)}
        />
      </View>
    );
  },
  (prev, next) => {
    // ✅ FIX: Proper comparison including priceType
    return (
      prev.priceType === next.priceType &&
      prev.isEditingPrice === next.isEditingPrice &&
      prev.selectedBatchNo === next.selectedBatchNo &&
      prev.batchQuantities === next.batchQuantities &&
      prev.batches === next.batches &&
      prev.availableBatches === next.availableBatches &&
      prev.item.id === next.item.id &&
      prev.item.totalQty === next.item.totalQty &&
      prev.item.currentStock === next.item.currentStock &&
      prev.item.name === next.item.name &&
      prev.item.sku === next.item.sku &&
      prev.item.image === next.item.image &&
      prev.item.retailerPrice === next.item.retailerPrice &&
      prev.item.distributorPrice === next.item.distributorPrice &&
      prev.item.walkinPrice === next.item.walkinPrice &&
      prev.item.mrp === next.item.mrp &&
      prev.item.customDefaultPrice === next.item.customDefaultPrice &&
      prev.item.batchCustomPrices === next.item.batchCustomPrices
    );
  }
);

// ─── Floating Mini Cart Bar (Zepto / Instamart style) ──────────
// Sits above the tab/safe area, only shows once something is added.
// Tapping it takes the user to the dedicated Cart Review / checkout screen.
const MiniCartBar = React.memo(({ totalItems, totalAmount, onPress }) => {
  if (!totalItems) return null;
  return (
    <TouchableOpacity
      style={styles.miniCartBar}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.miniCartLeft}>
        <View style={styles.miniCartIconWrap}>
          <ShoppingCart size={16} color={WHITE} />
          <View style={styles.miniCartCountBadge}>
            <Text style={styles.miniCartCountBadgeText}>{totalItems}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.miniCartItemsText}>
            {totalItems} item{totalItems !== 1 ? 's' : ''} added
          </Text>
          <Text style={styles.miniCartAmountText}>
            ₹{totalAmount.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>
      <View style={styles.miniCartRight}>
        <Text style={styles.miniCartViewText}>View Cart</Text>
        <ChevronUp
          size={16}
          color={WHITE}
          style={{ transform: [{ rotate: '90deg' }] }}
        />
      </View>
    </TouchableOpacity>
  );
});

// ─── Main Screen ──────────────────────────────────────────────
const OrderCart = ({ navigation }) => {
  const {
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
    handleSelectBatch,
    saveBatchCustomPrice,
    saveDefaultPrice,
    cartItems,
    totalItems,
    totalAmount,
  } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [catSheetOpen, setCatSheetOpen] = useState(false);

  // Kick off the product/batch fetch only now that this screen is actually
  // open (i.e. the user is logged in) — not at app boot.
  useEffect(() => {
    ensureProductsLoaded();
  }, [ensureProductsLoaded]);

  // ── Debounced search ──
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(
      () => setDebouncedSearch(searchQuery.trim().toLowerCase()),
      200
    );
    return () => clearTimeout(t);
  }, [searchQuery]);

  // ── Filtered IDs ──
  const filteredIds = useMemo(() => {
    let list = cart;
    if (debouncedSearch) {
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(debouncedSearch) ||
          i.sku.toLowerCase().includes(debouncedSearch)
      );
    }
    if (selectedCat) list = list.filter((i) => i.category === selectedCat);
    return new Set(list.map((i) => i.id));
  }, [cart, debouncedSearch, selectedCat]);

  // ── Filtered cart (browse list order — in-cart items float up) ──
  const filteredCart = useMemo(() => {
    const list = cart.filter((i) => filteredIds.has(i.id));
    return list.sort((a, b) => {
      const aq = a.totalQty || 0,
        bq = b.totalQty || 0;
      if (aq > 0 && bq > 0) return (a.addedToCartAt || 0) - (b.addedToCartAt || 0);
      if (aq > 0) return -1;
      if (bq > 0) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [cart, filteredIds]);

  // ── Go to the dedicated cart/checkout screen ──
  const handleViewCart = useCallback(() => {
    navigation.navigate('CartReview');
  }, [navigation]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['bottom']}>
        <Header title="Order Cart" />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={ACCENT} />
          <Text style={styles.loadingText}>Loading products…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Header title={`Order Cart (${totalItems})`} />

      {/* ── Search + Category ── */}
      <View style={styles.topBar}>
        <View style={styles.searchWrapper}>
          <Search size={14} color="#aaa" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or SKU…"
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={14} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>
        {categories.length > 0 && (
          <TouchableOpacity
            style={styles.catBtn}
            onPress={() => setCatSheetOpen(true)}
          >
            <Filter size={13} color={selectedCat ? WHITE : GREY} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Active category chip ── */}
      {selectedCat && (
        <View style={styles.categoryChipWrapper}>
          <TouchableOpacity
            style={styles.activeCatChip}
            onPress={() => setSelectedCat('')}
          >
            <Text style={styles.activeCatChipText}>{selectedCat}</Text>
            <X size={11} color={ACCENT} />
          </TouchableOpacity>
        </View>
      )}

      {/* ── Price type selector ── */}
      <View style={styles.priceTabBar}>
        {PRICE_TYPES.map((pt) => (
          <TouchableOpacity
            key={pt.value}
            style={[styles.priceTab, priceType === pt.value && styles.priceTabActive]}
            onPress={() => setPriceType(pt.value)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.priceTabText,
                priceType === pt.value && styles.priceTabTextActive,
              ]}
            >
              {pt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Product list ── */}
      <FlatList
        data={filteredCart}
        keyExtractor={(i) => i.id}
        contentContainerStyle={[
          styles.listContent,
          totalItems > 0 && { paddingBottom: 110 },
        ]}
        initialNumToRender={8}
        maxToRenderPerBatch={6}
        updateCellsBatchingPeriod={50}
        windowSize={7}
        removeClippedSubviews={true}
        extraData={priceType}
        renderItem={({ item }) => {
          const batches = productBatches[item.id] || [];
          const avail = batchAvailability[item.id] || [];
          return (
            <ProductRow
              item={item}
              batches={batches}
              availableBatches={avail}
              selectedBatchNo={batches.length > 0 ? item.selectedBatchNo : null}
              batchQuantities={item.batchQuantities}
              priceType={priceType}
              isEditingPrice={editingPriceId === item.id}
              onUpdateBatchQty={updateBatchQty}
              onSelectBatch={handleSelectBatch}
              onTogglePriceEdit={togglePriceEdit}
              onSaveBatchPrice={saveBatchCustomPrice}
              onSaveDefaultPrice={saveDefaultPrice}
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Package size={44} color="#ddd" />
            <Text style={styles.emptyText}>
              {searchQuery || selectedCat
                ? 'No products match the current filter.'
                : 'No products available.'}
            </Text>
          </View>
        }
      />

      {/* ── Floating mini cart bar → navigates to full Cart Review screen ── */}
      <MiniCartBar
        totalItems={totalItems}
        totalAmount={totalAmount}
        onPress={handleViewCart}
      />

      {/* ── Category filter sheet ── */}
      <Modal
        visible={catSheetOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setCatSheetOpen(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Filter by Category</Text>
              <TouchableOpacity onPress={() => setCatSheetOpen(false)}>
                <X size={20} color={GREY} />
              </TouchableOpacity>
            </View>
            {[
              { label: 'All Categories', value: '' },
              ...categories.map((c) => ({ label: c, value: c })),
            ].map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.sheetRow,
                  selectedCat === opt.value && styles.sheetRowActive,
                ]}
                onPress={() => {
                  setSelectedCat(opt.value);
                  setCatSheetOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.sheetRowText,
                    selectedCat === opt.value && styles.sheetRowTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
                {selectedCat === opt.value && <View style={styles.checkDot} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default OrderCart;
