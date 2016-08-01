import React, {Component, PropTypes} from "react";
import {branch} from 'baobab-react/higher-order';
import _ from "lodash";
import "./sigma.less";

import "sigma/src/sigma.core.js"
import "sigma/src/conrad.js"
import "sigma/src/utils/sigma.utils.js"
import "sigma/src/utils/sigma.polyfills.js"
import "sigma/src/sigma.settings.js"
import "sigma/src/classes/sigma.classes.dispatcher.js"
import "sigma/src/classes/sigma.classes.configurable.js"
import "sigma/src/classes/sigma.classes.graph.js"
import "sigma/src/classes/sigma.classes.camera.js"
import "sigma/src/classes/sigma.classes.quad.js"
import "sigma/src/classes/sigma.classes.edgequad.js"
import "sigma/src/captors/sigma.captors.mouse.js"
import "sigma/src/captors/sigma.captors.touch.js"
import "sigma/src/renderers/sigma.renderers.canvas.js"
import "sigma/src/renderers/sigma.renderers.webgl.js"
import "sigma/src/renderers/sigma.renderers.svg.js"
import "sigma/src/renderers/sigma.renderers.def.js"
import "sigma/src/renderers/webgl/sigma.webgl.nodes.def.js"
import "sigma/src/renderers/webgl/sigma.webgl.nodes.fast.js"
import "sigma/src/renderers/webgl/sigma.webgl.edges.def.js"
import "sigma/src/renderers/webgl/sigma.webgl.edges.fast.js"
import "sigma/src/renderers/webgl/sigma.webgl.edges.arrow.js"
import "sigma/src/renderers/canvas/sigma.canvas.labels.def.js"
import "sigma/src/renderers/canvas/sigma.canvas.hovers.def.js"
import "sigma/src/renderers/canvas/sigma.canvas.nodes.def.js"
import "sigma/src/renderers/canvas/sigma.canvas.edges.def.js"
import "sigma/src/renderers/canvas/sigma.canvas.edges.curve.js"
import "sigma/src/renderers/canvas/sigma.canvas.edges.arrow.js"
import "sigma/src/renderers/canvas/sigma.canvas.edges.curvedArrow.js"
import "sigma/src/renderers/canvas/sigma.canvas.edgehovers.def.js"
import "sigma/src/renderers/canvas/sigma.canvas.edgehovers.curve.js"
import "sigma/src/renderers/canvas/sigma.canvas.edgehovers.arrow.js"
import "sigma/src/renderers/canvas/sigma.canvas.edgehovers.curvedArrow.js"
import "sigma/src/renderers/canvas/sigma.canvas.extremities.def.js"
import "sigma/src/renderers/svg/sigma.svg.utils.js"
import "sigma/src/renderers/svg/sigma.svg.nodes.def.js"
import "sigma/src/renderers/svg/sigma.svg.edges.def.js"
import "sigma/src/renderers/svg/sigma.svg.edges.curve.js"
import "sigma/src/renderers/svg/sigma.svg.labels.def.js"
import "sigma/src/renderers/svg/sigma.svg.hovers.def.js"
import "sigma/src/middlewares/sigma.middlewares.rescale.js"
import "sigma/src/middlewares/sigma.middlewares.copy.js"
import "sigma/src/misc/sigma.misc.animation.js"
import "sigma/src/misc/sigma.misc.bindEvents.js"
import "sigma/src/misc/sigma.misc.bindDOMEvents.js"
import "sigma/src/misc/sigma.misc.drawHovers.js"
import "sigma/plugins/sigma.renderers.edgeLabels/sigma.canvas.edges.labels.def.js";



/**
 * Create a Sigma graph
 * <Sigma />
 */
class ReactSigma extends Component {

    static propTypes = {
        graph: React.PropTypes.object,
        options: React.PropTypes.object,
    };

    // Declare default properties
    static defaultProps = {
        options: {}
    };

    constructor(props) {
        super(props);
        this.state = {id: _.uniqueId('sigma')};
    }

    componentDidMount () {
        var container = document.getElementById(this.state.id);
        var container = document.getElementById(this.state.id);
        this.sigma = new sigma(
            {
                id: this.state.id,
                graph: this.props.graph,
                renderer: {
                    container: container,
                    type:'webgl'
                }
            }
        )
        this.sigma.settings(this.props.options);
        this.sigma.refresh();
    }

    componentDidUpdate(prevProps, prevState) {
        this.sigma.kill();
        var container = document.getElementById(this.state.id);
        this.sigma = new sigma(
            {
                id: this.state.id,
                graph: this.props.graph,
                renderer: {
                    container: container,
                    type:'webgl'
                }
            }
        )
        this.sigma.settings(this.props.options);
        this.sigma.refresh();
    }

    /**
     * Render phase
     */
    render() {
        return (
            <div id={this.state.id} className={"sigma-container"}>
            </div>
        )
    }
}

export default branch( { graph: ['graph'] }, ReactSigma);
