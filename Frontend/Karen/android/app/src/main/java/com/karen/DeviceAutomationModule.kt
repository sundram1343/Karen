package com.karen

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class DeviceAutomationModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "DeviceAutomation"
    }

    @ReactMethod
    fun findAndClick(text: String) {
        android.util.Log.e(
            "DEVICE_AUTOMATION",
            "findAndClick called: $text"
        )

        KarenAccessibilityService.instance?.findAndClick(text)
    }

    @ReactMethod
    fun findAndType(text: String, value: String) {
        android.util.Log.e(
            "DEVICE_AUTOMATION",
            "findAndType called: $text -> $value"
        )

        KarenAccessibilityService.instance?.findAndType(text, value)
    }
}