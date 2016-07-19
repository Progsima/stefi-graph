import Baobab from "baobab";
import Router from "baobab-router";

const data = {
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
        current:"MATCH (n) RETURN n LIMIT 25",
        history: [],
        favory: []
    }
};

const tree = new Baobab(data);

const router = new Router(tree, {
    defaultRoute: 'home',
    routes: [
        {
            path: 'home',
            state: {
                view: 'home'
            }
        },
        {
            path: 'settings',
            state: {
                view: 'settings'
            }
        }
    ]
});

export default tree;




 
