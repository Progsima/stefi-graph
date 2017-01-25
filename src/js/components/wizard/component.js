import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import Neo4jService from "~/services/neo4j/neo4j";
import Log from "~/services/log";
import Form from "react-jsonschema-form";
import * as action from "~/pages/settings/actions";
import SettingsNeo4j from "~/pages/settings/neo4j/page"
import TextCypherComplete  from "~/components/generic/jsonschema-custom/text-cypher-complete";
import "./style.less";

/**
 * Module logger.
 */
const log = new Log("Component.Wizard");

const schema = {
    'type': 'object',
    'required': [
        'url',
        'login',
        'password'
    ],
    'properties': {

        'login': {
            'type': 'string',
            'title': 'Login'
        },
        'password': {
            'type': 'string',
            'title': 'Password'
        },
        'url': {
            'type': 'string',
            'format': 'uri',
            'title': 'URL',
            'pattern': 'bolt://.*'
        }
    }
};

const ui = {
    'url': {
        'ui:placeholder': 'bolt://localhost',
        'ui:help': 'Example: bolt://localhost'
    },
    'login': {
        'ui:placeholder': 'neo4j'
    },
    'password': {
        'ui:widget': 'password'
    }
};

const widgets = {
  textCypherComplete: TextCypherComplete
};

/**
 * Create a wizard
 */
class Wizard extends Component {

    /**
     * Constructor.
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = Object.assign({}, {settings: this.props.settings, step:1, run:this.props.settings.wizard});
    }

    _testNeo4jConnection(){
      var neo4j = new Neo4jService(this.state.settings.neo4j.url, this.state.settings.neo4j.login, this.state.settings.neo4j.password);
      neo4j.cypher("RETURN 1", {}).then(
        result => {
          this.setState({step:2, error:null});
          this._finish();
        },
        reason => {
          this.setState({error:reason.message});
        }
      )
    }

    _finish(){
      var nextSettings =  Object.assign({},this.state.settings);
      nextSettings.wizard = false;
      this.props.dispatch(action.saveSettings, nextSettings);
      this.setState({step:1, error:null, run:false});
    }

    _previous(){
      this.setState({step:this.state.step-1, error:null});
    }

    _renderError() {
      if(this.state.error) {
        return (
          <div className="alert alert-danger" role="alert">
            {this.state.error}
          </div>
        )
      }
      else {
        return null;
      }
    }

    /**
     * Render phase
     */
    render() {
      if(this.state.run) {
        return (
          <div className="popin">
            <div className="popin-wrapper">
              <section className="col-md-12">
                {this._renderStep()}
              </section>
            </div>
          </div>
        )
      }
      else {
        return null;
      }
    }

    _renderStep(){
      switch (this.state.step){
          case 1:
            return this._renderStep1();
            break;;
          case 2:
            return this._renderStep2();
            break;;
      }
    }

    _renderStep1() {
      return (
        <div>
          <h1>Step 1 : Neo4j connection</h1>
          <hr/>
          {this._renderError()}
          <Form schema={schema}
            uiSchema={ui}
            liveValidate={true}
            onChange={ data => this.setState({settings:{neo4j:data.formData}})}
            formData={this.state.settings.neo4j}
            className={"horizontal" }
            widgets={widgets}>
            <div/>
          </Form>

          <a className="btn btn-primary pull-right" onClick={e => this._testNeo4jConnection()}>
            Next
          </a>
        </div>
      )
    }

    _renderStep2() {
      return (
        <div>
          <h1>Step 2 : Compute graph schema</h1>
          <a className="btn btn-primary pull-left" onClick={e => this._previous()}>
            Previous
          </a>
          <a className="btn btn-primary pull-right" onClick={e => this._testNeo4jConnection()}>
            Next
          </a>
        </div>
      )
    }
}

export default branch(
  {
    settings: ['settings']
  },
  Wizard
);
