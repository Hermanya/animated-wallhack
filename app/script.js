;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0](function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function() {
  module.exports = function(state, element, size, cellsToToggle) {
    var cell, _i, _len, _results;
    if (state[0].path) {
      return element.innerHTML = 'This state is unrenderable! See console output.';
    } else if (state[0][0].path) {
      _results = [];
      for (_i = 0, _len = cellsToToggle.length; _i < _len; _i++) {
        cell = cellsToToggle[_i];
        _results.push(element.childNodes[0].childNodes[cell.path[0]].childNodes[cell.path[1]].classList.toggle('alive'));
      }
      return _results;
    } else {
      return element.innerHTML = 'This state is unrenderable! See console output.';
      /*
      Project multi-dimensional states to 2D
      e.g. state[i][j][reduced]..[states]
      */

    }
  };

}).call(this);


},{}],2:[function(require,module,exports){
(function() {
  module.exports = function(specimen) {
    var cell, cellsToToggle, clone, dimensionSize, index, nestedMap, newState, previousState, state, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _state;
    clone = function(object) {
      object = JSON.stringify(object);
      return JSON.parse(object);
    };
    previousState = specimen.states[specimen.states.length - 1];
    newState = clone(previousState);
    cellsToToggle = [];
    dimensionSize = specimen.params[1];
    nestedMap = function(dimension) {
      if (!dimension[0].path) {
        return dimension.map(nestedMap);
      } else {
        return dimension.map(function(givenCell) {
          var lifeCount, pathTree;
          lifeCount = 0;
          pathTree = function(dimensionIndex, _state) {
            var d, d1, neighbor, nextIndex;
            if (!_state.path) {
              nextIndex = dimensionIndex + 1;
              d = d1 = givenCell.path[dimensionIndex];
              pathTree(nextIndex, _state[d]);
              if (d === 0) {
                d = dimensionSize;
              }
              pathTree(nextIndex, _state[d - 1]);
              if (d1 === dimensionSize - 1) {
                d1 = -1;
              }
              return pathTree(nextIndex, _state[d1 + 1]);
            } else {
              neighbor = _state;
              if (neighbor.isAlive && (neighbor.path !== givenCell.path)) {
                return lifeCount++;
              }
            }
          };
          pathTree(0, previousState);
          if (givenCell.isAlive) {
            if (lifeCount < 2 || lifeCount > 3) {
              return cellsToToggle.push(givenCell);
            }
          } else {
            if (lifeCount === 3) {
              return cellsToToggle.push(givenCell);
            }
          }
        });
      }
    };
    nestedMap(previousState);
    for (_i = 0, _len = cellsToToggle.length; _i < _len; _i++) {
      cell = cellsToToggle[_i];
      _state = newState;
      _ref = cell.path;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        index = _ref[_j];
        _state = _state[index];
      }
      _state.isAlive = !_state.isAlive;
    }
    if (cellsToToggle.length === 0) {
      specimen.status = 'dead';
      if ((JSON.stringify(newState).indexOf('true')) !== -1) {
        specimen.status = 'still';
      }
    } else {
      _ref1 = specimen.states;
      for (index = _k = 0, _len2 = _ref1.length; _k < _len2; index = ++_k) {
        state = _ref1[index];
        if (JSON.stringify(newState) === JSON.stringify(state)) {
          specimen.status = 'period ' + (specimen.states.length - index);
        }
      }
    }
    specimen.age++;
    specimen.cellsToToggle = cellsToToggle;
    return specimen.states = [previousState, newState];
    /*
     #specimen.states.push newState
    number of surrounding cells = 3 ^ dimensions - 1
    */

  };

}).call(this);


},{}],3:[function(require,module,exports){
(function() {
  module.exports = function(range) {
    return Math.floor(Math.random() * range);
  };

}).call(this);


},{}],4:[function(require,module,exports){
(function() {
  var random;

  random = require('./random.coffee');

  module.exports = function(dimensionNum, dimensionSize, populationSize) {
    var cellPath, clone, d, halfdimensionSize, init, insertAnotherOne, population, state, substate;
    state = [];
    clone = function(object) {
      object = JSON.stringify(object);
      return JSON.parse(object);
    };
    init = function(substate, dimensionsLeft, path) {
      var cellPath, dimensionPath, i, j, _results;
      if (dimensionsLeft) {
        i = dimensionSize;
        _results = [];
        while (i--) {
          dimensionPath = clone(path);
          dimensionPath.push(i);
          substate[i] = [];
          if (dimensionsLeft === 1) {
            j = dimensionSize;
            while (j--) {
              cellPath = clone(dimensionPath);
              cellPath.push(j);
              substate[i][j] = {
                path: cellPath
              };
            }
          }
          _results.push(init(substate[i], dimensionsLeft - 1, dimensionPath));
        }
        return _results;
      }
    };
    init(state, dimensionNum - 1, []);
    population = [];
    halfdimensionSize = dimensionSize / 2;
    substate = state;
    cellPath = [];
    d = dimensionNum;
    while (--d) {
      cellPath.push(halfdimensionSize);
      substate = substate[halfdimensionSize];
    }
    cellPath.push(halfdimensionSize);
    population.push(cellPath);
    substate[halfdimensionSize].isAlive = true;
    insertAnotherOne = function() {
      var alreadyExists, shiftsNumber;
      cellPath = clone(population[random(population.length)]);
      shiftsNumber = (random(dimensionNum)) + 1;
      while (shiftsNumber--) {
        cellPath[random(dimensionNum)] += random(2) ? 1 : -1;
      }
      substate = state;
      d = dimensionNum;
      while (--d) {
        substate = substate[cellPath[dimensionNum - d - 1]];
      }
      alreadyExists = substate[cellPath[cellPath.length - 1]].isAlive;
      if (alreadyExists) {
        return false;
      } else {
        substate[cellPath[cellPath.length - 1]].isAlive = true;
        population.push(cellPath);
        return true;
      }
    };
    while (--populationSize) {
      while (!insertAnotherOne()) {
        console.log('Cell already exists, respawning.');
      }
    }
    state.initial = population;
    state.params = arguments;
    return state;
  };

}).call(this);


},{"./random.coffee":3}],5:[function(require,module,exports){
(function(){(function() {
  var body, element, generatedState, i, input, interval, output, process, row, set, specimen, str, _i, _j, _len, _set;

  input = require('./input.coffee');

  output = require('./output.coffee');

  process = require('./process.coffee');

  set = [];

  body = document.getElementsByTagName('body')[0];

  for (i = _i = 0; _i < 8; i = ++_i) {
    element = document.createElement('div');
    body.appendChild(element);
    element.setAttribute('id', 'specimen' + i);
    element.setAttribute('class', 'population');
    generatedState = input(2, 32, 32);
    specimen = {
      states: [generatedState],
      status: 'alive',
      params: generatedState.params,
      initial: generatedState.initial,
      element: element,
      age: 0
    };
    str = '<div class="dimension">';
    for (_j = 0, _len = generatedState.length; _j < _len; _j++) {
      row = generatedState[_j];
      str += '<div class="row">';
      i = specimen.params[1];
      while (i--) {
        str += '<div class="cell' + (row[i].isAlive ? ' alive' : '') + '"></div>';
      }
      str += '</div>';
    }
    specimen.element.innerHTML += str + '</div>';
    delete generatedState.params;
    delete generatedState.initial;
    set.push(specimen);
  }

  _set = [];

  interval = window.setInterval(function() {
    var isAllDone, _k, _len1;
    isAllDone = true;
    for (i = _k = 0, _len1 = set.length; _k < _len1; i = ++_k) {
      specimen = set[i];
      isAllDone = false;
      if (specimen.status === 'alive') {
        process(specimen);
        output(specimen.states[specimen.states.length - 1], specimen.element, specimen.params[1], specimen.cellsToToggle);
      } else {
        specimen.element.innerHTML += '<div class="status"><h1>' + specimen.status + '</h1><h3>age: ' + specimen.age + '</h3></div>';
        _set.push(specimen);
        i = set.indexOf(specimen);
        set.splice(i, 1);
        break;
      }
    }
    if (isAllDone) {
      return window.clearInterval(interval);
    }
  }, 100);

}).call(this);


})()
},{"./input.coffee":4,"./output.coffee":1,"./process.coffee":2}]},{},[4,5,1,2,3])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvbGlmZS9fYXBwL291dHB1dC5jb2ZmZWUiLCIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvbGlmZS9fYXBwL3Byb2Nlc3MuY29mZmVlIiwiL2hvbWUvaGVybWFuL2V4cGVyaW1lbnRzL2xpZmUvX2FwcC9yYW5kb20uY29mZmVlIiwiL2hvbWUvaGVybWFuL2V4cGVyaW1lbnRzL2xpZmUvX2FwcC9pbnB1dC5jb2ZmZWUiLCIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvbGlmZS9fYXBwL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtDQUFBLENBQUEsQ0FBaUIsQ0FBQSxDQUFBLENBQVgsQ0FBTixFQUFrQixJQUFEO0NBQ2YsT0FBQSxnQkFBQTtDQUFBLEdBQUEsQ0FBUztDQUVDLEVBQVksSUFBYixFQUFQLElBQUE7Q0FDWSxHQUFOLENBQU0sQ0FIZDtBQUtFLENBQUE7WUFBQSx3Q0FBQTtrQ0FBQTtDQUNFLEdBRWdCLEVBRmhCLENBQ0EsRUFHVSxDQUhFO0NBRmQ7dUJBTEY7TUFBQTtDQVlVLEVBQVksSUFBYixFQUFQLElBQUE7Q0FDQTs7OztDQWJGO01BRGU7Q0FBakIsRUFBaUI7Q0FBakI7Ozs7O0FDQUE7Q0FBQSxDQUFBLENBQWlCLEdBQVgsQ0FBTixDQUFpQixDQUFDO0NBQ2hCLE9BQUEsd0lBQUE7Q0FBQSxFQUFRLENBQVIsQ0FBQSxDQUFRLEdBQUM7Q0FDUCxFQUFTLENBQUksRUFBYixHQUFTO0NBQ1QsR0FBVyxDQUFKLENBQUEsT0FBQTtDQUZULElBQVE7Q0FBUixFQUdnQixDQUFoQixFQUFnQyxFQUFSLEtBQXhCO0NBSEEsRUFJVyxDQUFYLENBQVcsR0FBWCxLQUFXO0NBSlgsQ0FBQSxDQUtnQixDQUFoQixTQUFBO0NBTEEsRUFNZ0IsQ0FBaEIsRUFBZ0MsRUFBUixLQUF4QjtDQU5BLEVBT1ksQ0FBWixLQUFBO0FBQ1MsQ0FBUCxHQUFH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LEtBQUE7Q0FBQSxFQVlBLENBQUEscUJBWkE7QUFhQSxDQUFBLFFBQUEsNENBQUE7Z0NBQUE7Q0FDRSxFQUFBLENBQU8sRUFBUCxhQUFBO0NBQUEsRUFDSSxHQUFKLEVBQVk7QUFDTixDQUFOLENBQUEsQ0FBQSxVQUFNO0NBQ0osQ0FDRSxDQURGLENBQU8sR0FDSixDQURILEVBQUEsUUFBTztDQUhULE1BRUE7Q0FGQSxFQU1BLENBQU8sRUFBUCxFQU5BO0NBREYsSUFiQTtDQUFBLEVBcUI2QixDQUE3QixHQUFnQixDQUFSLENBQVI7QUFDQSxDQXRCQSxHQXNCQSxFQUFBLFFBQXFCO0FBQ3JCLENBdkJBLEdBdUJBLEVBQUEsQ0F2QkEsT0F1QnFCO0NBdkJyQixFQXdCRyxDQUFILElBQUE7Q0F6QkYsRUFOQTs7Q0FBQSxDQWdDQSxDQUFPLENBQVA7O0NBaENBLENBa0NBLENBQVcsR0FBTSxFQUFqQixDQUE4QixFQUFuQjtDQUNULE9BQUEsWUFBQTtDQUFBLEVBQVksQ0FBWixLQUFBO0FBQ0EsQ0FBQSxRQUFBLDJDQUFBO3lCQUFBO0NBQ0UsRUFBWSxFQUFaLENBQUEsR0FBQTtDQUNBLEdBQUcsQ0FBbUIsQ0FBdEIsQ0FBQSxDQUFXO0NBQ1QsTUFBQSxDQUFBO0NBQUEsQ0FFTSxDQUQwQyxHQUFoRCxDQUFBLENBQUEsS0FBQTtNQUZGLEVBQUE7Q0FPRSxFQUNFLENBRDJCLEVBQUEsQ0FBYixDQUFoQixDQUFBLElBQUEsR0FBNkIsVUFBQTtDQUE3QixHQUtJLElBQUo7Q0FMQSxFQU1JLElBQUEsQ0FBSjtDQU5BLENBT2MsQ0FBWCxHQUFILEVBQUE7Q0FDQSxhQWZGO1FBRkY7Q0FBQSxJQURBO0NBb0JBLEdBQUEsS0FBQTtDQUNTLEtBQUQsRUFBTixLQUFBO01BdEIwQjtDQUFuQixDQXVCVCxDQXZCNEI7Q0FsQzlCIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSAoc3RhdGUsIGVsZW1lbnQsIHNpemUsIGNlbGxzVG9Ub2dnbGUpLT5cbiAgaWYgc3RhdGVbMF0ucGF0aFxuIyBPbmUgZGltZW5zaW9uYWwgc3RhdGVcbiAgICBlbGVtZW50LmlubmVySFRNTCA9ICdUaGlzIHN0YXRlIGlzIHVucmVuZGVyYWJsZSEgU2VlIGNvbnNvbGUgb3V0cHV0LidcbiAgZWxzZSBpZiBzdGF0ZVswXVswXS5wYXRoXG4jIFR3byBkaW1lbnNpb25hbCBzdGF0ZVxuICAgIGZvciBjZWxsIGluIGNlbGxzVG9Ub2dnbGVcbiAgICAgIGVsZW1lbnRcbiAgICAgIC5jaGlsZE5vZGVzWzBdXG4gICAgICAuY2hpbGROb2Rlc1tjZWxsLnBhdGhbMF1dXG4gICAgICAuY2hpbGROb2Rlc1tjZWxsLnBhdGhbMV1dXG4gICAgICAuY2xhc3NMaXN0LnRvZ2dsZSAnYWxpdmUnXG4gIGVsc2VcbiAgICBlbGVtZW50LmlubmVySFRNTCA9ICdUaGlzIHN0YXRlIGlzIHVucmVuZGVyYWJsZSEgU2VlIGNvbnNvbGUgb3V0cHV0LidcbiAgICAjIyNcbiAgICBQcm9qZWN0IG11bHRpLWRpbWVuc2lvbmFsIHN0YXRlcyB0byAyRFxuICAgIGUuZy4gc3RhdGVbaV1bal1bcmVkdWNlZF0uLltzdGF0ZXNdXG4gICAgIyMjXG4iLCJtb2R1bGUuZXhwb3J0cyA9IChzcGVjaW1lbiktPlxuICBjbG9uZSA9IChvYmplY3QpLT5cbiAgICBvYmplY3QgPSBKU09OLnN0cmluZ2lmeSBvYmplY3RcbiAgICByZXR1cm4gSlNPTi5wYXJzZSBvYmplY3RcbiAgcHJldmlvdXNTdGF0ZSA9IHNwZWNpbWVuLnN0YXRlc1tzcGVjaW1lbi5zdGF0ZXMubGVuZ3RoIC0gMV1cbiAgbmV3U3RhdGUgPSBjbG9uZSBwcmV2aW91c1N0YXRlXG4gIGNlbGxzVG9Ub2dnbGUgPSBbXVxuICBkaW1lbnNpb25TaXplID0gc3BlY2ltZW4ucGFyYW1zWzFdXG4gIG5lc3RlZE1hcCA9IChkaW1lbnNpb24pLT5cbiAgICBpZiBub3QgZGltZW5zaW9uWzBdLnBhdGhcbiAgICAgIGRpbWVuc2lvbi5tYXAgbmVzdGVkTWFwXG4gICAgZWxzZVxuICAgICAgZGltZW5zaW9uLm1hcCAoZ2l2ZW5DZWxsKS0+XG4gICAgICAgIGxpZmVDb3VudCA9IDBcbiAgICAgICAgcGF0aFRyZWUgPSAoZGltZW5zaW9uSW5kZXgsIF9zdGF0ZSktPlxuICAgICAgICAgIGlmIG5vdCBfc3RhdGUucGF0aFxuICAgICAgICAgICAgbmV4dEluZGV4ID0gZGltZW5zaW9uSW5kZXggKyAxO1xuICAgICAgICAgICAgZCA9IGQxID0gZ2l2ZW5DZWxsLnBhdGhbZGltZW5zaW9uSW5kZXhdXG4gICAgICAgICAgICBwYXRoVHJlZSBuZXh0SW5kZXgsIF9zdGF0ZVtkXVxuICAgICAgICAgICAgaWYgZCBpcyAwXG4gICAgICAgICAgICAgIGQgPSBkaW1lbnNpb25TaXplXG4gICAgICAgICAgICBwYXRoVHJlZSBuZXh0SW5kZXgsIF9zdGF0ZVtkIC0gMV1cbiAgICAgICAgICAgIGlmIGQxIGlzIGRpbWVuc2lvblNpemUgLSAxXG4gICAgICAgICAgICAgIGQxID0gLTFcbiAgICAgICAgICAgIHBhdGhUcmVlIG5leHRJbmRleCwgX3N0YXRlW2QxICsgMV1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBuZWlnaGJvciA9IF9zdGF0ZVxuICAgICAgICAgICAgaWYgbmVpZ2hib3IuaXNBbGl2ZSBhbmQgKG5laWdoYm9yLnBhdGggaXNudCBnaXZlbkNlbGwucGF0aClcbiAgICAgICAgICAgICAgbGlmZUNvdW50KytcbiAgICAgICAgcGF0aFRyZWUgMCwgcHJldmlvdXNTdGF0ZVxuICAgICAgICBpZiBnaXZlbkNlbGwuaXNBbGl2ZVxuICAgICAgICAgIGlmIGxpZmVDb3VudCA8IDIgb3IgbGlmZUNvdW50ID4gM1xuICAgICAgICAgICAgY2VsbHNUb1RvZ2dsZS5wdXNoIGdpdmVuQ2VsbFxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgbGlmZUNvdW50IGlzIDNcbiAgICAgICAgICAgIGNlbGxzVG9Ub2dnbGUucHVzaCBnaXZlbkNlbGxcblxuICBuZXN0ZWRNYXAgcHJldmlvdXNTdGF0ZVxuXG4gIGZvciBjZWxsIGluIGNlbGxzVG9Ub2dnbGVcbiAgICBfc3RhdGUgPSBuZXdTdGF0ZVxuICAgIGZvciBpbmRleCBpbiBjZWxsLnBhdGhcbiAgICAgIF9zdGF0ZSA9IF9zdGF0ZVtpbmRleF1cbiAgICBfc3RhdGUuaXNBbGl2ZSA9ICEgX3N0YXRlLmlzQWxpdmVcblxuICBpZiBjZWxsc1RvVG9nZ2xlLmxlbmd0aCBpcyAwXG4gICAgc3BlY2ltZW4uc3RhdHVzID0gJ2RlYWQnXG4gICAgaWYgKEpTT04uc3RyaW5naWZ5KG5ld1N0YXRlKS5pbmRleE9mICd0cnVlJykgaXNudCAtMVxuICAgICAgc3BlY2ltZW4uc3RhdHVzID0gJ3N0aWxsJ1xuICBlbHNlXG4gICAgZm9yIHN0YXRlLCBpbmRleCBpbiBzcGVjaW1lbi5zdGF0ZXNcbiAgICAgIGlmIEpTT04uc3RyaW5naWZ5KG5ld1N0YXRlKSBpcyBKU09OLnN0cmluZ2lmeShzdGF0ZSlcbiAgICAgICAgc3BlY2ltZW4uc3RhdHVzID0gJ3BlcmlvZCAnICsgKHNwZWNpbWVuLnN0YXRlcy5sZW5ndGgtaW5kZXgpXG4gIHNwZWNpbWVuLmFnZSsrO1xuICBzcGVjaW1lbi5jZWxsc1RvVG9nZ2xlID0gY2VsbHNUb1RvZ2dsZTtcbiAgc3BlY2ltZW4uc3RhdGVzID0gW3ByZXZpb3VzU3RhdGUsIG5ld1N0YXRlXVxuICAjIyNcbiAjc3BlY2ltZW4uc3RhdGVzLnB1c2ggbmV3U3RhdGVcbiAgbnVtYmVyIG9mIHN1cnJvdW5kaW5nIGNlbGxzID0gMyBeIGRpbWVuc2lvbnMgLSAxXG4gICMjI1xuIiwibW9kdWxlLmV4cG9ydHMgPSAocmFuZ2UpLT5cbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlKVxuIiwicmFuZG9tID0gcmVxdWlyZSAnLi9yYW5kb20uY29mZmVlJ1xubW9kdWxlLmV4cG9ydHMgPSAoZGltZW5zaW9uTnVtLCBkaW1lbnNpb25TaXplLCBwb3B1bGF0aW9uU2l6ZSktPlxuICBzdGF0ZSA9IFtdXG5cbiAgY2xvbmUgPSAob2JqZWN0KS0+XG4gICAgb2JqZWN0ID0gSlNPTi5zdHJpbmdpZnkgb2JqZWN0XG4gICAgcmV0dXJuIEpTT04ucGFyc2Ugb2JqZWN0XG5cbiAgaW5pdCA9IChzdWJzdGF0ZSwgZGltZW5zaW9uc0xlZnQsIHBhdGgpLT5cbiAgICBpZiAoZGltZW5zaW9uc0xlZnQpXG4gICAgICBpID0gZGltZW5zaW9uU2l6ZVxuICAgICAgd2hpbGUoaS0tKVxuICAgICAgICBkaW1lbnNpb25QYXRoID0gY2xvbmUgcGF0aFxuICAgICAgICBkaW1lbnNpb25QYXRoLnB1c2goaSlcbiAgICAgICAgc3Vic3RhdGVbaV0gPSBbXVxuICAgICAgICBpZiAoZGltZW5zaW9uc0xlZnQgPT0gMSlcbiAgICAgICAgICBqID0gZGltZW5zaW9uU2l6ZVxuICAgICAgICAgIHdoaWxlKGotLSlcbiAgICAgICAgICAgIGNlbGxQYXRoID0gY2xvbmUgZGltZW5zaW9uUGF0aFxuICAgICAgICAgICAgY2VsbFBhdGgucHVzaChqKVxuICAgICAgICAgICAgc3Vic3RhdGVbaV1bal0gPSBwYXRoOmNlbGxQYXRoXG4gICAgICAgIGluaXQgc3Vic3RhdGVbaV0sIGRpbWVuc2lvbnNMZWZ0IC0gMSwgZGltZW5zaW9uUGF0aFxuXG4gIGluaXQgc3RhdGUsIGRpbWVuc2lvbk51bSAtIDEsIFtdXG4jIFByZXBhcmUgZm9yIGZpcnN0IGNlbGwgaW5zZXJ0aW9uXG4gIHBvcHVsYXRpb24gPSBbXVxuICBoYWxmZGltZW5zaW9uU2l6ZSA9IGRpbWVuc2lvblNpemUgLyAyXG4gIHN1YnN0YXRlID0gc3RhdGVcbiAgY2VsbFBhdGggPSBbXVxuICBkID0gZGltZW5zaW9uTnVtXG4gIHdoaWxlKC0tZClcbiAgICBjZWxsUGF0aC5wdXNoIGhhbGZkaW1lbnNpb25TaXplXG4gICAgc3Vic3RhdGUgPSBzdWJzdGF0ZVtoYWxmZGltZW5zaW9uU2l6ZV1cbiAgY2VsbFBhdGgucHVzaCBoYWxmZGltZW5zaW9uU2l6ZVxuICBwb3B1bGF0aW9uLnB1c2ggY2VsbFBhdGhcbiMgRmluYWxseVxuICBzdWJzdGF0ZVtoYWxmZGltZW5zaW9uU2l6ZV0uaXNBbGl2ZSA9IHRydWVcblxuICBpbnNlcnRBbm90aGVyT25lID0gKCktPlxuICAgIGNlbGxQYXRoID0gY2xvbmUgcG9wdWxhdGlvbltyYW5kb20gcG9wdWxhdGlvbi5sZW5ndGhdXG4gICMgU2hpZnQgaXRcbiAgICBzaGlmdHNOdW1iZXIgPSAocmFuZG9tIGRpbWVuc2lvbk51bSkgKyAxXG4gICAgd2hpbGUoc2hpZnRzTnVtYmVyLS0pXG4gICAgICBjZWxsUGF0aFtyYW5kb20gZGltZW5zaW9uTnVtXSs9IGlmIHJhbmRvbSgyKSB0aGVuIDEgZWxzZSAtMTtcbiAgIyBQdXNoIGl0XG4gICAgc3Vic3RhdGUgPSBzdGF0ZVxuICAgIGQgPSBkaW1lbnNpb25OdW1cbiAgICB3aGlsZSgtLWQpXG4gICAgICBzdWJzdGF0ZSA9IHN1YnN0YXRlW2NlbGxQYXRoW2RpbWVuc2lvbk51bSAtIGQgLSAxXV1cbiAgICBhbHJlYWR5RXhpc3RzID0gc3Vic3RhdGVbY2VsbFBhdGhbY2VsbFBhdGgubGVuZ3RoIC0gMV1dLmlzQWxpdmVcbiAgICBpZiBhbHJlYWR5RXhpc3RzXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICBlbHNlXG4gICAgICBzdWJzdGF0ZVtjZWxsUGF0aFtjZWxsUGF0aC5sZW5ndGggLSAxXV0uaXNBbGl2ZSA9IHRydWVcbiAgICAgIHBvcHVsYXRpb24ucHVzaCBjZWxsUGF0aFxuICAgICAgcmV0dXJuIHRydWVcblxuICB3aGlsZSgtLXBvcHVsYXRpb25TaXplKVxuICAgIHdoaWxlKCFpbnNlcnRBbm90aGVyT25lKCkpXG4gICAgICBjb25zb2xlLmxvZyAnQ2VsbCBhbHJlYWR5IGV4aXN0cywgcmVzcGF3bmluZy4nXG4gIHN0YXRlLmluaXRpYWwgPSBwb3B1bGF0aW9uXG4gIHN0YXRlLnBhcmFtcyA9IGFyZ3VtZW50c1xuICByZXR1cm4gc3RhdGVcbiIsImlucHV0ID0gcmVxdWlyZSAnLi9pbnB1dC5jb2ZmZWUnXG5vdXRwdXQgPSByZXF1aXJlICcuL291dHB1dC5jb2ZmZWUnXG5wcm9jZXNzID0gcmVxdWlyZSAnLi9wcm9jZXNzLmNvZmZlZSdcblxuc2V0ID0gW11cbmJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdXG5mb3IgaSBpbiBbMC4uLjhdXG4gIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdkaXYnXG4gIGJvZHkuYXBwZW5kQ2hpbGQgZWxlbWVudFxuICBlbGVtZW50LnNldEF0dHJpYnV0ZSAnaWQnLCAnc3BlY2ltZW4nICsgaVxuICBlbGVtZW50LnNldEF0dHJpYnV0ZSAnY2xhc3MnLCAncG9wdWxhdGlvbidcbiAgZ2VuZXJhdGVkU3RhdGUgPSBpbnB1dCAyLCAzMiwgMzJcbiAgc3BlY2ltZW4gPVxuICAgIHN0YXRlczogW2dlbmVyYXRlZFN0YXRlXVxuICAgIHN0YXR1czogJ2FsaXZlJ1xuICAgIHBhcmFtczogZ2VuZXJhdGVkU3RhdGUucGFyYW1zXG4gICAgaW5pdGlhbDogZ2VuZXJhdGVkU3RhdGUuaW5pdGlhbFxuICAgIGVsZW1lbnQ6IGVsZW1lbnRcbiAgICBhZ2U6IDBcbiAgc3RyID0gJzxkaXYgY2xhc3M9XCJkaW1lbnNpb25cIj4nXG4gIGZvciByb3cgaW4gZ2VuZXJhdGVkU3RhdGVcbiAgICBzdHIgKz0gJzxkaXYgY2xhc3M9XCJyb3dcIj4nXG4gICAgaSA9IHNwZWNpbWVuLnBhcmFtc1sxXVxuICAgIHdoaWxlKGktLSlcbiAgICAgIHN0ciArPSAnPGRpdiBjbGFzcz1cImNlbGwnICtcbiAgICAgICAgKGlmIHJvd1tpXS5pc0FsaXZlIHRoZW4gJyBhbGl2ZScgZWxzZSAnJykgK1xuICAgICAgICAgJ1wiPjwvZGl2PidcbiAgICBzdHIgKz0gJzwvZGl2PidcbiAgc3BlY2ltZW4uZWxlbWVudC5pbm5lckhUTUwrPSBzdHIgKyAnPC9kaXY+J1xuICBkZWxldGUgZ2VuZXJhdGVkU3RhdGUucGFyYW1zXG4gIGRlbGV0ZSBnZW5lcmF0ZWRTdGF0ZS5pbml0aWFsXG4gIHNldC5wdXNoIHNwZWNpbWVuXG5fc2V0ID0gW11cblxuaW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwgLT5cbiAgaXNBbGxEb25lID0gdHJ1ZVxuICBmb3Igc3BlY2ltZW4sIGkgaW4gc2V0XG4gICAgaXNBbGxEb25lID0gZmFsc2VcbiAgICBpZiBzcGVjaW1lbi5zdGF0dXMgaXMgJ2FsaXZlJ1xuICAgICAgcHJvY2VzcyBzcGVjaW1lblxuICAgICAgb3V0cHV0IHNwZWNpbWVuLnN0YXRlc1tzcGVjaW1lbi5zdGF0ZXMubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgICBzcGVjaW1lbi5lbGVtZW50LFxuICAgICAgICAgICAgc3BlY2ltZW4ucGFyYW1zWzFdLFxuICAgICAgICAgICAgc3BlY2ltZW4uY2VsbHNUb1RvZ2dsZVxuICAgIGVsc2VcbiAgICAgIHNwZWNpbWVuLmVsZW1lbnQuaW5uZXJIVE1MKz0gJzxkaXYgY2xhc3M9XCJzdGF0dXNcIj48aDE+JyArXG4gICAgICAgIHNwZWNpbWVuLnN0YXR1cyArXG4gICAgICAgICc8L2gxPjxoMz5hZ2U6ICcrXG4gICAgICAgIHNwZWNpbWVuLmFnZStcbiAgICAgICAgJzwvaDM+PC9kaXY+J1xuICAgICAgX3NldC5wdXNoIHNwZWNpbWVuXG4gICAgICBpID0gc2V0LmluZGV4T2Ygc3BlY2ltZW5cbiAgICAgIHNldC5zcGxpY2UgaSwgMVxuICAgICAgYnJlYWtcblxuICBpZiBpc0FsbERvbmVcbiAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCBpbnRlcnZhbFxuLCAxMDBcbiJdfQ==
;