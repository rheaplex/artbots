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

var MongoClient = require('mongodb').MongoClient;
var winston = require('winston');

var network_connections = require('../lib/NetworkConnections.js');

////////////////////////////////////////////////////////////////////////////////
// Hourly functions
////////////////////////////////////////////////////////////////////////////////

// An hour in seconds
var HOURLY = 60 * 60 * 1000;

var post_output = function(output, network_services) {
  Object.keys(network_services).forEach(function (name) {
    winston.info("Creating connection for " + name);
    var connection = network_services[name];
    var service = new network_connections[connection.service](connection);
    service.post(output, function () { service.disconnect(); });
  });
};

var runBotPeriodicFunction = function (periodic_function, network_services) {
  var fun = require(periodic_function.module)[periodic_function.function];
  winston.info("Running  " + periodic_function.module + ":" + periodic_function.function);
  fun.call(null, periodic_function.arguments,
           function (err, output) {
             if(err) {
               winston.error(err);
             } else if (output) {
               winston.info("output: " + output);
               winston.info("Posting output to network services.");
               post_output(output, network_services);
             } else {
               winston.info("Nothing to post.");
             }
           });
};

var runBotPeriodicFunctions = function (periodic_functions, network_services,
                                        now) {
  Object.keys(periodic_functions).forEach(function (name) {
    winston.info("Getting function for " + name);
    var periodic_function = periodic_functions[name];
    var probability = Math.floor(Math.random() *
                                 periodic_function.hour_probability);
    winston.info("Checking "
                 + periodic_function.module + ":" + periodic_function.function);
    winston.info("Now: " + now.getHours()
                + " From: " + periodic_function.hour_from
                + " To: " + periodic_function.hour_to
                + " Modulo: " + periodic_function.hour_modulo
                + " Prob: " + periodic_function.hour_probability
                + " Random: " + probability);
    if(now.getHours() >= periodic_function.hour_from
     && now.getHours() <= periodic_function.hour_to
     && (now.getHours() % periodic_function.hour_modulo) == 0
     && probability == 0) {
      winston.info("Running.");
      runBotPeriodicFunction(periodic_function, network_services);
    } else {
      winston.info("Not running.");
    }
  })
};

var runBotsPeriodicFunctions = function (mongo_uri, now) {
  winston.info("runBotsPeriodicFunctions()");
  MongoClient.connect(mongo_uri, function(err, db) {
    if(err) throw err;
    var bots = db.collection('bots');
    bots.find({"active":true}).each(function (err, bot_config) {
      if(err) throw err;
      if (bot_config == null) {
        winston.info("Closing db for runBotsPeriodicFunctions()");
        db.close();
        return;
      }
      winston.info("Running periodic functions for " + bot_config.name);
      runBotPeriodicFunctions(bot_config.periodic_functions,
                              bot_config.network_services, now);
    });
  });
};

// TODO: Daily functions (maintenance functions)

// TODO: Minutely functions (continuous functions)

////////////////////////////////////////////////////////////////////////////////
// Main event loop
////////////////////////////////////////////////////////////////////////////////

var mainLoop = function (mongo_uri) {
  winston.info("Starting mainLoop()");
  var hourly = function() {
    var now = new Date();
    winston.info("hourly() now = " + now);
    runBotsPeriodicFunctions(mongo_uri, now);
  };
  hourly();
  setInterval(hourly, HOURLY);
};

module.exports.mainLoop = mainLoop;
// For testing...
module.exports.runBotsPeriodicFunctions = runBotsPeriodicFunctions;
module.exports.runBotPeriodicFunction = runBotPeriodicFunction;
module.exports.runBotPeriodicFunctions = runBotPeriodicFunctions;
