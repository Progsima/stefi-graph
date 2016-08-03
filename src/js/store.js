import Baobab from "baobab";
import config from "~/config";
import Log from "~/services/log";
import {mergeDeep} from "~/services/utils";

/**
 * Module logger.
 */
const log = new Log("Store");

/**
 * ~~~~~~~~~~~~~~~~~
 * Baobab initiation
 * ~~~~~~~~~~~~~~~~~
 */
var initState = config.state;

// take a look at localstorage
var lsState = JSON.parse(window.localStorage.getItem('state'));
if(lsState) {
    console.info("Found state into localstorage " + JSON.stringify(lsState));
    initState = mergeDeep(initState, lsState);
}

// take a look at params ?
if(window.location.search.indexOf('state') > -1) {
    var urlState = JSON.parse(decodeURIComponent(window.location.search.split('state=')[1]));
    console.info("Found state into Url : "+ JSON.stringify(urlState));
    initState = mergeDeep(initState, urlState);
}

// Init the state
const tree = new Baobab(initState, {shiftReferences: true});

/**
 * ~~~~~~~~~~~~~~
 * Baobab history
 * ~~~~~~~~~~~~~~
 */
// let's record all last changes
var historyCursor = tree.select('settings', 'advanced', 'baobabHistorySize');

// setting the history length
tree.root.startRecording(historyCursor.get());

// update history on size change
historyCursor.on('update', (e) => {
    var data = e.data.currentData;
    tree.root.startRecording(data);
});

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Baobab saving into localStorage
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
// when the state is update, we update local storage
tree.root.on('update', (e) => {
    var state = mergeDeep({}, e.data.currentData);
    state.notifications = config.notifications;
    state.data = config.data;

    if(tree.select('settings', 'advanced', 'persistance').get() === 'LocalStorage') {
        log.info('Saving baobab tree into localstorage');
        // saving it into localstorage
        window.localStorage.setItem('state', JSON.stringify(state));
    }

    if(tree.select('settings', 'advanced', 'persistance').get() === 'Url') {
        log.info('Saving baobab tree into URL');
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?state=' + encodeURIComponent(JSON.stringify(state)) + window.location.hash;
        window.history.pushState({path:newurl},'',newurl);
    }
});

// when the persistance mode change, we reset localstorage
tree.select('settings', 'advanced', 'persistance').on('update', (mode) => {
    // reset localstorage
    if(mode !== 'LocalStorage') {
        window.localStorage.setItem('state', '{}');
    }
    // reset url
    if(mode !== 'Url') {
        window.localStorage.setItem('state', '{}');
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.hash;
        window.history.pushState({path:newurl},'',newurl);
    }
});

/**
 * ~~~~~~~~~~~~~~
 * Baobab monkeys
 * ~~~~~~~~~~~~~~
 */

// Register monkey : Create current labels stats
tree.set(
    ['data', 'facets', 'labels'],
    Baobab.monkey({
            cursors: {
                nodes: ['data', 'graph', 'nodes']
            },
            get: function (data) {
                var colors = ['#24dbff', '#3895ff', '#3fcbff', '#006fe3', '#6aafff', '#1281e2'];
                var labels = data.nodes
                // transform array of nodes to array of array of labels
                    .map((node) => {
                        return node.labels;
                    })
                    // transform array of array of labels to object of label => { label, value, color }
                    .reduce((previousValue, currentValue) => {
                        currentValue.forEach((label) => {
                            if (!previousValue[label]) {
                                previousValue[label] = {
                                    label: label,
                                    value: 1,
                                    color: colors[Math.floor(Math.random()*5)]
                                };
                            }
                            else {
                                previousValue[label].value += 1;
                            }
                        });
                        return previousValue;
                    }, {});

                return Object.keys(labels).map(key => labels[key]);
            }
        }
    )
);

// Register monkey : Create current edges stats
tree.set(
    ['data', 'facets', 'edges'],
    Baobab.monkey({
            cursors: {
                edges: ['data', 'graph', 'edges']
            },
            get: function (data) {
                var colors = ['#24dbff', '#3895ff', '#3fcbff', '#006fe3', '#6aafff', '#1281e2'];
                var edges = data.edges
                    .map((edge) => {
                        return edge.type;
                    })
                    .reduce((previousValue, currentValue) => {
                        if (!previousValue[currentValue]) {
                            previousValue[currentValue] = {
                                label: currentValue,
                                value: 1,
                                color: colors[Math.floor(Math.random()*5)]
                            };
                        }
                        else {
                            previousValue[currentValue].value += 1;
                        }
                        return previousValue;
                    }, {});

                return Object.keys(edges).map(key => edges[key]);
            }
        }
    )
);

export default tree;





