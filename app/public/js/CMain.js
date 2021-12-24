function CMain(oData){
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    
    var _oPreloader;
    var _oMenu = null;
    var _oHelp;
    var _oGame;

    this.initContainer = function(){
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
	s_oStage.preventSelection = false;
        createjs.Touch.enable(s_oStage);
		
	s_bMobile = isMobile();
        if(s_bMobile === false){
            s_oStage.enableMouseOver(FPS);  
            $('body').on('contextmenu', '#canvas', function(e){ return false; });
        }
		
        s_iPrevTime = new Date().getTime();

	createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.framerate = FPS;
        
        if(navigator.userAgent.match(/Windows Phone/i)){
                DISABLE_SOUND_MOBILE = true;
        }
        
        s_oSpriteLibrary  = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();
		
	
    };
    
    this.preloaderReady = function(){
        
         s_oMain._loadImages();
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            s_oMain._initSounds();
        }
        _bUpdate = true;
    };
    
    
    this.soundLoaded = function(){
       _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);
    };
    
    this._initSounds = function(){
        Howler.mute(!s_bAudioActive);

        s_aSoundsInfo = new Array();
        s_aSoundsInfo.push({path: './sounds/',filename:'soundtrack',loop:true,volume:1, ingamename: 'soundtrack'});
        s_aSoundsInfo.push({path: './sounds/',filename:'press_button',loop:true,volume:1, ingamename: 'press_button'});
        s_aSoundsInfo.push({path: './sounds/',filename:'power_up_bonus',loop:true,volume:1, ingamename: 'power_up_bonus'});
        s_aSoundsInfo.push({path: './sounds/',filename:'power_up_malus',loop:true,volume:1, ingamename: 'power_up_malus'});
        s_aSoundsInfo.push({path: './sounds/',filename:'ball_wall',loop:true,volume:1, ingamename: 'ball_wall'});
        s_aSoundsInfo.push({path: './sounds/',filename:'ball_kick',loop:true,volume:1, ingamename: 'ball_kick'});
        s_aSoundsInfo.push({path: './sounds/',filename:'goal_player',loop:true,volume:1, ingamename: 'goal_player'});
        s_aSoundsInfo.push({path: './sounds/',filename:'goal_pc',loop:true,volume:1, ingamename: 'goal_pc'});
        s_aSoundsInfo.push({path: './sounds/',filename:'game_over',loop:true,volume:1, ingamename: 'game_over'});
        s_aSoundsInfo.push({path: './sounds/',filename:'win_panel',loop:true,volume:1, ingamename: 'win_panel'});
        s_aSoundsInfo.push({path: './sounds/',filename:'explosion',loop:true,volume:1, ingamename: 'explosion'});
        
        RESOURCE_TO_LOAD += s_aSoundsInfo.length;
        
        s_aSounds = new Array();
        for(var i = 0; i < s_aSoundsInfo.length; i++){
            this.tryToLoadSound(s_aSoundsInfo[i], false);
        }
    };
    
    this.tryToLoadSound = function(oSoundInfo, bDelay){ 
        setTimeout(function(){        
            s_aSounds[oSoundInfo.ingamename] = new Howl({ 
                                                            src: [oSoundInfo.path+oSoundInfo.filename+'.mp3'],
                                                            autoplay: false,
                                                            preload: true,
                                                            loop: oSoundInfo.loop, 
                                                            volume: oSoundInfo.volume,
                                                            onload: s_oMain.soundLoaded,
                                                            onloaderror: function(szId,szMsg){
                                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                         s_oMain.tryToLoadSound(s_aSoundsInfo[i], true);
                                                                                         break;
                                                                                     }
                                                                                }
                                                                        },
                                                            onplayerror: function(szId) {
                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                          s_aSounds[s_aSoundsInfo[i].ingamename].once('unlock', function() {
                                                                                            s_aSounds[s_aSoundsInfo[i].ingamename].play();
                                                                                            if(s_aSoundsInfo[i].ingamename === "soundtrack" && s_oGame !== null){
                                                                                                setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME);
                                                                                            }

                                                                                          });
                                                                                         break;
                                                                                     }
                                                                                 }    
                                                            } 
                                                        });
        }, (bDelay ? 200 : 0) );
    };

    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );
        s_oSpriteLibrary.addSprite("logo0","./sprites/logo0.png");
        s_oSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("ctl_logo","./sprites/ctl_logo.png");
        s_oSpriteLibrary.addSprite("but_info","./sprites/but_info.png");
        s_oSpriteLibrary.addSprite("but_yes_big","./sprites/but_yes_big.png");
        s_oSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg"); 
        s_oSpriteLibrary.addSprite("bg_game","./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_fullscreen","./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("ball","./sprites/ball.png");
        s_oSpriteLibrary.addSprite("but_p1","./sprites/but_p1.png");
        s_oSpriteLibrary.addSprite("but_p2","./sprites/but_p2.png");
        s_oSpriteLibrary.addSprite("but_mode","./sprites/but_mode.png");
        s_oSpriteLibrary.addSprite("player_red","./sprites/player_red.png");
        s_oSpriteLibrary.addSprite("player_blue","./sprites/player_blue.png");
        s_oSpriteLibrary.addSprite("player_blue_boosted","./sprites/player_blue_boosted.png");
        s_oSpriteLibrary.addSprite("player_red_boosted","./sprites/player_red_boosted.png");
        s_oSpriteLibrary.addSprite("but_restart","./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("but_home","./sprites/but_home.png");
        s_oSpriteLibrary.addSprite("but_easy","./sprites/but_easy.png");
        s_oSpriteLibrary.addSprite("but_medium","./sprites/but_medium.png");
        s_oSpriteLibrary.addSprite("but_hard","./sprites/but_hard.png");
        s_oSpriteLibrary.addSprite("but_next","./sprites/but_next.png");
        s_oSpriteLibrary.addSprite("but_kickoff","./sprites/but_kickoff.png");
        s_oSpriteLibrary.addSprite("key_w","./sprites/key_w.png");
        s_oSpriteLibrary.addSprite("key_s","./sprites/key_s.png");
        s_oSpriteLibrary.addSprite("key_up","./sprites/key_up.png");
        s_oSpriteLibrary.addSprite("key_down","./sprites/key_down.png");
        s_oSpriteLibrary.addSprite("skip_arrow","./sprites/skip_arrow.png");
        s_oSpriteLibrary.addSprite("skip_arrow_left","./sprites/skip_arrow_left.png");
        s_oSpriteLibrary.addSprite("but_help","./sprites/but_help.png");
        s_oSpriteLibrary.addSprite("but_settings","./sprites/but_settings.png");
        s_oSpriteLibrary.addSprite("large_bonus","./sprites/large_bonus.png");
        s_oSpriteLibrary.addSprite("short_malus","./sprites/short_malus.png");
        s_oSpriteLibrary.addSprite("super_shot","./sprites/super_shot.png");
        s_oSpriteLibrary.addSprite("double_balls","./sprites/double_balls.png");
        s_oSpriteLibrary.addSprite("crazy_ball","./sprites/crazy_ball.png");
        s_oSpriteLibrary.addSprite("ball_trajectory","./sprites/ball_trajectory.png");
        s_oSpriteLibrary.addSprite("point_1","./sprites/point_1.png");
        s_oSpriteLibrary.addSprite("point_2","./sprites/point_2.png");
        
        for(var i = 0; i < LOGO_MENU_FRAMES_NUM; i++){
            s_oSpriteLibrary.addSprite("logo_menu_" + i,"./sprites/logo_menu/logo_menu_"+ i +".png");
        }
        
        for(var i = 0; i < GOAL_TEXT_FRAMES_NUM; i++){
            s_oSpriteLibrary.addSprite("goal_text_"+ i,"./sprites/goal_text/goal_text_"+ i +".png");
        }
        
        for(var i = 0; i < ENLARGE_TEXT_FRAMES_NUM; i++){
            s_oSpriteLibrary.addSprite("enlarge_text_"+ i,"./sprites/enlarge_text/enlarge_text_"+ i +".png");
        }
        
        for(var i = 0; i < BECOME_SHORT_TEXT_FRAMES_NUM; i++){
            s_oSpriteLibrary.addSprite("become_short_text_"+ i,"./sprites/become_short_text/become_short_text_"+ i +".png");
        }
        
        for(var i = 0; i < SUPER_SHOT_TEXT_FRAMES_NUM; i++){
            s_oSpriteLibrary.addSprite("super_shot_text_"+ i,"./sprites/super_shot_text/super_shot_text_"+ i +".png");
        }
        
        for(var i = 0; i < DOUBLE_BALL_TEXT_FRAMES_NUM; i++){
            s_oSpriteLibrary.addSprite("double_ball_text_"+ i,"./sprites/double_ball_text/double_ball_text_"+ i +".png");
        }
        
        for(var i = 0; i < CRAZY_BALL_TEXT_FRAMES_NUM; i++){
            s_oSpriteLibrary.addSprite("crazy_ball_text_"+ i,"./sprites/crazy_ball_text/crazy_ball_text_"+ i +".png");
        }

        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        //console.log("PERC: "+iPerc);
        _oPreloader.refreshLoader(iPerc);

    };
    
    this._onAllImagesLoaded = function(){
        
    };
    
    this._onRemovePreloader = function(){
        _oPreloader.unload();
        
        if(_oMenu !== null){
            return;
        }
            
        s_oSoundtrack = playSound('soundtrack', 0.4, true);
        
        ARRAY_IMG_LEVEL[0] = s_oSpriteLibrary.getSprite("but_easy");
        ARRAY_IMG_LEVEL[1] = s_oSpriteLibrary.getSprite("but_medium");
        ARRAY_IMG_LEVEL[2] = s_oSpriteLibrary.getSprite("but_hard");
        
        this.gotoMenu();
    };
    
    this.onAllPreloaderImagesLoaded = function(){
        this._loadImages();
    };
    
    this.gotoMenu = function(){

        _oMenu = new CMenu();
        _iState = STATE_MENU;
    }; 

    this.gotoGame = function(){
        _oGame = new CGame(_oData);   						
        _iState = STATE_GAME;
    };
    
    this.gotoSelectPlayers = function(){
       //new CSelectPlayers(); 
       new CRoomPanel();
    };
    
    this.gotoLevelMenu = function(){
       new CLevelMenu();
       _iState = STATE_LEVEL_SELECTION;
    };
    
    this.gotoSelectMode = function(){
       new CSelectMode(); 
    };
    
    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
	
    this.stopUpdate = function(){
         _bUpdate = false;
         createjs.Ticker.paused = true;
         $("#block_game").css("display","block");
         Howler.mute(true);
    };

    this.startUpdate = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");
        if(s_bAudioActive){
             Howler.mute(false);
        }
    };
    
    this._update = function(event){
		if(_bUpdate === false){
			return;
		}
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        
        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }
                
        if(_iState === STATE_GAME){
            _oGame.update();
        }
        if (_iState === STATE_MENU){
            _oMenu.update();
        }
        
        s_oStage.update(event);

    };
    
    s_oMain = this;
    
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;
    ENABLE_FULLSCREEN = oData.fullscreen;
    if (oData.points_to_win>20){
        POINTS_TO_WIN = 20;
    }else{
        POINTS_TO_WIN = oData.points_to_win;
    }
    
    OCCURRENCES_LARGE_BONUS = oData.large_bonus_occurrences;
    OCCURRENCES_SHORT_MALUS = oData.short_malus_occurrences;
    OCCURRENCES_SUPER_SHOTS = oData.super_shots_occurrences;
    OCCURRENCES_DOUBLE_BALLS = oData.double_balls_occurrences;
    OCCURRENCES_CRAZY_BALL = oData.crazy_ball_occurrences;
    _oData = oData;
    
    s_bAudioActive = oData.audio_enable_on_startup;
    
    this.initContainer();
}
var s_bMobile;
var s_bAudioActive = true;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;
var s_iLastLevel = 1;
var s_bFullscreen = false;
var s_bStorageAvailable = true;
var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundtrack = null;
var s_oCanvas;
var s_aSounds;
var s_aSoundsInfo;
