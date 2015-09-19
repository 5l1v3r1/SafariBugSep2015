(function() {

  window.app = {};

  var MIN_FOOTER_SIZE = 264;
  var MEMO_SIZE_RATIO = 0.3;
  var MIN_TIME_SIZE = 50;
  var PB_SIZE_RATIO = 0.2;
  var SCRAMBLE_PADDING = 10;

  function AppView() {
    this._state = null;
    this._userFooterHeight = 270;
    this._state = {
      footerHeight: 0,
      footerOpen: true,
      footerVisible: false,
      headerVisible: true,
      memoVisible: false,
      pbAvailable: false,
      pbVisible: false,
      scrambleAvailable: false,
      scrambleVisible: false
    };
  }

  AppView.prototype.triggerBug = function() {
    this._updateState();
    this._computeMiddleLayout();
  };

  AppView.prototype._updateState = function() {
    var pb = (this._state.pbAvailable && !this._state.footerOpen);
    var scramble = this._state.scrambleAvailable;
    var memo = this._state.memoVisible;
    var constraints = this._computeConstraints(pb, scramble, memo);

    var available = window.app.windowSize.height - 44;
    var footerSize = available - constraints.soft;

    if (footerSize >= MIN_FOOTER_SIZE) {
      this._state.footerHeight = Math.min(footerSize, this._userFooterHeight);
      this._state.footerVisible = true;
      this._state.pbVisible = (this._state.pbAvailable &&
        !this._state.footerOpen);
      this._state.scrambleVisible = this._state.scrambleAvailable;
    }
  };

  AppView.prototype._computeConstraints = function(pb, scramble, memo) {
    var bareMinimum = MIN_TIME_SIZE;
    if (memo) {
      bareMinimum *= 1 + MEMO_SIZE_RATIO;
    }
    if (pb) {
      bareMinimum += PB_SIZE_RATIO * MIN_TIME_SIZE;
    }
    bareMinimum += SCRAMBLE_PADDING*2;
    var softMinimum = bareMinimum;
    return {bare: bareMinimum, soft: softMinimum};
  };

  AppView.prototype._computeMiddleLayout = function() {
    var width = window.app.windowSize.width;

    // NOTE: getting rid of the Math.max() call prevents the bug.
    var middleHeight = Math.max(window.app.windowSize.height-this._state.footerHeight, 0);

    var pb = this._state.pbVisible;
    var scramble = this._state.scrambleVisible;
    var memo = this._state.memoVisible;

    return this._computeTimeLayout(width, middleHeight, pb, scramble, memo);
  };

  AppView.prototype._computeTimeLayout = function(width, height, pb, scramble, memo) {
    var usableHeight = height - SCRAMBLE_PADDING*2;
    var usableY = SCRAMBLE_PADDING;

    if ('number' !== typeof usableHeight || isNaN(usableHeight)) {
      // NOTE: removing these logs prevents the bug from happening.
      console.log('arguments are', arguments);
      console.log('usableHeight is', usableHeight, 'math is', height-SCRAMBLE_PADDING*2);
      throw new Error('invalid usableHeight: ' + usableHeight);
    } else if ('number' !== typeof usableY || isNaN(usableY)) {
      throw new Error('invalid usableY: ' + usableY);
    }

    var contentRatio = 1;
    var timeSize = usableHeight / contentRatio;
    if (timeSize > width/5.5) {
      timeSize = width / 5.5;
    }

    var middleSize = timeSize;
    var timeY = usableY + (usableHeight-middleSize)/2;

    return {timeY: timeY, timeSize: timeSize};
  };

  window.app.AppView = AppView;

  function WindowSize() {
    this.width = 900;
    this.height = 900;
  }

  window.app.WindowSize = WindowSize;

  window.addEventListener('load', function() {
    window.app.windowSize = new window.app.WindowSize();
    window.app.view = new window.app.AppView();
  });

})();

function triggerBug() {
  document.getElementById('trigger').innerText = 'Got bug :)';
  for (var i = 0; i < 20000; ++i) {
    window.app.view.triggerBug();
  }
  document.getElementById('trigger').innerText = 'No bug :(';
}
