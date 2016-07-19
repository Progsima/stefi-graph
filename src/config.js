import Home from "./components/pages/home";
import Settings from "./components/pages/settings";

const config = {
    name: "Stefi Graph",
    logo: "./assets/logo.png",

    // TODO: shared this part with the router one ?
    pages: {
        home: {
            name: "Home",
            title: "Welcome to Stefi Graph",
            component: Home
        },
        settings: {
            name: "Settings",
            title: "Stefi Graph settings",
            component: Settings
        }
    }
};

export default config;
