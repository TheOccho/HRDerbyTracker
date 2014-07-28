define(function(require, module, exports) {

  var playerVO = require("./PlayerVO"),
      _model;

  function RosterVO() {
    this._data;
    this._playersArray = [];
    this._playersIndexMap = {};
    this._winningBatterVO;
  }

  RosterVO.prototype = {
    setData: function(data) {
      this._data = data;

      for(var i=0,l=this._data.player.length;i<l;i++) {
        var tmpPlayerVOObject = new playerVO();
        tmpPlayerVOObject.setModel(_model);
        tmpPlayerVOObject.setData(this._data.player[i]);
        this._playersArray.push(tmpPlayerVOObject);
        this._playersIndexMap[tmpPlayerVOObject.getPlayerID()] = i;

        //check if we have a winning player yet
        if(tmpPlayerVOObject.getIsWinner()) {
          this._winningBatterVO = tmpPlayerVOObject;
        }
      }
    },
    setModel: function(model) {
      _model = model;
    },
    getPlayers: function() {
      return this._playersArray;
    },
    getPlayerByID: function(playerID) {
      return this._playersArray[this._playersIndexMap[playerID]];
    },
    getPlayersByLeague: function(league) {
      var tmpPlayers = [];
      for(var i=0,l=this._playersArray.length;i<l;i++) {
        if(this._playersArray[i].getLeague() === league) {
          tmpPlayers.push(this._playersArray[i]);
        }
      }
      return tmpPlayers;
    },
    getNowBattingVO: function() {
      for(var i=0,l=this._playersArray.length;i<l;i++) {
        if(this._playersArray[i].getIsWinner() || this._playersArray[i].getIsBatting()) {
          return this._playersArray[i];
        }
      }
      if(_model.getTrackerFileVO().getTiebreakerInProgress()) {
        var currentTiebreakerPlayers = _model.getTrackerFileVO().getCurrentTiebreakerVO().getPlayers();
        for(var i=0,l=currentTiebreakerPlayers.length;i<l;i++) {
          if(currentTiebreakerPlayers[i].order === 1) {
            return this.getPlayerByID(currentTiebreakerPlayers[i].id);
          }
        }
      } else {
        //catch for pre-derby mode
        for(var i=0,l=this._playersArray.length;i<l;i++) {
          if(this._playersArray[i].getBattingOrder() === 1) {
            return this._playersArray[i];
          }
        }
      }
    },
    getWinningBatterVO: function() {
      return this._winningBatterVO;
    }
  };

  return RosterVO;
});