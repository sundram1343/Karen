package com.karen
import android.view.accessibility.AccessibilityEvent
import android.accessibilityservice.AccessibilityService
import android.util.Log
import android.view.accessibility.AccessibilityNodeInfo
class KarenAccessibilityService:AccessibilityService(){
    companion object {
        var instance: KarenAccessibilityService? = null
    }
    var pendingPackage: String? = null
    var pendingText: String? = null
    override fun onServiceConnected(){
        super.onServiceConnected()
        instance=this
        Log.e("TEST","ACCESSIBILITY SERVICE CONNECTED")
    }
    override fun onAccessibilityEvent(event:AccessibilityEvent?){
        if(event==null) return
        val packageName=event.packageName?.toString() ?: return
        Log.e("TEST",packageName)
        if(packageName == pendingPackage && pendingText != null){
            Log.e("DEVICE_AUTOMATION", "Target app opened: $packageName\nText to type: $pendingText")
            val root=getNode()
            if(root==null){
                Log.e("DEVICE_AUTOMATION","ROOT IS NULL")
                return
            }
            val editableNode = findEditableNode(root)
            if (editableNode != null) {
                Log.e("DEVICE_AUTOMATION", "Found editable node")
                val textToType = pendingText!!
                pendingPackage = null
                pendingText = null
                click(editableNode)
                type(editableNode, textToType)
                android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
                    pressEnter(editableNode)
                }, 500)
            } else {
                Log.e("DEVICE_AUTOMATION", "No editable node found yet")
            }
        }
    }
    fun getNode():AccessibilityNodeInfo?{
        return rootInActiveWindow
    }
    fun findEditableNode(root: AccessibilityNodeInfo?): AccessibilityNodeInfo? {
        if (root == null) return null
        if (root.isEditable) {
            return root
        }
        for (i in 0 until root.childCount) {
            val child = root.getChild(i)
            val result = findEditableNode(child)
            if (result != null) return result
        }
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
        val arguments = android.os.Bundle()
        arguments.putCharSequence(AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE, value)
        node.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT, arguments)
        return true
    }
    fun pressEnter(node: AccessibilityNodeInfo?): Boolean {
        if (node == null) return false
        if (android.os.Build.VERSION.SDK_INT >= 30) {
            return node.performAction(android.R.id.accessibilityActionImeEnter)
        }
        return performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK)
    }
    override fun onInterrupt() {
        Log.e("TEST","ACCESSIBILITY SERVICE INTERRUPTED")
    }
    override fun onDestroy() {
        super.onDestroy()
        instance = null
        Log.e("TEST","ACCESSIBILITY SERVICE DESTROYED")
    }

}