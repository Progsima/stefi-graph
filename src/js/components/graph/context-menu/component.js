
import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import Log from "~/services/log";
import ContextMenuItem from './item.js';
import ContextMenuItemNodeExpand from './item-node-expand.js';
import * as action from "../actions";
import "./style.less";

const log = new Log("Component.graph.ContextMenu");

const menus = {
  node: {
    actions : [
      {
        label: "Edit node",
        icon: "fa-pencil",
        action: action.nodeEdit
      },
      {
        label: "Hide node",
        icon: "fa-eye-slash",
        action: action.nodeHide
      },
      {
        label: "Delete node",
        icon: "fa-times",
        action: action.nodeDelete
      },
      {
        label: "Expand node",
        icon: "fa-caret-right",
        component: ContextMenuItemNodeExpand
      },
      {
        label: "Collapse node",
        icon: "fa-compress",
        action: action.nodeCollapse
      }
    ]
  },
  edge: {
    actions: [

    ]
  },
  stage: {
    actions: []
  },
  selection: {
    actions: [
      {
        label: "-"
      },
      {
        label: "Only keep selection",
        icon: "fa-dot-circle-o",
        action: action.selectionKeep
      },
      {
        label: "Hide selection",
        icon: "fa-eye-slash",
        action: action.selectionHide
      },
      {
        label: "Delete selection",
        icon: "fa-times",
        action: action.selectionDelete
      }
    ]
  }
}

class ContextMenu extends Component {

  /**
  * Constructor.
  * @param props
  */
  constructor(props) {
    super(props);
    this.state = {
      display: false,
    };
    this._documentClickHandler = this._documentClickHandler.bind(this);
  }

  componentDidMount() {
    document.addEventListener("click", this._documentClickHandler);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this._documentClickHandler);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.type) {
      this.setState({
        display: true
      });
    }
    else {
      this.setState({
        display: false
      });
    }
  }

  _documentClickHandler() {
      this.setState({
        display: false
      });
  }

  _renderSelectionMenu(item, index) {
    if(this.props.selected && this.props.selected.length >0) {
      return <ContextMenuItem item={item} key={index} object={this.props.selected}/>;
    }
    else {
      return null;
    }
  }

  /**
  * Render phase.
  */
  render() {
    if(this.state.display){
      var style = {top:this.props.y+'px', left:this.props.x+'px', }
      return (
        <div style={style} className="graph-context-menu">
          <ul className="list-unstyled">
              { menus[this.props.type].actions.map((item, index) => {
                  return <ContextMenuItem item={item} key={index} object={this.props.object}/>;
              }) }

              { menus.selection.actions.map( (item, index) => {
                return this._renderSelectionMenu(item, index)
              })}
          </ul>
        </div>
      )
    }
    else {
      return null
    }
  }
}


export default branch(
  {
    neo4j: ['settings', 'neo4j'],
    type: ['data', 'rightClick', 'type'],
    selected: ['data', 'selected'],
    object: ['data', 'rightClick', 'object'],
    x: ['data', 'rightClick', 'x'],
    y: ['data', 'rightClick', 'y']
  }, ContextMenu);
