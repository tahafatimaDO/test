function CGame(oData){
    var _bStartGame;
    var _bUpdateBalls;
    var _iScore;
    var _oInterface;
    var _oEndPanel = null;
    var _oParent;
    var _aBall;
    var _aFieldEdgesBall;
    var _vSafePos;
    var _aPlayersStick;
    var _bUP1;
    var _bDOWN1;
    var _bUP2;
    var _bDOWN2;
    var _iPlayer1Points;
    var _iPlayer2Points;
    var _bPaused;
    var _bGoalCheck;
    var _bInputUpdate;
    var _oButStartGame;
    var _bScalarProduct;
    var _oSound;
    var _bSoundComplete;
    var _bBallSpin;
    var _bAdvancedMode;
    var _iXGlobalMouse;
    var _oPowerUP;
    var _aEdgesPowerUP;
    var _iCounterPowerUP;
    var _iCounterRotate;
    var _bRotateCW;
    var _bCrazyBall;
    var _iTimeCrazyBall;
    var _iNearestBall;
    var _aObjDifficulty;
    var _iProgressiveBallVelocity;
    var _aOccurrencesPowerUP;
    var _iPrevPowerSuperShot;
    var _oGoalText;
    var _aPowerUpTexts;
    var _oContainerPowerUP;

    this._init = function(){
        
        setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME);
        _bStartGame=true;
        _bUpdateBalls = true;
        _bGoalCheck = true;
        _bInputUpdate = false;
        _bScalarProduct = true;
        _iScore=0;          
        _iPlayer1Points=0;
        _iPlayer2Points=0;
        _iCounterPowerUP = 0;
        _iPrevPowerSuperShot = 1;
        _vSafePos = new CVector2();
        _aPlayersStick = new Array();
        _bPaused = true;
        _bBallSpin = true;
        _bAdvancedMode = ADVANCED_MODE;
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(oBg); //Draws on canvas
        _oContainerPowerUP = new createjs.Container();
        s_oStage.addChild(_oContainerPowerUP);
        _bUP1 = false;
        _bDOWN1 = false;
        if (s_b2Players){
            _bUP2 = false;
            _bDOWN2 = false;
        }
        _bSoundComplete = true;
        _oInterface = new CInterface();
        _oInterface.refreshScore(_iScore);           
        _aFieldEdgesBall = new Array();
        _iCounterRotate = 0;
        _bRotateCW = true;
        _bCrazyBall = false;
        _iTimeCrazyBall = 0;
        _aObjDifficulty = new Array(); 
        
       _aFieldEdgesBall[VERTICAL_LINE_LEFT]=new CEdge(EDGEBOARD_X+2,CANVAS_HEIGHT-30,EDGEBOARD_X+2,30,5,false).getModel(); //Horizontal Line Up;
       _aFieldEdgesBall[VERTICAL_LINE_RIGHT]= new CEdge(CANVAS_WIDTH-(EDGEBOARD_X+2),30,CANVAS_WIDTH-(EDGEBOARD_X+2),CANVAS_HEIGHT-30,5,false).getModel(); //Horizontal Line Down;
       
       if (_bAdvancedMode){
            _aEdgesPowerUP = new Array();
            _aEdgesPowerUP.push(new CEdge(EDGEBOARD_X+2,30,CANVAS_WIDTH-(EDGEBOARD_X+2),30,5,false).getModel());
            _aEdgesPowerUP.push(new CEdge(CANVAS_WIDTH-(EDGEBOARD_X+2),CANVAS_HEIGHT-30,EDGEBOARD_X+2,CANVAS_HEIGHT-30,5,false).getModel());
            _aEdgesPowerUP.push(_aFieldEdgesBall[VERTICAL_LINE_LEFT]);
            _aEdgesPowerUP.push(_aFieldEdgesBall[VERTICAL_LINE_RIGHT]);
            _aOccurrencesPowerUP = new Array();
            for (var i=0;i<OCCURRENCES_LARGE_BONUS;i++){
                _aOccurrencesPowerUP.push(LARGE_BONUS);
            }
            for (var i=0;i<OCCURRENCES_SHORT_MALUS;i++){
                _aOccurrencesPowerUP.push(SHORT_MALUS);
            }
            for (var i=0;i<OCCURRENCES_SUPER_SHOTS;i++){
                _aOccurrencesPowerUP.push(SUPER_SHOT);
            }
            for (var i=0;i<OCCURRENCES_DOUBLE_BALLS;i++){
                _aOccurrencesPowerUP.push(DOUBLE_BALLS);
            }
            for (var i=0;i<OCCURRENCES_CRAZY_BALL;i++){
                _aOccurrencesPowerUP.push(CRAZY_BALL);
            }
            
            _aPowerUpTexts = new Array();
            _aPowerUpTexts[LARGE_BONUS] = this.assembleSpriteSheetText("enlarge_text_");
            _aPowerUpTexts[SHORT_MALUS] = this.assembleSpriteSheetText("become_short_text_");
            _aPowerUpTexts[SUPER_SHOT] = this.assembleSpriteSheetText("super_shot_text_");
            _aPowerUpTexts[DOUBLE_BALLS] = this.assembleSpriteSheetText("double_ball_text_");
            _aPowerUpTexts[CRAZY_BALL] = this.assembleSpriteSheetText("crazy_ball_text_");
            
            for (var i=0;i<_aPowerUpTexts.length;i++){
                s_oStage.addChild(_aPowerUpTexts[i]);
            }
            
        }
        
        _oGoalText = this.assembleSpriteSheetText("goal_text_");
        s_oStage.addChild(_oGoalText);
        
        _aBall = new Array();
        _iNearestBall = 0;
        _iProgressiveBallVelocity = START_PROGRESSIVE_BALL_VELOCITY;
        
        _aPlayersStick[PLAYER_1]=new CStick(CANVAS_WIDTH/2,CANVAS_HEIGHT-130,BLUE_STICK, EDGEBOARD_X+2+100,CANVAS_WIDTH-(EDGEBOARD_X+2+100),[{x1: CANVAS_WIDTH/2+70, x2:CANVAS_WIDTH/2-70}],GOALKEEPER,PLAYER_SPEED_STICKS);
        _aPlayersStick[PLAYER_2] = new CStick(CANVAS_WIDTH/2,130,RED_STICK, EDGEBOARD_X+2+100,CANVAS_WIDTH-(EDGEBOARD_X+2+100),[{x2:CANVAS_WIDTH/2+70,x1:CANVAS_WIDTH/2-70}],GOALKEEPER,CPU_SPEED_STICKS);
        
        _oInterface.setOnTop();
        
        if (!s_bMobile){
            if (!s_b2Players){
                s_oStage.on("stagemousemove",this.onMouseOver);
            }
            document.onkeydown = this.keyDownKeyBoard;
            document.onkeyup = this.keyUpKeyBoard;
        }else{
            _oInterface.initMobileButtons();
        }
        
        _oInterface.setOnTop();
        
        if (s_b2Players===true&&!s_bMobile){
            if (s_bFirstMultiPlayer===true){
                s_bFirstMultiPlayer = false;
                s_bFirstPlay = false;
                new CPanelTutorial(true);
            }
        }
        
        if (s_bFirstPlay===true){
            s_bFirstPlay = false;
            new CPanelTutorial(true);
        }
    };
    
    this.assembleSpriteSheetText = function(szSprites){ //sz Sprites Without Final Number
        var oFinalSprite;
        var aSprites = new Array();
        for (var i=0;i<15;i++){
            aSprites.push(s_oSpriteLibrary.getSprite(szSprites+i));
        }
        
        var oData = {
           images:  aSprites,
           frames: {width: 1120, height:300, regX: 1120*0.5,regY: 300*0.5},
           animations: {idle: [0,14,"idle",0.8]}
        };
        
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        oFinalSprite = createSprite(oSpriteSheet,"idle",oData.frames.regX,oData.frames.regY,oData.frames.width,oData.frames.height);
        oFinalSprite.stop();
        oFinalSprite.x = CANVAS_WIDTH/2;
        oFinalSprite.y = Y_OFFBOARD_MESSAGES_UP;
        
        return oFinalSprite;
    };
    
    this.onMouseOver = function(evt){
        _iXGlobalMouse = parseInt(evt.localX);
    };
    
    this.onTouchDownMobileP1 = function(evt){
        if (evt.localX>CANVAS_WIDTH/2){
                _bUP1 = false;
                _bDOWN1 = true;
        }else{
                _bDOWN1 = false;
                _bUP1 = true;
        }
    };
    
    this.onTouchDownMobileP2 = function(evt){
        if (evt.localX>CANVAS_WIDTH/2){
                _bUP2 = false;
                _bDOWN2 = true;
        }else{
                _bDOWN2 = false;
                _bUP2 = true;
        }
    };
    
    this.onTouchUpMobileP1 = function(evt){
        _bUP1 = false;
        _bDOWN1 = false;
    };
    
    this.onTouchUpMobileP2 = function(evt){
        _bUP2 = false;
        _bDOWN2 = false;
    };
    
    
    this.keyUpKeyBoard = function(evt){
            if(!evt){ 
                evt = window.event; 
            } 
            evt.preventDefault(); 
           switch (evt.keyCode){
               case 65: _bUP1 = false; break;
               case 68: _bDOWN1 = false; break;
               case 37: _bUP2 = false; break;
               case 39:  _bDOWN2 = false; break;
           }
        };
        
        this.keyDownKeyBoard = function(evt){
            if(!evt){ 
                evt = window.event; 
             } 
            evt.preventDefault(); 
           switch (evt.keyCode){
               case 65: _bUP1 = true; _iXGlobalMouse = null; break;
               case 68: _bDOWN1 = true; _iXGlobalMouse = null; break;
               case 37: _bUP2 = true; break;
               case 39:  _bDOWN2 = true; break;
               case 32: 
                   if (event.keyCode===32){
                    if (_bBallSpin&&!_bInputUpdate&&_bStartGame){
                        _oParent.onMouseDown();
                    }
                }
                break;
           }
           evt.preventDefault();  
        };
    
    this.AICpu = function (oBall, oSticks) {
            if (fixEnemyTremble(oBall, oSticks.getEdges()[0].getModel()) === false) {
                if (oBall.getX() > oSticks.getEdges()[0].getModel().m_pCenter().getX()) {
                        oSticks.onKeyRight();
                } else {
                        oSticks.onKeyLeft();
                }
            }
       


    };
    
    this.setStartGame = function(bVal){
       _bStartGame = bVal; 
    };
    
    this.sortObjectsByY = function(aObjects){
        aObjects.sort(function(a,b){
            return parseFloat(a.getY())-parseFloat(b.getY());
        });
    };
    
        this.fixMouseTremmle = function(){
           if (_aPlayersStick[PLAYER_1].getX()-15<_iXGlobalMouse&&_aPlayersStick[PLAYER_1].getX()+15>_iXGlobalMouse){
               return false;
           }
           return true;
        };
        
        this.setBooleanUp1 = function(bVal){
            _bUP1 = bVal;
        };
        
        this.setBooleanDown1 = function(bVal){
            _bDOWN1 = bVal;
        };
        
        this.setBooleanUp2 = function(bVal){
            _bUP2 = bVal;
        };
        
        this.setBooleanDown2 = function(bVal){
            _bDOWN2 = bVal;
        };
        
        this.onMouseDown = function(){
            _oInterface.setVisibleButKickOff(false);
            _bBallSpin = false;
            
            playSound("power_up_bonus",1,false);
            _iProgressiveBallVelocity = START_PROGRESSIVE_BALL_VELOCITY;
            _aBall.push(new CBall(CANVAS_WIDTH/2,CANVAS_HEIGHT/2,s_oSpriteLibrary.getSprite("ball"),"ball_0",s_oStage));
            _aBall[0].setVisible(false);
            
            var vLaunch = new CVector2( randomFloatBetween(0.05,0.1)*randomSign(), randomFloatBetween(0.05,0.1)*randomSign());            
            vLaunch.normalize();
            vLaunch.scalarProduct(BALL_START_VELOCITY);
            _aBall[0].vCurForce().setV(vLaunch);


            _aBall[0].setVisible(true);
            _bPaused = false;
            _bInputUpdate = true;
        };
        
        this.collideCircleWithEdges = function(oBall,aEdge){
            for (var i=0;i<aEdge.length;i++){
                var oInfo = collideEdgeWithCircle(aEdge[i],oBall.vPos(),oBall.getRadius() );
                if ( oInfo ){
                    playSound("ball_wall",1,false);
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
        _bStartGame = false;
        
        _oInterface.unload();
        if(_oEndPanel !== null){
            _oEndPanel.unload();
        }
        
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();

           
    };
 
    this.onExit = function(){
        $(s_oMain).trigger("end_session");
        
        s_oGame.unload();
        s_oMain.gotoMenu();
        setVolume("soundtrack",0.4);
    };
    
    this._onExitHelp = function () {
         _bStartGame = true;
    };
    
    this.gameOver = function(iWinner){         
        _oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('msg_box'),iWinner);
        if (iWinner===0){
            _iScore = 100*_iPlayer1Points;
            _iScore-=50*_iPlayer2Points;
        }
        _oEndPanel.show(_iScore,iWinner);
    };
    
    this.collideBallWithPlayer = function(oBall,aStickPlayers){
        for (var i=0;i<aStickPlayers.length;i++){
            // sticks
            var aPlayers = aStickPlayers[i].getEdges();
            for (var j=0;j<aPlayers.length;j++){
                    // player
                    var oEdgePlayer = aPlayers[j].getModel();
                    var oInfo = collideEdgeWithCircle(oEdgePlayer,oBall.vPos(),oBall.getRadius() );
                    if ( oInfo ){
                        oBall.setUserData({color: aStickPlayers[i].getColorStick()});
                        var vPlayerNormal = new CVector2();
                        vPlayerNormal.setV(oEdgePlayer.getNormal());

                        var iDistFromCenter = distance( oInfo.closest_point, oEdgePlayer.m_pCenter() );
                        var iQuantityRot = QUANTITY_ROOT;
                        var iHalfWidth = (oEdgePlayer.getLength()*0.5);
                        var iMaxAngleRot   = MAX_ANGLE_ROOT_COLLISION_BALL_EDGE;
                        var vDirBall = new CVector2();
                        
                        iQuantityRot = (iDistFromCenter/iHalfWidth);

                        var iCurAngleRot = iMaxAngleRot*iQuantityRot; 
                            iCurAngleRot = degreesToRadians(iCurAngleRot);
                        if ( oInfo.closest_point.getX() > oEdgePlayer.m_pCenter().getX() ){
                            if (aStickPlayers[i].getColorStick()===BLUE_STICK){
                                vPlayerNormal.rotate(-iCurAngleRot);
                            }else{
                                vPlayerNormal.rotate(+iCurAngleRot);
                            }
                        }else{
                            if (aStickPlayers[i].getColorStick()===BLUE_STICK){
                                vPlayerNormal.rotate(+iCurAngleRot);
                            }else{
                                vPlayerNormal.rotate(-iCurAngleRot);
                            }
                        }
                        
                        vDirBall.setV(vPlayerNormal);
                        vDirBall.normalize();
                        if (aStickPlayers[i].getStrongShotPowerUP()){
                            _iPrevPowerSuperShot = _iProgressiveBallVelocity;
                            _iProgressiveBallVelocity = SUPER_SHOT_POWER;
                        }
                        vDirBall.scalarProduct(_iProgressiveBallVelocity);
                        
                        if (_iProgressiveBallVelocity<LIMIT_SPEED){
                            _iProgressiveBallVelocity+=PROGRESSIVE_STEP_BALL_VELOCITY;
                        }
                        oBall.vCurForce().setV(vDirBall);

                        if (aStickPlayers[i].getStrongShotPowerUP()){
                            _iProgressiveBallVelocity = _iPrevPowerSuperShot;
                        }

                            _oSound = playSound("ball_kick",1,false);
                       
                    
                        }
                }
            }
    };
    
    this.goalCheck = function(){
        for (var i=_aBall.length-1;i>=0;i--){

            if (_aBall[i]&&_aBall[i].checkGoalTop()){
                _aBall[i].unload();
                _aBall.splice(i,1);
                playSound("goal_player",1,false);
                _iPlayer1Points++;
                _oInterface.goalP1(_iPlayer1Points);
                this.showSpecialText(PLAYER_1,_oGoalText);
                if (_iPlayer1Points===POINTS_TO_WIN){
                    this.gameOver(0);
                }else{
                    if (_aBall.length===0){
                        _bGoalCheck = false;
                        _bInputUpdate = false;
                        setTimeout(_oParent.afterGoal,MS_AFTER_GOAL);
                    }
                }
            }

            if (_aBall[i]&&_aBall[i].checkGoalBottom()){
                _aBall[i].unload();
                _aBall.splice(i,1);
                if (s_b2Players){
                    playSound("goal_player",1,false);
                }else{
                    playSound("goal_pc",1,false);
                }
                _iPlayer2Points++;
                _oInterface.goalP2(_iPlayer2Points);
                this.showSpecialText(PLAYER_2,_oGoalText);
                if (_iPlayer2Points===POINTS_TO_WIN){
                    this.gameOver(1);
                }else{
                    if (_aBall.length===0){
                        _bGoalCheck = false;
                        _bInputUpdate = false;
                        setTimeout(_oParent.afterGoal,MS_AFTER_GOAL);
                    }
                }
            }
    }
    };
    
    this.showSpecialText = function(iPlayer,oPowerUP){
        oPowerUP.stop();
        oPowerUP.rotation = 0;
        var iDestinationY;
        if (iPlayer===PLAYER_1){
            oPowerUP.y = Y_OFFBOARD_MESSAGES_DOWN;
            iDestinationY = Y_MESSAGES_ON_BOARD_DOWN;
        }else if (iPlayer===PLAYER_2){
            oPowerUP.y = Y_OFFBOARD_MESSAGES_UP;
            iDestinationY = Y_MESSAGES_ON_BOARD_UP;
            if (s_b2Players&&s_bMobile){
                oPowerUP.rotation = 180;
            }
        }else if( iPlayer===2){
            oPowerUP.y = Y_OFFBOARD_MESSAGES_UP;
            iDestinationY = CANVAS_HEIGHT/2;
        }
        setTimeout(function(){playSound("explosion",1,false)},1100);
        
       new createjs.Tween.get(oPowerUP).to({y: iDestinationY},1000, createjs.Ease.cubicOut).call(function(){
           oPowerUP.gotoAndPlay("idle");
          oPowerUP.on("animationend",function(){
              oPowerUP.y = Y_OFFBOARD_MESSAGES_UP;
               oPowerUP.gotoAndStop("idle");
          });
       });
    };
    

    this.afterGoal = function(){
         _oInterface.setVisibleButKickOff(true);
        _bPaused = true;
        _bCrazyBall = false;
       // _iCounterPowerUP = 0;
        _iCounterRotate = 0;
        _iTimeCrazyBall = 0;
        _aPlayersStick[PLAYER_1].setStrongShotPowerUP(false);
        _aPlayersStick[PLAYER_2].setStrongShotPowerUP(false);
        _aPlayersStick[PLAYER_1].resetSize();
        _aPlayersStick[PLAYER_2].resetSize();
       _bBallSpin = true;
       _bGoalCheck = true;
       _bInputUpdate = false;
       if (_oPowerUP){
           _oPowerUP.unload();
           _oPowerUP = null;
       }
    };
    
    this.update = function(){
        var iStep;
        if (_bAdvancedMode){
            if (_bRotateCW && _iCounterRotate>=-ANGLE_CRAZY_BALL){   //CRAZYBALL
                _iCounterRotate ++;
                iStep = STEP_UPDATE_CRAZY_BALL;
                if (_iCounterRotate === ANGLE_CRAZY_BALL){
                    _bRotateCW = false;
                }
            }else if (!_bRotateCW && _iCounterRotate<=ANGLE_CRAZY_BALL){
                _iCounterRotate --;
                iStep = -STEP_UPDATE_CRAZY_BALL;
                if (_iCounterRotate === -ANGLE_CRAZY_BALL){
                    _bRotateCW = true;
                }
            }
        }
        
        if (!_bPaused){
            if (_bUpdateBalls){
                if (_bCrazyBall){
                    for (var i=0;i<_aBall.length;i++){
                        _aBall[i].vCurForce().rotate(degreesToRadians(iStep));
                    }
                }
                
               for (var i=0;i<PHYSICS_ITERATIONS;i++){ 
                   for (var k=0;k<_aBall.length;k++){
                        _aBall[k].vPos().addV(_aBall[k].vCurForce());
                         _aBall[k].updateTrajectory();
                        this.collideBallWithPlayer(_aBall[k],_aPlayersStick);
                        this.collideCircleWithEdges(_aBall[k],_aFieldEdgesBall);
                        if (_bAdvancedMode&&_oPowerUP){
                            _oPowerUP.vPos().addV(_oPowerUP.vCurForce());
                            this.collideCircleWithEdges(_oPowerUP,_aEdgesPowerUP);
                            this.collideBallWithBall(_aBall[k],_oPowerUP);
                        }
                        
                    }
              }
                    for (var i=0;i<_aBall.length;i++){
                          _aBall[i].updateSpritePosition();
                    }
                if (_bAdvancedMode){
                    _iCounterPowerUP+= s_iTimeElaps;

                    if (_iCounterPowerUP>=randomFloatBetween(MIN_MS_SPAWN_POWER_UP,MAX_MS_SPAWN_POWER_UP)){
                         _iCounterPowerUP = 0;
                         var iPowerUP = _aOccurrencesPowerUP[parseInt(randomFloatBetween(1,_aOccurrencesPowerUP.length-1))];

                         _oPowerUP = new CBonusMalus(parseInt(randomFloatBetween(CANVAS_WIDTH/2-200,CANVAS_WIDTH/2+200)),
                          parseInt(randomFloatBetween(300,CANVAS_HEIGHT-300)),iPowerUP,_oContainerPowerUP);

                           if (iPowerUP === DOUBLE_BALLS){
                             var vLaunch = new CVector2(5*randomSign(),0);
                             _oPowerUP.vPos().set(CANVAS_WIDTH/2,CANVAS_HEIGHT/2);
                             vLaunch.normalize();
                             vLaunch.scalarProduct(BALL_START_VELOCITY);
                             _oPowerUP.vCurForce().setV(vLaunch);
                           }

                           if (iPowerUP === SHORT_MALUS||iPowerUP === CRAZY_BALL){
                                  var vLaunch = new CVector2( randomFloatBetween(1.5,2), -1*randomSign());            
                                  vLaunch.normalize();
                                  vLaunch.scalarProduct(BALL_START_VELOCITY);
                                   _oPowerUP.vCurForce().setV(vLaunch);
                              }
                    }

                     if (_oPowerUP){
                         _oPowerUP.updateSpritePosition();
                        _oPowerUP.checkUnload();
                      }
              
              if (_bCrazyBall===true){
                  _iTimeCrazyBall += s_iTimeElaps;
                  if (_iTimeCrazyBall >= MS_CRAZY_BALL){
                      _iTimeCrazyBall = 0;
                      _bCrazyBall = false;
                  }
              };
              
          }
          
          for (var i=0;i<_aPlayersStick.length;i++){
                _aPlayersStick[i].update();
            }
              
              
            };
              
            
            if (_bInputUpdate){
                if (_iXGlobalMouse){
                    if (this.fixMouseTremmle()){
                        if (_iXGlobalMouse>_aPlayersStick[PLAYER_1].getX()){
                            _aPlayersStick[PLAYER_1].onKeyRight();
                        }

                        if (_iXGlobalMouse<_aPlayersStick[PLAYER_1].getX()){
                            _aPlayersStick[PLAYER_1].onKeyLeft();
                        }
                    }
                }else{
                    if (_bUP1){
                        _aPlayersStick[PLAYER_1].onKeyLeft();
                    }
                    if (_bDOWN1){
                        _aPlayersStick[PLAYER_1].onKeyRight();
                        
                    }
                }
                if (s_b2Players){
                    if (_bDOWN2){
                            _aPlayersStick[PLAYER_2].onKeyRight();
                    }
                    if (_bUP2){
                            _aPlayersStick[PLAYER_2].onKeyLeft();
                    }
                }
                if (!s_b2Players){
                    for (var i=0;i<_aBall.length;i++){
                        if (!_aBall[_iNearestBall]){
                            _iNearestBall = i;
                        }else{
                            if (_aBall[i].getY()<_aBall[_iNearestBall].getY()){
                                _iNearestBall = i;
                            }
                        }
                    }
                    this.AICpu(_aBall[_iNearestBall],_aPlayersStick[PLAYER_2]);
                }
            }
            
            if (_bGoalCheck){
                    this.goalCheck();
              }
            
        }
        
    };
    
    this.onUnloadPowerUP = function(){
       _oPowerUP = null;
    };
    
    this.collideBallWithBall = function(oBall1,oBall2){
        var oBall1Pos = {x: oBall1.getX(), y: oBall1.getY()};
        var oBall2Pos = {x: oBall2.getX(), y: oBall2.getY()};
        var iBall1Radius = oBall1.getRadius();
        var iBall2Radius = oBall2.getRadius();

        var iMaxDistance = (iBall1Radius + iBall2Radius) * (iBall1Radius + iBall2Radius);
        var distance = distanceBetween2PointsV2(oBall1Pos.x, oBall1Pos.y, oBall2Pos.x, oBall2Pos.y);
        
        if (distance < iMaxDistance){
            
            
            
            switch (oBall2.getType()){
                
                case LARGE_BONUS:
                     playSound("power_up_bonus",1,false);
                    if (oBall1.getUserData()){
                            _aPlayersStick[oBall1.getUserData().color].onBonus();
                    }
                    break;
                    
                case SHORT_MALUS:
                     playSound("power_up_malus",1,false);
                    if (oBall1.getUserData()){
                        _aPlayersStick[oBall1.getUserData().color].onMalus();
                    }
                    break;
                
                 case SUPER_SHOT:
                      playSound("power_up_bonus",1,false);
                     if (oBall1.getUserData()){
                        _aPlayersStick[oBall1.getUserData().color].setStrongShotPowerUP(true);
                    }
                    break;
                    
                case DOUBLE_BALLS:
                     playSound("power_up_bonus",1,false);
                    var oNewBall = new CBall(oBall1.getX(),oBall1.getY(),s_oSpriteLibrary.getSprite("ball"),"ball_"+_aBall.length,s_oStage);
                        oNewBall.vCurForce().setV(oBall1.vCurForce());
                        oNewBall.vCurForce().invert();
                    _aBall.push(oNewBall);
                    break;
                    
                case CRAZY_BALL:
                     playSound("power_up_malus",1,false);
                   _bRotateCW = true;
                   _iCounterRotate = 0;
                  _bCrazyBall = true;
                  break;
                }
                
            _oPowerUP.unload();
            _oPowerUP = null;
            if (!oBall1.getUserData()){
                _oParent.showSpecialText(2,_aPowerUpTexts[oBall2.getType()]);
            }else{
                _oParent.showSpecialText(oBall1.getUserData().color,_aPowerUpTexts[oBall2.getType()]);
            }
        }
    };
    
    this.setPause = function(bVal){
        _bPaused = bVal;
    };

    this.setInput = function(bVal){
        _bInputUpdate = bVal;
    };
    
    
    this.onEndCrazyBall = function(){
       _bCrazyBall = false; 
    };

    s_oGame=this;
    
    POINTS_TO_LOSE = oData.points_to_lose;
    START_SCORE = oData.starting_points;
    
    AD_SHOW_COUNTER = oData.ad_show_counter;
    
    _oParent=this;
    this._init();
}

var s_oGame;
