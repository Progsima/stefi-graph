import React, {Component, PropTypes} from "react";
import {PageEnhancer} from "~/enhancer/page";
import {branch} from "baobab-react/higher-order";
import QueryContainer from "~/components/query-container";
import ReactSigma from "~/components/charts/sigma/sigma";

class Home extends Component {

    static propTypes = {
        page: React.PropTypes.object.isRequired
    };

    render() {
        return (
        <main className="container-fluid">
            <aside className="col-md-2 sidebar">
                //some stats here
            </aside>
            <section className="col-md-10 main">
                <ReactSigma options={this.props.sigmaOptions} />
                <QueryContainer />
            </section>
        </main>
        )
    }
}

export default PageEnhancer(branch({sigmaOptions: ['settings', 'sigma']}, Home));
