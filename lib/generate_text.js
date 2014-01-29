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

var fs = require("fs");
var rita = require("rita");
var winston = require('winston');

var singular = function (string) {
  winston.info("Correcting a/an.");
  return string.replace(/\ba(\s+[aeiou])/g, "an$1");
};

var despace = function (string) {
  winston.info("Removing excess spaces.");
  return string.trim().replace(/\s+/g, ' ');
};

var generate_text_from_grammar = function (args, callback) {
  winston.info("Loading grammar: " + args.grammar_filepath);
  fs.readFile(args.grammar_filepath, 'utf8', function (err, grammar_spec) {
    if (err) {
      winston.error(err);
      return;
    }
    winston.info("Loaded grammar: " + args.grammar_filepath);
    winston.info("Parsing grammar.");
    var grammar = new rita.RiGrammar(grammar_spec);
    winston.info("Generating output.");
    var output = grammar.expand();
    winston.info("Output: " + output);
    callback(singular(despace(output)));
  });
};

exports.generate_text_from_grammar = generate_text_from_grammar;
