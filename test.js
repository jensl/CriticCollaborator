/* -*- mode: js; js-indent-level: 2 -*- */

"use strict";

Module.load("github.js");

function main(method, path, query) {
  writeln("200");
  writeln("Content-Type: text/plain");
  writeln();

  var repository = new critic.Repository("critic");

  writeln(repository.run(
}
