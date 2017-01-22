import Log from "~/services/log";
import Neo4jService from "~/services/neo4j/neo4j";
import {pushNotification}from "~/components/notifications/actions";

/**
* Module logger.
*/
const log = new Log('Actions.graph');

/**
* Save the current hover node into state.
*/
export function setOverObject(tree, object) {
  runLayout(tree, false);
  tree.select('data', 'over').set(object);
}

/**
* Save the current right click node into state.
*/
export function setRightClick(tree, type, object, captor) {
  runLayout(tree, false);
  tree.select('data', 'rightClick').set({
      type:type,
      object: object,
      x:(captor?captor.clientX:null),
      y:(captor?captor.clientY:null)
    });
}

/**
* Save the current right click node into state.
*/
export function setClickNode(tree, node) {
  runLayout(tree, false);
  var cursor = tree.select('data', 'selected');
  var selected = cursor.get();
  // If selected already contains node => remove it
  // Otherwise adding it
  if(selected.some((e) => { return (e.id == node.id)})) {
    tree.select('data', 'selected').set(selected.filter((e) => { return (e.id != node.id)}));
  } else {
    cursor.push(node);
  }
}

/**
* Toggle label visibility
*/
export function toggleLabelVisibility(tree, label) {
  runLayout(tree, false);
  tree.select('settings','style', 'labels', label).set('hidden', !tree.select('settings','style', 'labels', label, 'hidden').get())
}

/**
* Toggle edge type visibility
*/
export function toggleEdgeVisibility(tree, type) {
  runLayout(tree, false);
  tree.select('settings','style', 'edges', type).set('hidden', !tree.select('settings','style', 'edges', type, 'hidden').get())
}

/**
* Save/update label style
*/
export function saveLabelStyle(tree, label, style) {
  runLayout(tree, false);
  var cleanStyle = style;
  if(!style.image.url){
    cleanStyle.image = {};
  }
  if(!style.icon.name){
    cleanStyle.icon = {};
  }
  tree.select('settings','style', 'labels', label).set(style);
}

/**
* Save/update edge style
*/
export function saveEdgeStyle(tree, edge, style) {
  runLayout(tree, false);
  tree.select('settings','style', 'edges', edge).set(style);
}

/**
 * Enable the graph layout
 */
export function runLayout(tree, run){
  tree.select('data', 'runLayout').set(run);
}

/**
 * Node : edit
 */
export function nodeEdit(tree, nodeId){
}

/**
 * Node : remove
 */
export function nodeRemove(tree, nodeId){
  setRightClick(tree, null, null, null) ;
  // remove node from graph
  tree.select('data', 'graph', 'nodes').unset(nodeId);
  // remove node's edges from graph
  var newEdges ={};
  let edges = tree.get('data', 'graph', 'edges');
  Object.keys(edges).forEach(
    item =>  {
      if(edges[item].source !== nodeId && edges[item].target !== nodeId ) {
        newEdges[item] = edges[item];
      }
    }
  )
  tree.select('data', 'graph', 'edges').set(newEdges);
}

/**
 * Node : delete
 */
export function nodeDelete(tree, nodeId){
  setRightClick(tree, null, null, null) ;

  const configNeo4j = tree.select('settings', 'neo4j').get();
  const neo4j = new Neo4jService(configNeo4j.url, configNeo4j.login, configNeo4j.password);

  neo4j.cypher('MATCH (n) WHERE id(n)={id} WITH n DETACH DELETE n', {id:nodeId}).then(
    result => {
      pushNotification(tree, {
        title: "Success: ",
        message: "Deleting node \"" + nodeId + "\"",
        type: "success"
      });
      nodeRemove(tree, nodeId);
    },
    reason => {
      pushNotification(tree, {
        title: "Error: ",
        message: JSON.stringify(reason),
        type : "danger"
      });
    }
  )
}

/**
 * Node : expand.
 */
export function nodeExpand(tree, nodeId){
  setRightClick(tree, null, null, null) ;

  const configNeo4j = tree.select('settings', 'neo4j').get();
  const neo4j = new Neo4jService(configNeo4j.url, configNeo4j.login, configNeo4j.password);

  // on success we merge the result with graph state
  neo4j.graph('MATCH (n)-[r]-(m) WHERE id(n)={id} RETURN n,m LIMIT 100', {id:nodeId}).then(
    result => {
      let graph = tree.get('data', 'graph');
      runLayout(tree, true);
      tree.select('data', 'graph', 'nodes').set(Object.assign({}, graph.nodes, result.nodes));
      tree.select('data', 'graph', 'edges').set(Object.assign({}, graph.edges, result.edges));
    },
    reason => {
      pushNotification(tree, {
        title: "Error: ",
        message: JSON.stringify(reason),
        type : "danger"
      });
    });
}
