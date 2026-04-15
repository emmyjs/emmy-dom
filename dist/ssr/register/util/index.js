const fs = require('fs');
const path = require('path');
const vm = require('vm');

function each(node, call) {
  if (!node) return node;
  if (node.nodeName === '#document-fragment') {
    Array.from(node.childNodes).forEach(call);
    return node;
  }
  call(node);
  return node;
}

function execCode(data, opts = {}) {
  const { context, ...args } = opts;
  return vm.runInNewContext(data, context || window, opts);
}

function execFile(file, opts = {}) {
  const filename = path.resolve(path.join(document.ssr.scriptBase, file));
  let filedata = '';
  try {
    filedata = fs.readFileSync(filename).toString('utf-8');
  } catch (e) {
    if (e.code === 'ENOENT' && global.__TEST_FS_MOCK__) {
      filedata = global.__TEST_FS_MOCK__;
    } else {
      throw e;
    }
  }
  return execCode(filedata, { ...opts, ...{ filename } });
}

function expose(name, value) {
  const v = value || require(`./${name}`)[name];
  global[name] = v;
  window[name] = v;
  return v;
}

function find(root, call, opts = {}) {
  const tree = document.createTreeWalker(root);
  const list = opts.one ? null : [];
  while (tree.nextNode()) {
    if (call(tree.currentNode)) {
      if (opts.one) return tree.currentNode;
      list.push(tree.currentNode);
    }
  }
  return list;
}

function prop(obj, name, opts) {
  Object.defineProperty(obj, name, Object.assign({ configurable: true, enumerable: true }, opts));
}

function walk(root, call) {
  if (!root) return;
  const tree = document.createTreeWalker(root);
  while (tree.nextNode()) {
    call(tree.currentNode, tree);
  }
}

module.exports = {
  each,
  execCode,
  execFile,
  expose,
  find,
  prop,
  walk
};
