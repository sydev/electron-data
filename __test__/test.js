(() => {
  'use strict';

  const fs = require('fs-promise');

  const electron_data = require('../index');

  let desired_config = {
        filename: 'test',
        path: __dirname +'/temp',
        autosave: false,
        prettysave: false,
        lastUpdate: false
      };

  describe('Init', () => {

    test('Config', () => {
      electron_data.config({filename: 'test', path: __dirname +'/temp'});
      
      return electron_data.getOptions()
        .then(options => {
          expect(options).toMatchObject(desired_config);
        })
        .catch(err => {
          expect(err).toBeNull();
        });
    });

  });

  describe('Setters', () => {

    test('Set many', () => {
      let desired_json = {
        set: 'many',
        at: ['once'],
        no: {problem: 'or?'}
      };

      return electron_data.setMany(desired_json)
        .then(data => expect(data).toMatchObject(desired_json))
        .then(() => electron_data.clear())
        .catch(err => expect(err).toBeNull());
    });

    test('Set key, value = String', () => {
      return electron_data.set('test-string', 'test')
        .then(data => expect(data).toMatchObject({'test-string': 'test'}))
        .catch(err => expect(err).toBeNull());
    });

    test('Set key, value = Object', () => {
      return electron_data.set('test-object', {'test': 'test'})
        .then(data => expect(data).toMatchObject({'test-object': {'test': 'test'}}))
        .catch(err => expect(err).toBeNull());
    });

    test('Set key, value = Array', () => {
      return electron_data.set('test-array', ['test'])
        .then(data => expect(data).toMatchObject({'test-array': ['test']}))
        .catch(err => expect(err).toBeNull());
    });

    test('Set key, value = Number', () => {
      return electron_data.set('test-number', 0)
        .then(data => expect(data).toMatchObject({'test-number': 0}))
        .catch(err => expect(err).toBeNull());
    });

    test('Set key, value = true', () => {
      return electron_data.set('test-true', true)
        .then(data => expect(data).toMatchObject({'test-true': true}))
        .catch(err => expect(err).toBeNull());
    });

    test('Set key, value = false', () => {
      return electron_data.set('test-false', false)
        .then(data => expect(data).toMatchObject({'test-false': false}))
        .catch(err => expect(err).toBeNull());
    });

    test('Set key, value = null', () => {
      return electron_data.set('test-null', null)
        .then(data => expect(data).toMatchObject({'test-null': null}))
        .catch(err => expect(err).toBeNull());
    });

    test('Set key, value = NaN, should throw an error', () => {
      return electron_data.set('test-nan', NaN)
        .then(data => expect(data).toBeNull())
        .catch(err => expect(err).toThrow());
    });

    test('Set key, value = undefined, should throw an error', () => {
      return electron_data.set('test-undefined', undefined)
        .then(data => expect(data).toBeNull())
        .catch(err => expect(err).toThrow());
    })

  });

  describe('Getters', () => {

    test('Get String', () => {
      return electron_data.get('test-string')
        .then(value => expect(value).toEqual('test'))
        .catch(err => expect(err).toBeNull());
    });

    test('Get Object', () => {
      return electron_data.get('test-object')
        .then(value => expect(value).toMatchObject({'test': 'test'}))
        .catch(err => expect(err).toBeNull());
    });

    test('Get Array', () => {
      return electron_data.get('test-array')
        .then(value => expect(value).toEqual(['test']))
        .catch(err => expect(err).toBeNull());
    });

    test('Get Number', () => {
      return electron_data.get('test-number')
        .then(value => expect(value).toEqual(0))
        .catch(err => expect(err).toBeNull());
    });
    
    test('Get Boolean: true', () => {
      return electron_data.get('test-true')
        .then(value => expect(value).toEqual(true))
        .catch(err => expect(err).toBeNull());
    });

    test('Get Boolean: false', () => {
      return electron_data.get('test-false')
        .then(value => expect(value).toEqual(false))
        .catch(err => expect(err).toBeNull());
    });
    
    test('Get Null', () => {
      return electron_data.get('test-null')
        .then(value => expect(value).toEqual(null))
        .catch(err => expect(err).toBeNull());
    });

    test('Get String, Object, Array at once', () => {
      let desired_json = {
        'test-string': 'test',
        'test-object': {'test': 'test'},
        'test-array': ['test']
      };

      return electron_data.getMany(['test-string', 'test-object', 'test-array'])
        .then(data => expect(data).toMatchObject(desired_json))
        .catch(err => expect(err).toBeNull());
    });

    test('Get all at once', () => {
      let desired_json = {
        'test-string': 'test',
        'test-object': {'test': 'test'},
        'test-array': ['test'],
        'test-number': 0,
        'test-true': true,
        'test-false': false,
        'test-null': null
      };

      return electron_data.getAll()
        .then(data => expect(data).toMatchObject(desired_json))
        .catch(err => expect(err).toBeNull());
    });

    test('Get keys', () => {
      let desired_arr = ['test-string', 'test-object', 'test-array', 'test-number', 'test-true', 'test-false', 'test-null'];

      return electron_data.keys()
        .then(keys => expect(keys).toMatchObject(desired_arr))
        .catch(err => expect(err).toBeNull());
    });

  });

  describe('Unset and clear', () => {

    let saved = null;

    beforeAll(() => {
      return electron_data.getAll()
        .then(data => saved = Object.assign({}, data));
    });

    afterAll(() => {
      return electron_data.setMany(saved);
    });

    test('unset', () => {
      return electron_data.unset('test-string')
        .then(deleted => expect(deleted).toEqual(true))
        .catch(err => expect(err).toBeNull());
    });

    test('clear', () => {
      return electron_data.clear()
        .then(data => expect(data).toMatchObject({}))
        .catch(err => expect(err).toBeNull());
    });

  });

  describe('Save', () => {

    afterAll(() => {
      return fs.remove(desired_config.path);
    });

    test('Save explicit', () => {
      let desired_json = {
        "test-string": "test",
        "test-object": {"test": "test"},
        "test-array": ["test"],
        "test-number": 0,
        "test-true": true,
        "test-false": false,
        "test-null": null
      };

      return electron_data.save()
        .then(res => {
          expect(res).toBe(undefined);

          return fs.readFile(desired_config.path +'/test.json', 'utf-8')
            .then(content => expect(JSON.parse(content)).toMatchObject(desired_json));
        })
        .catch(err => expect(err).toBeNull());
    });

    test('Autosave', () => {
      let desired_json = {
        "test-string": "test",
        "test-object": {"test": "test"},
        "test-array": ["test"],
        "test-number": 0,
        "test-true": true,
        "test-false": false,
        "test-null": null,
        "test-autosave": "test"
      };

      desired_config.autosave = true;

      electron_data.config({autosave: true});

      return electron_data.set('test-autosave', 'test')
        .then(data => {
          expect(data).toMatchObject(desired_json);

          return fs.readFile(desired_config.path +'/test.json', 'utf-8')
            .then(content => expect(JSON.parse(content)).toMatchObject(desired_json));
        })
        .catch(err => expect(err).toBeNull());
    });

    test('Save pretty', () => {
      let desired_json = {
          "test-string": "test",
          "test-object": {"test": "test"},
          "test-array": ["test"],
          "test-number": 0,
          "test-true": true,
          "test-false": false,
          "test-null": null,
          "test-autosave": "test",
          "test-prettysave": "test"
        };

      desired_config.prettysave = true;

      electron_data.config({prettysave: true});

      return electron_data.set('test-prettysave', 'test')
        .then(data => {
          expect(data).toMatchObject(desired_json);

          return fs.readFile(desired_config.path +'/test.json', 'utf-8')
            .then(content => {
              expect(JSON.parse(content)).toMatchObject(desired_json);
            });
        })
        .catch(err => expect(err).toBeNull());
    });

    test('Save with last update info', () => {
      desired_config.lastUpdate = true;

      electron_data.config({lastUpdate: true});

      return electron_data.set('test-lastUpdate', 'test')
        .then(data => {
          expect(data).toBeInstanceOf(Object);

          return fs.readFile(desired_config.path +'/test.json', 'utf-8')
            .then(content => {
              expect(JSON.parse(content)).toHaveProperty('lastUpdate');
              expect(new Date(JSON.parse(content).lastUpdate)).toBeInstanceOf(Date);
            });
        })
        .catch(err => expect(err).toBeNull());
    });

  });

})();
