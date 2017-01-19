import Log from "~/services/log";

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
export function setRightClickObject(tree, object) {
  runLayout(tree, false);
  tree.select('data', 'rightClick').set(object);
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

export function runLayout(tree, run){
  tree.select('data', 'runLayout').set(run);
}
