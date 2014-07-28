define(function(require, module, exports) {

  var xml2json = require("xml2json/xml2json");

  var _instance = null,
      _xmlUrl,
      _controller = require("../controller/DerbyTrackerController"),
      _userSpecifiedRoundIdx = -1,
      _trackerFileVO = require("./vo/DerbyTrackerFileVO"),
      _trackerFileVOObject;

  function DerbyTrackerModel() {
    if(_instance !== null) {
      throw new Error("Cannot instantiate more than one DerbyTrackerModel, use DerbyTrackerModel.getInstance()");
    }
  }

  function loadTrackerXml() {
    var that = this;
    $.ajax({
      url: _xmlUrl,
      dataType: "xml",
      success: function(resp) {
        _trackerFileVOObject = new _trackerFileVO();
        _trackerFileVOObject.setModel(_instance);
        _trackerFileVOObject.setData(xml2json(resp));
        _controller.dispatchEvent("DerbyTrackerEvent.UPDATE", _instance);
      },
      error: function(error) {
        _controller.dispatchEvent("DerbyTrackerEvent.ERROR");
      }
    });
  }

  function handleGoToRoundEvent(args) {
    if(args.roundIdx === _trackerFileVOObject.getCurrentRoundIndex()) {
      _userSpecifiedRoundIdx = -1;
    } else {
      _userSpecifiedRoundIdx = args.roundIdx;
    }
    _controller.dispatchEvent("DerbyTrackerEvent.UPDATE", _instance);
  }

  DerbyTrackerModel.prototype = {
    init: function($xmlUrl) {
      _xmlUrl = $xmlUrl;
      _controller.on("DerbyTrackerEvent.INIT_MODEL_DATA", loadTrackerXml);
      _controller.on("DerbyTrackerEvent.REFRESH_DATA", loadTrackerXml);
      _controller.on("DerbyTrackerEvent.GO_TO_ROUND", handleGoToRoundEvent);
    },
    getCurrentRoundIndex: function() {
      return (_userSpecifiedRoundIdx >= 0) ? _userSpecifiedRoundIdx : _trackerFileVOObject.getCurrentRoundIndex();
    },
    getTrackerFileVO: function() {
      return _trackerFileVOObject;
    }
  }

  DerbyTrackerModel.getInstance = function() {
    // Gets an instance of the singleton. It is better to use
    if(_instance === null) {
      _instance = new DerbyTrackerModel();
    }
    return _instance;
  };

  return DerbyTrackerModel.getInstance();
});