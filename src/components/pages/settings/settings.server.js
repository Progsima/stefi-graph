import React, {Component, PropTypes} from "react";
import {PageEnhancer} from "./../../../enhancer/page";
import * as sitemap from "./../../../actions/sitemap";
import Menu from "./../../layout/menu";

class SettingsServer extends Component {


    render() {

        var settingPageView =  this.props.page.state.view.split(".");
        settingPageView.pop();
        var settingPage =sitemap.getPageFromView(settingPageView.join('.'));
        return (
            <main className="container-fluid">
                <section className="row">
                    <aside className="col-md-2 sidebar">
                        <Menu pages={ settingPage.pages } styleClass="nav navbar-nav" />
                    </aside>
                    <section className="col-md-10 main">
                        <h1 className="page-header">Settings > Server</h1>
                    </section>
                </section>
            </main>
        )
    }
}

export default PageEnhancer(SettingsServer)
