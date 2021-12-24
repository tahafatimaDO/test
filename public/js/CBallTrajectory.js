function CBallTrajectory(oParentContainer) {

    var _iBuffer = MS_SPAWN_TIME_BALL_TRAJECTORY;
    var _oParentContainer = oParentContainer;
    var _oContainer;

    var _aTraj;

    this._init = function () {
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);
        _aTraj = new Array();
        for (var i = 0; i < BALL_TRAJ_INSTANCE; i++) {
            _aTraj.push(this.createBallTrajectory({x: 0, y: 0}));
        }
    };

    this.createBallTrajectory = function (oPos) {
        var oSpriteTraj = s_oSpriteLibrary.getSprite("ball_trajectory");
        var oSprite = createBitmap(oSpriteTraj);
        oSprite.x = oPos.x;
        oSprite.y = oPos.y;
        oSprite.regX = oSpriteTraj.width * 0.5;
        oSprite.regY = oSpriteTraj.height * 0.5;
        oSprite.visible = false;

        _oContainer.addChild(oSprite);

        return oSprite;
    };

    this.chooseATraj = function (oPos) {
        for (var i = 0; i < _aTraj.length; i++) {
            if (!_aTraj[i].visible) {
                this.setTrajectory(i, oPos);
                return;
            }
        }
        this.setTrajectory(0, oPos);
    };

    this.setTrajectory = function (iID, oPos) {
        var iScale = 0.5+0.5*Math.random();
        _aTraj[iID].x = oPos.getX();
        _aTraj[iID].y = oPos.getY();
        _aTraj[iID].visible = true;
        _aTraj[iID].alpha = 1;
        _aTraj[iID].scaleX = iScale;
        _aTraj[iID].scaleY = iScale;
        createjs.Tween.get(_aTraj[iID], {override: true}).to({alpha: 0}, MS_TIME_FADE_BALL_TRAJ).set({visible: false});
        
        var iTest = Math.random();
      /*  if (iTest<0.3){
            createjs.Tween.get(_aTraj[iID], {override: false}).to({scaleX:iScale, scaleY:iScale}, MS_TIME_FADE_BALL_TRAJ, createjs.Ease.elasticInOut);
        }else if(iTest<0.6){
            createjs.Tween.get(_aTraj[iID], {override: false}).to({scaleX:iScale, scaleY:iScale}, MS_TIME_FADE_BALL_TRAJ, createjs.Ease.backInOut);
        }else{*/
            createjs.Tween.get(_aTraj[iID], {override: false}).to({scaleX:0.3, scaleY:0.3}, MS_TIME_FADE_BALL_TRAJ);
        //}
        
        
    };

    this.unload = function () {
        _oParentContainer.removeChild(_oContainer);
        return null;
    };

    this.update = function (oPos) {
        if (_iBuffer < 0) {
            this.chooseATraj(oPos);
            _iBuffer = MS_SPAWN_TIME_BALL_TRAJECTORY;
        } else {
            _iBuffer -= s_iTimeElaps;
        }
    };


    this._init();
    return this;
}

