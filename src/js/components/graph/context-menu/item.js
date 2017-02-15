
import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import Log from "~/services/log";

const log = new Log("Component.graph.ContextMenuItem");

class ContextMenuItem extends Component {

  // Declare props types
  static propTypes = {
    key: React.PropTypes.number,
    item: React.PropTypes.object.isRequired,
    object: React.PropTypes.any.isRequired,
  };

  /**
  * Constructor.
  * @param props
  */
  constructor(props) {
    super(props);
  }

  _executeAction(){
    if(this.props.item.action)
      if(this.props.object.hasOwnProperty('id'))
        this.props.dispatch(this.props.item.action, this.props.object.id);
      else
        this.props.dispatch(this.props.item.action, this.props.object);
  }

  _renderComponent(){
    var Component = this.props.item.component;
    if (Component)
      return (<Component node={this.props.object}/>)
    else
      return null;
  }

  /**
  * Render phase.
  */
  render() {
    if(this.props.item.label == '-') {
      return (
        <li key={this.props.key} style={{lineHeight:'2px'}}>
          <hr/>
        </li>
      )
    }
    else {
      return(
        <li key={this.props.key} onClick={e => this._executeAction()}>
          <div>{this.props.item.label} <i className={"pull-right fa " + this.props.item.icon}></i></div>
          {this._renderComponent()}
        </li>
      )
    }
  }

}

export default branch({}, ContextMenuItem);
