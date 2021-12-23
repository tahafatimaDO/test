function CMenu(){
    var _oBg;
    var _oButPlay;
    var _oFade;
    var _oAudioToggle;
    //var _oCreditsBut;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    //var _pStartPosCredits;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _oButTournament;
    var _oLogoMenu;
    var _pStartPosDeleteSave;
    var _oDeleteSaveBut;
    var _pStartPosFriendlyBut;
    var _pStartPosTournamentBut;
    var _aEdgesMenu;
    var _aBalls;
    
    
    this._init = function(){
        s_b2Players = false;
        if (s_oSoundtrack){
            setVolume(s_oSoundtrack,1);
        }
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);
        
        _aBalls = new Array();
        _aEdgesMenu = new Array();
        
        _aEdgesMenu[0] = new CEdge(0,CANVAS_HEIGHT,0,5,false).getModel(); //Horizontal Line Up;
        _aEdgesMenu[1] = new CEdge(CANVAS_WIDTH,0,CANVAS_WIDTH,CANVAS_HEIGHT,5,false).getModel(); //Horizontal Line Down;
        _aEdgesMenu[2] = new CEdge(0,0,CANVAS_WIDTH,0,5,false).getModel();
        _aEdgesMenu[3] = new CEdge(CANVAS_WIDTH,CANVAS_HEIGHT,0,CANVAS_HEIGHT,5,false).getModel();
        
        for (var i=0;i<1;i++){
            _aBalls.push(new CBall(CANVAS_WIDTH/2,CANVAS_HEIGHT/2,s_oSpriteLibrary.getSprite("ball"),"ball_0",s_oStage));
        }
        var vLaunch;
        
        for (var i=0;i<_aBalls.length;i++){
            vLaunch = new CVector2( randomFloatBetween(1,2.5)*randomSign(), randomFloatBetween(1,2.5)*randomSign());
            vLaunch.normalize();
            vLaunch.scalarProduct(3);
            _aBalls[i].vCurForce().setV(vLaunch);
        }

        var oSprite = s_oSpriteLibrary.getSprite('but_mode');
        _pStartPosFriendlyBut = {x: CANVAS_WIDTH/2-225,y: CANVAS_HEIGHT -200};
        _oButPlay = new CTextButton(_pStartPosFriendlyBut.x,_pStartPosFriendlyBut.y,oSprite,TEXT_CLASSIC_MODE,PRIMARY_FONT,"#4ce700",40,s_oStage);
        _oButPlay.addEventListener(ON_MOUSE_DOWN, this._onButFriendlyRelease, this);
        
        _pStartPosTournamentBut = {x:(CANVAS_WIDTH/2+225),y:CANVAS_HEIGHT -200};
        _oButTournament = new CTextButton(_pStartPosTournamentBut.x,_pStartPosTournamentBut.y,oSprite,TEXT_ADVANCED_MODE,PRIMARY_FONT,"#4ce700",40,s_oStage);
        _oButTournament.addEventListener(ON_MOUSE_DOWN, this._onButTournamentRelease, this);
     
        //var oSprite = s_oSpriteLibrary.getSprite('but_info');
        //_pStartPosCredits = {x: (oSprite.height/2) + 10, y: (oSprite.height/2) + 10};            
        //_oCreditsBut = new CGfxButton((CANVAS_WIDTH/2),CANVAS_HEIGHT -240,oSprite, s_oStage);
        //_oCreditsBut.addEventListener(ON_MOUSE_UP, this._onCreditsBut, this);

        
        var aImages = new Array();
        for (var i=0;i<33;i++){
            aImages.push(s_oSpriteLibrary.getSprite("logo_menu_"+i));
        }
        
       var oData = {
          images: aImages,
          frames: {width: 726, height: 142, regX: 726*0.5, regY: 142*0.5},
          animations: {idle: [0,32,"idle",0.7]}
       };
       
       var oSpriteSheet = new createjs.SpriteSheet(oData);
       _oLogoMenu = createSprite(oSpriteSheet,"idle",oData.frames.regX,oData.frames.regY,oData.frames.width,oData.frames.height);
       _oLogoMenu.x = CANVAS_WIDTH/2;
       _oLogoMenu.y = CANVAS_HEIGHT/2-100;
       s_oStage.addChild(_oLogoMenu);
     
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height/2+10), y: (oSprite.height/2) + 10};      
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive, s_oStage);
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
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen")
            _pStartPosFullscreen = {x: (oSprite.height/2) + 10, y: (oSprite.height/2) + 10};
            //_pStartPosFullscreen = {x:_pStartPosCredits.x + oSprite.width/2 + 10,y:(oSprite.height/2) + 10};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,false, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreen,this);
        }
        var iWidth = oSprite.width-100;
        var iHeight = 120;
        new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-120, 40, iWidth, iHeight, 
                    40, "center", "#ffffff", PRIMARY_FONT, 1,
                    2, 2,
                    "ember",
                    true, true, false,
                    false );

        var oSprite = s_oSpriteLibrary.getSprite('logo0');
        _oLogo = createBitmap(oSprite);
        //_oLogo.on("click",this._onLogoButRelease);
        _oLogo.x = CANVAS_WIDTH/2 + 2;
        _oLogo.y = 10;
        _oLogo.scaleX = 0.7;
        _oLogo.scaleY = 0.7;        
        s_oStage.addChild(_oLogo);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        //_oFade.on("click", function(){});
        
        s_oStage.addChild(_oFade);
        
        var oParent = this;
        createjs.Tween.get(_oFade).to({alpha:0}, 1000).call(function(){_oFade.visible = false;_oFade.removeAllEventListeners();});  
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
        
    };
    
    
    this.update = function(){
        for (var i=0; i<10;i++){
            for (var j=0; j<_aBalls.length;j++){
                _aBalls[j].vPos().addV(_aBalls[j].vCurForce());
                _aBalls[j].updateTrajectory();
                this.collideCircleWithEdges(_aBalls[j],_aEdgesMenu);
            }
        }
        
        for (var i=0;i<_aBalls.length;i++){
            _aBalls[i].updateSpritePosition();
        }
        
    };
    
    
    this.collideCircleWithEdges = function(oBall,aEdge){
            for (var i=0;i<aEdge.length;i++){
                var oInfo = collideEdgeWithCircle(aEdge[i],oBall.vPos(),oBall.getRadius() );
                if ( oInfo ){
                    var vEdgeNormal = new CVector2();
                    vEdgeNormal.setV(aEdge[i].getNormal());
                   vEdgeNormal.scalarProduct(oBall.getRadius()*1.05);
                    oInfo.closest_point.addV(vEdgeNormal);
                    oBall.setPos(oInfo.closest_point);
                    reflectVectorV2(oBall.vCurForce(), aEdge[i].getNormal());
                    break;
                }
            }
        };
    
    
    this.unload = function(){

        _oButPlay.unload(); 
        _oButTournament.unload();
        _oButPlay = null;
        _oFade.visible = false;
        
        //_oCreditsBut.unload();
        
        for (var i=_aBalls.length-1;i>=0;i--){
            _aBalls[i].unload();
            _aBalls.pop();
        }
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        
        s_oStage.removeAllChildren();
        _oBg = null;
        s_oMenu = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButPlay.setPosition(_pStartPosFriendlyBut.x,_pStartPosFriendlyBut.y-iNewY);
        _oButTournament.setPosition(_pStartPosTournamentBut.x,_pStartPosTournamentBut.y-iNewY);
        //_oCreditsBut.setPosition(_pStartPosCredits.x + iNewX,iNewY + _pStartPosCredits.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
                _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX, _pStartPosFullscreen.y + iNewY);
        }
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    /*this._onCreditsBut = function(){
        new CCreditsPanel();
    };*/
    
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
    
    this._onButFriendlyRelease = function(){
        
        this.unload();
        $(s_oMain).trigger("start_session");
        s_bFriendly = false;
        console.log('_onButFriendlyRelease')
        ADVANCED_MODE = false;
        s_oMain.gotoSelectPlayers();

        
        
        if ((s_oSoundtrack === null||s_oSoundtrack === undefined)){
            if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
                s_oSoundtrack = playSound('soundtrack', 0.4, true);
            }
        }
        
    };
    
    this._onButTournamentRelease = function(){
        this.unload();
        
        $(s_oMain).trigger("start_session");
        s_bFriendly = false;
        console.log('_onButTournamentRelease')
        ADVANCED_MODE = true;
        s_oMain.gotoSelectPlayers();
        
        
        
        if ((s_oSoundtrack === null||s_oSoundtrack === undefined)){
                s_oSoundtrack = playSound('soundtrack', 1, true);
            
        }
    };
	
    s_oMenu = this;
    
    this._init();
}

var s_oMenu = null;