!function(u){function t(t){for(var e,n,r=t[0],i=t[1],o=t[2],a=0,s=[];a<r.length;a++)n=r[a],Object.prototype.hasOwnProperty.call(c,n)&&c[n]&&s.push(c[n][0]),c[n]=0;for(e in i)Object.prototype.hasOwnProperty.call(i,e)&&(u[e]=i[e]);for(f&&f(t);s.length;)s.shift()();return h.push.apply(h,o||[]),l()}function l(){for(var t,e=0;e<h.length;e++){for(var n=h[e],r=!0,i=1;i<n.length;i++){var o=n[i];0!==c[o]&&(r=!1)}r&&(h.splice(e--,1),t=a(a.s=n[0]))}return t}var n={},c={0:0},h=[];function a(t){if(n[t])return n[t].exports;var e=n[t]={i:t,l:!1,exports:{}};return u[t].call(e.exports,e,e.exports,a),e.l=!0,e.exports}a.m=u,a.c=n,a.d=function(t,e,n){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},a.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(n,r,function(t){return e[t]}.bind(null,r));return n},a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="";var e=window.webpackJsonp=window.webpackJsonp||[],r=e.push.bind(e);e.push=t,e=e.slice();for(var i=0;i<e.length;i++)t(e[i]);var f=r;h.push([1448,1]),l()}({1448:function(t,e,n){"use strict";n.r(e);var r=n(60),h=n.n(r);function l(t){return(l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function a(t,e,n){return e&&o(t.prototype,e),n&&o(t,n),t}var s=function(){function r(t,e,n){i(this,r),this.gridX=t,this.gridY=e,this.hCost=0,this.gCost=0,this.parent=null,this.isWalkable=n}return a(r,[{key:"fCost",get:function(){this.gCost,this.hCost}}]),r}(),f=function(){function r(t,e,n){i(this,r),this.tileHeight=e||16,this.tileWidth=n||16,this.lengthY=t.length,this.lengthX=t[0].length,this.nodes=t.map(function(t,n){return t.map(function(t,e){return new s(e,n,t)})})}return a(r,[{key:"getPath",value:function(t,e){for(var r=this,i=this.getNodeFromXY(t.x,t.y),o=this.getNodeFromXY(e.x,e.y),a=[],s=[i],n=function(){for(var n=s[0],t=1;t<s.length;t++){var e=s[t];(e.fCost<n.fCost||e.fCost===n.fCost&&e.hCost<n.hCost)&&(n=e)}if(s.splice(s.findIndex(function(t){return t===n}),1),a.push(n),n===o)return{v:r.tracePath(i,o)};r.getNeighbours(n).forEach(function(t){if(t.isWalkable&&!a.includes(t)){var e=n.gCost+r.getDistance(n,t);(e<t.gCost||!s.includes(t))&&(t.gCost=e,t.hCost=r.getDistance(t,o),t.parent=n,s.includes(t)||s.push(t))}})};s.length;){var u=n();if("object"===l(u))return u.v}}},{key:"tracePath",value:function(t,e){for(var n=[],r=e;r!==t;)n.push({x:r.gridX*this.tileWidth+this.tileWidth/2,y:r.gridY*this.tileHeight+this.tileHeight/2}),r=r.parent;return n.reverse(),n}},{key:"getNeighbours",value:function(t){for(var e=[],n=-1;n<=1;n++)for(var r=-1;r<=1;r++)if(0!==r||0!==n){var i=t.gridX+r,o=t.gridY+n;0<=i&&i<this.lengthX&&0<=o&&o<this.lengthY&&e.push(this.nodes[o][i])}return e}},{key:"getNodeFromXY",value:function(t,e){var n=Math.floor(t/this.tileWidth),r=Math.floor(e/this.tileHeight);return this.nodes[r][n]||null}},{key:"getDistance",value:function(t,e){var n=Math.abs(t.gridX-e.gridX),r=Math.abs(t.gridY-e.gridY);return r<n?this.calcDistance(r,n):this.calcDistance(n,r)}},{key:"calcDistance",value:function(t,e){return 14*t+10*(e-t)}}]),r}();function u(t){return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function c(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function p(t,e){return!e||"object"!==u(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function y(t){return(y=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function d(t,e){return(d=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var g=function(){function t(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),p(this,y(t).apply(this,arguments))}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&d(t,e)}(t,h.a.Scene),function(t,e,n){e&&c(t.prototype,e),n&&c(t,n)}(t,[{key:"preload",value:function(){this.load.tilemapTiledJSON("tilemap","./assets/tilemap.json"),this.load.spritesheet("tiles","./assets/tiles.png",{frameWidth:8,frameHeight:8})}},{key:"create",value:function(){function o(t){return 8*Math.floor(t/8)+4}var a=this,s=this.cameras.main,u=this.make.tilemap({key:"tilemap"}),t=u.addTilesetImage("tiles"),l=u.createDynamicLayer(0,t,0,0),e=u.layers[0].data.map(function(t){return t.map(function(t){return 3!==t.index})});this.pathGroup=this.add.group({classType:h.a.GameObjects.Image,defaultKey:"tiles",defaultFrame:2}),this.lineGraphics=this.add.graphics().lineStyle(1,10066176,1).setDepth(1),this.red=this.add.image(20,20,"tiles",4).setInteractive().setDepth(2),this.blue=this.add.image(108,108,"tiles",5).setInteractive().setDepth(2),this.pathFinder=new f(e,8,8);var c=null;this.input.setDraggable(this.red),this.input.setDraggable(this.blue),this.input.on("drag",function(t,e,n,r){var i=u.getTileAtWorldXY(n,r,!0,s,l);i&&i!==c&&3!==i.index&&(c=i,e.x=o(n),e.y=o(r),a.drawPath())}),this.drawPath(!0)}},{key:"drawPath",value:function(t){var e=this,n=new h.a.Geom.Point(this.red.x,this.red.y),r=new h.a.Geom.Point(this.blue.x,this.blue.y),i=this.pathFinder.getPath(n,r);t||(this.lineGraphics.clear(),this.pathGroup.clear(!0,!0)),this.lineGraphics.moveTo(n.x,n.y),i.forEach(function(t){e.pathGroup.create(t.x,t.y),e.lineGraphics.lineTo(t.x,t.y)}),this.lineGraphics.strokePath()}}]),t}(),b={type:h.a.AUTO,width:128,height:128,zoom:3,pixelArt:!0,scene:g};new h.a.Game(b)}});