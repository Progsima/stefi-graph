import Home from "./components/pages/home";
import Settings from "./components/pages/settings/settings";
import SettingsServer from "./components/pages/settings/settings.server";

/**
 * Configuration object for the application
 */
const config = {

    /**
     * General configuration
     */
    name: "Stefi Graph",
    logo: "./assets/logo.png",


    /**
     * The state that will be pass to baobab for initialisation.
     */
    state: {
        view: 'home',
        graph: {
            nodes: [],
            edges: []
        },
        meta: {
            labels: [],
            edges: [],
            properties: [],
            schema: {}
        },
        neo4j: {
            login: "neo4j",
            password: "admin",
            url: "bolt://localhost"
        },
        query: {
            current: "MATCH (n) RETURN n LIMIT 25",
            history: [],
            favory: []
        }
    },

    /**
     * Sitemap of the application.
     *
     * Each object should have :
     *  - path : for the router
     *  - name : will be display in menu
     *  - title : will be the title of the page
     *  - component : component that will be loaded to display the page
     *  - state : the constraint on state for the router (it's bi-directional with the hash)
     *     - must have a view, and it must be unique across all page. Moreover
     *  - an array of sub-pages if needed
     */
    defaultRoute: "/home",
    sitemap: [
        {
            path: "/home",
            name: "Home",
            title: "Welcome to Stefi Graph",
            component: Home,
            state: {
                view: 'home'
            }
        },
        {
            path: '/settings',
            name: "Settings",
            title: "Settings",
            defaultRoute: '/server',
            component: Settings,
            state: {
                view: 'settings'
            },
            pages: [
                {
                    path: '/server',
                    name: "Server",
                    title: "Server configuration",
                    component: SettingsServer,
                    state: {
                        view: 'settings.server'
                    }
                }
            ]
        }
    ]
};

export default config;
