package com.karen

import android.accessibilityservice.AccessibilityService
import android.util.Log
import android.view.accessibility.AccessibilityEvent

class KarenAccessibilityService : AccessibilityService() {

    override fun onServiceConnected() {
        super.onServiceConnected()

        Log.e("KAREN_TEST", "================================")
        Log.e("KAREN_TEST", "KAREN ACCESSIBILITY CONNECTED")
        Log.e("KAREN_TEST", "================================")
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {

        Log.e(
            "KAREN_TEST",
            "EVENT -> type=${event?.eventType}, package=${event?.packageName}"
        )
    }

    override fun onInterrupt() {

        Log.e(
            "KAREN_TEST",
            "SERVICE INTERRUPTED"
        )
    }
}