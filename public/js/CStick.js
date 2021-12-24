function CStick (iX,iY,iColorStick,iXLeft,iXRight,aPosEdges,iTypeStick,iSpeed){
    var _oContainer;
    var _iXLeftMax;
    var _iXRightMax;
    var _aPosEdges;
    var _aPlayerEdges;
    var _aSpritesPlayer;
    var _iTypeStick;
    var _iSpeed;
    var _iColorStick;
    var _iCurAcceleration;
    var _iRotationSprite;
    var _aFramesAnimation;
    var _iCurrentFrame;
    var _iPosNeg;
    var _bStrongShot;
    var _iTimeStrongShotPowerUP;
    var _bUserMovement;
    
    this.init = function(iX,iY,iColorStick,iXLeft,iXRight,aPosEdges,iTypeStick,iSpeed){
        var oSprite;
        var oSprite2;
        var oInfo;
        var iOffsetSpeed = 0;
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        _aPlayerEdges = new Array();
        _aSpritesPlayer = new Array();
        _iColorStick = iColorStick;
        _iCurAcceleration = 0;
        _iTypeStick = iTypeStick;
        
        _bUserMovement = false;
        _iSpeed = iSpeed;
        _bStrongShot = false;
        _iXLeftMax = iXLeft;
        _iXRightMax = iXRight;
        _aPosEdges = aPosEdges;
        _iTimeStrongShotPowerUP = 0;
        _iRotationSprite=0;
        if (_iColorStick===BLUE_STICK||s_b2Players){
            oSprite = s_oSpriteLibrary.getSprite("player_blue");
            oSprite2 = s_oSpriteLibrary.getSprite("player_blue_boosted");
            _iPosNeg = 1;
        }else{
            oSprite = s_oSpriteLibrary.getSprite("player_red");
            oSprite2 = s_oSpriteLibrary.getSprite("player_red_boosted");
            _iPosNeg = -1;
            
        }
        
        if (_iColorStick === 1 && s_b2Players&&s_bMobile){
                _iRotationSprite = 180;
            }
        
        _aFramesAnimation = new Array();
        _aFramesAnimation.push("idle_0");
        _aFramesAnimation.push("idle_1");
        _aFramesAnimation.push("idle_2");
        _aFramesAnimation.push("idle_3");
        _aFramesAnimation.push("idle_4");
        _aFramesAnimation.push("idle_5");
        
        
        _iCurrentFrame = 1;
        
       var oData = {
          images: [oSprite,oSprite2],
          frames: {width: 200, height: 70, regX: 100, regY: 35},
          animations: {idle_0: [0,0,"idle_0"], idle_1: [1,1,"idle_1"], idle_2: [2,2,"idle_2"], idle_3: [3,3,"idle_3"], idle_4: [4,4,"idle_4"], idle_5: [5,5,"idle_5"]}
       };
       
       var oSpriteSheet = new createjs.SpriteSheet(oData);
       
        for (var i=0;i<aPosEdges.length;i++){
            _aPlayerEdges.push(new CEdge(_aPosEdges[i].x1,iY,_aPosEdges[i].x2,iY,1,false));
            _aSpritesPlayer.push(new createSprite(oSpriteSheet,"idle_1",100,35,200,70));
            _aSpritesPlayer[i].x = _aPlayerEdges[i].getModel().m_pCenter().getX();
            if (_iColorStick===0){
                _aSpritesPlayer[i].y = _aPlayerEdges[i].getModel().m_pCenter().getY()+10;
            }else{
                _aSpritesPlayer[i].y = _aPlayerEdges[i].getModel().m_pCenter().getY()-10;
            }
            _aSpritesPlayer[i].rotation = _iRotationSprite;
            _oContainer.addChild(_aSpritesPlayer[i]);
        }
        
    };
    
    this.onBonus = function(){
        if (_iCurrentFrame<2||(_iCurrentFrame>2&&_iCurrentFrame<5)){
            _iCurrentFrame++;
            _aSpritesPlayer[0].gotoAndPlay(_aFramesAnimation[_iCurrentFrame]);
            _aPlayerEdges[0].changeSize(20*_iPosNeg);
        }
    };
    
    this.onMalus = function(){
       if ((_iCurrentFrame>0&&_iCurrentFrame<3)||_iCurrentFrame>3){
           _iCurrentFrame--;
           _aSpritesPlayer[0].gotoAndPlay(_aFramesAnimation[_iCurrentFrame]);
           _aPlayerEdges[0].changeSize(-20*_iPosNeg);
       }
    };
    
    this.resetSize = function(){
        if (_iCurrentFrame!==1){
            _iCurrentFrame = 1;
            _aSpritesPlayer[0].gotoAndPlay(_aFramesAnimation[_iCurrentFrame]);
            _aPlayerEdges[0].resetSize(_iPosNeg);
        }
    };
    
    this.setStrongShotPowerUP = function(bVal){
        _bStrongShot = bVal;
        _iTimeStrongShotPowerUP = 0;
        if (bVal===true){
            _iCurrentFrame+=3;
        }else if (bVal===false&&_iCurrentFrame>2){
            _iCurrentFrame-=3;
        }
        _aSpritesPlayer[0].gotoAndPlay("idle_"+(_iCurrentFrame));
    };
    
    this.getStrongShotPowerUP = function(){
       return _bStrongShot; 
    };
    
    this.getX = function(){
        return _aSpritesPlayer[0].x;
    };
    
    this.getColorStick = function(){
        return _iColorStick;
    };
    
    this.getDistanceFromStickToEdge = function(oEdge){
        return Math.sqrt(Math.pow((oEdge.x-_aSpritesPlayer[0].x),2)+Math.pow((oEdge.y-_aSpritesPlayer[0].y),2));
    };
    
    this.onKeyLeft = function(){
       if( _aSpritesPlayer[0].x === _iXLeftMax ){
           return;
       }
       
       _bUserMovement = true;
       
       _iCurAcceleration -= STICK_ACCELLERATION;

        this.__updateStickPositions();        
    };
    
    this.onKeyRight = function(){
        if( _aSpritesPlayer[0].x === _iXRightMax ){
            return;
       }    
       
       _bUserMovement = true;
       
       _iCurAcceleration += STICK_ACCELLERATION;
       
        this.__updateStickPositions();
    };
    
    this.__updateStickPositions = function(){
        
       if( Math.abs(_iCurAcceleration) > _iSpeed ){           
            if( _iCurAcceleration < 0 ){
                _iCurAcceleration = -_iSpeed;
            }else{
                _iCurAcceleration = _iSpeed;
            }           
       }
       
        var iPlacement = _iCurAcceleration;
        
        if (_aSpritesPlayer[0].x+_iCurAcceleration < _iXLeftMax){
            iPlacement = _iXLeftMax-_aSpritesPlayer[0].x;
            _iCurAcceleration = 0;
        }else if (_aSpritesPlayer[0].x+_iCurAcceleration > _iXRightMax){
            _iCurAcceleration = 0;
            iPlacement = _iXRightMax-_aSpritesPlayer[0].x;
        }
         
        
        for (var i=0;i<_aPlayerEdges.length;i++){
              _aPlayerEdges[i].moveX(iPlacement);
              _aSpritesPlayer[i].x += iPlacement;
        }        
    };
    
    this.getEdges = function(){
        return _aPlayerEdges;
    };
    
    this.update = function(){
        if (_bUserMovement===false){
            _iCurAcceleration *= STICK_FRICTION;
        }
        
        _bUserMovement = false;
        
        this.__updateStickPositions();
        
        if (_bStrongShot){
            _iTimeStrongShotPowerUP+=s_iTimeElaps;
            if (_iTimeStrongShotPowerUP>=MS_STRONG_SHOT_POWER_UP){
                this.setStrongShotPowerUP(false);
            }
        }
        
    };
    
    this.init(iX,iY,iColorStick,iXLeft,iXRight,aPosEdges,iTypeStick,iSpeed);
}