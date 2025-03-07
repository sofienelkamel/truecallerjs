// MIT License

// Copyright (c) 2021 Emmadi Sumith Kumar

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

var typeOf = require("./lib.js").typeOf;
var trimWhitespace = require("./remove-trailing-spaces.js");


// Function to convert JSON to YAML
function toYaml(data, color = false) {
  var handlers,
    indentLevel = "";
  handlers = {
    undefined: function () {
      return "null";
    },
    null: function () {
      return "null";
    },
    number: function (x) {
      return x;
    },
    boolean: function (x) {
      return x ? "true" : "false";
    },
    string: function (x) {
      return JSON.stringify(x);
    },
    array: function (x) {
      var output = "";
      if (0 === x.length) {
        output += "[]";
        return output;
      }
      indentLevel = indentLevel.replace(/$/, "  ");
      x.forEach(function (y, i) {
        var handler = handlers[typeOf(y)];
        if (!handler) {
          throw new Error("what the crap: " + typeOf(y));
        }
        output += "\n" + indentLevel + "- " + handler(y, true);
      });

      indentLevel = indentLevel.replace(/  /, "");
      return output;
    },
    object: function (x, inArray, rootNode) {
      var output = "";
      if (0 === Object.keys(x).length) {
        output += "{}";
        return output;
      }
      if (!rootNode) {
        indentLevel = indentLevel.replace(/$/, "  ");
      }
      Object.keys(x).forEach(function (k, i) {
        var val = x[k],
          handler = handlers[typeOf(val)];
        if ("undefined" === typeof val) {
          return;
        }
        if (!handler) {
          throw new Error("what the crap: " + typeOf(val));
        }
        if (!(inArray && i === 0)) {
          output += "\n" + indentLevel;
        }
        if (color) {
          output += `\x1b[33m${k}\x1b[0m : \x1b[32m${handler(val)}\x1b[0m`;
        } else {
          output += `${k} : ${handler(val)}`;
        }
      });
      indentLevel = indentLevel.replace(/  /, "");
      return output;
    },
    function: function () {
      return "[object Function]";
    },
  };
  return trimWhitespace(handlers[typeOf(data)](data, true, true) + "\n");
}

// Function to convert JSON to HTML
function toHTML(data, color = false) {
  var handlers,
    indentLevel = "";
  handlers = {
    undefined: function () {
      return "null";
    },
    null: function () {
      return "null";
    },
    number: function (x) {
      return x;
    },
    boolean: function (x) {
      return x ? "true" : "false";
    },
    string: function (x) {
      return JSON.stringify(x);
    },
    array: function (x) {
      var output = "";
      if (0 === x.length) {
        output += "[]";
        return output;
      }

      let tempNum = 1;

      x.forEach(function (y, i) {
        var handler = handlers[typeOf(y)];
        if (!handler) {
          throw new Error("what the crap: " + typeOf(y));
        }
        if (typeOf(y) != "object") {
          if (tempNum == x.length) {
            output += handler(y, true);
          } else {
            output += handler(y, true) + ", ";
          }
        } else {
          output += handler(y, true);
        }
      });
      return output;
    },
    object: function (x, inArray, rootNode) {
      var output = "";
      if (0 === Object.keys(x).length) {
        output += "{}";
        return output;
      }

      Object.keys(x).forEach(function (k, i) {
        var val = x[k],
          handler = handlers[typeOf(val)];
        if ("undefined" === typeof val) {
          return;
        }
        if (!handler) {
          throw new Error("what the crap: " + typeOf(val));
        }

        // if (!(inArray && i === 0)) {
        //   output += '\n'
        // }

        if (color) {
          // console.log("\x1b[33mName\x1b[0m : \x1b[32mUnknown Name\x1b[0m");

          output +=
            "<\x1b[36mtr\x1b[0m><\x1b[36mtd\x1b[0m>" +
            k +
            "</\x1b[36mtd\x1b[0m><\x1b[36mtd\x1b[0m>" +
            handler(val).toString().replace(/"/g, "") +
            "</\x1b[36mtd\x1b[0m></\x1b[36mtr\x1b[0m>";
        } else {
          output +=
            "<tr><td>" +
            k +
            "</td><td>" +
            handler(val).toString().replace(/"/g, "") +
            "</td></tr>";
        }
      });
      return output;
    },
    function: function () {
      return "[object Function]";
    },
  };

  var data = trimWhitespace(handlers[typeOf(data)](data, true, true))
  return (
    color ? "<\x1b[36mtable\x1b[0m><\x1b[36mtr\x1b[0m><\x1b[36mth\x1b[0m>Properties</\x1b[36mth\x1b[0m><\x1b[36mth\x1b[0m>Values</\x1b[36mth\x1b[0m></\x1b[36mtr\x1b[0m>" + data + "<\x1b[36m/table\x1b[0m>" : "<table><tr><th>Properties</th><th>Values</th></tr>" + data + "</table>"
  );
}

module.exports.toYaml = toYaml;
module.exports.toHTML = toHTML;
