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
        android.util.Log.d(
            "AppLauncher",
            "AppLauncherModule CREATED"
        )
    }

    override fun getName(): String {
        return "AppLauncher"
    }
    @ReactMethod
    fun openApp(appName: String, promise: Promise) {
        try {
            val packageManager = reactApplicationContext.packageManager
            val packages = packageManager.getInstalledApplications(
                PackageManager.GET_META_DATA
            )
            for (app in packages) {
                val label = packageManager
                    .getApplicationLabel(app)
                    .toString()
                if (label.equals(appName.trim(), ignoreCase = true)) {
                    val intent = packageManager
                        .getLaunchIntentForPackage(app.packageName)
                    if (intent != null) {
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        reactApplicationContext.startActivity(intent)
                        promise.resolve(true)
                        return
                    }
                }
            }
            promise.resolve(false)
        } catch (e: Exception) {
            promise.reject(
                "APP_LAUNCH_ERROR",
                e.message,
                e
            )
        }
    }
}