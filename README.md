# electron-data

**UNDER DEVELOPMENT** - Please do not use in production.

An easy way to save data, settings or anything else as JSON file in an application folder,
using a simple localStorage-like API.

Primarily created to work with [Electron](#https://github.com/atom/electron),
but also works in any node application.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
-	[API](#api)
-	[Release Notes](#release-notes)

## Installation

```
npm install --save electron-data
```

That´s all. You´re done. But wait...You want to use
it, too?

## Usage

```JavaScript
var ElectronData = require('electron-data');

var settings = new ElectronData({
  appName: 'your-app-name',
  filename: 'settings'
});
```

The file will be automatically created in your home directory like that: ```/.your-app-name/settings.json```. And with ```settings``` you can do some magic. How? I will tell you now.

## API

### Methods

##### ```new ElectronData(options)```
Returns a new ElectronData instance.
- ```options``` Object (optional)
    - ```appName``` String - Name of the application. Will be used for directory name. Default is ```electron-app```
    - ```filename``` String - Name for the file that will be stored and used. Default is ```settings```
    - ```path``` String - Absolute path to your application directory. Will be created if not exists already. Default is ```home-dir-of-os/.electron-app/```


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



## Release Notes
- ```0.1``` - Initial Release
