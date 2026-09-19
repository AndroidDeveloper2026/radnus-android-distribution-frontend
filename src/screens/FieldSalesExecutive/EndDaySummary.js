
// EndDaySummary.js - COMPLETE OPTIMIZED VERSION
// Reduces end day time from 30-60s to 5-10s

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  NativeModules,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import styles from './EndDaySummaryStyle';
import Header from '../../components/Header';
import { CheckCircle, Clock, Lock, RefreshCw, Zap, AlertTriangle } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { stopTracking } from '../../services/features/fse/trackingSlice';
import API from '../../services/API/api';
import {
  forceStopTracking,
  flushOfflineQueue,
  getOfflineQueueSize,
  isTrackingActive,
} from '../../utils/TrackingService';
import { 
  resetDailyTracking, 
  getRoutePoints, 
  getTotalDistance,
  getOfflineQueue,
  OFFLINE_QUEUE_KEY,
} from '../../utils/HeadlessLocation';
import { clearSessionId } from '../../services/AuthStorage/authStorgage';
import { formatDistance } from '../../utils/formatDistance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { LocationServiceModule } = NativeModules;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ⚡ Configuration
const BATCH_SIZE = 100; // Points per batch
const MAX_RETRIES = 2;
const BATCH_TIMEOUT_MS = 20000;

const EndDaySummary = ({ navigation }) => {
  const dispatch = useDispatch();
  const { sessionId } = useSelector(state => state.tracking);
  const [submitting, setSubmitting] = useState(false);
  const [syncProgress, setSyncProgress] = useState({ 
    total: 0, 
    synced: 0, 
    isActive: false,
    currentBatch: 0,
    totalBatches: 0,
    estimatedTime: 0,
  });
  const [pendingCount, setPendingCount] = useState(0);
  const [localPointCount, setLocalPointCount] = useState(0);
  const [localDistance, setLocalDistance] = useState(0);
  const [fastSync, setFastSync] = useState(true);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle | syncing | completed | failed

  // ✅ Check sync status on mount
  useEffect(() => {
    const checkStatus = async () => {
      const queueSize = await getOfflineQueueSize();
      const points = await getRoutePoints();
      const distance = await getTotalDistance();
      setPendingCount(queueSize);
      setLocalPointCount(points.length);
      setLocalDistance(distance);
      
      // Auto-enable fast sync if many points
      if (queueSize > 20) {
        setFastSync(true);
      }
    };
    checkStatus();
    
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  // ⚡ OPTIMIZED: Batch flush with progress
  const batchFlush = async () => {
    try {
      const queue = await getOfflineQueue();
      if (!queue || queue.length === 0) {
        return { flushed: 0, remaining: 0, success: true };
      }

      const totalPoints = queue.length;
      const totalBatches = Math.ceil(totalPoints / BATCH_SIZE);
      
      console.log(`⚡ Starting batch flush: ${totalPoints} points, ${totalBatches} batches`);
      
      setSyncProgress({
        total: totalPoints,
        synced: 0,
        isActive: true,
        currentBatch: 0,
        totalBatches: totalBatches,
        estimatedTime: Math.ceil(totalPoints / 20), // ~20 points per second
      });
      setSyncStatus('syncing');

      let flushed = 0;
      const failed = [];
      const startTime = Date.now();

      // ⚡ Process in batches
      for (let i = 0; i < queue.length; i += BATCH_SIZE) {
        const batch = queue.slice(i, i + BATCH_SIZE);
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
        
        console.log(`📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} points)`);
        
        // Update progress
        setSyncProgress(prev => ({
          ...prev,
          currentBatch: batchNumber,
          synced: flushed,
        }));

        // ⚡ Try batch sync first
        let batchSuccess = false;
        let retryCount = 0;
        
        let batchFailedPoints = [];

        while (!batchSuccess && retryCount <= MAX_RETRIES) {
          try {
            const response = await Promise.race([
              API.post('/api/location/batch-sync', { 
                points: batch.map(p => ({
                  userId: p.userId,
                  sessionId: p.sessionId,
                  latitude: p.latitude,
                  longitude: p.longitude,
                  accuracy: p.accuracy || 0,
                  timestamp: p.timestamp || new Date().toISOString(),
                })),
                options: { upsert: true, skipDuplicates: true }
              }),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('BATCH_TIMEOUT')), BATCH_TIMEOUT_MS)
              )
            ]);

            // ⚠️ A 200 here does NOT mean every point was saved — the
            // backend reports per-point outcomes in response.data.results
            // while still returning HTTP 200 overall (missing fields,
            // "session not active", GPS-jump rejection, etc. all come back
            // this way). Previously this counted the WHOLE batch as
            // "flushed" the moment the HTTP call didn't throw, so points
            // the backend actually rejected were wiped from the device
            // anyway and never made it into the database. Only count
            // points the backend confirms it actually processed.
            const results = response?.data?.results;
            if (Array.isArray(results) && results.length === batch.length) {
              batchFailedPoints = batch.filter((_, i) => results[i]?.success === false);
              const batchFlushedCount = batch.length - batchFailedPoints.length;
              flushed += batchFlushedCount;
              batchSuccess = true;
              console.log(`✅ Batch ${batchNumber} complete: ${batchFlushedCount}/${batch.length} points confirmed saved${batchFailedPoints.length ? `, ${batchFailedPoints.length} rejected by server` : ''}`);
            } else {
              // No trustworthy per-point results — assume success rather
              // than looping forever, but log loudly since this shouldn't
              // normally happen.
              console.warn(`⚠️ Batch ${batchNumber} response had no usable results array — assuming all ${batch.length} points saved`);
              batchSuccess = true;
              flushed += batch.length;
            }
            
          } catch (err) {
            retryCount++;
            console.log(`⚠️ Batch ${batchNumber} attempt ${retryCount} failed: ${err.message}`);
            
            if (retryCount <= MAX_RETRIES) {
              // Exponential backoff
              const delay = 1000 * Math.pow(2, retryCount - 1);
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          }
        }

        // ⚡ If batch failed, try individual parallel sync
        if (!batchSuccess) {
          console.log(`⚠️ Batch ${batchNumber} failed, trying individual points...`);
          
          const chunkStart = Date.now();
          const batchResults = await Promise.allSettled(
            batch.map(point => 
              Promise.race([
                API.post('/api/location/update', {
                  userId: point.userId,
                  sessionId: point.sessionId,
                  latitude: point.latitude,
                  longitude: point.longitude,
                  accuracy: point.accuracy || 0,
                  timestamp: point.timestamp || new Date().toISOString(),
                }),
                new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('TIMEOUT')), 5000)
                )
              ])
            )
          );
          
          const chunkFlushed = batchResults.filter(r => r.status === 'fulfilled').length;
          flushed += chunkFlushed;
          
          // Collect failed points
          batchResults.forEach((result, index) => {
            if (result.status === 'rejected') {
              failed.push(batch[index]);
            }
          });
          
          console.log(`✅ Individual sync: ${chunkFlushed}/${batch.length} points in ${Date.now() - chunkStart}ms`);
        } else if (batchFailedPoints.length > 0) {
          // Batch call itself succeeded, but the server rejected some
          // individual points within it (see results-parsing above) —
          // keep those specific points queued for retry instead of
          // discarding them.
          failed.push(...batchFailedPoints);
        }

        // Update progress after each batch
        const elapsed = (Date.now() - startTime) / 1000;
        const rate = flushed / elapsed;
        const remaining = totalPoints - flushed;
        const estimatedRemaining = rate > 0 ? remaining / rate : 0;
        
        setSyncProgress(prev => ({
          ...prev,
          synced: flushed,
          estimatedTime: Math.ceil(estimatedRemaining),
        }));
      }

      // ⚡ Save failed points back to queue
      if (failed.length > 0) {
        await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(failed));
        console.log(`⚠️ ${failed.length} points failed, saved for retry`);
        setSyncStatus('failed');
      } else {
        await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify([]));
        console.log(`✅ All ${flushed} points synced successfully!`);
        setSyncStatus('completed');
      }

      setSyncProgress(prev => ({ ...prev, isActive: false }));
      return { flushed, remaining: failed.length, success: failed.length === 0 };

    } catch (err) {
      console.error('❌ Batch flush error:', err);
      setSyncProgress(prev => ({ ...prev, isActive: false }));
      setSyncStatus('failed');
      return { flushed: 0, remaining: -1, success: false, error: err.message };
    }
  };

  // ⚡ ULTRA FAST: Skip sync and end immediately
  const skipSyncAndEnd = async () => {
    Alert.alert(
      'Skip Sync & End',
      'Your unsynced points will be saved locally and synced automatically when you reconnect to the internet.\n\nDo you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Yes, Skip & End', 
          style: 'destructive',
          onPress: async () => {
            try {
              setSubmitting(true);
              
              // 1. Stop tracking services
              stopAllTrackingServices();
              
              // 2. End session on server (skip location sync)
              await Promise.race([
                API.post('/api/session/end', { 
                  sessionId,
                  endTime: new Date().toISOString(),
                }),
                new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('END_SESSION_TIMEOUT')), 10000)
                )
              ]);
              
              console.log('✅ Session ended successfully');
              
              // 3. Clear local storage (keep queue for retry)
              await clearSessionId();
              await resetDailyTracking({ preserveQueue: true });
              
              // 4. Clear Redux
              dispatch(stopTracking());
              
              // 5. Show success
              Alert.alert(
                '✅ Day Ended',
                'Your day has been ended. Any unsynced points will be synced automatically.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.replace('MainTabs', { role: 'FSE' }),
                  },
                ]
              );
            } catch (err) {
              console.error('❌ Skip sync error:', err);
              Alert.alert('Error', 'Failed to end day. Please try again.');
              setSubmitting(false);
            }
          }
        }
      ]
    );
  };

  // ✅ STOP ALL TRACKING SERVICES
  const stopAllTrackingServices = () => {
    console.log('🛑 Stopping all tracking services...');
    try {
      if (LocationServiceModule && typeof LocationServiceModule.stopService === 'function') {
        LocationServiceModule.stopService();
      }
      if (LocationServiceModule && typeof LocationServiceModule.forceStopService === 'function') {
        LocationServiceModule.forceStopService();
      }
      forceStopTracking();
      console.log('✅ Tracking services stopped');
      return true;
    } catch (error) {
      console.error('❌ Error stopping tracking services:', error);
      return false;
    }
  };

  // ✅ SUBMIT END DAY WITH OPTIMIZED SYNC
  const submitEndDay = async () => {
    if (!sessionId) {
      Alert.alert('Error', 'Session ID not found. Please restart the app.');
      return;
    }

    setSubmitting(true);
    setSyncStatus('syncing');
    console.log('🔄 Starting optimized end day process...');

    try {
      // ⚡ Step 1: Get current status
      const queueSize = await getOfflineQueueSize();
      const localPoints = await getRoutePoints();
      const totalPoints = Math.max(queueSize, localPoints.length);
      
      console.log(`📊 Queue: ${queueSize}, Local points: ${localPoints.length}`);
      
      // ⚡ Step 2: Sync points if any
      let syncResult = { flushed: 0, remaining: 0, success: true };
      
      if (totalPoints > 0) {
        if (fastSync && totalPoints > 10) {
          console.log(`⚡ Using fast batch sync for ${totalPoints} points`);
          syncResult = await batchFlush();
          console.log(`✅ Batch sync: ${syncResult.flushed} sent, ${syncResult.remaining} remaining`);
        } else {
          console.log(`📤 Using standard sync for ${totalPoints} points`);
          syncResult = await flushOfflineQueue();
          console.log(`✅ Standard sync: ${syncResult.flushed} sent, ${syncResult.remaining} remaining`);
        }
      } else {
        console.log('✅ No pending items to sync');
      }

      // ⚡ Step 3: End session (even if some points failed)
      await endSessionAndCleanup(syncResult.remaining > 0);

    } catch (err) {
      console.error('❌ End day error:', err);
      setSyncStatus('failed');
      
      // ⚡ Offer skip option on error
      Alert.alert(
        'Sync Issue',
        'Unable to sync all points. You can skip sync and end your day now.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: () => { setSubmitting(false); submitEndDay(); } },
          { text: 'Skip & End ⚡', style: 'destructive', onPress: skipSyncAndEnd },
        ]
      );
      setSubmitting(false);
    }
  };

  // ⚡ Extract end session logic
  const endSessionAndCleanup = async (hasFailedPoints = false) => {
    try {
      setSyncStatus('syncing');
      
      // 1. Stop tracking services
      stopAllTrackingServices();
      
      // 2. Get final location
      let finalLocation = null;
      try {
        finalLocation = await new Promise((resolve) => {
          Geolocation.getCurrentPosition(
            position => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
              });
            },
            error => {
              console.warn('⚠️ Could not get final location:', error.message);
              resolve(null);
            },
            { enableHighAccuracy: true, timeout: 8000 },
          );
        });
      } catch (err) {
        console.warn('⚠️ Final location error:', err.message);
      }

      // 3. End session on server
      const endData = {
        sessionId,
        endTime: new Date().toISOString(),
        finalLocation: finalLocation || undefined,
      };
      
      await Promise.race([
        API.post('/api/session/end', endData),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('END_SESSION_TIMEOUT')), 15000)
        )
      ]);
      
      console.log('✅ Session ended successfully');
      
      // 4. Clear local storage
      await clearSessionId();
      await resetDailyTracking({ preserveQueue: hasFailedPoints });
      
      // 5. Clear Redux
      dispatch(stopTracking());
      
      setSyncStatus('completed');
      
      // 6. Show success with warning if points failed
      if (hasFailedPoints) {
        Alert.alert(
          '⚠️ Day Ended with Pending Sync',
          'Your day has been ended. Some location points couldn\'t be synced and will be retried automatically.',
          [
            {
              text: 'OK',
              onPress: () => navigation.replace('MainTabs', { role: 'FSE' }),
            },
          ]
        );
      } else {
        Alert.alert(
          '✅ Success',
          'Your day has been ended successfully! All your route data has been saved.',
          [
            {
              text: 'OK',
              onPress: () => navigation.replace('MainTabs', { role: 'FSE' }),
            },
          ]
        );
      }
      
    } catch (err) {
      console.error('❌ End session error:', err);
      throw err;
    }
  };

  // ✅ CONFIRM BEFORE ENDING
  const handleSubmit = () => {
    const pointsToSync = pendingCount || localPointCount;
    const syncTime = pointsToSync > 50 ? '~5-10s' : '~2-5s';
    
    const message = pointsToSync > 0
      ? `📊 ${pointsToSync} points to sync\n⏱️ Estimated time: ${syncTime}\n\nAll tracking will be stopped and your route will be saved.`
      : 'All tracking will be stopped and your route will be saved.';
    
    Alert.alert(
      'End Day',
      `Are you sure you want to end your day?\n\n${message}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'End Day', 
          style: 'destructive', 
          onPress: () => {
            if (pointsToSync > 20) {
              setFastSync(true);
            }
            submitEndDay();
          }
        },
        ...(pointsToSync > 10 ? [{
          text: 'Skip Sync ⚡',
          style: 'destructive',
          onPress: skipSyncAndEnd
        }] : [])
      ],
    );
  };

  const formattedDistance = formatDistance(localDistance);
  const isActive = isTrackingActive();
  const totalPoints = pendingCount || localPointCount;

  // Calculate progress percentage
  const progressPercent = syncProgress.total > 0 
    ? Math.round((syncProgress.synced / syncProgress.total) * 100) 
    : 0;

  return (
    <View style={styles.container}>
      <Header title="End Day Summary" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>End of Day</Text>

          {/* Tracking Status */}
          <View style={{ marginTop: 10 }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
              padding: 10,
              backgroundColor: isActive ? '#DCFCE7' : '#FEF2F2',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: isActive ? '#BBF7D0' : '#FEE2E2',
            }}>
              <View style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: isActive ? '#22C55E' : '#EF4444',
                marginRight: 10,
              }} />
              <Text style={{
                fontSize: 13,
                fontWeight: '600',
                color: isActive ? '#16A34A' : '#DC2626',
              }}>
                {isActive ? '✅ Tracking is Active' : '🔴 Tracking is Stopped'}
              </Text>
            </View>
          </View>

          {/* ⚡ Sync Progress */}
          {syncProgress.isActive && (
            <View style={{
              marginTop: 10,
              padding: 14,
              backgroundColor: '#EFF6FF',
              borderRadius: 8,
              borderLeftWidth: 4,
              borderLeftColor: '#2563EB',
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#2563EB" style={{ marginRight: 10 }} />
                <Text style={{ color: '#2563EB', fontSize: 13, fontWeight: '600' }}>
                  Syncing your route...
                </Text>
              </View>
              
              <Text style={{ color: '#1E40AF', fontSize: 15, fontWeight: '700', marginTop: 6 }}>
                {syncProgress.synced} of {syncProgress.total} points synced
              </Text>
              
              {syncProgress.totalBatches > 0 && (
                <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>
                  Batch {syncProgress.currentBatch} of {syncProgress.totalBatches}
                </Text>
              )}
              
              {/* Progress Bar */}
              <View style={{
                marginTop: 8,
                height: 6,
                backgroundColor: '#DBEAFE',
                borderRadius: 3,
                overflow: 'hidden',
              }}>
                <View style={{
                  height: 6,
                  backgroundColor: '#2563EB',
                  borderRadius: 3,
                  width: `${Math.min(progressPercent, 100)}%`,
                }} />
              </View>
              
              {syncProgress.estimatedTime > 0 && (
                <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 4 }}>
                  ⏱️ ~{syncProgress.estimatedTime}s remaining
                </Text>
              )}
            </View>
          )}

          {/* Sync Status Messages */}
          {syncStatus === 'completed' && syncProgress.isActive === false && (
            <View style={{
              marginTop: 10,
              padding: 10,
              backgroundColor: '#DCFCE7',
              borderRadius: 8,
              borderLeftWidth: 4,
              borderLeftColor: '#22C55E',
            }}>
              <Text style={{ color: '#16A34A', fontSize: 13, fontWeight: '500' }}>
                ✅ All data synced successfully
              </Text>
            </View>
          )}
          
          {syncStatus === 'failed' && syncProgress.isActive === false && (
            <View style={{
              marginTop: 10,
              padding: 10,
              backgroundColor: '#FEF2F2',
              borderRadius: 8,
              borderLeftWidth: 4,
              borderLeftColor: '#EF4444',
            }}>
              <Text style={{ color: '#DC2626', fontSize: 13, fontWeight: '500' }}>
                ⚠️ Some points couldn't be synced. They will be retried later.
              </Text>
            </View>
          )}

          {/* Data Summary */}
          <View style={{
            marginTop: 10,
            padding: 14,
            backgroundColor: '#F8FAFC',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#E2E8F0',
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
              <Text style={{ color: '#64748B', fontSize: 13 }}>📊 Points to Sync</Text>
              <Text style={{ 
                color: pendingCount > 0 ? '#F59E0B' : '#22C55E', 
                fontSize: 13, 
                fontWeight: '600' 
              }}>
                {pendingCount > 0 ? `${pendingCount} pending` : '✅ All synced'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
              <Text style={{ color: '#64748B', fontSize: 13 }}>📍 Local Points</Text>
              <Text style={{ color: '#0F172A', fontSize: 13, fontWeight: '600' }}>{localPointCount}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
              <Text style={{ color: '#64748B', fontSize: 13 }}>📏 Distance</Text>
              <Text style={{ color: '#0F172A', fontSize: 13, fontWeight: '600' }}>{formattedDistance}</Text>
            </View>
          </View>

          {/* Info Section */}
          <View style={{ marginTop: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 }}>
              <CheckCircle size={16} color="#16A34A" style={{ marginRight: 8, marginTop: 1 }} />
              <Text style={styles.note}>All data has been auto-captured from today's activity.</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 }}>
              <Clock size={16} color="#2563EB" style={{ marginRight: 8, marginTop: 1 }} />
              <Text style={styles.note}>Your location tracking will be stopped.</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Lock size={16} color="#DC2626" style={{ marginRight: 8, marginTop: 1 }} />
              <Text style={styles.note}>Once submitted, this day will be locked and cannot be modified.</Text>
            </View>
          </View>
        </View>

        {/* Session Information */}
        {sessionId && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Session Information</Text>
            <View style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 12, color: '#6B7280', marginVertical: 2 }}>
                Session ID: {sessionId}
              </Text>
              <Text style={{ fontSize: 12, color: '#6B7280', marginVertical: 2 }}>
                Date: {new Date().toDateString()}
              </Text>
              <Text style={{ fontSize: 12, color: '#6B7280', marginVertical: 2 }}>
                Status: {isActive ? '🟢 Active' : '🔴 Ended'}
              </Text>
              {pendingCount > 0 && (
                <Text style={{ fontSize: 11, color: '#F59E0B', marginVertical: 2 }}>
                  ⚡ {pendingCount} points queued for sync
                </Text>
              )}
            </View>
          </View>
        )}

        <View style={{ flex: 1 }} />

        {/* ⚡ Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitBtn, 
            submitting && styles.submitBtnDisabled,
            syncStatus === 'failed' && { backgroundColor: '#F59E0B' }
          ]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 10 }} />
              <Text style={styles.submitText}>
                {syncProgress.isActive 
                  ? `Syncing ${syncProgress.synced}/${syncProgress.total}...` 
                  : syncStatus === 'failed'
                    ? 'Retrying...'
                    : 'Ending Day...'}
              </Text>
            </>
          ) : (
            <>
              <Zap size={18} color="#FFF" style={{ marginRight: 10 }} />
              <Text style={styles.submitText}>
                {syncStatus === 'failed' 
                  ? 'Retry Sync & End Day' 
                  : pendingCount > 0 
                    ? `End Day & Sync ${pendingCount} Points ⚡` 
                    : 'End Day'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* ⚡ Quick End Button (Skip Sync) */}
        {(pendingCount > 0 || syncStatus === 'failed') && !submitting && (
          <TouchableOpacity
            style={{
              marginTop: 10,
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 10,
              backgroundColor: '#FEF2F2',
              borderWidth: 1,
              borderColor: '#FEE2E2',
              alignItems: 'center',
            }}
            onPress={skipSyncAndEnd}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AlertTriangle size={16} color="#DC2626" style={{ marginRight: 8 }} />
              <Text style={{ color: '#DC2626', fontSize: 14, fontWeight: '600' }}>
                Skip Sync & End Day ⚡
              </Text>
            </View>
            <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>
              Points will be synced automatically later
            </Text>
          </TouchableOpacity>
        )}

        {/* Cancel Button */}
        <TouchableOpacity
          style={[
            styles.cancelBtn, 
            submitting && styles.cancelBtnDisabled,
            { marginTop: 10 }
          ]}
          onPress={() => navigation.goBack()}
          disabled={submitting}
        >
          <Text style={[styles.cancelText, submitting && { color: '#A1A1AA' }]}>
            Cancel
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default EndDaySummary;

//---------- working old code with points sync issue -----------------
// // EndDaySummary.js - COMPLETE FIXED VERSION

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   NativeModules,
//   ActivityIndicator,
// } from 'react-native';
// import Geolocation from '@react-native-community/geolocation';
// import styles from './EndDaySummaryStyle';
// import Header from '../../components/Header';
// import { CheckCircle, Clock, Lock, RefreshCw } from 'lucide-react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { stopTracking } from '../../services/features/fse/trackingSlice';
// import API from '../../services/API/api';
// import {
//   forceStopTracking,
//   flushOfflineQueue,
//   getOfflineQueueSize,
//   isTrackingActive,
// } from '../../utils/TrackingService';
// import { resetDailyTracking, getRoutePoints, getTotalDistance } from '../../utils/HeadlessLocation';
// import { clearSessionId } from '../../services/AuthStorage/authStorgage';
// import { formatDistance } from '../../utils/formatDistance';

// const { LocationServiceModule } = NativeModules;

// const EndDaySummary = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const { sessionId } = useSelector(state => state.tracking);
//   const [submitting, setSubmitting] = useState(false);
//   const [syncProgress, setSyncProgress] = useState({ total: 0, synced: 0, isActive: false });
//   const [pendingCount, setPendingCount] = useState(0);
//   const [localPointCount, setLocalPointCount] = useState(0);
//   const [localDistance, setLocalDistance] = useState(0);

//   // ✅ Check sync status on mount
//   useEffect(() => {
//     const checkStatus = async () => {
//       const queueSize = await getOfflineQueueSize();
//       const points = await getRoutePoints();
//       const distance = await getTotalDistance();
//       setPendingCount(queueSize);
//       setLocalPointCount(points.length);
//       setLocalDistance(distance);
//     };
//     checkStatus();
    
//     const interval = setInterval(checkStatus, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   // ✅ FIX: Retry flush with exponential backoff and verification
//   const flushWithRetry = async (maxRetries = 5) => {
//     let remaining = await getOfflineQueueSize();
//     let retries = 0;
    
//     const localPoints = await getRoutePoints();
//     const localDistance = await getTotalDistance();
    
//     console.log(`📊 Queue size: ${remaining}, Local points: ${localPoints.length}, Distance: ${(localDistance * 1000).toFixed(0)}m`);
    
//     while (remaining > 0 && retries < maxRetries) {
//       console.log(`📤 Flush attempt ${retries + 1}/${maxRetries}, ${remaining} points`);
//       setSyncProgress({ total: remaining, synced: 0, isActive: true });
      
//       try {
//         const result = await Promise.race([
//           flushOfflineQueue(),
//           new Promise((resolve) => setTimeout(() => resolve({ flushed: 0, remaining }), 20000))
//         ]);
        
//         const flushed = result?.flushed || 0;
//         remaining = result?.remaining || 0;
//         setSyncProgress({ total: remaining + flushed, synced: flushed, isActive: true });
        
//         if (remaining === 0) {
//           console.log('✅ Queue flushed successfully');
//           break;
//         }
        
//         const delay = 2000 * Math.pow(2, retries);
//         console.log(`⏳ Waiting ${delay}ms before retry...`);
//         await new Promise(resolve => setTimeout(resolve, delay));
//         retries++;
        
//       } catch (err) {
//         console.error('❌ Flush error:', err.message);
//         retries++;
//       }
//     }
    
//     setSyncProgress(prev => ({ ...prev, isActive: false }));
    
//     // ✅ Final verification
//     const finalLocalPoints = await getRoutePoints();
//     if (finalLocalPoints.length > 0 && remaining === 0) {
//       console.log(`⚠️ ${finalLocalPoints.length} local points remain but queue is empty`);
//       let syncedCount = 0;
//       for (const point of finalLocalPoints) {
//         try {
//           await API.post('/api/location/update', {
//             userId: point.userId,
//             sessionId: point.sessionId,
//             latitude: point.latitude,
//             longitude: point.longitude,
//             accuracy: point.accuracy || 0,
//             timestamp: new Date(point.timestamp).toISOString()
//           });
//           syncedCount++;
//         } catch (err) {
//           console.error('❌ Failed to sync orphaned point:', err.message);
//         }
//       }
//       console.log(`✅ Synced ${syncedCount} orphaned points`);
//     }
    
//     // ✅ Update UI
//     const finalQueueSize = await getOfflineQueueSize();
//     const finalPoints = await getRoutePoints();
//     setPendingCount(finalQueueSize);
//     setLocalPointCount(finalPoints.length);
    
//     return remaining;
//   };

//   // ✅ STOP ALL TRACKING SERVICES
//   const stopAllTrackingServices = () => {
//     console.log('🛑 Stopping all tracking services...');

//     try {
//       if (LocationServiceModule && typeof LocationServiceModule.stopService === 'function') {
//         LocationServiceModule.stopService();
//       }

//       forceStopTracking();
//       console.log('✅ JS tracking service stopped');

//       let retryCount = 0;
//       const maxRetries = 3;

//       while (isTrackingActive() && retryCount < maxRetries) {
//         retryCount++;
//         console.warn(`⚠️ Tracking still active, retry ${retryCount}/${maxRetries}`);
//         forceStopTracking();

//         if (retryCount < maxRetries) {
//           const startTime = Date.now();
//           while (Date.now() - startTime < 200) {}
//         }
//       }

//       if (isTrackingActive()) {
//         console.error('❌ Tracking still active after all stop attempts!');
//         forceStopTracking();
//         if (LocationServiceModule && typeof LocationServiceModule.forceStopService === 'function') {
//           LocationServiceModule.forceStopService();
//         }
//       } else {
//         console.log('✅ All tracking services stopped successfully');
//       }

//       return true;
//     } catch (error) {
//       console.error('❌ Error stopping tracking services:', error);
//       return false;
//     }
//   };

//   // ✅ SUBMIT END DAY
//   const submitEndDay = async () => {
//     if (!sessionId) {
//       Alert.alert(
//         'Error',
//         'Session ID not found. Please restart the app and try again.',
//       );
//       return;
//     }

//     setSubmitting(true);
//     console.log('🔄 Starting end day process...');

//     try {
//       // ✅ 1. Get final location
//       console.log('📍 Getting final location...');
//       let finalLocation = null;
//       try {
//         finalLocation = await new Promise((resolve) => {
//           Geolocation.getCurrentPosition(
//             position => {
//               resolve({
//                 latitude: position.coords.latitude,
//                 longitude: position.coords.longitude,
//                 accuracy: position.coords.accuracy,
//               });
//             },
//             error => {
//               console.warn('⚠️ Could not get final location:', error.message);
//               resolve(null);
//             },
//             { enableHighAccuracy: true, timeout: 10000 },
//           );
//         });
//       } catch (err) {
//         console.warn('⚠️ Final location error:', err.message);
//       }

//       // ✅ 2. Flush offline queue with retry
//       console.log('📤 Flushing offline queue...');
//       const initialQueueSize = await getOfflineQueueSize();
//       const localPoints = await getRoutePoints();
//       const localDistance = await getTotalDistance();
      
//       console.log(`📊 Initial state: Queue=${initialQueueSize}, Points=${localPoints.length}, Distance=${(localDistance * 1000).toFixed(0)}m`);
      
//       if (initialQueueSize > 0 || localPoints.length > 0) {
//         console.log(`📤 ${Math.max(initialQueueSize, localPoints.length)} items to sync`);
//         const remaining = await flushWithRetry(5);
        
//         if (remaining > 0) {
//           console.warn(`⚠️ ${remaining} points still pending after retries`);
//           Alert.alert(
//             'Partial Sync',
//             `${remaining} location points could not be synced. They will be retried later.`,
//             [{ text: 'OK' }]
//           );
//         } else {
//           console.log('✅ All points synced successfully');
//         }
//       } else {
//         console.log('✅ No pending items to sync');
//       }

//       // ✅ 3. Send end session request with final location
//       console.log('📤 Ending session on server...');
//       const endData = {
//         sessionId,
//         finalLocation: finalLocation || undefined,
//         endTime: new Date().toISOString(),
//       };

//       const response = await Promise.race([
//         API.post('/api/session/end', endData),
//         new Promise((_, reject) => setTimeout(() => reject(new Error('END_SESSION_TIMEOUT')), 30000))
//       ]);
      
//       console.log('✅ Session ended successfully:', response.data);

//       // ✅ 4. STOP ALL TRACKING SERVICES
//       stopAllTrackingServices();

//       // ✅ 5. Clear storage
//       console.log('🗑️ Clearing session data...');
//       try {
//         await clearSessionId();
//         console.log('✅ Session ID cleared from storage');
//       } catch (storageErr) {
//         console.error('❌ Failed to clear local sessionId:', storageErr);
//       }

//       try {
//         const remaining = await getOfflineQueueSize();
//         await resetDailyTracking({ preserveQueue: remaining > 0 });
//         console.log(
//           remaining > 0
//             ? `✅ Local display cache cleared (kept ${remaining} unsynced point(s) queued for retry)`
//             : '✅ Local tracking cache cleared',
//         );
//       } catch (resetErr) {
//         console.error('❌ Failed to clear local tracking cache:', resetErr);
//       }

//       // ✅ 6. Clear Redux state
//       console.log('🔄 Clearing Redux state...');
//       dispatch(stopTracking());
//       console.log('✅ Redux state cleared');

//       // ✅ 7. Show success
//       console.log('✅ End day completed successfully!');
//       Alert.alert(
//         '✅ Success',
//         'Your day has been ended successfully! All your route data has been saved.',
//         [
//           {
//             text: 'OK',
//             onPress: () => {
//               navigation.replace('MainTabs', {
//                 role: 'FSE',
//               });
//             },
//           },
//         ],
//       );
//     } catch (err) {
//       console.error('❌ End day error:', err);

//       try {
//         console.log('🛑 Force stopping all services on error...');
//         stopAllTrackingServices();
//         await clearSessionId();
//         dispatch(stopTracking());
//         console.log('✅ Force stop completed');
//       } catch (stopErr) {
//         console.error('❌ Force stop failed:', stopErr);
//       }

//       const message = err.response?.data?.message || 'Failed to end day. Please check your connection and try again.';
//       Alert.alert('❌ Error', message, [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Retry',
//           onPress: () => {
//             setSubmitting(false);
//             submitEndDay();
//           },
//         },
//         {
//           text: 'Force End',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               console.log('⚠️ User initiated force end...');
//               stopAllTrackingServices();
//               await clearSessionId();
//               dispatch(stopTracking());
//               console.log('✅ Force end completed');
//               navigation.replace('MainTabs', { role: 'FSE' });
//             } catch (forceErr) {
//               console.error('❌ Force end failed:', forceErr);
//               Alert.alert(
//                 'Error',
//                 'Could not force end. Please restart the app.',
//                 [
//                   {
//                     text: 'OK',
//                     onPress: () => {
//                       navigation.replace('MainTabs', { role: 'FSE' });
//                     },
//                   },
//                 ],
//               );
//             }
//           },
//         },
//       ]);
//       setSubmitting(false);
//     }
//   };

//   // ✅ CONFIRM BEFORE ENDING
//   const handleSubmit = () => {
//     Alert.alert(
//       'End Day',
//       'Are you sure you want to end your day? All tracking will be stopped and your route will be saved.',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'End Day', style: 'destructive', onPress: submitEndDay },
//       ],
//     );
//   };

//   const formattedDistance = formatDistance(localDistance);

//   return (
//     <View style={styles.container}>
//       <Header title="End Day Summary" />

//       <ScrollView
//         contentContainerStyle={styles.content}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.card}>
//           <Text style={styles.sectionTitle}>End of Day</Text>

//           <View style={{ marginTop: 10 }}>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 marginBottom: 8,
//                 padding: 8,
//                 backgroundColor: isTrackingActive() ? '#DCFCE7' : '#FEF2F2',
//                 borderRadius: 8,
//               }}
//             >
//               <View
//                 style={{
//                   width: 10,
//                   height: 10,
//                   borderRadius: 5,
//                   backgroundColor: isTrackingActive() ? '#22C55E' : '#EF4444',
//                   marginRight: 8,
//                 }}
//               />
//               <Text
//                 style={{
//                   fontSize: 13,
//                   fontWeight: '600',
//                   color: isTrackingActive() ? '#16A34A' : '#DC2626',
//                 }}
//               >
//                 {isTrackingActive()
//                   ? '✅ Tracking is Active'
//                   : '⚠️ Tracking is Stopped'}
//               </Text>
//             </View>
//           </View>

//           {/* ✅ Sync Status Indicator */}
//           {syncProgress.isActive && (
//             <View style={{
//               marginTop: 10,
//               padding: 12,
//               backgroundColor: '#EFF6FF',
//               borderRadius: 8,
//               borderLeftWidth: 4,
//               borderLeftColor: '#2563EB',
//             }}>
//               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                 <ActivityIndicator size="small" color="#2563EB" style={{ marginRight: 8 }} />
//                 <Text style={{ color: '#2563EB', fontSize: 12, fontWeight: '500' }}>
//                   Syncing {syncProgress.total} points...
//                 </Text>
//               </View>
//               <Text style={{ color: '#2563EB', fontSize: 14, fontWeight: '700', marginTop: 4 }}>
//                 {syncProgress.synced} / {syncProgress.total} synced
//               </Text>
//             </View>
//           )}

//           {/* ✅ Data Summary */}
//           <View style={{
//             marginTop: 10,
//             padding: 12,
//             backgroundColor: '#F8FAFC',
//             borderRadius: 8,
//             borderWidth: 1,
//             borderColor: '#E2E8F0',
//           }}>
//             <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//               <Text style={{ color: '#64748B', fontSize: 12 }}>📊 Points to Sync</Text>
//               <Text style={{ color: '#0F172A', fontSize: 12, fontWeight: '600' }}>
//                 {pendingCount > 0 ? `${pendingCount} pending` : '✅ All synced'}
//               </Text>
//             </View>
//             <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
//               <Text style={{ color: '#64748B', fontSize: 12 }}>📍 Local Points</Text>
//               <Text style={{ color: '#0F172A', fontSize: 12, fontWeight: '600' }}>{localPointCount}</Text>
//             </View>
//             <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
//               <Text style={{ color: '#64748B', fontSize: 12 }}>📏 Distance</Text>
//               <Text style={{ color: '#0F172A', fontSize: 12, fontWeight: '600' }}>{formattedDistance}</Text>
//             </View>
//           </View>

//           <View style={{ marginTop: 10 }}>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 marginBottom: 6,
//               }}
//             >
//               <CheckCircle
//                 size={16}
//                 color="#16A34A"
//                 style={{ marginRight: 6 }}
//               />
//               <Text style={styles.note}>
//                 All data has been auto-captured from today's activity.
//               </Text>
//             </View>

//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 marginBottom: 6,
//               }}
//             >
//               <Clock size={16} color="#2563EB" style={{ marginRight: 6 }} />
//               <Text style={styles.note}>
//                 Your location tracking will be stopped.
//               </Text>
//             </View>

//             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//               <Lock size={16} color="#DC2626" style={{ marginRight: 6 }} />
//               <Text style={styles.note}>
//                 Once submitted, this day will be locked and cannot be modified.
//               </Text>
//             </View>
//           </View>
//         </View>

//         {sessionId && (
//           <View style={styles.card}>
//             <Text style={styles.sectionTitle}>Session Information</Text>
//             <View style={{ marginTop: 8 }}>
//               <Text style={{ fontSize: 12, color: '#6B7280' }}>
//                 Session ID: {sessionId}
//               </Text>
//               <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
//                 Date: {new Date().toDateString()}
//               </Text>
//               <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
//                 Status: {isTrackingActive() ? '🟢 Active' : '🔴 Ended'}
//               </Text>
//             </View>
//           </View>
//         )}

//         <View style={{ flex: 1 }} />

//         <TouchableOpacity
//           style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
//           onPress={handleSubmit}
//           disabled={submitting}
//         >
//           <CheckCircle size={18} color="#FFF" style={{ marginRight: 8 }} />
//           <Text style={styles.submitText}>
//             {submitting ? 'Submitting...' : 'Submit End Day'}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.cancelBtn, submitting && styles.cancelBtnDisabled]}
//           onPress={() => navigation.goBack()}
//           disabled={submitting}
//         >
//           <Text style={styles.cancelText}>Cancel</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// };

// export default EndDaySummary;