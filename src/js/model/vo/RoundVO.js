define(function(require, module, exports) {

  var ensureArray = require("ensureArray/ensureArray"),
      tiebreakerVO = require("./TiebreakerVO"),
      swingVO = require("./SwingVO");

  function RoundVO() {
    this._data;
    this._rosterVO;
    this._playerOrder = [];
    this._tiebreakers = [];
  }

  RoundVO.prototype = {
    setData: function(data) {
      this._data = data;

      //ensure arrays
      this._data.player = ensureArray(this._data.player);

      for(var i=0,l=this._data.player.length;i<l;i++) {

        //add players to the order of this round
        this._playerOrder.push(this._data.player[i].id);

        var tmpSwingVOObject;
        var tmpSwings = [];

        //ensure swings is an array
        this._data.player[i].swing = ensureArray(this._data.player[i].swing);

        for(var j=0,k=this._data.player[i].swing.length;j<k;j++) {
          tmpSwingVOObject = new swingVO();
          tmpSwingVOObject.setData(this._data.player[i].swing[j]);
          tmpSwings.push(tmpSwingVOObject);
        }
        
        //set the swings for this round on the master PlayerVO
        this._rosterVO.getPlayerByID(this._data.player[i].id).setSwingsForRound(this._data.number, tmpSwings);
      }

      //handle any tiebreakers that may exist for this round
      if(this._data.tiebreakers && this._data.tiebreakers.tiebreaker) {
        //ensure tiebreaker is an array
        this._data.tiebreakers.tiebreaker = ensureArray(this._data.tiebreakers.tiebreaker);
        
        var tmpTiebreakerVOObject;
        for(var i=0,l=this._data.tiebreakers.tiebreaker.length;i<l;i++) {
          tmpTiebreakerVOObject = new tiebreakerVO();
          tmpTiebreakerVOObject.setData(this._data.tiebreakers.tiebreaker[i]);
          this._tiebreakers.push(tmpTiebreakerVOObject);
        }
      }
    },
    setRosterVO: function(rosterVO) {
      this._rosterVO = rosterVO;
    },
    getCurrentTiebreakerVO: function() {
      return this._tiebreakers[this._tiebreakers.length - 1];
    },
    getPlayerOrder: function() {
      return this._playerOrder;
    },
    getTiebreakersByPlayerID: function(playerID) {
      var tmpTiebreakers = [];
      for(var i=0,l=this._tiebreakers.length;i<l;i++) {
        for(var j=0,k=this._tiebreakers[i].getPlayers().length;j<k;j++) {
          if(this._tiebreakers[i].getPlayers()[j].id === playerID) {
            tmpTiebreakers.push(this._tiebreakers[i].getPlayers()[j]);
          }
        }
      }
      return tmpTiebreakers;
    }
  };

  return RoundVO;
});