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
 * ~~~~~~~~~~~~~~~~~~~~~
 * Baobab graph listener
 * ~~~~~~~~~~~~~~~~~~~~~
 */
// when graph data change, we update the refresh graph status
tree.select('data', 'graph').on('update', (e) => {
    tree.select('data', 'refresh').set(true);
});

export default tree;





