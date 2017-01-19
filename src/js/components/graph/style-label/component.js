import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import Form from "react-jsonschema-form";
import TextCypherComplete  from "~/components/generic/jsonschema-custom/text-cypher-complete";
import FontawesomeInput  from "~/components/generic/jsonschema-custom/fontawesome";
import * as action from "../actions";
import Log from "~/services/log";
import "./style.less";

const log = new Log("Component.graph.LabelStyle");

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
    },
    icon: {
      title: 'Icon',
      type: 'object',
      properties : {
        name: {
          type: "string",
          title: "Name",
        },
        color: {
          type: 'string',
          title: 'Color',
          default: '#000000'
        },
        scale: {
          type: 'number',
          title:'scale',
          minimum: 0.1,
          maximum: 1.0,
          default: 1.0,
          multipleOf:0.1
        }
      }
    },
    image: {
      title: 'Image',
      type: 'object',
      properties : {
        url: {
          type: "string",
          format: "uri",
          title: "Link",
        },
        scale: {
          type: 'number',
          title:'scale',
          minimum: 0.1,
          maximum: 1.0,
          default: 1.0,
          multipleOf:0.1
        }
      }
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
  },
  "icon" :{
    "name": {
      "ui:widget": {
        component: "fontawesomeInput"
      }
    },
    "scale": {
      "ui:widget": "range"
    },
    "color": {
      "ui:widget": "color"
    }
  },
  "image" : {
    "scale": {
      "ui:widget": "range"
    }
  }
};

const widgets = {
  textCypherComplete: TextCypherComplete,
  fontawesomeInput: FontawesomeInput
};

class LabelStyle extends Component {

  // Declare props types
  static propTypes = {
    label: React.PropTypes.string.isRequired,
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
    this.props.dispatch(action.saveLabelStyle, this.props.label, data);
  }

  /**
  * Render phase.
  */
  render() {
    return (
      <div className="style-label">
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

export default branch( {}, LabelStyle);
