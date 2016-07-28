import neo4j from "neo4j-driver/lib/browser/neo4j-web";

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
                .then(result => {
                    var labels = [];
                    result.records.forEach(record => {
                        labels.push(record.get("label"));
                    });
                    resolve(labels);
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
                .then(result => {
                    var rels = [];
                    result.records.forEach(record => {
                        rels.push(record.get("relationshipType"));
                    });
                    resolve(rels);
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
                .then(result => {
                    var labels = [];
                    result.records.forEach(record => {
                        labels.push(record.get("propertyKey"));
                    });
                    resolve(labels);
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
                .then(result => {
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
                .then(result => {
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
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    cypher(query) {
        return new Promise((resolve, reject) => {
            this.session.run(query)
                .then(result => {
                    var rs = [];
                    result.records.forEach(record => {
                        var item = {};
                        record.forEach( (value,key) => {
                            item[key] = value;
                            if(typeof value.toNumber === 'function') {
                                item[key] = value.toNumber();
                            }
                        });
                        rs.push(item);
                    });
                    resolve(rs);
                })
                .catch(error => {
                    reject(error);
                });
        })
    }

    graph(query) {

    }

}

export default Neo4jService;
