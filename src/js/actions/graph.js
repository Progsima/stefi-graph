import Neo4jService from "~/services/neo4j/neo4j";
import Log from "~/services/log";
import {pushNotification} from "./notifications";

/**
 * Module logger.
 */
const log = new Log('Actions.graph');

/**
 *  Save the query to the state.
 * @param query A cypher query.
 */
export function querySave(tree, query) {
    tree.select('queries').set('current', query);
}

/**
 * Run the query and put the result to the graph state.
 */
export function queryRun(tree) {
    queryAddToHistory(tree);
    // get the current query
    var query = tree.select('queries').get('current');
    log.info('Will running query :' + query);
    pushNotification(tree, {
        title: "Info: ",
        message: "Processing query \"" + query + "\"",
        type: "info"
    });

    const config = tree.select('settings', 'server').get();
    const neo4j = new Neo4jService(config.url, config.login, config.password);

    // on success we replace the graph state
    neo4j.graph(query).then(
        result => {
            tree.select('data', 'graph').set(result);
        },
        reason => {
            pushNotification(tree, {
                title: "Error: ",
                message: JSON.stringify(reason),
                type : "danger"
            });
        }
    );
}

/**
 * Run the query and append the result to the graph state.
 */
export function queryRunAndAppend(tree) {
    queryAddToHistory(tree);
    // get the current query
    var query = tree.select('queries').get('current');
    log.info('Will append query :' + query);

    const config = tree.select('settings', 'server').get();
    const neo4j = new Neo4jService(config.url, config.login, config.password);

    // on success we merge the result with graph state
    neo4j.graph(query).then(result => {
        tree.select('data', 'graph').deepMerge(result);
    });
}

/**
 * Add the current query to history.
 */
export function queryAddToHistory(tree) {
    // get the current query
    const query = tree.select('queries').get('current');
    // get history limit size
    const historySize = tree.select('settings', 'advanced', 'queryHistorySize').get();

    // remove from history the same query
    var history = tree.select('queries', 'history').get();
    var newHistory = history.filter((item) => {
        return item !== query
    });

    // save the query at begin history
    newHistory.unshift(query);
    tree.select('queries', 'history').set(newHistory);

    // check and clean history size
    while (newHistory.length >= historySize) {
        tree.select('queries', 'history').pop();
    }
}

/**
 * Add the current query to favories.
 */
export function queryAddToFavory(tree) {
    const query = tree.select('queries').get('current');
    log.debug("Adding this query into favorite : " + query);
    var favory = {name:query, query: query};

    var match = query.match(/\/\/(.*)\n([^]*)/m)
    if(match) {
        favory.name = match[1];
    }
    tree.select('queries', 'favory').push(favory);
}
