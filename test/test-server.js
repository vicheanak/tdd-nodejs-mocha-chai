process.env.NODE_ENV = 'test';
var chai = require('chai');
var chaiHttp = require('chai-http');

var should = chai.should();
var server = require('../app');

chai.use(chaiHttp);

var Product = require('../models/product');

describe('Products', function(){

    Product.collection.drop();

    beforeEach(function(done){
        var newProduct = new Product({
            name: 'iPhone'
        });
        newProduct.save(function(err){
            done();
        })
    });

    afterEach(function(done){
        Product.collection.drop();
        done();
    });

    it('Should create a SINGLE product in /products POST', function(done){
        chai.request(server)
            .post('/api/products')
            .send({name: 'iPhone'})
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('SUCCESS');
                res.body.SUCCESS.should.have.property('name');
                res.body.SUCCESS.name.should.equal('iPhone');
                done();
            });
    });

    it('Should get ALL products in /products GET', function(done){
        chai.request(server)
            .get('/api/products')
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('name');
                res.body[0].name.should.equal('iPhone');
                done();
            })
    });

    it('Should get a SINGLE product in /products/:id GET', function(done){
        var newProduct = new Product({
            name: 'Samsung'
        });
        newProduct.save(function(err, data){
            chai.request(server)
                .get('/api/product/'+data.id)
                .end(function(error, res){
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('_id');
                    res.body.name.should.equal('Samsung');
                    res.body._id.should.equal(data.id);
                    done();
                })
        })
    });

    it('Should update a SINGLE product in /product/:id PUT', function(done){
        chai.request(server)
            .get('/api/products')
            .end(function(error, response){
                chai.request(server)
                    .put('/api/product/'+response.body[0]._id)
                    .send({name: 'Black Berry'})
                    .end(function(err, res){
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.have.property('UPDATED');
                        res.body.UPDATED.should.have.property('_id');
                        res.body.UPDATED.should.have.property('name');
                        res.body.UPDATED.name.should.equal('Black Berry');
                        res.body.UPDATED._id.should.equal(response.body[0]._id);
                        done();
                    })
            })
    });

    it('Should delete a SINGLE product in /product/:id DELETE', function(done){
        chai.request(server)
            .get('/api/products')
            .end(function(error, response){
                chai.request(server)
                    .delete('/api/product/'+response.body[0]._id)
                    .end(function(err, res){
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.have.property('REMOVED');
                        res.body.REMOVED.should.have.property('name');
                        res.body.REMOVED.should.have.property('_id');
                        res.body.REMOVED.name.should.equal('iPhone');
                        res.body.REMOVED._id.should.equal(response.body[0]._id);
                        done();
                    });
            })
    });

});
