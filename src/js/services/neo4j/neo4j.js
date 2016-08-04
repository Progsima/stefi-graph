import neo4j from "neo4j-driver/lib/browser/neo4j-web";
import Log from "~/services/log";

/**
 * Module logger.
 */
const log = new Log("Service.Neo4j");

/**
 * Service that communicate with Neo4j server.
 */
class Neo4jService {

    /**
     * Constructor.
     *
     * @param url Connection url to the database (ex: bolt://localhost)
     * @param user User login of the database
     * @param password User password of the database
     */
    constructor(url, user, password) {
        this.initialize(url, user, password);
    }

    /**
     * Initialize the connection to the database.
     * @param url Connection url to the database (ex: bolt://localhost)
     * @param user User login of the database
     * @param password User password of the database
     */
    initialize(url, user, password) {
        if (this.session)
            this.session.close();
        this.driver = neo4j.v1.driver(url, neo4j.v1.auth.basic(user, password));
        this.session = this.driver.session();
    }

    /**
     * Get all labels available.
     *
     * @returns {Promise<Array<String>>} Array of label as a promise
     */
    labels() {
        return new Promise((resolve, reject) => {
            this.session.run("CALL db.labels")
                .then(
                    result => {
                        var labels = [];
                        result.records.forEach(record => {
                            labels.push(record.get("label"));
                        });
                        resolve(labels);
                    },
                    reason => {
                        reject(reason);
                    })
                .catch(error => {
                    reject(error);
                });
        });
    }

    /**
     * Get all relationship type available.
     *
     * @returns {Promise<Array<String>>} Array of relationship type as a promise
     */
    relationshipTypes() {
        return new Promise((resolve, reject) => {
            this.session.run("CALL db.relationshipTypes")
                .then(
                    result => {
                        var rels = [];
                        result.records.forEach(record => {
                            rels.push(record.get("relationshipType"));
                        });
                        resolve(rels);
                    },
                    reason => {
                        reject(reason);
                    })
                .catch(error => {
                    reject(error);
                });
        });
    }

    /**
     * Get all properties available.
     *
     * @returns {Promise<Array<String>>} Array of property as a promise
     */
    propertyKeys() {
        return new Promise((resolve, reject) => {
            this.session.run("CALL db.propertyKeys")
                .then(
                    result => {
                        var labels = [];
                        result.records.forEach(record => {
                            labels.push(record.get("propertyKey"));
                        });
                        resolve(labels);
                    },
                    reason => {
                        reject(reason);
                    })
                .catch(error => {
                    reject(error);
                });
        });
    }

    /**
     * Get all database indexes.
     *
     * @returns {Promise<Array<Object>>} Array of schema
     */
    indexes() {
        var indexeRegex = /INDEX ON :(.*)\((.*)\)/;
        var types = {
            node_unique_property: "unique",
            node_label_property: "index"
        };
        return new Promise((resolve, reject) => {
            this.session.run("CALL db.indexes()")
                .then(
                    result => {
                        var indexes = [];
                        result.records.forEach(record => {
                            indexes.push({
                                name: record.get('description').match(indexeRegex)[1],
                                property: record.get('description').match(indexeRegex)[2],
                                state: record.get('state'),
                                type: types[record.get('type')]
                            });
                        });
                        resolve(indexes);
                    },
                    reason => {
                        reject(reason);
                    })
                .catch(error => {
                    reject(error);
                });
        });
    }

    /**
     * Get all database constraints.
     *
     * @returns {Promise<Array<Object>>} Array of schema
     */
    constraints() {
        var constraintNodeExistRegex = /CONSTRAINT ON \( (.*):(.*) \) ASSERT exists((.*)\.(.*))/;
        var constraintNodeUniqueRegex = /CONSTRAINT ON \( (.*):(.*) \) ASSERT (.*)\.(.*) IS UNIQUE/;
        var constraintRelExistRegex = /CONSTRAINT ON \(\)-\[ (.*):(.*) \]-\(\) ASSERT exists\((.*)\.(.*)\)/;

        return new Promise((resolve, reject) => {
            this.session.run("CALL db.constraints()")
                .then(
                    result => {
                        var constraints = [];
                        result.records.forEach(record => {
                            var item = {};
                            var values = record.get('description').match(constraintNodeExistRegex);
                            if (values && values.length > 1) {
                                item = {
                                    on: 'Node',
                                    name: values[2],
                                    property: values[2],
                                    type: 'exist'
                                }
                            }

                            values = record.get('description').match(constraintNodeUniqueRegex);
                            if (values && values.length > 1) {
                                item = {
                                    on: 'Node',
                                    name: values[2],
                                    property: values[2],
                                    type: 'unique'
                                }
                            }

                            values = record.get('description').match(constraintRelExistRegex);
                            if (values && values.length > 1) {
                                item = {
                                    on: 'Relationship',
                                    name: values[2],
                                    property: values[2],
                                    type: 'exist'
                                }
                            }

                            constraints.push(item);
                        });
                        resolve(constraints);
                    },
                    reason => {
                        reject(reason);
                    })
                .catch(error => {
                    reject(error);
                });
        });
    }

    /**
     * Execute a cypher query and return an array of object.
     * /!\ for large integer ...
     *
     * @param query
     * @returns {Promise}
     */
    cypher(query) {
        log.info("Running cypher query " + query);
        return new Promise((resolve, reject) => {
            this.session.run(query)
                .then(
                    result => {
                        log.debug("Cypher query result is " + JSON.stringify(result));
                        var rs = [];
                        result.records.forEach(record => {
                            var item = {};
                            record.forEach((value, key) => {
                                item[key] = value;


                                if (value.constructor.name === 'Integer') {
                                    item[key] = value.toNumber();
                                }

                                // TODO: Change the node wrapper
                                if (value.constructor.name === 'Node') {
                                }

                                // TODO: Change the node wrapper
                                if (value.constructor.name === 'Relationship') {
                                }

                                // TODO: Change the path wrapper
                                if (value.constructor.name === 'Path') {
                                }

                            });
                            rs.push(item);
                        });
                        resolve(rs);
                    },
                    reason => {
                        reject(reason);
                    })
                .catch(error => {
                    reject(error);
                });
        })
    }

    /**
     * Execute a cypher query and return a graph representation.
     *
     * @param query
     */
    graph(query) {
        log.info("Running graph query " + query);
        return new Promise((resolve, reject) => {
            this.session.run(query)
                .then(
                    result => {
                        log.debug("Graph query result is " + result.records.length + JSON.stringify(result));
                        // store all nodes ID from the query result
                        var nodeIds = [];

                        // for each rows
                        result.records.forEach(record => {

                            // for each coloumn
                            record.forEach((value, key) => {

                                // if it's a node
                                if (value.constructor.name === 'Node') {
                                    if (nodeIds.indexOf(value.identity.toNumber()) === -1)
                                        nodeIds.push(value.identity.toNumber())
                                }

                                // if it's a path
                                if (value.constructor.name === 'Path') {
                                    if (nodeIds.indexOf(value.start.identity.toNumber()) === -1)
                                        nodeIds.push(value.start.identity.toNumber());

                                    if (nodeIds.indexOf(value.end.identity.toNumber()) === -1)
                                        nodeIds.push(value.end.identity.toNumber());

                                    value.segments.forEach((seg) => {
                                        if (nodeIds.indexOf(seg.start.toNumber()) === -1)
                                            nodeIds.push(seg.start.toNumber());
                                        if (nodeIds.indexOf(seg.end.toNumber()) === -1)
                                            nodeIds.push(seg.end.toNumber());
                                    })
                                }
                            });
                        });

                        var graph = {nodes: [], edges: []};
                        var query = "MATCH (from) WHERE id(from) IN " + JSON.stringify(nodeIds) + " OPTIONAL MATCH (from)-[r]->(to) WHERE id(to) IN " + JSON.stringify(nodeIds) + " RETURN from,r,to";
                        log.info("Sub-graph query is " + query);
                        this.session
                            .run(query)
                            .then(result => {
                                    var nodesIndex = [];

                                    // for each rows
                                    result.records.forEach(record => {

                                        var from = record.get('from');
                                        if (from) {
                                            if (nodesIndex.indexOf(from.identity.toNumber()) === -1) {
                                                nodesIndex.push(from.identity.toNumber());
                                                graph.nodes.push(
                                                    {
                                                        id: from.identity.toNumber(),
                                                        labels: from.labels,
                                                        properties: from.properties
                                                    }
                                                );
                                            }
                                        }

                                        var to = record.get('to');
                                        if (to) {
                                            if (nodesIndex.indexOf(to.identity.toNumber()) === -1) {
                                                nodesIndex.push(to.identity.toNumber());

                                                //wrap node
                                                graph.nodes.push(
                                                    {
                                                        id: to.identity.toNumber(),
                                                        labels: to.labels,
                                                        properties: to.properties
                                                    }
                                                );
                                            }
                                        }

                                        var r = record.get('r');
                                        if (r) {
                                            graph.edges.push(
                                                {
                                                    id: r.identity.toNumber(),
                                                    source: r.start.toNumber(),
                                                    target: r.end.toNumber(),
                                                    type: r.type
                                                }
                                            );
                                        }

                                    });

                                    resolve(graph);
                                },
                                reason => {
                                    log.error("Rejected : " + JSON.stringify(reason));
                                    reject(reason);
                                })
                            .catch(error => {
                                log.error("Catch : " + JSON.stringify(error));
                                reject(error);
                            });

                    },
                    reason => {
                        log.error("Rejected : " + JSON.stringify(reason));
                        reject(reason);
                    })
                .catch(error => {
                    log.error("Catch : " + JSON.stringify(error));
                    reject(error);
                });
        })
    }

}

export default Neo4jService;
