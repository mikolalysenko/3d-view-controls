'use strict'

module.exports = createCamera

var now         = require('right-now')
var createView  = require('3d-view')
var mouseChange = require('mouse-change')
var mouseWheel  = require('mouse-wheel')

function createCamera(element, options) {
  element = element || document.body
  options = options || {}

  var limits  = [ 0.01, Infinity ]
  
  if('distanceLimits' in options) {
    limits[0] = options.distanceLimits[0]
    limits[1] = options.distanceLimits[1]
  }
  if('zoomMin' in options) {
    limits[0] = options.zoomMin
  }
  if('zoomMax' in options) {
    limits[1] = options.zoomMax
  }

  var view = createView({
    center: options.center || [0,0,0],
    up:     options.up     || [0,1,0],
    eye:    options.eye    || [0,0,10],
    mode:   options.mode   || 'orbit',
    distanceLimits: limits
  })

  var matrix  = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  var pmatrix = matrix.slice()
  var eye     = [0,0,0]
  var up      = [0,0,0]
  var center  = [0,0,0]
  var distance = 0.0

  var camera = {
    element:            element,
    delay:              options.delay          || 16,
    rotateSpeed:        options.rotateSpeed    || 1,
    zoomSpeed:          options.zoomSpeed      || 1,
    translateSpeed:     options.translateSpeed || 1,
    flipX:              !!options.flipX,
    flipY:              !!options.flipY,
    modes:              view.modes,
    tick: function() {
      var t = now()
      var delay = this.delay
      view.idle(t-delay)
      view.flush(t-(100+delay*2))
      var ctime = t - 2 * delay
      view.getMatrix(ctime, pmatrix)
      var allEqual = true
      for(var i=0; i<16; ++i) {
        allEqual = allEqual && (pmatrix[i] === matrix[i])
        matrix[i] = pmatrix[i]
      }
      if(allEqual) {
        return false
      }
      view.getUp(ctime, up)
      view.getCenter(ctime, center)
      view.getEye(ctime, eye)
      distance = view.getDistance(ctime)
      return true
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
        return matrix
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
      set: function(ncenter) {
        view.lookAt(view.lastT(), ncenter)
        return center
      },
      enumerable: true
    },
    eye: {
      get: function() {
        return eye
      },
      set: function(neye) {
        view.lookAt(view.lastT(), null, neye)
        return eye
      },
      enumerable: true
    },
    up: {
      get: function() {
        return up
      },
      set: function(nup) {
        view.lookAt(view.lastT(), null, null, nup)
        return up
      },
      enumerable: true
    },
    distance: {
      get: function() {
        return distance
      },
      set: function(d) {
        view.setDistance(view.lastT(), d)
        return distance
      },
      enumerable: true
    },
    distanceLimits: {
      get: function() {
        return view.getDistanceLimits(limits)
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
    return false
  })

  var lastX = 0, lastY = 0
  mouseChange(element, function(buttons, x, y, mods) {
    var scale = 1.0 / Math.min(element.clientWidth, element.clientHeight)
    var dx    = scale * (x - lastX)
    var dy    = scale * (y - lastY)

    var flipX = camera.flipX ? 1 : -1
    var flipY = camera.flipY ? 1 : -1

    var drot  = Math.PI * camera.rotateSpeed

    if(buttons & 1) {
      if(mods.shift) {
        view.rotate(now(), 0, 0, -dx * drot)
      } else {
        view.rotate(now(), flipX * drot * dx, -flipY * drot * dy, 0)
      }
    } else if(buttons & 2) {
      view.pan(now(), camera.translateSpeed * dx * distance, -camera.translateSpeed * dy * distance, 0)
    } else if(buttons & 4) {
      view.pan(now(), 0, 0, camera.zoomSpeed * dy * distance)
    }

    lastX = x
    lastY = y
  })

  mouseWheel(element, function(dx, dy, dz) {
    var flipX = camera.flipX ? 1 : -1
    var t = now()
    if(Math.abs(dx) > Math.abs(dy)) {
      view.rotate(t, 0, 0, -dx * flipX * Math.PI * camera.rotateSpeed / window.innerWidth)
    } else {
      view.pan(t, 0, 0, camera.zoomSpeed * dy / window.innerHeight * distance)
    }
  }, true)

  return camera
}