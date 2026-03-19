import React, { useEffect, useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSessions } from '../../services/features/fse/sessionSlice';
import {
  MapPin,
  Clock,
  Navigation,
  ChevronRight,
  WifiOff,
  RefreshCw,
  CheckCircle,
  CalendarDays,
  Timer,
  Route,
} from 'lucide-react-native';
import Header from '../../components/Header';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = iso => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = iso => {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDuration = (start, end) => {
  if (!start || !end) return '—';
  const ms   = new Date(end) - new Date(start);
  const mins = Math.floor(ms / 60000);
  const hrs  = Math.floor(mins / 60);
  const rem  = mins % 60;
  if (hrs > 0) return `${hrs}h ${rem}m`;
  return `${mins}m`;
};

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  { key: 'all',   label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'week',  label: 'Week' },
  { key: 'month', label: 'Month' },
];

const isWithinTab = (isoString, tab) => {
  if (tab === 'all' || !isoString) return true;
  const date = new Date(isoString);
  const now  = new Date();

  if (tab === 'today') {
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth()    === now.getMonth()    &&
      date.getDate()     === now.getDate()
    );
  }
  if (tab === 'week') {
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    return date >= sevenDaysAgo;
  }
  if (tab === 'month') {
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth()    === now.getMonth()
    );
  }
  return true;
};

// ─── Session Card ─────────────────────────────────────────────────────────────

const SessionCard = ({ item, onPress }) => {
  const isActive   = item.status === 'ACTIVE';
  const routeCount = item.route?.length || 0;
  const duration   = formatDuration(item.startTime, item.endTime);
  const distance   = item.totalDistanceKm
    ? `${item.totalDistanceKm.toFixed(2)} km`
    : '0.00 km';

  return (
    <TouchableOpacity
      style={sl.card}
      activeOpacity={0.82}
      onPress={onPress}
    >
      {/* ── Card header: date left, badge right ── */}
      <View style={sl.cardHeader}>
        <View style={sl.dateBlock}>
          <CalendarDays size={13} color={ACCENT} strokeWidth={2} />
          <Text style={sl.dateText}>{formatDate(item.startTime)}</Text>
        </View>
        <View style={[sl.statusBadge, isActive ? sl.badgeActive : sl.badgeEnded]}>
          {isActive
            ? <Navigation size={10} color="#fff" strokeWidth={2.5} />
            : <CheckCircle size={10} color="#fff" strokeWidth={2.5} />
          }
          <Text style={sl.badgeText}> {isActive ? 'Active' : 'Ended'}</Text>
        </View>
      </View>

      {/* ── Time row: start + end side by side, no arrow ── */}
      <View style={sl.timeRow}>
        <View style={sl.timeBlock}>
          <Text style={sl.timeLabel}>START</Text>
          <Text style={sl.timeValue}>{formatTime(item.startTime)}</Text>
          {/* <Text style={sl.timeDateSub}>{formatDate(item.startTime)}</Text> */}
        </View>

        <View style={sl.timeDividerVertical} />

        <View style={[sl.timeBlock, { alignItems: 'flex-end' }]}>
          <Text style={sl.timeLabel}>END</Text>
          <Text style={[sl.timeValue, !item.endTime && sl.timeValueOngoing]}>
            {item.endTime ? formatTime(item.endTime) : 'Ongoing'}
          </Text>
          {/* {item.endTime && (
            <Text style={sl.timeDateSub}>{formatDate(item.endTime)}</Text>
          )} */}
        </View>
      </View>

      {/* ── Stats strip ── */}
      <View style={sl.statsStrip}>
        <View style={sl.statCell}>
          <Timer size={14} color={ACCENT} strokeWidth={2} />
          <Text style={sl.statNum}>{duration}</Text>
          <Text style={sl.statLbl}>Duration</Text>
        </View>

        <View style={sl.statSep} />

        <View style={sl.statCell}>
          <Route size={14} color={ACCENT} strokeWidth={2} />
          <Text style={sl.statNum}>{distance}</Text>
          <Text style={sl.statLbl}>Distance</Text>
        </View>

        <View style={sl.statSep} />

        <View style={sl.statCell}>
          <MapPin size={14} color={ACCENT} strokeWidth={2} />
          <Text style={sl.statNum}>{routeCount}</Text>
          <Text style={sl.statLbl}>Points</Text>
        </View>
      </View>

      {/* ── Footer tap hint ── */}
      <View style={sl.cardFooter}>
        <Text style={sl.tapHint}>View on map</Text>
        <ChevronRight size={13} color={ACCENT} strokeWidth={2.5} />
      </View>
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

const RouteList = ({ navigation }) => {
  const dispatch = useDispatch();
  const { list: sessions = [], listState, error } = useSelector(s => s.session);

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab,  setActiveTab]  = useState('all');

  useEffect(() => {
    dispatch(fetchAllSessions());
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchAllSessions());
    setRefreshing(false);
  }, [dispatch]);

  const filteredSessions = useMemo(() => {
    if (activeTab === 'all') return sessions;
    return sessions.filter(s => isWithinTab(s.startTime, activeTab));
  }, [sessions, activeTab]);

  const tabCounts = useMemo(() => {
    const counts = {};
    TABS.forEach(({ key }) => {
      counts[key] =
        key === 'all'
          ? sessions.length
          : sessions.filter(s => isWithinTab(s.startTime, key)).length;
    });
    return counts;
  }, [sessions]);

  // ── Empty state ───────────────────────────────────────────────────────────
  const renderEmpty = () => {
    if (listState === 'loading') return null;
    const isFiltered = activeTab !== 'all';
    const tabLabel   = TABS.find(t => t.key === activeTab)?.label ?? '';
    return (
      <View style={sl.emptyBox}>
        <View style={sl.emptyIconWrap}>
          <CalendarDays size={32} color={ACCENT} strokeWidth={1.5} />
        </View>
        <Text style={sl.emptyTitle}>
          {isFiltered
            ? `No sessions this ${tabLabel.toLowerCase()}`
            : 'No sessions yet'}
        </Text>
        <Text style={sl.emptySubtitle}>
          {isFiltered
            ? 'Try a different time range'
            : 'Sessions will appear here once FSEs start tracking'}
        </Text>
        {isFiltered && (
          <TouchableOpacity
            style={sl.showAllBtn}
            onPress={() => setActiveTab('all')}
          >
            <Text style={sl.showAllBtnText}>View all sessions</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // ── Error screen ──────────────────────────────────────────────────────────
  if (listState === 'error' && sessions.length === 0) {
    return (
      <SafeAreaView style={sl.container} edges={['bottom']}>
        <Header title="Route List" />
        <View style={sl.centerBox}>
          <WifiOff size={48} color={ACCENT} strokeWidth={1.5} />
          <Text style={sl.errorTitle}>Connection Error</Text>
          <Text style={sl.errorSubtitle}>{error || 'Failed to load sessions.'}</Text>
          <TouchableOpacity
            style={sl.retryBtn}
            onPress={() => dispatch(fetchAllSessions())}
          >
            <RefreshCw size={15} color="#fff" strokeWidth={2} />
            <Text style={sl.retryBtnText}> Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={sl.container} edges={['bottom']}>
      <Header title="Route List" />

      {/* ── Tab bar ─────────────────────────────────────────────────────── */}
      <View style={sl.tabBarWrap}>
        <View style={sl.tabBar}>
          {TABS.map(tab => {
            const isSelected = activeTab === tab.key;
            const count      = tabCounts[tab.key] ?? 0;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[sl.tabItem, isSelected && sl.tabItemActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.75}
              >
                <Text style={[sl.tabLabel, isSelected && sl.tabLabelActive]}>
                  {tab.label}
                </Text>
                {count > 0 && (
                  <View style={[sl.tabBadge, isSelected && sl.tabBadgeActive]}>
                    <Text style={[sl.tabBadgeText, isSelected && sl.tabBadgeTextActive]}>
                      {count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Session list ─────────────────────────────────────────────────── */}
      {listState === 'loading' && sessions.length === 0 ? (
        <View style={sl.centerBox}>
          <ActivityIndicator size="large" color={ACCENT} />
          <Text style={sl.loadingText}>Loading sessions…</Text>
        </View>
      ) : (
        <FlatList
          data={filteredSessions}
          keyExtractor={item => item._id?.toString()}
          renderItem={({ item }) => (
            <SessionCard
              item={item}
              onPress={() => navigation.navigate('MapScreen', { session: item })}
            />
          )}
          ListEmptyComponent={renderEmpty}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={[
            sl.listContent,
            filteredSessions.length === 0 && { flex: 1 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[ACCENT]}
              tintColor={ACCENT}
            />
          }
        />
      )}

      {/* ── Floating count pill ──────────────────────────────────────────── */}
      {listState === 'success' && filteredSessions.length > 0 && (
        <View style={sl.countPill}>
          <Text style={sl.countText}>
            {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

// ─── Design tokens ────────────────────────────────────────────────────────────

const ACCENT  = '#dc2626'; // red
const SURFACE = '#ffffff';
const BG      = '#f4f4f5';

// ─── Styles ───────────────────────────────────────────────────────────────────

const sl = StyleSheet.create({
  container:   { flex: 1, backgroundColor: BG },
  listContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 90 },

  // ── Tab bar ──────────────────────────────────────────────────────────────
  tabBarWrap: {
    backgroundColor: SURFACE,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f5',
    borderRadius: 12,
    padding: 4,
    gap: 2,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 9,
    gap: 5,
  },
  tabItemActive: {
    backgroundColor: ACCENT,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#71717a',
  },
  tabLabelActive: {
    color: '#fff',
  },
  tabBadge: {
    backgroundColor: '#e4e4e7',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#71717a',
  },
  tabBadgeTextActive: {
    color: '#fff',
  },

  // ── Card ─────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: SURFACE,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    overflow: 'hidden',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#27272a',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeActive: { backgroundColor: '#16a34a' },
  badgeEnded:  { backgroundColor: '#a1a1aa' },
  badgeText:   { color: '#fff', fontSize: 11, fontWeight: '700' },

  // Time row
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  timeBlock: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 10,
    color: '#a1a1aa',
    fontWeight: '600',
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  timeValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#18181b',
    letterSpacing: -0.5,
  },
  timeValueOngoing: {
    color: '#16a34a',
    fontSize: 16,
  },
  timeDateSub: {
    fontSize: 11,
    color: '#a1a1aa',
    fontWeight: '500',
    marginTop: 2,
  },
  timeDividerVertical: {
    width: 1,
    backgroundColor: '#e4e4e7',
    marginHorizontal: 14,
    marginVertical: 4,
  },

  // Stats strip
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 0,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  statSep: {
    width: 1,
    backgroundColor: '#e4e4e7',
    marginVertical: 4,
  },
  statNum: {
    fontSize: 13,
    fontWeight: '700',
    color: '#18181b',
    marginTop: 2,
  },
  statLbl: {
    fontSize: 10,
    color: '#a1a1aa',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  // Card footer
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 10,
    gap: 2,
    borderTopWidth: 1,
    borderTopColor: '#f4f4f5',
    marginTop: 10,
  },
  tapHint: {
    fontSize: 12,
    color: ACCENT,
    fontWeight: '700',
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#27272a',
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 20,
  },
  showAllBtn: {
    marginTop: 20,
    backgroundColor: ACCENT,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 10,
  },
  showAllBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  // ── Center box ────────────────────────────────────────────────────────────
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 24,
  },
  loadingText:   { fontSize: 14, color: '#71717a', marginTop: 8 },
  errorTitle:    { fontSize: 17, fontWeight: '700', color: ACCENT, marginTop: 12 },
  errorSubtitle: { fontSize: 13, color: '#71717a', textAlign: 'center', marginTop: 4 },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  retryBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  // ── Count pill ────────────────────────────────────────────────────────────
  countPill: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  countText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});

export default RouteList;