import React, {Component, PropTypes} from "react";
import {PageEnhancer} from "~/enhancer/page";
import {branch} from "baobab-react/higher-order";
import QueryContainer from "~/components/smart/query-container";
import ReactSigma from "~/components/dumb/chart-sigma/sigma";
import Donut from "~/components/dumb/chart-donut/donut";

class Home extends Component {

    static propTypes = {
        page: React.PropTypes.object.isRequired
    };

    render() {
        return (
        <main className="container-fluid">
            <aside className="col-md-2 sidebar">
                //some stats here
                <Donut title="Labels" strokeWidth={10} data={this.props.labels}  animation="10s" size={100}/>
                <Donut title="Relationships" strokeWidth={10} data={this.props.edges}  animation="1s" size={100}/>
            </aside>
            <section className="col-md-10 main">
                <ReactSigma options={this.props.sigmaOptions} graph={this.props.graph}/>
                <QueryContainer />
            </section>
        </main>
        )
    }
}

export default PageEnhancer(
    branch(
        {
            sigmaOptions: ['settings', 'sigma'],
            labels: ['data', 'facets', 'labels'],
            graph: ['data', 'graph'],
            properties: ['data', 'facets', 'properties'],
            edges: ['data', 'facets', 'edges']
        },
        Home
    )
);
