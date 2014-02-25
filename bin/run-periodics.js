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

////////////////////////////////////////////////////////////////////////////////
// Imports
////////////////////////////////////////////////////////////////////////////////

var MongoClient = require('mongodb').MongoClient;
var winston = require('winston');

var bots = require('../lib/bots');

////////////////////////////////////////////////////////////////////////////////
// Getopts
////////////////////////////////////////////////////////////////////////////////

if (process.argv.length < 4 || process.argv[2] == "--help") {
  console.log("USAGE: node run-periodic.js MONGODB-URI BOT-NAME "
              + "[--post] [--force]");
  console.log("  MONGODB-URI - The URI for the bot configs Mongo database.");
  console.log("  BOT-NAME    - The name of the bot config to use.");
  console.log("  --post      - Actually post results online.");
  console.log("  --force     - Run functions regardless of hour config.");
  process.exit(-1);
}
var mongo_uri = process.argv[2];
var bot_name = process.argv[3];
var post = process.argv.slice(4).indexOf("--post") != -1;
var force = process.argv.slice(4).indexOf("--force") != -1;

////////////////////////////////////////////////////////////////////////////////
// Get the bot from the DB and run its periodic functions
////////////////////////////////////////////////////////////////////////////////

var force_run = function (periodic_functions) {

};

console.log("Running all periodic functions for " + bot_name);
MongoClient.connect(mongo_uri, function(err, db) {
  if(err) throw err;
  db.collection('bots').findOne({"name":bot_name}, function (err, bot_config) {
    if(err) throw err;
    var network_services = [{"service":"test"}];
    var periodic_functions = bot_config.periodic_functions;
    if(post) {
      network_services = bot_config.network_services;
    }
    if(force) {
      Object.keys(periodic_functions).forEach(function (name) {
        var fun = periodic_functions[name];
        fun.hour_from = 0;
        fun.hour_to = 24;
        fun.hour_modulo = 1;
        fun.hour_probability = 0;
      });
    }
    var now = new Date();
    winston.info("hourly() now = " + now);
    bots.runBotPeriodicFunctions(periodic_functions,
                                 network_services,
                                 now);
    db.close();
  });
});
winston.info("Finished.");
