package com.karen
import android.accessibilityservice.AccessibilityService
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
class KarenAccessibilityService : AccessibilityService() {
    sealed class Command {
        data class ClickNode(val target: String) : Command()
        data class TypeText(val text: String) : Command()
        object PressEnter : Command()
        object ClickFirstResult : Command()
        object FindInput : Command()
        object GoBack : Command()
        data class Scroll(val direction: String) : Command()
    }
    companion object {
        var instance: KarenAccessibilityService? = null
    }
    var pendingPackage: String? = null
    var pendingText: String? = null
    private var legacySearchIconClicked: Boolean = false
    private var legacyPendingPlay: Boolean = false
    private var currentCommand: Command? = null
    private var commandCallback: ((Boolean) -> Unit)? = null
    private val mainHandler = Handler(Looper.getMainLooper())
    private var retryCount = 0
    private val maxRetries = 30
    private val retryRunnable = object : Runnable {
        override fun run() {
            if (currentCommand != null) {
                val executed = tryExecuteCurrentCommand()
                if (!executed) {
                    if (retryCount < maxRetries) {
                        retryCount++
                        mainHandler.postDelayed(
                            this,
                            150
                        )
                    } else {
                        Log.e(
                            "Karen",
                            "Command timed out: $currentCommand"
                        )
                        clearCommand()
                        fireCallback(false)
                    }
                }
            }
        }
    }
    override fun onServiceConnected() {
        super.onServiceConnected()
        instance = this
        Log.e(
            "Karen",
            "Accessibility service CONNECTED"
        )
    }
    override fun onInterrupt() {
        Log.e(
            "Karen",
            "Accessibility service INTERRUPTED"
        )
    }
    override fun onDestroy() {
        super.onDestroy()
        instance = null
        mainHandler.removeCallbacksAndMessages(null)
        Log.e(
            "Karen",
            "Accessibility service DESTROYED"
        )
    }
    fun enqueueCommand(
        command: Command,
        callback: (Boolean) -> Unit
    ) {
        mainHandler.removeCallbacks(retryRunnable)
        currentCommand = command
        commandCallback = callback
        retryCount = 0
        Log.e(
            "Karen",
            "Command enqueued: $command"
        )
        mainHandler.post(retryRunnable)
    }
    override fun onAccessibilityEvent(
        event: AccessibilityEvent?
    ) {
        if (event == null) return
        if (currentCommand != null) {
            tryExecuteCurrentCommand()
            return
        }
        val packageName =event.packageName?.toString() ?: return
        if (packageName != pendingPackage) return
        val root =rootInActiveWindow ?: return
        if (legacyPendingPlay) {
            val resultNode =findFirstPlayableResult(root)
            if (resultNode != null) {
                Log.e(
                    "Karen",
                    "Legacy: found first playable result — clicking"
                )
                pendingPackage = null
                legacyPendingPlay = false
                mainHandler.postDelayed(
                    {
                        click(resultNode)
                    },
                    500
                )
            }
            return
        }
        if (pendingText == null) return
        if (legacySearchIconClicked) {
            val editableNode =findEditableNode(root)
            if (editableNode != null) {
                val textToType =pendingText!!
                pendingText = null
                legacySearchIconClicked = false
                editableNode.performAction(AccessibilityNodeInfo.ACTION_ACCESSIBILITY_FOCUS)
                click(editableNode)
                mainHandler.postDelayed(
                    {
                        type(editableNode,textToType)
                        mainHandler.postDelayed(
                            {
                                pressEnterOnNode(editableNode)
                                legacyPendingPlay = true
                            },
                            400
                        )
                    },
                    200
                )
            }
            return
        }
        val editableNode =findEditableNode(root)
        if (editableNode != null) {
            val textToType =pendingText!!
            pendingText = null
            legacySearchIconClicked = false
            editableNode.performAction(AccessibilityNodeInfo.ACTION_ACCESSIBILITY_FOCUS)
            click(editableNode)
            mainHandler.postDelayed(
                {
                    type(editableNode,textToType)
                    mainHandler.postDelayed(
                        {
                            pressEnterOnNode(editableNode)
                            legacyPendingPlay = true
                        },
                        400
                    )
                },
                200
            )
            return
        }
        val searchNode =findSearchIconNode(root)
        if (searchNode != null) {
            legacySearchIconClicked = true
            click(searchNode)
        }
    }
    private fun tryExecuteCurrentCommand(): Boolean {
        val cmd =currentCommand ?: return true
        val root =rootInActiveWindow ?: return false
        when (cmd) {
            is Command.ClickNode -> {
                val node =findNodeByTarget(root,cmd.target)
                if (node != null) {
                    Log.e(
                        "Karen",
                        "ClickNode: found '${cmd.target}' — clicking"
                    )
                    val success =click(node)
                    if (!success) {
                        return false
                    }
                    clearCommand()
                    fireCallback(true)
                    return true
                }
                return false
            }
            is Command.FindInput -> {
                val editableNode =findEditableNode(root)
                if (editableNode != null) {
                    Log.e(
                        "Karen",
                        "FindInput: editable input found"
                    )
                    editableNode.performAction(
                        AccessibilityNodeInfo.ACTION_ACCESSIBILITY_FOCUS
                    )
                    click(editableNode)
                    clearCommand()
                    fireCallback(true)
                    return true
                }
                return false
            }
            is Command.TypeText -> {
                val editableNode =findEditableNode(root)
                if (editableNode != null) {
                    Log.e(
                        "Karen",
                        "TypeText: found editable — typing '${cmd.text}'"
                    )
                    editableNode.performAction(
                        AccessibilityNodeInfo.ACTION_ACCESSIBILITY_FOCUS
                    )
                    click(editableNode)
                    val success =type(editableNode,cmd.text)
                    if (!success) {
                        return false
                    }
                    clearCommand()
                    fireCallback(true)
                    return true
                }
                return false
            }
            is Command.PressEnter -> {
                val editableNode =findEditableNode(root)
                if (editableNode != null) {
                    Log.e(
                        "Karen",
                        "PressEnter: pressing enter"
                    )
                    val success =pressEnterOnNode(editableNode)
                    if (!success) {
                        return false
                    }
                    clearCommand()
                    fireCallback(true)
                    return true
                }
                return false
            }
            is Command.ClickFirstResult -> {
                val resultNode =findFirstPlayableResult(root)
                if (resultNode != null) {
                    Log.e(
                        "Karen",
                        "ClickFirstResult: found result — clicking"
                    )
                    val success =click(resultNode)
                    if (!success) {
                        return false
                    }
                    clearCommand()
                    fireCallback(true)
                    return true
                }
                return false
            }
            is Command.GoBack -> {
                Log.e(
                    "Karen",
                    "GoBack: performing global back"
                )
                val success =performGlobalAction( GLOBAL_ACTION_BACK)
                if (!success) {
                    return false
                }
                clearCommand()
                fireCallback(true)
                return true
            }
            is Command.Scroll -> {
                val direction =cmd.direction.lowercase()
                val action =
                    when (direction) {
                        "up" ->AccessibilityNodeInfo.ACTION_SCROLL_BACKWARD
                        "down" ->AccessibilityNodeInfo.ACTION_SCROLL_FORWARD
                        else -> {
                            Log.e(
                                "Karen",
                                "Unknown scroll direction: $direction"
                            )
                            return false
                        }
                    }
                val scrollNode =
                    findScrollableNode(root)
                if (scrollNode != null) {
                    Log.e(
                        "Karen",
                        "Scroll: $direction"
                    )
                    val success =scrollNode.performAction(action)
                    if (!success) {
                        return false
                    }
                    clearCommand()
                    fireCallback(true)
                    return true
                }
                return false
            }
        }
    }
    private fun clearCommand() {
        mainHandler.removeCallbacks(
            retryRunnable
        )
        currentCommand = null
    }
    private fun fireCallback(
        success: Boolean
    ) {
        val cb =commandCallback
        commandCallback = null
        mainHandler.post {
            cb?.invoke(success)
        }
    }
    private fun findNodeByTarget(
        root: AccessibilityNodeInfo?,
        target: String
    ): AccessibilityNodeInfo? {
        if (root == null) return null
        val lTarget =target.lowercase()
        val desc =root.contentDescription?.toString()?.lowercase()?: ""
        val text =root.text?.toString()?.lowercase()?: ""
        val viewId =root.viewIdResourceName?.lowercase()?: ""
        val matches =desc.contains(lTarget) ||text.contains(lTarget) ||viewId.contains(lTarget)
        if (matches) {
            if (root.isClickable) {
                return root
            }
            var parent =root.parent
            while (parent != null) {
                if (parent.isClickable) {
                    return parent
                }
                parent =parent.parent
            }
            return root
        }
        for (i in 0 until root.childCount) {
            val child =
                root.getChild(i)
            val result =
                findNodeByTarget(
                    child,
                    target
                )
            if (result != null) {
                return result
            }
        }
        return null
    }
    fun findEditableNode(
        root: AccessibilityNodeInfo?
    ): AccessibilityNodeInfo? {
        if (root == null) return null
        if (
            root.isEditable ||
            root.className
                ?.toString()
                ?.contains(
                    "EditText",
                    ignoreCase = true
                ) == true
        ) {
            return root
        }
        for (i in 0 until root.childCount) {
            val result =
                findEditableNode(
                    root.getChild(i)
                )
            if (result != null) {
                return result
            }
        }
        return null
    }
    fun findSearchIconNode(
        root: AccessibilityNodeInfo?
    ): AccessibilityNodeInfo? {
        if (root == null) return null
        val desc =root.contentDescription?.toString()?.lowercase()?: ""
        val text =root.text?.toString()?.lowercase()?: ""
        val viewId =root.viewIdResourceName?.lowercase()?: ""
        if (
            root.isClickable &&
            !root.isEditable &&
            (
                desc.contains("search") ||
                text.contains("search") ||
                viewId.contains("search")
            )
        ) {
            return root
        }
        for (i in 0 until root.childCount) {
            val result =
                findSearchIconNode(
                    root.getChild(i)
                )
            if (result != null) {
                return result
            }
        }
        return null
    }
    fun findFirstPlayableResult(
        root: AccessibilityNodeInfo?
    ): AccessibilityNodeInfo? {
        if (root == null) return null
        return findFirstPlayableResultInternal(
            root,
            depth = 0
        )
    }
    private fun findFirstPlayableResultInternal(
        node: AccessibilityNodeInfo?,
        depth: Int
    ): AccessibilityNodeInfo? {
        if (node == null) return null
        if (node.isEditable) return null
        val desc =node.contentDescription?.toString()?.lowercase()?: ""
        val viewId =node.viewIdResourceName?.lowercase()?: ""
        val text =node.text?.toString()?.lowercase()?: ""
        val isSearchRelated =desc.contains("search") ||viewId.contains("search") ||text.contains("search") ||viewId.contains("toolbar") ||viewId.contains("appbar")
        if (
            node.isClickable &&
            !isSearchRelated &&
            depth > 1
        ) {
            if (
                desc.isNotEmpty() ||
                text.isNotEmpty()
            ) {
                Log.e(
                    "Karen",
                    "Playable result: desc='$desc' text='$text' id='$viewId'"
                )
                return node
            }
        }
        for (
            i in 0 until rootChildCountSafe(node)
        ) {
            val result =
                findFirstPlayableResultInternal(
                    node.getChild(i),
                    depth + 1
                )
            if (result != null) {
                return result
            }
        }
        return null
    }
    private fun findScrollableNode(
        root: AccessibilityNodeInfo?
    ): AccessibilityNodeInfo? {
        if (root == null) return null
        if (root.isScrollable) {
            return root
        }
        for (i in 0 until root.childCount) {
            val result =
                findScrollableNode(
                    root.getChild(i)
                )
            if (result != null) {
                return result
            }
        }
        return null
    }
    private fun rootChildCountSafe(
        node: AccessibilityNodeInfo
    ): Int {
        return try {
            node.childCount
        } catch (e: Exception) {
            0
        }
    }
    fun click(
        node: AccessibilityNodeInfo?
    ): Boolean {
        if (node == null) {

            Log.e(
                "Karen",
                "click: node is null"
            )

            return false
        }
        Log.e(
            "Karen",
            "CLICKING node"
        )
        return node.performAction(
            AccessibilityNodeInfo.ACTION_CLICK
        )
    }
    fun type(
        node: AccessibilityNodeInfo?,
        value: String
    ): Boolean {
        if (node == null) {

            Log.e(
                "Karen",
                "type: node is null"
            )

            return false
        }
        Log.e(
            "Karen",
            "TYPING: $value"
        )
        val arguments =
            android.os.Bundle()

        arguments.putCharSequence(
            AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE,
            value
        )
        return node.performAction(
            AccessibilityNodeInfo.ACTION_SET_TEXT,
            arguments
        )
    }
    fun pressEnterOnNode(
        node: AccessibilityNodeInfo?
    ): Boolean {
        if (node == null) return false
        Log.e(
            "Karen",
            "PRESSING ENTER"
        )
        if (
            android.os.Build.VERSION.SDK_INT >= 30
        ) {

            val result =
                node.performAction(
                    android.R.id.accessibilityActionImeEnter
                )

            if (result) {
                return true
            }
        }
        return node.performAction(
            AccessibilityNodeInfo.ACTION_CLICK
        )
    }
}