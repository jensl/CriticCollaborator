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

function createOAuthToken() {
  var dialog = $("<div title=\"Let's go to GitHub...\">" +
                 "<p>I will now redirect you to GitHub, where you'll be " +
                 "asked to trust the CriticCollaborator application.</p>" +
                 "</div>");

  function proceed() {
    location.replace("/CriticCollaborator/createtoken");
    dialog.dialog("close");
  }

  function cancel() {
    dialog.dialog("close");
  }

  dialog.dialog({
    "width": 500,
    "buttons": {
      "Off we go!": proceed,
      "Let's not...": cancel
    }
  });
}

function deleteOAuthToken() {
  var operation = new critic.Operation({
    action: "delete token",
    url: "CriticCollaborator/deletetoken",
    data: {},
    callback: function (result) {
      if (result)
        location.reload();
    }
  });

  operation.execute();
}