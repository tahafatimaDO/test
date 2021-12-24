function CTextButton(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize,oParentContainer,szAlign){
    var _bDisable;
    var _iWidth;
    var _iHeight;
    var _aCbCompleted;
    var _aCbOwner;
    var _oButton;
    var _oText;
    var _oButtonBg;
    var _aParams = [];
    var _oParentContainer;
    var _oListenerMouseDown;
    var _oListenerMouseUp;
    
    this._init =function(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize){
        _bDisable = false;
        _aCbCompleted=new Array();
        _aCbOwner =new Array();

        _oButtonBg = createBitmap( oSprite);
	_iWidth = oSprite.width;
        _iHeight = oSprite.height;

        _oButton = new createjs.Container();
        _oButton.x = iXPos;
        _oButton.y = iYPos;
        _oButton.regX = oSprite.width/2;
        _oButton.regY = oSprite.height/2;
        _oButton.cursor = "pointer";
        _oButton.addChild(_oButtonBg);
        
        var iWidth = oSprite.width - 10;
        var iHeight = oSprite.height - 10;
        var iX = oSprite.width/2;
        var iY = 0;
      
        _oText = new CTLText(_oButton, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    iFontSize, "center", szColor, szFont, 1,
                    2, 2,
                    szText,
                    true, true, false,
                    false );
                  
        var oBounds = _oText.getBounds();    
        
        if (szAlign&&szAlign==="bottom"){
            _oText.setY((((oSprite.height) - oBounds.height)/2-5)*3+50);
        }else{
            _oText.setY((((oSprite.height) - oBounds.height)/2-5)-40);
        }            
		
        _oParentContainer.addChild(_oButton);

        this._initListener();
    };
    
    this.unload = function(){
       _oButton.off("mousedown", _oListenerMouseDown);
       _oButton.off("pressup", _oListenerMouseUp);
       
       _oParentContainer.removeChild(_oButton);
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this.enable = function(){
        _bDisable = false;
		
	_oButtonBg.filters = [];
        _oButtonBg.cache(0,0,_iWidth,_iHeight);
    };
    
    this.disable = function(){
        _bDisable = true;
		
	var matrix = new createjs.ColorMatrix().adjustSaturation(-100).adjustBrightness(40);
        _oButtonBg.filters = [
                 new createjs.ColorMatrixFilter(matrix)
        ];
        _oButtonBg.cache(0,0,_iWidth,_iHeight);
    };
    
    this._initListener = function(){
       oParent = this;

       _oListenerMouseDown = _oButton.on("mousedown", this.buttonDown);
       _oListenerMouseUp = _oButton.on("pressup" , this.buttonRelease);      
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.addEventListenerWithParams = function (iEvent, cbCompleted, cbOwner, aParams) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _aParams = aParams;
    };
    
    
    this.buttonRelease = function(){
        if(_bDisable){
            return;
        }
        
        playSound("press_button",1,false);
        
        _oButton.scaleX = 1;
        _oButton.scaleY = 1;

        if (_aCbCompleted[ON_MOUSE_UP]) {
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP], _aParams);
        }
    };
    
    this.buttonDown = function(){
        if(_bDisable){
            return;
        }
        _oButton.scaleX = 0.9;
        _oButton.scaleY = 0.9;

       if (_aCbCompleted[ON_MOUSE_DOWN]) {
            _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN], _aParams);
        }
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oButton.x = iXPos;
         _oButton.y = iYPos;
    };
    
    this.changeText = function(szText){
        _oText.refreshText(szText);
    };
    
    this.setX = function(iXPos){
         _oButton.x = iXPos;
    };
    
    this.setY = function(iYPos){
         _oButton.y = iYPos;
    };
    
    this.getButtonImage = function(){
        return _oButton;
    };

    this.getX = function(){
        return _oButton.x;
    };
    
    this.getY = function(){
        return _oButton.y;
    };
    
    this.setTextY = function(iY){
        _oText.setY(iY);
    };
    
    _oParentContainer = oParentContainer;
    this._init(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize);
    
    return this;
    
}