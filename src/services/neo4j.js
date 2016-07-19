import neo4j from "neo4j-driver/lib/browser/neo4j-web";

/**
 * Service that communicate with Neo4j server.
 */
class Neo4jService {

    /**
     * Default constructor.
     *
     * @param url Connection url to the database (ex: bolt://localhost)
     * @param user User login of the database
     * @param password User password of the database
     */
    constructor(url, user, password) {
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
                    var labels = [];
                    result.records.forEach(record => {
                        labels.push(record.get("relationshipType"));
                    });
                    resolve(labels);
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

}

export default Neo4jService;
