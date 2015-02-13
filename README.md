# 3d-view-controls
An easy to use 3D camera that works out of the box.  This is a wrapper over 3d-view with extra features to allow for 

# Example

```javascript
var createCamera = require('3d-view-controls')

```

# Install

```
npm i 3d-view-controls
```

# API

## Constructor

#### `var camera = require('3d-view-controls')(element[, options])`
Creates a new camera object.

* `element` is a DOM node onto which this
* `options` is an object with the following optional properties

## Properties

#### `camera.matrix`

#### `camera.mode`

#### `camera.modes`

#### `camera.eye`

#### `camera.up`

#### `camera.center`

#### `camera.distance`

#### `camera.distanceLimits`

#### `camera.flipX`

#### `camera.flipY`

#### `camera.delay`

#### `camera.rotateSpeed`

#### `camera.zoomSpeed`

#### `camera.translateSpeed`

#### `camera.element`

## Methods

#### `camera.tick()`

#### `camera.lookAt(center, eye, up)`

#### `camera.rotate(pitch, yaw, roll)`

#### `camera.pan(dx, dy, dz)`

#### `camera.translate(dx, dy, dz)`

# License
(c) 2015 Mikola Lysenko. MIT License