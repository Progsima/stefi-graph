import "font-awesome-webpack";
import "~/../less/main.less";

import React from "react";
import ReactDOM from "react-dom";
import {root} from "baobab-react/higher-order";
import tree from "~/store";
import App from "~/app";
import router from "~/router";

const RootedApp = root(tree, App);
ReactDOM.render(<RootedApp />, document.getElementById('root'));

window.tree = tree;
