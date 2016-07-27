import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import neo4j from "~/services/neo4j/neo4j-baobab";
import tree from "~/store";

chai.use(chaiAsPromised);

describe('neo4j', () => {

    it('return db labels', done => {
        neo4j.labels()
            .then(result => {
                chai.expect(result.length).to.equal(2);
                done();
            })
            .catch(error => {
                done(error);
            });
    });

    it('return db relationship type', done => {
        neo4j.relationshipTypes()
            .then(result => {
                chai.expect(result.length).to.equal(6);
                done();
            })
            .catch(error => {
                done(error);
            });
    });

    it('return db properties', done => {
        neo4j.propertyKeys()
            .then(result => {
                chai.expect(result.length).to.equal(14);
                done();
            })
            .catch(error => {
                done(error);
            });
    });

    it('Integration with baobab', () => {
        tree.set('neo4j', {
            login: "neo4j",
            password: "bla",
            url: "bolt://localhost"
        });
        tree.commit();

        return chai.assert.isRejected(neo4j.labels());
    });
});