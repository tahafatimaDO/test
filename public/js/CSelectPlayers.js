function CSelectPlayers (){
    
    var _oContainer;
    var _oButP1;
    var _oButP2;
    var _oText;
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _oButExit;
    var _oAudioToggle;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _iHeightToggle;
    
    this.init = function(){
        s_oSelectPlayers=this;
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite("bg_menu");
        var shape = new createjs.Shape();
        shape.graphics.beginFill("#000000").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        shape.alpha = 0;
        var oBg = new createBitmap(oSprite,oSprite.width,oSprite.height);
        _oContainer.addChild(oBg);
        _oContainer.addChild(shape);
        oSprite = s_oSpriteLibrary.getSprite("but_p1");
        _oButP1 = new CGfxButton(CANVAS_WIDTH/2-225,CANVAS_HEIGHT/2,oSprite,_oContainer);
        _oButP1.addEventListener(ON_MOUSE_DOWN,function(){this.onSelectPlayer(false);},this);
        oSprite = s_oSpriteLibrary.getSprite("but_p2");
        _oButP2 = new CGfxButton(CANVAS_WIDTH/2+225,CANVAS_HEIGHT/2,oSprite,_oContainer);
        _oButP2.addEventListener(ON_MOUSE_DOWN,function(){this.onSelectPlayer(true);},this);
        
        var iWidth = CANVAS_WIDTH - EDGEBOARD_X*2 - 10;
        var iHeight = 120;
        var iX = CANVAS_WIDTH/2;
        var iY = CANVAS_HEIGHT/2-300;

        _oText = new CTLText(_oContainer, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    72, "center", "#4ce700", PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_SELECT_PLAYERS_MENU,
                    true, true, false,
                    false );
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
	_pStartPosExit = {x:CANVAS_WIDTH - (oSprite.width/2)-10,y:(oSprite.height/2)+10};
        _oButExit = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite,_oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        _iHeightToggle = oSprite.height;
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _pStartPosAudio = {x:_oButExit.getX() - oSprite.width-10,y:(oSprite.height/2)+10 }
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,s_oSpriteLibrary.getSprite('audio_icon'),s_bAudioActive,_oContainer);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x: oSprite.width/4 + 10,y:(oSprite.height/2)+10};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,_oContainer);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
        
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,_pStartPosExit.y + iNewY);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX,_pStartPosFullscreen.y + iNewY);
        }
    };
    
    this.onSelectPlayer = function(bVal){
        s_b2Players = bVal;
        this.unload();
        if (!s_b2Players){
            s_oMain.gotoLevelMenu();
        }else{
            START_PROGRESSIVE_BALL_VELOCITY = ARRAY_BALL_SPEED[1].start_speed;
            PROGRESSIVE_STEP_BALL_VELOCITY = ARRAY_BALL_SPEED[1].step;
            LIMIT_SPEED = ARRAY_BALL_SPEED[1].limit;
            INDEX_DIFFICULT = 1;
            s_oMain.gotoGame();
        }
    };
    
    this.unload = function(){
       s_oStage.removeChild(_oContainer); 
       s_oSelectPlayers;
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.isEnabled){
		_oButFullscreen.setActive(s_bFullscreen);
	}
    };

    this._onFullscreenRelease = function(){
        if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
    
    this._onExit = function(){
        this.unload();
        s_oMain.gotoMenu();
    };
    
    this.init();
}

var s_oSelectPlayers = null;
