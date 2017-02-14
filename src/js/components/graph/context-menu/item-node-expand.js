
import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import Log from "~/services/log";
import Neo4jService from "~/services/neo4j/neo4j";
import * as action from "../actions";
import "./style.less";

const log = new Log("Component.graph.ContextMenuItemNodeExpand");

class ContextMenuItemNodeExpand extends Component {

  /**
  * Constructor.
  * @param props
  */
  constructor(props) {
    super(props);
    this.state = {edges:[]};
    this.neo4j = new Neo4jService(this.props.neo4j.url, this.props.neo4j.login, this.props.neo4j.password);
  }

  componentWillReceiveProps(nextProps) {
    this.neo4j = new Neo4jService(nextProps.neo4j.url, nextProps.neo4j.login, nextProps.neo4j.password);
  }

  componentDidMount() {
    this._getEdgesType();
  }


  _getEdgesType(){
    this.neo4j.cypher('MATCH (n)-[r]->(m) WHERE id(n)={id} RETURN type(r) AS type, "outgoing" AS direction, count(m) AS count UNION MATCH (n)<-[r]-(m) WHERE id(n)={id} RETURN type(r) AS type, "incoming" AS direction, count(m) AS count', {id:this.props.node.id})
      .then(
        result => {
          this.setState({edges:result});
        }
      )
  }

  _expand(edgeType){
    this.props.dispatch(action.nodeExpand, this.props.node.id, edgeType.type, edgeType.direction);
  }

  _renderEdgeType(edgeType, index){
    return (
      <li key={index} onClick={e => this._expand(edgeType)}>
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
        <li onClick={e => this._expand({type:null, direction:null})}>
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
