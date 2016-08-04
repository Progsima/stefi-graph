import React, {Component, PropTypes} from 'react';
import {branch} from 'baobab-react/higher-order';
import Immutable from 'immutable';
import _ from 'lodash';
import './style.less';
import 'sigma/src/sigma.core.js';
import 'sigma/src/conrad.js';
import 'sigma/src/utils/sigma.utils.js';
import 'sigma/src/utils/sigma.polyfills.js';
import 'sigma/src/sigma.settings.js';
import 'sigma/src/classes/sigma.classes.dispatcher.js';
import 'sigma/src/classes/sigma.classes.configurable.js';
import 'sigma/src/classes/sigma.classes.graph.js';
import 'sigma/src/classes/sigma.classes.camera.js';
import 'sigma/src/classes/sigma.classes.quad.js';
import 'sigma/src/classes/sigma.classes.edgequad.js';
import 'sigma/src/captors/sigma.captors.mouse.js';
import 'sigma/src/captors/sigma.captors.touch.js';
import 'sigma/src/renderers/sigma.renderers.canvas.js';
import 'sigma/src/renderers/sigma.renderers.webgl.js';
import 'sigma/src/renderers/sigma.renderers.svg.js';
import 'sigma/src/renderers/sigma.renderers.def.js';
import 'sigma/src/renderers/webgl/sigma.webgl.nodes.def.js';
import 'sigma/src/renderers/webgl/sigma.webgl.nodes.fast.js';
import 'sigma/src/renderers/webgl/sigma.webgl.edges.def.js';
import 'sigma/src/renderers/webgl/sigma.webgl.edges.fast.js';
import 'sigma/src/renderers/webgl/sigma.webgl.edges.arrow.js';
import 'sigma/src/renderers/canvas/sigma.canvas.labels.def.js';
import 'sigma/src/renderers/canvas/sigma.canvas.hovers.def.js';
import 'sigma/src/renderers/canvas/sigma.canvas.nodes.def.js';
import 'sigma/src/renderers/canvas/sigma.canvas.edges.def.js';
import 'sigma/src/renderers/canvas/sigma.canvas.edges.curve.js';
import 'sigma/src/renderers/canvas/sigma.canvas.edges.arrow.js';
import 'sigma/src/renderers/canvas/sigma.canvas.edges.curvedArrow.js';
import 'sigma/src/renderers/canvas/sigma.canvas.edgehovers.def.js';
import 'sigma/src/renderers/canvas/sigma.canvas.edgehovers.curve.js';
import 'sigma/src/renderers/canvas/sigma.canvas.edgehovers.arrow.js';
import 'sigma/src/renderers/canvas/sigma.canvas.edgehovers.curvedArrow.js';
import 'sigma/src/renderers/canvas/sigma.canvas.extremities.def.js';
import 'sigma/src/renderers/svg/sigma.svg.utils.js';
import 'sigma/src/renderers/svg/sigma.svg.nodes.def.js';
import 'sigma/src/renderers/svg/sigma.svg.edges.def.js';
import 'sigma/src/renderers/svg/sigma.svg.edges.curve.js';
import 'sigma/src/renderers/svg/sigma.svg.labels.def.js';
import 'sigma/src/renderers/svg/sigma.svg.hovers.def.js';
import 'sigma/src/middlewares/sigma.middlewares.rescale.js';
import 'sigma/src/middlewares/sigma.middlewares.copy.js';
import 'sigma/src/misc/sigma.misc.animation.js';
import 'sigma/src/misc/sigma.misc.bindEvents.js';
import 'sigma/src/misc/sigma.misc.bindDOMEvents.js';
import 'sigma/src/misc/sigma.misc.drawHovers.js';
import 'sigma/plugins/sigma.renderers.edgeLabels/sigma.canvas.edges.labels.def.js';
import 'sigma/plugins/sigma.layout.forceAtlas2/worker.js';
import 'sigma/plugins/sigma.layout.forceAtlas2/supervisor.js';

/**
 * Create a Sigma graph.
 *
 * <Sigma />
 */
class ReactSigma extends Component {

    // Declare props types
    static propTypes = {
        graph: React.PropTypes.object,
        options: React.PropTypes.object,
    };

    // Declare default properties
    static defaultProps = {
        options: {}
    };

    /**
     * Constructor.
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {id: _.uniqueId('sigma')};
    }

    componentDidMount() {
        // init sigmajs
        var container = document.getElementById(this.state.id);
        this.sigma = new sigma({
            id: this.state.id,
            graph: { nodes:[], edges:[]},
            renderer: {
                container: container,
                type: 'canvas'
            },
            settings:this.props.options
        });
    }

    componentDidUpdate(prevProps, prevState) {
        var graph = { nodes:[], edges:[]};

        // Iterate on all nodes
        graph.nodes = this.props.graph.nodes.map((node) => {
            if(this.sigma.graph.nodes(node.id)) {
                return this.sigma.graph.nodes(node.id);
            }
            else {
                return Immutable.Map(node)
                    .set('x', Math.random())
                    .set('y', Math.random())
                    .set('size', 5)
                    .toObject();
            }
        });

        // Iterate on all edges
        graph.edges = this.props.graph.edges.map((edge) => {
            if(this.sigma.graph.edges(edge.id)) {
                return this.sigma.graph.edges(edge.id);
            }
            else {
                return Immutable.Map(edge)
                    .set('size', 0.5)
                    .toObject();
            }
        });

        this.sigma.graph.clear();
        this.sigma.graph.read(graph);
        this.sigma.refresh();
    }

    /**
     * Render phase
     */
    render() {
        return (
            <div id={this.state.id} className={'sigma-container'}>
            </div>
        )
    }
}

export default ReactSigma;
