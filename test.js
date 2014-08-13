var indexer = require('./');

var should = require('should');

var fs = require('fs');


describe('static-indexer', function () {
  var result = {},
    jsonPath = './fixture/indexer.json';

  before(function (done) {
    if (fs.existsSync(jsonPath)) {
      fs.unlinkSync(jsonPath);
    }

    indexer('./fixture', {output: jsonPath}, function (err, path, index) {
      if (err) {
        throw err;
      }

      result = {
        path: path,
        index: index
      };

      done();
    });
  });

  it('should create specified json', function () {
    should(fs.existsSync('./fixture/indexer.json')).be.ok;
    result.path.should.equal('./fixture/indexer.json');
  });

  it('should have a indexed list', function () {
    result.index.should.be.type('object');
  });
});

