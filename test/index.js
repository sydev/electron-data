(function() {
  'use strict';

  const chai = require('chai');
  const ElectronData = require('../index.js');
  const path = require('path');
  const fs = require('fs');

  const PATH_TO_TEMP = path.join(__dirname, '.tmp');


  var expect = chai.expect;

  var ed;
  var filepath;

  describe('ElectronData', () => {

    // Construct class
    it('should create file in ".tmp"', (done) => {
      ed = new ElectronData({
        path: PATH_TO_TEMP
      });

      filepath = path.join(PATH_TO_TEMP, 'data.json');

      fs.access(PATH_TO_TEMP, (err) => {
        expect(err).to.be.null;
        done();
      });
    });

    // get options
    it('should get options', (done) => {
      let options = ed.getOptions();
      expect(options).to.be.an('object');
      done();
    });

    // set key
    it('should set key "test" with value "test_value"', (done) => {
      ed.set('test', 'test_value');

      expect(ed.data.hasOwnProperty('test')).to.be.true;
      expect(ed.data.test).to.equal('test_value');
      done();
    });

    // has key
    it('should has key named "test"', (done) => {
      expect(ed.has('test')).to.be.true;
      done();
    });

    // get key
    it('should get value of "test"', (done) => {
      expect(ed.get('test')).to.equal('test_value');
      done();
    });

    // unset key
    it('should unset property "test"', (done) => {
      expect(ed.unset('test')).to.be.true;
      done();
    });

    // save file
    it('should save "{"test": "test_value"}" in file', (done) => {
      ed.set('test', 'test_value');
      ed.save();

      fs.readFile(filepath, 'utf-8', (err, data) => {
        data = JSON.parse(data);

        expect(err).to.be.null;
        expect(ed.has('test')).to.be.true;
        expect(data.test).to.equal('test_value');
        done();
      });
    });

    // clear data
    it('should clear all data', (done) => {
      expect(ed.clear()).to.be.empty;
      done();
    });


  });
})();
