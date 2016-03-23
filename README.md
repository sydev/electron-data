# electron-data

An easy way to save data, settings or anything else as JSON file in an application folder,
using a simple localStorage-like API.

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

That´s all. You´re done. But wait...You want to use
it, too?

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
  dirname: 'fancy-dir-name',
  filename: 'settings'
});
```

When using ```electron-data``` without [Electron](https://github.com/atom/electron), the file will be automatically created in your home directory like that: ```/.fancy-dir-name/settings.json```.

Now you can do some magic with the ```settings``` variable. How? I will tell you now.

## API

### Methods

##### ```new ElectronData(options)```
Returns a new ElectronData instance.
- ```options``` Object (optional)
    - ```dirname``` String - Only needed if you will use ```electron-data``` without [Electron](https://github.com/atom/electron). Default is ```electron-app```
    - ```filename``` String - Name for the file that will be stored and used. Default is ```data```
    - ```path``` String - **When using [Electron](https://github.com/atom/electron), use ```app.getPath('userData')``` as value.** Absolute path to your application directory. Will be created if not already exists. Default is ```home-dir-of-os/.electron-app/```


##### ```ElectronData.getOptions()```
Returns the options as object.


##### ```ElectronData.has(key)```
Checks if the data file has a property named ```key```. Returns boolean.
- ```key``` String - Property name


##### ```ElectronData.get(key)```
If key is given and the data file has an property named ```key```, returns the value of given ```key```. Else returns all data.
- ```key``` String (optional) - Property name


##### ```ElectronData.set(key, value)```
Sets the given ```value``` to the given ```key``` in the data file. If one of both is missing, returns false.
- ```key``` String - Property name
- ```value``` ? - Property value. Can be any JSON conform data.


##### ```ElectronData.unset(key)```
Unsets the property named ```key```.
- ```key``` String - Property name


##### ```ElectronData.clear()```
Clears all data. Be careful, the data can´t be restored.


##### ```ElectronData.save()```
Saves the data to the specified file.


# Development

Run test:
```
npm test
```


## Release Notes
- ```1.0``` - Initial release
