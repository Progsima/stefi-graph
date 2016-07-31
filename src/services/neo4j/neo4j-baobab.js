import * as tree from "~/store";
import Neo4jService from "~/services/neo4j/neo4j";

/**
 * Construct neo4j service instance.
 */
var config = tree.select('settings', 'server').get();
var neo4j = new Neo4jService(config.url, config.login, config.password);

/**
 * When Neo4j configuration change in baobab, we update the service instance.
 */
tree.select('settings', 'server').on('update', (e) => {
    var data = e.data.currentData;
    neo4j.initialize(data.url, data.login, data.password);
});

export default neo4j;
