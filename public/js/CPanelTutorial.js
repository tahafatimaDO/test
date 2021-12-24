function CPanelTutorial (bFirstPlay){
    
    var _oContainer;
    var _oPanel;
    var _oButNext;
    var _oButBack;
    var _oButSkip;
    var _iCurrentPage;
    var _oContainerPage;
    var _iLastPag;
    
    this.init = function () {
        if (bFirstPlay){
            s_oGame.setStartGame(false);
        }
        if (ADVANCED_MODE){
            _iLastPag = 3;
        }else{
            _iLastPag = 2;
        }
        var oSprite;
        var shape = new createjs.Shape();
        shape.graphics.beginFill("#000000").drawRect(-(CANVAS_WIDTH/2),-(CANVAS_HEIGHT/2),CANVAS_WIDTH,CANVAS_HEIGHT);
        shape.alpha = 0.7;
        shape.on("mousedown",this.onOver,this);
        _oContainerPage = new createjs.Container();
        _iCurrentPage = 0;
        _oContainer = new createjs.Container();
        _oContainer.x = CANVAS_WIDTH/2;
        _oContainer.y = CANVAS_HEIGHT/2;
        _oContainer.addChild(shape);
        _oContainer.alpha = 0;
        oSprite = s_oSpriteLibrary.getSprite("msg_box");
        _oPanel = new createBitmap(oSprite);
        _oPanel.regX = oSprite.width/2;
        _oPanel.regY = oSprite.height/2;
        _oPanel.alpha = 0.8;
        _oContainer.addChild(_oPanel);
        s_oStage.addChild(_oContainer);
        oSprite = s_oSpriteLibrary.getSprite("skip_arrow");
        _oButNext = new CGfxButton(350,0,oSprite,_oContainer);
        _oButNext.addEventListener(ON_MOUSE_DOWN,this.onButNext,this);
        oSprite = s_oSpriteLibrary.getSprite("skip_arrow_left");
        _oButBack = new CGfxButton(-350,0,oSprite,_oContainer);
        _oButBack.addEventListener(ON_MOUSE_DOWN,this.onButBack,this);
        _oButSkip = new CGfxButton(0,_oContainer.getBounds().height/2,s_oSpriteLibrary.getSprite("but_next"),_oContainer);
        _oButSkip.addEventListener(ON_MOUSE_DOWN,this.onButSkip,this);
        this.loadPage(_iCurrentPage);
        new createjs.Tween.get(_oContainer).to({alpha: 1},500);
        
    };
    
    this.loadPage = function (iPage){
        var oText;
        var oSprite;
        var oImage0;
        var oImage1;
        var oImage2;
        var oImage3;
        var oText1;
        var oText2;
        
        var iWidth = 500;
        var iHeight = 120;
        var iX = 0;
        var iY = 0;

        oText = new CTLText(_oContainerPage, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    31, "center", "#4ce700", PRIMARY_FONT, 1,
                    2, 2,
                    '',
                    true, true, true,
                    false );
        
        oText1 = new CTLText(_oContainerPage, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    40, "center", "#4ce700", PRIMARY_FONT, 1,
                    2, 2,
                    '',
                    true, true, false,
                    false );
        
        oText2 = new CTLText(_oContainerPage, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    40, "center", "#4ce700", PRIMARY_FONT, 1,
                    2, 2,
                    '',
                    true, true, false,
                    false );
        
        switch (iPage){
            case 0: 
                oText.refreshText(TEXT_TUTORIAL_1);
                oText.setY(-150);
                if (s_bMobile){
                    oText.refreshText(TEXT_TUTORIAL_1_3);
                    oText.setY(-50);
                }else if(s_b2Players){
                    oText.refreshText(TEXT_TUTORIAL_1_2);
                    oSprite = s_oSpriteLibrary.getSprite("key_w");
                    oImage0 = new createBitmap(oSprite,oSprite.width,oSprite.height);
                    oImage0.x = -240;
                    oImage0.y = 40;
                    oSprite = s_oSpriteLibrary.getSprite("key_s");
                    oImage1 = new createBitmap(oSprite,oSprite.width,oSprite.height);
                    oImage1.x = -140;
                    oImage1.y = 40;
                    oSprite = s_oSpriteLibrary.getSprite("key_up");
                    oImage2 = new createBitmap(oSprite,oSprite.width,oSprite.height);
                    oImage2.x = +159;
                    oImage2.y = 40;
                    oSprite = s_oSpriteLibrary.getSprite("key_down");
                    oImage3 = new createBitmap(oSprite,oSprite.width,oSprite.height);
                    oImage3.x = +61;
                    oImage3.y = 40;
                    
                    oText1.refreshText(TEXT_TUTORIAL_PLAYER+" 1");
                    oText1.setX(-147);
                    oText1.setY(-20);
                    oText2.refreshText(TEXT_TUTORIAL_PLAYER+" 2");
                    oText2.setX(152);
                    oText2.setY(-20);
                    _oContainerPage.addChild(oImage2,oImage3);
                }else{
                    oSprite = s_oSpriteLibrary.getSprite("key_w");
                    oImage0 = new createBitmap(oSprite,oSprite.width,oSprite.height);
                    oImage0.x = -200 + 30;
                    oImage0.y = 0;
                    oSprite = s_oSpriteLibrary.getSprite("key_s");
                    oImage1 = new createBitmap(oSprite,oSprite.width,oSprite.height);
                    oImage1.x = +120 - 30;
                    oImage1.y = 0;
                }
                _oContainerPage.addChild(oImage0,oImage1);
                _oContainer.addChild(_oContainerPage);
                break;
                
            case 1:
                if (!s_bMobile){
                    oText.refreshText(TEXT_TUTORIAL_3);
                }else{
                    oText.refreshText(TEXT_TUTORIAL_4);
                }
                
                oText.setY(-140);
                oSprite = s_oSpriteLibrary.getSprite("but_kickoff");
                oImage0 = new createBitmap(oSprite,oSprite.width,oSprite.height);
                oImage0.x = -oSprite.width/2;
                oImage0.y = 0;
                _oContainerPage.addChild(oImage0);
                break;
                
            case 2:
                if (ADVANCED_MODE){
                    oText.refreshText(TEXT_TUTORIAL_5);
                    oText.setY(-65);                    
                }else{
                    oText.refreshText(TEXT_TUTORIAL_2);
                    oText.setY(-65);               
                }
                break;
            case 3:
                oText.refreshText(TEXT_TUTORIAL_2);
                oText.setY(-65);
            break;
         }
    };
    
    this.onButNext = function(){
        if (_iCurrentPage===_iLastPag){
          _iCurrentPage= 0;  
        }else{
            _iCurrentPage++;
        }
            _oContainerPage.removeAllChildren();
            this.loadPage(_iCurrentPage);
    };
    
    this.onButBack = function(){
        if (_iCurrentPage===0){
            _iCurrentPage = _iLastPag;
        }else{
            _iCurrentPage--;
        }
       _oContainerPage.removeAllChildren();
       this.loadPage(_iCurrentPage);
    };
    
    this.onButSkip = function(){
        new createjs.Tween.get(_oContainer).to({alpha: 0},500).call(function(){
            s_oStage.removeChild(_oContainer);
            if (bFirstPlay){
                s_oGame.setStartGame(true);
            }
        });
    };
    
    this.onOver = function(){
        
    };
    
    this.init();
}