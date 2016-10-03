import React, {Component, PropTypes} from "react";
import Log from "~/services/log";
import "./style.less";

/**
 * Module logger.
 */
const log = new Log("Component.ContextMenu");

/**
 * Create a context menu.
 * <ContextMenu />
 */
class ContextMenu extends Component {

    /**
     * Constructor.
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {id: _.uniqueId('context-menu')};
    }

    /**
     * Render phase
     */
    render() {
        return (
        )
    }
}

export default ContextMenu;

