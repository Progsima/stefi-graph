import React, {Component, PropTypes} from "react";
import {PageEnhancer} from "./../../enhancer/page";
import CypherEditor from "../cyphereditor/cyphereditor";

class Home extends Component {

    static propTypes = {
    page: React.PropTypes.object.isRequired
};

    render() {
        return (
            <div>
                <h1>Home</h1>
                <CypherEditor />
            </div>
        )
    }
}

export default PageEnhancer(Home)
