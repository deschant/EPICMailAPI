import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

const should = chai.should();
const { expect } = chai;

chai.use(chaiHttp);

describe('Groups - V2', () => {
  describe('POST - /api/v2/groups', () => {
    let userToken;

    it('it should login test user', (done) => {
      // login and get test user token
      const user1 = {
        email: 'deschantkounou@epic.mail',
        password: 'R72cal20',
      };

      chai
        .request(app)
        .post('/api/v2/auth/signin')
        .send(user1)
        .end((err, res) => {
          userToken = res.body.data[0].token;
          done();
        });
    });

    let groupId;

    it('it should create a new group', (done) => {
      const newGroup = {
        groupName: 'Avengers',
      };

      chai
        .request(app)
        .post('/api/v2/groups')
        .set('token', userToken)
        .send(newGroup)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.data.should.be.a('array');
          res.body.data[0].should.be.a('object');
          groupId = res.body.data[0].id;
          done();
        });
    });

    it('it should not create a new group without a name', (done) => {
      const newGroup = {
      };

      chai
        .request(app)
        .post('/api/v2/groups')
        .set('token', userToken)
        .send(newGroup)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('it should get a user\'s groups', (done) => {
      chai
        .request(app)
        .get('/api/v2/groups')
        .set('token', userToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a('array');
          res.body.data[0].should.be.a('object');
          done();
        });
    });

    it('it should update a user\'s group name', (done) => {
      chai
        .request(app)
        .patch(`/api/v2/groups/${groupId}/name`)
        .set('token', userToken)
        .send({ groupName: 'Aminou' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a('array');
          res.body.data[0].should.be.a('object');
          expect(res.body.data[0].name).to.equal('Aminou');
          done();
        });
    });
  });
});
