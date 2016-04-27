MantidWeb
=========

This is a prototype web interface for the Mantid data analysis software. The
contents of this repository are licensed under the GNU General Public License
version 3.

Quickstart
----------

Use `make` to build the server, `make server` to run it. You'll need to set the
correct paths to the Mantid source code (and binaries) in the Makefile.

Client uses `npm` to manage dependencies and build. Local test server can be run with `npm run server`.

Issues / Todo
-------------

* Graphs interface is unfinished
  * Need a way to create/destroy graphs and set properties (colors, labels) on them
  * Need a way to fetch data required to render a graph client-side
