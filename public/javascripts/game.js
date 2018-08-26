"use strict";

(function (w, d) {
    var _this;

    var ezGame = function ezGame (options) {
        return new ezGame.prototype.init(options);
    }
    
    ezGame.prototype.init = function (options) {
        _this = this;
        _this.options = options;

        if(!_this.options.id) throw new Error('ezGame must be initialized with an ID');
        
        _this.canvas = d.createElement('canvas');
        _this.canvas.id = _this.options.id;
        _this.canvas.width = _this.options.width || 800;
        _this.canvas.height = _this.options.height || 600;
        _this.ctx = _this.canvas.getContext('2d');

        if(_this.options.assets && _this.options.assets.length) _this.loadAssets();

        w.addEventListener('load', function load () {
            d.body.appendChild(_this.canvas);
            w.removeEventListener('load', load);
        });

    }
    
    ezGame.prototype.loadAssets = function () {
        var i = _this.options.assets.length, asset;

        while(i--) {
            asset = _this.options.assets[i];
            if(!asset.type) throw new Error('Asset must be assigned a type');
            if(!asset.src) throw new Error('Asset must be assigned a source');

            switch(asset.type.trim().toLowerCase()) {
                case 'image' : _this.addImage(asset); break;
                case 'spritemap' : _this.addSpriteMap(asset); break;
            }
            
        }
    }

    ezGame.prototype.addImage = function (obj) {
        if(!obj.id) throw new Error('Image must be assigned and ID');

        var img = d.createElement('img');
        img.src= obj.src;

        if(!_this.images) _this.images = [];
        
        _this.images[obj.id] = img;
    }
    
    ezGame.prototype.drawImage = function(id, x, y, scale) {
        scale = scale || 1, x = x || 0, y = y || 0;

        var img = _this.images[id], width = img.width * scale, height = img.height * scale;
        
        _this.ctx.drawImage(img, x, y, width, height);
    }

    ezGame.prototype.addSpriteMap = function (obj) {
        if(!obj.id) throw new Error('Spritemap must be assigned and ID');

        var spritemap = d.createElement('img');
        spritemap.src = obj.src;

        if(!_this.spritemaps) _this.spritemaps = [];
        
        _this.spritemaps[obj.id] = {
            src : spritemap,
            map : (function () {
                var _map = [], w = spritemap.width / obj.dims[0], h = spritemap.height / obj.dims[1];

                for(var x = 0, y = 0; y < obj.dims[1]; x++) {
                    if(x === obj.dims[0]) {
                        x = 0;
                        y++;
                    }
                    if (y < obj.dims[1]) {
                        if(!_map[y]) _map.push([]);
                        _map[y].push([w * x, h * y]);
                    }
                }

                return _map;
            })(),
            dims : [spritemap.width / obj.dims[0], spritemap.height / obj.dims[1]]
        };
    }

    ezGame.prototype.drawSprite = function (id, col, row, x, y, scale) {
        scale = scale || 1, x = x || 0, y = y || 0;
        var img = _this.spritemaps[id];
        _this.ctx.drawImage(img.src, img.map[row][col][0], img.map[row][col][1], img.dims[0], img.dims[1], x, y, img.dims[0] * scale, img.dims[1] * scale);
    }

    ezGame.prototype.init.prototype = ezGame.prototype;

    if(typeof window.ezGame === 'undefined') {
        window.ezGame = ezGame;
    } else {
        throw new Error('Error assigning ezGame to global scope!');
    }
    
})(window, document);


var game = ezGame({
    id : 'game',
    assets : [
        {
            type: 'spritemap',
            src : '/images/sprite.png',
            id : 'man',
            dims : [9,4]
        }
    ]
});



// var ez = function ez (play) {
//     var _this = this;

//     return (function(win, doc, init){
//         var spriteMap = doc.createElement('img');
//         var canvas = doc.createElement('canvas');
//         var graph = canvas.getContext('2d');
    
//         canvas.id = 'game';
//         canvas.width = 800;
//         canvas.height = 600;
    
//         spriteMap.src = '/images/sprite.png';
    
//         win.addEventListener('load', function build () {
//             doc.body.appendChild(canvas);

//             _this.sprites = init(graph, spriteMap);
//             _this.sprites.sprite = spriteMap;
//             _this.ctx = graph;

//             //window.requestAnimationFrame(play);
//         });
    
//     })(window, document, function (game, spriteMap) {
//         var w = spriteMap.width / 9, h = spriteMap.height / 4, map = [];



//         return map;
//     });
// }

// var game = new ez(function step () {
//     game.ctx.drawImage(game.sprites.sprite, 0 ,0);
//     window.requestAnimationFrame(step);
// });

