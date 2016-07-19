import React from 'react';

export var PageEnhancer = ComposedComponent => class extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.title = this.props.page.title;
    }

    render() {
        return <ComposedComponent {...this.props} {...this.state} />;
    }
};
