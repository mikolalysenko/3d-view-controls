'use strict'

module.exports = createCamera

var now         = require('right-now')
var createView  = require('3d-view')

function createCamera(element, options) {
  element = element || document.body
  options = options || {}

  var view = createView(options)

  var matrix  = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
  var pmatrix = matrix.slice()
  var eye     = [0,0,0]
  var up      = [0,0,0]
  var center  = [0,0,0]
  var limits  = [0,0]
  var distance = 0.0

  var camera = {
    element:            element,
    delay:              options.delay || 20,
    rotateSpeed:        options.rotateSpeed || 1,
    zoomSpeed:          options.zoomSpeed || 1,
    translateSpeed:     options.translateSpeed || 1,
    flipX:              !!options.flipX,
    flipY:              !!options.flipY,
    modes:              camera.modes,
    tick: function() {
      var t = now()
      view.idle(t-camera.delay)
      view.flush(t-(100+camera.delay*2))
      var ctime = t - 2 * delay
      view.getMatrix(ctime, pmatrix)
      var allEqual = true
      for(var i=0; i<16; ++i) {
        allEqual = allEqual && (pmatrix[i] === matrix[i])
        matrix[i] = pmatrix[i]
      }
      if(!allEqual) {
        view.getUp(ctime, up)
        view.getCenter(ctime, center)
        view.getEye(ctime, eye)
        distance = view.getDistance(ctime)
      }
      return allEqual
    },
    lookAt: function(center, eye, up) {
      view.lookAt(view.lastT(), center, eye, up)
    },
    rotate: function(pitch, yaw, roll) {
      view.rotate(view.lastT(), pitch, yaw, roll)
    },
    pan: function(dx, dy, dz) {
      view.pan(view.lastT(), dx, dy, dz)
    },
    translate: function(dx, dy, dz) {
      view.translate(view.lastT(), dx, dy, dz)
    }
  }

  Object.defineProperties(camera, {
    matrix: {
      get: function() {
        return matrix
      },
      set: function(mat) {
        view.setMatrix(view.lastT(), mat)
        return mat
      },
      enumerable: true
    },
    mode: {
      get: function() {
        return view.getMode()
      },
      set: function(mode) {
        view.setMode(mode)
        return view.getMode()
      },
      enumerable: true
    },
    center: {
      get: function() {
        return center
      },
      set: function(center) {
        view.lookAt(view.lastT(), center)
        return view.getCenter(view.lastT(), center)
      },
      enumerable: true
    },
    eye: {
      get: function() {
        return eye
      },
      set: function(eye) {
        view.lookAt(view.lastT(), null, eye)
        return view.getEye(view.lastT(), eye)
      },
      enumerable: true
    },
    up: {
      get: function() {
        return up
      },
      set: function(up) {
        view.lookAt(view.lastT(), null, null, up)
        return view.getUp(view.lastT(), up)
      },
      enumerable: true
    },
    distance: {
      get: function() {
        return distance
      },
      set: function(d) {
        view.setDistance(view.lastT(), d)
        return view.getDistance(view.lastT(), d)
      },
      enumerable: true
    },
    distanceLimits: {
      get: function() {
        return limits
      },
      set: function(v) {
        view.setDistanceLimits(v)
        return v
      },
      enumerable: true
    }
  })
  
  element.addEventListener('contextmenu', function(ev) {
    ev.preventDefault()
    ev.stopPropagation()
    return false
  })

  var lastX = 0, lastY = 0
  element.addEventListener('mousemove', function(ev) {
    var x       = ev.clientX
    var y       = ev.clientY
    var left    = element.clientLeft
    var right   = element.clientRight
    var top     = element.clientTop
    var bottom  = element.clientBottom
    var scale   = 1.0 / Math.min(right - left, bottom - top)
    var dx      = scale * (x - left)
    var dy      = scale * (y - top)

    var flipX = camera.flipX ? 1 : -1
    var flipY = camera.flipY ? 1 : -1

    if(ev.shiftKey && ev.buttons & 1) {
      view.rotate(now(), 0, 0, -dx * camera.rotateSpeed * Math.PI)
    } else if(ev.buttons & 1) {
      view.rotate(now(), flipX * Math.PI * dx, -flipY * Math.PI * dy, 0)
    } else if(ev.buttons & 2) {
      view.pan(now(), camera.translateSpeed * dx, camera.translateSpeed * dy, 0)
    } else if(ev.buttons & 4) {
      //TODO: zoom?
    }

    lastX = x
    lastY = y
  })

  element.addEventListener('wheel', function(ev) {
    var dr = ev.deltaY
    //TODO: zoom
  })

  return camera
}