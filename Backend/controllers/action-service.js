const { exec, spawn } = require('child_process');
const open = require('open');
const actions = {
    openApp: async (appName) => {
        try {
            await open(`"${appName}"`);
            return `${appName} opened successfully`;
        }
        catch(error){
            console.error("error opening app:",error);
            return `Error: ${error}`;
        }
    },
    searchWeb: async (query) => {
        try{
            await open(`https://www.google.com/search?q=${query}`);
            return `Opened google with search: ${query} successfully`;
        }catch(error){
            console.error("error opening search:",error);
            return `Error: ${error}`;
        }
    }
}
export default actions;