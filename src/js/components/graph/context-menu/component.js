
import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import Log from "~/services/log";
import ContextMenuItem from './item.js';
import ContextMenuItemExpand from './item-expand.js';
import * as action from "../actions";
import "./style.less";

const log = new Log("Component.graph.ContextMenu");

const menus = {
  node: {
    actions : [
      {
        label: "Edit",
        icon: "fa-pencil",
        action: action.nodeEdit
      },
      {
        label: "Hide",
        icon: "fa-eye-slash",
        action: action.nodeRemove
      },
      {
        label: "Delete",
        icon: "fa-times",
        action: action.nodeDelete
      },
      {
        label: "Expand",
        icon: "fa-caret-right",
        component: ContextMenuItemExpand
      },
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
    object: ['data', 'rightClick', 'object'],
    x: ['data', 'rightClick', 'x'],
    y: ['data', 'rightClick', 'y']
  }, ContextMenu);
