import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import CypherEditor from "~/components/cyphereditor/cyphereditor";
import * as action from "~/actions/graph";

/**
 * Create a space editor to query the graph.
 * <QueryContainer />
 */
class QueryContainer extends Component {

    /**
     * Constructor.
     * @param props
     */
    constructor(props) {
        super(props);
    }

    queryOnChange() {
        return newCode => {
            this.props.dispatch(action.querySave, newCode)
        };
    }

    queryRun() {
        this.props.dispatch(action.queryRun);
    }

    queryRunAndAppend() {
        this.props.dispatch(action.queryRunAndAppend);
    }

    queryAddToFavory() {
        this.props.dispatch(action.queryAddToFavory);
    }

    /**
     * Render phase
     */
    render() {
        return (
            <div className={"query-container"}>
                <div>
                    <CypherEditor query={this.props.queries.current} onChange={this.queryOnChange()}/>
                    <ul className="list-inline action">
                        <li>
                            <a className="query-run" onClick={ e => this.queryRun(e) } title="Run the query">
                                <i className="fa fa-play fa-3"></i>
                            </a>
                        </li>
                        <li>
                            <a className="query-append" onClick={ e => this.queryRunAndAppend(e) } title="Append the query">
                                <i className="fa fa-plus fa-3"></i>
                            </a>
                        </li>
                        <li>
                            <a className="query-favory" onClick={ e => this.queryAddToFavory(e) } title="Add the query to favories">
                                <i className="fa fa-star fa-3"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default branch({queries: ['queries']}, QueryContainer);

