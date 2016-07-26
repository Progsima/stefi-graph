import CodeMirror from "codemirror";
import cypher from "~/components/cyphereditor/cypher-def";
import "codemirror/mode/cypher/cypher";

var Pos = CodeMirror.Pos, cmpPos = CodeMirror.cmpPos;


CodeMirror.registerHelper("hint", "cypher", function (editor, options) {
    // All language keywords
    var keywords = cypher.keywords
        .concat(cypher.predicates)
        .concat(cypher.functions);

    // autocomplete result
    var result = [];

    // Construct the term to search for
    var cur = editor.getCursor();
    var token = editor.getTokenAt(cur), start, end, search;
    if (token.end > cur.ch) {
        token.end = cur.ch;
        token.string = token.string.slice(0, cur.ch - token.start);
    }
    if (token.string.match(/^[.`\w@]\w*$/)) {
        search = token.string;
        start = token.start;
        end = token.end;
    } else {
        start = end = cur.ch;
        search = "";
    }

    if(search.length >0 ) {
        result = keywords.filter(
            (x) => {
                if (x.toLowerCase().startsWith(search.toLowerCase())) {
                    return true;
                }
                else {
                    return false;
                }
            }
        );
    }

    return {list: result, from: Pos(cur.line, start), to: Pos(cur.line, end)};
});


