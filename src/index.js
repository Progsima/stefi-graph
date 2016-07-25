import React from "react";
import ReactDOM from "react-dom";
import {root} from "baobab-react/higher-order";
import tree from "./store";
import router from "./router";
import config from "./config";
import App from "./components/app";
import './styles/main.less';

import Neo4jService from './services/neo4j';

var ns = new Neo4jService('bolt://localhost', 'neo4j', 'admin');
console.log(ns.labels());

// Adding baobab to the application
const RootedApp = root(tree, App);

ReactDOM.render(<RootedApp config={config}/>, document.getElementById('root'));
