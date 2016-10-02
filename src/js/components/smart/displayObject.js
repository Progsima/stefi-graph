import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import Log from "~/services/log";

const log = new Log("Component.dumb.DisplayObject");

class DisplayObject extends Component {

    /**
     * Constructor.
     * @param props
     */
    constructor(props) {
        super(props);
    }

    _renderProperty(key, value) {
        return (
            <li key={key}><strong>{key} :</strong> {value}</li>
        )
    }

    /**
     * Render phase
     */
    render() {
        if(this.props.object && this.props.object['properties']) {
        return (
            <ul>
                {
                    Object.keys(this.props.object['properties']).map((key, index) => {
                        return this._renderProperty(key, this.props.object['properties'][key])
                    })
                }
            </ul>
        )
        }
        else {
            return (<ul/>)
        }
    }
}

export default DisplayObject
