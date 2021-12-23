function CEdge (iX1,iY1,iX2,iY2,iHeight,bVisible){
    var _oModel;
    var _oViewer;
    var _oPrevPoint;
    var _iCounterSize;
    
    this.init = function(iX1,iY1,iX2,iY2,iHeight){
        _iCounterSize = 0;
        var oLength;
        _oModel = new CEdgeModel(iX1,iY1,iX2,iY2);
        oLength = _oModel.getLength();
        if (bVisible){
            _oViewer = new CEdgeViewer(iX1,iY1,iX2,iY2,oLength,iHeight);
        }
        
    };
    
    this.getModel = function(){
       return _oModel; 
    };
    
    this.moveY = function(iY){
       if (bVisible){
           _oViewer.moveY(iY);
       } 
       _oModel.moveY(iY);
    };
    
    this.moveX = function(iX){
       if (bVisible){
           _oViewer.moveX(iX);
       } 
       _oModel.moveX(iX);
    };
    
    this.changeSize = function(iSize){
        /*_oViewer.unload();
        if (bVisible){
            _oViewer = new CEdgeViewer(iX1,iY1,iX2,iY2);
        }
        _oModel = new CEdgeModel(iX1,iY1,iX2,iY2);*/
        
        _iCounterSize += iSize;
        
        _oPrevPoint = {a: {x: _oModel.getPointA().getX(), y: _oModel.getPointA().getY()}, b: {x: _oModel.getPointB().getX(), y: _oModel.getPointB().getY()}};
        _oModel.destroy();
        _oModel = new CEdgeModel(_oPrevPoint.a.x+iSize,_oPrevPoint.a.y,_oPrevPoint.b.x-iSize,_oPrevPoint.b.y);
        if (bVisible){
            _oViewer.unload();
            _oViewer = new CEdgeViewer(_oModel.getPointA().getX(),_oModel.getPointA().getY(),_oModel.getPointB().getX(),_oModel.getPointB().getY(),_oModel.getLength(),iHeight);
        }
    };
    
    this.resetSize = function(iPosNeg){
        //var iPosNeg1
        var iPosNeg2;
       _oPrevPoint = {a: {x: _oModel.getPointA().getX(), y: _oModel.getPointA().getY()}, b: {x: _oModel.getPointB().getX(), y: _oModel.getPointB().getY()}};
       _oModel.destroy();
       if (_iCounterSize*iPosNeg>0){
           if (iPosNeg>0){
                iPosNeg2 = -1;
            }else{
                iPosNeg2 = 1;
            }
       }else if (iPosNeg<0){
                iPosNeg2 = -1;
            }else{
                iPosNeg2 = 1;
            }
       
       
       if (_iCounterSize*iPosNeg<0){
            _oModel = new CEdgeModel(_oPrevPoint.a.x-iPosNeg2*(iPosNeg*_iCounterSize),_oPrevPoint.a.y,_oPrevPoint.b.x+iPosNeg2*(iPosNeg*_iCounterSize),_oPrevPoint.b.y);
        }else{
            _oModel = new CEdgeModel(_oPrevPoint.a.x+iPosNeg2*(iPosNeg*_iCounterSize),_oPrevPoint.a.y,_oPrevPoint.b.x-iPosNeg2*(iPosNeg*_iCounterSize),_oPrevPoint.b.y);
        }
       
       _iCounterSize = 0;
       
       if (bVisible){
            _oViewer.unload();
            _oViewer = new CEdgeViewer(_oModel.getPointA().getX(),_oModel.getPointA().getY(),_oModel.getPointB().getX(),_oModel.getPointB().getY(),_oModel.getLength(),iHeight);
        }
    };
    
    this.init(iX1,iY1,iX2,iY2,iHeight);
}
