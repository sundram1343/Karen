package com.karen
import android.view.accessibility.AccessibilityEvent
import android.accessibilityservice.AccessibilityService
import android.util.Log
import android.view.accessibility.AccessibilityNodeInfo

class KarenAccessibilityService:AccessibilityService(){
    companion object {
        var instance: KarenAccessibilityService? = null
    }
    private var pendingPackage: String? = null
    private var pendingText: String? = null
    private var hasAutomatedChrome = false

    override fun onServiceConnected(){
        super.onServiceConnected()
        instance=this
        Log.e("TEST","ACCESSIBILITY SERVICE CONNECTED")
    }
    override fun onAccessibilityEvent(event:AccessibilityEvent?){
        if(event==null) return;
        val packageName=event.packageName?.toString()
        Log.e("TEST",packageName?:"")
        if(packageName=="com.android.chrome" && !hasAutomatedChrome){
            Log.e("DEVICE_AUTOMATION","TARGET APP CHROME")
            val root=getNode()
            if(root==null){
                Log.e("DEVICE_AUTOMATION","ROOT IS NULL")
                return
            }
            // Try finding the search box by its ID instead of exact text
            var searchBox = findElementById("com.android.chrome:id/search_box_text")
            if (searchBox == null) {
                 // Fallback to text if ID fails
                 searchBox = findElement("Search or type web address")
            }
            if (searchBox != null) {
                hasAutomatedChrome = true // Prevent infinite loops!
                click(searchBox)
                // When we click the search box, the actual url_bar appears to type in
                val urlBar = findElementById("com.android.chrome:id/url_bar")
                if (urlBar != null) {
                    type(urlBar, "react native tools")
                    pressEnter()
                } else {
                    type(searchBox, "react native tools")
                    pressEnter()
                }
                
                // Reset it after 5 seconds so you can test it again later
                android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
                    hasAutomatedChrome = false
                }, 5000)
            }
        }
    }
    fun getNode():AccessibilityNodeInfo?{
        return rootInActiveWindow;
    }
    fun findElementById(target:String):AccessibilityNodeInfo?{
        val root=getNode()
        if(root==null){
            return null
        }
        val node=root.findAccessibilityNodeInfosByViewId(target)
        if(node!=null&&node.isNotEmpty()){
            return node[0]
        }
        return null
    }
    fun findElement(target:String):AccessibilityNodeInfo?{
        val root=getNode()
        if(root==null){
            Log.e("DEVICE_AUTOMATION","ROOT IS NULL")
            return null;
        }
        Log.e("DEVICE_AUTOMATION","OBTAINED ROOT")
        val node=root.findAccessibilityNodeInfosByText(target)
        if(node!=null&&node.isNotEmpty()){
            Log.e("DEVICE_AUTOMATION","FOUND")
            return node[0]
        }
        Log.e("DEVICE_AUTOMATION","NOT FOUND")
        return null
    }
    fun click(node:AccessibilityNodeInfo?):Boolean{
        if(node==null){
            Log.e("DEVICE_AUTOMATION","NODE IS NULL")
            return false
        }
        Log.e("DEVICE_AUTOMATION","CLICKING")
        node.performAction(AccessibilityNodeInfo.ACTION_CLICK)
        return true
    }
    fun type(node:AccessibilityNodeInfo?,value:String):Boolean{
        if(node==null){
            Log.e("DEVICE_AUTOMATION","NODE IS NULL")
            return false
        }
        Log.e("DEVICE_AUTOMATION","TYPING")
        node.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT);
        return true;
    }
    fun pressEnter():Boolean{
        return performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK)
    }
    override fun onInterrupt() {
        
    }
    override fun onDestroy() {
        super.onDestroy()
        instance = null
        Log.e("TEST","ACCESSIBILITY SERVICE DESTROYED")
    }

}