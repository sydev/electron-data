(function() {
  'use strict';

  const home = require('user-home');
  const mkdirp = require('mkdirp');
  const fs = require('fs');

  // Global vars
  let options = {
    appName: 'electron-app',
    filename: 'data'
  };

  options.path = home +'/.'+ options.appName;

  let filepath;


  /**
  *
  */
  class ElectronData {

    constructor(changedOptions) {
      let self = this;
      self.data = {};

      self._setOptions(changedOptions);

      filepath = options.path +'/'+ options.filename +'.json';

      try {
        fs.accessSync(options.path, fs.F_OK);
      } catch(e) {
        mkdirp(options.path);
      }

      try {
        fs.accessSync(filepath, fs.F_OK);
        slef.data = require(filepath);
      } catch(e) {
        fs.writeFileSync(filepath, JSON.stringify(self.data));
      }

      return this;
    }


    /**
    * getOptions()
    * Returns the default options extended by user
    *
    * @return {Object} options
    */
    getOptions() {
      return options;
    }


    /**
    * _setOptions()
    *
    *
    */
    _setOptions(changedOptions) {
      for (let p in changedOptions) {
        options[p] = changedOptions[p];
      }
    }


    /**
    *
    */
    has(key) {
      return this.data.hasOwnProperty(key);
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
      if (!key) return this.data;

      for (let p in this.data) {
        if (p == key) {
          return this.data[p];
        }
      }
    }


    /**
    * set()
    * Sets the given value and given key in data, and return all data. If no
    * key or value is given, return false;
    *
    * @param {string} key
    * @param {?} value
    * @return {Object/Boolean}
    */
    set(key, value) {
      if (!key || !value) return false;

      this.data[key] = value;
      return this.data;
    }


    /**
    *
    */
    unset(key) {
      if (!key) return false;

      return delete this.data[key];
    }


    /**
    *
    */
    clear() {
      this.data = {};
      return this.data;
    }


    /**
    *
    */
    save() {
      fs.writeFile(filepath, JSON.stringify(this.data), {encoding: 'utf-8', flag: 'w+'}, (err) => {
        if (err) throw err;
        return true;
      });
    }

  }

  module.exports = ElectronData;
})();
