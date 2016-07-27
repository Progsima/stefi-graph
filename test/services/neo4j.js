import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import graphDb from "~/services/neo4j";

chai.use(chaiAsPromised);

describe('neo4j', () => {

    it('return db labels', done => {
        graphDb.labels()
            .then(result => {
                chai.expect(result.length).to.equal(2);
                done();
            })
            .catch(error => {
                done(error);
            });
    });

    it('return db relationship type', done => {
        graphDb.relationshipTypes()
            .then(result => {
                chai.expect(result.length).to.equal(6);
                done();
            })
            .catch(error => {
                done(error);
            });
    });

    it('return db properties', done => {
        graphDb.propertyKeys()
            .then(result => {
                chai.expect(result.length).to.equal(14);
                done();
            })
            .catch(error => {
                done(error);
            });
    });

    it('Integration with baobab', () => {


        return chai.assert.isRejected(graphDb.labels());
    });
});
