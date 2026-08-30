import { NativeModules, Linking } from 'react-native';
const { AppLauncher } = NativeModules;
const action = async ({ actionType, Name }) => {
    console.log("AppLauncher:", NativeModules.AppLauncher);
    switch (actionType) {
        case 'openApp': {
            try {
                const opened = await AppLauncher.openApp(Name);
                if (opened) {
                    return `App ${Name} is opened`;
                }
                return `I couldn't find ${Name} on this device`;
            } catch (error) {
                console.log("Open app error:", error);
                return `Unable to open ${Name}`;
            }
        }
        case 'searchWeb': {
            const url =
                `https://www.google.com/search?q=${encodeURIComponent(Name)}`;
            await Linking.openURL(url);
            return `Search results for ${Name} are shown`;
        }
        default:
            return "Invalid action";
    }
};
export default action;