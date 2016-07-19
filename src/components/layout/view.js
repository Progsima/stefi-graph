import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";

class View extends Component {

    static propTypes = {
        config: React.PropTypes.object.isRequired
    };

    render() {
        if (this.props.config.pages.hasOwnProperty(this.props.view)) {
            var MyView = this.props.config.pages[this.props.view].component;
            return (
                <MyView page={ this.props.config.pages[this.props.view] }/>
            )
        }
        else {
            return (
                <h1>404 - NOT FOUND</h1>
            )
        }
    }
}

export default branch({view: ['view']}, View);

