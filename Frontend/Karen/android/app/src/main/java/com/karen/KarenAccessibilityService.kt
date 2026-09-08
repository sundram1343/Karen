package com.karen

import android.accessibilityservice.AccessibilityService
import android.os.Bundle
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class KarenAccessibilityService : AccessibilityService() {
    private var currentPackage: String? = null
    
    companion object {
        var instance: KarenAccessibilityService? = null
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        
        instance = this

        Log.e("KAREN_TEST", "ACCESSIBILITY CONNECTED")
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {

        if (event == null) return
        currentPackage = event.packageName?.toString()
        Log.e(
            "KAREN_TEST",
            "EVENT -> type=${event.eventType}, package=${event.packageName}, package=$currentPackage"
        )
    }
    fun waitForPackage(
    packageName: String,
    timeout: Long = 5000
): Boolean {

    val startTime = System.currentTimeMillis()

    while (System.currentTimeMillis() - startTime < timeout) {

        if (currentPackage == packageName) {
            Log.e(
                "DEVICE_AUTOMATION",
                "TARGET PACKAGE ACTIVE: $packageName"
            )
            return true
        }

        Thread.sleep(100)
    }

    Log.e(
        "DEVICE_AUTOMATION",
        "TIMEOUT WAITING FOR: $packageName"
    )

    return false
}

    // =========================================================
    // FIND TEXT
    // =========================================================

    private fun findText(
        node: AccessibilityNodeInfo?,
        target: String
    ): AccessibilityNodeInfo? {

        if (node == null) return null

        val text = node.text?.toString()
        val description = node.contentDescription?.toString()

        if (
            text?.contains(target, ignoreCase = true) == true ||
            description?.contains(target, ignoreCase = true) == true
        ) {
            return node
        }

        for (i in 0 until node.childCount) {

            val child = node.getChild(i)

            val result = findText(child, target)

            if (result != null) {
                return result
            }
        }

        return null
    }

    // =========================================================
    // CLICK NODE
    // =========================================================

    private fun clickNode(
        node: AccessibilityNodeInfo?
    ): Boolean {

        if (node == null) return false

        // Try clicking the node itself
        if (node.isClickable) {

            return node.performAction(
                AccessibilityNodeInfo.ACTION_CLICK
            )
        }

        // If node itself isn't clickable,
        // try its parent
        val parent = node.parent

        if (parent != null) {

            if (parent.isClickable) {

                return parent.performAction(
                    AccessibilityNodeInfo.ACTION_CLICK
                )
            }
        }

        return false
    }

    // =========================================================
    // TYPE TEXT
    // =========================================================

    private fun typeText(
        node: AccessibilityNodeInfo?,
        text: String
    ): Boolean {

        if (node == null) return false

        val arguments = Bundle()

        arguments.putCharSequence(
            AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE,
            text
        )

        return node.performAction(
            AccessibilityNodeInfo.ACTION_SET_TEXT,
            arguments
        )
    }

    // =========================================================
    // FIND AND CLICK
    // =========================================================

    fun findAndClick(
        text: String
    ): Boolean {

        Log.e(
            "DEVICE_AUTOMATION",
            "findAndClick received: $text"
        )

        Log.e(
            "DEVICE_AUTOMATION",
            "SERVICE INSTANCE: $this"
        )

        val root = rootInActiveWindow

        if (root == null) {

            Log.e(
                "DEVICE_AUTOMATION",
                "ROOT IS NULL"
            )

            return false
        }

        Log.e(
            "DEVICE_AUTOMATION",
            "ROOT FOUND: ${root.packageName}"
        )

        val node = findText(
            root,
            text
        )

        if (node == null) {

            Log.e(
                "DEVICE_AUTOMATION",
                "NODE NOT FOUND: $text"
            )

            return false
        }

        Log.e(
            "DEVICE_AUTOMATION",
            "NODE FOUND: ${node.text}"
        )

        val result = clickNode(node)

        Log.e(
            "DEVICE_AUTOMATION",
            "CLICK RESULT: $result"
        )

        return result
    }

    // =========================================================
    // FIND AND TYPE
    // =========================================================

    fun findAndType(
        target: String,
        value: String
    ): Boolean {

        Log.e(
            "DEVICE_AUTOMATION",
            "findAndType received: $target -> $value"
        )

        val root = rootInActiveWindow

        if (root == null) {

            Log.e(
                "DEVICE_AUTOMATION",
                "ROOT IS NULL"
            )

            return false
        }

        val node = findText(
            root,
            target
        )

        if (node == null) {

            Log.e(
                "DEVICE_AUTOMATION",
                "NODE NOT FOUND: $target"
            )

            return false
        }

        Log.e(
            "DEVICE_AUTOMATION",
            "NODE FOUND: ${node.text}"
        )

        // Click/focus the field first
        clickNode(node)

        val result = typeText(
            node,
            value
        )

        Log.e(
            "DEVICE_AUTOMATION",
            "TYPE RESULT: $result"
        )

        return result
    }

    // =========================================================
    // INTERRUPT
    // =========================================================

    override fun onInterrupt() {

        Log.e(
            "KAREN_TEST",
            "SERVICE INTERRUPTED"
        )
    }

    // =========================================================
    // DESTROY
    // =========================================================

    override fun onDestroy() {

        instance = null

        Log.e(
            "KAREN_TEST",
            "ACCESSIBILITY SERVICE DESTROYED"
        )

        super.onDestroy()
    }
}