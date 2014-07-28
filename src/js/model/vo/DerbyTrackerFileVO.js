define(function(require, module, exports) {

  var ensureArray = require("ensureArray/ensureArray"),
      roundVO = require("./RoundVO"),
      rosterVO = require("./RosterVO"),
      _model;

  function DerbyTrackerFileVO() {
    this._data;
    this._rosterVOObject;
    this._rounds = [];
  }

  DerbyTrackerFileVO.prototype = {
    setData: function(data) {
      this._data = data;

      //parse the roster
      this._rosterVOObject = new rosterVO();
      this._rosterVOObject.setModel(_model);
      this._rosterVOObject.setData(this._data.roster);

      
      this._data.state.round = ensureArray(this._data.state.round);
      //parse the rounds
      for(var i=0,l=this._data.state.round.length;i<l;i++) {
        var tmpRoundVOObject = new roundVO();
        tmpRoundVOObject.setRosterVO(this._rosterVOObject);
        tmpRoundVOObject.setData(this._data.state.round[i]);
        this._rounds.push(tmpRoundVOObject);
      }
    },
    setModel: function(model) {
      _model = model;
    },
    getDerbyDate: function() {
      return this._data.date;
    },
    getSportCode: function() {
      return this._data.sportcode;
    },
    getVenueID: function() {
      return this._data.venue_name;
    },
    getVenueCity: function() {
      return this._data.venue_city;
    },
    getVenueState: function() {
      return this._data.venue_state;
    },
    getVenueCountry: function() {
      return this._data.venue_country;
    },
    getCurrentRoundIndex: function() {
      return +this._data.state.currentRound - 1;
    },
    getCurrentRound: function() {
      return this._data.state.currentRound;
    },
    getCurrentRoundVO: function() {
      return this._rounds[this.getCurrentRoundIndex()];
    },
    getRounds: function() {
      return this._rounds;
    },
    getRoundByNum: function(num) {
      return this._rounds[+num-1];
    },
    getRoundByIndex: function(num) {
      return this._rounds[+num];
    },
    getRosterVO: function() {
      return this._rosterVOObject;
    },
    getTiebreakerInProgress: function() {
      return this._data.state.tiebreaker_in_progress === "true";
    },
    getTiebreakerNum: function() {
      return this._data.state.tiebreaker_num;
    },
    getCurrentTiebreakerVO: function() {
      return this.getCurrentRoundVO().getCurrentTiebreakerVO();
    },
    getPlayerOrder: function() {
      var tmpPlayerOrder = new Array(4);
      for(var i=0,l=this._rounds.length;i<l;i++) {
        tmpPlayerOrder[i] = this._rounds[i].getPlayerOrder();
      }
      return tmpPlayerOrder;
    }
  };

  return DerbyTrackerFileVO;
});