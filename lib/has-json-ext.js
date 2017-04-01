(() => {
  'use strict';

  /**
   * Check if filename has a json extension
   * 
   * @param {String} filename
   * @return {Boolean} 
   */
  module.exports = filename => {
    let regex = /(\.json)$/g;
    
    return regex.test(filename);
  };

})();
