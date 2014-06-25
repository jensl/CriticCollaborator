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

var GitHub = (function () {
  function makeRequest(path) {
    var oauth_token = critic.storage.get("oauth-token");
    var request = new URL.Request("GET", "https://api.github.com" + path);

    request.setRequestHeader("Authorization", "token " + oauth_token);
    request.setRequestHeader("User-Agent", "jensl/CriticCollaborator");
    request.setRequestHeader("Accept", "application/json");
    request.perform();
    
    return request;
  }

  function responseStatus(request) {
    return parseInt(/^HTTP\/\d\.\d (\d{3}) /.exec(request.statusLine)[1]);
  }

  return {

    fetch: function (path) {
      var request = makeRequest(path);

      if (responseStatus(request) != 200) {
        var error = new Error("Request failed: " + request.statusLine);
        error.responseStatus = responseStatus(request);
        error.responseBody = request.responseBody;
        throw error;
      }

      return JSON.parse(request.responseBody);
    },

    check: function (path) {
      var request = makeRequest(path);

      if (/^HTTP\/\d\.\d 204 /.test(request.statusLine))
        return true;
      if (/^HTTP\/\d\.\d 404 /.test(request.statusLine))
        return false;

      throw new Error(format(
        "Request failed: %s\n\n%s", request.statusLine, request.responseBody));
    },

    prepare: function (repository) {
      var oauth_token = critic.storage.get("oauth-token");

      try {
        repository.run(
          "remote", "add", "github", "https://github.com/jensl/critic.git");
      } catch (error) {
        /* Fails if there's already a remote named 'github', which is fine;
           it'll inevitably have been added by us earlier. */
      }
      repository.run("config", "credential.username", oauth_token);
      repository.run("config", "core.askpass", "/bin/true");
    },

    clean: function (repository) {
      repository.run("config", "--unset", "credential.username");
    },

  };
})();
