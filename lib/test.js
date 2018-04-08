'use strict'

require("should-http");
require("dotenv").config({ path: "../variables.env" });

const supertest = require("supertest");
const assert = require("assert");
const should = require("should");
const mocha = require("mocha");



const server = supertest.agent("http://localhost:"+process.env.PORT);
console.log(server);

describe ("Nodepop 2 Test", function(){
    this.timeout(15000);
    var token=null;
    before((done)=>{
        server
          .post("/authenticate")
          .set("user-agent", "Postman")
          .send({ email: "user@example.com", password: "1234" })
          .end((err, res) => {
            token=res.body.token;
            done();
          });
    });
    it('Should return home page', (done)=>{
        server
        .get('/')
        .expect('Content-type',/html/)
        .expect(200)
        .end((err,res)=>{
            res.status.should.equal(200);
            done();
        });
    });
    it('Access to Ads API without token Should return error 401', (done)=>{
        server
        .get('/api/ads')
        .set('user-agent','Postman')
        .expect('Content-type',/json/)
        .expect(401)
        .end((err,res)=>{
            res.status.should.equal(401);
            done();
        })
    });
    it("Access to Users API without token Should return error 401", done => {
      server
        .get("/api/users")
        .set("user-agent", "Postman")
        .expect("Content-type", /json/)
        .expect(401)
        .end((err, res) => {
          res.status.should.equal(401);
          done();
        });
    });
    it('Access to API with correct credentials should return JWT', (done)=>{
        server
          .post("/authenticate")
          .set("user-agent", "Postman")
          .send({ email: "user@example.com", password: "1234" })
          .expect("Content-type", /json/)
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            res.body.token.should.exist;
            done();
          });
    });
    it('Should receive API Ads with proper token', (done)=>{
        server
          .get("/api/ads")
          .set("Accept", "application/json")
          .set("user-agent", "Postman")
          .set("x-access-token", token)
          .expect("Content-type", /json/)
          .expect(200)
          .end((err, res) => {
            res.status.should.equal(200);
            const result=res.body;
            result[0]._id.should.exist;
            result[0].name.should.exist;
            result[0].sale.should.exist;
            result[0].price.should.exist;
            done();
          });
    });
    it("Should receive 401 error when accessing ads with expired token", done => {
      server
        .get("/api/ads")
        .set("Accept", "application/json")
        .set("user-agent", "Postman")
        .set("x-access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYzdiY2RhM2E2ZTQ2MTRmNDA4NWQ0OSIsImlhdCI6MTUyMzA1MTQ4MywiZXhwIjoxNTIzMDU1MDgzfQ.a_PR6d-HpPTQmbRs8DmCmQqwJt0XZTBKccBtfE30C5M")
        .expect("Content-type", /json/)
        .expect(401)
        .end((err, res) => {
          res.status.should.equal(401);
          res.body.message.should.equal('jwt expired');
          res.body.details.should.exist;
          done();
        });
    });
    it("Should receive API Users with proper token", done => {
      server
        .get("/api/users")
        .set("Accept", "application/json")
        .set("user-agent", "Postman")
        .set("x-access-token", token)
        .expect("Content-type", /json/)
        .expect(200)
        .end((err, res) => {
          res.status.should.equal(200);
          const result = res.body;
          result[0]._id.should.exist;
          result[0].name.should.exist;
          result[0].email.should.exist;
          result[0].password.should.exist;
          done();
        });
    });
    it("Should receive 401 error when accessing users with expired token", done => {
      server
        .get("/api/users")
        .set("Accept", "application/json")
        .set("user-agent", "Postman")
        .set("x-access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYzdiY2RhM2E2ZTQ2MTRmNDA4NWQ0OSIsImlhdCI6MTUyMzA1MTQ4MywiZXhwIjoxNTIzMDU1MDgzfQ.a_PR6d-HpPTQmbRs8DmCmQqwJt0XZTBKccBtfE30C5M")
        .expect("Content-type", /json/)
        .expect(401)
        .end((err, res) => {
          res.status.should.equal(401);
          res.body.message.should.equal("jwt expired");
          res.body.details.should.exist;
          done();
        });
    });
});





