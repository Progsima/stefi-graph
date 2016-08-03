import Neo4jService from "~/services/neo4j/neo4j";
import Log from "~/services/log";

/**
 * Module logger.
 */
const log = new Log("Actions.graph");

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

    const config = tree.select('settings', 'server').get();
    const neo4j = new Neo4jService(config.url, config.login, config.password);

    // on success we replace the graph state
    neo4j.graph(query).then( result => {
        var labelsDefinition = tree.select('meta', 'labels').get();
        var edgessDefinition = tree.select('meta', 'edges').get();

        result.nodes.forEach( (node) => {

        });

        result.edges.forEach( (node) => {

        });

        tree.select('data', 'graph').set(result);
    });
}

/**
 * Run the query and append the result to the graph state.
 */
export function queryRunAndAppend(tree) {
    queryAddToHistory(tree);
    // get the current query
    var query = tree.select('queries').get('current');

    const config = tree.select('settings', 'server').get();
    const neo4j = new Neo4jService(config.url, config.login, config.password);

    // on success we merge the result with graph state
    neo4j.graph(query).then( result => {
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
    // save the query at begin history
    var currentHistorySize = tree.select('queries', 'history').unshift(query);
    // check and clean history size
    while(currentHistorySize >= historySize) {
        tree.select('queries', 'history').pop();
    }
}

/**
 * Add the current query to favories.
 */
export function queryAddToFavory(tree) {
    const query = tree.select('queries').get('current');
    tree.select('queries', 'favory').push(query);
}
