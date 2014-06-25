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

Module.load("github.js");

function main(method, path, query) {
  writeln("200");
  writeln("Content-Type: text/html");
  writeln();

  critic.html.writeStandardHeader(
    "CriticCollaborator: set-up", {
      scripts: ["/extension-resource/CriticCollaborator/setup.js"],
      stylesheets: ["/extension-resource/CriticCollaborator/setup.css"],
    }
  );

  var plt = new critic.html.PaleYellowTable("CriticCollaborator: set-up");

  var oauth_token = critic.storage.get("oauth-token");
  var value, buttons, user, is_collaborator;
  if (oauth_token) {
    value = "****";
    buttons = {
      "Delete token": "deleteOAuthToken();"
    };

    try {
      user = GitHub.fetch("/user");
      is_collaborator = GitHub.check(
        "/repos/jensl/critic/collaborators/" + user["login"]);
    } catch (error) {
      if (error.responseStatus == 401) {
        value = "<i>rejected by GitHub</i>";
      } else {
        plt.addItem({
          name: "Error",
          value: critic.html.escape(error.message),
          description: ("Failed to fetch information from GitHub.")
        });
      }
    }
  } else {
    value = "<i>not set</i>";
    buttons = {
      "Create token": "createOAuthToken();"
    };
  }

  plt.addItem({
    name: "OAuth token",
    value: value,
    description: ("OAuth token that gives the extension access to GitHub " +
                  " repositories."),
    buttons: buttons
  });

  if (user) {
    plt.addItem({
      name: "GitHub username",
      value: user["login"],
      description: ("The name of your GitHub user.")
    });
    plt.addItem({
      name: "Status",
      value: is_collaborator ? "collaborator" : "<b>not</b> collaborator",
      description: ("Your status as collaborator in https://github.com/jensl/critic.git.")
    });
  }

  plt.write();

  critic.html.writeStandardFooter();
}
