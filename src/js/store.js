import Baobab from "baobab";
import config from "~/config";
import Log from "~/services/log";

/**
 * Module logger.
 */
const log = new Log("Store");

// Init the state
const tree = new Baobab(config.state, {shiftReferences: true});

// let's record all last changes
var historyCursor = tree.select('settings', 'advanced', 'baobabHistorySize');
tree.root.startRecording(historyCursor.get());
historyCursor.on('update', (e) => {
    var data = e.data.currentData;
    tree.root.startRecording(data);
});

// Register monkey for labels
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

// Register monkey for edges
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





