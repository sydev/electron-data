# electron-data

[![Build Status](https://travis-ci.org/sydev/electron-data.svg?branch=v2.x)](https://travis-ci.org/sydev/electron-data)

An easy way to save data, settings or anything else as JSON file in an
application folder, using a simple localStorage-like API, but promisified.

For version 1.x see the [v1.x branch](https://github.com/sydev/electron-data/tree/v1.x)

Primary developed to work with [Electron](https://github.com/atom/electron), but also works in any node application.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Examples](#examples)
- [Development](#development)
- [Release Notes](#release-notes)

## Installation

```
$ npm install --save electron-data
```

That´s all. You´re done. But wait...You want to use it, too?

## Usage

With Electron:
```JavaScript
const app           = require('electron').app;
const electron_data = require('electron-data');

electron_data.config({/* Your config */});
```

Without Electron:
```JavaScript
const electron_data = require('electron-data');

electron_data.config({/* Your config */});
```

Without any configuration, the file will be automatically created in your home directory like that: ```$HOME/.electron-app/data.json```.

## API

### Methods

##### ```electron_data.config(options)```
- ```options``` Object (required)
    - ```filename``` String - Name for the file that will be stored and used. Default is ```data```
    - ```path``` String - **When using [Electron](https://github.com/atom/electron), use ```app.getPath('userData')``` as value.** Absolute path to your application directory. Will be created if not already exists. Default is ```home-dir-of-os/.electron-app/```
    - ```autosave``` Boolean - If ```true```, the file will be updated on every data change. Default is ```false```
    - ```prettysave``` Boolean - If ```true```, the content of the file will be in a more human readable format. Default is ```false```
    - ```lastUpdate``` Boolean - If "true", a property is set, which contains the last update datetime.

##### ```electron_data.getOptions()```
Resolves the options as object.


##### ```electron_data.has(key)```
Checks if the data file has a property named ```key```. Resolves boolean.
- ```key``` String (required) - Key name


##### ```electron_data.keys()```
Resolves an array of all presented keys in the data object.


##### ```electron_data.get(key)```
If the data file has an property named ```key```, resolves the value of given ```key```.
- ```key``` String (required) - Key name


##### ```electron_data.getMany(keys)```
Resolves an object containing given keys and their values. If one or more keys aren´t presented at the data object, they will be skipped.
- ```keys``` Array (required) - Array of key names.


##### ```electron_data.getAll()```
Resolves the whole data object, even if it´s empty.


##### ```electron_data.set(key, value)```
Sets the given ```value``` to the given ```key``` in the data file. If one of both is missing, the key isn´t a string or the value isn´t a valid JSON value, the promise rejects an error. For an overview of allowed value types, have a look at [json.org](http://www.json.org/).
- ```key``` String - Property name
- ```value``` ? - Property value. Can be any JSON conform data.


##### ```electron_data.setMany(object)```
Sets all key => value pairs from given object to the data object. Overrides previous values with the same key.
- ```object``` Object (required) - A valid JSON object.


##### ```electron_data.unset(key)```
Deletes the key => value pair @```key```.
- ```key``` String - Key name


##### ```electron_data.clear()```
Clears all data. Be careful, the data can´t be restored.


##### ```electron_data.save(callback)```
Saves the data to the specified file.


# Examples

```JavaScript
const electron_data = require('electron-data');

electron_data.config({
  filename: 'example',
  path: '/my/awesome/directory'
});

electron_data.getOptions()
  .then(options => {
    console.log(options);
    /*
    {
      filename: 'example',
      path: '/my/awesome/directory',
      autosave: false,
      prettysave: false,
      lastUpdate: false
    }
    */
  });

// Store a key => value
electron_data.set('my-prop', {'awesome': 'module'})
  .then(data => {
    console.log(data); // {'awesome': 'module'}
  }); 

// Save the data to a JSON file
electron_data.save()
  .then(error => {
    console.log(error); // undefined
  });

// Check if the data has a value for "my-prop"
electron_data.has('my-prop')
  .then(has_key => {
    console.log(has_key); // true
  });

// Get the value for "my-prop"
electron_data.get('my-prop')
  .then(value => {
    console.log(value); // {'awesome': 'module'}
  });

// Remove "my-prop"
electron_data.unset('my-prop')
  .then(deleted => {
    console.log(deleted); // true
  });

// Clear all data
electron_data.clear()
  .then(data => {
    console.log(data); // {}
  });
```

You can enable ```autosave```, so you don´t have to explicit save your data.

```JavaScript
electron_data.config({autosave: true});
```

To save the data more readable, set the ```prettysave``` option.

```JavaScript
electron_data.config({prettysave: true});
```

To save a ```lastUpdate``` value , set the ```lastUpdate```option.

```JavaScript
electron_data.config({lastUpdate: true});
```

# Development

Run test:
```
npm test
```


## Release Notes
- ```2.1.0```
  - Add new methods (getMany, getAll, setMany, keys). For more informations, read the [API-Section](#api)
  - Some bugfixes
- ```2.0.1```
  - Some bugfixes
- ```2.0.0```
  - Promisify all methods
  - Not using the object-oriented notation anymore. For more informations have a look [@Usage](#usage)
- ```1.2.2```
  - Reload the data on ElectronData.get()
- ```1.2.1```
  - Fixed: silent error on non-valid JSON values (Issue #1). For an overview of allowed
    value types, have a look at [json.org](http://www.json.org/).
- ```1.2```
  - removed ```Object.observe``` polyfill and added an elegant Proxy solution.
  - added ```lastUpdate``` option. Read [Usage](#usage) for further informations.
- ```1.1.1```
  - added ```Object.observe``` polyfill, because is removed in future V8 releases
- ```1.1```
  - removed ```dirname``` from constructor options
  - added ```autosave```
  - added ```prettysave```
  - added callback to ```save``` function
- ```1.0``` - Initial release
