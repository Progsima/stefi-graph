import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import Form from "react-jsonschema-form";
import Alert from "./../../alert/alert";
import {PageEnhancer} from "./../../../enhancer/page";
import * as sitemap from "./../../../actions/sitemap";
import * as action from "./../../../actions/action";
import Menu from "./../../layout/menu";


const schema = {
    "type": "object",
    "required": [
        "url",
        "login",
        "password"
    ],
    "properties": {

        "login": {
            "type": "string",
            "title": "Login"
        },
        "password": {
            "type": "string",
            "title": "Password"
        },
        "url": {
            "type": "string",
            "format": "uri",
            "title": "URL",
            "pattern": "bolt://.*"
        }
    }
};

const uiSchema = {
    "url": {
        "ui:placeholder": "bolt://localhost",
        "ui:help": "Example: bolt://localhost"
    },
    "login": {
        "ui:placeholder": "neo4j"
    },
    "password": {
        "ui:widget": "password"
    }
};

class SettingsServer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            success: undefined
        };
    }

    saveToStore(data){
        this.props.dispatch( action.saveNeo4jConfiguration, data);
        this.setState({success : "Server configuration have been updated"});
    }

    render() {

        var settingPageView = this.props.page.state.view.split(".");
        settingPageView.pop();
        var settingPage = sitemap.getPageFromView(settingPageView.join('.'));
        return (
            <main className="container-fluid">
                <Alert title="Success:" message={this.state.success} type="success"/>
                <section className="row">
                    <aside className="col-md-2 sidebar">
                        <Menu pages={ settingPage.pages } styleClass="nav navbar-nav"/>
                    </aside>
                    <section className="col-md-10 main">
                        <h1 className="page-header">Server configuration</h1>

                        <Form schema={schema}
                              uiSchema={uiSchema}
                              liveValidate={true}
                              onSubmit={ data => this.saveToStore(data.formData) }
                              formData={this.props.neo4j}
                              className={"horizontal" }/>
                    </section>
                </section>
            </main>
        )
    }
}
export default PageEnhancer(branch({neo4j: ['neo4j']}, SettingsServer));
