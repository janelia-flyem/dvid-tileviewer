DVID Volume Viewer
===============

The DVID Volume Viewer is a javascript, browser based, tool for viewing the grayscale
imagery and segmentation data within a repository. It leverages the
[OpenSeadragon](openseadragon.github.io) tile viewer with some additional features specific
to this data type. For example, the imagery data can be interrogated in the XY, XZ, and YZ
cut planes. There is also an interface to allow quick navigation to any point in the 3D volume.
The intention is to facilitate quick investigation of the data without the need to install more
complicated analysis tools.

Dependencies
----

Required to build the javascript.

1. node - http://nodejs.org/
2. npm - https://www.npmjs.com/

Installation
----

1. Clone or download this repository

2. Change directory to the root of the repository

3. Install dependencies

  ```shell
  > npm install
  ```

4. Configure the repository information in js/src/common/config.js
  There are multiple sections with comments on what needs to be changed to fit
  the data instance being used.

5. Bundle the javascript and produce a packaged version.

  ```shell
  > grunt
  ```

Usage
----

The packaged version of the code can be found in the *'dist'* directory at the top level
of the repository. This directory can be uploaded to the html directory of a webserver for
use in production.

Alternatively, you can just open the *index.html* file, found in the *'dist'* directory, in
your browser from the **File** menu and it will load in the data from your DVID instance.

License
----

See LICENSE.txt
