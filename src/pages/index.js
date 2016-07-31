import React, {Component, PropTypes} from "react";
import Header from "~/pages/layout/header";
import View from "~/pages/layout/view";

/**
 * Main component that create the application.
 */
class App extends Component {

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Initialization
    // -----------------------
    //    * Constructor that initialize the state with props
    //    * ComponentWillMount
    //    * Render
    //    * ComponentDidMount
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    /**
     * Component constructor.
     * It's where we set the component state with properties.
     *
     * @param props Properties passed to the component
     */
    constructor(props) {
        super(props);
    }

    /**
     * This method is called before the render method is executed.
     * It is important to note that setting the state in this phase will not trigger a re-rendering.
     */
    componentWillMount() {

    }

    /**
     * This method returns the needed component markup.
     */
    render() {
        return (
            <div>
                <Header />
                <View />
            </div>
        )
    }

    /**
     * As soon as the render method has been executed this method is called.
     * So here the DOM can be accessed and you can do some DOM manipulations or data fetching operations.
     * Any DOM interactions should always happen in this phase not inside the render method.
     */
    componentDidMount() {
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // State change lifecycle
    // -----------------------
    //    * Updating state
    //    * ShouldComponentUpdate
    //    * ComponentWillUpdate
    //    * Render
    //    * ComponentDidUpdate
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * When state change, this method is called before the render method to define if a re-rendering is needed.
     *
     * @return Boolean
     */
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    /**
     * This method is called as soon as the the shouldComponentUpdate returned true.
     * Any state changes via this.setState are not allowed as this method should be strictly used to prepare for an upcoming update not trigger an update itself.
     */
    componentWillUpdate(nextProps, nextState) {

    }

    /**
     * This method is called after the render method. Similar to the componentDidMount.
     * It can be used to perform DOM operations after the data has been updated.
     *
     * @param prevProps
     * @param prevState
     */
    componentDidUpdate(prevProps, prevState) {

    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Properties change lifecycle
    // ----------------------------
    //    * Updating Props
    //    * ComponentWillReceiveProps
    //    * ShouldComponentUpdate
    //    * ComponentWillUpdate
    //    * Render
    //    * ComponentDidUpdate
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * This method is called when the props have changed and when this is not an initial rendering.
     * It allow you  to update the state depending on the existing and upcoming props, without triggering another rendering.
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            // set something
        });
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Unmouting
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * This method is called before the component is removed from the DOM.
     * It can be used when  you need to perform clean up operations (ex: removing any timers defined in componentDidMount).
     */
    componentWillUnmount() {
    }

    /**
     * This method is called when component is removed.
     */
    componentDidMount() {
    }
}


export default App
