package com.karen
import android.util.Log
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
    @ReactMethod
fun waitForApp(packageName: String) {

    Thread {

        val result =
            KarenAccessibilityService.instance
                ?.waitForApp(packageName)
                ?: false

        Log.e(
            "DEVICE_AUTOMATION",
            "WAIT RESULT: $result"
        )

    }.start()
}
@ReactMethod
fun clickWhenAppOpens(
    packageName: String,
    text: String
) {

    Log.e(
        "DEVICE_AUTOMATION",
        "REQUEST: $packageName -> $text"
    )

    KarenAccessibilityService.instance?.clickWhenAppOpens(
        packageName,
        text
    )
}
@ReactMethod
fun typeWhenAppOpens(
    packageName: String,
    target: String,
    value: String
) {
    Log.e(
        "DEVICE_AUTOMATION",
        "REQUEST TYPE: $packageName -> $target -> $value"
    )

    KarenAccessibilityService.instance?.typeWhenAppOpens(
        packageName,
        target,
        value
    )
}
    @ReactMethod
    fun pressEnter():Boolean{
        Log.e("DEVICE_AUTOMATION","PRESS ENTER REQUEST")
        KarenAccessibilityService.instance?.pressEnter()
    }
}