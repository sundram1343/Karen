import {NativeModules } from 'react-native'
const {AppLauncher} = NativeModules
const action = async ({ actionType, Name,textToType }) => {
  // AI might sometimes return an object like { appName: "Chrome" } instead of a string
  const getStr = (val) => {
    if (!val) return "";
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
      const values = Object.values(val);
      return values.length > 0 ? String(values[0]) : JSON.stringify(val);
    }
    return String(val);
  };
  
  const safeName = getStr(Name);
  const safeText = getStr(textToType);

  switch (actionType) {
    case "openAppAndType":
      try {
        await AppLauncher.openAppAndType(safeName, safeText);
      } catch (error) {
        console.error("Error in openAppAndType", error);
      }
      break;
    case "openApp":
      try {
        await AppLauncher.openApp(safeName);
      } catch (error) {
        console.error("Error in openApp", error);
      }
      break;
    default:
      console.log("No action found");
  }
}
export default action
