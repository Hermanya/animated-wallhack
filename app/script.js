;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0](function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function() {
  module.exports = function(state, element, size, cellsToToggle, projectionNum) {
    var cell, i, project, reduce, x, _i, _j, _len, _results, _results1, _state;
    switch (projectionNum) {
      case 1:
        return element.innerHTML = 'This state is unrenderable! See console output.';
      case 2:
        _results = [];
        for (_i = 0, _len = cellsToToggle.length; _i < _len; _i++) {
          cell = cellsToToggle[_i];
          x = element.childNodes[0];
          x = x.childNodes[0];
          x = x.childNodes[cell.path[0]];
          x = x.childNodes[cell.path[1]];
          _results.push(x.classList.toggle('alive'));
        }
        return _results;
        break;
      default:
        project = function(state, index) {
          var column, row, _j, _results1;
          _results1 = [];
          for (row = _j = 0; 0 <= size ? _j < size : _j > size; row = 0 <= size ? ++_j : --_j) {
            _results1.push((function() {
              var _k, _results2;
              _results2 = [];
              for (column = _k = 0; 0 <= size ? _k < size : _k > size; column = 0 <= size ? ++_k : --_k) {
                console.log(row, column);
                x = element.childNodes[~~(index / 2)];
                x = x.childNodes[index % 2];
                x = x.childNodes[row];
                x = x.childNodes[column];
                if (state[row][column].isAlive) {
                  _results2.push(x.classList.add('alive'));
                } else {
                  _results2.push(x.classList.remove('alive'));
                }
              }
              return _results2;
            })());
          }
          return _results1;
        };
        reduce = function(state, projectionIndex) {
          /*
            first reduce leaves until deepness is projection Index + 1
            then skip 2
            then merge 2 dimensional matrices
          */

          var iter, merge, merge1, merge2;
          merge1 = function(array) {
            var j, k, _j, _k;
            for (j = _j = 0; 0 <= size ? _j < size : _j > size; j = 0 <= size ? ++_j : --_j) {
              array[0][j].path.splice(-2, 1);
              for (k = _k = 1; 1 <= size ? _k < size : _k > size; k = 1 <= size ? ++_k : --_k) {
                if (array[0][j].isAlive) {
                  break;
                } else {
                  array[0][j].isAlive = array[k][j].isAlive;
                }
              }
            }
            return array[0];
          };
          merge2 = function(array) {
            var i, j, k, _j, _k, _l;
            for (i = _j = 0; 0 <= size ? _j < size : _j > size; i = 0 <= size ? ++_j : --_j) {
              for (j = _k = 0; 0 <= size ? _k < size : _k > size; j = 0 <= size ? ++_k : --_k) {
                array[0][i][j].path.splice(-3, 1);
                for (k = _l = 1; 1 <= size ? _l < size : _l > size; k = 1 <= size ? ++_l : --_l) {
                  if (array[0][i][j].isAlive) {
                    break;
                  } else {
                    array[0][i][j].isAlive = array[k][i][j].isAlive;
                  }
                }
              }
            }
            return array[0];
          };
          merge = function(array) {
            var reducedCell, value;
            value = array.reduce((function(a, c) {
              if (c.isAlive) {
                return a + 1;
              } else {
                return a;
              }
            }), 0);
            array[0].path.pop();
            reducedCell = {
              isAlive: !!value,
              path: array[0].path
            };
            return reducedCell;
          };
          iter = function(dimensions, deepness) {
            var array, i, _j;
            if (dimensions.path) {
              return dimensions;
            } else {
              array = [];
              for (i = _j = 0; 0 <= size ? _j < size : _j > size; i = 0 <= size ? ++_j : --_j) {
                array.push(iter(dimensions[i], deepness + 1));
              }
              if (deepness === projectionIndex || deepness === (projectionIndex + 1) % projectionNum) {
                return array;
              }
              if (array[0].path) {
                return merge(array);
              }
              if (array[0][0].path) {
                return merge1(array);
              }
              if (array[0][0][0].path) {
                return merge2(array);
              }
            }
          };
          return iter(state, 0);
        };
        _results1 = [];
        for (i = _j = 0; 0 <= projectionNum ? _j < projectionNum : _j > projectionNum; i = 0 <= projectionNum ? ++_j : --_j) {
          _state = JSON.parse(JSON.stringify(state));
          _results1.push(project(reduce(_state, i), i));
        }
        return _results1;
    }
  };

  /*
      Project multi-dimensional states to 2D
      e.g. state[i][j][reduced]..[states]
  */


}).call(this);


},{}],2:[function(require,module,exports){
(function() {
  module.exports = function(specimen) {
    var cell, cellsToToggle, clone, dimensionNum, dimensionSize, index, k, nestedMap, newState, previousState, state, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _state;
    clone = function(object) {
      object = JSON.stringify(object);
      return JSON.parse(object);
    };
    previousState = specimen.states[specimen.states.length - 1];
    newState = clone(previousState);
    cellsToToggle = [];
    dimensionSize = specimen.params[1];
    dimensionNum = specimen.params[0];
    k = 1 / 8 * (Math.pow(3, dimensionNum) - 1);
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
            if (lifeCount < 2 * k || lifeCount > 3 * k) {
              return cellsToToggle.push(givenCell);
            }
          } else {
            if (lifeCount === 3 * k) {
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
      var alreadyExists, i, shiftsNumber, x, _i;
      cellPath = clone(population[random(population.length)]);
      shiftsNumber = (random(dimensionNum)) + 1;
      while (shiftsNumber--) {
        i = random(dimensionNum);
        if (random(2)) {
          cellPath[i] = (cellPath[i] + 1) % dimensionSize;
        } else {
          cellPath[i] = cellPath[i] - 1;
          if (cellPath[i] === -1) {
            cellPath[i] = dimensionSize - 1;
          }
        }
      }
      substate = state;
      for (d = _i = 0; 0 <= dimensionNum ? _i < dimensionNum : _i > dimensionNum; d = 0 <= dimensionNum ? ++_i : --_i) {
        x = cellPath[d];
        if (substate === void 0) {
          debugger;
        }
        substate = substate[x];
      }
      if (substate === void 0) {
        debugger;
      }
      alreadyExists = substate.isAlive;
      if (alreadyExists) {
        return false;
      } else {
        substate.isAlive = true;
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
  var body, cellsToToggle, element, generatedState, i, input, interval, j, output, path, process, projectionNum, row, set, specimen, str, _i, _j, _k, _l, _len, _len1, _len2, _m, _ref, _set;

  input = require('./input.coffee');

  output = require('./output.coffee');

  process = require('./process.coffee');

  set = [];

  body = document.getElementsByTagName('body')[0];

  for (i = _i = 0; _i < 2; i = ++_i) {
    element = document.createElement('div');
    body.appendChild(element);
    element.setAttribute('id', 'specimen' + i);
    element.setAttribute('class', 'population');
    generatedState = input(2, 64, 16);
    specimen = {
      states: [generatedState],
      status: 'alive',
      params: generatedState.params,
      initial: generatedState.initial,
      element: element,
      age: 0
    };
    str = '';
    projectionNum = specimen.params[0];
    if (projectionNum === 2) {
      projectionNum = 1;
    }
    for (j = _j = 0; 0 <= projectionNum ? _j < projectionNum : _j > projectionNum; j = 0 <= projectionNum ? ++_j : --_j) {
      if (j % 2 === 0) {
        str += '<div class="dimension-pair">';
      }
      str += '<div class="dimension">';
      for (_k = 0, _len = generatedState.length; _k < _len; _k++) {
        row = generatedState[_k];
        str += '<div class="row">';
        i = specimen.params[1];
        while (i--) {
          str += '<div class="cell"></div>';
        }
        str += '</div>';
      }
      str += '</div>';
      if (j % 2 === 1) {
        str += '</div>';
      }
    }
    specimen.element.innerHTML += str;
    delete generatedState.params;
    delete generatedState.initial;
    set.push(specimen);
  }

  _set = [];

  for (_l = 0, _len1 = set.length; _l < _len1; _l++) {
    specimen = set[_l];
    cellsToToggle = [];
    _ref = specimen.initial;
    for (_m = 0, _len2 = _ref.length; _m < _len2; _m++) {
      path = _ref[_m];
      cellsToToggle.push({
        path: path
      });
    }
    output(specimen.states[specimen.states.length - 1], specimen.element, specimen.params[1], cellsToToggle, specimen.params[0]);
  }

  interval = window.setInterval(function() {
    var isAllDone, _len3, _n;
    isAllDone = true;
    for (i = _n = 0, _len3 = set.length; _n < _len3; i = ++_n) {
      specimen = set[i];
      isAllDone = false;
      if (specimen.status === 'alive') {
        process(specimen);
        output(specimen.states[specimen.states.length - 1], specimen.element, specimen.params[1], specimen.cellsToToggle, specimen.params[0]);
      } else {
        specimen.element.innerHTML = '<div class="status"><h1>' + specimen.status + '</h1><h3>age: ' + specimen.age + '</h3></div>' + specimen.element.innerHTML;
        _set.push(specimen);
        i = set.indexOf(specimen);
        set.splice(i, 1);
        break;
      }
    }
    if (isAllDone) {
      window.clearInterval(interval);
      return window.location.reload();
    }
  }, 100);

}).call(this);


})()
},{"./input.coffee":4,"./process.coffee":2,"./output.coffee":1}]},{},[4,5,1,2,3])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvbGlmZS9fYXBwL291dHB1dC5jb2ZmZWUiLCIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvbGlmZS9fYXBwL3Byb2Nlc3MuY29mZmVlIiwiL2hvbWUvaGVybWFuL2V4cGVyaW1lbnRzL2xpZmUvX2FwcC9yYW5kb20uY29mZmVlIiwiL2hvbWUvaGVybWFuL2V4cGVyaW1lbnRzL2xpZmUvX2FwcC9pbnB1dC5jb2ZmZWUiLCIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvbGlmZS9fYXBwL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtDQUFBLENBQUEsQ0FBaUIsQ0FBQSxDQUFBLENBQVgsQ0FBTixFQUFrQixJQUFEO0NBQ2YsT0FBQSw4REFBQTtDQUFBLFdBQU8sQ0FBUDtDQUFBLFVBQ087Q0FDSyxFQUFZLElBQWIsRUFBUCxNQUFBO0NBRkosVUFHTztBQUNILENBQUE7Y0FBQSxzQ0FBQTtvQ0FBQTtDQUNFLEVBQUksSUFBTyxHQUFYO0NBQUEsRUFDSSxPQUFKO0NBREEsRUFFSSxDQUFpQixNQUFyQjtDQUZBLEVBR0ksQ0FBaUIsTUFBckI7Q0FIQSxLQUlBLENBQUEsRUFBVztDQUxiO3lCQUpKO0NBR087Q0FIUDtDQVdJLENBQWtCLENBQVIsRUFBQSxFQUFWLENBQUEsQ0FBVztDQUNULGFBQUEsWUFBQTtBQUFBLENBQUE7R0FBQSxhQUFXLDhEQUFYO0NBQ0U7O0FBQUEsQ0FBQTtHQUFBLGlCQUFjLGdFQUFkO0NBQ0UsQ0FBaUIsQ0FBakIsR0FBQSxDQUFPLFNBQVA7QUFDd0IsQ0FEeEIsRUFDSSxFQUFzQixFQUFmLEdBQVksTUFBdkI7Q0FEQSxFQUVJLEVBQWEsS0FBQSxNQUFqQjtDQUZBLEVBR0ksT0FBYSxNQUFqQjtDQUhBLEVBSUksR0FBYSxJQUFBLE1BQWpCO0NBQ0EsRUFBUyxDQUFOLENBQU0sQ0FBSyxDQUFkLFNBQUE7Q0FDRSxFQUFBLElB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QkEsRUFBQSxRQUFxQjtBQUNyQixDQTlCQSxHQThCQSxFQUFBLENBOUJBLE9BOEJxQjtDQTlCckIsRUErQkcsQ0FBSCxJQUFBO0NBaENGLEVBTkE7O0NBQUEsQ0F1Q0EsQ0FBTyxDQUFQOztBQUVBLENBQUEsTUFBQSxxQ0FBQTt3QkFBQTtDQUNFLENBQUEsQ0FBZ0IsQ0FBaEIsU0FBQTtDQUNBO0NBQUEsUUFBQSxvQ0FBQTt1QkFBQTtDQUNFLEdBQUEsRUFBQSxPQUFhO0NBQU0sQ0FBTyxFQUFOLElBQUE7Q0FBcEIsT0FBQTtDQURGLElBREE7Q0FBQSxDQUlNLENBRDBDLENBQWhELEVBQUEsQ0FBQSxDQUFlLEtBQWY7Q0FKRixFQXpDQTs7Q0FBQSxDQW1EQSxDQUFXLEdBQU0sRUFBakIsQ0FBOEIsRUFBbkI7Q0FDVCxPQUFBLFlBQUE7Q0FBQSxFQUFZLENBQVosS0FBQTtBQUNBLENBQUEsUUFBQSwyQ0FBQTt5QkFBQTtDQUNFLEVBQVksRUFBWixDQUFBLEdBQUE7Q0FDQSxHQUFHLENBQW1CLENBQXRCLENBQUEsQ0FBVztDQUNULE1BQUEsQ0FBQTtDQUFBLENBRU0sQ0FEMEMsR0FBaEQsQ0FBQSxDQUFBLEtBQUE7TUFGRixFQUFBO0NBUUUsRUFBNkIsR0FBQSxDQUFiLENBQWhCLENBQUEsSUFBNkIsR0FBQSxVQUFBO0NBQTdCLEdBTUksSUFBSjtDQU5BLEVBT0ksSUFBQSxDQUFKO0NBUEEsQ0FRYyxDQUFYLEdBQUgsRUFBQTtDQUNBLGFBakJGO1FBRkY7Q0FBQSxJQURBO0NBc0JBLEdBQUEsS0FBQTtDQUNFLEtBQUEsRUFBQSxLQUFBO0NBQ08sS0FBRCxFQUFTLEtBQWY7TUF6QjBCO0NBQW5CLENBMEJULENBMUI0QjtDQW5EOUIiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IChzdGF0ZSwgZWxlbWVudCwgc2l6ZSwgY2VsbHNUb1RvZ2dsZSwgcHJvamVjdGlvbk51bSkgLT5cbiAgc3dpdGNoIHByb2plY3Rpb25OdW1cbiAgICB3aGVuIDFcbiAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gJ1RoaXMgc3RhdGUgaXMgdW5yZW5kZXJhYmxlISBTZWUgY29uc29sZSBvdXRwdXQuJ1xuICAgIHdoZW4gMlxuICAgICAgZm9yIGNlbGwgaW4gY2VsbHNUb1RvZ2dsZVxuICAgICAgICB4ID0gZWxlbWVudC5jaGlsZE5vZGVzWzBdXG4gICAgICAgIHggPSB4LmNoaWxkTm9kZXNbMF1cbiAgICAgICAgeCA9IHguY2hpbGROb2Rlc1tjZWxsLnBhdGhbMF1dXG4gICAgICAgIHggPSB4LmNoaWxkTm9kZXNbY2VsbC5wYXRoWzFdXVxuICAgICAgICB4LmNsYXNzTGlzdC50b2dnbGUgJ2FsaXZlJ1xuICAgIGVsc2VcbiAgICAgIHByb2plY3QgPSAoc3RhdGUsIGluZGV4KSAtPlxuICAgICAgICBmb3Igcm93IGluIFswLi4uc2l6ZV1cbiAgICAgICAgICBmb3IgY29sdW1uIGluIFswLi4uc2l6ZV1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nIHJvdywgY29sdW1uXG4gICAgICAgICAgICB4ID0gZWxlbWVudC5jaGlsZE5vZGVzW35+KGluZGV4IC8gMildXG4gICAgICAgICAgICB4ID0geC5jaGlsZE5vZGVzW2luZGV4ICUgMl1cbiAgICAgICAgICAgIHggPSB4LmNoaWxkTm9kZXNbcm93XVxuICAgICAgICAgICAgeCA9IHguY2hpbGROb2Rlc1tjb2x1bW5dXG4gICAgICAgICAgICBpZiBzdGF0ZVtyb3ddW2NvbHVtbl0uaXNBbGl2ZVxuICAgICAgICAgICAgICB4LmNsYXNzTGlzdC5hZGQgJ2FsaXZlJ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICB4LmNsYXNzTGlzdC5yZW1vdmUgJ2FsaXZlJ1xuICAgICAgcmVkdWNlID0gKHN0YXRlLCBwcm9qZWN0aW9uSW5kZXgpIC0+XG4gICAgICAgICMjI1xuICAgICAgICAgIGZpcnN0IHJlZHVjZSBsZWF2ZXMgdW50aWwgZGVlcG5lc3MgaXMgcHJvamVjdGlvbiBJbmRleCArIDFcbiAgICAgICAgICB0aGVuIHNraXAgMlxuICAgICAgICAgIHRoZW4gbWVyZ2UgMiBkaW1lbnNpb25hbCBtYXRyaWNlc1xuICAgICAgICAjIyNcbiAgICAgICAgbWVyZ2UxID0gKGFycmF5KSAtPlxuICAgICAgICAgIGZvciBqIGluIFswLi4uc2l6ZV1cbiAgICAgICAgICAgIGFycmF5WzBdW2pdLnBhdGguc3BsaWNlKC0yLDEpXG4gICAgICAgICAgICBmb3IgayBpbiBbMS4uLnNpemVdXG4gICAgICAgICAgICAgIGlmIGFycmF5WzBdW2pdLmlzQWxpdmVcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYXJyYXlbMF1bal0uaXNBbGl2ZSA9IGFycmF5W2tdW2pdLmlzQWxpdmVcbiAgICAgICAgICByZXR1cm4gYXJyYXlbMF1cbiAgICAgICAgbWVyZ2UyID0gKGFycmF5KSAtPlxuICAgICAgICAgIGZvciBpIGluIFswLi4uc2l6ZV1cbiAgICAgICAgICAgIGZvciBqIGluIFswLi4uc2l6ZV1cbiAgICAgICAgICAgICAgYXJyYXlbMF1baV1bal0ucGF0aC5zcGxpY2UoLTMsMSlcbiAgICAgICAgICAgICAgZm9yIGsgaW4gWzEuLi5zaXplXVxuICAgICAgICAgICAgICAgIGlmIChhcnJheVswXVtpXVtqXS5pc0FsaXZlKVxuICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICBhcnJheVswXVtpXVtqXS5pc0FsaXZlID0gYXJyYXlba11baV1bal0uaXNBbGl2ZVxuICAgICAgICAgIHJldHVybiBhcnJheVswXVxuICAgICAgICBtZXJnZSA9IChhcnJheSkgLT5cbiAgICAgICAgICB2YWx1ZSA9IGFycmF5LnJlZHVjZSAoKGEsIGMpIC0+IGlmIGMuaXNBbGl2ZSB0aGVuIGEgKyAxIGVsc2UgYSksIDBcbiAgICAgICAgICBhcnJheVswXS5wYXRoLnBvcCgpXG4gICAgICAgICAgcmVkdWNlZENlbGwgPSBpc0FsaXZlOiAhIXZhbHVlLCBwYXRoOiBhcnJheVswXS5wYXRoXG4gICAgICAgICAgcmV0dXJuIHJlZHVjZWRDZWxsXG4gICAgICAgIGl0ZXIgPSAoZGltZW5zaW9ucywgZGVlcG5lc3MpIC0+XG4gICAgICAgICAgaWYgZGltZW5zaW9ucy5wYXRoICMgaXMgbGFzdCBkaW1lbnNpb25cbiAgICAgICAgICAgIHJldHVybiBkaW1lbnNpb25zXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICMgcG9wIGV2ZXJ5IHJlZHVjZVxuICAgICAgICAgICMgaXMgZ29vZD8gcmV0dXJuIGFycmF5LCBlbHNlIG1lcmdlIGRlcGVuZGVudCBvbiBudW1iZXIgb2YgZ29vZFxuICAgICAgICAgICMgaXMgYXJyYXkgb2YgcGJrZWN0cy4gZWxlc2UgYXJyYXkgb2YgYXJyYXlzXG4gICAgICAgICAgICBhcnJheSA9IFtdXG4gICAgICAgICAgICBmb3IgaSBpbiBbMC4uLnNpemVdXG4gICAgICAgICAgICAgIGFycmF5LnB1c2ggaXRlciBkaW1lbnNpb25zW2ldLCBkZWVwbmVzcyArIDFcbiAgICAgICAgICAgIGlmIGRlZXBuZXNzIGlzIHByb2plY3Rpb25JbmRleCBvciBkZWVwbmVzcyBpcyAocHJvamVjdGlvbkluZGV4ICsgMSkgJSBwcm9qZWN0aW9uTnVtXG4gICAgICAgICAgICAgIHJldHVybiBhcnJheVxuICAgICAgICAgICAgaWYgYXJyYXlbMF0ucGF0aFxuICAgICAgICAgICAgICByZXR1cm4gbWVyZ2UgYXJyYXlcbiAgICAgICAgICAgIGlmIGFycmF5WzBdWzBdLnBhdGhcbiAgICAgICAgICAgICAgcmV0dXJuIG1lcmdlMSBhcnJheVxuICAgICAgICAgICAgaWYgYXJyYXlbMF1bMF1bMF0ucGF0aFxuICAgICAgICAgICAgICByZXR1cm4gbWVyZ2UyIGFycmF5XG4gICAgICAgIGl0ZXIgc3RhdGUsIDBcbiAgICAgIGZvciBpIGluIFswLi4ucHJvamVjdGlvbk51bV1cbiAgICAgICAgX3N0YXRlID0gSlNPTi5wYXJzZSBKU09OLnN0cmluZ2lmeSBzdGF0ZVxuICAgICAgICBwcm9qZWN0IChyZWR1Y2UgX3N0YXRlLCBpKSwgaVxuICAgICNlbGVtZW50LmlubmVySFRNTCA9ICdUaGlzIHN0YXRlIGlzIHVucmVuZGVyYWJsZSEgU2VlIGNvbnNvbGUgb3V0cHV0LidcbiMjI1xuICAgIFByb2plY3QgbXVsdGktZGltZW5zaW9uYWwgc3RhdGVzIHRvIDJEXG4gICAgZS5nLiBzdGF0ZVtpXVtqXVtyZWR1Y2VkXS4uW3N0YXRlc11cbiMjI1xuIiwibW9kdWxlLmV4cG9ydHMgPSAoc3BlY2ltZW4pIC0+XG4gIGNsb25lID0gKG9iamVjdCkgLT5cbiAgICBvYmplY3QgPSBKU09OLnN0cmluZ2lmeSBvYmplY3RcbiAgICByZXR1cm4gSlNPTi5wYXJzZSBvYmplY3RcbiAgcHJldmlvdXNTdGF0ZSA9IHNwZWNpbWVuLnN0YXRlc1tzcGVjaW1lbi5zdGF0ZXMubGVuZ3RoIC0gMV1cbiAgbmV3U3RhdGUgPSBjbG9uZSBwcmV2aW91c1N0YXRlXG4gIGNlbGxzVG9Ub2dnbGUgPSBbXVxuICBkaW1lbnNpb25TaXplID0gc3BlY2ltZW4ucGFyYW1zWzFdXG4gIGRpbWVuc2lvbk51bSA9IHNwZWNpbWVuLnBhcmFtc1swXVxuICBrID0gMSAvIDggKiAoTWF0aC5wb3coMywgZGltZW5zaW9uTnVtKSAtIDEpXG4gIG5lc3RlZE1hcCA9IChkaW1lbnNpb24pIC0+XG4gICAgaWYgbm90IGRpbWVuc2lvblswXS5wYXRoXG4gICAgICBkaW1lbnNpb24ubWFwIG5lc3RlZE1hcFxuICAgIGVsc2VcbiAgICAgIGRpbWVuc2lvbi5tYXAgKGdpdmVuQ2VsbCkgLT5cbiAgICAgICAgbGlmZUNvdW50ID0gMFxuICAgICAgICBwYXRoVHJlZSA9IChkaW1lbnNpb25JbmRleCwgX3N0YXRlKSAtPlxuICAgICAgICAgIGlmIG5vdCBfc3RhdGUucGF0aFxuICAgICAgICAgICAgbmV4dEluZGV4ID0gZGltZW5zaW9uSW5kZXggKyAxXG4gICAgICAgICAgICBkID0gZDEgPSBnaXZlbkNlbGwucGF0aFtkaW1lbnNpb25JbmRleF1cbiAgICAgICAgICAgIHBhdGhUcmVlIG5leHRJbmRleCwgX3N0YXRlW2RdXG4gICAgICAgICAgICBpZiBkIGlzIDBcbiAgICAgICAgICAgICAgZCA9IGRpbWVuc2lvblNpemVcbiAgICAgICAgICAgIHBhdGhUcmVlIG5leHRJbmRleCwgX3N0YXRlW2QgLSAxXVxuICAgICAgICAgICAgaWYgZDEgaXMgZGltZW5zaW9uU2l6ZSAtIDFcbiAgICAgICAgICAgICAgZDEgPSAtMVxuICAgICAgICAgICAgcGF0aFRyZWUgbmV4dEluZGV4LCBfc3RhdGVbZDEgKyAxXVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIG5laWdoYm9yID0gX3N0YXRlXG4gICAgICAgICAgICBpZiBuZWlnaGJvci5pc0FsaXZlIGFuZCAobmVpZ2hib3IucGF0aCBpc250IGdpdmVuQ2VsbC5wYXRoKVxuICAgICAgICAgICAgICBsaWZlQ291bnQrK1xuICAgICAgICBwYXRoVHJlZSAwLCBwcmV2aW91c1N0YXRlXG5cbiAgICAgICAgaWYgZ2l2ZW5DZWxsLmlzQWxpdmVcbiAgICAgICAgICBpZiBsaWZlQ291bnQgPCAyICogayBvciBsaWZlQ291bnQgPiAzICoga1xuICAgICAgICAgICAgY2VsbHNUb1RvZ2dsZS5wdXNoIGdpdmVuQ2VsbFxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgbGlmZUNvdW50IGlzIDMgKiBrXG4gICAgICAgICAgICBjZWxsc1RvVG9nZ2xlLnB1c2ggZ2l2ZW5DZWxsXG5cbiAgbmVzdGVkTWFwIHByZXZpb3VzU3RhdGVcblxuICBmb3IgY2VsbCBpbiBjZWxsc1RvVG9nZ2xlXG4gICAgX3N0YXRlID0gbmV3U3RhdGVcbiAgICBmb3IgaW5kZXggaW4gY2VsbC5wYXRoXG4gICAgICBfc3RhdGUgPSBfc3RhdGVbaW5kZXhdXG4gICAgX3N0YXRlLmlzQWxpdmUgPSAhIF9zdGF0ZS5pc0FsaXZlXG5cbiAgaWYgY2VsbHNUb1RvZ2dsZS5sZW5ndGggaXMgMFxuICAgIHNwZWNpbWVuLnN0YXR1cyA9ICdkZWFkJ1xuICAgIGlmIChKU09OLnN0cmluZ2lmeShuZXdTdGF0ZSkuaW5kZXhPZiAndHJ1ZScpIGlzbnQgLTFcbiAgICAgIHNwZWNpbWVuLnN0YXR1cyA9ICdzdGlsbCdcbiAgZWxzZVxuICAgIGZvciBzdGF0ZSwgaW5kZXggaW4gc3BlY2ltZW4uc3RhdGVzXG4gICAgICBpZiBKU09OLnN0cmluZ2lmeShuZXdTdGF0ZSkgaXMgSlNPTi5zdHJpbmdpZnkoc3RhdGUpXG4gICAgICAgIHNwZWNpbWVuLnN0YXR1cyA9ICdwZXJpb2QgJyArIChzcGVjaW1lbi5zdGF0ZXMubGVuZ3RoIC0gaW5kZXgpXG4gIHNwZWNpbWVuLmFnZSsrXG4gIHNwZWNpbWVuLmNlbGxzVG9Ub2dnbGUgPSBjZWxsc1RvVG9nZ2xlXG4gIHNwZWNpbWVuLnN0YXRlcyA9IFtwcmV2aW91c1N0YXRlLCBuZXdTdGF0ZV1cbiAgIyMjXG4gI3NwZWNpbWVuLnN0YXRlcy5wdXNoIG5ld1N0YXRlXG4gIG51bWJlciBvZiBzdXJyb3VuZGluZyBjZWxscyA9IDMgXiBkaW1lbnNpb25zIC0gMVxuICAjIyNcbiIsIm1vZHVsZS5leHBvcnRzID0gKHJhbmdlKSAtPlxuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFuZ2UpXG4iLCJyYW5kb20gPSByZXF1aXJlICcuL3JhbmRvbS5jb2ZmZWUnXG5tb2R1bGUuZXhwb3J0cyA9IChkaW1lbnNpb25OdW0sIGRpbWVuc2lvblNpemUsIHBvcHVsYXRpb25TaXplKSAtPlxuICBzdGF0ZSA9IFtdXG5cbiAgY2xvbmUgPSAob2JqZWN0KSAtPlxuICAgIG9iamVjdCA9IEpTT04uc3RyaW5naWZ5IG9iamVjdFxuICAgIHJldHVybiBKU09OLnBhcnNlIG9iamVjdFxuXG4gIGluaXQgPSAoc3Vic3RhdGUsIGRpbWVuc2lvbnNMZWZ0LCBwYXRoKSAtPlxuICAgIGlmIChkaW1lbnNpb25zTGVmdClcbiAgICAgIGkgPSBkaW1lbnNpb25TaXplXG4gICAgICB3aGlsZShpLS0pXG4gICAgICAgIGRpbWVuc2lvblBhdGggPSBjbG9uZSBwYXRoXG4gICAgICAgIGRpbWVuc2lvblBhdGgucHVzaChpKVxuICAgICAgICBzdWJzdGF0ZVtpXSA9IFtdXG4gICAgICAgIGlmIChkaW1lbnNpb25zTGVmdCA9PSAxKVxuICAgICAgICAgIGogPSBkaW1lbnNpb25TaXplXG4gICAgICAgICAgd2hpbGUoai0tKVxuICAgICAgICAgICAgY2VsbFBhdGggPSBjbG9uZSBkaW1lbnNpb25QYXRoXG4gICAgICAgICAgICBjZWxsUGF0aC5wdXNoKGopXG4gICAgICAgICAgICBzdWJzdGF0ZVtpXVtqXSA9IHBhdGg6IGNlbGxQYXRoXG4gICAgICAgIGluaXQgc3Vic3RhdGVbaV0sIGRpbWVuc2lvbnNMZWZ0IC0gMSwgZGltZW5zaW9uUGF0aFxuXG4gIGluaXQgc3RhdGUsIGRpbWVuc2lvbk51bSAtIDEsIFtdXG4jIFByZXBhcmUgZm9yIGZpcnN0IGNlbGwgaW5zZXJ0aW9uXG4gIHBvcHVsYXRpb24gPSBbXVxuICBoYWxmZGltZW5zaW9uU2l6ZSA9IGRpbWVuc2lvblNpemUgLyAyXG4gIHN1YnN0YXRlID0gc3RhdGVcbiAgY2VsbFBhdGggPSBbXVxuICBkID0gZGltZW5zaW9uTnVtXG4gIHdoaWxlKC0tZClcbiAgICBjZWxsUGF0aC5wdXNoIGhhbGZkaW1lbnNpb25TaXplXG4gICAgc3Vic3RhdGUgPSBzdWJzdGF0ZVtoYWxmZGltZW5zaW9uU2l6ZV1cbiAgY2VsbFBhdGgucHVzaCBoYWxmZGltZW5zaW9uU2l6ZVxuICBwb3B1bGF0aW9uLnB1c2ggY2VsbFBhdGhcbiMgRmluYWxseVxuICBzdWJzdGF0ZVtoYWxmZGltZW5zaW9uU2l6ZV0uaXNBbGl2ZSA9IHRydWVcbiMgQnVnZ2dnZ2dnZ2dnZ2dnZ2dnc0B0b2RvXG4gIGluc2VydEFub3RoZXJPbmUgPSAtPlxuICAgIGNlbGxQYXRoID0gY2xvbmUgcG9wdWxhdGlvbltyYW5kb20gcG9wdWxhdGlvbi5sZW5ndGhdXG4gICMgU2hpZnQgaXRcbiAgICBzaGlmdHNOdW1iZXIgPSAocmFuZG9tIGRpbWVuc2lvbk51bSkgKyAxXG4gICAgd2hpbGUoc2hpZnRzTnVtYmVyLS0pXG4gICAgICBpID0gcmFuZG9tIGRpbWVuc2lvbk51bVxuICAgICAgaWYgcmFuZG9tIDJcbiAgICAgICAgY2VsbFBhdGhbaV0gPSAoY2VsbFBhdGhbaV0gKyAxKSAlIGRpbWVuc2lvblNpemVcbiAgICAgIGVsc2VcbiAgICAgICAgY2VsbFBhdGhbaV0gPSAoY2VsbFBhdGhbaV0gLSAxKVxuICAgICAgICBpZiBjZWxsUGF0aFtpXSBpcyAtMVxuICAgICAgICAgIGNlbGxQYXRoW2ldID0gZGltZW5zaW9uU2l6ZSAtIDFcbiAgIyBQdXNoIGl0XG4gICAgc3Vic3RhdGUgPSBzdGF0ZVxuICAgIGZvciBkIGluIFswLi4uZGltZW5zaW9uTnVtXVxuICAgICAgeCA9IGNlbGxQYXRoW2RdXG4gICAgICBpZiBzdWJzdGF0ZSBpcyB1bmRlZmluZWRcbiAgICAgICAgZGVidWdnZXJcbiAgICAgIHN1YnN0YXRlID0gc3Vic3RhdGVbeF1cbiAgICBpZiBzdWJzdGF0ZSBpcyB1bmRlZmluZWRcbiAgICAgIGRlYnVnZ2VyXG4gICAgYWxyZWFkeUV4aXN0cyA9IHN1YnN0YXRlLmlzQWxpdmVcbiAgICBpZiBhbHJlYWR5RXhpc3RzXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICBlbHNlXG4gICAgICBzdWJzdGF0ZS5pc0FsaXZlID0gdHJ1ZVxuICAgICAgcG9wdWxhdGlvbi5wdXNoIGNlbGxQYXRoXG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gIHdoaWxlKC0tcG9wdWxhdGlvblNpemUpXG4gICAgd2hpbGUoIWluc2VydEFub3RoZXJPbmUoKSlcbiAgICAgIGNvbnNvbGUubG9nICdDZWxsIGFscmVhZHkgZXhpc3RzLCByZXNwYXduaW5nLidcbiAgc3RhdGUuaW5pdGlhbCA9IHBvcHVsYXRpb25cbiAgc3RhdGUucGFyYW1zID0gYXJndW1lbnRzXG4gIHJldHVybiBzdGF0ZVxuIiwiaW5wdXQgPSByZXF1aXJlICcuL2lucHV0LmNvZmZlZSdcbm91dHB1dCA9IHJlcXVpcmUgJy4vb3V0cHV0LmNvZmZlZSdcbnByb2Nlc3MgPSByZXF1aXJlICcuL3Byb2Nlc3MuY29mZmVlJ1xuXG5zZXQgPSBbXVxuYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF1cbmZvciBpIGluIFswLi4uMl1cbiAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2RpdidcbiAgYm9keS5hcHBlbmRDaGlsZCBlbGVtZW50XG4gIGVsZW1lbnQuc2V0QXR0cmlidXRlICdpZCcsICdzcGVjaW1lbicgKyBpXG4gIGVsZW1lbnQuc2V0QXR0cmlidXRlICdjbGFzcycsICdwb3B1bGF0aW9uJ1xuICBnZW5lcmF0ZWRTdGF0ZSA9IGlucHV0IDIsIDY0LCAxNlxuICBzcGVjaW1lbiA9XG4gICAgc3RhdGVzOiBbZ2VuZXJhdGVkU3RhdGVdXG4gICAgc3RhdHVzOiAnYWxpdmUnXG4gICAgcGFyYW1zOiBnZW5lcmF0ZWRTdGF0ZS5wYXJhbXNcbiAgICBpbml0aWFsOiBnZW5lcmF0ZWRTdGF0ZS5pbml0aWFsXG4gICAgZWxlbWVudDogZWxlbWVudFxuICAgIGFnZTogMFxuICBzdHIgPSAnJ1xuICBwcm9qZWN0aW9uTnVtID0gc3BlY2ltZW4ucGFyYW1zWzBdXG4gIHByb2plY3Rpb25OdW0gPSAxIGlmIHByb2plY3Rpb25OdW0gaXMgMlxuICBmb3IgaiBpbiBbMC4uLnByb2plY3Rpb25OdW1dXG4gICAgaWYgKGogJSAyIGlzIDApXG4gICAgICBzdHIgKz0gJzxkaXYgY2xhc3M9XCJkaW1lbnNpb24tcGFpclwiPidcbiAgICBzdHIgKz0gJzxkaXYgY2xhc3M9XCJkaW1lbnNpb25cIj4nXG4gICAgZm9yIHJvdyBpbiBnZW5lcmF0ZWRTdGF0ZVxuICAgICAgc3RyICs9ICc8ZGl2IGNsYXNzPVwicm93XCI+J1xuICAgICAgaSA9IHNwZWNpbWVuLnBhcmFtc1sxXVxuICAgICAgd2hpbGUoaS0tKVxuICAgICAgICBzdHIgKz0gJzxkaXYgY2xhc3M9XCJjZWxsXCI+PC9kaXY+J1xuICAgICAgc3RyICs9ICc8L2Rpdj4nXG4gICAgc3RyICs9ICc8L2Rpdj4nXG4gICAgaWYgKGogJSAyIGlzIDEpXG4gICAgICBzdHIgKz0gJzwvZGl2PidcbiAgc3BlY2ltZW4uZWxlbWVudC5pbm5lckhUTUwgKz0gc3RyXG4gIGRlbGV0ZSBnZW5lcmF0ZWRTdGF0ZS5wYXJhbXNcbiAgZGVsZXRlIGdlbmVyYXRlZFN0YXRlLmluaXRpYWxcbiAgc2V0LnB1c2ggc3BlY2ltZW5cbl9zZXQgPSBbXVxuXG5mb3Igc3BlY2ltZW4gaW4gc2V0XG4gIGNlbGxzVG9Ub2dnbGUgPSBbXVxuICBmb3IgcGF0aCBpbiBzcGVjaW1lbi5pbml0aWFsXG4gICAgY2VsbHNUb1RvZ2dsZS5wdXNoIHtwYXRoOiBwYXRofVxuICBvdXRwdXQgc3BlY2ltZW4uc3RhdGVzW3NwZWNpbWVuLnN0YXRlcy5sZW5ndGggLSAxXSxcbiAgICAgICAgc3BlY2ltZW4uZWxlbWVudCxcbiAgICAgICAgc3BlY2ltZW4ucGFyYW1zWzFdLFxuICAgICAgICBjZWxsc1RvVG9nZ2xlLFxuICAgICAgICBzcGVjaW1lbi5wYXJhbXNbMF1cblxuaW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwgLT5cbiAgaXNBbGxEb25lID0gdHJ1ZVxuICBmb3Igc3BlY2ltZW4sIGkgaW4gc2V0XG4gICAgaXNBbGxEb25lID0gZmFsc2VcbiAgICBpZiBzcGVjaW1lbi5zdGF0dXMgaXMgJ2FsaXZlJ1xuICAgICAgcHJvY2VzcyBzcGVjaW1lblxuICAgICAgb3V0cHV0IHNwZWNpbWVuLnN0YXRlc1tzcGVjaW1lbi5zdGF0ZXMubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgICBzcGVjaW1lbi5lbGVtZW50LFxuICAgICAgICAgICAgc3BlY2ltZW4ucGFyYW1zWzFdLFxuICAgICAgICAgICAgc3BlY2ltZW4uY2VsbHNUb1RvZ2dsZSxcbiAgICAgICAgICAgIHNwZWNpbWVuLnBhcmFtc1swXVxuICAgIGVsc2VcbiAgICAgIHNwZWNpbWVuLmVsZW1lbnQuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJzdGF0dXNcIj48aDE+JyArXG4gICAgICAgIHNwZWNpbWVuLnN0YXR1cyArXG4gICAgICAgICc8L2gxPjxoMz5hZ2U6ICcrXG4gICAgICAgIHNwZWNpbWVuLmFnZStcbiAgICAgICAgJzwvaDM+PC9kaXY+JytcbiAgICAgICAgc3BlY2ltZW4uZWxlbWVudC5pbm5lckhUTUxcbiAgICAgIF9zZXQucHVzaCBzcGVjaW1lblxuICAgICAgaSA9IHNldC5pbmRleE9mIHNwZWNpbWVuXG4gICAgICBzZXQuc3BsaWNlIGksIDFcbiAgICAgIGJyZWFrXG5cbiAgaWYgaXNBbGxEb25lXG4gICAgd2luZG93LmNsZWFySW50ZXJ2YWwgaW50ZXJ2YWxcbiAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiwgMTAwXG4iXX0=
;