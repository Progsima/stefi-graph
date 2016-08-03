import CodeMirror from "codemirror";
import cypher from "./cypher-def";

/**
 * Function that create a regex from an array of words.
 */
function wordRegexp(words) {
    return new RegExp("^(?:" + words.join("|") + ")$", "i");
}

/**
 * Function that create regex from an array of char.
 */
function charRegexp(chars) {
    var regex = chars.reduce(
        (prev, curr) => {
            if(curr === '-') {
                return prev + '\'' + curr;
            }
            return prev + curr;
        });
    return new RegExp("[" + regex + "]", "i");
}

/**
 * Define the cypher mode.
 */
CodeMirror.defineMode("cypher", function (config) {

    var indentUnit = config.indentUnit;
    var curPunc;
    var funcs = wordRegexp(cypher.functions);
    var preds = wordRegexp(cypher.predicates);
    var keywords = wordRegexp(cypher.keywords);
    var operatorChars = charRegexp(cypher.operators);


    /**
     * Return the type of the stream (ie. node, relationship, pattern, comment, variable...).
     *
     * @param stream
     * @returns A string that represent the type of the stream
     */
    function tokenBase(stream) {
        // the return variable
        var type = "";

        // getting the first char
        var ch = stream.next();

        // Testing if '.*' => String
        if (type === "" && ch === "'") {
            stream.match(/.+?[']/);
            type = "string";
        }

        // Testing if ".*" => String
        if (type === "" && ch === "\"") {
            stream.match(/.+?["]/);
            type = "string";
        }

        if (type === "" && /[{}\(\),\.;\[\]]/.test(ch)) {
            curPunc = ch;
            type = "node";
        }

        // Testing if we found '//', it's a comment till the end of the line
        if (type === "" && ch === "/" && stream.eat("/")) {
            stream.skipToEnd();
            type = "comment";
        }

        // Testing if it's an operator
        if (type === "" && operatorChars.test(ch)) {
            type = "operator";
        }


        // Now we work on the word of the stream
        if (type === "") {

            stream.eatWhile(/[_\w\d]/);
            var word = stream.current();

            if (type === "" && stream.eat(":")) {
                stream.eatWhile(/[\w\d_\-]/);
                type = "atom";
            }

            // Testing if the word is a function
            if (type === "" && funcs.test(word)) {
                type = "function";
            }

            // Testing if the word is a predicate
            if (type === "" && preds.test(word)) {
                type = "predicat";
            }

            // Testing if the word is a keyword
            if (type === "" && keywords.test(word)) {
                type = "keyword";
            }

            // Default case
            if (type === "") {
                type = "variable";
            }
        }

        return type;
    }

    function pushContext(state, type, col) {
        return state.context = {
            prev: state.context,
            indent: state.indent,
            col: col,
            type: type
        };
    }

    function popContext(state) {
        state.indent = state.context.indent;
        return state.context = state.context.prev;
    }


    return {
        startState: function (/*base*/) {
            return {
                tokenize: tokenBase,
                context: null,
                indent: 0,
                col: 0
            };
        },
        token: function (stream, state) {
            if (stream.sol()) {
                if (state.context && (state.context.align == null)) {
                    state.context.align = false;
                }
                state.indent = stream.indentation();
            }
            if (stream.eatSpace()) {
                return null;
            }
            var style = state.tokenize(stream, state);
            if (style !== "comment" && state.context && (state.context.align == null) && state.context.type !== "pattern") {
                state.context.align = true;
            }
            if (curPunc === "(") {
                pushContext(state, ")", stream.column());
            } else if (curPunc === "[") {
                pushContext(state, "]", stream.column());
            } else if (curPunc === "{") {
                pushContext(state, "}", stream.column());
            } else if (/[\]\}\)]/.test(curPunc)) {
                while (state.context && state.context.type === "pattern") {
                    popContext(state);
                }
                if (state.context && curPunc === state.context.type) {
                    popContext(state);
                }
            } else if (curPunc === "." && state.context && state.context.type === "pattern") {
                popContext(state);
            } else if (/atom|string|variable/.test(style) && state.context) {
                if (/[\}\]]/.test(state.context.type)) {
                    pushContext(state, "pattern", stream.column());
                } else if (state.context.type === "pattern" && !state.context.align) {
                    state.context.align = true;
                    state.context.col = stream.column();
                }
            }
            return style;
        },
        indent: function (state, textAfter) {
            var firstChar = textAfter && textAfter.charAt(0);
            var context = state.context;
            if (/[\]\}]/.test(firstChar)) {
                while (context && context.type === "pattern") {
                    context = context.prev;
                }
            }
            var closing = context && firstChar === context.type;
            if (!context) return 0;
            if (context.type === "keywords") return CodeMirror.commands.newlineAndIndent;
            if (context.align) return context.col + (closing ? 0 : 1);
            return context.indent + (closing ? 0 : indentUnit);
        }
    };
});

/**
 * Register cypher extension for the formatting.
 *
 * @type {{autoFormatLineBreaks: CodeMirror.modeExtensions.cypher.autoFormatLineBreaks}}
 */
CodeMirror.modeExtensions["cypher"] = {
    autoFormatLineBreaks: function (text) {
        // create an array of lines
        var lines = text.split("\n");

        // for each breaking keywords, we create a new line break
        var breakingKeywords = /\s+\b(return|where|order by|match|with|skip|limit|create|delete|set)\b\s/g;
        for (var i = 0; i < lines.length; i++)
            lines[i] = lines[i].replace(breakingKeywords, " \n$1 ").trim();

        return lines.join("\n");
    }
};

/**
 * Register Cypher mime-type
 */
CodeMirror.defineMIME("application/x-cypher-query", "cypher");
