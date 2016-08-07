import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import Log from "~/services/log";
import * as action from "~/actions/graph";

const log = new Log("Component.smart.QueryFavory");

class QueryFavory extends Component {

    /**
     * Constructor.
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {open: false};
    }

    _bindToggleMenu() {
        console.log("Click");
        if(this.state.open) {
            this.setState({open:false})
        }
        else {
            this.setState({open:true})
        }
    }

    _bindClickItem(query) {
        this.props.dispatch(action.querySave, query);
        this.setState({open:false});
    }

    _getStyle() {
        if(this.state.open) {
            return {display:"block"};
        }
        else {
            return {display:"none"};
        }
    }

    /**
     * Render phase
     */
    render() {
        if (this.props.favories.length > 0) {
            return (
                <li className="dropdown">
                    <a className="dropdown-toggle"
                        onClick={e => this._bindToggleMenu()}>
                        Favory <span className="caret"></span>
                    </a>
                    <ul className="dropdown-menu" style={this._getStyle()}>
                        { this.props.favories.map((item, index) => {
                            return ( <li key={index}><a onClick={e => this._bindClickItem(item.query)} title="">{item.name}</a></li> )
                        }) }
                    </ul>
                </li>
            )
        }
        else {
            return null;
        }
    }
}

export default branch(
    {
        favories: ['queries', 'favory']
    },
    QueryFavory
);

