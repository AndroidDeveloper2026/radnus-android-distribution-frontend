package com.radnusdistribution;

import android.content.Intent;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class LocationServiceModule extends ReactContextBaseJavaModule {

    public LocationServiceModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "LocationServiceModule";
    }

    @ReactMethod
    public void startService(String userId, String sessionId) {
        ReactApplicationContext context = getReactApplicationContext();
        Intent intent = new Intent(context, LocationTrackingService.class);
        intent.putExtra("userId", userId);
        intent.putExtra("sessionId", sessionId);
        context.startForegroundService(intent);
    }

    @ReactMethod
    public void stopService() {
        ReactApplicationContext context = getReactApplicationContext();
        Intent intent = new Intent(context, LocationTrackingService.class);
        context.stopService(intent);
    }

    // ✅ FIX: Add force stop (same as stop but explicit for JS compatibility)
    @ReactMethod
    public void forceStopService() {
        stopService();
    }
}