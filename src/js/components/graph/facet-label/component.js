import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import * as action from "../actions";
import LabelStyle from "../style-label/component";
import Log from "~/services/log";
import "./style.less";

const log = new Log("Component.smart.GraphFacetLabel");

class GraphFacetLabel extends Component {

    /**
     * Constructor.
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
          displayLabelStyleFor:''
        };
    }

    _toggleLabelVisibility(label) {
      this.props.dispatch(action.toggleLabelVisibility, label);
    }

    _toggleLabelStyle(label) {
      if (label == this.state.displayLabelStyleFor) {
          this.setState( {displayLabelStyleFor:''});
      }
      else {
        this.setState( {displayLabelStyleFor:label});
      }

    }

    _renderLabel(label, index, labelCount) {
        var style = { borderBottom: '1px solid #000'};
        var styleStat = { width:(label.count/labelCount)*100 +'%', backgroundColor:'#000' , padding: '2px', marginBottom:'-1px'};
        var hideIcon = "fa-eye";
        if(this.props.style[label.name]) {
            if(this.props.style[label.name].color) {
              style.borderColor = this.props.style[label.name].color;
              styleStat.backgroundColor = this.props.style[label.name].color;
            }
            if(this.props.style[label.name].hidden)
              hideIcon = "fa-eye-slash";
        }

        return (
            <li key={index}>
                <div>
                    {label.name} ({label.count})

                    <ul className="list-inline actions">
                        <li><a href="#"><i onClick={ e => this._toggleLabelStyle(label.name) }className="fa fa-pencil"></i></a></li>
                        <li><a href="#"><i onClick={ e => this._toggleLabelVisibility(label.name) } className={'fa ' + hideIcon}></i></a></li>
                    </ul>
                </div>
                <div style={style}>
                  <div style={styleStat}></div>
                </div>
                <div className={label.name != this.state.displayLabelStyleFor ? 'hide label-style-wrapper' : 'label-style-wrapper'}>
                  <LabelStyle label={label.name} style={this.props.style[label.name]} />
                </div>
            </li>
        )
    }

    /**
     * Render phase.
     */
    render() {
        var labelCount = this.props.labels.reduce((previousValue, currentValue) => { return previousValue + currentValue.count },0);
        if(this.props.labels) {
            return (
                <div className="facet-label">
                    <h3>Labels</h3>
                    <ul className="list-unstyled">
                        {this.props.labels.map( (label, index) => {
                            return this._renderLabel(label, index, labelCount)
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

export default branch(
  {
    labels: ['data', 'facets', 'labels'],
    style: ['settings', 'style', 'labels']
  }, GraphFacetLabel );
