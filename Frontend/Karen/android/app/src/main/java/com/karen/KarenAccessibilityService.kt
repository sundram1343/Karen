package com.karen
import android.accessibilityservice.AccessibilityService
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
class KarenAccessibilityService : AccessibilityService() {
    override fun onServiceConnected() {
        super.onServiceConnected()
        Log.e(
            "KAREN_TEST",
            "ACCESSIBILITY CONNECTED"
        )
    }
    override fun onAccessibilityEvent(
        event: AccessibilityEvent?
    ) {
         if (event == null) return

    val root = rootInActiveWindow ?: return

    val node = findText(
        root,
        "Search Google or type URL"
    )

    if (node != null) {

        Log.e(
            "KAREN_FIND",
            "FOUND: ${node.text}"
        )

        val clicked = clickNode(node)

        Log.e(
            "KAREN_CLICK",
            "CLICK RESULT: $clicked"
        )

        node.recycle()
    }
    }
    private fun printNode(
        node: AccessibilityNodeInfo,
        depth: Int
    ) {
        val text = node.text?.toString()
        val description = node.contentDescription?.toString()
        val viewId = node.viewIdResourceName

        if (!text.isNullOrEmpty() ||
            !description.isNullOrEmpty()
        ) {
            Log.e(
                "KAREN_UI",
                "${"  ".repeat(depth)}" +
                "text=$text | " +
                "description=$description | " +
                "id=$viewId"
            )
        }
        for (i in 0 until node.childCount) {
            val child = node.getChild(i)
            if (child != null) {
                printNode(
                    child,
                    depth + 1
                )
                child.recycle()
            }
        }
    }
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

        child?.recycle()
    }

    return null
}
private fun clickNode(node: AccessibilityNodeInfo?): Boolean {

    if (node == null) return false

    // Try clicking the node itself
    if (node.isClickable) {
        return node.performAction(
            AccessibilityNodeInfo.ACTION_CLICK
        )
    }

    // If this node isn't clickable, try its parent
    val parent = node.parent

    if (parent != null) {
        val clicked = clickNode(parent)
        parent.recycle()
        return clicked
    }

    return false
}
    override fun onInterrupt() {
        Log.e(
            "KAREN_TEST",
            "SERVICE INTERRUPTED"
        )
    }
}