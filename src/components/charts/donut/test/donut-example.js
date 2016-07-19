import React from "react";
import ReactDOM from "react-dom";
import Donut from "../donut";

var data = [
    {label: "Movie", value: 10, color: '#24DBFF'},
    {label: "Person", value: 30, color: '#006FE3'},
    {label: "Actor", value: 90, color: '#3FCBFF'}
];
ReactDOM.render( <Donut title="Little one" data={data} size={100} />, document.getElementById('little'));
ReactDOM.render( <Donut title="Standard" data={data}  size={200} />, document.getElementById('standard'));
ReactDOM.render( <Donut title="Big One" data={data} size={500} />, document.getElementById('big'));

