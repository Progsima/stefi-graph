import React, {Component, PropTypes} from 'react';
import {branch} from 'baobab-react/higher-order';
import {PageEnhancer} from '~/enhancer/page';
import * as action from '../actions';
import Settings from '../settings';
import Neo4jService from "~/services/neo4j/neo4j";

const schema = {
  "type": "object",
  "properties": {
    "labels": {
      "type": "array",
      "title": "Labels",
      "items": {
        "type": "object",
        "title": "Label",
        "required": [
          "name"
        ],
        "properties": {
          "name": {
            "type": "string",
            "title": "For node"
          },
          "label": {
            "type": "string",
            "title": "Label field",
            default: '<id>'
          },
          "size": {
            type: 'number',
            title: 'Size',
            minimum: 1,
            maximum: 30,
            default: 15
          },
          "color": {
            type: 'string',
            title: 'Color',
            default: '#000000'
          }
        }
      }
    },
    "edges": {
      "type": "array",
      "title": "Edges",
      "items": {
        "type": "object",
        "title": "Edge",
        "required": [
          "name"
        ],
        "properties": {
          "name": {
            "type": "string",
            "title": "For edge"
          },
          "label": {
            "type": "string",
            "title": "Label field",
            default: '<id>'
          },
          "size": {
            type: 'number',
            title: 'Size',
            minimum: 1,
            maximum: 30,
            default: 15
          },
          "color": {
            type: 'string',
            title: 'Color',
            default: '#000000'
          }
        }
      }
    }
  }
};

const ui = {
  "labels": {
    "items": {
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
    }
  },
  "edges": {
    "items": {
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
    }
  }
};

class SettingsGraphStyle extends Component {

  static propTypes = {
    page: React.PropTypes.object.isRequired,
    data: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.neo4j = new Neo4jService(this.props.neo4j.url, this.props.neo4j.login, this.props.neo4j.password);
  }

  componentDidMount() {
    this.propsToState();
  }

  componentWillReceiveProps(nextProps) {
    this.propsToState(nextProps);
  }

  propsToState(props = this.props) {
    // Run the query
    this.neo4j.labels().then(result => {
      this.setState({labels:result});
    })
    .catch( error => {
      throw error;
      this.props.dispatch( notification.pushNotification, {
        title: "Error: ",
        message: "L'erreur suivante est apparue lors de la récupération des labels => \n" + JSON.stringify(error),
        type : "danger"
      });
    });
    // Run the query
    this.neo4j.relationshipTypes().then(result => {
      this.setState({edges:result});
    })
    .catch( error => {
      throw error;
      this.props.dispatch( notification.pushNotification, {
        title: "Error: ",
        message: "L'erreur suivante est apparue lors de la récupération des edges => \n" + JSON.stringify(error),
        type : "danger"
      });
    });
  }

  styleArray2Map(data) {
    var map = { labels:{}, edges:{}};
    data.labels.map( e => {
      map.labels[e.name] = e;
    });
    data.edges.map( e => {
      map.edges[e.name] = e;
    })

    return map;
  }

  style2Array() {
    var array = { labels:[], edges:[] };

    Object.keys(this.props.data.labels).map(e => {
      var labelStyle = JSON.parse(JSON.stringify(this.props.data.labels[e]));
      labelStyle.name = e;
      array.labels.push(labelStyle);
    });

    Object.keys(this.props.data.edges).map(e => {
      var edgeStyle = JSON.parse(JSON.stringify(this.props.data.edges[e]));
      edgeStyle.name = e;
      array.edges.push(edgeStyle);
    });

    if (this.state && this.state.labels) {
      this.state.labels.map(e => {
        if (!this.props.data.labels[e]) {
          array.labels.push( { name:e });
        }
      });
    }

    if (this.state && this.state.edges) {
      this.state.edges.map(e => {
        if (!this.props.data.edges[e]) {
          array.edges.push( { name:e });
        }
      });
    }

    return array;
  }

  saveToStore(data){
    var map = this.styleArray2Map(data);
    this.props.dispatch( action.saveSettingsStyle, map);
  }

  render() {
    var data = this.style2Array();
    return (
      <Settings page={this.props.page} schema={schema}  ui={ui} data={data} save={(data) => this.saveToStore(data)} />
    )
  }
}

export default PageEnhancer(
  branch(
    {
      data: ['settings', 'style'],
      neo4j: ['settings', 'neo4j']
    },
    SettingsGraphStyle
  )
);
