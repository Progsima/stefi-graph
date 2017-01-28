import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import Immutable from "immutable";
import _ from "lodash";
import {mergeDeep} from "~/services/utils";
import * as action from "../actions";
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
import "sigma/src/captors/sigma.captors.touch.js";
import "./sigma.captors.mouse.js";
import "sigma/src/renderers/sigma.renderers.canvas.js";
import "sigma/src/renderers/sigma.renderers.svg.js";
import "sigma/src/renderers/sigma.renderers.webgl.js";
import "sigma/src/renderers/sigma.renderers.def.js";
import "sigma/src/renderers/canvas/sigma.canvas.labels.def.js";
import "sigma/src/renderers/canvas/sigma.canvas.hovers.def.js";
import "./sigma.canvas.nodes.def.js";
import "./sigma.canvas.edges.def.js";
import "sigma/src/renderers/canvas/sigma.canvas.edgehovers.def.js";
import "sigma/src/renderers/canvas/sigma.canvas.extremities.def.js";
import "sigma/src/middlewares/sigma.middlewares.rescale.js";
import "sigma/src/middlewares/sigma.middlewares.copy.js";
import "sigma/src/misc/sigma.misc.animation.js";
import "sigma/src/misc/sigma.misc.bindEvents.js";
import "sigma/src/misc/sigma.misc.bindDOMEvents.js";
import "sigma/src/misc/sigma.misc.drawHovers.js";
import "sigma/plugins/sigma.plugins.dragNodes/sigma.plugins.dragNodes.js";
import "sigma/plugins/sigma.renderers.edgeLabels/sigma.canvas.edges.labels.def.js";
import "sigma/plugins/sigma.plugins.animate/sigma.plugins.animate.js";
import "sigma/plugins/sigma.layout.forceAtlas2/worker.js";
import "sigma/plugins/sigma.layout.forceAtlas2/supervisor.js";
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
    selected: React.PropTypes.array.isRequired,
    style: React.PropTypes.object,
    defaultNodeStyle: React.PropTypes.object,
    defaultEdgeStyle: React.PropTypes.object,
    options: React.PropTypes.object,
    layout: React.PropTypes.object,
    events: React.PropTypes.object,
    runLayout: React.PropTypes.bool
  };

  // Declare default properties
  static defaultProps = {
    style: {labels: {}, edges: {}},
    defaultNodeStyle: {
      color: '#000000',
      size: '5',
    },
    defaultEdgeStyle: {
      color: '#000000',
      size: '0.5',
    },
    options: {},
    events: {},
    runLayout: true
  };

  /**
  * Constructor.
  *
  * @param props
  */
  constructor(props) {
    super(props);
    this.props.selectedNode;
    this.state = {id: _.uniqueId('sigma')};
    this.supportedEvents = [
      "clickStage",
      "doubleClickStage",
      "rightClickStage",
      "clickNode",
      "doubleClickNode",
      "rightClickNode",
      "overNode",
      "outNode",
      "clickEdge",
      "doubleClickEdge",
      "rightClickEdge",
      "overEdge",
      "outEdge"
    ];
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
    if(this.props.runLayout)
      this._eventLayoutStart(true);
    // allow drag node
    this.dragListener = new sigma.plugins.dragNodes(this.sigma, this.sigma.renderers[0]);
  }

  /**
  * If no config or data is changed, then no new render...
  */
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  /**
  * After mounting on props change, we just populate/update sigmaJS graph model.
  */
  componentDidUpdate(prevProps, prevState) {
    // kill layout
    this.sigma.killForceAtlas2();
    // update settings
    this.sigma.settings(this.props.options);
    // allow drag node
    this.dragListener = new sigma.plugins.dragNodes(this.sigma, this.sigma.renderers[0]);
    // register events
    this._registerSigmaEvent();
    // update graph
    this._updateSigmaGraph(this.props.graph, this.props.style);
    // start layout algo
    if(this.props.runLayout){
      this._eventLayoutStart(true);
    }
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
      graph: {nodes: [], edges: []},
      renderer: {
        container: container,
        type: 'canvas'
      },
      settings: this.props.options
    });
    //prevent default event for context menu & double click
    container.addEventListener('contextmenu', event => { event.preventDefault() });
    container.addEventListener('dblclick', event => { event.preventDefault() });
    container.addEventListener('click', event => { event.preventDefault() });
  }

  /**
  * Update sigmJS graph model.
  * @private
  */
  _updateSigmaGraph() {
    // init the new graph model
    var newSigmaGraph = {nodes: [], edges: []};

    // Transform all node to sigma nodes
    newSigmaGraph.nodes = Object.keys(this.props.graph.nodes).map((nodeId) => {
      var tNode = Immutable.Map(this.props.graph.nodes[nodeId])
      .set('x', Math.random())
      .set('y', Math.random());

      // If it already exist, we just take its coordinate
      var previousNode = this.sigma.graph.nodes(nodeId);
      if (previousNode) {
        tNode = tNode
        .set('x', previousNode.x)
        .set('y', previousNode.y);
      }

      // If node is selected
      if (this.props.selected.some((e) => { return (e.id == nodeId)})) {
        tNode = tNode.set('selected', true);
      }else {
        tNode = tNode.set('selected', false);
      }

      return this._applyNodeStyle(tNode).toObject();
    });

    // Transform all edged to sigma edges
    newSigmaGraph.edges = Object.keys(this.props.graph.edges).map((edgeId) => {
      var tEdge = Immutable.Map(this.props.graph.edges[edgeId]);
      return this._applyEdgeStyle(tEdge).toObject();
    });

    this.sigma.graph.clear();
    this.sigma.graph.read(newSigmaGraph);
    this.sigma.refresh();
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
      // Look if there is a defined style
      let style = this.props.style.labels[label];
      if(style) {
        if (style.hidden)
          tNode = tNode.set('hidden', true)
        // apply node size
        if (style.size)
          tNode = tNode.set('size', style.size)
        // apply node color
        if (style.color)
          tNode = tNode.set('color', style.color);
        // apply node icon
        if (style.icon)
          tNode = tNode.set('icon', style.icon);
        // apply node icon
        if (style.image)
          tNode = tNode.set('image', style.image);
        // apply node label
        if (style.label && style.label != '<id>' && tNode.get('properties'))
          tNode = tNode.set('label', tNode.get('properties')[style.label]);
      }
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

    // Look if there is a defined style for the edge type
    let style = this.props.style.edges[edge.get('type')];
    if(style) {
      if (style.hidden)
        tEdge = tEdge.set('hidden', true)
      // Apply edge size
      if (style.size)
        tEdge = tEdge.set('size', style.size)
      // Apply edge color
      if (style.color)
        tEdge = tEdge.set('color', style.color);
      // Apply edge label
      if (style.label && style.label != '<type>' && tEdge.get('properties'))
        tEdge = tEdge.set('label', tEdge.get('properties')[style.label]);
    }
    return tEdge;
  }

  _registerSigmaEvent() {
    this.sigma.unbind();
    this.sigma.bind("click", (e) => {
      this.props.dispatch(action.setRightClick, null, null, null);
    });
    this.sigma.bind("overNode", (e) => {
      this.props.dispatch(action.setOverObject, JSON.parse(JSON.stringify(e.data.node)));
    });
    this.sigma.bind("outNode", (e) => {
      this.props.dispatch(action.setOverObject, null);
    });
    this.sigma.bind("clickNode", (e) => {
      if(!e.data.captor.isDragging)
        this.props.dispatch(action.setClickNode, JSON.parse(JSON.stringify(e.data.node)));
    });
    this.sigma.bind("doubleClickNode", (e) => {
        this.props.dispatch(action.setClickNode, JSON.parse(JSON.stringify(e.data.node)));
    });
    this.sigma.bind("rightClickNode", (e) => {
      this.props.dispatch(action.setRightClick, 'node',  JSON.parse(JSON.stringify(e.data.node)), e.data.captor);
    });
    this.sigma.bind("overEdge", (e) => {
      this.props.dispatch(action.setOverObject, JSON.parse(JSON.stringify(e.data.edge)));
    });
    this.sigma.bind("outEdge", (e) => {
      this.props.dispatch(action.setOverObject, null);
    });
  }

  _eventZoomIn() {
    sigma.misc.animation.camera(
      this.sigma.cameras[0],
      {ratio: this.sigma.cameras[0].ratio / 1.5},
      {duration: 150}
    );
  }

  _eventZoomOut() {
    sigma.misc.animation.camera(
      this.sigma.cameras[0],
      {ratio: this.sigma.cameras[0].ratio * 1.5},
      {duration: 150}
    );
  }

  _eventRotateLeft() {
    sigma.misc.animation.camera(
      this.sigma.cameras[0],
      {angle : this.sigma.cameras[0].angle + 0.05},
      {duration: 150}
    );
  }

  _eventRotateRight() {
    sigma.misc.animation.camera(
      this.sigma.cameras[0],
      {angle : this.sigma.cameras[0].angle - 0.05},
      {duration: 150}
    );
  }

  _eventCenter() {
    sigma.misc.animation.camera(
      this.sigma.cameras[0],
      {x: 0, y: 0, angle: this.sigma.cameras[0].angle, ratio: 1.2},
      {duration: 150}
    );
  }

  _eventLayoutStart(autoStop){
    var config = _.clone(this.props.layout, true);
    if(autoStop) {
      config.autoStop = true;
    }
    else {
      config.autoStop = false;
    }
    this.layoutAlgo = this.sigma.startForceAtlas2();
  }

  _eventLayoutStop(){
    this.sigma.stopForceAtlas2();
  }

  /**
  * Render phase
  */
  render() {
    return (
      <div id={this.state.id} className={'sigma-container'}>
        <div className="graph-tools">

          <button title="Resize graph to see all"
            onClick={e => this._eventCenter()} >
            <i className="fa fa-bullseye"></i>
          </button>

          <button title="Zoom in"
            onClick={e => this._eventZoomIn()}>
            <i className="fa fa-plus"></i>
          </button>
          <button title="Zoom out"
            onClick={e => this._eventZoomOut()}>
            <i className="fa fa-minus"></i>
          </button>
          <button title="Rotation right"
            onClick={e => this._eventRotateRight()}>
            <i className="fa fa-rotate-right"></i>
          </button>
          <button title="Rotation left"
            onClick={e => this._eventRotateLeft()}>
            <i className="fa fa-rotate-left"></i>
          </button>
          <button title="Start layout algo"
            onClick={e => this._eventLayoutStart(false)}>
            <i className="fa fa-play"></i>
          </button>
          <button title="Stop layout algo"
            onClick={e => this._eventLayoutStop()}>
            <i className="fa fa-stop"></i>
          </button>
        </div>
      </div>
    )
  }
}

export default branch( { }, ReactSigma );
