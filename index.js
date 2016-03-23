/**
* module name:  electron-data
* author:       Dominik Winter
* version:      1.0
* release date: 23.03.2016
*/

(function() {
  'use strict';

  const home    = require('user-home');
  const mkdirp  = require('mkdirp');
  const fs      = require('fs');


  /**
  * ElectronData()
  * Creates an instance of this class. Also creates a file named like dirname
  * in the given path. If using with Atom´s Electron, set path as the return of
  * "app.getPath('userData')", the builtin function of Electron.
  *
  * @param {Object} options
  *   - {String} dirname - Only needed if you will use this moduel without
  *       Electron. Default is "electron-app"
  *   - {String} filename - Name for the file that will be stored and used.
  *       Default is "data"
  *   - {String} path - **When using Electron, use "app.getPath('userData')" as
  *       value. Absolute path to your application directory. Will be created
  *       if not already exists. Default is "home-dir-of-os/.electron-app/"
  */
  class ElectronData {

    constructor(changedOptions) {
      let self = this;

      self.data = {};
      self.options = {
        dirname: 'electron-app',
        filename: 'data'
      };

      self.options.path = home +'/.'+ self.options.dirname;

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

      return this;
    }


    /**
    * getOptions()
    * Returns the default options extended by user
    *
    * @return {Object} options
    */
    getOptions() {
      return this.options;
    }


    /**
    * _setOptions()
    * Private function to set the options given by constructor
    *
    */
    _setOptions(changedOptions) {
      for (let p in changedOptions) {
        this.options[p] = changedOptions[p];
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
    * key or value is given, return false.
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
    * unset()
    * Unsets a property-value pair by a given key. Returns boolean.
    *
    * @param {String} key - deleteable property name
    * @return {Boolean}
    */
    unset(key) {
      if (!key) return false;

      return delete this.data[key];
    }


    /**
    * clear()
    * Clears all data. Be careful: Deleted data can´t be restored.
    *
    * @return {Object} data - the emptied data set
    */
    clear() {
      this.data = {};
      return this.data;
    }


    /**
    * save()
    * Saves the actual data to the file selected in constructor.
    *
    * @return {Boolean}
    */
    save() {
      fs.writeFile(this.filepath,
          JSON.stringify(this.data),
          {encoding: 'utf-8', flag: 'w+'},
          (err) => {

        if (err) throw err;
        return true;
      });
    }

  }

  module.exports = ElectronData;
})();
