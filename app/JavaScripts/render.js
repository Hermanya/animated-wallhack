(function() {
  define([], function() {
    return function(state, element) {
      var cell, i, str, substate, _i, _j, _k, _len, _len1, _results, _results1;
      element.html('');
      if (typeof state[0] !== 'object') {
        _results = [];
        for (_i = 0, _len = state.length; _i < _len; _i++) {
          cell = state[_i];
          _results.push(element.append(cell ? '|' : '&nbsp;'));
        }
        return _results;
      } else if (typeof state[0][0] !== 'object') {
        _results1 = [];
        for (_j = 0, _len1 = state.length; _j < _len1; _j++) {
          substate = state[_j];
          str = '<div class="row">';
          for (i = _k = 0; _k < 16; i = ++_k) {
            str += '<div class="cell' + (substate[i] ? ' alive' : '') + '"></div>';
          }
          _results1.push(element.append(str + '</div>'));
        }
        return _results1;
      } else {
        return element.html('This state is unrenderable! See console output.');
      }
    };
  });

}).call(this);
