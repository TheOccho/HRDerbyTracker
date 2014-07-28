define(function(require, exports, module) {

  var _controller = require("../js/controller/DerbyTrackerController"),
      _model = require("../js/model/DerbyTrackerModel"),
      _view = require("../js/view/DerbyTrackerView"),
      _updateCallback;

  exports.init = function(containerID, trackerXMLPath, pollInterval, updateCallback) {

    //set our updateCallback
    _updateCallback = updateCallback;

    //create the main view container 
    _view.init(containerID);

    //create and configure the model
    var trackerFileURL = trackerXMLPath || "src/xml/derby_data.xml";
    _model.init(trackerFileURL);

    //fire the initialize command from the controller
    _controller.dispatchEvent("DerbyTrackerEvent.INIT_MODEL_DATA");

    //start the app polling
    _controller.startPolling(pollInterval || 30);

    //bind to update events and pass them to our callback
    _controller.on("DerbyTrackerEvent.VIEW_UPDATE", function() {
      if(typeof _updateCallback !== "undefined") {
        _updateCallback();
      }
    });
  };
});