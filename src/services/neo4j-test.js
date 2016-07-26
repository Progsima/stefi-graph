import {expect, Assertion} from "chai";
import Neo4jService from "~/services/neo4j";

describe('neo4j', () => {

    let ns;

    beforeEach(() => {
        ns = new Neo4jService('bolt://localhost', 'neo4j', 'admin');
    });

    it('return db labels', done => {
        ns.labels()
            .then(result => {
                expect(result.length).to.equal(2);
                done();
            })
            .catch(error => {
                done(error);
            });
    });

    it('return db relationship type', done => {
        ns.relationshipTypes()
            .then(result => {
                expect(result.length).to.equal(6);
                done();
            })
            .catch(error => {
                done(error);
            });
    });

    it('return db properties',done => {
        ns.propertyKeys()
            .then(result => {
                expect(result.length).to.equal(14);
                done();
            })
            .catch(error => {
                done(error);
            });
    });
});
