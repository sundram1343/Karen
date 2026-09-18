package com.karen

import android.util.Log

class ActionExecutor(
    private val service: KarenAccessibilityService
) {
    data class AIAction(
        val function: String,
        val target: String? = null,
        val text: String? = null,
        val appName: String? = null,
        val direction: String? = null
    )
    private var actions: List<AIAction> = emptyList()
    private var currentIndex = 0
    private var isExecuting = false
    fun execute(
        actionList: List<AIAction>
    ) {
        if (actionList.isEmpty()) {
            Log.e(
                "Karen",
                "No actions to execute"
            )
            return
        }
        actions = actionList
        currentIndex = 0
        isExecuting = true
        Log.e(
            "Karen",
            "Starting ${actions.size} actions"
        )
        executeNext()
    }
    private fun executeNext() {
        if (!isExecuting) {
            return
        }
        if (currentIndex >= actions.size) {
            Log.e(
                "Karen",
                "================================"
            )
            Log.e(
                "Karen",
                "ALL ACTIONS COMPLETED"
            )
            Log.e(
                "Karen",
                "================================"
            )
            isExecuting = false
            return
        }
        val action =actions[currentIndex]
        Log.e(
            "Karen",
            "--------------------------------"
        )
        Log.e(
            "Karen",
            "Executing action ${currentIndex + 1}/${actions.size}"
        )
        Log.e(
            "Karen",
            "Function: ${action.function}"
        )
        Log.e(
            "Karen",
            "Target: ${action.target}"
        )
        Log.e(
            "Karen",
            "Text: ${action.text}"
        )
        val command =convertToCommand(action)
        if (command == null) {
            Log.e(
                "Karen",
                "UNKNOWN AI FUNCTION: ${action.function}"
            )
            stopExecution()
            return
        }
        service.enqueueCommand(
            command
        ) { success ->
            if (success) {
                Log.e(
                    "Karen",
                    "Action ${currentIndex + 1} SUCCESS"
                )
                currentIndex++
                android.os.Handler(
                    android.os.Looper.getMainLooper()
                ).postDelayed(
                    {
                        executeNext()
                    },
                    300
                )
            }
            else {
                Log.e(
                    "Karen",
                    "Action ${currentIndex + 1} FAILED"
                )
                Log.e(
                    "Karen",
                    "Stopping execution"
                )
                stopExecution()
            }
        }
    }
    private fun convertToCommand(
        action: AIAction
    ): KarenAccessibilityService.Command? {
        return when (
            action.function.lowercase()
        ) {
            "click_node" -> {
                if (
                    action.target.isNullOrBlank()
                ) {
                    Log.e(
                        "Karen",
                        "click_node requires target"
                    )
                    return null
                }
                KarenAccessibilityService.Command.ClickNode(
                    action.target
                )
            }
            "find_input" -> {
                KarenAccessibilityService.Command.FindInput
            }
            "type_text" -> {

                if (
                    action.text.isNullOrBlank()
                ) {
                    Log.e(
                        "Karen",
                        "type_text requires text"
                    )
                    return null
                }
                KarenAccessibilityService.Command.TypeText(
                    action.text
                )
            }
            "press_enter" -> {

                KarenAccessibilityService.Command.PressEnter
            }
            "click_first_result" -> {

                KarenAccessibilityService.Command.ClickFirstResult
            }
            "go_back" -> {

                KarenAccessibilityService.Command.GoBack
            }
            "scroll" -> {
                if (
                    action.direction.isNullOrBlank()
                ) {
                    Log.e(
                        "Karen",
                        "scroll requires direction"
                    )
                    return null
                }
                KarenAccessibilityService.Command.Scroll(
                    action.direction
                )
            }
            else -> {

                Log.e(
                    "Karen",
                    "Function not registered: ${action.function}"
                )

                null
            }
        }
    }
    fun stopExecution() {
        isExecuting = false
        actions = emptyList()
        currentIndex = 0
        Log.e(
            "Karen",
            "Action execution stopped"
        )
    }
    fun isRunning(): Boolean {
        return isExecuting
    }
}