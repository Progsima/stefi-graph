import React, {Component, PropTypes} from "react";
import {PageEnhancer} from "./../../enhancer/page";

class Settings extends Component {

    static propTypes = {
        page: React.PropTypes.object.isRequired
    };

    render() {
        return (
            <h1>Settings</h1>
        )
    }
}

export default PageEnhancer(Settings)
