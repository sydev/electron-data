(function() {
  'use strict';

  const chai          = require('chai');
  const ElectronData  = require('../index.js');
  const fs            = require('fs');
  const path          = require('path');

  const PATH_TO_TEMP  = path.join(__dirname, '.tmp');


  let expect  = chai.expect,
    should    = chai.should();

  let ed;
  let filepath;

  const rimraf = path => {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach((file, index) => {
        let curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };

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

      ed.save((err, saved) => {
        expect(err).to.be.null;
        expect(saved).to.be.true;

        fs.readFile(filepath, 'utf-8', (err, data) => {
          data = JSON.parse(data);

          expect(err).to.be.null;
          expect(ed.has('test')).to.be.true;
          expect(data.test).to.equal('test_value');
          done();
        });
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

      fs.readFile(filepath, 'utf-8', (err, data) => {
        data = JSON.parse(data);

        expect(err).to.be.equal(null);
        expect(data).to.be.object;
        expect(data.hasOwnProperty('test')).to.be.true;
        expect(data.test).to.be.equal('test_value');
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

      ed.save((err, saved) => {
        expect(err).to.be.null;
        expect(saved).to.be.true;

        fs.readFile(filepath, 'utf-8', (err, data) => {
          data = JSON.parse(data);

          expect(err).to.be.null;
          expect(data).to.be.object;
          expect(data.test).to.be.equal('test_value');
          done();
        });
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

      ed.save((err, saved) => {
        expect(err).to.be.null;
        expect(saved).to.be.true;

        fs.readFile(filepath, 'utf-8', (err, data) => {
          data = JSON.parse(data);

          expect(err).to.be.null;
          expect(data).to.be.object;
          expect(data.lastUpdate).to.be.string;
          done();
        });
      });
    });

  });

  // Some tests on primitive types
  describe('Setting different primitive types', () => {

    after(() => rimraf(PATH_TO_TEMP));

    it('should create file in ".tmp"', (done) => {
      ed = new ElectronData({
        filename: 'data-primitives',
        path: PATH_TO_TEMP
      });

      filepath = path.join(PATH_TO_TEMP, 'data-primitives.json');

      fs.access(PATH_TO_TEMP, (err) => {
        expect(err).to.be.null;
        done();
      });
    });

    it('should set "number" to 0', (done) => {
      ed.set('number', 0);

      ed.save((err, saved) => {
        expect(err).to.be.null;
        expect(saved).to.be.true;

        fs.readFile(filepath, 'utf-8', (err, data) => {
          data = JSON.parse(data);

          expect(err).to.be.null;
          expect(data).to.be.object;
          expect(data.number).to.be.equal(0);
          done();
        });
      });
    });

    it('should set "number" to 1', (done) => {
      ed.set('number', 1);

      ed.save((err, saved) => {
        expect(err).to.be.null;
        expect(saved).to.be.true;

        fs.readFile(filepath, 'utf-8', (err, data) => {
          data = JSON.parse(data);

          expect(err).to.be.null;
          expect(data).to.be.object;
          expect(data.number).to.be.equal(1);
          done();
        });
      });
    });

    it('should set "number" to 0 with `new Number()`', (done) => {
      ed.set('number', new Number());

      ed.save((err, saved) => {
        expect(err).to.be.null;
        expect(saved).to.be.true;

        fs.readFile(filepath, 'utf-8', (err, data) => {
          data = JSON.parse(data);

          expect(err).to.be.null;
          expect(data).to.be.object;
          expect(data.number).to.be.equal(0);
          done();
        });
      });
    });

    it('should set "number" to 1 with `new Number(1)`', (done) => {
      ed.set('number', new Number(1));

      ed.save((err, saved) => {
        expect(err).to.be.null;
        expect(saved).to.be.true;

        fs.readFile(filepath, 'utf-8', (err, data) => {
          data = JSON.parse(data);

          expect(err).to.be.null;
          expect(data).to.be.object;
          expect(data.number).to.be.equal(1);
          done();
        });
      });
    });

    it('should set "string" to ""', (done) => {
      ed.set('string', '');

      ed.save((err, saved) => {
        expect(err).to.be.null;
        expect(saved).to.be.true;

        fs.readFile(filepath, 'utf-8', (err, data) => {
          data = JSON.parse(data);

          expect(err).to.be.null;
          expect(data).to.be.object;
          expect(data.string).to.be.empty;
          done();
        });
      });
    });

    it('should set "string" to "" with `new String()`', (done) => {
      ed.set('string', new String());

      ed.save((err, saved) => {
        expect(err).to.be.null;
        expect(saved).to.be.true;

        fs.readFile(filepath, 'utf-8', (err, data) => {
          data = JSON.parse(data);

          expect(err).to.be.null;
          expect(data).to.be.object;
          expect(data.string).to.be.empty;
          done();
        });
      });
    });

    it('should set "string" to "test_string" with `new String("test_string")`', (done) => {
      ed.set('string', new String('test_string'));

      ed.save((err, saved) => {
        expect(err).to.be.null;
        expect(saved).to.be.true;

        fs.readFile(filepath, 'utf-8', (err, data) => {
          data = JSON.parse(data);

          expect(err).to.be.null;
          expect(data).to.be.object;
          expect(data.string).to.be.eql('test_string');
          done();
        });
      });
    });

    it('should set "bool" to false', (done) => {
      ed.set('bool', false);

      ed.save((err, saved) => {
        expect(err).to.be.null;
        expect(saved).to.be.true;

        fs.readFile(filepath, 'utf-8', (err, data) => {
          data = JSON.parse(data);

          expect(err).to.be.null;
          expect(data).to.be.object;
          expect(data.bool).to.be.false;
          done();
        });
      });
    });

    it('should set "bool" to true', (done) => {
      ed.set('bool', true);

      ed.save((err, saved) => {
        expect(err).to.be.null;
        expect(saved).to.be.true;

        fs.readFile(filepath, 'utf-8', (err, data) => {
          data = JSON.parse(data);

          expect(err).to.be.null;
          expect(data).to.be.object;
          expect(data.bool).to.be.true;
          done();
        });
      });
    });

    it('should set "bool" to false with `new Boolean()`', (done) => {
      ed.set('bool', new Boolean());

      ed.save((err, saved) => {
        expect(err).to.be.null;
        expect(saved).to.be.true;

        fs.readFile(filepath, 'utf-8', (err, data) => {
          data = JSON.parse(data);

          expect(err).to.be.null;
          expect(data).to.be.object;
          expect(data.bool).to.be.false;
          done();
        });
      });
    });

    it('should set "bool" to false with `new Boolean(0)`', (done) => {
      ed.set('bool', new Boolean(0));

      ed.save((err, saved) => {
        expect(err).to.be.null;
        expect(saved).to.be.true;

        fs.readFile(filepath, 'utf-8', (err, data) => {
          data = JSON.parse(data);

          expect(err).to.be.null;
          expect(data).to.be.object;
          expect(data.bool).to.be.false;
          done();
        });
      });
    });

    it('should set "bool" to true with `new Boolean(1)`', (done) => {
      ed.set('bool', new Boolean(1));

      ed.save((err, saved) => {
        expect(err).to.be.null;
        expect(saved).to.be.true;

        fs.readFile(filepath, 'utf-8', (err, data) => {
          data = JSON.parse(data);

          expect(err).to.be.null;
          expect(data).to.be.object;
          expect(data.bool).to.be.true;
          done();
        });
      });
    });

    it('should set "test" to null', (done) => {
      ed.set('test', null);

      ed.save((err, saved) => {
        expect(err).to.be.null;
        expect(saved).to.be.true;

        fs.readFile(filepath, 'utf-8', (err, data) => {
          data = JSON.parse(data);

          expect(err).to.be.null;
          expect(data).to.be.object;
          expect(data.test).to.be.null;
          done();
        });
      });
    });

    it('should throw error on setting "test" to undefined', (done) => {
      (function() {
        ed.set('test', undefined);
      }).should.throw(Error, /must be a valid JSON value/);
      done();
    });

    it('should throw error on setting "test" to NaN', (done) => {
      (function() {
        ed.set('test', NaN);
      }).should.throw(Error, /must be a valid JSON value/);
      done();
    });

  });


})();
