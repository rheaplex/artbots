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

var GNUsocialConnection = require('../lib/GNUsocialConnection');
var TestConnection = require('../lib/TestConnection');
var TwitterConnection = require('../lib/TwitterConnection');

////////////////////////////////////////////////////////////////////////////////
// The service connectors
////////////////////////////////////////////////////////////////////////////////

var service_connectors = {"gnusocial" : GNUsocialConnection,
                          "test" : TestConnection,
                          "twitter" : TwitterConnection};

module.exports = service_connectors;
