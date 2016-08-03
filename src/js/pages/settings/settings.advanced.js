import React, {Component, PropTypes} from 'react';
import {branch} from 'baobab-react/higher-order';
import {PageEnhancer} from '~/enhancer/page';
import * as action from '~/actions/settings';
import Settings from './settings';

const schema = {
    type: 'object',
    required: [
        'logLevel',
        'logPattern',
        'queryHistorySize',
        'baobabHistorySize'
    ],
    properties: {
        'logLevel': {
            type: 'string',
            title: 'Logging level',
            enum: ['Off', 'Error', 'Warning', 'Info', 'Debug']
        },
        'logPattern': {
            type: 'string',
            title: 'Regex that allow service logging',
            default: '.*'
        },
        'queryHistorySize': {
            type: 'number',
            title: 'Query history size',
            minimum: 0,
            maximum: 100
        },
        'baobabHistorySize': {
            type: 'number',
            title: 'Action history size',
            minimum: 0,
            maximum: 100
        },
        'persistance': {
            type: 'string',
            title: 'Persistance of application state',
            enum: ['Off', 'LocalStorage', 'Url']
        }
    }
};

const ui = {
    'logLevel': {},
    'logPattern': {},
    'queryHistorySize': {
        'ui:widget': 'updown'
    },
    'baobabHistorySize': {
        'ui:widget': 'updown'
    },
    'persistance': {}
};

class SettingsAdvanced extends Component {

    static propTypes = {
        page: React.PropTypes.object.isRequired,
        data: React.PropTypes.object
    };

    saveToStore(data){
        this.props.dispatch( action.saveSettingsAdvanced, data);
    }

    render() {
        return (
            <Settings page={this.props.page} schema={schema}  ui={ui} data={this.props.data} save={(data) => this.saveToStore(data)} />
        )
    }
}

export default PageEnhancer(
    branch(
        {
            data: ['settings', 'advanced']
        },
        SettingsAdvanced
    )
);
