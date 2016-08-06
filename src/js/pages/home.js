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

    constructor(props) {
        super(props);
        this.style = {
            labels: {
                'Person': {
                    color: '#00d9ff',
                    size: '5',
                    label: 'name'
                },
                'Movie': {
                    color: '#1583e3',
                    size: '10',
                    label: 'title'
                }
            },
            edges: {
                'ACTED_IN': {
                    color: '#000000',
                    size: '0.5',
                    label: 'roles'
                },
                'DIRECTED': {
                    color: '#000000',
                    size: '0.5'
                }
            }
        };
    }

    render() {
        return (
            <main className="container-fluid">
                <aside className="col-md-2 sidebar">
                    //some stats here
                    <Donut title="Labels" strokeWidth={10} data={this.props.labels} animation="10s" size={100}/>
                    <Donut title="Relationships" strokeWidth={10} data={this.props.edges} animation="1s" size={100}/>
                </aside>
                <section className="col-md-10 main">
                    <ReactSigma options={this.props.sigmaOptions} graph={this.props.graph} style={this.style} />
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
