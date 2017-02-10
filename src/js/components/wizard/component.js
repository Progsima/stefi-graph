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
        // reverse order of priority
        this.defaultLabelField = ["value", "id", "title", "name"];
        this.state = Object.assign({}, {settings: this.props.settings, step:1,computing:false, run:this.props.settings.wizard});
    }

    _finish(){
      var nextSettings =  Object.assign({}, this.props.settings, this.state.settings);
      nextSettings.wizard = false;
      this.props.dispatch(action.saveSettings, nextSettings);
      this.setState({step:1, error:null, run:false});
    }

    _next(){
      this.setState({step:this.state.step+1, error:null});
    }

    _previous(){
      this.setState({step:this.state.step-1, error:null});
    }

    _saveAndClose(){
      this.props.dispatch(action.saveSettingsServer, this.state.settings.neo4j);
      this.props.dispatch(action.saveSettingsSchema, this.state.settings.schema);
      this.props.dispatch(action.saveSettingsStyle, this.state.settings.style);
      this._finish();
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
          case 3:
            return this._renderStep3();
            break;;
          case 4:
            return this._renderStep4();
            break;;
      }
    }

    _testNeo4jConnection(){
      var neo4j = new Neo4jService(this.state.settings.neo4j.url, this.state.settings.neo4j.login, this.state.settings.neo4j.password);
      neo4j.cypher("RETURN 1", {}).then(
        result => {
          this._next();
        },
        reason => {
          this.setState({error:reason.message});
        }
      )
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

    _computeSchema() {
      var neo4j = new Neo4jService(this.state.settings.neo4j.url, this.state.settings.neo4j.login, this.state.settings.neo4j.password);
      this.setState({computing:true})
      neo4j.computeGraphSchema().then( result => {
        let settings = Object.assign({}, this.state.settings);
        settings.schema = result;
        this.setState({settings:settings, step:(this.state.step+1), error:null, computing:false});
      });
    }
    _renderStep2() {
      return (
        <div>
          <h1>Step 2 : Compute graph schema</h1>
          <hr/>

          <div className={this.state.computing?'hidden':''}>
            <p>On this step we will compute the schema of your graph. This can take some times (depends of your database).</p>
            <p>Click on the <strong>Start</strong> button above to begin this task.</p>
          </div>
          <div className={this.state.computing?'progress':'hidden'}>
            <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{width: '100%'}}>
            </div>
          </div>

          <a className="btn btn-primary pull-left" onClick={e => this._previous()}>
            Previous
          </a>

          <a className={this.state.computing?'hidden':'btn btn-primary pull-right'} onClick={e => this._computeSchema()}>
            Start
          </a>

        </div>
      )
    }

    _computeStyle(){
      let style = {labels:{}, edges:{}};
      let settings = Object.assign({}, this.state.settings);
      Object.keys(settings.schema.labels).map((label) =>{
        var labelField = '<id>';
        this.defaultLabelField.forEach( item => {
          if(settings.schema.labels[label].properties[item])
            labelField = item;
        });
        style.labels[label] = {
          label: labelField,
          color: '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6),
          size: 15
        };
      });
      Object.keys(settings.schema.edges).map((edge) =>{
        style.edges[edge] = {
          label: '<type>',
          color: '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6),
          size: 2,
        };
      });
      settings.style = style;
      this.setState({settings:settings, step:(this.state.step+1), error:null, computing:false});
    }

    _renderStep3() {
      return (
        <div>
          <h1>Step 3 : Creating default style</h1>
          <hr />

          <div className={this.state.computing?'hidden':''}>
            <p>On this step we will create some default style for the render of your graph..</p>
            <p>Click on the <strong>Start</strong> button above to begin this task.</p>
          </div>
          <div className={this.state.computing?'progress':'hidden'}>
            <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{width: '100%'}}>
            </div>
          </div>

          <a className="btn btn-primary pull-left" onClick={e => this._previous()}>
            Previous
          </a>

          <a className={this.state.computing?'hidden':'btn btn-primary pull-right'} onClick={e => this._computeStyle()}>
            Start
          </a>
        </div>
      )
    }

    _renderStep4() {
      return (
        <div>
          <h1>Congrats !</h1>
          <p>The wizard is finished. Click on the <strong>finish</strong> button to save the configuration.</p>
          <p>At any moment you can change it, via the <strong>Configuration</strong> menu.</p>
          <a className="btn btn-primary pull-left" onClick={e => this._previous()}>
            Previous
          </a>
          <a className="btn btn-primary pull-right" onClick={e => this._saveAndClose()}>
            Finish
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
