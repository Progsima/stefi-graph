import React, {Component, PropTypes} from "react";
import _ from "lodash";
import "./donut.less";

/**
 * Create a Donut chart
 * <Donut title="My title" strokeWidth="5" data="[{label, value, color}]" animation="1s" size="200" />
 */
class Donut extends Component {

    static propTypes = {
        title: React.PropTypes.string,
        size: React.PropTypes.number,
        strokeWidth: React.PropTypes.number,
        animation: React.PropTypes.string,
        data: React.PropTypes.arrayOf(React.PropTypes.shape({
            label: React.PropTypes.string.isRequired,
            value: React.PropTypes.number.isRequired,
            color: React.PropTypes.string.isRequired
        })).isRequired
    };

    // Declare default properties
    static defaultProps = {
        size: 200,
        animation: "1s"
    };

    constructor(props) {
        super(props);
        this.state = {id: _.uniqueId('donut')};
        this.state = this.initStateFromProps(props);
    }

    initStateFromProps(props) {
        var state = {};
        // calcul the total to make percentage
        state.total = props.data.reduce((prev, curr) => prev + curr.value, 0);
        state.alreadyDone = state.total;

        // Setting stroke width, per default it's 20% of the size
        state.strokeWidth = props.size * 0.2;
        if (props.strokeWidth != null) {
            state.strokeWidth = props.strokeWidth;
        }

        // radius of circle
        state.r = (props.size - (state.strokeWidth * 2)) / 2;

        // calcul the circumference of the circle
        state.circumference = 2 * Math.PI * state.r;

        // calcul center of circle
        state.center = [(props.size / 2), (props.size / 2)];

        state.id = this.state.id;

        return state;
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.initStateFromProps(nextProps));
    }

    generateDataCircle(data, index) {
        var toOffset = this.state.circumference - (this.state.circumference * (this.state.alreadyDone) / this.state.total);
        this.state.alreadyDone -= data.value;
        return (
            <circle className="circle_animation"
                    id={this.state.id + index}
                    title={data.label}
                    key={index}
                    r={this.state.r}
                    cx={this.state.center[0]}
                    cy={this.state.center[1]}
                    stroke={data.color}
                    strokeWidth={this.state.strokeWidth *2}
                    strokeDasharray={this.state.circumference +1}
                    strokeDashoffset={this.state.circumference}>
                <animate
                    attributeName="stroke-dashoffset"
                    to={toOffset}
                    dur={this.props.animation}
                    fill="freeze"/>
            </circle>
        )
    }

    generateDataLabel(data, index) {
        return (
            <text key={index}
                  x={this.state.center[0]}
                  y={this.state.center[1]}
                  fontSize={this.props.size * 0.20}
                  fill="black"
                  visibility="hidden"
                  transform={"rotate(90 " + this.state.center[0] + " " + this.state.center[1] + ")"}>
                <tspan>{(data.value / this.state.total * 100).toFixed(0)}</tspan>
                <textPath xlinkHref={"#" + this.state.id + "textPath"} startOffset="50%">
                    {data.label}
                </textPath>
                <set attributeName="visibility" from="hidden" to="visible" begin={this.state.id + index + '.mouseover'}
                     end={this.state.id + index + '.mouseout'}/>
            </text>
        )
    }

    generateLabelCircle() {
        var textMarginTop = this.props.size * 0.01;
        var start = [this.state.strokeWidth + textMarginTop, (this.props.size / 2)];
        var radius = (this.props.size / 2) - this.state.strokeWidth - textMarginTop;
        var end = [start[0] + (2 * radius), this.props.size / 2];
        var path = new Array();
        path.push('M');
        path.push(start[0].toString());
        path.push(' ');
        path.push(start[1].toString());
        path.push(' A ');
        path.push(radius.toString());
        path.push(' ');
        path.push(radius.toString());
        path.push(' 0 0 0 ');
        path.push(end[0].toString());
        path.push(' ');
        path.push(end[1].toString());
        return (
            <path id={this.state.id + "textPath"}
                  d={path.join("")}/>
        )
    }

    /**
     * Render phase
     */
    render() {
        return (
            <div>
                <h1> { this.props.title }</h1>
                <svg width={this.props.size} height={this.props.size}>
                    <defs>
                        {this.generateLabelCircle()}
                    </defs>
                    <g id="percent">
                        {this.props.data.map((data, index) => this.generateDataCircle(data, index))}
                    </g>
                    <g>
                        <circle className="backgrounded"
                                r={this.state.r}
                                cx={this.state.center[0]}
                                cy={this.state.center[1]}/>
                    </g>
                    <g id="labels">
                        {this.props.data.map((data, index) => this.generateDataLabel(data, index))}
                    </g>
                </svg>
            </div>
        )
    }
}

export default Donut;
