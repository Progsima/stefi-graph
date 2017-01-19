import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import Form from "react-jsonschema-form";
import TextCypherComplete  from "~/components/generic/jsonschema-custom/text-cypher-complete";
import FontawesomeInput  from "~/components/generic/jsonschema-custom/fontawesome";
import * as action from "../actions";
import Log from "~/services/log";
import "./style.less";

const log = new Log("Component.graph.EdgeStyle");

const schema = {
  type: "object",
  required: ['label', 'size', 'color'],
  properties: {
    hidden: {
      type: 'boolean',
      title: 'Hidden ?',
      default: false
    },
    label: {
      type: "string",
      title: "Label field",
      default: '<id>'
    },
    size: {
      type: 'number',
      title: 'Size',
      minimum: 1,
      maximum: 30,
      default: 15
    },
    color: {
      type: 'string',
      title: 'Color',
      default: '#000000'
    }
  }
};

const ui = {
  "label": {
    "ui:widget": {
      options: {
        query: "CALL db.propertyKeys() yield propertyKey AS value WITH value WHERE value STARTS WITH {value} RETURN value LIMIT 10"
      },
      component: "textCypherComplete"
    }
  },
  "size": {
    "ui:widget": "range"
  },
  "color": {
    "ui:widget": "color"
  }
};

const widgets = {
  textCypherComplete: TextCypherComplete,
  fontawesomeInput: FontawesomeInput
};

class EdgeStyle extends Component {

  // Declare props types
  static propTypes = {
    edge: React.PropTypes.string.isRequired,
    style: React.PropTypes.object.isRequired
  };

  /**
  * Constructor.
  * @param props
  */
  constructor(props) {
    super(props);
  }

  _save(data) {
    this.props.dispatch(action.saveEdgeStyle, this.props.edge, data);
  }

  /**
  * Render phase.
  */
  render() {
    return (
      <div className="style-edge">
        <div className="form">
          <Form schema={schema}
            uiSchema={ui}
            autocomplete="on"
            liveValidate={true}
            onSubmit={ data => this._save(data.formData) }
            formData={this.props.style}
            className={"horizontal" }
            widgets={widgets}/>
        </div>
      </div>
    )
  }

}

export default branch( {}, EdgeStyle);
