;(function() {
  'use strict';

  sigma.utils.pkg('sigma.canvas.utils');

  sigma.canvas.utils.drawCircle = function(context, x, y, size, color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, size, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
  }

  sigma.canvas.utils.drawNodeIcon = function(context, node, prefix) {
    var color = node.icon.color || '#000';
    var scale = node.icon.scale || 0.7;
    var text = String.fromCharCode("0x" + node.icon.name)  || '?';
    var nodeSize = node[prefix + 'size'];
    var nodeX = node[prefix + 'x'];
    var nodeY = node[prefix + 'y'];
    var fontSize = Math.round(scale * nodeSize);

    context.save();
    context.fillStyle = color;
    context.font = '' + fontSize + 'px fontawesome';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, nodeX, nodeY);
    context.restore();
  };


  sigma.canvas.utils.drawNodeImage = function(context, node, prefix) {

  }

  sigma.canvas.utils.resetContext = function(context) {
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 0;
    context.shadowColor = 0;
    context.fillStyle = '#000';
  }

  /**
   * Return the control point coordinates for a quadratic bezier curve.
   *
   * @param  {number} x1  The X coordinate of the start point.
   * @param  {number} y1  The Y coordinate of the start point.
   * @param  {number} x2  The X coordinate of the end point.
   * @param  {number} y2  The Y coordinate of the end point.
   * @param  {number} a   Modifier for the amplitude of the curve.
   * @return {x,y}        The control point coordinates.
   */
  sigma.canvas.utils.getQuadraticControlPoint = function(x1, y1, x2, y2, a) {
    a = a || 0;
    return {
      x: (x1 + x2) / 2 + (y2 - y1) / (60 / (15 + a)),
      y: (y1 + y2) / 2 + (x1 - x2) / (60 / (15 + a))
    };
  };

  /**
   * Return the coordinates of the two control points for a self loop (i.e.
   * where the start point is also the end point) computed as a cubic bezier
   * curve.
   *
   * @param  {number} x    The X coordinate of the node.
   * @param  {number} y    The Y coordinate of the node.
   * @param  {number} size The node size.
   * @param  {number} a    Modifier to the loop size.
   * @return {x1,y1,x2,y2} The coordinates of the two control points.
   */
  sigma.canvas.utils.getSelfLoopControlPoints = function(x , y, size, a) {
    a = a || 0;
    return {
      x1: x - (size + a) * 7,
      y1: y,
      x2: x,
      y2: y + (size + a) * 7
    };
  };

})();
