package com.karen

import android.content.Intent
import android.content.pm.PackageManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class AppLauncherModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    init {
        android.util.Log.d("AppLauncher", "AppLauncherModule CREATED")
    }

    override fun getName(): String = "AppLauncher"
    private fun launchAppByName(appName: String): String? {
        val packageManager = reactApplicationContext.packageManager
        val packages = packageManager.getInstalledApplications(PackageManager.GET_META_DATA)
        for (app in packages) {
            val label = packageManager.getApplicationLabel(app).toString()
            if (label.equals(appName.trim(), ignoreCase = true)) {
                val intent = packageManager.getLaunchIntentForPackage(app.packageName)
                if (intent != null) {
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    reactApplicationContext.startActivity(intent)
                    return app.packageName
                }
            }
        }
        return null
    }

    @ReactMethod
    fun openApp(appName: String, promise: Promise) {
        try {
            val pkg = launchAppByName(appName)
            if (pkg != null) {
                KarenAccessibilityService.instance?.pendingPackage = pkg
                promise.resolve(true)
            } else {
                promise.resolve(false)
            }
        } catch (e: Exception) {
            promise.reject("APP_LAUNCH_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun clickNode(target: String, promise: Promise) {
        try {
            val service = KarenAccessibilityService.instance
            if (service == null) {
                promise.reject("SERVICE_NOT_RUNNING", "Accessibility service not connected")
                return
            }
            service.enqueueCommand(
                KarenAccessibilityService.Command.ClickNode(target)
            ) { success ->
                if (success) promise.resolve(true)
                else promise.reject("CLICK_FAILED", "Could not find node: $target")
            }
        } catch (e: Exception) {
            promise.reject("CLICK_NODE_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun typeText(text: String, promise: Promise) {
        try {
            val service = KarenAccessibilityService.instance
            if (service == null) {
                promise.reject("SERVICE_NOT_RUNNING", "Accessibility service not connected")
                return
            }
            service.enqueueCommand(
                KarenAccessibilityService.Command.TypeText(text)
            ) { success ->
                if (success) promise.resolve(true)
                else promise.reject("TYPE_FAILED", "Could not find editable node to type into")
            }
        } catch (e: Exception) {
            promise.reject("TYPE_TEXT_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun pressEnter(promise: Promise) {
        try {
            val service = KarenAccessibilityService.instance
            if (service == null) {
                promise.reject("SERVICE_NOT_RUNNING", "Accessibility service not connected")
                return
            }
            service.enqueueCommand(
                KarenAccessibilityService.Command.PressEnter
            ) { success ->
                if (success) promise.resolve(true)
                else promise.reject("ENTER_FAILED", "Could not press Enter")
            }
        } catch (e: Exception) {
            promise.reject("PRESS_ENTER_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun clickFirstResult(promise: Promise) {
        try {
            val service = KarenAccessibilityService.instance
            if (service == null) {
                promise.reject("SERVICE_NOT_RUNNING", "Accessibility service not connected")
                return
            }
            service.enqueueCommand(
                KarenAccessibilityService.Command.ClickFirstResult
            ) { success ->
                if (success) promise.resolve(true)
                else promise.reject("RESULT_NOT_FOUND", "No playable result found yet")
            }
        } catch (e: Exception) {
            promise.reject("CLICK_RESULT_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun openAppAndType(appName: String, textToType: String, promise: Promise) {
        try {
            val packageManager = reactApplicationContext.packageManager
            val packages = packageManager.getInstalledApplications(PackageManager.GET_META_DATA)
            for (app in packages) {
                val label = packageManager.getApplicationLabel(app).toString()
                if (label.equals(appName.trim(), ignoreCase = true)) {
                    val intent = packageManager.getLaunchIntentForPackage(app.packageName)
                    if (intent != null) {
                        KarenAccessibilityService.instance?.pendingPackage = app.packageName
                        KarenAccessibilityService.instance?.pendingText = textToType
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        reactApplicationContext.startActivity(intent)
                        promise.resolve(true)
                        return
                    }
                }
            }
            promise.resolve(false)
        } catch (e: Exception) {
            promise.reject("APP_LAUNCH_ERROR", e.message, e)
        }
    }
}