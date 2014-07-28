define(function(require, module, exports) {

  var ensureArray = require("ensureArray/ensureArray"),
      swingvo = require("./SwingVO");

  function TiebreakerVO() {
    this._data;
    this._players = [];
  }

  TiebreakerVO.prototype = {
    setData: function(data) {
      this._data = data;

      for(var i=0,l=this._data.player.length;i<l;i++) {
        var tmpSwings = [];
        //check if this player has any swings yet
        if(typeof this._data.player[i].swing !== "undefined") {
          this._data.player[i].swing = ensureArray(this._data.player[i].swing);

          for(var j=0,k=this._data.player[i].swing.length;j<k;j++) {
            var tmpSwingVOObject = new swingvo();
            tmpSwingVOObject.setData(this._data.player[i].swing[j]);
            tmpSwings.push(tmpSwingVOObject);
          }
        }
        this._players.push({id: this._data.player[i].id, order: +this._data.player[i].order, batting: this._data.player[i].batting, swings: tmpSwings});
      }
    },
    getTiebreakerNum: function() {
      return this._data.tiebreaker_num;
    },
    getPlayers: function() {
      return this._players;
    }
  };

  return TiebreakerVO;
});