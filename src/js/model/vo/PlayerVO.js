define(function(require, module, exports) {

  var _model,
      _translator = require("../../controller/DerbyTrackerTranslator");

  function PlayerVO() {
    this._data;
    this._swings = [];
  }

  PlayerVO.prototype = {
    setData: function(data) {
      this._data = data;
    },
    setModel: function(model) {
      _model = model;
    },
    getPlayerID: function() {
      return this._data.id;
    },
    getLeague: function() {
      return this._data.league;
    },
    getFirstName: function() {
      return this._data.name_first;
    },
    getUseName: function() {
      return this._data.name_use;
    },
    getLastName: function() {
      return this._data.name_last;
    },
    getDisplayName: function() {
      return this._data.name_display;
    },
    getAbbrevName: function() {
      return this._data.name_use.charAt(0) + ". " + this._data.name_last;
    },
    getTeamID: function() {
      return this._data.team_id;
    },
    getFileCode: function() {
      return this._data.team_file_code;
    },
    getTeamAbbrev: function() {
      return this._data.team_abbrev;
    },
    getTeamAbbrevLowerCase: function() {
      return this._data.team_abbrev.toLowerCase();
    },
    getBattingOrder: function() {
      return +this._data.bat_order;
    },
    getBats: function() {
      return this._data.bats;
    },
    getIsBatting: function() {
      return this._data.batting === "y";
    },
    getIsWinner: function() {
      return this._data.winner === "y";
    },
    getLastHR: function() {
      return (+this._data.last_hr === 0) ? "-" : this._data.last_hr;
    },
    getLongHR: function() {
      return (+this._data.long_hr === 0) ? "-" : this._data.long_hr;
    },
    getAverageHR: function() {
      return (+this._data.avg_hr === 0) ? "-" : this._data.avg_hr;
    },
    getTotalHomerunsForBracket: function() {
      var round = _model.getCurrentRoundIndex();
      if(typeof this._swings[round] === "undefined" || this._swings[round].length === 0) {
        return "-";
      }
      var homeruns = 0;
      for(var i=0,l=this._swings[round].length;i<l;i++) {
        if(this._swings[round][i].getResult() === "hr") {
          homeruns++;
        }
      }
      return homeruns;
    },
    getTotalHomeruns: function() {
      var round = _model.getCurrentRoundIndex();
      var swingsToUse = this._swings[round];
      if(_model.getTrackerFileVO().getTiebreakerInProgress() && _model.getTrackerFileVO().getRosterVO().getNowBattingVO().getPlayerID() === this._data.id) {
        swingsToUse = _model.getTrackerFileVO().getRoundByIndex(_model.getCurrentRoundIndex()).getTiebreakersByPlayerID(this._data.id);
        swingsToUse = swingsToUse[swingsToUse.length-1].swings;
      }
      if(typeof swingsToUse === "undefined" || swingsToUse.length === 0) {
        return "0";
      }
      var homeruns = 0;
      for(var i=0,l=swingsToUse.length;i<l;i++) {
        if(swingsToUse[i].getResult() === "hr") {
          homeruns++;
        }
      }
      return homeruns;
    },
    getTotalOuts: function() {
      var round = _model.getCurrentRoundIndex();
      var swingsToUse = this._swings[round];
      if(_model.getTrackerFileVO().getTiebreakerInProgress() && _model.getTrackerFileVO().getRosterVO().getNowBattingVO().getPlayerID() === this._data.id) {
        swingsToUse = _model.getTrackerFileVO().getRoundByIndex(_model.getCurrentRoundIndex()).getTiebreakersByPlayerID(this._data.id);
        swingsToUse = swingsToUse[swingsToUse.length-1].swings;
      }
      if(typeof swingsToUse === "undefined" || swingsToUse.length === 0) {
        return "0";
      }
      var outs = 0;
      for(var i=0,l=swingsToUse.length;i<l;i++) {
        if(swingsToUse[i].getResult() === "out") {
          outs++;
        }
      }
      return outs;
    },
    getTiebreakers: function() {
      var tmpTiebreakers = _model.getTrackerFileVO().getRoundByIndex(_model.getCurrentRoundIndex()).getTiebreakersByPlayerID(this._data.id);
      var tiebreakerText = "";
      for(var i=0,l=tmpTiebreakers.length;i<l;i++) {
        if(i===0) tiebreakerText+=(_translator.getTiebreaker()+" (");
        var numHomers = 0;
        for(var j=0,k=tmpTiebreakers[i].swings.length;j<k;j++) {
          if(tmpTiebreakers[i].swings[j].getResult() === "hr") {
            numHomers++;
          }
        }
        tiebreakerText+=numHomers;
        if(i===l-1) {
          tiebreakerText+=")";
        } else {
          tiebreakerText+=", ";
        }
      }
      return tiebreakerText;
    },
    getTiebreakerCSS: function() {
      var tmpTiebreakers = _model.getTrackerFileVO().getRoundByIndex(_model.getCurrentRoundIndex()).getTiebreakersByPlayerID(this._data.id);
      if(tmpTiebreakers.length > 0) {
        return "visible";
      } else {
        return "hidden";
      }
    },
    getAllSwings: function() {
      return this._swings;
    },
    setSwingsForRound: function(round, swings) {
      this._swings[+round-1] = swings;
    },
    getAtBatByRound: function(round) {
      if(_model.getTrackerFileVO().getTiebreakerInProgress()) {
        var tiebreakers = _model.getTrackerFileVO().getRoundByIndex(_model.getCurrentRoundIndex()).getTiebreakersByPlayerID(this._data.id);
        return tiebreakers[tiebreakers.length-1].swings;
      }
      return (this._swings[+round-1]) ? this._swings[+round-1] : undefined;
    },
    getIsBattingCSS: function() {
      return (this.getIsBatting()) ? "batting" : "";
    }
  };

  return PlayerVO;
});