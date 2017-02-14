
import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import Log from "~/services/log";
import Neo4jService from "~/services/neo4j/neo4j";
import * as action from "../actions";
import "./style.less";

const log = new Log("Component.graph.ContextMenuItemNodeCollapse");

class ContextMenuItemNodeCollapse extends Component {

  /**
  * Constructor.
  * @param props
  */
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // compute baobab type
  }

  _collapse(edgeType){
    this.props.dispatch(action.nodeCollapse, this.props.node.id, edgeType.type, edgeType.direction);
  }

  _renderEdgeType(edgeType, index){
    return (
      <li key={index} onClick={e => this._collapse(edgeType)}>
        <div>
          {edgeType.type} ({edgeType.count})
          <i className={(edgeType.direction == 'outgoing')? 'pull-right fa fa-arrow-right' : 'pull-right fa fa-arrow-left'}></i>
        </div>
      </li>
    )
  }

  /**
  * Render phase.
  */
  render() {
    return (
      <ul className="list-unstyled">
        <li onClick={e => this._collapse({type:null, direction:null})}>
          <div>
            All ({this.state.edges.reduce( (prev, current) => { return prev + parseInt(current.count) }, 0)})
            <i className={'pull-right fa fa-arrows'}></i>
          </div>
        </li>

        {this.state.edges.map( (edgeType, index) => {
            return this._renderEdgeType(edgeType, index);
        })}
      </ul>
    )
  }

}

export default branch(
  {
    neo4j: ['settings', 'neo4j'],
    object: ['data', 'rightClick', 'object']
  }, ContextMenuItemNodeExpand );
