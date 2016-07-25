import React, {Component, PropTypes} from "react";
import MenuItem from "./menuItem";

class Menu extends Component {

    static propTypes = {
        pages: React.PropTypes.array.isRequired,
        styleClass: React.PropTypes.string
    };

    /**
     * Render phase
     */
    render() {
        var menu = this.props.pages.map((item, index) => {
            return <MenuItem key={index} page={item}/>
        });
        return (
            <ul className={this.props.styleClass}>
                { menu }
            </ul>
        )
    }
}

export default Menu;
