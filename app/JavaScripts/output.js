(function() {
  define([], function() {
    return function(state, element, size) {
      var cell, i, str, substate, _i, _j, _len, _len1, _results, _results1;
      console.log(state);
      element.html('');
      if (state[0].isCell) {
        _results = [];
        for (_i = 0, _len = state.length; _i < _len; _i++) {
          cell = state[_i];
          _results.push(element.append(cell.isAlive ? '|' : '&nbsp;'));
        }
        return _results;
      } else if (state[0][0].isCell) {
        _results1 = [];
        for (_j = 0, _len1 = state.length; _j < _len1; _j++) {
          substate = state[_j];
          str = '<div class="row">';
          i = size;
          while (i--) {
            str += '<div class="cell' + (substate[i].isAlive ? ' alive' : '') + '" title="' + substate[i].path + '"></div>';
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
