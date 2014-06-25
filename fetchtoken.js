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

function main(method, path, query) {
  function fail(message) {
    writeln("400");
    writeln("Content-Type: text/plain");
    writeln();
    writeln(message);
  }

  if (query.params.state != critic.storage.get("state"))
    return fail("Bad state parameter!");

  var code = query.params.code;
  var owner = new critic.User("jl");
  var data = JSON.parse((new critic.Storage(owner)).get("data:system"));

  var request = new URL.Request(
    "POST", "https://github.com/login/oauth/access_token");

  request.setRequestHeader("Accept", "application/json");
  request.setRequestBody(
    format(
      "client_id=%s&client_secret=%s&code=%s",
      data["client_id"],
      data["client_secret"],
      code));
  request.perform();

  if (!/^HTTP\/\d\.\d 200 /.test(request.statusLine)) {
    return fail(format(
      "Request failed: %s\n\n%s", request.statusLine, request.responseBody));
  }

  var response = JSON.parse(request.responseBody);
  var oauth_token = response["access_token"];

  critic.storage.set("oauth-token", oauth_token);

  writeln("307");
  writeln("Location: /CriticCollaborator/setup");
  writeln();
}
