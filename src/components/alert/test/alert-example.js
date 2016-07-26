import React from "react";
import ReactDOM from "react-dom";
import Alert from "../alert";

import './../../../styles/main.less';


ReactDOM.render( <Alert title="Success:" message="Well done !" type="success" timeout={5} />, document.getElementById('success'));
ReactDOM.render( <Alert title="Info:" message="Just a simple alert" type="info" timeout={10} />, document.getElementById('info'));
ReactDOM.render( <Alert title="/!\" message="becarefull" type="warning" timeout={15} />, document.getElementById('warning'));
ReactDOM.render( <Alert title="Oups!" message="An error appears in the application" type="danger" timeout={20} />, document.getElementById('danger'));

