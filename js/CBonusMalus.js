function CBonusMalus (iXPos,iYPos, iType, oParentContainer){
   
   var _oParentContainer;
   var _oContainer;
   var _iX;
   var _iY;
   var _iType;
   var _oPowerUP;
   var _vPos;
   var _vCurForce;
   var _vPrevPos;
   var _oStartPos;
   var _iRadius;
   var _iHalfRadius;
   var _iRadiusQuadro;
   var _iUnloadTime;
   
    this.init = function(iXPos,iYPos, iType, oParentContainer){
        _oParentContainer = oParentContainer;
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);
        _iX = iXPos;
        _iY = iYPos;
        _iType = iType;
        _iUnloadTime = 0;
        
        var oSprite;
        var oData;
        var oSpriteSheet;
        
        switch (_iType){
            case LARGE_BONUS:
                oSprite = s_oSpriteLibrary.getSprite("large_bonus");
                oData = {
                    images: [oSprite],
                    frames: {width: 115, height: 95, regX: 115*0.5, regY: 95*0.5},
                    animations: {idle: [0,9,"idle",0.7]}
                };
                _iRadius = (oSprite.width/5)/2;
                break;
                
            case SHORT_MALUS:
                oSprite = s_oSpriteLibrary.getSprite("short_malus");
                oData = {
                    images: [oSprite],
                    frames: {width: 130, height:95, regX: 130*0.5, regY: 95*0.5},
                    animations: {idle: [0,9,"idle",0.7]}
                };
                _iRadius = (oSprite.width/5)/2;
                break;
                
            case SUPER_SHOT:
                oSprite = s_oSpriteLibrary.getSprite("super_shot");
                oData = {
                    images: [oSprite],
                    frames: {width: 95, height:95, regX: 95*0.5, regY: 95*0.5},
                    animations: {idle: [0,8,"idle",0.7]}
                };
                _iRadius = (oSprite.width/3)/2;
                break;
                
            case DOUBLE_BALLS:
                oSprite = s_oSpriteLibrary.getSprite("double_balls");
                oData = {
                    images: [oSprite],
                    frames: {width: 95, height:95, regX: 95*0.5, regY: 95*0.5},
                    animations: {idle: [0,8,"idle",0.7]}
                };
                _iRadius = (oSprite.width/3)/2;
                break;
                
            case CRAZY_BALL:
                oSprite = s_oSpriteLibrary.getSprite("crazy_ball");
                oData = {
                    images: [oSprite],
                    frames: {width: 95, height:95, regX: 95*0.5, regY: 95*0.5},
                    animations: {idle: [0,9,"idle",0.7]}
                };
                _iRadius = (oSprite.width/5)/2;
        }
        
        oSpriteSheet = new createjs.SpriteSheet(oData);
        _oPowerUP = createSprite(oSpriteSheet,"idle",oData.frames.regX,oData.frames.regY,oData.frames.width,oData.frames.height);
        _oContainer.addChild(_oPowerUP);
        
        _oContainer.x = _iX;
        _oContainer.y = _iY;
        
        _vPos = new CVector2();
        _vPos.set(_oContainer.x, _oContainer.y);
        _vPrevPos = new CVector2();
        _vPrevPos.set(0, 0);
        
        _oStartPos = {x: iXPos, y: iYPos};
        
        _iHalfRadius = _iRadius*0.5;
        _iRadiusQuadro = _iRadius * _iRadius;

        _vCurForce = new CVector2(0,0);
    };
    
    
    this.unload = function () {
        _oParentContainer.removeChild(_oContainer);
    };
    
    this.getRadius = function(){
       return _iRadius; 
    };
    
    this.setPos = function (vPos) {
        _vPos.setV(vPos);
    };
    
    this.getHalfRadius = function(){
        return _iHalfRadius;
    };

    this.getX = function () {
        return _oContainer.x;
    };

    this.getY = function () {
        return _oContainer.y;
    };
    
    this.getType = function () {
        return _iType;
    };
    
    this.vCurForce = function () {
        return _vCurForce;
    };

    this.vPos = function () {
        return _vPos;
    };
    
    this.updateSpritePosition = function () {
        _oContainer.x = _vPos.getX();
        _oContainer.y = _vPos.getY();
    };
    
    this.checkUnload = function(){
       _iUnloadTime += s_iTimeElaps;
       if (_iUnloadTime >= 7000){
           _iUnloadTime = 0;
           var oParent = this;
           new createjs.Tween.get(_oPowerUP).to({alpha: 0},500).call(function(){
                oParent.unload();
                s_oGame.onUnloadPowerUP();
           });
       }
    };
    
    this.init(iXPos,iYPos, iType, oParentContainer);
    
};