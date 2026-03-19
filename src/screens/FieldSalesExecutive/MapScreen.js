import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { Navigation, Clock, MapPin, CheckCircle, Timer } from 'lucide-react-native';
import Header from '../../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSessionById,
  clearSelectedSession,
} from '../../services/features/fse/sessionSlice';

MapLibreGL.setAccessToken(null);

const MAPTILER_KEY = '3gTrSf36y6oirRLmBYot';

const ACCENT = '#dc2626';

const formatDateTime = iso => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDuration = (start, end) => {
  if (!start || !end) return '—';
  const ms = new Date(end) - new Date(start);
  const mins = Math.floor(ms / 60000);
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return hrs > 0 ? `${hrs}h ${rem}m` : `${mins}m`;
};

const PADDING = { top: 80, bottom: 80, left: 60, right: 60 };

const MapScreen = ({ route }) => {
  const dispatch = useDispatch();
  const { selected: session, detailState } = useSelector(s => s.session);
  const sessionId = route?.params?.session?._id;

  useEffect(() => {
    dispatch(clearSelectedSession());
  }, [dispatch]);

  useEffect(() => {
    if (sessionId) {
      dispatch(fetchSessionById(sessionId));
    }
  }, [sessionId, dispatch]);

  // ── Route GeoJSON ────────────────────────────────────────────────────────
  const routeGeoJSON = useMemo(() => {
    if (!session?.route || session.route.length < 2) return null;
    const coordinates = session.route
      .filter((point, index, arr) => {
        if (index === 0) return true;
        const prev = arr[index - 1];
        return (
          point.latitude !== prev.latitude || point.longitude !== prev.longitude
        );
      })
      .map(point => [point.longitude, point.latitude]);
    return {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates },
    };
  }, [session]);

  // ── Camera bounds ────────────────────────────────────────────────────────
  const cameraBounds = useMemo(() => {
    const pts = session?.route;
    if (!pts || pts.length === 0) return null;
    let minLat = pts[0].latitude, maxLat = pts[0].latitude;
    let minLng = pts[0].longitude, maxLng = pts[0].longitude;
    for (const p of pts) {
      if (p.latitude  < minLat) minLat = p.latitude;
      if (p.latitude  > maxLat) maxLat = p.latitude;
      if (p.longitude < minLng) minLng = p.longitude;
      if (p.longitude > maxLng) maxLng = p.longitude;
    }
    const EPSILON = 0.002;
    if (minLat === maxLat && minLng === maxLng) {
      return {
        ne: [maxLng + EPSILON, maxLat + EPSILON],
        sw: [minLng - EPSILON, minLat - EPSILON],
      };
    }
    return { ne: [maxLng, maxLat], sw: [minLng, minLat] };
  }, [session]);

  const centerCoord = useMemo(() => {
    if (session?.startLocation) {
      return [session.startLocation.longitude, session.startLocation.latitude];
    }
    return [79.82917, 11.935081];
  }, [session]);

  const startCoord = session?.route?.[0]
    ? [session.route[0].longitude, session.route[0].latitude]
    : centerCoord;

  const endCoord = session?.route?.length
    ? [
        session.route[session.route.length - 1].longitude,
        session.route[session.route.length - 1].latitude,
      ]
    : centerCoord;

  const isActive    = session?.status === 'ACTIVE';
  const routePoints = session?.route?.length || 0;

  // ── Loading ──────────────────────────────────────────────────────────────
  if (!session || detailState === 'loading' || detailState === 'idle') {
    return (
      <View style={ms.container}>
        <Header title="Map View" />
        <View style={ms.centerBox}>
          <ActivityIndicator size="large" color={ACCENT} />
          <Text style={ms.loadingText}>Loading map…</Text>
        </View>
      </View>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (detailState === 'error') {
    return (
      <View style={ms.container}>
        <Header title="FSE Map View" />
        <View style={ms.centerBox}>
          <Text style={ms.errorText}>Failed to load session.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={ms.container}>
      <Header title="FSE Map View" />

      {/* ── Map ── */}
      <MapLibreGL.MapView
        style={ms.map}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`}
      >
        {cameraBounds ? (
          <MapLibreGL.Camera
            bounds={cameraBounds}
            padding={PADDING}
            animationMode="flyTo"
            animationDuration={1000}
          />
        ) : (
          <MapLibreGL.Camera
            centerCoordinate={centerCoord}
            zoomLevel={14}
            animationMode="flyTo"
            animationDuration={1000}
          />
        )}

        {routeGeoJSON && (
          <MapLibreGL.ShapeSource id="routeSource" shape={routeGeoJSON}>
            <MapLibreGL.LineLayer
              id="routeOutline"
              style={{ lineColor: '#ffffff', lineWidth: 6, lineCap: 'round', lineJoin: 'round' }}
            />
            <MapLibreGL.LineLayer
              id="routeLine"
              style={{ lineColor: '#22c55e', lineWidth: 4, lineCap: 'round', lineJoin: 'round' }}
            />
          </MapLibreGL.ShapeSource>
        )}

        {routeGeoJSON && (
          <MapLibreGL.ShapeSource id="routeDotsSource" shape={routeGeoJSON}>
            <MapLibreGL.CircleLayer
              id="routeDots"
              style={{
                circleRadius: 3,
                circleColor: '#2563eb',
                circleStrokeWidth: 1,
                circleStrokeColor: '#ffffff',
              }}
            />
          </MapLibreGL.ShapeSource>
        )}

        <MapLibreGL.PointAnnotation id="start" coordinate={startCoord}>
          <View style={ms.markerStart}>
            <Navigation size={14} color="#fff" />
          </View>
        </MapLibreGL.PointAnnotation>

        {!isActive && (
          <MapLibreGL.PointAnnotation id="end" coordinate={endCoord}>
            <View style={ms.markerEnd}>
              <CheckCircle size={14} color="#fff" />
            </View>
          </MapLibreGL.PointAnnotation>
        )}

        {isActive && (
          <MapLibreGL.PointAnnotation id="live" coordinate={endCoord}>
            <View style={ms.markerLive}>
              <View style={ms.markerLiveDot} />
            </View>
          </MapLibreGL.PointAnnotation>
        )}
      </MapLibreGL.MapView>

      {/* ── Bottom info card ── */}
      <View style={ms.infoCard}>

        {/* Row 1: badge + distance */}
        <View style={ms.row}>
          <View style={[ms.badge, isActive ? ms.badgeActive : ms.badgeEnded]}>
            {isActive
              ? <Navigation size={10} color="#fff" strokeWidth={2.5} />
              : <CheckCircle size={10} color="#fff" strokeWidth={2.5} />
            }
            <Text style={ms.badgeText}>  {isActive ? 'ACTIVE' : 'ENDED'}</Text>
          </View>
          <Text style={ms.distance}>
            {session.totalDistanceKm?.toFixed(3) ?? '0.000'} km
          </Text>
        </View>

        {/* Row 2: Start */}
        <View style={ms.infoRow}>
          <Clock size={12} color="#16a34a" strokeWidth={2} />
          <Text style={ms.infoLabel}>  Start</Text>
          <Text style={ms.infoValue}>{formatDateTime(session.startTime)}</Text>
        </View>

        {/* Row 3: End */}
        <View style={ms.infoRow}>
          <Clock size={12} color={ACCENT} strokeWidth={2} />
          <Text style={ms.infoLabel}>  End</Text>
          <Text style={ms.infoValue}>
            {session.endTime ? formatDateTime(session.endTime) : 'Ongoing…'}
          </Text>
        </View>

        {/* Row 4: Duration */}
        <View style={ms.infoRow}>
          <Timer size={12} color="#888" strokeWidth={2} />
          <Text style={ms.infoLabel}>  Duration</Text>
          <Text style={ms.infoValue}>
            {formatDuration(session.startTime, session.endTime)}
          </Text>
        </View>

        {/* Row 5: GPS Points */}
        <View style={ms.infoRow}>
          <MapPin size={12} color="#888" strokeWidth={2} />
          <Text style={ms.infoLabel}>  Points</Text>
          <Text style={ms.infoValue}>{routePoints} GPS points</Text>
        </View>

      </View>
    </View>
  );
};

const ms = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  map:       { flex: 1 },

  centerBox: {
    flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10,
  },
  loadingText: { fontSize: 14, color: '#888', marginTop: 8 },
  errorText:   { fontSize: 14, color: ACCENT, marginTop: 8 },

  // ── Markers (unchanged) ─────────────────────────────────────────────────
  markerStart: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#16a34a',
    justifyContent: 'center', alignItems: 'center',
    elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4,
  },
  markerEnd: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: ACCENT,
    justifyContent: 'center', alignItems: 'center',
    elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4,
  },
  markerLive: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(22,163,74,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  markerLiveDot: {
    width: 16, height: 16, borderRadius: 8, backgroundColor: '#16a34a',
  },

  // ── Info card ─────────────────────────────────────────────────────────────
  infoCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e4e4e7',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeActive: { backgroundColor: '#16a34a' },
  badgeEnded:  { backgroundColor: '#6b7280' },
  badgeText:   { color: '#fff', fontSize: 11, fontWeight: '700' },
  distance:    { fontSize: 14, fontWeight: '700', color: '#18181b' },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
  },
  infoLabel: { fontSize: 12, color: '#888', width: 72 },
  infoValue: { fontSize: 12, fontWeight: '600', color: '#18181b', flex: 1 },
});

export default MapScreen;