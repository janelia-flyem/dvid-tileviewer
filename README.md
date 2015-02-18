dvid-tileviewer
===============

Experimental repo for DVID multiscale2d viz using the open-source [OpenSeadragon](openseadragon.github.io) tile viewer.
Allows viewing in XY, XZ, and YZ cut planes.

Dependencies
----

Required to build the javascript.

1. node - http://nodejs.org/
2. npm - https://www.npmjs.com/

Installation
----

1. Clone or download this repository

2. Install dependencies

  ```shell
  npm install
  ```

3. Configure the repository information in sections annotated in js/src/common/config.js

4. Bundle the javascript

  ```shell
  grunt
  ```

Usage
----

Copy the files in the dist directory to your web server or open dist/index.html
in your web browser via the File menu.

