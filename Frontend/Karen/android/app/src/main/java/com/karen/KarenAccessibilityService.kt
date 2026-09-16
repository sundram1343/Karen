package com.karen
import android.view.accessibility.AccessibilityEvent
import android.accessibilityservice.AccessibilityService
import android.util.Log
import android.view.accessibility.AccessibilityNodeInfo
import android.os.Handler
import android.os.Looper

class KarenAccessibilityService:AccessibilityService(){
    companion object {
        var instance: KarenAccessibilityService? = null
    }
    var pendingPackage: String? = null
    var pendingText: String? = null
    private var searchIconClicked: Boolean = false

    override fun onServiceConnected(){
        super.onServiceConnected()
        instance=this
        Log.e("TEST","ACCESSIBILITY SERVICE CONNECTED")
    }

    override fun onAccessibilityEvent(event:AccessibilityEvent?){
        if(event==null) return
        val packageName=event.packageName?.toString() ?: return
        if(packageName != pendingPackage || pendingText == null) return

        Log.e("DEVICE_AUTOMATION", "Target app event: $packageName | searchIconClicked=$searchIconClicked")

        val root = getNode()
        if(root == null){
            Log.e("DEVICE_AUTOMATION","ROOT IS NULL")
            return
        }
        if (searchIconClicked) {
            val editableNode = findEditableNode(root)
            if (editableNode != null) {
                Log.e("DEVICE_AUTOMATION", "Found editable search field after icon click - typing")
                val textToType = pendingText!!
                pendingPackage = null
                pendingText = null
                searchIconClicked = false
                editableNode.performAction(AccessibilityNodeInfo.ACTION_ACCESSIBILITY_FOCUS)
                click(editableNode)
                Handler(Looper.getMainLooper()).postDelayed({
                    type(editableNode, textToType)
                    Handler(Looper.getMainLooper()).postDelayed({
                        pressEnter(editableNode)
                    }, 600)
                }, 300)
            } else {
                Log.e("DEVICE_AUTOMATION", "Still waiting for search field to appear...")
            }
            return
        }
        val editableNode = findEditableNode(root)
        if (editableNode != null) {
            Log.e("DEVICE_AUTOMATION", "Found editable node directly - typing")
            val textToType = pendingText!!
            pendingPackage = null
            pendingText = null
            searchIconClicked = false
            editableNode.performAction(AccessibilityNodeInfo.ACTION_ACCESSIBILITY_FOCUS)
            click(editableNode)
            Handler(Looper.getMainLooper()).postDelayed({
                type(editableNode, textToType)
                Handler(Looper.getMainLooper()).postDelayed({
                    pressEnter(editableNode)
                }, 600)
            }, 300)
            return
        }
        val searchNode = findSearchIconNode(root)
        if (searchNode != null) {
            Log.e("DEVICE_AUTOMATION", "Found search icon - clicking to open search screen")
            searchIconClicked = true
            click(searchNode)
        } else {
            Log.e("DEVICE_AUTOMATION", "No editable node and no search icon found yet")
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
    fun findSearchIconNode(root: AccessibilityNodeInfo?): AccessibilityNodeInfo? {
        if (root == null) return null
        val contentDesc = root.contentDescription?.toString()?.lowercase() ?: ""
        val text = root.text?.toString()?.lowercase() ?: ""
        val viewId = root.viewIdResourceName?.lowercase() ?: ""

        if (root.isClickable && !root.isEditable &&
            (contentDesc.contains("search") || text.contains("search") || viewId.contains("search"))
        ) {
            Log.e("DEVICE_AUTOMATION", "Search icon candidate: desc='$contentDesc' text='$text' id='$viewId'")
            return root
        }
        for (i in 0 until root.childCount) {
            val child = root.getChild(i)
            val result = findSearchIconNode(child)
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
        Log.e("DEVICE_AUTOMATION","TYPING: $value")
        val arguments = android.os.Bundle()
        arguments.putCharSequence(AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE, value)
        node.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT, arguments)
        return true
    }

    fun pressEnter(node: AccessibilityNodeInfo?): Boolean {
        if (node == null) return false
        Log.e("DEVICE_AUTOMATION","PRESSING ENTER")
        if (android.os.Build.VERSION.SDK_INT >= 30) {
            val result = node.performAction(android.R.id.accessibilityActionImeEnter)
            if (result) return true
        }
        node.performAction(AccessibilityNodeInfo.ACTION_CLICK)
        return true
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
