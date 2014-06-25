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

function showreview(path, query) {
  if (!critic.storage.get("oauth-token"))
    return;
  var review = new critic.Review(parseInt(query.params.id));
  if (!review.progress.accepted)
    return;
  writeln("script %r", "/extension-resource/CriticCollaborator/showreview.js");
}
