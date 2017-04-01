/**
* module name:  electron-data
* author:       Dominik Winter
* version:      2.0.1
* release date: 01.04.2017
*/

(() => {
  'use strict';

  const fs    = require('fs-promise');
  const home  = require('user-home');
  const path  = require('path');

  const has_json_ext = require('./lib/has-json-ext');

  const def_options = {
    filename: 'data',
    path: home +'/.electron-app',
    autosave: false,
    prettysave: false,
    lastUpdate: false
  };

  const self = {
    data: {},
    options: {}
  };

  /**
   * Configuration for electron-data
   * 
   * @param {Object} options - An object containing the options to override 
   */
  const config = options => {
    // Set the options
    self.options = Object.assign(def_options, options);

    // Build the filepath
    let filename = (has_json_ext(self.options.filename)) ? self.options.filename : self.options.filename +'.json';
    self.filepath = path.join(self.options.path, filename);
  };

  /**
   * Get the current settings
   * 
   * @return {Promise<Object>} The options object
   */
  const getOptions = () => {
    return Promise.resolve(self.options);
  };

  /**
   * Checks if the stored data has a value with given key.
   * 
   * @param {String} key - A String to search for in the data object properties
   * @return {Promise<Boolean>} A boolean value, either true when key exists or false if it doesn´t
   */
  const has = key => {
    return Promise.resolve(self.data.hasOwnProperty(key));
  };

  /**
   * Get the value for given key.
   * 
   * @param {String} key - A String to search for in the data object properties.
   * @return {Promise<?>} Any type of valid JSON value, if the key exists. 
   */
  const get = key => {
    return has(key)
    .then(has => {
      if (!has) throw new Error(`No value for: ${key}`);
      return self.data[key];
    });
  };

  /**
   * Set a key => value pair.
   * 
   * @param {String} key - A String to add to the data object properties.
   * @param {?} value - Any valid JSON value to add to "key"
   * @return {Promise<Object>} The whole data object
   */
  const set = (key, value) => {
    if (!key) return Promise.reject(new Error('key must be given.'));
    if (typeof key !== 'string') return Promise.reject(new Error('key must be a string.'));
    
    if (value === undefined || (typeof value === 'number' && isNaN(value))) return Promise.reject(new Error('value must be a valid JSON value. See http://www.json.org/'));

    try {
      self.data[key] = value;

      if (self.options.autosave) {
        return save().then(() => self.data);
      } else {
        return Promise.resolve(self.data);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Remove a key => value at given key.
   * 
   * @param {String} key - A String to remove from the data object.
   * @return {Promise<boolean>|Promise<Error>}
   */
  const unset = key => {
    if (!key) return Promise.reject(new Error('key must be given.'));

    try {
      let deleted = delete self.data[key];

      if (self.options.autosave) {
        return save().then(() => deleted);
      } else {
        return Promise.resolve(deleted);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Clear the whole data object. Caution: The data can´t be recoverd.
   * 
   * @return {Promise<Object>} An empty object
   */
  const clear = () => {
    self.data = {};

    if (self.options.autosave) {
      return save().then(() => self.data);
    } else {
      return Promise.resolve(self.data);
    }
  };

  /**
   * Save the data to a JSON file. Change the config to move the location and the filename.
   * 
   * @return {Promise<undefined>|Promise<Error>}
   */
  const save = () => {
    let pretty  = (self.options.prettysave) ? 2 : null,
      data      = Object.assign({}, self.data);

    if (self.options.lastUpdate) data.lastUpdate = new Date(Date.now()).toISOString();

    return fs.outputFile(self.filepath, JSON.stringify(data, null, pretty), 'utf-8');
  };

  /**
   * Get the whole data object.
   * 
   * @private
   * @return {Promise<Object>} The whole data object
   */
  const __getAll = () => {
    return Promise.resolve(self.data);
  };

  /**
   * Extend/Override the whole data object. 
   * 
   * @private
   * @param {Object} data - An Object to set as data object.
   * @return {Promise<Object>} The whole data object
   */
  const __setAll = data => {
    if (!data) return Promise.reject(new Error('data must be given.'));
    self.data = Object.assign({}, self.data, data);
    return Promise.resolve(self.data);
  };

  module.exports = {config, getOptions, has, get, set, unset, clear, save, __getAll, __setAll};
})();
