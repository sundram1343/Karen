package com.karen

import android.accessibilityservice.AccessibilityService
import android.os.Bundle
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class KarenAccessibilityService : AccessibilityService() {

    companion object {
        var instance: KarenAccessibilityService? = null
    }

    // -----------------------------
    // Pending CLICK action
    // -----------------------------

    private var pendingPackage: String? = null
    private var pendingText: String? = null

    // -----------------------------
    // Pending TYPE action
    // -----------------------------

    private var pendingTypeTarget: String? = null
    private var pendingTypeValue: String? = null


    // =========================================================
    // SERVICE CONNECTED
    // =========================================================

    override fun onServiceConnected() {
        super.onServiceConnected()

        instance = this

        Log.e(
            "KAREN_TEST",
            "ACCESSIBILITY CONNECTED"
        )
    }


    // =========================================================
    // ACCESSIBILITY EVENTS
    // =========================================================

    override fun onAccessibilityEvent(
        event: AccessibilityEvent?
    ) {

        if (event == null) return

        val packageName =
            event.packageName?.toString()

        Log.e(
            "KAREN_TEST",
            "EVENT -> type=${event.eventType}, package=$packageName"
        )


        // =====================================================
        // CLICK ACTION
        // =====================================================

        if (
            packageName == pendingPackage &&
            pendingText != null
        ) {

            Log.e(
                "DEVICE_AUTOMATION",
                "TARGET APP DETECTED: $packageName"
            )

            val root = rootInActiveWindow

            if (root == null) {

                Log.e(
                    "DEVICE_AUTOMATION",
                    "ROOT NULL"
                )

                return
            }

            Log.e(
                "DEVICE_AUTOMATION",
                "ROOT FOUND: ${root.packageName}"
            )

            val target = pendingText!!

            val node = findText(
                root,
                target
            )

            if (node != null) {

                Log.e(
                    "DEVICE_AUTOMATION",
                    "TARGET FOUND: ${node.text}"
                )

                val result = clickNode(node)

                Log.e(
                    "DEVICE_AUTOMATION",
                    "CLICK RESULT: $result"
                )

                // Clear pending click
                pendingPackage = null
                pendingText = null

            } else {

                Log.e(
                    "DEVICE_AUTOMATION",
                    "TARGET NOT FOUND YET: $target"
                )
            }
        }


        // =====================================================
        // TYPE ACTION
        // =====================================================

        if (
            packageName == pendingPackage &&
            pendingTypeTarget != null &&
            pendingTypeValue != null
        ) {

            Log.e(
                "DEVICE_AUTOMATION",
                "TYPE TARGET APP DETECTED: $packageName"
            )

            val root = rootInActiveWindow

            if (root == null) {

                Log.e(
                    "DEVICE_AUTOMATION",
                    "TYPE ROOT NULL"
                )

                return
            }

            Log.e(
                "DEVICE_AUTOMATION",
                "TYPE ROOT FOUND: ${root.packageName}"
            )

            val target = pendingTypeTarget!!

            val value = pendingTypeValue!!

            val node = findText(
                root,
                target
            )

            if (node != null) {

                Log.e(
                    "DEVICE_AUTOMATION",
                    "TYPE TARGET FOUND: ${node.text}"
                )

                // Click the input field first
                clickNode(node)

                // Type the requested text
                val result = typeText(
                    node,
                    value
                )

                Log.e(
                    "DEVICE_AUTOMATION",
                    "TYPE RESULT: $result"
                )

                // Clear pending type action
                pendingPackage = null
                pendingTypeTarget = null
                pendingTypeValue = null

            } else {

                Log.e(
                    "DEVICE_AUTOMATION",
                    "TYPE TARGET NOT FOUND YET: $target"
                )
            }
        }
    }


    // =========================================================
    // FIND TEXT
    // =========================================================
    fun pressEnter():Boolean{
        val root=rootInActiveWindow
        if(!root){
            Log.e("DEVICE_AUTOMATION","ROOT IS NULL")
            return false
        }
        val focusedNode=root.findfoucus(AccessibilityNodeInfo.FOCUS_INPUT)
        if(focusedNode){
            val result=focusedNode.performAction(AccessibilityNodeInfo.ACTION_IME_ENTER)
            Log.e("DEVICE_AUTOMATION","ENTER RESULT: $result")
            return result;
        }
        Log.e("DEVICE_AUTOMATION","NO INPUT FOCUS FOUND")
        return false
    }
    private fun findText(
        node: AccessibilityNodeInfo?,
        target: String
    ): AccessibilityNodeInfo? {

        if (node == null) return null

        val text =
            node.text?.toString()

        val description =
            node.contentDescription?.toString()


        // Check text
        if (
            text?.contains(
                target,
                ignoreCase = true
            ) == true
        ) {
            return node
        }


        // Check content description
        if (
            description?.contains(
                target,
                ignoreCase = true
            ) == true
        ) {
            return node
        }


        // Search children
        for (i in 0 until node.childCount) {

            val child =
                node.getChild(i)

            val result =
                findText(
                    child,
                    target
                )

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

        if (node == null) {
            return false
        }


        // Direct click
        if (node.isClickable) {

            return node.performAction(
                AccessibilityNodeInfo.ACTION_CLICK
            )
        }


        // Try parent
        val parent =
            node.parent

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

        if (node == null) {
            return false
        }

        val arguments =
            Bundle()

        arguments.putCharSequence(
            AccessibilityNodeInfo
                .ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE,
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

        val root =
            rootInActiveWindow

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

        val node =
            findText(
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

        val result =
            clickNode(node)

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

        val root =
            rootInActiveWindow

        if (root == null) {

            Log.e(
                "DEVICE_AUTOMATION",
                "ROOT IS NULL"
            )

            return false
        }

        val node =
            findText(
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

        // Click input
        clickNode(node)

        // Type
        val result =
            typeText(
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
    // CLICK WHEN APP OPENS
    // =========================================================

    fun clickWhenAppOpens(
        packageName: String,
        text: String
    ) {

        pendingPackage = packageName
        pendingText = text

        Log.e(
            "DEVICE_AUTOMATION",
            "WAITING FOR: $packageName"
        )
    }


    // =========================================================
    // TYPE WHEN APP OPENS
    // =========================================================

    fun typeWhenAppOpens(
        packageName: String,
        target: String,
        value: String
    ) {

        pendingPackage = packageName

        pendingTypeTarget = target

        pendingTypeValue = value

        Log.e(
            "DEVICE_AUTOMATION",
            "WAITING TO TYPE: $packageName -> $target"
        )
    }


    // =========================================================
    // WAIT FOR APP
    // =========================================================

    fun waitForApp(
        packageName: String,
        timeout: Long = 5000
    ): Boolean {

        val start =
            System.currentTimeMillis()

        while (
            System.currentTimeMillis() - start < timeout
        ) {

            val root =
                rootInActiveWindow

            if (
                root?.packageName?.toString()
                    == packageName
            ) {

                Log.e(
                    "DEVICE_AUTOMATION",
                    "APP ACTIVE: $packageName"
                )

                return true
            }

            Thread.sleep(100)
        }

        Log.e(
            "DEVICE_AUTOMATION",
            "APP TIMEOUT: $packageName"
        )

        return false
    }


    // =========================================================
    // SERVICE INTERRUPTED
    // =========================================================

    override fun onInterrupt() {

        Log.e(
            "KAREN_TEST",
            "SERVICE INTERRUPTED"
        )
    }


    // =========================================================
    // SERVICE DESTROYED
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