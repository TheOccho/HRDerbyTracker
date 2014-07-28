define(function( require, exports, module ) {

  var _instance = null,
      _isSpanish = false;
   
  function DerbyTrackerTranslator() {
    if(_instance !== null){
      throw new Error("Cannot instantiate more than one DerbyTrackerTranslator, use DerbyTrackerTranslator.getInstance()");
    }
  }

  function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
  }

  DerbyTrackerTranslator.prototype = {
    getRound: function() {
      return (_isSpanish) ? "RONDA" : "ROUND";
    },
    getFinal: function() {
      return (_isSpanish) ? "Final" : "Final";
    },
    getNowBatting: function() {
      return (_isSpanish) ? "BATEANDO" : "NOW BATTING";
    },
    getWinner: function() {
      return (_isSpanish) ? "GANADOR" : "WINNER";
    },
    getBYE: function() {
      return (_isSpanish) ? "PASE" : "BYE";
    },
    getAL: function() {
      return (_isSpanish) ? "LIGA AMERICANA" : "AMERICAN LEAGUE";
    },
    getNL: function() {
      return (_isSpanish) ? "LIGA NACIONAL" : "NATIONAL LEAGUE";
    },
    getTiebreaker: function() {
      return (_isSpanish) ? "Desempate" : "Tiebreaker";
    },
    getLast: function() {
      return (_isSpanish) ? "Último" : "Last";
    },
    getLongest: function() {
      return (_isSpanish) ? "Más Largo" : "Longest";
    },
    getTotalHRs: function() {
      return (_isSpanish) ? "Total HRs" : "Total HRs";
    },
    getOuts: function() {
      return (_isSpanish) ? "Out" : "Outs";
    },
    getAverage: function() {
      return (_isSpanish) ? "Promedio" : "Average";
    }
  };

  DerbyTrackerTranslator.getInstance = function() {
    // Gets an instance of the singleton. It is better to use
    if(_instance === null) {
      _instance = new DerbyTrackerTranslator();
      if(inIframe()) {
        if(window.parent.document.getElementsByTagName("html")[0].getAttribute("lang") && window.parent.document.getElementsByTagName("html")[0].getAttribute("lang").indexOf("es") !== -1) {
          _isSpanish = true;
        }
      } else {
        if(document.getElementsByTagName("html")[0].getAttribute("lang") && document.getElementsByTagName("html")[0].getAttribute("lang").indexOf("es") !== -1) {
          _isSpanish = true;
        }
      }
    }
    return _instance;
  };

  return DerbyTrackerTranslator.getInstance();
});