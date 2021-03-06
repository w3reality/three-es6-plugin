three-es6-plugin
================

A webpack plugin for es6-exporting scripts under ``three/examples/js/``.

Good parts:  this plugin

- provides ES6 module interface by transparently re-using original ``mrdoob/three.js``,
- allows complete configuration of scripts to export,
- is orthogonal to ``mrdoob/three.js`` (hence, always "up-to-date").

We have created this plugin as a webpack-based |ss| solution |se| workaround to: `Transform examples/js to support modules <https://github.com/mrdoob/three.js/issues/9562>`__.

How it works?  The plugin dynamically transforms and exports ``mrdoob/three.js`` scripts as ES6 module.  This generic approach was inspired by `marcofugaro/three-addons <https://github.com/marcofugaro/three-addons>`__, which does the same sort of stuff (but in a hardcoded way).


.. |ss| raw:: html

   <strike>

.. |se| raw:: html

   </strike>


Install
-------

..  code::
   
    $ npm install three three-es6-plugin

Upon invocation, the plugin references ``mrdoob/three.js`` source code.  So
make sure to install the original package *three* as well.

Usage
-----

With this plugin, we can flexibly specify which classes (in ``mrdoob/three.js``)
to ES6-export.  Here, we show a sample usage exporting
``OrbitControls``, ``OBJLoader``, ``MTLLoader``, and ``DDSLoader``.

**1)** Include the plugin in ``webpack.config.js`` as follows.  So far, the last workaround line is necessary ;( (cf. `webpack/watchpack/issues/25 <https://github.com/webpack/watchpack/issues/25>`__).

..  code::

    const webpack = require('webpack');
    const ThreeEs6Plugin = require('three-es6-plugin/dist');

    plugins.push(new ThreeEs6Plugin([
        'three/examples/js/controls/OrbitControls.js',  // <-- customize as you like
        'three/examples/js/loaders/OBJLoader.js',       // <--
        'three/examples/js/loaders/MTLLoader.js',       // <--
        'three/examples/js/loaders/DDSLoader.js',       // <--
    ]));

    // workaround for infinite watch-compile loop...
    plugins.push(new webpack.WatchIgnorePlugin([ /three-es6-plugin\/es6\/.*\.js$/, ]));


**2)** In ES6 code, we can now access the exported classes via ``three-es6-plugin/es6/``.

..  code::

    import * as THREE from 'three';
    import OrbitControls from 'three-es6-plugin/es6/OrbitControls';
    import OBJLoader from 'three-es6-plugin/es6/OBJLoader';
    import MTLLoader from 'three-es6-plugin/es6/MTLLoader';
    import DDSLoader from 'three-es6-plugin/es6/DDSLoader';

    const controls = new OrbitControls(...);
    const objl = new OBJLoader();
    const mtll = new MTLLoader();
    const ddsl = new DDSLoader();

    // ...

Demo
====

A standalone demo is here: `three-es6-plugin-demo <https://github.com/w3reality/three-es6-plugin-demo>`__
