import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import EdgeStyle from "../style-edge/component";
import Log from "~/services/log";
import * as action from "../actions";
import "./style.less";

const log = new Log("Component.smart.GraphFacetEdge");

class GraphFacetEdge extends Component {

    /**
     * Constructor.
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
          displayEdgeStyleFor:''
        };
    }

    _toggleEdgeVisibility(edge) {
      this.props.dispatch(action.toggleEdgeVisibility, edge);
    }

    _toggleEdgeStyle(edge) {
      if (edge == this.state.displayEdgeStyleFor) {
          this.setState( {displayEdgeStyleFor:''});
      }
      else {
        this.setState( {displayEdgeStyleFor:edge});
      }

    }

    _renderEdge(edge, index, count) {
        var style = {};
        var hideIcon = "fa-eye";
        if(this.props.style[edge.name]) {
            if(this.props.style[edge.name].color)
              style = { borderBottom: '1px solid ' + this.props.style[edge.name].color };
            if(this.props.style[edge.name].hidden)
              hideIcon = "fa-eye-slash";
        }

        return (
            <li key={index}>
                <div>
                    {edge.name} ({edge.count})

                    <ul className="list-inline actions">
                        <li><a href="#"><i onClick={ e => this._toggleEdgeStyle(edge.name) }className="fa fa-pencil"></i></a></li>
                        <li><a href="#"><i onClick={ e => this._toggleEdgeVisibility(edge.name) } className={'fa ' + hideIcon}></i></a></li>
                    </ul>
                </div>
                <div style={style}>
                  <div style={{ width:(edge.count/count)*100 +'%', backgroundColor:this.props.style[edge.name].color , padding: '2px', marginBottom:'-1px'}}></div>
                </div>
                <div className={edge.name != this.state.displayEdgeStyleFor ? 'hidden edge-style' : 'edge-style'}>
                  <EdgeStyle edge={edge.name} style={this.props.style[edge.name]} />
                </div>
            </li>
        )
    }

    /**
     * Render phase.
     */
    render() {
      var edgeCount = this.props.edges.reduce((previousValue, currentValue) => { return previousValue + currentValue.count },0);
        if(this.props.edges) {
            return (
                <div className="facet-edge">
                    <h3>Realtionships</h3>
                    <ul className="list-unstyled">
                        {this.props.edges.map( (edge, index) => {
                            return this._renderEdge(edge, index, edgeCount)
                        })}
                    </ul>
                </div>
            )
        }
        else {
            return null;
        }
    }

}

export default branch( { edges: ['data', 'facets', 'edges'], style: ['settings', 'style', 'edges'] }, GraphFacetEdge );
