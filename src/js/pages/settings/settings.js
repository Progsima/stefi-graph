import React, {Component, PropTypes} from "react";
import {PageEnhancer} from "~/enhancer/page";

class Settings extends Component {

    static propTypes = {
        page: React.PropTypes.object.isRequired
    };

    render() {
        return (
            <main className="container-fluid">
                <section className="row">
                    <aside className="col-md-2 sidebar">

                    </aside>
                    <section className="col-md-10 main">
                        <h1 className="page-header">{this.props.page.title}</h1>
                    </section>
                </section>
            </main>
        )
    }
}

export default PageEnhancer(Settings)
