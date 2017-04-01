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
   * @param {Object} options 
   */
  const config = options => {
    // Set the options
    self.options = Object.assign(def_options, options);

    // Build the filepath
    let filename = (has_json_ext(self.options.filename)) ? self.options.filename : self.options.filename +'.json';
    self.filepath = path.join(self.options.path, filename);
  };

  /**
   * @return {Promise} options
   */
  const getOptions = () => {
    return Promise.resolve(self.options);
  };

  /**
   * 
   * @param {String} key
   * @return {Promise} has key
   */
  const has = key => {
    return Promise.resolve(self.data.hasOwnProperty(key));
  };

  /**
   * 
   * @param {String} key 
   * @return {Promise} 
   */
  const get = key => {
    return has(key)
    .then(has => {
      if (!has) throw new Error(`No value for: ${key}`);
      return self.data[key];
    });
  };

  /**
   * 
   * @param {String} key 
   * @param {?} value 
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
   * @param {String} key
   * @return {Promise}
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
   * @return {Promise}
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
   * @return {Promise}
   */
  const save = () => {
    let pretty = (self.options.prettysave) ? 2 : null;
    let data = JSON.stringify(self.data, null, pretty);

    return fs.outputFile(self.filepath, data, 'utf-8');
  };


  /**
   * @return {Promise}
   */
  const __getAll = () => {
    return Promise.resolve(self.data);
  };

  /**
   * 
   * @param {Object} data 
   * @return {Promise}
   */
  const __setAll = data => {
    if (!data) return Promise.reject(new Error('data must be given.'));
    self.data = Object.assign({}, self.data, data);
    return Promise.resolve(self.data);
  };

  module.exports = {config, getOptions, has, get, set, unset, clear, save, __getAll, __setAll};
})();
