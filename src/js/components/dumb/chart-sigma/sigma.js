import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import Immutable from "immutable";
import _ from "lodash";
import {mergeDeep} from '~/services/utils';
import "sigma/src/sigma.core.js";
import "sigma/src/conrad.js";
import "sigma/src/utils/sigma.utils.js";
import "sigma/src/utils/sigma.polyfills.js";
import "sigma/src/sigma.settings.js";
import "sigma/src/classes/sigma.classes.dispatcher.js";
import "sigma/src/classes/sigma.classes.configurable.js";
import "sigma/src/classes/sigma.classes.graph.js";
import "sigma/src/classes/sigma.classes.camera.js";
import "sigma/src/classes/sigma.classes.quad.js";
import "sigma/src/classes/sigma.classes.edgequad.js";
import "sigma/src/captors/sigma.captors.mouse.js";
import "sigma/src/captors/sigma.captors.touch.js";
import "sigma/src/renderers/sigma.renderers.def.js";
import "sigma/src/renderers/sigma.renderers.svg.js";
import "sigma/src/renderers/sigma.renderers.canvas.js";
import "sigma/src/renderers/sigma.renderers.webgl.js";
import "sigma/src/renderers/webgl/sigma.webgl.nodes.def.js";
import "sigma/src/renderers/webgl/sigma.webgl.nodes.fast.js";
import "sigma/src/renderers/webgl/sigma.webgl.edges.def.js";
import "sigma/src/renderers/webgl/sigma.webgl.edges.fast.js";
import "sigma/src/renderers/webgl/sigma.webgl.edges.arrow.js";
import "sigma/src/renderers/canvas/sigma.canvas.labels.def.js";
import "sigma/src/renderers/canvas/sigma.canvas.hovers.def.js";
import "sigma/src/renderers/canvas/sigma.canvas.nodes.def.js";
import "sigma/src/renderers/canvas/sigma.canvas.edges.def.js";
import "sigma/src/renderers/canvas/sigma.canvas.edges.curve.js";
import "sigma/src/renderers/canvas/sigma.canvas.edges.arrow.js";
import "sigma/src/renderers/canvas/sigma.canvas.edges.curvedArrow.js";
import "sigma/src/renderers/canvas/sigma.canvas.edgehovers.def.js";
import "sigma/src/renderers/canvas/sigma.canvas.edgehovers.curve.js";
import "sigma/src/renderers/canvas/sigma.canvas.edgehovers.arrow.js";
import "sigma/src/renderers/canvas/sigma.canvas.edgehovers.curvedArrow.js";
import "sigma/src/renderers/canvas/sigma.canvas.extremities.def.js";
import "sigma/src/renderers/svg/sigma.svg.utils.js";
import "sigma/src/renderers/svg/sigma.svg.nodes.def.js";
import "sigma/src/renderers/svg/sigma.svg.edges.def.js";
import "sigma/src/renderers/svg/sigma.svg.edges.curve.js";
import "sigma/src/renderers/svg/sigma.svg.labels.def.js";
import "sigma/src/renderers/svg/sigma.svg.hovers.def.js";
import "sigma/src/middlewares/sigma.middlewares.rescale.js";
import "sigma/src/middlewares/sigma.middlewares.copy.js";
import "sigma/src/misc/sigma.misc.animation.js";
import "sigma/src/misc/sigma.misc.bindEvents.js";
import "sigma/src/misc/sigma.misc.bindDOMEvents.js";
import "sigma/src/misc/sigma.misc.drawHovers.js";
import "sigma/plugins/sigma.renderers.edgeLabels/sigma.canvas.edges.labels.def.js";
import "sigma/plugins/sigma.plugins.animate/sigma.plugins.animate.js";
import "sigma/plugins/sigma.plugins.dragNodes/sigma.plugins.dragNodes.js"
import "linkurious/plugins/sigma.layouts.forceLink/worker.js"
import "linkurious/plugins/sigma.layouts.forceLink/supervisor.js"
import "linkurious/plugins/sigma.layouts.noverlap/sigma.layouts.noverlap.js"
import "./style.less";

/**
 * Create a Sigma graph.
 *
 * <Sigma />
 */
class ReactSigma extends Component {

    // Declare props types
    static propTypes = {
        graph: React.PropTypes.object.isRequired,
        style: React.PropTypes.object,
        defaultNodeStyle : React.PropTypes.object,
        defaultEdgeStyle : React.PropTypes.object,
        options: React.PropTypes.object,
        events: React.PropTypes.object
    };

    // Declare default properties
    static defaultProps = {
        style: { labels: {}, edges: {}},
        defaultNodeStyle: {
            color: '#000000',
            size: '5',
        },
        defaultEdgeStyle: {
            color: '#000000',
            size: '0.5',
        },
        options: {},
        events: {}
    };

    /**
     * Constructor.
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {id: _.uniqueId('sigma')};
        this.defaultEvent = {
            clickStage: (func) => {
                return (e) => {return func() };
            },
            doubleClickStage: (func) => {
                return (e) => {return func() };
            },
            rightClickStage: (func) => {
                return (e) => {return func() };
            },
            clickNode: (func) => {
                return (e) => {return func(e.data.node) };
            },
            doubleClickNode: (func) => {
                return (e) => {return func(e.data.node) };
            },
            rightClickNode: (func) => {
                return (e) => {return func(e.data.node) };
            },
            overNode: (func) => {
                return (e) => {return func(e.data.node) };
            },
            outNode: (func) => {
                return (e) => {return func(e.data.node) };
            },
            clickEdge:(func) => {
                return (e) => {return func(e.data.edge) };
            },
            doubleClickEdge: (func) => {
                return (e) => {return func(e.data.edge) };
            },
            rightClickEdge: (func) => {
                return (e) => {return func(e.data.edge) };
            },
            overEdge: (func) => {
                return (e) => {return func(e.data.edge) };
            },
            outEdge: (func) => {
                return (e) => {return func(e.data.edge) };
            },
        };
    }

    /**
     * After mounting component, we init sigmaJS and populate it's graph model.
     */
    componentDidMount() {
        // init sigmaJS
        this._initSigmaJS();
        // register events
        this._registerSigmaEvent();
        // update graph
        this._updateSigmaGraph(this.props.graph, this.props.style);
        // start layout algo
        this.layoutAlgo = sigma.layouts.startForceLink(this.sigma, {autoStop:true, alignNodeSiblings:true, avgDistanceThreshold:0.01});
        // allow drg node
        this.dragListener = new sigma.plugins.dragNodes(this.sigma, this.sigma.renderers[0]);
    }

    /**
     * After mounting on props change, we just populate/update sigmaJS graph model.
     */
    componentDidUpdate(prevProps, prevState) {
        // update settings
        this.sigma.settings(this.props.options);
        // register events
        this._registerSigmaEvent();
        // update graph
        this._updateSigmaGraph(this.props.graph, this.props.style);
        // start layout algo
        this.layoutAlgo = sigma.layouts.startForceLink(this.sigma, {autoStop:true, alignNodeSiblings:true, avgDistanceThreshold:0.01});
        // allow drg node
        this.dragListener = new sigma.plugins.dragNodes(this.sigma, this.sigma.renderers[0]);
    }

    /**
     * On unmount, we kill sigmaJS.
     */
    componentWillUnmount() {
        this.sigma.kill();
    }

    /**
     * Function to initialize an empty sigmaJS with some settings.
     * @private
     */
    _initSigmaJS() {
        // init sigmajs
        var container = document.getElementById(this.state.id);
        this.sigma = new sigma({
            id: this.state.id,
            graph: { nodes: [], edges: []},
            renderer: {
                container: container,
                type: 'canvas'
            },
            settings: this.props.options
        });
    }

    /**
     * Update sigmJS graph model.
     * @private
     */
    _updateSigmaGraph() {
        // init the new graph model
        var newSigmaGraph = {nodes: [], edges: []};

        // Transform all node to sigma nodes
        newSigmaGraph.nodes = this.props.graph.nodes.map((node) => {
            var tNode = Immutable.Map(node)
                .set('x', Math.random())
                .set('y', Math.random());

            // If it already exist, we just take its coordinate
            var previousNode = this.sigma.graph.nodes(node.id);
            if (previousNode) {
                tNode = tNode
                    .set('x', previousNode.x)
                    .set('y', previousNode.y);
            }

            return this._applyNodeStyle(tNode).toObject();
        });

        // Transform all edged to sigma edges
        newSigmaGraph.edges = this.props.graph.edges.map((edge) => {
            var tEdge = Immutable.Map(edge);

            return this._applyEdgeStyle(tEdge).toObject();
        });

        this.sigma.graph.clear();
        this.sigma.graph.read(newSigmaGraph);
        this.sigma.refresh();
    }

    _registerSigmaEvent() {
        for(var key in this.defaultEvent) {
            this.sigma.unbind(key);
            if(this.props.events[key]) {
                this.sigma.bind(key, this.defaultEvent[key](this.props.events[key]));
            }
            else {
                this.sigma.bind(key, this.defaultEvent[key]((data)=>{}));
            }
        }
    }

    /**
     * Apply style on a Map node.
     *
     * @param node {Map}
     * @return node {Map}
     * @private
     */
    _applyNodeStyle(node) {
        // Apply default style
        var tNode = node
            .set('size', this.props.defaultNodeStyle.size)
            .set('color', this.props.defaultNodeStyle.color)
            .set('label', node.get('id'));

        // Apply style per labels
        tNode.get('labels').forEach(label => {
            let style = this.props.style.labels[label];

            if(style && style.size)
                tNode = tNode.set('size', style.size)

            if(style && style.color)
                tNode = tNode.set('color', style.color);

            if(style && style.label && tNode.get('properties'))
                tNode = tNode.set('label', tNode.get('properties')[style.label]);

        });

        return tNode;
    }

    /**
     * Apply style on a Map edge.
     *
     * @param edge {Map}
     * @return edge {Map}
     * @private
     */
    _applyEdgeStyle(edge) {
        // Apply default style
        var tEdge = edge
            .set('size', this.props.defaultEdgeStyle.size)
            .set('color', this.props.defaultEdgeStyle.color)
            .set('label', edge.get('type'));

        // Apply style per labels
        let style = this.props.style.edges[edge.type];

        if(style && style.size)
            tEdge = tEdge.set('size', style.size)

        if(style && style.color)
            tEdge = tEdge.set('color', style.color);

        if(style && style.label && tEdge.get('properties'))
            tEdge = tEdge.set('label', tEdge.get('properties')[style.label]);

        return tEdge;
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
