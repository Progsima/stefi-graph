import React from "react";
import ReactDOM from "react-dom";
import CypherEditor from "../cyphereditor";

var query = "// Cypher Mode for CodeMirror, using the neo theme \n\
MATCH (joe { name: 'Joe' })-[:knows*2..2]-(friend_of_friend) \n\
WHERE NOT (joe)-[:knows]-(friend_of_friend) \n\
RETURN friend_of_friend.name, COUNT(*) \n\
ORDER BY COUNT(*) DESC , friend_of_friend.name \n\
";

ReactDOM.render( <CypherEditor query={query}/>, document.getElementById('test'));

