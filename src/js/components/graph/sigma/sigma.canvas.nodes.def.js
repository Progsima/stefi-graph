;(function() {
  'use strict';

  sigma.utils.pkg('sigma.canvas.nodes');

  /**
   * The default node renderer. It renders the node as a simple disc.
   *
   * @param  {object}                   node     The node object.
   * @param  {CanvasRenderingContext2D} context  The canvas context.
   * @param  {configurable}             settings The settings function.
   */
  sigma.canvas.nodes.def = function(node, context, settings) {
    var prefix = settings('prefix') || '';

    // Compute variables
    var nodeColor = node.color || settings('defaultNodeColor');
    var hidden = node.hidden || false;
    var active = node.active || false;
    var activeNodeBorderColor = settings('activeNodeBorderColor') || '#FF0000';
    var activeNodeBorderSizeRatio = settings('activeNodeBorderSizeRatio') || 0.1;

    if(!hidden) {

      // Display active border
      if(node.selected) {
        context.closePath();
        context.fill();
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 8;
        context.shadowColor = activeNodeBorderColor;
        context.fillStyle = activeNodeBorderColor;
        context.beginPath();
        context.arc(
          node[prefix + 'x'],
          node[prefix + 'y'],
          (node[prefix + 'size']+1)* (1+activeNodeBorderSizeRatio),
          0,
          Math.PI * 2,
          true
        );
        context.closePath();
        context.fill();
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 0;

        context.fillStyle = '#FFF';
        context.beginPath();
        context.arc(
          node[prefix + 'x'],
          node[prefix + 'y'],
          node[prefix + 'size'] + 1,
          0,
          Math.PI * 2,
          true
        );
        context.closePath();
        context.fill();
      }

      // Display main node
      context.fillStyle = nodeColor;
      context.beginPath();
      context.arc(
        node[prefix + 'x'],
        node[prefix + 'y'],
        node[prefix + 'size'],
        0,
        Math.PI * 2,
        true
      );
      context.closePath();
      context.fill();

      // Display node icon
      if(node.icon) {
        sigma.canvas.nodes.drawIcon(node, prefix, context);
      }

      // Display node image
      if(node.image) {
        //sigma.canvas.nodes.drawImage(node);
      }
    }
  };

  /**
   * Draw an icon inside the specified node on the canvas.
   *
   * @param  {object}                   node     The node object.
   * @param  {string}                   prefix
   * @param  {CanvasRenderingContext2D} context  The canvas context.
   */
  sigma.canvas.nodes.drawIcon = function(node, prefix, context){
    var font = 'fontawesome',
        fgColor = node.icon.color || '#000000',
        text = String.fromCharCode("0x" + node.icon.name),
        fontSizeRatio = 0.70;

    if (typeof node.icon.scale === "number") {
      fontSizeRatio = Math.abs(Math.max(0.01, node.icon.scale));
    }
    var fontSize = Math.round(fontSizeRatio * node[prefix + 'size']);

    context.save();
    context.fillStyle = fgColor;
    context.font = '' + fontSize + 'px FontAwesome';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, node[prefix + 'x'], node[prefix + 'y']);
    context.restore();
  };

  var imgCache = {};

  sigma.canvas.nodes.drawImage = function(node, prefix, context, imgCrossOrigin, threshold, clipFn) {

    var url = node.image.url;
    var ih = 1; // 1 is arbitrary, anyway only the ratio counts
    var iw = 1;
    var scale = node.image.scale || 1;

    // create new IMG or get from imgCache
    var image = imgCache[url];
    if(!image) {
      image = document.createElement('IMG');
      //image.setAttribute('crossOrigin', imgCrossOrigin);
      image.src = url;
      image.onload = function() {
        window.dispatchEvent(new Event('resize'));
      };
      imgCache[url] = image;
    }

    // calculate position and draw
    var xratio = (iw < ih) ? (iw / ih) : 1;
    var yratio = (ih < iw) ? (ih / iw) : 1;
    var r = node[prefix+'size'] * scale;

    context.save(); // enter clipping mode
    // Draw the actual image
    context.drawImage(
      image,
      node[prefix+'x'] + Math.sin(-3.142 / 4) * r * xratio,
      node[prefix+'y'] - Math.cos(-3.142 / 4) * r * yratio,
      r * xratio * 2 * Math.sin(-3.142 / 4) * (-1),
      r * yratio * 2 * Math.cos(-3.142 / 4)
    );
    context.restore(); // exit clipping mode
  };

})();
