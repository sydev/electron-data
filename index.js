/**
* module name:  electron-data
* author:       Dominik Winter
* version:      1.2.2
* release date: 31.03.2017
*/

(function() {
  'use strict';

  const home      = require('user-home');
  const mkdirp    = require('mkdirp');
  const fs        = require('fs');
  const reload    = require('require-reload')(require);


  /**
  * ElectronData()
  * Creates an instance of this class. Also creates a file named like dirname
  * in the given path. If using with Atom´s Electron, set path as the return of
  * "app.getPath('userData')", the builtin function of Electron.
  *
  * @param {Object} options
  *   - {String} filename - Name for the file that will be stored and used.
  *       Default is "data"
  *   - {String} path - **When using Electron, use "app.getPath('userData')" as
  *       value. Absolute path to your application directory. Will be created
  *       if not already exists. Default is "home-dir-of-os/.electron-app/"
  *   - {Boolean} autosave - If "true", the file will be updated on every
  *       change. Default is "false"
  *   - {Boolean} prettysave - If "true", the content of the file will be in a
  *       human readable format. Default is "false"
  *   - {Boolean} lastUpdate - If "true", a property is set, which contains the
  *       last update datetime.
  */
  class ElectronData {

    constructor(changedOptions) {
      let self = this;

      self.data = {};
      self.options = {
        filename: 'data',
        path: home +'/.electron-app',
        autosave: false,
        prettysave: false,
        lastUpdate: false
      };

      self._setOptions(changedOptions);

      self.filepath = self.options.path +'/'+ self.options.filename +'.json';

      try {
        fs.accessSync(self.options.path, fs.F_OK);
      } catch(e) {
        mkdirp(self.options.path);
      }

      try {
        fs.accessSync(self.filepath, fs.F_OK);
        self.data = require(self.filepath);
      } catch(e) {
        fs.writeFileSync(self.filepath, JSON.stringify(self.data));
      }

      return self;
    }


    /**
    * getOptions()
    * Returns the default options extended by user
    *
    * @return {Object} options
    */
    getOptions() {
      let self = this;
      return self.options;
    }


    /**
    * _setOptions()
    * Private function to set the options given by constructor
    *
    */
    _setOptions(changedOptions) {
      let self = this;

      for (let p in changedOptions) {
        self.options[p] = changedOptions[p];
      }
    }


    /**
    * has()
    * Checks if given key is a property in actual data. Returns true or false.
    *
    * @param {String} key - String to check if is property in data
    * @return {Boolean}
    */
    has(key) {
      let self = this;
      return self.data.hasOwnProperty(key);
    }


    /**
    * get()
    * Returns the property given by param. If no param is given, return all
    * data.
    *
    * @param {string} key
    * @return {?} property value / data
    */
    get(key) {
      let self  = this,
        item    = null;

      self.data = reload(self.filepath);

      if (!key) return self.data;

      for (let p in self.data) {
        if (p == key) {
          item = self.data[p];
          break;
        }
      }

      return item;
    }


    /**
    * set()
    * Sets the given value and given key in data, and return all data. If no
    * key or value is given, or the value is an unsupported JSON value type, an
    * error is thrown.
    *
    * @param {string} key
    * @param {?} value
    * @return {Object/Boolean}
    */
    set(key, value) {
      let self  = this,
        err     = null;

      if (!key || typeof key !== 'string') {
        err = new Error('Key must be string.');
      }

      if (value === undefined || (typeof value === 'number' && isNaN(value))) {
        err = new Error('Value must be a valid JSON value.');
      }

      if (err !== null) throw err;

      self.data[key] = value;

      if (self.options.autosave) { self.save(); }

      return self.data;
    }


    /**
    * unset()
    * Unsets a property-value pair by a given key. Returns boolean.
    *
    * @param {String} key - deleteable property name
    * @return {Boolean}
    */
    unset(key) {
      if (!key) return false;

      let self = this;

      let result = delete self.data[key]

      if (self.options.autosave) { self.save(); }

      return result;
    }


    /**
    * clear()
    * Clears all data. Be careful: Deleted data can´t be restored.
    *
    * @return {Object} data - the emptied data set
    */
    clear() {
      let self = this;

      self.data = {};
      return self.data;
    }


    /**
    * save()
    * Saves the actual data to the file selected in constructor.
    *
    * @param {Function} cb - callback
    * @return {Boolean}
    */
    save(cb) {
      let self  = this,
        content = null,
        saved   = null;

      if (self.options.lastUpdate) {
        let timestamp = Date.now(),
          date = new Date(timestamp).toLocaleString();

        self.data.lastUpdate = date;
      } else {
        if (self.data.hasOwnProperty('lastUpdate')) delete self.data.lastUpdate;
      }

      if (self.options.prettysave) {
        content = JSON.stringify(self.data, null, 2);
      } else {
        content = JSON.stringify(self.data);
      }


      if (cb) {
        fs.writeFile(self.filepath, content, {encoding: 'utf-8', flag: 'w+'}, (err) => {
          saved = (err) ? false : true;
          cb(err, saved);
        });
      } else {
        saved = fs.writeFileSync(self.filepath, content, {encoding: 'utf-8', flag: 'w+'});
        return saved;
      }
    }

  }

  module.exports = ElectronData;
})();
