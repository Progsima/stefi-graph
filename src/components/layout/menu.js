import React, {Component, PropTypes} from "react";
import MenuItem from "./menuItem";

class Menu extends Component {

    static propTypes = {
        pages: React.PropTypes.object.isRequired
    };

    /**
     * Render phase
     */
    render() {
        return (
            <nav id="navbar" className="nav navbar-nav navbar-right">
                <ul className="nav navbar-nav">
                    { Object.keys(this.props.pages).map(e =>
                        <MenuItem key={e} name={this.props.pages[e].name} title={this.props.pages[e].title} id={e}/>
                    )}
                </ul>
            </nav>
        )
    }
}

export default Menu;
