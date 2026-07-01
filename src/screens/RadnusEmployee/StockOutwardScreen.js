// src/screens/RadnusEmployee/OutwardScreen.js
import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import {
  MovementGroup,
  SummaryCards,
  StockMovementHeader,
  EmptyState,
  PaginationFooter,
} from './StockMovementUtils';
import { useStockMovement } from '../../utils/hooks/useStockMovement';
import styles, { COLORS } from './StockMovementStyle';

const OutwardScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  
  const {
    paginatedData,
    uniqueDates,
    totalPages,
    searchTerm,
    selectedDate,
    currentPage,
    periodFilter,
    showDateFilter,
    fromDateText,
    toDateText,
    isInitialLoading,
    refreshing,
    hasActiveFilters,
    flatListRef,
    setFromDateText,
    setToDateText,
    onRefresh,
    handleSearchChange,
    handleSearchClear,
    handlePeriodSelect,
    handleDateSelect,
    handleDateClear,
    resetFilters,
    handlePrevPage,
    handleNextPage,
    processedData,
  } = useStockMovement('OUTWARD');

  // ─── Render Functions ──────────────────────────────────────────────────────
  const renderGroup = useCallback(
    ({ item }) => <MovementGroup group={item} type="OUTWARD" />,
    [],
  );

  const keyExtractor = useCallback((item) => item.date, []);

  // ─── Memoized Header ──────────────────────────────────────────────────────
  const headerElement = useMemo(
    () => (
      <View>
        <StockMovementHeader
          type="OUTWARD"
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          onSearchClear={handleSearchClear}
          periodFilter={periodFilter}
          onPeriodSelect={handlePeriodSelect}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={resetFilters}
          showDateFilter={showDateFilter}
          fromDateText={fromDateText}
          onFromDateChange={setFromDateText}
          toDateText={toDateText}
          onToDateChange={setToDateText}
          uniqueDates={uniqueDates}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onDateClear={handleDateClear}
        />
        <SummaryCards
          type="OUTWARD"
          totalQty={processedData.totalQty}
          totalValue={processedData.totalValue}
          groupCount={processedData.groups.length}
        />
      </View>
    ),
    [
      searchTerm,
      handleSearchChange,
      handleSearchClear,
      periodFilter,
      handlePeriodSelect,
      hasActiveFilters,
      resetFilters,
      showDateFilter,
      fromDateText,
      toDateText,
      setFromDateText,
      setToDateText,
      uniqueDates,
      selectedDate,
      handleDateSelect,
      handleDateClear,
      processedData.totalQty,
      processedData.totalValue,
      processedData.groups.length,
    ],
  );

  const footerElement = useMemo(
    () => (
      <PaginationFooter
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
      />
    ),
    [currentPage, totalPages, handlePrevPage, handleNextPage],
  );

  const emptyElement = useMemo(
    () => <EmptyState type="OUTWARD" hasActiveFilters={hasActiveFilters} />,
    [hasActiveFilters],
  );

  // ─── Loading State ─────────────────────────────────────────────────────────
  if (isInitialLoading) {
    return (
      <View style={styles.container}>
        <Header title="Outward Stock" showBackArrow navigation={navigation} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.red} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  // ─── Main Render ───────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <Header title="Outward Stock" showBackArrow navigation={navigation} />
      <FlatList
        ref={flatListRef}
        data={paginatedData}
        keyExtractor={keyExtractor}
        renderItem={renderGroup}
        ListHeaderComponent={headerElement}
        ListEmptyComponent={emptyElement}
        ListFooterComponent={footerElement}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 16 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.red]}
            tintColor={COLORS.red}
          />
        }
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={30}
        windowSize={5}
        removeClippedSubviews
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
      />
    </View>
  );
};

export default OutwardScreen;