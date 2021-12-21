function CInterface(){
    var _oAudioToggle;
    var _oButExit;
    var _oContainer;
    var _oButFullscreen;
    var _oHelpPanel=null;
    var _bMobileInitialized;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null; 
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _oButStartGame;
    var _oButHelp;
    var _pStartPosButHelp;
    var _oButSettings;
    var _pStartButSettings;
    var _bOnSettings;
    var _oPause;
    var _oPauseContainer;
    var _oShapeP1;
    var _oShapeP2;
    var _oParent;
    var _aPointsP1;
    var _aPointsP2;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oShapeP1 = new createjs.Shape();
        _oShapeP1.graphics.beginFill("#000000").drawRect(0,CANVAS_HEIGHT/2,CANVAS_WIDTH,CANVAS_HEIGHT/2);
        _oShapeP1.alpha = 0.01;
        _oContainer.addChild(_oShapeP1);
        
        _oShapeP2 = new createjs.Shape();
        _oShapeP2.graphics.beginFill("#000000").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT/2);
        _oShapeP2.alpha = 0.01;
        _oContainer.addChild(_oShapeP2);
        
        _bMobileInitialized = false;
        _oPauseContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        
        _aPointsP1 = new Array();
       _aPointsP2 = new Array();
       
        var oSprite = s_oSpriteLibrary.getSprite("but_kickoff");
        _oButStartGame = new CGfxButton(CANVAS_WIDTH*0.5,CANVAS_HEIGHT*0.5,oSprite,_oContainer);
        _oButStartGame.pulseAnimation();
        _oButStartGame.addEventListener(ON_MOUSE_DOWN,s_oGame.onMouseDown,this);
       
        var oSprite = s_oSpriteLibrary.getSprite("point_1");
        
        for (var i=0;i<POINTS_TO_WIN;i++){
           _aPointsP1.push(createBitmap(oSprite,oSprite.width,oSprite.height));
           _aPointsP2.push(createBitmap(oSprite,oSprite.width,oSprite.height));
           _aPointsP1[i].regX = oSprite.width/2;
           _aPointsP1[i].regY =  oSprite.height/2;
           _aPointsP1[i].x = CANVAS_WIDTH/2+360;
           _aPointsP1[i].y = CANVAS_HEIGHT/2+30+(45*i);
           _aPointsP2[i].regX = oSprite.width/2;
           _aPointsP2[i].regY =  oSprite.height/2;
           _aPointsP2[i].x = CANVAS_WIDTH/2+360;
           _aPointsP2[i].y = CANVAS_HEIGHT/2-30-(45*i);
           if (i>9){
               _aPointsP1[i].x = CANVAS_WIDTH/2+322;
               _aPointsP1[i].y = CANVAS_HEIGHT/2+30+(45*(i-10));
               _aPointsP2[i].x = CANVAS_WIDTH/2+322;
               _aPointsP2[i].y = CANVAS_HEIGHT/2-30-(45*(i-10));
           }
           _oContainer.addChild(_aPointsP1[i],_aPointsP2[i]);
           
       }
        
        
        
        _oContainer.addChild(_oPauseContainer);
        
        
        
        var oSprite = s_oSpriteLibrary.getSprite("but_settings");
        _pStartButSettings = {x: CANVAS_WIDTH-(oSprite.width/2)-10,y: (oSprite.height/2)+10};
        
        
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x:_pStartButSettings.x, y: _pStartButSettings.y+oSprite.height+10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite,_oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        _oButExit.setVisible(false);
        
        oSprite = s_oSpriteLibrary.getSprite("but_help");
        _pStartPosButHelp = {x:_pStartButSettings.x,y:_pStartPosExit.y+oSprite.height+10};
        _oButHelp = new CGfxButton(_pStartPosButHelp.x,_pStartPosButHelp.y,oSprite,_oContainer);
        _oButHelp.addEventListener(ON_MOUSE_UP,function(){new CPanelTutorial();},this);
        _oButHelp.setVisible(false);
        
        _pStartPosAudio = {x: _pStartPosButHelp.x,y: _pStartPosButHelp.y+oSprite.height+10};
        
        
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive, _oContainer);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            _oAudioToggle.setVisible(false);
        }

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen");
            if (_oAudioToggle){
                _pStartPosFullscreen = {x:_pStartPosAudio.x,y:_pStartPosAudio.y+oSprite.height+10};
            }else{
                _pStartPosFullscreen = {x:_pStartPosAudio.x,y:_pStartPosAudio.y};
            }
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,_oContainer);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreen,this);
            _oButFullscreen.setVisible(false);
        }
        
       
       oSprite = s_oSpriteLibrary.getSprite("but_settings");
         
        _oButSettings = new CGfxButton(_pStartButSettings.x,_pStartButSettings.y,oSprite,_oContainer);
        _oButSettings.addEventListener(ON_MOUSE_UP,this.onSettings);
        _bOnSettings = false;
       
       _oParent = this;
       
       
       
       this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };
    
    this.onSettings = function(){
        _oParent.setOnTop();
       if (!_bOnSettings){
           s_oGame.setStartGame(false);
           _oPause = new CPause(_oPauseContainer);
           _bOnSettings = true;
           _oButExit.setX(_oButSettings.getX());
           _oButExit.setY(_oButSettings.getY());
           _oButExit.setVisible(true);
           _oButHelp.setX(_oButSettings.getX());
           _oButHelp.setY(_oButSettings.getY());
           _oButHelp.setVisible(true);
           if (_oAudioToggle){
               _oAudioToggle.setX(_oButSettings.getX());
               _oAudioToggle.setY(_oButSettings.getY());
               _oAudioToggle.setVisible(true);
           }
           if (_oButFullscreen){
               _oButFullscreen.setX(_oButSettings.getX());
               _oButFullscreen.setY(_oButSettings.getY());
               _oButFullscreen.setVisible(true);
           }
           new createjs.Tween.get(_oButExit.getButtonImage()).to({x:_pStartPosExit.x-s_iOffsetX, y: _pStartPosExit.y+s_iOffsetY},300,createjs.Ease.cubicOut);
           new createjs.Tween.get(_oButHelp.getButtonImage()).to({x:_pStartPosButHelp.x-s_iOffsetX, y: _pStartPosButHelp.y+s_iOffsetY},300,createjs.Ease.cubicOut);
           if (_oAudioToggle){
               new createjs.Tween.get(_oAudioToggle.getButtonImage()).to({x:_pStartPosAudio.x-s_iOffsetX, y: _pStartPosAudio.y+s_iOffsetY},300,createjs.Ease.cubicOut);
          }
            if (_oButFullscreen){
                new createjs.Tween.get(_oButFullscreen.getButtonImage()).to({x:_pStartPosFullscreen.x-s_iOffsetX, y: _pStartPosFullscreen.y+s_iOffsetY},300,createjs.Ease.cubicOut);
          }
       }else{
           s_oGame.setStartGame(true);
           _oPause.onExit();
           _bOnSettings = false;
           
           new createjs.Tween.get(_oButExit.getButtonImage()).to({x:_oButSettings.getX(), y:_oButSettings.getY()},300,createjs.Ease.cubicIn).call(function(){
               _oButExit.setVisible(false);
               _oButHelp.setVisible(false);
                if (_oAudioToggle){
                    _oAudioToggle.setVisible(false);
                }
                if (_oButFullscreen){
                    _oButFullscreen.setVisible(false);
                }
           });
           
           new createjs.Tween.get(_oButHelp.getButtonImage()).to({x:_oButSettings.getX(), y: _oButSettings.getY()},300,createjs.Ease.cubicIn);
           if (_oAudioToggle){
               new createjs.Tween.get(_oAudioToggle.getButtonImage()).to({x:_oButSettings.getX(), y: _oButSettings.getY()},300,createjs.Ease.cubicIn);
          }
            if (_oButFullscreen){
                new createjs.Tween.get(_oButFullscreen.getButtonImage()).to({x:_oButSettings.getX(), y: _oButSettings.getY()},300,createjs.Ease.cubicIn);
          }
       }
    };
    
    this.unload = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }

        _oButExit.unload();
        
        s_oStage.removeChild(_oContainer);
        if (_fRequestFullScreen && screenfull.isEnabled) {
            _oButFullscreen.unload();
        }        

        s_oInterface = null;
        
    };
    
    this.goalP1 = function(iScoreP1){
        var oSprite = s_oSpriteLibrary.getSprite("point_2");
        var oScoredPoint = createBitmap(oSprite,oSprite.width,oSprite.height);
            oScoredPoint.alpha = 0;
            oScoredPoint.regX = oSprite.width/2;
            oScoredPoint.regY = oSprite.width/2;
            oScoredPoint.x = _aPointsP1[(iScoreP1-1)].x;
            oScoredPoint.y = _aPointsP1[(iScoreP1-1)].y;
            _oContainer.addChild(oScoredPoint);
           new createjs.Tween.get(oScoredPoint).to({alpha: 1}, 1000);
    };
    
    this.goalP2 = function(iScoreP2){
        var oSprite = s_oSpriteLibrary.getSprite("point_2");
        var oScoredPoint2 = createBitmap(oSprite,oSprite.width,oSprite.height);
             oScoredPoint2.alpha = 0;
             oScoredPoint2.regX = oSprite.width/2;
             oScoredPoint2.regY = oSprite.width/2;
             oScoredPoint2.x = _aPointsP2[(iScoreP2-1)].x;
             oScoredPoint2.y = _aPointsP2[(iScoreP2-1)].y;
             _oContainer.addChild(oScoredPoint2);
            new createjs.Tween.get(oScoredPoint2).to({alpha: 1}, 1000);
    };
    
    this.setVisibleButKickOff = function(bVal){
       _oButStartGame.setVisible(bVal); 
    };
    
    this.initMobileButtons = function(){
        _bMobileInitialized = true;
        
        
        
        _oShapeP1.on("mousedown",s_oGame.onTouchDownMobileP1);
        _oShapeP1.on("pressup",s_oGame.onTouchUpMobileP1);
        
        if (s_b2Players){
           _oShapeP2.on("mousedown",s_oGame.onTouchDownMobileP2);
           _oShapeP2.on("pressup",s_oGame.onTouchUpMobileP2); 
        };
        
        //_oContainer.addChild(_oButSettings);
        
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
       // _oContainerScore.y = _pStartPosContainerScore.y +iNewY;
       _oButSettings.setPosition(_pStartButSettings.x-iNewX,_pStartButSettings.y+iNewY);
        
        _oButExit.setPosition(_pStartPosExit.x - iNewX, _pStartPosExit.y+iNewY);
        
        _oButHelp.setPosition(_pStartPosButHelp.x- iNewX,_pStartPosButHelp.y+iNewY);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,_pStartPosAudio.y+iNewY);
        }

        if (_fRequestFullScreen && screenfull.isEnabled) {
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX, _pStartPosFullscreen.y+iNewY);
        }
    };

    this.setOnTop = function(){
       s_oStage.addChildAt(_oContainer,s_oStage.numChildren); 
    };

    this.refreshScore = function(iValue){
        //_oScoreNum.alpha=1;
        //_oScoreNum.text = iValue;
    };

    this._onButHelpRelease = function(){
        _oHelpPanel = new CHelpPanel();
    };
    
    this._onButRestartRelease = function(){
        s_oGame.restartGame();
        $(s_oMain).trigger("restart_level", 1);
    };
    
    this.onExitFromHelp = function(){
        _oHelpPanel.unload();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onExit = function(){
        new CAreYouSurePanel(s_oGame.onExit);
    };
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.isEnabled){
		_oButFullscreen.setActive(s_bFullscreen);
	}
    };

    this._onFullscreen = function(){
        if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
    
    s_oInterface = this;
    
    this._init();
    
    return this;
}

var s_oInterface = null;