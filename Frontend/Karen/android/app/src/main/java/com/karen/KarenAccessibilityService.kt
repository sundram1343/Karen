package com.karen
import android.view.accessibility.AccessibilityEvent
import android.accessibilityservice.AccessibilityService
import android.util.Log
class KarenAccessibilityService:AccessibilityService(){
    companion object {
        var instance: KarenAccessibilityService? = null
    }
    override fun onServiceConnected(){
        super.onServiceConnected()
        instance=this
        Log.e("TEST","ACCESSIBILITY SERVICE CONNECTED")
    }
    override fun onAccessibilityEvent(event:AccessibilityEvent?){
        
    }
    override fun onInterrupt() {
        
    }
    override fun onDestroy() {
        super.onDestroy()
        instance = null
        Log.e("TEST","ACCESSIBILITY SERVICE DESTROYED")
    }

}