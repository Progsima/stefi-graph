import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import Log from "~/services/log";
import CypherEditor from "~/components/query/cypher-editor/component";
import * as action from "../actions";
import * as notification from "~/components/notifications/actions";
//simport deepEqual from 'deep-equal';

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

    /**
     * If no props have changed, then no new render...
     */
    shouldComponentUpdate(nextProps, nextState) {
      return true;
        //return !deepEqual(this.props, nextProps);
    }

    _queryOnChange(newCode) {
        this.historyPosition = 0;
        this.props.dispatch(action.querySave, newCode);
    }

    _queryRun() {
        this.historyPosition = 0;
        this.props.dispatch(action.queryRun);
    }

    _queryRunAndAppend() {
        this.historyPosition = 0;
        this.props.dispatch(action.queryRunAndAppend);
    }

    _queryAddToFavory() {
        this.historyPosition = 0;
        this.props.dispatch(action.queryAddToFavory);
    }

    _clear() {
        this.props.dispatch(action.clear);
    }

    _historyUp(cm) {
        log.info("CM keymap Cmd-Up");
        if (this.historyPosition < (this.props.queries.history.length - 1)) {
            this.historyPosition += 1;
            this.props.dispatch(action.querySave, this.props.queries.history[this.historyPosition]);
        }
        else {
            this.props.dispatch(
                notification.pushNotification,
                {
                    title: "Info: ",
                    message: "You reach the end of history",
                    type: "info"
                });
        }
    }

    _historyDown(cm) {
        log.info("CM keymap Cmd-Down");
        if (this.historyPosition > 0) {
            this.historyPosition -= 1;
            this.props.dispatch(action.querySave, this.props.queries.history[this.historyPosition]);
        }
        else {
            this.props.dispatch(
                notification.pushNotification,
                {
                    title: "Info: ",
                    message: "You reach the start of history",
                    type: "info"
                });
        }
    }

    /**
     * Render phase
     */
    render() {
        var options = {
            extraKeys: {
                'Ctrl-Up': (cm) => {
                    this._historyUp(cm)
                },
                'Ctrl-Down': (cm) => {
                    this._historyDown(cm)
                },
                'Ctrl-Enter': (e) => {
                    this._queryRun()
                },
                'Shift-Ctrl-Enter': (e) => {
                    this._queryRunAndAppend()
                }
            }
        };

        return (
            <div className={"query-container"}>
                <div>
                    <CypherEditor query={this.props.queries.current} onChange={(e) => this._queryOnChange(e)} options={options}/>
                    <ul className="list-inline action">
                        <li>
                            <a className="query-run" onClick={ e => this._queryRun(e) } title="Run the query">
                                <i className="fa fa-play fa-3"></i>
                            </a>
                        </li>
                        <li>
                            <a className="query-append" onClick={ e => this._queryRunAndAppend(e) } title="Append the query">
                                <i className="fa fa-plus fa-3"></i>
                            </a>
                        </li>
                        <li>
                            <a className="query-favory" onClick={ e => this._queryAddToFavory(e) } title="Add the query to favories">
                                <i className="fa fa-star fa-3"></i>
                            </a>
                        </li>
                        <li>
                            <a className="graph-query-clear" onClick={ e => this._clear(e) } title="Clear all">
                                <i className="fa fa-refresh fa-3"></i>
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
