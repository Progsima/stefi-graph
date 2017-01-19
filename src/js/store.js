import Baobab from "baobab";
import configInitState from "~/config/initstate";
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
var initState = configInitState;

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
 * ~~~~~~~~~~~~~~~~~~~~~
 * Baobab graph listener
 * ~~~~~~~~~~~~~~~~~~~~~
 */
// when graph data change, we update the refresh graph status
tree.select('data', 'graph').on('update', (e) => {
    tree.select('data', 'refresh').set(true);
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
                var labels = data.nodes
                    // transform array of nodes to array of array of labels
                    .map((node) => {
                        return node.labels;
                    })

                    // transform array of array of labels to object of label => { name, count }
                    .reduce((previousValue, currentValue) => {
                        currentValue.forEach((label) => {
                            if (!previousValue[label]) {
                                previousValue[label] = {
                                    name: label,
                                    count: 1
                                };
                            }
                            else {
                                previousValue[label].count += 1;
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
                var edges = data.edges
                    .map((edge) => {
                        return edge.type;
                    })
                    .reduce((previousValue, currentValue) => {
                        if (!previousValue[currentValue]) {
                            previousValue[currentValue] = {
                                name: currentValue,
                                count: 1
                            };
                        }
                        else {
                            previousValue[currentValue].count += 1;
                        }
                        return previousValue;
                    }, {});

                return Object.keys(edges).map(key => edges[key]);
            }
        }
    )
);

export default tree;
