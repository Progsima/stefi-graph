 import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import Log from "~/services/log";
import Neo4jService from "~/services/neo4j/neo4j";
import * as action from "~/components/graph/actions";
import Form from "react-jsonschema-form";
import "./style.less";

const log = new Log("Component.smart.GraphEditObject");

class GraphEditObject extends Component {

    /**
     * Constructor.
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = { schema:null, data:null};
        this.neo4j = new Neo4jService(this.props.neo4j.url, this.props.neo4j.login, this.props.neo4j.password);
    }

    componentWillReceiveProps(nextProps) {
      this.neo4j = new Neo4jService(nextProps.neo4j.url, nextProps.neo4j.login, nextProps.neo4j.password);
      if(nextProps.id !== null) {
        if(nextProps.type === 'edge') {
          // "MATCH (n)-[o]->(m) WHERE id(o)={id} RETURN o";
        }
        else {
          this.neo4j.cypher("MATCH (o) WHERE id(o)={id} RETURN o", {id:nextProps.id}).then( result => {
            this.setState({
              schema: nextProps.schema.labels[result[0].o.labels[0]],
              data: result[0].o.properties
            });
          })
        }
      }
    }

    _save(data){
      this.props.dispatch(action.nodeSave, this.props.id, data);
      this._close();
    }

    _close(){
      this.props.dispatch(action.nodeEdit, null);
    }

    /**
     * Render phase.
     */
    render() {
      if(this.props.id !== null && this.state.schema !== null && this.state.data !== null){
        return (
          <div className="popin">
            <div className="popin-wrapper">
              <section className="col-md-12">
                <Form schema={this.state.schema}
                  liveValidate={true}
                  onSubmit={ data =>  this._save(data.formData)}
                  formData={this.state.data}
                  className={"horizontal"}>
                  <div>
                    <button className="btn btn-primary pull-right" type="submit">Submit</button>
                    <button onClick={(e) => this._close()} className="btn btn-primary pull-left" type="button">Cancel</button>
                  </div>
                </Form>
              </section>
            </div>
          </div>
        );
      }
      else {
        return null;
      }

    }

}

export default branch(
    {
        id: ['data', 'edit', 'id'],
        type: ['data', 'edit', 'type'],
        schema: ['settings', 'schema'],
        neo4j: ['settings', 'neo4j']
    },
    GraphEditObject
);
