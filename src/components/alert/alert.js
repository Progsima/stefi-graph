import React, {Component, PropTypes} from "react";
import log from './../../services/log';
import _ from "lodash";

class Alert extends Component {

    static propTypes = {
        title: React.PropTypes.string,
        message: React.PropTypes.string,
        type: React.PropTypes.oneOf(['success', 'info', 'warning', 'danger']),
        timeout: React.PropTypes.number.isRequired
    };

    // Declare default properties
    static defaultProps = {
        type: 'info',
        timeout: 2
    };

    constructor(props) {
        super(props);
        this.state = {
            id: _.uniqueId('alert'),
            timeLeft: this.props.timeout
        };
    }

    _tick() {
        var self = this;
        this.timer = setTimeout(() => {
            if(this.state.timeLeft > 0) {
                this.setState({timeLeft: (this.state.timeLeft - 1)});
                this._tick();
            }else {
                this._stop();
            }
        }, 1000);
    }

    _stop() {
        clearTimeout(this.timer);
    }

    componentDidMount() {
        this._tick();
    }

    componentWillUnmount() {
        this._stop();
    }

    componentWillReceiveProps(nextProps) {
        this._stop();
        this.setState({
            timeLeft: nextProps.timeout
        });
        this._tick();
    }

    render() {
        log.debug("[ALERT]: message is " + this.props.message);
        if (this.props.message && this.state.timeLeft > 0) {
            return (
                <div id={this.props.id} className={ "alert alert-" + this.props.type + " alert-dismissible"} role="alert">
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <strong>{this.props.title}</strong> {this.props.message}
                </div>
            )
        }
        else {
            return ( <div/>)
        }
    }
}

export
default
Alert;
