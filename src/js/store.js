import Baobab from "baobab";
import configInitState from "~/config/initstate";
import Log from "~/services/log";
import {mergeDeep, findGetParameter} from "~/services/utils";
import * as query from "~/components/query/actions";

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

var runQuery = false;

// take a look at localstorage
var lsState = JSON.parse(window.localStorage.getItem('state'));
if(lsState) {
    console.info("Found state into localstorage " + JSON.stringify(lsState));
    initState = mergeDeep(initState, lsState);
}

// take a look at file params ?
if(findGetParameter('file')) {
  var fileStateUrl = findGetParameter('file');
  var request = new XMLHttpRequest();
  request.open('GET', fileStateUrl, false);  // `false` makes the request synchronous
  request.send(null);
  if (request.status === 200) {
    initState = mergeDeep(initState, JSON.parse(request.responseText));
  }
  else {
    console.log("Error when fetching external file " + fileStateUrl);
  }
}

// take a look at state params ?
if(findGetParameter('state')) {
    var urlState = JSON.parse(decodeURIComponent(findGetParameter('state')));
    console.info("Found state into Url : "+ JSON.stringify(urlState));
    initState = mergeDeep(initState, urlState);

    if(urlState.queries.current){
      runQuery = true;
    }
}



// Init the state
const tree = new Baobab(initState, {shiftReferences: true});


/**
 * ~~~~~~~~~~~~~~
 * Baobab history
 * ~~~~~~~~~~~~~~
 */
// let's record all last changes
var historyCursor = tree.select('settings', 'application', 'baobabHistorySize');

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
    //TODO: remove notifications

    if(tree.select('settings', 'application', 'persistance').get() === 'LocalStorage') {
        log.info('Saving baobab tree into localstorage');
        // saving it into localstorage
        window.localStorage.setItem('state', JSON.stringify(state));
    }

    if(tree.select('settings', 'application', 'persistance').get() === 'Url') {
        log.info('Saving baobab tree into URL');
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?state=' + encodeURIComponent(JSON.stringify(state)) + window.location.hash;
        window.history.pushState({path:newurl},'',newurl);
    }
});

// when the persistance mode change, we reset localstorage
tree.select('settings', 'application', 'persistance').on('update', (mode) => {
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
                var nodeArray = Object.keys(data.nodes).map(e => {return data.nodes[e]});
                var labels = nodeArray
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
              var edgeArray = Object.keys(data.edges).map(e => {return data.edges[e]});
                var edges = edgeArray
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


if(runQuery){
  query.queryRun(tree);
}
