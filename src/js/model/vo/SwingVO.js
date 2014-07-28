define(function(require, module, exports) {

  function SwingVO() {
    this._data;
  }

  SwingVO.prototype = {
    setData: function(data) {
      this._data = data;
    },
    getNumber: function() {
      return this._data.number;
    },
    getResult: function() {
      return this._data.result;
    },
    getX: function() {
      return this._data.x;
    },
    getY: function() {
      return this._data.y;
    },
    getHoverX: function() {
      return +this._data.x + 12;
    },
    getHoverY: function() {
      return +this._data.y - 12;
    },
    getDistance: function() {
      return this._data.distance;
    },
    getDescription: function() {
      return this._data.description;
    },
    getBatSide: function() {
      return this._data.bat_side;
    },
    getLocation: function() {
      return this._data.location;
    },
    getIsGoldenBall: function() {
      return this._data.golden_ball === "y";
    },
    getHoverText: function() {
      if(this._data.result === "out") {
        return "OUT";
      } else {
        return this._data.distance + "' HR";
      }
    },
    getCSSClassName: function() {
      if(this._data.golden_ball === "y") {
        return "gold";
      } else {
        return this._data.result;
      }
    }
  };

  return SwingVO;
});