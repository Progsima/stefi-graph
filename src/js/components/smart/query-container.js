import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import Log from "~/services/log";
import CypherEditor from "~/components/dumb/editor-cypher/editor";
import * as action from "~/actions/graph";

const log = new Log("Component.QueryContainer");

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
        this.historyPosition = 0;
    }

    queryOnChange() {
        return newCode => {
            this.historyPosition = 0;
            this.props.dispatch(action.querySave, newCode)
        };
    }

    queryRun() {
        this.historyPosition = 0;
        this.props.dispatch(action.queryRun);
    }

    queryRunAndAppend() {
        this.historyPosition = 0;
        this.props.dispatch(action.queryRunAndAppend);
    }

    queryAddToFavory() {
        this.historyPosition = 0;
        this.props.dispatch(action.queryAddToFavory);
    }

    historyUp() {
        return cm => {
            log.info("CM keymap Cmd-Up");
            this.historyPosition += 1;
            cm.setValue(this.props.queries.history[this.historyPosition]);
        };
    }

    historyDown() {
        return cm => {
            log.info("CM keymap Cmd-Down");
            if (this.historyPosition > 0) {
                this.historyPosition -= 1;
                cm.setValue(this.props.queries.history[this.historyPosition]);
            }
        };
    }

    /**
     * Render phase
     */
    render() {

        var options = {
            extraKeys: {
                'Shift-A': this.historyUp(),
                'Shift-b': this.historyDown()
            }
        };

        return (
            <div className={"query-container"}>
                <div>
                    <CypherEditor query={this.props.queries.current} onChange={this.queryOnChange()} options={options}/>
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

export default branch(
    {
        queries: ['queries']
    },
    QueryContainer
);

