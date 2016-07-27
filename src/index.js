import React from "react";
import ReactDOM from "react-dom";
import {root} from "baobab-react/higher-order";
import tree from "~/store";
import config from "~/config";
import App from "~/pages/index";
import "~/styles/main.less";
import neo4j from "~/services/neo4j/neo4j-baobab";
import router from "~/router";


// Adding baobab to the application
console.log(neo4j.labels());

const RootedApp = root(tree, App);

ReactDOM.render(<RootedApp config={config}/>, document.getElementById('root'));
