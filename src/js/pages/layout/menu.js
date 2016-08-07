import React, {Component, PropTypes} from "react";
import MenuItem from "~/pages/layout/menuItem";

class Menu extends Component {

    static propTypes = {
        pages: React.PropTypes.array.isRequired,
        styleClass: React.PropTypes.string
    };

    /**
     * Render phase
     */
    render() {
        return (
            <ul className={this.props.styleClass}>
                { this.props.pages.map((item, index) => {
                    return <MenuItem key={index} item={item}/>
                }) }
            </ul>
        )
    }
}

export default Menu;
