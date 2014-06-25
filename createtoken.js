/* -*- mode: js; js-indent-level: 2; indent-tabs-mode: nil -*-

 Copyright 2014 Jens Lindström

 Licensed under the Apache License, Version 2.0 (the "License"); you may not
 use this file except in compliance with the License.  You may obtain a copy of
 the License at

   http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 License for the specific language governing permissions and limitations under
 the License.

*/

"use strict";

function generateState() {
  var state = "";

  while (state.length < 20)
    state += String(Math.random()).substring(2);

  return state.substring(0, 20);
}

function main(method, path, query) {
  var state = generateState();
  critic.storage.set("state", state);

  var redirect_uri = encodeURIComponent(
    "https://critic-review.org/CriticCollaborator/fetchtoken");

  var owner = new critic.User("jl");
  var data = JSON.parse((new critic.Storage(owner)).get("data:system"));  
  var url = format("https://github.com/login/oauth/authorize" +
                   "?client_id=%(client_id)s" +
                   "&redirect_uri=%(redirect_uri)s" +
                   "&scope=public_repo" +
                   "&state=%(state)s",
                   { client_id: data["client_id"],
                     redirect_uri: redirect_uri,
                     state: state });

  writeln("307");
  writeln("Location: %s", url);
  writeln();
}
