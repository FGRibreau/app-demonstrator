// AppDemonstrator
// @FGRibreau 2011

function Scene($iPhone, $text, $section, screensDir){
  // Iphone
  this.$i = $iPhone;

  // Zoomer
  this.$z = $('<div class="zoomer"/>').appendTo(this.$i);

  // Text
  this.$t = $text;

  // Section container
  this.$section = $section;

  this.screensDir = screensDir


  this.frames = [];
}

Scene.prototype = {

  // A frame to the scene
  add: function(id, option){

    var $e = $('#'+id).next('div');
    
    // Find a better way to do this
    var $text = $e.clone();
    $text.find('figure, img').remove();

    this.frames.push(new Frame(this, id, $.extend({}, {text:$text}, option)));

    return this;
  },

  start: function(){
    this.frames[0].run();
  },

  goto: function(frameId){
    return $.proxy(function(){
     return this.frames.filter(function(el){return el.id == frameId})[0]; 
    }, this);
  }
};

function Frame(Scene, id, opt){
  this.Scene = Scene;

  this.id = id;
  this.img = (opt.bg || Scene.screensDir + id)+'.png';
  $.extend(this, {timeout:false}, opt);
}

Frame.prototype = {

  _setBg: function(img){
    this.Scene.$i[0].style.backgroundImage = "url(%)".replace('%', img || this.img);
  },

  _setText: function(cb){
    if(!this.text){
      return cb();
    }

    this.Scene.$t.html(this.text).hide().fadeIn(500, cb);
  },

  // _zoomer Move the zoomer
  // @topArray = [[top, height, delay, width, left], ...]
  _zoomer: function(topArray, onDone){
    var self = this
    ,   i = 0;

    function next(){
      var n = topArray.shift();

      if(n){
        doZoom(n);
      } else {
        onDone();
      }
    }

    function doZoom(n){
      self.Scene.$t.find('.c'+i).show(100);

      self.Scene.$z.show().animate({
        top:n[0],
        height:(n[1] || 100),
        left:n[4] || 0,
        width:n[3] || '100%',
      }, {
        duration: 500,
        complete: function(){
          i++;

          if(n[2]){
            setTimeout(next, n[2]);
          } else {
            next();
          }
        }
      });
    }

    next();
    
  },

  _zoomerClean: function(){
    this.Scene.$z.hide().css({
        top:0,
        height:0,
        width:'100%',
        left:0});
    this.zoomer = null;
  },


  run:function(){
    if(this.onLoad){
      this.onLoad.call(this);
    }

    this.Scene.$i.unbind();
    this.Scene.$i.removeClass('pulse');

    this._setBg();

    this._setText($.proxy(this.next, this));
  },

  next: function(){
    var self = this;

    if(this.zoomer){
      return this._zoomer(this.zoomer, function(){

        self.zoomer = null;

        if(self.zoomerOnComplete){
          self.timeout = self.zoomerOnComplete;
        }

        self.next();// Relancer le next sur ce screen
      });
    }

    if(this.onClick){
      this.Scene.$i.bind('click', $.proxy(function(){
        this.timeout = this.onClick;
        this.next();
      },this));

      this.Scene.$i.addClass('pulse');
    }

    if(this.timeout){
      if(this.timeout[1].goto){
        var _nextScreen = this.timeout[1].goto();

        if(!_nextScreen){
          return self.Scene.goto('end')().run();
        }

        setTimeout(function(){

          var _cb = function(){
            self._zoomerClean();
            self.Scene.$i.fadeIn(100);
            _nextScreen.run();
          }

          self.Scene.$i[self.timeout[1].transition || 'fadeOut'](100, _cb);

        }, this.timeout[0]);
      }
      
    }
  }
};