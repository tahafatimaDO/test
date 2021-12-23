function CPause (oParentContainer){
    var _oShape;
    var _oText;
    var _oContainer;
    var _oParent = this;
    var _oParentContainer;
    var _oMsgBox;
    
    this.init = function(oParentContainer){
        s_oGame.setPause(true);
        _oContainer = new createjs.Container();
        _oParentContainer = oParentContainer;
        _oParentContainer.addChild(_oContainer);
        _oShape = new createjs.Shape();
        _oShape.graphics.beginFill("#000000").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oShape.alpha = 0.6;
        _oShape.on("mousedown",function(){
        });
        var oSprite = s_oSpriteLibrary.getSprite("msg_box");
        _oMsgBox = new createBitmap(oSprite,oSprite.width,oSprite.height);
        _oMsgBox.x = CANVAS_WIDTH/2;
        _oMsgBox.y = CANVAS_HEIGHT/2;
        _oMsgBox.regX = oSprite.width/2;
        _oMsgBox.regY = oSprite.height/2;
        _oMsgBox.scaleX = 0.8;
        _oMsgBox.scaleY = 0.8;
        _oContainer.addChild(_oMsgBox);
        _oText = new createjs.Text(TEXT_PAUSE,"100px "+PRIMARY_FONT,"#4ce700");
        _oText.textBaseline = "middle";
        _oText.textAlign = "center";
        _oText.x = CANVAS_WIDTH/2;
        _oText.y = CANVAS_HEIGHT/2;
        _oContainer.addChild(_oShape,_oMsgBox,_oText);
        _oText.alpha = 1;
    };
    
    this.onExit = function(){
            _oContainer.removeAllChildren();
            s_oStage.removeChild(_oContainer);
            s_oGame.setPause(false);
            
    };
    
    this.init(oParentContainer);
}

