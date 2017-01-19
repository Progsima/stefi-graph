import React, {Component, PropTypes} from "react";
import ReactCodemirror from "react-codemirror";
import Log from "~/services/log";
import {mergeDeep} from "~/services/utils";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/show-hint.css";
import "./autocomplete";
import "./cypher-mode";
import "./style.less";

/**
 * Module logger.
 */
const log = new Log("Component.CypherEditor");

/**
 * Create a CodeMirror editor for cypher.
 * <CypherEditor />
 */
class CypherEditor extends Component {

    static propTypes = {
        query: React.PropTypes.string,
        onChange: React.PropTypes.func,
        options: React.PropTypes.object
    };

    static defaultProps = {
        query: "MATCH (n) RETURN n LIMIT 25",
        onChange: (e) => {
            log.info(e)
        },
        options: {}
    };

    /**
     * Constructor.
     * @param props
     */
    constructor(props) {
        super(props);
    }

    /**
     * Render phase
     */
    render() {
        var defaultOptions = {
            lineNumbers: true,
            mode: 'cypher',
            theme: 'neo',
            tabMode: "spaces",
            extraKeys: {
                "Ctrl-Space": "autocomplete"
            },
            autoCloseBrackets: true,
            indentUnit: 4
        };
        var options = mergeDeep(defaultOptions, this.props.options);
        log.debug("props options are "  + JSON.stringify( this.props.options));
        log.debug("Options for CM are :" + JSON.stringify( options));

        return (
            <ReactCodemirror value={this.props.query} onChange={this.props.onChange} options={options}/>
        )
    }
}

export default CypherEditor;

