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

  describe('ElectronData (no options)', () => {

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

  // With autosave function
  describe('ElectronData (autosave)', () => {

    it('should create file in ".tmp"', (done) => {
      ed = new ElectronData({
        filename: 'data-autosave',
        path: PATH_TO_TEMP,
        autosave: true
      });

      filepath = path.join(PATH_TO_TEMP, 'data-autosave.json');

      fs.access(PATH_TO_TEMP, (err) => {
        expect(err).to.be.null;
        done();
      });
    });

    // set key
    it('should set key "test" with value "test_value" and save it in file (autosave)', (done) => {
      ed.set('test', 'test_value');

      fs.readFile(filepath, {encoding: 'utf-8'}, (err, data) => {
        expect(err).to.be.equal(null);
        expect(JSON.parse(data)).to.be.object;
        expect(JSON.parse(data).hasOwnProperty('test')).to.be.equal(true);
        expect(JSON.parse(data).test).to.be.equal('test_value');
        done();
      });
    });

  });

  // With prettysave function
  describe('ElectronData (prettysave)', () => {

    it('should create file in ".tmp"', (done) => {
      ed = new ElectronData({
        filename: 'data-prettysave',
        path: PATH_TO_TEMP,
        prettysave: true
      });

      filepath = path.join(PATH_TO_TEMP, 'data-prettysave.json');

      fs.access(PATH_TO_TEMP, (err) => {
        expect(err).to.be.null;
        done();
      });
    });

    // set key
    it('should set key "test" with value "test_value" and save it in pretty', (done) => {
      ed.set('test', 'test_value');
      ed.save();

      fs.readFile(filepath, {encoding: 'utf-8'}, (err, data) => {
        expect(err).to.be.null;
        expect(JSON.parse(data)).to.be.object;
        expect(data).to.be.equal(JSON.stringify({test: 'test_value'}, null, 2));
        done();
      });
    });

  });

  // With lastUpdate function
  describe('ElectronData (lastUpdate)', () => {

    it('should create file in ".tmp"', (done) => {
      ed = new ElectronData({
        filename: 'data-lastUpdate',
        path: PATH_TO_TEMP,
        lastUpdate: true
      });

      filepath = path.join(PATH_TO_TEMP, 'data-lastUpdate.json');

      fs.access(PATH_TO_TEMP, (err) => {
        expect(err).to.be.null;
        done();
      });
    });

    // set key
    it('should set key "test" with value "test_value" and save it with lastUpdate property', (done) => {
      ed.set('test', 'test_value');
      ed.save();

      fs.readFile(filepath, {encoding: 'utf-8'}, (err, data) => {
        expect(err).to.be.null;
        expect(JSON.parse(data)).to.be.object;
        expect(data.lastUpdate).to.be.string;
        done();
      });
    });

  });
})();
