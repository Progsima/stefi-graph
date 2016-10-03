import React, {Component, PropTypes} from "react";
import {PageEnhancer} from "~/enhancer/page";
import {branch} from "baobab-react/higher-order";
import Chart from "react-chartjs";
import QueryContainer from "~/components/smart/query-container";
import ReactSigma from "~/components/dumb/chart-sigma/sigma";
import DisplayObject from "~/components/smart/displayObject";
import * as action from "~/actions/graph";

class Home extends Component {

    static propTypes = {
        page: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            data:{}
        };
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

    ComponentDidMount() {
        this.props.dispatch(action.disabledRefresh);
    }
    componentDidUpdate(prevProps, prevState) {
        this.props.dispatch(action.disabledRefresh);
    }

    render() {
        var events = {
            overNode: (e) => {
                this.setState({data: e.data.node});
            },
            outNode: (e) => {
                this.setState({data: {} });
            },
            overEdge: (e) => {
                this.setState({data: e.data.edge});
            },
            outEdge: (e) => {
                this.setState({data: {} });
            }
        };

        return (
            <main className="container-fluid">
                <aside className="col-md-2 sidebar">

                    <DisplayObject object={this.state.data} />
                    <h3>Labels</h3>
                    <Chart.Doughnut data={this.props.facetLabel} width="200" height="200"/>
                    <h3>Edges</h3>
                    <Chart.Doughnut data={this.props.facetEdge} width="200" height="200"/>
                </aside>
                <section className="col-md-10 main">
                    <ReactSigma options={this.props.sigmaOptions}
                                graph={this.props.graph}
                                style={this.style}
                                events={events}
                                layout={this.props.layoutOptions}
                                refresh={this.props.refreshGraph}>
                    </ReactSigma>
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
            layoutOptions: ['settings', 'layout'],
            graph: ['data', 'graph'],
            refreshGraph: ['data', 'refresh'],
            facetLabel: ['data', 'facets', 'labels'],
            facetEdge: ['data', 'facets', 'edges'],
        },
        Home
    )
);
