 import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import Log from "~/services/log";
import "./style.less";

const log = new Log("Component.smart.DisplayObject");

class GraphDisplayObject extends Component {

    /**
     * Constructor.
     * @param props
     */
    constructor(props) {
        super(props);
    }

    _renderProperty(key, value) {
        switch(value.constructor.name) {
            case 'Object': // here i's object due to the serial/deserial into sigma ...
                return ( <li key={key}><strong>{key} :</strong> {value.low}</li>)
                break;
            default :
                return ( <li key={key}><strong>{key} :</strong> {JSON.stringify(value)}</li>)
                break;
        }

        
    }

    _renderObject(object) {
        if(object && object['properties']) {
            return (
                <ul className="list-unstyled">
                    {Object.keys(object['properties']).map( (key, index) => {
                            return this._renderProperty(key, object['properties'][key])
                    })}
                </ul>
            )
        }
    }


    /**
     * Render phase.
     */
    render() {
        if(this.props.object) {
            
            var title = "";
            var objectTitle = "";
            if(this.props.object.labels) {
                title = this.props.object.labels.join(', ');

                var nodeStyle = this.props.style.labels[this.props.object.labels[0]];
                if(nodeStyle && nodeStyle.label && nodeStyle.label != '<id>') {
                    objectTitle = this.props.object.properties[nodeStyle.label];
                }
            }

            else {
                title = this.props.object.type;

                var edgeStyle = this.props.style.edges[this.props.object.type];
                if(edgeStyle && edgeStyle.label && edgeStyle.label != '<id>') {
                    objectTitle = this.props.object.properties[edgeStyle.label];
                }
            }


            return (
                 <div id="display-object">
                    <div>
                        <span className="pull-left">{title}</span>
                        <span className="pull-right">&lt;{this.props.object.id}&gt;</span>
                    </div>
                    <h4>{objectTitle}</h4>
                    <ul className="list-inline actions">
                        <li><a href="#"><i className="fa fa-pencil"></i></a></li>
                        <li><a href="#"><i className="fa fa-eye"></i></a></li>
                    </ul>

                    {this._renderObject(this.props.object)}
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
        object: ['data', 'over'],
        style: ['settings', 'style']
    },
    GraphDisplayObject
);
