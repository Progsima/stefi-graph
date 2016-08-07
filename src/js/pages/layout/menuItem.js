import React, {Component, PropTypes} from "react";
import {branch} from "baobab-react/higher-order";
import * as sitemap from "~/actions/sitemap";
import Log from "~/services/log";

const log = new Log("Component.menuItem");

class MenuItem extends Component {

    static propTypes = {
        item: React.PropTypes.shape({
            name: React.PropTypes.string,
            title: React.PropTypes.string,
            path: React.PropTypes.string,
            component:  React.PropTypes.func
        }).isRequired
    };

    /**
     * Goto main view when clicking on logo.
     */
    _bindItemMenuClick(e) {
        this.props.dispatch( sitemap.navigateTo, this.props.item);
    }

    /**
     * Determinate if the current menu item is active or not.
     * This is done with the hash page.
     * @returns {string}
     * @private
     */
    _isMenuItemActive() {
        log.debug("Page hash is " + sitemap.getPageHashFromView(this.props.view) + "\n\t window Hash is " + window.location.hash);
        var activeClass = "";

        // if we are in the page or we are in the path of the display page
        var pageHash = '#' + sitemap.getPageHashFromView(this.props.item.state.view);
        if (window.location.hash.startsWith(pageHash)) {
            activeClass = "active";
        }

        return activeClass
    }

    /**
     * Render a menu item page
     * @private
     */
    _renderPage() {
        return (
            <li className={ this._isMenuItemActive() }>
                <a onClick={ e => this._bindItemMenuClick(e) }
                   title={ this.props.item.title }>
                    { this.props.item.name }
                </a>
            </li>
        )
    }

    _renderMenuComponent() {
        var Component = this.props.item.component;
        return ( <Component />)
    }

    /**
     * Render phase
     */
    render() {
        if(this.props.item['path']) {
            return this._renderPage();
        }
        else {
            return this._renderMenuComponent();
        }
    }
}

export default branch({view: ['view']}, MenuItem);
