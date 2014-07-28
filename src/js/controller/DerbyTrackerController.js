define(function( require, exports, module ) {

  var paperboy = require("paperboy/paperboy");

  var _instance = null,
      _timer;
   
  function DerbyTrackerController() {
    if(_instance !== null){
      throw new Error("Cannot instantiate more than one DerbyTrackerController, use DerbyTrackerController.getInstance()");
    }
    this.trigger = paperboy.mixin(this);
  }

  function handlePollTimer() {
    _instance.dispatchEvent("DerbyTrackerEvent.REFRESH_DATA");
  }

  DerbyTrackerController.prototype = {
    dispatchEvent: function(eventEnum, eventArgs) {
      this.trigger(eventEnum, eventArgs);
    },
    startPolling: function($freqSeconds) {
      if(_timer) {
        clearInterval(_timer);
      }
      _timer = setInterval(handlePollTimer, $freqSeconds * 1000);
    }
  };

  DerbyTrackerController.getInstance = function() {
    // Gets an instance of the singleton. It is better to use
    if(_instance === null) {
      _instance = new DerbyTrackerController();
    }
    return _instance;
  };

  return DerbyTrackerController.getInstance();
});