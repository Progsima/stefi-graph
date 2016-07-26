import React, {Component, PropTypes} from "react";
import ReactCodemirror from "react-codemirror";
import {branch} from 'baobab-react/higher-order';
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/show-hint.css";
import "~/components/cyphereditor/cypher-hint";
import "~/components/cyphereditor/cypher-mode";
import "~/components/cyphereditor/cyphereditor.less";


/**
 * Create a CodeMirror editor for cypher.
 * <CypherEditor />
 */
class CypherEditor extends Component {

    static propTypes = {
        query: React.PropTypes.string
    };

    static defaultProps = {};

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
        var options = {
            lineNumbers: true,
            mode: 'cypher',
            theme: 'neo',
            tabMode: "spaces",
            extraKeys: {"Ctrl-Space": "autocomplete"},
            autoCloseBrackets: true,
            indentUnit: 4
        };
        return (
            <ReactCodemirror value={this.props.query} options={options}/>
        )
    }
}

export default branch( { query: ['query', 'current'] }, CypherEditor);

