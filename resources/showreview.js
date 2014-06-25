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

$(function () {
  function openDialog() {
    var dialog = $("<div title='Push changes to master'>" +
                   "<p>Everything appears to be good to go.</p>" +
                   "</div>");

    function finished(result) {
      dialog.dialog("close");
      if (result)
        location.reload();
    }

    function push() {
      var operation = new critic.Operation({
        action: "push to master",
        url: "CriticCollaborator/push",
        data: { review_id: critic.review.id },
        wait: "Pushing...",
        callback: finished
      });

      operation.execute();
    }

    function cancel() {
      dialog.dialog("close");
    }

    dialog.dialog({
      width: 500,
      buttons: {
        "Push!": push,
        "Cancel": cancel
      }
    });
  }

  function pushToMaster() {
    function handleResult(result) {
      if (result) {
        if (result.ready) {
          openDialog();
        } else {
          showMessage("Not yet!", "Review not ready!",
                      "<p>The changes in this review can not be pushed to " +
                      "master at this time.</p>" +
                      "<p><b>Reason:</b> " + result.push_blocked_by + "</p>");
        }
      }
    }

    var operation = new critic.Operation({
      action: "check whether review is ready to be pushed",
      url: "CriticTester/ready",
      data: { review_id: critic.review.id },
      wait: "Checking review...",
      callback: handleResult
    });

    operation.execute();
  }

  critic.buttons.add({ title: "Push to master",
                       onclick: pushToMaster,
                       scope: "global" });
});
