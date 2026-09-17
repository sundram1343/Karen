import {NativeModules } from 'react-native'
const {AppLauncher} = NativeModules
const action = async ({ actionType, Name,textToType }) => {
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
  console.log("safeName",safeName)
  console.log("safeText",safeText)
  console.log("actionType",actionType)
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
    case "searchWeb":
      try {
        await AppLauncher.openAppAndType("Chrome",safeName);
      } catch (error) {
        console.error("Error in searchWeb", error);
      }
      break;
    case "PlayMusic":
      try{
        await AppLauncher.openAppAndType(safeName,safeText);
      }catch(error){
        console.error("Error in PlayMusic",error);
      }
    default:
      console.log("No action found");
  }
}
export default action
