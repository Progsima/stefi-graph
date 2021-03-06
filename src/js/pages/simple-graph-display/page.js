import React, {Component, PropTypes} from "react";
import {PageEnhancer} from "~/enhancer/page";
import {branch} from "baobab-react/higher-order";
import QueryContainer from "~/components/query/container/component";
import GraphFacetLabel from "~/components/graph/facet-label/component";
import GraphEditObject from "~/components/graph/edit-object/component";
import ContextMenu from "~/components/graph/context-menu/component";
import GraphFacetEdge from "~/components/graph/facet-edge/component";
import ReactSigma from "~/components/graph/sigma/component";
import GraphDisplayObject from "~/components/graph/display-object/component";
import Wizard from "~/components/wizard/component";
import "./style.less";

class SimpleGraphDisplay extends Component {

  static propTypes = {
    page: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      data:{}
    };
  }

  render() {

    return (
      <main id="full-graph" className="container-fluid">
        <section className="col-md-12 main">
          <GraphDisplayObject />
          <ReactSigma
          options={this.props.sigmaOptions}
            graph={this.props.graph}
            selected={this.props.selected}
            layout={this.props.layoutOptions}
            style={this.props.style}
            runLayout={this.props.runGraphLayout}>
          </ReactSigma>
        </section>
      </main>
    )
  }
}

export default PageEnhancer(
  branch(
    {
      sigmaOptions: ['settings', 'sigma'],
      style: ['settings','style'],
      layoutOptions: ['settings', 'layout'],
      graph: ['data', 'graph'],
      runGraphLayout: ['data', 'runLayout'],
      facetLabel: ['data', 'facets', 'labels'],
      facetEdge: ['data', 'facets', 'edges'],
      selected: ['data', 'selected']
    },
    SimpleGraphDisplay
  )
);
