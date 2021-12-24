function CEndPanel(oSpriteBg,iWinner){
    
    var _oBg;
    var _oGroup;
    
    var _oMsgText;
    var _oScoreText;
    var _iScore;
    var _oButRestart;
    var _oButHome;
    var _iWinner;
    var _szEndSound;
    var _iGlobalScore;
    var _oShape;
    
    this._init = function(oSpriteBg,iWinner){
        s_oGame.setPause(true);
        
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;     

        s_oStage.addChild(_oGroup);
        
        _iWinner = iWinner;
        _oShape = new createjs.Shape();
        _oShape.graphics.beginFill("#000").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oShape.alpha = 0.5;
        _oShape.on("mousedown",this.onMouseDown,this);
        
        _oBg = createBitmap(oSpriteBg);
        var oBgInfo = _oBg.getBounds();
        _oBg.regX = oBgInfo.width/2;
        _oBg.regY = oBgInfo.height/2;
        _oBg.x = CANVAS_WIDTH/2;
        _oBg.y = CANVAS_HEIGHT/2;
        
        _oGroup.addChild(_oShape,_oBg);
        
        var iWidth = 550;
        var iHeight = 120;
        var iX = CANVAS_WIDTH/2;
        var iY = s_b2Players ? (CANVAS_HEIGHT/2)-20 : (CANVAS_HEIGHT/2)-68;
        
        _oMsgText = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    47, "center", "#4ce700", PRIMARY_FONT, 1,
                    2, 2,
                    "",
                    true, true, true,
                    false );
        
        var iWidth = 550;
        var iHeight = 120;
        var iX = CANVAS_WIDTH/2;
        var iY = (CANVAS_HEIGHT/2) + 68;
        
        _oScoreText = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    32, "center", "#4ce700", PRIMARY_FONT, 1,
                    2, 2,
                    "0",
                    true, true, false,
                    false );

        var oSprite = s_oSpriteLibrary.getSprite("but_restart");
        _oButRestart = new CGfxButton(CANVAS_WIDTH/2+100,CANVAS_HEIGHT/2+195,oSprite,_oGroup);
        
        oSprite = s_oSpriteLibrary.getSprite("but_home");
        _oButHome = new CGfxButton(CANVAS_WIDTH/2-100,CANVAS_HEIGHT/2+195,oSprite,_oGroup);
    };
    
    this.unload = function(){
        _oShape.removeAllEventListeners();
    };
    
    this.onMouseDown = function(){
        
    };
    
    this._initListener = function(){
        _oButHome.addEventListener(ON_MOUSE_DOWN,this._onExit,this);
        _oButRestart.addEventListener(ON_MOUSE_DOWN,this._onRestart, this);
    };
    
    this.show = function(iScore,iWinner){
        _iGlobalScore = 0;
        if (iWinner===0||s_b2Players){
	_szEndSound = "win_panel";
        }else{
              _szEndSound =  "game_over";
        }
        playSound(_szEndSound,1,false);
        _iScore = iScore;
        
        var iPlayerWin = iWinner + 1;
        
        if (iWinner===0){
            _oMsgText.refreshText(TEXT_GAMEOVER);
            //_oMsgText.y = (CANVAS_HEIGHT/2)-30;
            //_oMsgTextBack.y = (CANVAS_HEIGHT/2)-28;
        }else{
            iScore = 0;
            _iScore = 0;
            _oMsgText.refreshText(TEXT_LOSE+iPlayerWin+TEXT_LOSE2);
        }
        
        if (s_b2Players===true){
            _oMsgText.refreshText( TEXT_WIN_2PLAYERS+iPlayerWin+TEXT_WIN_2PLAYERS_2);
        }else{
            _oScoreText.refreshText (TEXT_SCORE +": "+iScore);
        }
        
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
        
        if (!s_bFriendly){
            $(s_oMain).trigger("save_score",_iScore);  
            $(s_oMain).trigger("show_interlevel_ad");
            $(s_oMain).trigger("end_session");
        }
    };
    
    this._onExit = function(){
        stopSound(_szEndSound);
        
        if (!s_bFriendly){
            var szImg = "200x200.jpg";
            var szTitle = "Congratulations!";
            var szMsg = "You collected <strong>" + _iScore + " points</strong>!<br><br>Share your score with your friends!";
            var szMsgShare = "My score is " + _iScore + " points! Can you do better?";        
            $(s_oMain).trigger("share_event",_iScore, szImg, szTitle, szMsg, szMsgShare);
        }

        s_oStage.removeChild(_oGroup);
        
        
        s_oGame.unload();
        s_oMain.gotoMenu();
    };
    
    this._onRestart = function(){
        stopSound(_szEndSound);
       s_oGame.unload();
       s_oMain.gotoGame();
       s_oStage.removeChild(_oGroup);
       if (!s_b2Players){
            var szImg = "200x200.jpg";
            var szTitle = "Congratulations!";
            var szMsg = "You collected <strong>" + _iScore + " points</strong>!<br><br>Share your score with your friends!";
            var szMsgShare = "My score is " + _iScore + " points! Can you do better?";        
            $(s_oMain).trigger("share_event",_iScore, szImg, szTitle, szMsg, szMsgShare);
        }
        
       
    };
    
    this._init(oSpriteBg,iWinner);
    
    return this;
}
