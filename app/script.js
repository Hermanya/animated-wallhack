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
    halfdimensionSize = ~~(dimensionSize / 2);
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
  var body, byId, cellNumber, dimensionNumber, dimensionSize, init, input, interval, intervalFunction, output, process, set, specimenNumber;

  input = require('./input.coffee');

  output = require('./output.coffee');

  process = require('./process.coffee');

  set = [];

  body = document.getElementsByTagName('main')[0];

  byId = function(x) {
    return document.getElementById(x);
  };

  specimenNumber = byId('specimen-number');

  dimensionNumber = byId('dimension-number');

  cellNumber = byId('cell-number');

  dimensionSize = byId('dimension-size');

  interval = null;

  intervalFunction = null;

  init = function() {
    var cellsToToggle, element, generatedState, i, j, path, projectionNum, row, specimen, str, _i, _j, _k, _l, _len, _len1, _len2, _m, _ref, _ref1, _set;
    set = [];
    body.innerHTML = '';
    for (i = _i = 0, _ref = specimenNumber.value; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      element = document.createElement('div');
      body.appendChild(element);
      element.setAttribute('id', 'specimen' + i);
      element.setAttribute('class', 'population');
      generatedState = input(parseInt(dimensionNumber.value), dimensionSize.value, cellNumber.value);
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
      _ref1 = specimen.initial;
      for (_m = 0, _len2 = _ref1.length; _m < _len2; _m++) {
        path = _ref1[_m];
        cellsToToggle.push({
          path: path
        });
      }
      output(specimen.states[specimen.states.length - 1], specimen.element, specimen.params[1], cellsToToggle, specimen.params[0]);
    }
    intervalFunction = function() {
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
        return init();
      }
    };
    return interval = window.setInterval(intervalFunction, 100);
  };

  init();

  byId('apply').addEventListener('click', function() {
    window.clearInterval(interval);
    return init();
  });

  byId('stop').addEventListener('click', function() {
    if (interval) {
      window.clearInterval(interval);
      this.innerHTML = 'continue';
      return interval = void 0;
    } else {
      interval = window.setInterval(intervalFunction, 100);
      return this.innerHTML = 'stop';
    }
  });

}).call(this);


})()
},{"./input.coffee":4,"./output.coffee":1,"./process.coffee":2}]},{},[4,5,1,2,3])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvbGlmZS9fYXBwL291dHB1dC5jb2ZmZWUiLCIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvbGlmZS9fYXBwL3Byb2Nlc3MuY29mZmVlIiwiL2hvbWUvaGVybWFuL2V4cGVyaW1lbnRzL2xpZmUvX2FwcC9yYW5kb20uY29mZmVlIiwiL2hvbWUvaGVybWFuL2V4cGVyaW1lbnRzL2xpZmUvX2FwcC9pbnB1dC5jb2ZmZWUiLCIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvbGlmZS9fYXBwL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtDQUFBLENBQUEsQ0FBaUIsQ0FBQSxDQUFBLENBQVgsQ0FBTixFQUFrQixJQUFEO0NBQ2YsT0FBQSw4REFBQTtDQUFBLFdBQU8sQ0FBUDtDQUFBLFVBQ087Q0FDSyxFQUFZLElBQWIsRUFBUCxNQUFBO0NBRkosVUFHTztBQUNILENBQUE7Y0FBQSxzQ0FBQTtvQ0FBQTtDQUNFLEVBQUksSUFBTyxHQUFYO0NBQUEsRUFDSSxPQUFKO0NBREEsRUFFSSxDQUFpQixNQUFyQjtDQUZBLEVBR0ksQ0FBaUIsTUFBckI7Q0FIQSxLQUlBLENBQUEsRUFBVztDQUxiO3lCQUpKO0NBR087Q0FIUDtDQVdJLENBQWtCLENBQVIsRUFBQSxFQUFWLENBQUEsQ0FBVztDQUNULGFBQUEsWUFBQTtBQUFBLENBQUE7R0FBQSxhQUFXLDhEQUFYO0NBQ0U7O0FBQUEsQ0FBQTtHQUFBLGlCQUFjLGdFQUFkO0NBQ0UsQ0FBaUIsQ0FBakIsR0FBQSxDQUFPLFNBQVA7QUFDd0IsQ0FEeEIsRUFDSSxFQUFzQixFQUFmLEdBQVksTUFBdkI7Q0FEQSxFQUVJLEVBQWEsS0FBQSxNQUFqQjtDQUZBLEVBR0ksT0FBYSxNQUFqQjtDQUhBLEVBSUksR0FBYSxJQUFBLE1BQWpCO0NBQ0EsRUFBUyxDQUFOLENBQU0sQ0FBSyxDQUFkLFNBQUE7Q0FDRSxFQUFBLElB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ZSxFQUFmLEdBQUE7TUFGRixJQUFBO0NBUUUsRUFBNkIsR0FBQSxDQUFiLENBQVIsQ0FBUixDQUFBLEdBQTZCLEdBQUEsVUFBQTtDQUE3QixHQU1JLElBQUosRUFBQTtDQU5BLEVBT0ksSUFBQSxDQUFBLEVBQUo7Q0FQQSxDQVFjLENBQVgsR0FBSCxJQUFBO0NBQ0EsZUFqQkY7VUFGRjtDQUFBLE1BREE7Q0FzQkEsR0FBRyxFQUFILEdBQUE7Q0FDRSxLQUFNLEVBQU4sS0FBQTtDQUNBLEdBQUEsV0FBQTtRQXpCZTtDQWpEbkIsSUFpRG1CO0NBMEJELENBQThCLENBQXJDLEdBQU0sRUFBakIsR0FBQSxLQUFXO0NBekZiLEVBYU87O0NBYlAsQ0EwRkEsRUFBQTs7Q0ExRkEsQ0EyRkEsQ0FBd0MsQ0FBeEMsR0FBQSxFQUF3QyxPQUF4QztDQUNFLEdBQUEsRUFBTSxFQUFOLEtBQUE7Q0FBZ0MsR0FBQSxPQUFBO0NBRGxDLEVBQXdDOztDQTNGeEMsQ0E2RkEsQ0FBdUMsQ0FBdkMsRUFBQSxDQUFBLEVBQXVDLE9BQXZDO0NBQ0UsR0FBQSxJQUFBO0NBQ0UsS0FBQSxFQUFBLEtBQUE7Q0FBQSxFQUNpQixDQUFiLEVBQUosR0FBQSxDQURBO0NBREYsRUFHYSxLQUFYLEtBQUE7TUFIRjtDQUtFLENBQWdELENBQXJDLEdBQVgsRUFBQSxHQUFXLEtBQUE7Q0FDTixFQUFZLENBQWIsS0FBSixJQUFBO01BUG1DO0NBQXZDLEVBQXVDO0NBN0Z2QyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gKHN0YXRlLCBlbGVtZW50LCBzaXplLCBjZWxsc1RvVG9nZ2xlLCBwcm9qZWN0aW9uTnVtKSAtPlxuICBzd2l0Y2ggcHJvamVjdGlvbk51bVxuICAgIHdoZW4gMVxuICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSAnVGhpcyBzdGF0ZSBpcyB1bnJlbmRlcmFibGUhIFNlZSBjb25zb2xlIG91dHB1dC4nXG4gICAgd2hlbiAyXG4gICAgICBmb3IgY2VsbCBpbiBjZWxsc1RvVG9nZ2xlXG4gICAgICAgIHggPSBlbGVtZW50LmNoaWxkTm9kZXNbMF1cbiAgICAgICAgeCA9IHguY2hpbGROb2Rlc1swXVxuICAgICAgICB4ID0geC5jaGlsZE5vZGVzW2NlbGwucGF0aFswXV1cbiAgICAgICAgeCA9IHguY2hpbGROb2Rlc1tjZWxsLnBhdGhbMV1dXG4gICAgICAgIHguY2xhc3NMaXN0LnRvZ2dsZSAnYWxpdmUnXG4gICAgZWxzZVxuICAgICAgcHJvamVjdCA9IChzdGF0ZSwgaW5kZXgpIC0+XG4gICAgICAgIGZvciByb3cgaW4gWzAuLi5zaXplXVxuICAgICAgICAgIGZvciBjb2x1bW4gaW4gWzAuLi5zaXplXVxuICAgICAgICAgICAgY29uc29sZS5sb2cgcm93LCBjb2x1bW5cbiAgICAgICAgICAgIHggPSBlbGVtZW50LmNoaWxkTm9kZXNbfn4oaW5kZXggLyAyKV1cbiAgICAgICAgICAgIHggPSB4LmNoaWxkTm9kZXNbaW5kZXggJSAyXVxuICAgICAgICAgICAgeCA9IHguY2hpbGROb2Rlc1tyb3ddXG4gICAgICAgICAgICB4ID0geC5jaGlsZE5vZGVzW2NvbHVtbl1cbiAgICAgICAgICAgIGlmIHN0YXRlW3Jvd11bY29sdW1uXS5pc0FsaXZlXG4gICAgICAgICAgICAgIHguY2xhc3NMaXN0LmFkZCAnYWxpdmUnXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHguY2xhc3NMaXN0LnJlbW92ZSAnYWxpdmUnXG4gICAgICByZWR1Y2UgPSAoc3RhdGUsIHByb2plY3Rpb25JbmRleCkgLT5cbiAgICAgICAgIyMjXG4gICAgICAgICAgZmlyc3QgcmVkdWNlIGxlYXZlcyB1bnRpbCBkZWVwbmVzcyBpcyBwcm9qZWN0aW9uIEluZGV4ICsgMVxuICAgICAgICAgIHRoZW4gc2tpcCAyXG4gICAgICAgICAgdGhlbiBtZXJnZSAyIGRpbWVuc2lvbmFsIG1hdHJpY2VzXG4gICAgICAgICMjI1xuICAgICAgICBtZXJnZTEgPSAoYXJyYXkpIC0+XG4gICAgICAgICAgZm9yIGogaW4gWzAuLi5zaXplXVxuICAgICAgICAgICAgYXJyYXlbMF1bal0ucGF0aC5zcGxpY2UoLTIsMSlcbiAgICAgICAgICAgIGZvciBrIGluIFsxLi4uc2l6ZV1cbiAgICAgICAgICAgICAgaWYgYXJyYXlbMF1bal0uaXNBbGl2ZVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBhcnJheVswXVtqXS5pc0FsaXZlID0gYXJyYXlba11bal0uaXNBbGl2ZVxuICAgICAgICAgIHJldHVybiBhcnJheVswXVxuICAgICAgICBtZXJnZTIgPSAoYXJyYXkpIC0+XG4gICAgICAgICAgZm9yIGkgaW4gWzAuLi5zaXplXVxuICAgICAgICAgICAgZm9yIGogaW4gWzAuLi5zaXplXVxuICAgICAgICAgICAgICBhcnJheVswXVtpXVtqXS5wYXRoLnNwbGljZSgtMywxKVxuICAgICAgICAgICAgICBmb3IgayBpbiBbMS4uLnNpemVdXG4gICAgICAgICAgICAgICAgaWYgKGFycmF5WzBdW2ldW2pdLmlzQWxpdmUpXG4gICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgIGFycmF5WzBdW2ldW2pdLmlzQWxpdmUgPSBhcnJheVtrXVtpXVtqXS5pc0FsaXZlXG4gICAgICAgICAgcmV0dXJuIGFycmF5WzBdXG4gICAgICAgIG1lcmdlID0gKGFycmF5KSAtPlxuICAgICAgICAgIHZhbHVlID0gYXJyYXkucmVkdWNlICgoYSwgYykgLT4gaWYgYy5pc0FsaXZlIHRoZW4gYSArIDEgZWxzZSBhKSwgMFxuICAgICAgICAgIGFycmF5WzBdLnBhdGgucG9wKClcbiAgICAgICAgICByZWR1Y2VkQ2VsbCA9IGlzQWxpdmU6ICEhdmFsdWUsIHBhdGg6IGFycmF5WzBdLnBhdGhcbiAgICAgICAgICByZXR1cm4gcmVkdWNlZENlbGxcbiAgICAgICAgaXRlciA9IChkaW1lbnNpb25zLCBkZWVwbmVzcykgLT5cbiAgICAgICAgICBpZiBkaW1lbnNpb25zLnBhdGggIyBpcyBsYXN0IGRpbWVuc2lvblxuICAgICAgICAgICAgcmV0dXJuIGRpbWVuc2lvbnNcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgIyBwb3AgZXZlcnkgcmVkdWNlXG4gICAgICAgICAgIyBpcyBnb29kPyByZXR1cm4gYXJyYXksIGVsc2UgbWVyZ2UgZGVwZW5kZW50IG9uIG51bWJlciBvZiBnb29kXG4gICAgICAgICAgIyBpcyBhcnJheSBvZiBwYmtlY3RzLiBlbGVzZSBhcnJheSBvZiBhcnJheXNcbiAgICAgICAgICAgIGFycmF5ID0gW11cbiAgICAgICAgICAgIGZvciBpIGluIFswLi4uc2l6ZV1cbiAgICAgICAgICAgICAgYXJyYXkucHVzaCBpdGVyIGRpbWVuc2lvbnNbaV0sIGRlZXBuZXNzICsgMVxuICAgICAgICAgICAgaWYgZGVlcG5lc3MgaXMgcHJvamVjdGlvbkluZGV4IG9yIGRlZXBuZXNzIGlzIChwcm9qZWN0aW9uSW5kZXggKyAxKSAlIHByb2plY3Rpb25OdW1cbiAgICAgICAgICAgICAgcmV0dXJuIGFycmF5XG4gICAgICAgICAgICBpZiBhcnJheVswXS5wYXRoXG4gICAgICAgICAgICAgIHJldHVybiBtZXJnZSBhcnJheVxuICAgICAgICAgICAgaWYgYXJyYXlbMF1bMF0ucGF0aFxuICAgICAgICAgICAgICByZXR1cm4gbWVyZ2UxIGFycmF5XG4gICAgICAgICAgICBpZiBhcnJheVswXVswXVswXS5wYXRoXG4gICAgICAgICAgICAgIHJldHVybiBtZXJnZTIgYXJyYXlcbiAgICAgICAgaXRlciBzdGF0ZSwgMFxuICAgICAgZm9yIGkgaW4gWzAuLi5wcm9qZWN0aW9uTnVtXVxuICAgICAgICBfc3RhdGUgPSBKU09OLnBhcnNlIEpTT04uc3RyaW5naWZ5IHN0YXRlXG4gICAgICAgIHByb2plY3QgKHJlZHVjZSBfc3RhdGUsIGkpLCBpXG4gICAgI2VsZW1lbnQuaW5uZXJIVE1MID0gJ1RoaXMgc3RhdGUgaXMgdW5yZW5kZXJhYmxlISBTZWUgY29uc29sZSBvdXRwdXQuJ1xuIyMjXG4gICAgUHJvamVjdCBtdWx0aS1kaW1lbnNpb25hbCBzdGF0ZXMgdG8gMkRcbiAgICBlLmcuIHN0YXRlW2ldW2pdW3JlZHVjZWRdLi5bc3RhdGVzXVxuIyMjXG4iLCJtb2R1bGUuZXhwb3J0cyA9IChzcGVjaW1lbikgLT5cbiAgY2xvbmUgPSAob2JqZWN0KSAtPlxuICAgIG9iamVjdCA9IEpTT04uc3RyaW5naWZ5IG9iamVjdFxuICAgIHJldHVybiBKU09OLnBhcnNlIG9iamVjdFxuICBwcmV2aW91c1N0YXRlID0gc3BlY2ltZW4uc3RhdGVzW3NwZWNpbWVuLnN0YXRlcy5sZW5ndGggLSAxXVxuICBuZXdTdGF0ZSA9IGNsb25lIHByZXZpb3VzU3RhdGVcbiAgY2VsbHNUb1RvZ2dsZSA9IFtdXG4gIGRpbWVuc2lvblNpemUgPSBzcGVjaW1lbi5wYXJhbXNbMV1cbiAgZGltZW5zaW9uTnVtID0gc3BlY2ltZW4ucGFyYW1zWzBdXG4gIGsgPSAxIC8gOCAqIChNYXRoLnBvdygzLCBkaW1lbnNpb25OdW0pIC0gMSlcbiAgbmVzdGVkTWFwID0gKGRpbWVuc2lvbikgLT5cbiAgICBpZiBub3QgZGltZW5zaW9uWzBdLnBhdGhcbiAgICAgIGRpbWVuc2lvbi5tYXAgbmVzdGVkTWFwXG4gICAgZWxzZVxuICAgICAgZGltZW5zaW9uLm1hcCAoZ2l2ZW5DZWxsKSAtPlxuICAgICAgICBsaWZlQ291bnQgPSAwXG4gICAgICAgIHBhdGhUcmVlID0gKGRpbWVuc2lvbkluZGV4LCBfc3RhdGUpIC0+XG4gICAgICAgICAgaWYgbm90IF9zdGF0ZS5wYXRoXG4gICAgICAgICAgICBuZXh0SW5kZXggPSBkaW1lbnNpb25JbmRleCArIDFcbiAgICAgICAgICAgIGQgPSBkMSA9IGdpdmVuQ2VsbC5wYXRoW2RpbWVuc2lvbkluZGV4XVxuICAgICAgICAgICAgcGF0aFRyZWUgbmV4dEluZGV4LCBfc3RhdGVbZF1cbiAgICAgICAgICAgIGlmIGQgaXMgMFxuICAgICAgICAgICAgICBkID0gZGltZW5zaW9uU2l6ZVxuICAgICAgICAgICAgcGF0aFRyZWUgbmV4dEluZGV4LCBfc3RhdGVbZCAtIDFdXG4gICAgICAgICAgICBpZiBkMSBpcyBkaW1lbnNpb25TaXplIC0gMVxuICAgICAgICAgICAgICBkMSA9IC0xXG4gICAgICAgICAgICBwYXRoVHJlZSBuZXh0SW5kZXgsIF9zdGF0ZVtkMSArIDFdXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbmVpZ2hib3IgPSBfc3RhdGVcbiAgICAgICAgICAgIGlmIG5laWdoYm9yLmlzQWxpdmUgYW5kIChuZWlnaGJvci5wYXRoIGlzbnQgZ2l2ZW5DZWxsLnBhdGgpXG4gICAgICAgICAgICAgIGxpZmVDb3VudCsrXG4gICAgICAgIHBhdGhUcmVlIDAsIHByZXZpb3VzU3RhdGVcblxuICAgICAgICBpZiBnaXZlbkNlbGwuaXNBbGl2ZVxuICAgICAgICAgIGlmIGxpZmVDb3VudCA8IDIgKiBrIG9yIGxpZmVDb3VudCA+IDMgKiBrXG4gICAgICAgICAgICBjZWxsc1RvVG9nZ2xlLnB1c2ggZ2l2ZW5DZWxsXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiBsaWZlQ291bnQgaXMgMyAqIGtcbiAgICAgICAgICAgIGNlbGxzVG9Ub2dnbGUucHVzaCBnaXZlbkNlbGxcblxuICBuZXN0ZWRNYXAgcHJldmlvdXNTdGF0ZVxuXG4gIGZvciBjZWxsIGluIGNlbGxzVG9Ub2dnbGVcbiAgICBfc3RhdGUgPSBuZXdTdGF0ZVxuICAgIGZvciBpbmRleCBpbiBjZWxsLnBhdGhcbiAgICAgIF9zdGF0ZSA9IF9zdGF0ZVtpbmRleF1cbiAgICBfc3RhdGUuaXNBbGl2ZSA9ICEgX3N0YXRlLmlzQWxpdmVcblxuICBpZiBjZWxsc1RvVG9nZ2xlLmxlbmd0aCBpcyAwXG4gICAgc3BlY2ltZW4uc3RhdHVzID0gJ2RlYWQnXG4gICAgaWYgKEpTT04uc3RyaW5naWZ5KG5ld1N0YXRlKS5pbmRleE9mICd0cnVlJykgaXNudCAtMVxuICAgICAgc3BlY2ltZW4uc3RhdHVzID0gJ3N0aWxsJ1xuICBlbHNlXG4gICAgZm9yIHN0YXRlLCBpbmRleCBpbiBzcGVjaW1lbi5zdGF0ZXNcbiAgICAgIGlmIEpTT04uc3RyaW5naWZ5KG5ld1N0YXRlKSBpcyBKU09OLnN0cmluZ2lmeShzdGF0ZSlcbiAgICAgICAgc3BlY2ltZW4uc3RhdHVzID0gJ3BlcmlvZCAnICsgKHNwZWNpbWVuLnN0YXRlcy5sZW5ndGggLSBpbmRleClcbiAgc3BlY2ltZW4uYWdlKytcbiAgc3BlY2ltZW4uY2VsbHNUb1RvZ2dsZSA9IGNlbGxzVG9Ub2dnbGVcbiAgc3BlY2ltZW4uc3RhdGVzID0gW3ByZXZpb3VzU3RhdGUsIG5ld1N0YXRlXVxuICAjIyNcbiAjc3BlY2ltZW4uc3RhdGVzLnB1c2ggbmV3U3RhdGVcbiAgbnVtYmVyIG9mIHN1cnJvdW5kaW5nIGNlbGxzID0gMyBeIGRpbWVuc2lvbnMgLSAxXG4gICMjI1xuIiwibW9kdWxlLmV4cG9ydHMgPSAocmFuZ2UpIC0+XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYW5nZSlcbiIsInJhbmRvbSA9IHJlcXVpcmUgJy4vcmFuZG9tLmNvZmZlZSdcbm1vZHVsZS5leHBvcnRzID0gKGRpbWVuc2lvbk51bSwgZGltZW5zaW9uU2l6ZSwgcG9wdWxhdGlvblNpemUpIC0+XG4gIHN0YXRlID0gW11cblxuICBjbG9uZSA9IChvYmplY3QpIC0+XG4gICAgb2JqZWN0ID0gSlNPTi5zdHJpbmdpZnkgb2JqZWN0XG4gICAgcmV0dXJuIEpTT04ucGFyc2Ugb2JqZWN0XG5cbiAgaW5pdCA9IChzdWJzdGF0ZSwgZGltZW5zaW9uc0xlZnQsIHBhdGgpIC0+XG4gICAgaWYgKGRpbWVuc2lvbnNMZWZ0KVxuICAgICAgaSA9IGRpbWVuc2lvblNpemVcbiAgICAgIHdoaWxlKGktLSlcbiAgICAgICAgZGltZW5zaW9uUGF0aCA9IGNsb25lIHBhdGhcbiAgICAgICAgZGltZW5zaW9uUGF0aC5wdXNoKGkpXG4gICAgICAgIHN1YnN0YXRlW2ldID0gW11cbiAgICAgICAgaWYgKGRpbWVuc2lvbnNMZWZ0ID09IDEpXG4gICAgICAgICAgaiA9IGRpbWVuc2lvblNpemVcbiAgICAgICAgICB3aGlsZShqLS0pXG4gICAgICAgICAgICBjZWxsUGF0aCA9IGNsb25lIGRpbWVuc2lvblBhdGhcbiAgICAgICAgICAgIGNlbGxQYXRoLnB1c2goailcbiAgICAgICAgICAgIHN1YnN0YXRlW2ldW2pdID0gcGF0aDogY2VsbFBhdGhcbiAgICAgICAgaW5pdCBzdWJzdGF0ZVtpXSwgZGltZW5zaW9uc0xlZnQgLSAxLCBkaW1lbnNpb25QYXRoXG5cbiAgaW5pdCBzdGF0ZSwgZGltZW5zaW9uTnVtIC0gMSwgW11cbiMgUHJlcGFyZSBmb3IgZmlyc3QgY2VsbCBpbnNlcnRpb25cbiAgcG9wdWxhdGlvbiA9IFtdXG4gIGhhbGZkaW1lbnNpb25TaXplID0gfn4oZGltZW5zaW9uU2l6ZSAvIDIpXG4gIHN1YnN0YXRlID0gc3RhdGVcbiAgY2VsbFBhdGggPSBbXVxuICBkID0gZGltZW5zaW9uTnVtXG4gIHdoaWxlKC0tZClcbiAgICBjZWxsUGF0aC5wdXNoIGhhbGZkaW1lbnNpb25TaXplXG4gICAgc3Vic3RhdGUgPSBzdWJzdGF0ZVtoYWxmZGltZW5zaW9uU2l6ZV1cbiAgY2VsbFBhdGgucHVzaCBoYWxmZGltZW5zaW9uU2l6ZVxuICBwb3B1bGF0aW9uLnB1c2ggY2VsbFBhdGhcbiMgRmluYWxseVxuICBzdWJzdGF0ZVtoYWxmZGltZW5zaW9uU2l6ZV0uaXNBbGl2ZSA9IHRydWVcbiMgQnVnZ2dnZ2dnZ2dnZ2dnZ2dnc0B0b2RvXG4gIGluc2VydEFub3RoZXJPbmUgPSAtPlxuICAgIGNlbGxQYXRoID0gY2xvbmUgcG9wdWxhdGlvbltyYW5kb20gcG9wdWxhdGlvbi5sZW5ndGhdXG4gICMgU2hpZnQgaXRcbiAgICBzaGlmdHNOdW1iZXIgPSAocmFuZG9tIGRpbWVuc2lvbk51bSkgKyAxXG4gICAgd2hpbGUoc2hpZnRzTnVtYmVyLS0pXG4gICAgICBpID0gcmFuZG9tIGRpbWVuc2lvbk51bVxuICAgICAgaWYgcmFuZG9tIDJcbiAgICAgICAgY2VsbFBhdGhbaV0gPSAoY2VsbFBhdGhbaV0gKyAxKSAlIGRpbWVuc2lvblNpemVcbiAgICAgIGVsc2VcbiAgICAgICAgY2VsbFBhdGhbaV0gPSAoY2VsbFBhdGhbaV0gLSAxKVxuICAgICAgICBpZiBjZWxsUGF0aFtpXSBpcyAtMVxuICAgICAgICAgIGNlbGxQYXRoW2ldID0gZGltZW5zaW9uU2l6ZSAtIDFcbiAgIyBQdXNoIGl0XG4gICAgc3Vic3RhdGUgPSBzdGF0ZVxuICAgIGZvciBkIGluIFswLi4uZGltZW5zaW9uTnVtXVxuICAgICAgeCA9IGNlbGxQYXRoW2RdXG4gICAgICBpZiBzdWJzdGF0ZSBpcyB1bmRlZmluZWRcbiAgICAgICAgZGVidWdnZXJcbiAgICAgIHN1YnN0YXRlID0gc3Vic3RhdGVbeF1cbiAgICBpZiBzdWJzdGF0ZSBpcyB1bmRlZmluZWRcbiAgICAgIGRlYnVnZ2VyXG4gICAgYWxyZWFkeUV4aXN0cyA9IHN1YnN0YXRlLmlzQWxpdmVcbiAgICBpZiBhbHJlYWR5RXhpc3RzXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICBlbHNlXG4gICAgICBzdWJzdGF0ZS5pc0FsaXZlID0gdHJ1ZVxuICAgICAgcG9wdWxhdGlvbi5wdXNoIGNlbGxQYXRoXG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gIHdoaWxlKC0tcG9wdWxhdGlvblNpemUpXG4gICAgd2hpbGUoIWluc2VydEFub3RoZXJPbmUoKSlcbiAgICAgIGNvbnNvbGUubG9nICdDZWxsIGFscmVhZHkgZXhpc3RzLCByZXNwYXduaW5nLidcbiAgc3RhdGUuaW5pdGlhbCA9IHBvcHVsYXRpb25cbiAgc3RhdGUucGFyYW1zID0gYXJndW1lbnRzXG4gIHJldHVybiBzdGF0ZVxuIiwiaW5wdXQgPSByZXF1aXJlICcuL2lucHV0LmNvZmZlZSdcbm91dHB1dCA9IHJlcXVpcmUgJy4vb3V0cHV0LmNvZmZlZSdcbnByb2Nlc3MgPSByZXF1aXJlICcuL3Byb2Nlc3MuY29mZmVlJ1xuXG5zZXQgPSBbXVxuYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdtYWluJylbMF1cbmJ5SWQgPSAoeCkgLT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgeFxuc3BlY2ltZW5OdW1iZXIgPSBieUlkICdzcGVjaW1lbi1udW1iZXInXG5kaW1lbnNpb25OdW1iZXIgPSBieUlkICdkaW1lbnNpb24tbnVtYmVyJ1xuY2VsbE51bWJlciA9IGJ5SWQgJ2NlbGwtbnVtYmVyJ1xuZGltZW5zaW9uU2l6ZSA9IGJ5SWQgJ2RpbWVuc2lvbi1zaXplJ1xuaW50ZXJ2YWwgPSBudWxsXG5pbnRlcnZhbEZ1bmN0aW9uID0gbnVsbFxuaW5pdCA9IC0+XG4gIHNldCA9IFtdXG4gIGJvZHkuaW5uZXJIVE1MID0gJydcbiAgZm9yIGkgaW4gWzAuLi5zcGVjaW1lbk51bWJlci52YWx1ZV1cbiAgICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuICAgIGJvZHkuYXBwZW5kQ2hpbGQgZWxlbWVudFxuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlICdpZCcsICdzcGVjaW1lbicgKyBpXG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUgJ2NsYXNzJywgJ3BvcHVsYXRpb24nXG4gICAgZ2VuZXJhdGVkU3RhdGUgPSBpbnB1dCBwYXJzZUludChkaW1lbnNpb25OdW1iZXIudmFsdWUpLFxuICAgICAgZGltZW5zaW9uU2l6ZS52YWx1ZSxcbiAgICAgIGNlbGxOdW1iZXIudmFsdWVcbiAgICBzcGVjaW1lbiA9XG4gICAgICBzdGF0ZXM6IFtnZW5lcmF0ZWRTdGF0ZV1cbiAgICAgIHN0YXR1czogJ2FsaXZlJ1xuICAgICAgcGFyYW1zOiBnZW5lcmF0ZWRTdGF0ZS5wYXJhbXNcbiAgICAgIGluaXRpYWw6IGdlbmVyYXRlZFN0YXRlLmluaXRpYWxcbiAgICAgIGVsZW1lbnQ6IGVsZW1lbnRcbiAgICAgIGFnZTogMFxuICAgIHN0ciA9ICcnXG4gICAgcHJvamVjdGlvbk51bSA9IHNwZWNpbWVuLnBhcmFtc1swXVxuICAgIHByb2plY3Rpb25OdW0gPSAxIGlmIHByb2plY3Rpb25OdW0gaXMgMlxuICAgIGZvciBqIGluIFswLi4ucHJvamVjdGlvbk51bV1cbiAgICAgIGlmIChqICUgMiBpcyAwKVxuICAgICAgICBzdHIgKz0gJzxkaXYgY2xhc3M9XCJkaW1lbnNpb24tcGFpclwiPidcbiAgICAgIHN0ciArPSAnPGRpdiBjbGFzcz1cImRpbWVuc2lvblwiPidcbiAgICAgIGZvciByb3cgaW4gZ2VuZXJhdGVkU3RhdGVcbiAgICAgICAgc3RyICs9ICc8ZGl2IGNsYXNzPVwicm93XCI+J1xuICAgICAgICBpID0gc3BlY2ltZW4ucGFyYW1zWzFdXG4gICAgICAgIHdoaWxlKGktLSlcbiAgICAgICAgICBzdHIgKz0gJzxkaXYgY2xhc3M9XCJjZWxsXCI+PC9kaXY+J1xuICAgICAgICBzdHIgKz0gJzwvZGl2PidcbiAgICAgIHN0ciArPSAnPC9kaXY+J1xuICAgICAgaWYgKGogJSAyIGlzIDEpXG4gICAgICAgIHN0ciArPSAnPC9kaXY+J1xuICAgIHNwZWNpbWVuLmVsZW1lbnQuaW5uZXJIVE1MICs9IHN0clxuICAgIGRlbGV0ZSBnZW5lcmF0ZWRTdGF0ZS5wYXJhbXNcbiAgICBkZWxldGUgZ2VuZXJhdGVkU3RhdGUuaW5pdGlhbFxuICAgIHNldC5wdXNoIHNwZWNpbWVuXG4gIF9zZXQgPSBbXVxuXG4gIGZvciBzcGVjaW1lbiBpbiBzZXRcbiAgICBjZWxsc1RvVG9nZ2xlID0gW11cbiAgICBmb3IgcGF0aCBpbiBzcGVjaW1lbi5pbml0aWFsXG4gICAgICBjZWxsc1RvVG9nZ2xlLnB1c2gge3BhdGg6IHBhdGh9XG4gICAgb3V0cHV0IHNwZWNpbWVuLnN0YXRlc1tzcGVjaW1lbi5zdGF0ZXMubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgc3BlY2ltZW4uZWxlbWVudCxcbiAgICAgICAgICBzcGVjaW1lbi5wYXJhbXNbMV0sXG4gICAgICAgICAgY2VsbHNUb1RvZ2dsZSxcbiAgICAgICAgICBzcGVjaW1lbi5wYXJhbXNbMF1cblxuICBpbnRlcnZhbEZ1bmN0aW9uID0gLT5cbiAgICBpc0FsbERvbmUgPSB0cnVlXG4gICAgZm9yIHNwZWNpbWVuLCBpIGluIHNldFxuICAgICAgaXNBbGxEb25lID0gZmFsc2VcbiAgICAgIGlmIHNwZWNpbWVuLnN0YXR1cyBpcyAnYWxpdmUnXG4gICAgICAgIHByb2Nlc3Mgc3BlY2ltZW5cbiAgICAgICAgb3V0cHV0IHNwZWNpbWVuLnN0YXRlc1tzcGVjaW1lbi5zdGF0ZXMubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgICAgIHNwZWNpbWVuLmVsZW1lbnQsXG4gICAgICAgICAgICAgIHNwZWNpbWVuLnBhcmFtc1sxXSxcbiAgICAgICAgICAgICAgc3BlY2ltZW4uY2VsbHNUb1RvZ2dsZSxcbiAgICAgICAgICAgICAgc3BlY2ltZW4ucGFyYW1zWzBdXG4gICAgICBlbHNlXG4gICAgICAgIHNwZWNpbWVuLmVsZW1lbnQuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJzdGF0dXNcIj48aDE+JyArXG4gICAgICAgICAgc3BlY2ltZW4uc3RhdHVzICtcbiAgICAgICAgICAnPC9oMT48aDM+YWdlOiAnK1xuICAgICAgICAgIHNwZWNpbWVuLmFnZStcbiAgICAgICAgICAnPC9oMz48L2Rpdj4nK1xuICAgICAgICAgIHNwZWNpbWVuLmVsZW1lbnQuaW5uZXJIVE1MXG4gICAgICAgIF9zZXQucHVzaCBzcGVjaW1lblxuICAgICAgICBpID0gc2V0LmluZGV4T2Ygc3BlY2ltZW5cbiAgICAgICAgc2V0LnNwbGljZSBpLCAxXG4gICAgICAgIGJyZWFrXG5cbiAgICBpZiBpc0FsbERvbmVcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsIGludGVydmFsXG4gICAgICBpbml0KClcbiAgaW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwgaW50ZXJ2YWxGdW5jdGlvbiwgMTAwXG5pbml0KClcbmJ5SWQoJ2FwcGx5JykuYWRkRXZlbnRMaXN0ZW5lciAnY2xpY2snLCAtPlxuICB3aW5kb3cuY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7IGluaXQoKVxuYnlJZCgnc3RvcCcpLmFkZEV2ZW50TGlzdGVuZXIgJ2NsaWNrJywgLT5cbiAgaWYgaW50ZXJ2YWxcbiAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCBpbnRlcnZhbFxuICAgIHRoaXMuaW5uZXJIVE1MID0gJ2NvbnRpbnVlJ1xuICAgIGludGVydmFsID0gdW5kZWZpbmVkXG4gIGVsc2VcbiAgICBpbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbCBpbnRlcnZhbEZ1bmN0aW9uLCAxMDBcbiAgICB0aGlzLmlubmVySFRNTCA9ICdzdG9wJ1xuIl19
;