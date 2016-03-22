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

  let data = {};
  let filepath;


  /**
  *
  */
  class ElectronData {

    constructor(changedOptions) {
      let self = this;

      this.setOptions(changedOptions);

      filepath = options.path +'/'+ options.filename +'.json';

      try {
        fs.accessSync(options.path, fs.F_OK);
      } catch(e) {
        mkdirp(options.path);
      }

      try {
        fs.accessSync(filepath, fs.F_OK);
        data = require(filepath);
      } catch(e) {
        fs.writeFileSync(filepath, '{}');
      }

      // Watch the data and updates the json file on change
      Object.observe(data, (changes) => {
        self.update();
      });

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
    *
    */
    setOptions(changedOptions) {
      for (let p in changedOptions) {
        if (p == 'appName') options.appName = changedOptions.appName;
        if (p == 'filename') options.filename = changedOptions.filename;
        if (p == 'path') options.path = changedOptions.path;
      }
    }

    /**
    *
    */
    has(key) {
      return data.hasOwnProperty(key);
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
      if (!key) return data;

      for (let p in data) {
        if (p == key) {
          return data[p];
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

      data[key] = value;
      return data;
    }


    /**
    *
    */
    unset(key) {
      if (!key) return false;

      delete data[key];
      return data;
    }


    /**
    *
    */
    clear() {
      data = {};
      return data;
    }


    /**
    *
    */
    update() {
      fs.writeFile(filepath, JSON.stringify(data), (err) => {
        if (err) throw err;
      });
    }

  }

  module.exports = ElectronData;
})();
