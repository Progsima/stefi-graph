import React, {Component, PropTypes} from "react";
import {PageEnhancer} from "~/enhancer/page";
import Menu from "~/pages/layout/menu";

class Settings extends Component {

    static propTypes = {
        page: React.PropTypes.object.isRequired
    };

    render() {
        return (
            <main className="container-fluid">
                <section className="row">
                    <aside className="col-md-2 sidebar">
                        <Menu pages={ this.props.page.pages}/>
                    </aside>
                    <section className="col-md-10 main">
                        <h1 className="page-header">Settings</h1>
                    </section>
                </section>
            </main>
        )
    }
}

export default PageEnhancer(Settings)
