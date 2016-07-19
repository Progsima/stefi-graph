import React, {Component, PropTypes} from "react";

class Footer extends Component {

    static propTypes = {
        config: React.PropTypes.object.isRequired
    };

    render() {
        return (
            <footer>
                <div className="container">
                    <div className="row-fluid">
                        <div className="span12">
                        </div>
                    </div>
                </div>
            </footer>
        )
    }
}

export default Footer;
