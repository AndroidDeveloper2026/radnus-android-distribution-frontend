package com.radnusdistribution;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.os.Build;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;

import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.Priority;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class LocationTrackingService extends Service {

    private static final String CHANNEL_ID = "location_tracking_channel";
    private static final int NOTIFICATION_ID = 999;
    private static final String TAG = "LocationTrackingService";

    private FusedLocationProviderClient fusedLocationClient;
    private LocationCallback locationCallback;
    private LocationRequest locationRequest;
    private int locationUpdateCount = 0;
    private long lastNotifyTime = 0;

    private String currentUserId = null;
    private String currentSessionId = null;
    
    // ✅ ADDED: WakeLock to prevent CPU sleep
    private PowerManager.WakeLock wakeLock;

    @Override
    public void onCreate() {
        super.onCreate();
        android.util.Log.d(TAG, "📍 LocationTrackingService Created");

        createNotificationChannel();
        startForeground(NOTIFICATION_ID, createNotification());

        // ✅ FIX 1: Acquire WakeLock to prevent Doze from killing tracking
        PowerManager powerManager = (PowerManager) getSystemService(Context.POWER_SERVICE);
        wakeLock = powerManager.newWakeLock(
            PowerManager.PARTIAL_WAKE_LOCK, 
            "Radnus::LocationWakeLock"
        );
        wakeLock.acquire(10 * 60 * 1000L); // 10 minutes, renewed on each location update

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);

        // ✅ FIX 2: More aggressive location request for background
        locationRequest = new LocationRequest.Builder(
                Priority.PRIORITY_HIGH_ACCURACY, 2000)  // 2 seconds interval
                .setIntervalMillis(2000)
                .setMinUpdateIntervalMillis(1000)
                .setMinUpdateDistanceMeters(5f)  // 5 meters minimum
                .setMaxUpdateDelayMillis(3000)   // 3 seconds max delay
                .build();

        locationCallback = new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult locationResult) {
                if (locationResult == null) return;
                for (Location location : locationResult.getLocations()) {
                    locationUpdateCount++;
                    sendLocationToHeadless(location);
                    
                    // ✅ FIX 3: Renew WakeLock on each update
                    if (wakeLock != null && wakeLock.isHeld()) {
                        wakeLock.release();
                        wakeLock.acquire(10 * 60 * 1000L);
                    }
                    
                    long now = System.currentTimeMillis();
                    if (now - lastNotifyTime > 10000) {
                        logLocationUpdate(location);
                        lastNotifyTime = now;
                    }
                }
            }
        };
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            currentUserId = intent.getStringExtra("userId");
            currentSessionId = intent.getStringExtra("sessionId");
        }

        // ✅ FIX: If Android killed and restarted this service (e.g. under
        // memory pressure) and we still don't have valid IDs — either
        // because the intent was null (a fresh restart) or because the
        // extras it carried were empty — do NOT start requesting location
        // updates. Doing so was firing GPS fixes with userId/sessionId
        // both null, which the backend correctly rejects with 400
        // ("Missing required fields") on every single point, repeating
        // every ~2s until the app was force-closed and reopened.
        if (currentUserId == null || currentUserId.isEmpty()
                || currentSessionId == null || currentSessionId.isEmpty()) {
            android.util.Log.w(TAG, "⚠️ Missing userId/sessionId on start/restart — stopping service instead of tracking blind");
            stopSelf();
            return START_NOT_STICKY;
        }

        startLocationUpdates();
        // ✅ FIX: START_REDELIVER_INTENT (was START_STICKY) — if the
        // system kills this service, Android redelivers the LAST intent
        // that was passed to startForegroundService (same userId/sessionId
        // extras), instead of restarting with a null intent and losing them.
        return START_REDELIVER_INTENT;
    }

    private void startLocationUpdates() {
        try {
            if (ActivityCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_FINE_LOCATION)
                    != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                stopSelf();
                return;
            }
            fusedLocationClient.requestLocationUpdates(locationRequest, locationCallback, Looper.getMainLooper());
            android.util.Log.d(TAG, "✅ Location updates started");
        } catch (Exception e) {
            android.util.Log.e(TAG, "❌ Exception: " + e.getMessage());
            stopSelf();
        }
    }

    private void sendLocationToHeadless(Location location) {
        try {
            Intent intent = new Intent(this, LocationHeadlessTask.class);
            intent.putExtra("userId", currentUserId);
            intent.putExtra("sessionId", currentSessionId);
            intent.putExtra("latitude", location.getLatitude());
            intent.putExtra("longitude", location.getLongitude());
            intent.putExtra("accuracy", location.getAccuracy());
            intent.putExtra("timestamp", location.getTime());
            intent.putExtra("speed", location.getSpeed());
            intent.putExtra("bearing", location.getBearing());
            startService(intent);
        } catch (Exception e) {
            android.util.Log.e(TAG, "❌ Headless send error: " + e.getMessage());
        }
    }

    private void logLocationUpdate(Location location) {
        String timestamp = new SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(new Date());
        android.util.Log.d(TAG, String.format(
                "%s [#%d] 📍 Lat: %.6f, Lon: %.6f, Acc: %.1fm",
                timestamp, locationUpdateCount,
                location.getLatitude(), location.getLongitude(), location.getAccuracy()
        ));
        updateNotification(location);
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID, "FSE Location Tracking", NotificationManager.IMPORTANCE_LOW);
            channel.setDescription("Tracking your route for today's work");
            channel.enableLights(false);
            channel.enableVibration(false);
            channel.setShowBadge(false);
            NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (manager != null) manager.createNotificationChannel(channel);
        }
    }

    private Notification createNotification() {
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                this, 0, notificationIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("FSE Tracking Active ✅")
                .setContentText("Tracking your route for today's work")
                .setSmallIcon(android.R.drawable.ic_menu_mylocation)
                .setContentIntent(pendingIntent)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setOngoing(true)
                .build();
    }

    private void updateNotification(Location location) {
        try {
            Intent notificationIntent = new Intent(this, MainActivity.class);
            PendingIntent pendingIntent = PendingIntent.getActivity(
                    this, 0, notificationIntent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            String updateText = String.format("Last: %.6f, %.6f | Acc: %.1fm",
                    location.getLatitude(), location.getLongitude(), location.getAccuracy());
            Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                    .setContentTitle("FSE Tracking Active ✅")
                    .setContentText(updateText)
                    .setSmallIcon(android.R.drawable.ic_menu_mylocation)
                    .setContentIntent(pendingIntent)
                    .setPriority(NotificationCompat.PRIORITY_LOW)
                    .setOngoing(true)
                    .build();
            NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (manager != null) manager.notify(NOTIFICATION_ID, notification);
        } catch (Exception e) {
            android.util.Log.e(TAG, "Notify error: " + e.getMessage());
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        android.util.Log.d(TAG, "🛑 LocationTrackingService Destroyed");
        try {
            if (fusedLocationClient != null && locationCallback != null) {
                fusedLocationClient.removeLocationUpdates(locationCallback);
            }
            // ✅ FIX 5: Release WakeLock on destroy
            if (wakeLock != null && wakeLock.isHeld()) {
                wakeLock.release();
            }
        } catch (Exception e) {
            android.util.Log.e(TAG, "❌ Error removing updates: " + e.getMessage());
        }
    }

    @Override
    public IBinder onBind(Intent intent) { return null; }
}