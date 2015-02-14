# 3d-view-controls
An easy to use 3D camera that works out of the box.  This is a wrapper over 3d-view with extra features to allow for 

# Example

```javascript
var createCamera = require('3d-view-controls')
var bunny = require('bunny')
var perspective = require('gl-mat4/perspective')
var fit = require('canvas-fit')
var createMesh = require('gl-simplicial-complex')

var canvas = document.createElement('canvas')
var gl = canvas.getContext('webgl')
document.body.appendChild(canvas)

window.addEventListener('resize', fit(canvas))

var camera = createCamera({
  eye:    [0,0,10],
  mode:   'orbit'
})

var mesh = createMesh(gl, {
  cells:      bunny.cells,
  positions:  bunny.positions,
  cellColor:  [1,0,0]
})

function render() {
  requestAnimationFrame(render)

  camera.tick()

  mesh.draw({
    projection: perspective([])
    view: camera.matrix
  })
}

render()
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
* `options` is an object with the following optional properties:
    + `eye`
    + `center`
    + `up`
    + `mode`
    + `delay`
    + `rotateSpeed`
    + `zoomSpeed`
    + `translateSpeed`
    + `flipX`
    + `flipY`
    + `distanceLimits`

## Geometric properties

#### `camera.matrix`
The current view matrix for 

#### `camera.mode`
The current interaction mode for the camera.  Possible values include:

* `turntable`
* `orbit`
* `matrix`

#### `camera.modes`
An array of all supported mdoes for the camera.  Defaults to `['turntable', 'orbit', 'matrix']`

#### `camera.eye`
The position of the camera in world coordinates

#### `camera.up`
A vector pointing up in world coordinates

#### `camera.center`
The target of the camera in world coordinates

#### `camera.distance`
Euclidean distance from `eye` to `center`

## Methods

#### `camera.tick()`
Updates the camera state.  Call this before each frame is rendered to compute the current state of the camera.

#### `camera.lookAt(center, eye, up)`

#### `camera.rotate(pitch, yaw, roll)`

#### `camera.pan(dx, dy, dz)`

#### `camera.translate(dx, dy, dz)`


## Tuning parameters

#### `camera.distanceLimits`

#### `camera.flipX`

#### `camera.flipY`

#### `camera.delay`

#### `camera.rotateSpeed`

#### `camera.zoomSpeed`

#### `camera.translateSpeed`

#### `camera.element`


# License
(c) 2015 Mikola Lysenko. MIT License