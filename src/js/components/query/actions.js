import Neo4jService from "~/services/neo4j/neo4j";
import Log from "~/services/log";
import {pushNotification}from "~/components/notifications/actions";
import configInitState from "~/config/initstate";
import * as graph from "~/components/graph/actions";

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
  graph.selectionReset(tree);
  queryAddToHistory(tree);
  // get the current query
  var query = tree.select('queries').get('current');
  log.info('Will running query :' + query);
  pushNotification(tree, {
    title: "Info: ",
    message: "Processing query \"" + query + "\"",
    type: "info"
  });

  const configNeo4j = tree.select('settings', 'neo4j').get();
  const neo4j = new Neo4jService(configNeo4j.url, configNeo4j.login, configNeo4j.password);

  // on success we replace the graph state
  neo4j.graph(query).then(
    result => {
      graph.runLayout(tree, true);
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
// TODO: review this method ...
export function queryRunAndAppend(tree) {
  queryAddToHistory(tree);
  // get the current query
  var query = tree.select('queries').get('current');
  log.info('Will append query :' + query);

  const configNeo4j = tree.select('settings', 'neo4j').get();
  const neo4j = new Neo4jService(configNeo4j.url, configNeo4j.login, configNeo4j.password);

  // on success we merge the result with graph state
  neo4j.graph(query).then(result => {
    graph.runLayout(tree, true);
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
  const historySize = tree.select('settings', 'application', 'queryHistorySize').get();

  // remove from history the same query
  var history = tree.select('queries', 'history').get();
  var newHistory = history.filter((item) => {
    return item !== query;
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

  // construct the favory item
  var favory = {name:query, query: query};
  var match = query.match(/\/\/(.*)\n([^]*)/m)
  if(match) {
    favory.name = match[1];
  }

  // search if it already exist
  var favList = tree.select('queries', 'favory').get();
  var newFavList = favList.filter((item) => {
    return item.name !== favory.name;
  });

  // save the query
  newFavList.push(favory);
  tree.select('queries', 'favory').set(newFavList);

  if(newFavList.length > favList.length) {
    pushNotification(tree, {
      title: "Save: ",
      message: "Query '" + favory.name + "' has been saved into favory",
      type: "info"
    });
  }else {
    pushNotification(tree, {
      title: "Upate: ",
      message: "Query '" + favory.name + "' has been updated into favory",
      type: "warning"
    });
  }
}

export function setSelectedData(tree, data) {
  tree.select('data', 'selected').set(data);
}

export function clear(tree){
  tree.select('data').set(configInitState.data);
  tree.select('queries', 'current').set('');
}
