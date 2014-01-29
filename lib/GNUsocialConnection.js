// Art Bots - Social media bots that make or find art.
// Copyright 2013 Rob Myers <rob@robmyers.org>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

"use strict";

var GNUsocial = require('gnusocial');
var winston = require('winston');

////////////////////////////////////////////////////////////////////////////////
// GNUsocialConnection
// A connection to the GNU social network service API
////////////////////////////////////////////////////////////////////////////////

var GNUsocialConnection = function (config) {
  winston.info("Creating GNU social connection for " + config.api_url);
  this.gnusocial = new GNUsocial({
    api_url:              config.api_url,
    consumer_key:         config.consumer_key,
    consumer_secret:      config.consumer_secret,
    access_token:         config.access_token,
    access_token_secret:  config.access_token_secret});
  winston.info("Created GNU social connection.");
};

GNUsocialConnection.prototype.post = function (message, callback) {
  winston.info("Posting to GNU social.");

  this.gnusocial.post('statuses/update', { status: message },
                      function(err, reply) {
                        if (err) {
                          winston.error(err);
                          return;
                        }
                        winston.info("Posted to GNU social.");
                        callback();
                      });
};

GNUsocialConnection.prototype.disconnect = function () {
};

module.exports = GNUsocialConnection;
