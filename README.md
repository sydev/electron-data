# electron-data

An easy way to save data, settings or anything else as JSON file in an
application folder, using a simple localStorage-like API.

Primary developed to work with [Electron](https://github.com/atom/electron),
but also works in any node application.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
-	[API](#api)
- [Development](#development)
-	[Release Notes](#release-notes)

## Installation

```
npm install --save electron-data
```

That´s all. You´re done. But wait...You want to use it, too?

## Usage

With Electron:
```JavaScript
var app = require('electron').app;
var ElectronData = require('electron-data');

var settings = new ElectronData({
  path: app.getPath('userData'),
  filename: 'settings'
});
```

Without Electron:
```JavaScript
var ElectronData = require('electron-data');

var settings = new ElectronData({
  path: 'path/to/whatever/you/want',
  filename: 'settings'
});
```

When using ```electron-data``` without [Electron](https://github.com/atom/electron), the file will be automatically created in your home directory like that: ```/path/to/whatever/you/want/settings.json```.

Now you can do some magic with the ```settings``` variable. How? I will tell you now.

## API

### Methods

##### ```new ElectronData(options)```
Returns a new ElectronData instance.
- ```options``` Object (optional)
    - ```filename``` String - Name for the file that will be stored and used. Default is ```data```
    - ```path``` String - **When using [Electron](https://github.com/atom/electron), use ```app.getPath('userData')``` as value.** Absolute path to your application directory. Will be created if not already exists. Default is ```home-dir-of-os/.electron-app/```
    - ```autosave``` Boolean - If ```true```, the file will be updated on every file change. Default is ```false```
    - ```prettysave``` Boolean - If ```true```, the content of the file will be in a human readable format. Default is ```false```
    - ```lastUpdate``` Boolean - If "true", a property is set, which contains the last update datetime.

##### ```ElectronData.getOptions()```
Returns the options as object.


##### ```ElectronData.has(key)```
Checks if the data file has a property named ```key```. Returns boolean.
- ```key``` String - Property name


##### ```ElectronData.get(key)```
If key is given and the data file has an property named ```key```, returns the value of given ```key```. Else returns all data.
- ```key``` String (optional) - Property name


##### ```ElectronData.set(key, value)```
Sets the given ```value``` to the given ```key``` in the data file. If one of both is missing, the key isn´t a
string or the value isn´t a valid JSON value, the function throws an error. For an overview of allowed value
types, have a look at [json.org](http://www.json.org/).
- ```key``` String - Property name
- ```value``` ? - Property value. Can be any JSON conform data.


##### ```ElectronData.unset(key)```
Unsets the property named ```key```.
- ```key``` String - Property name


##### ```ElectronData.clear()```
Clears all data. Be careful, the data can´t be restored.


##### ```ElectronData.save(callback)```
Saves the data to the specified file.
- ```callback``` Function - callback function


# Development

Run test:
```
npm test
```


## Release Notes
- ```1.2.2```
  - Reload the data on ElectronDate.get()
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
