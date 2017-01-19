/**
 * Configuration object for the application
 */
const configApplication = { 
    name: "Stefi Graph",
    logo: './assets/logo.png',	
    logLevel: 'Debug', // Error, Warning, Info, Debug
    logPattern: '.*', 
    queryHistorySize: 100,
    baobabHistorySize: 0,
    persistance: 'Off'  // Off, LocalStorage, Url
}

export default configApplication;