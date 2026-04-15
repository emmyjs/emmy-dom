const path = require('path')
const vm = require('vm')
const util = require('../util/index.js');

function trigger(obj, data) {
  if (obj && obj.onmessage) {
    obj.onmessage({ data })
  }
}

const context = {
  onmessage: null,
  postMessage(msg) {
    trigger(this, msg)
  }
}

class Worker {
  constructor(file) {
    util.execFile(file, { context })
  }
  postMessage(msg) {
    trigger(this, msg)
  }
}

module.exports = Worker
