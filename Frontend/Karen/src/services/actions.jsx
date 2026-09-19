import { NativeModules } from 'react-native';
const { AppLauncher } = NativeModules;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const STEP_DELAYS = {
  open_app: 500,
  click_node: 300,
  find_input: 300,
  type_text: 300,
  press_enter: 700,
  click_first_result: 500,
  go_back: 500,
  scroll: 500,
  default: 300,
};
const executeAction = async (action) => {
  if (!action || typeof action !== 'object') {
    throw new Error('Invalid action');
  }
  const fn =action.function;
  const args =action.args || {};
  console.log('[Karen] Executing:',fn,args);
  switch (fn) {
    case 'open_app': {
      const appName = args.appName ?? '';
      if (!appName) {
        throw new Error('open_app requires appName');
      }
      if (typeof AppLauncher?.openApp !== 'function') {
        throw new Error('AppLauncher.openApp is not available');
      }
      console.log('[Karen] Opening:', appName);
      AppLauncher.openApp(appName);
      await delay(1500);
      console.log('[Karen] App opened:', appName);
      break;
    }
    case 'click_node': {
      const target =args.target ?? '';
      if (!target) {
        throw new Error('click_node requires target');
      }
      await AppLauncher.clickNode(target);
      break;
    }
    case 'find_input': {
      if (typeof AppLauncher.findInput ==='function') {
        await AppLauncher.findInput();
      } else {
        console.log('[Karen] find_input handled by AccessibilityService');
      }
      break;
    }
    case 'type_text': {
      const text =args.text ?? '';
      await AppLauncher.typeText(text);
      break;
    }
    case 'press_enter': {
      await AppLauncher.pressEnter();
      break;
    }
    case 'click_first_result': {
      await AppLauncher.clickFirstResult();
      break;
    }
    case 'go_back': {
      if (typeof AppLauncher.goBack ==='function') {
        await AppLauncher.goBack();
      } else {
        console.warn('[Karen] AppLauncher.goBack() not implemented');
      }
      break;
    }
    case 'scroll': {
      const direction =args.direction ?? 'down';
      if (typeof AppLauncher.scroll ==='function') {
        await AppLauncher.scroll(direction);
      } else {
        console.warn('[Karen] AppLauncher.scroll() not implemented');
      }
      break;
    }
    default: {
      throw new Error(`Unknown action: ${fn}`);
    }
  }
  const stepDelay = STEP_DELAYS[fn] ?? STEP_DELAYS.default;
  await delay(stepDelay);
  console.log('[Karen] Action completed:',fn);
};
const executeActions = async (actions) => {
  if (!Array.isArray(actions) || actions.length === 0) {
    console.warn('[Karen] No actions to execute');
    return false;
  }
  console.log(`[Karen] Starting ${actions.length} actions`);
  for (let i = 0;i < actions.length;i++) {
    const action =actions[i];
    console.log(`[Karen] Action ${i + 1}/${actions.length}`, action);
    try {
      await executeAction(action);
      console.log(`[Karen] Action ${i + 1} SUCCESS`);
    } catch (error) {
      console.error(`[Karen] Action ${i + 1} FAILED`, action, error);
      return false;
    }
  }
  console.log('[Karen] ALL ACTIONS COMPLETED');
  return true;
};
export default executeActions;