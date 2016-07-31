import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import Form from "react-jsonschema-form";
import {PageEnhancer} from "~/enhancer/page";
import * as sitemap from "~/actions/sitemap";
import * as action from "~/actions/settings";
import Menu from "~/pages/layout/menu";
import Alert from "~/components/alert/alert";

const schema = {
    type: "object",
    required: [
        "logLevel",
        "queryHistorySize",
        "baobabHistorySize"
    ],
    properties: {
        "logLevel": {
            type: "string",
            title: "Logging level",
            enum: ["error", "info", "warning", "debug"],
            enumNames: ["Error", "Info", "Warning", "Debug"]
        },
        "queryHistorySize": {
            type: "number",
            title: "Query history size",
            minimum: 0,
            maximum: 100
        },
        "baobabHistorySize": {
            type: "number",
            title: "Action history size",
            minimum: 0,
            maximum: 100
        }
    }
};

const uiSchema = {
    "logLevel": {
    },
    "queryHistorySize": {
        "ui:widget": "updown"
    },
    "baobabHistorySize": {
        "ui:widget": "updown"
    }
};

class SettingsAdvanced extends Component {

    constructor(props) {
        super(props);
        this.state = {alerts:[]}
    }

    saveToStore(data){
        this.props.dispatch( action.saveSettingsAdvanced, data);

        this.setState({
            alerts: this.state.alerts.concat([{
                title: "Success: ",
                message: "Advanced configuration has been successfully updated",
                type : "success"
            }])
        });
    }

    render() {
        var settingPageView = this.props.page.state.view.split(".");
        settingPageView.pop();
        var settingPage = sitemap.getPageFromView(settingPageView.join('.'));

        return (
            <main className="container-fluid">
                <div id="alert">
                    {this.state.alerts.map( (alert, index) => {
                        return <Alert key={index} title={alert.title} message={alert.message} type={alert.type} />
                    })}
                </div>
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
                              formData={this.props.settings}
                              className={"horizontal" }/>
                    </section>
                </section>
            </main>
        )
    }
}
export default PageEnhancer(branch({settings: ['settings', 'advanced']}, SettingsAdvanced));
