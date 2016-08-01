import Baobab from 'baobab';
import config from "~/config";

// Init the state
const tree = new Baobab(config.state, {shiftReferences: true});

// let's record all last changes
var historyCursor = tree.select('settings', 'advanced', 'baobabHistorySize');
tree.root.startRecording(historyCursor.get());
historyCursor.on('update', (e) => {
    var data = e.data.currentData;
    tree.root.startRecording(data);
});

export default tree;





