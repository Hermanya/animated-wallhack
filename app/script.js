;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0](function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
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


},{}],2:[function(require,module,exports){
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
},{"./input.coffee":4,"./output.coffee":2,"./process.coffee":1}]},{},[4,5,1,2,3])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvbGlmZS9fYXBwL3Byb2Nlc3MuY29mZmVlIiwiL2hvbWUvaGVybWFuL2V4cGVyaW1lbnRzL2xpZmUvX2FwcC9vdXRwdXQuY29mZmVlIiwiL2hvbWUvaGVybWFuL2V4cGVyaW1lbnRzL2xpZmUvX2FwcC9yYW5kb20uY29mZmVlIiwiL2hvbWUvaGVybWFuL2V4cGVyaW1lbnRzL2xpZmUvX2FwcC9pbnB1dC5jb2ZmZWUiLCIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvbGlmZS9fYXBwL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtDQUFBLENBQUEsQ0FBaUIsR0FBWCxDQUFOLENBQWlCLENBQUM7Q0FDaEIsT0FBQSx5SkFBQTtDQUFBLEVBQVEsQ0FBUixDQUFBLENBQVEsR0FBQztDQUNQLEVBQVMsQ0FBSSxFQUFiLEdBQVM7Q0FDVCxHQUFXLENBQUosQ0FBQSxPQUFBO0NBRlQsSUFBUTtDQUFSLEVBR2dCLENBQWhCLEVBQWdDLEVBQVIsS0FBeEI7Q0FIQSxFQUlXLENBQVgsQ0FBVyxHQUFYLEtBQVc7Q0FKWCxDQUFBLENBS2dCLENBQWhCLFNBQUE7Q0FMQSxFQU1nQixDQUFoQixFQUFnQyxFQUFSLEtBQXhCO0NBTkEsRUFPZSxDQUFmLEVBQStCLEVBQVIsSUFBdkI7Q0FQQSxDQVF5QixDQUFyQixDQUFKLFFBQWE7Q0FSYixFQVNZLENBQVosS0FBQTtBQUNTLENBQVAsR0FBRyxFQUFILEdBQWlCO0NBQ0wsRUFBVixNQUFTLE1BQVQ7TUFERixFQUFBO0NBR1ksRUFBVixNQUFTLE1BQVQ7Q0FDRSxhQUFBLEtBQUE7Q0FBQSxFQUFZLE1BQVosQ0FBQTtDQUFBLENBQzRCLENBQWpCLEdBQUEsRUFBWCxDQUFZLENBQVosSUFBVztDQUNULGVBQUEsVUFBQTtBQUFPLENBQVAsR0FBRyxFQUFVLE1BQWI7Q0FDRSxFQUFZLE1BQVosS0FBQTtDQUFBLENBQ0ks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QUFlLEVBQWYsR0FBQTtNQUZGLElBQUE7Q0FRRSxFQUE2QixHQUFBLENBQWIsQ0FBUixDQUFSLENBQUEsR0FBNkIsR0FBQSxVQUFBO0NBQTdCLEdBTUksSUFBSixFQUFBO0NBTkEsRUFPSSxJQUFBLENBQUEsRUFBSjtDQVBBLENBUWMsQ0FBWCxHQUFILElBQUE7Q0FDQSxlQWpCRjtVQUZGO0NBQUEsTUFEQTtDQXNCQSxHQUFHLEVBQUgsR0FBQTtDQUNFLEtBQU0sRUFBTixLQUFBO0NBQ0EsR0FBQSxXQUFBO1FBekJlO0NBL0NuQixJQStDbUI7Q0EwQkQsQ0FBOEIsQ0FBckMsR0FBTSxFQUFqQixHQUFBLEtBQVc7Q0F2RmIsRUFhTzs7Q0FiUCxDQXdGQSxFQUFBOztDQXhGQSxDQXlGQSxDQUF3QyxDQUF4QyxHQUFBLEVBQXdDLE9BQXhDO0NBQ0UsR0FBQSxFQUFNLEVBQU4sS0FBQTtDQUFnQyxHQUFBLE9BQUE7Q0FEbEMsRUFBd0M7O0NBekZ4QyxDQTJGQSxDQUF1QyxDQUF2QyxFQUFBLENBQUEsRUFBdUMsT0FBdkM7Q0FDRSxHQUFBLElBQUE7Q0FDRSxLQUFBLEVBQUEsS0FBQTtDQUFBLEVBQ2lCLENBQWIsRUFBSixHQUFBLENBREE7Q0FERixFQUdhLEtBQVgsS0FBQTtNQUhGO0NBS0UsQ0FBZ0QsQ0FBckMsR0FBWCxFQUFBLEdBQVcsS0FBQTtDQUNOLEVBQVksQ0FBYixLQUFKLElBQUE7TUFQbUM7Q0FBdkMsRUFBdUM7Q0EzRnZDIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSAoc3BlY2ltZW4pIC0+XG4gIGNsb25lID0gKG9iamVjdCkgLT5cbiAgICBvYmplY3QgPSBKU09OLnN0cmluZ2lmeSBvYmplY3RcbiAgICByZXR1cm4gSlNPTi5wYXJzZSBvYmplY3RcbiAgcHJldmlvdXNTdGF0ZSA9IHNwZWNpbWVuLnN0YXRlc1tzcGVjaW1lbi5zdGF0ZXMubGVuZ3RoIC0gMV1cbiAgbmV3U3RhdGUgPSBjbG9uZSBwcmV2aW91c1N0YXRlXG4gIGNlbGxzVG9Ub2dnbGUgPSBbXVxuICBkaW1lbnNpb25TaXplID0gc3BlY2ltZW4ucGFyYW1zWzFdXG4gIGRpbWVuc2lvbk51bSA9IHNwZWNpbWVuLnBhcmFtc1swXVxuICBrID0gMSAvIDggKiAoTWF0aC5wb3coMywgZGltZW5zaW9uTnVtKSAtIDEpXG4gIG5lc3RlZE1hcCA9IChkaW1lbnNpb24pIC0+XG4gICAgaWYgbm90IGRpbWVuc2lvblswXS5wYXRoXG4gICAgICBkaW1lbnNpb24ubWFwIG5lc3RlZE1hcFxuICAgIGVsc2VcbiAgICAgIGRpbWVuc2lvbi5tYXAgKGdpdmVuQ2VsbCkgLT5cbiAgICAgICAgbGlmZUNvdW50ID0gMFxuICAgICAgICBwYXRoVHJlZSA9IChkaW1lbnNpb25JbmRleCwgX3N0YXRlKSAtPlxuICAgICAgICAgIGlmIG5vdCBfc3RhdGUucGF0aFxuICAgICAgICAgICAgbmV4dEluZGV4ID0gZGltZW5zaW9uSW5kZXggKyAxXG4gICAgICAgICAgICBkID0gZDEgPSBnaXZlbkNlbGwucGF0aFtkaW1lbnNpb25JbmRleF1cbiAgICAgICAgICAgIHBhdGhUcmVlIG5leHRJbmRleCwgX3N0YXRlW2RdXG4gICAgICAgICAgICBpZiBkIGlzIDBcbiAgICAgICAgICAgICAgZCA9IGRpbWVuc2lvblNpemVcbiAgICAgICAgICAgIHBhdGhUcmVlIG5leHRJbmRleCwgX3N0YXRlW2QgLSAxXVxuICAgICAgICAgICAgaWYgZDEgaXMgZGltZW5zaW9uU2l6ZSAtIDFcbiAgICAgICAgICAgICAgZDEgPSAtMVxuICAgICAgICAgICAgcGF0aFRyZWUgbmV4dEluZGV4LCBfc3RhdGVbZDEgKyAxXVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIG5laWdoYm9yID0gX3N0YXRlXG4gICAgICAgICAgICBpZiBuZWlnaGJvci5pc0FsaXZlIGFuZCAobmVpZ2hib3IucGF0aCBpc250IGdpdmVuQ2VsbC5wYXRoKVxuICAgICAgICAgICAgICBsaWZlQ291bnQrK1xuICAgICAgICBwYXRoVHJlZSAwLCBwcmV2aW91c1N0YXRlXG5cbiAgICAgICAgaWYgZ2l2ZW5DZWxsLmlzQWxpdmVcbiAgICAgICAgICBpZiBsaWZlQ291bnQgPCAyICogayBvciBsaWZlQ291bnQgPiAzICoga1xuICAgICAgICAgICAgY2VsbHNUb1RvZ2dsZS5wdXNoIGdpdmVuQ2VsbFxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgbGlmZUNvdW50IGlzIDMgKiBrXG4gICAgICAgICAgICBjZWxsc1RvVG9nZ2xlLnB1c2ggZ2l2ZW5DZWxsXG5cbiAgbmVzdGVkTWFwIHByZXZpb3VzU3RhdGVcblxuICBmb3IgY2VsbCBpbiBjZWxsc1RvVG9nZ2xlXG4gICAgX3N0YXRlID0gbmV3U3RhdGVcbiAgICBmb3IgaW5kZXggaW4gY2VsbC5wYXRoXG4gICAgICBfc3RhdGUgPSBfc3RhdGVbaW5kZXhdXG4gICAgX3N0YXRlLmlzQWxpdmUgPSAhIF9zdGF0ZS5pc0FsaXZlXG5cbiAgaWYgY2VsbHNUb1RvZ2dsZS5sZW5ndGggaXMgMFxuICAgIHNwZWNpbWVuLnN0YXR1cyA9ICdkZWFkJ1xuICAgIGlmIChKU09OLnN0cmluZ2lmeShuZXdTdGF0ZSkuaW5kZXhPZiAndHJ1ZScpIGlzbnQgLTFcbiAgICAgIHNwZWNpbWVuLnN0YXR1cyA9ICdzdGlsbCdcbiAgZWxzZVxuICAgIGZvciBzdGF0ZSwgaW5kZXggaW4gc3BlY2ltZW4uc3RhdGVzXG4gICAgICBpZiBKU09OLnN0cmluZ2lmeShuZXdTdGF0ZSkgaXMgSlNPTi5zdHJpbmdpZnkoc3RhdGUpXG4gICAgICAgIHNwZWNpbWVuLnN0YXR1cyA9ICdwZXJpb2QgJyArIChzcGVjaW1lbi5zdGF0ZXMubGVuZ3RoIC0gaW5kZXgpXG4gIHNwZWNpbWVuLmFnZSsrXG4gIHNwZWNpbWVuLmNlbGxzVG9Ub2dnbGUgPSBjZWxsc1RvVG9nZ2xlXG4gIHNwZWNpbWVuLnN0YXRlcyA9IFtwcmV2aW91c1N0YXRlLCBuZXdTdGF0ZV1cbiAgIyMjXG4gI3NwZWNpbWVuLnN0YXRlcy5wdXNoIG5ld1N0YXRlXG4gIG51bWJlciBvZiBzdXJyb3VuZGluZyBjZWxscyA9IDMgXiBkaW1lbnNpb25zIC0gMVxuICAjIyNcbiIsIm1vZHVsZS5leHBvcnRzID0gKHN0YXRlLCBlbGVtZW50LCBzaXplLCBjZWxsc1RvVG9nZ2xlLCBwcm9qZWN0aW9uTnVtKSAtPlxuICBzd2l0Y2ggcHJvamVjdGlvbk51bVxuICAgIHdoZW4gMVxuICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSAnVGhpcyBzdGF0ZSBpcyB1bnJlbmRlcmFibGUhIFNlZSBjb25zb2xlIG91dHB1dC4nXG4gICAgd2hlbiAyXG4gICAgICBmb3IgY2VsbCBpbiBjZWxsc1RvVG9nZ2xlXG4gICAgICAgIHggPSBlbGVtZW50LmNoaWxkTm9kZXNbMF1cbiAgICAgICAgeCA9IHguY2hpbGROb2Rlc1swXVxuICAgICAgICB4ID0geC5jaGlsZE5vZGVzW2NlbGwucGF0aFswXV1cbiAgICAgICAgeCA9IHguY2hpbGROb2Rlc1tjZWxsLnBhdGhbMV1dXG4gICAgICAgIHguY2xhc3NMaXN0LnRvZ2dsZSAnYWxpdmUnXG4gICAgZWxzZVxuICAgICAgcHJvamVjdCA9IChzdGF0ZSwgaW5kZXgpIC0+XG4gICAgICAgIGZvciByb3cgaW4gWzAuLi5zaXplXVxuICAgICAgICAgIGZvciBjb2x1bW4gaW4gWzAuLi5zaXplXVxuICAgICAgICAgICAgY29uc29sZS5sb2cgcm93LCBjb2x1bW5cbiAgICAgICAgICAgIHggPSBlbGVtZW50LmNoaWxkTm9kZXNbfn4oaW5kZXggLyAyKV1cbiAgICAgICAgICAgIHggPSB4LmNoaWxkTm9kZXNbaW5kZXggJSAyXVxuICAgICAgICAgICAgeCA9IHguY2hpbGROb2Rlc1tyb3ddXG4gICAgICAgICAgICB4ID0geC5jaGlsZE5vZGVzW2NvbHVtbl1cbiAgICAgICAgICAgIGlmIHN0YXRlW3Jvd11bY29sdW1uXS5pc0FsaXZlXG4gICAgICAgICAgICAgIHguY2xhc3NMaXN0LmFkZCAnYWxpdmUnXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHguY2xhc3NMaXN0LnJlbW92ZSAnYWxpdmUnXG4gICAgICByZWR1Y2UgPSAoc3RhdGUsIHByb2plY3Rpb25JbmRleCkgLT5cbiAgICAgICAgIyMjXG4gICAgICAgICAgZmlyc3QgcmVkdWNlIGxlYXZlcyB1bnRpbCBkZWVwbmVzcyBpcyBwcm9qZWN0aW9uIEluZGV4ICsgMVxuICAgICAgICAgIHRoZW4gc2tpcCAyXG4gICAgICAgICAgdGhlbiBtZXJnZSAyIGRpbWVuc2lvbmFsIG1hdHJpY2VzXG4gICAgICAgICMjI1xuICAgICAgICBtZXJnZTEgPSAoYXJyYXkpIC0+XG4gICAgICAgICAgZm9yIGogaW4gWzAuLi5zaXplXVxuICAgICAgICAgICAgYXJyYXlbMF1bal0ucGF0aC5zcGxpY2UoLTIsMSlcbiAgICAgICAgICAgIGZvciBrIGluIFsxLi4uc2l6ZV1cbiAgICAgICAgICAgICAgaWYgYXJyYXlbMF1bal0uaXNBbGl2ZVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBhcnJheVswXVtqXS5pc0FsaXZlID0gYXJyYXlba11bal0uaXNBbGl2ZVxuICAgICAgICAgIHJldHVybiBhcnJheVswXVxuICAgICAgICBtZXJnZTIgPSAoYXJyYXkpIC0+XG4gICAgICAgICAgZm9yIGkgaW4gWzAuLi5zaXplXVxuICAgICAgICAgICAgZm9yIGogaW4gWzAuLi5zaXplXVxuICAgICAgICAgICAgICBhcnJheVswXVtpXVtqXS5wYXRoLnNwbGljZSgtMywxKVxuICAgICAgICAgICAgICBmb3IgayBpbiBbMS4uLnNpemVdXG4gICAgICAgICAgICAgICAgaWYgKGFycmF5WzBdW2ldW2pdLmlzQWxpdmUpXG4gICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgIGFycmF5WzBdW2ldW2pdLmlzQWxpdmUgPSBhcnJheVtrXVtpXVtqXS5pc0FsaXZlXG4gICAgICAgICAgcmV0dXJuIGFycmF5WzBdXG4gICAgICAgIG1lcmdlID0gKGFycmF5KSAtPlxuICAgICAgICAgIHZhbHVlID0gYXJyYXkucmVkdWNlICgoYSwgYykgLT4gaWYgYy5pc0FsaXZlIHRoZW4gYSArIDEgZWxzZSBhKSwgMFxuICAgICAgICAgIGFycmF5WzBdLnBhdGgucG9wKClcbiAgICAgICAgICByZWR1Y2VkQ2VsbCA9IGlzQWxpdmU6ICEhdmFsdWUsIHBhdGg6IGFycmF5WzBdLnBhdGhcbiAgICAgICAgICByZXR1cm4gcmVkdWNlZENlbGxcbiAgICAgICAgaXRlciA9IChkaW1lbnNpb25zLCBkZWVwbmVzcykgLT5cbiAgICAgICAgICBpZiBkaW1lbnNpb25zLnBhdGggIyBpcyBsYXN0IGRpbWVuc2lvblxuICAgICAgICAgICAgcmV0dXJuIGRpbWVuc2lvbnNcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgIyBwb3AgZXZlcnkgcmVkdWNlXG4gICAgICAgICAgIyBpcyBnb29kPyByZXR1cm4gYXJyYXksIGVsc2UgbWVyZ2UgZGVwZW5kZW50IG9uIG51bWJlciBvZiBnb29kXG4gICAgICAgICAgIyBpcyBhcnJheSBvZiBwYmtlY3RzLiBlbGVzZSBhcnJheSBvZiBhcnJheXNcbiAgICAgICAgICAgIGFycmF5ID0gW11cbiAgICAgICAgICAgIGZvciBpIGluIFswLi4uc2l6ZV1cbiAgICAgICAgICAgICAgYXJyYXkucHVzaCBpdGVyIGRpbWVuc2lvbnNbaV0sIGRlZXBuZXNzICsgMVxuICAgICAgICAgICAgaWYgZGVlcG5lc3MgaXMgcHJvamVjdGlvbkluZGV4IG9yIGRlZXBuZXNzIGlzIChwcm9qZWN0aW9uSW5kZXggKyAxKSAlIHByb2plY3Rpb25OdW1cbiAgICAgICAgICAgICAgcmV0dXJuIGFycmF5XG4gICAgICAgICAgICBpZiBhcnJheVswXS5wYXRoXG4gICAgICAgICAgICAgIHJldHVybiBtZXJnZSBhcnJheVxuICAgICAgICAgICAgaWYgYXJyYXlbMF1bMF0ucGF0aFxuICAgICAgICAgICAgICByZXR1cm4gbWVyZ2UxIGFycmF5XG4gICAgICAgICAgICBpZiBhcnJheVswXVswXVswXS5wYXRoXG4gICAgICAgICAgICAgIHJldHVybiBtZXJnZTIgYXJyYXlcbiAgICAgICAgaXRlciBzdGF0ZSwgMFxuICAgICAgZm9yIGkgaW4gWzAuLi5wcm9qZWN0aW9uTnVtXVxuICAgICAgICBfc3RhdGUgPSBKU09OLnBhcnNlIEpTT04uc3RyaW5naWZ5IHN0YXRlXG4gICAgICAgIHByb2plY3QgKHJlZHVjZSBfc3RhdGUsIGkpLCBpXG4gICAgI2VsZW1lbnQuaW5uZXJIVE1MID0gJ1RoaXMgc3RhdGUgaXMgdW5yZW5kZXJhYmxlISBTZWUgY29uc29sZSBvdXRwdXQuJ1xuIyMjXG4gICAgUHJvamVjdCBtdWx0aS1kaW1lbnNpb25hbCBzdGF0ZXMgdG8gMkRcbiAgICBlLmcuIHN0YXRlW2ldW2pdW3JlZHVjZWRdLi5bc3RhdGVzXVxuIyMjXG4iLCJtb2R1bGUuZXhwb3J0cyA9IChyYW5nZSkgLT5cbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlKVxuIiwicmFuZG9tID0gcmVxdWlyZSAnLi9yYW5kb20uY29mZmVlJ1xubW9kdWxlLmV4cG9ydHMgPSAoZGltZW5zaW9uTnVtLCBkaW1lbnNpb25TaXplLCBwb3B1bGF0aW9uU2l6ZSkgLT5cbiAgc3RhdGUgPSBbXVxuXG4gIGNsb25lID0gKG9iamVjdCkgLT5cbiAgICBvYmplY3QgPSBKU09OLnN0cmluZ2lmeSBvYmplY3RcbiAgICByZXR1cm4gSlNPTi5wYXJzZSBvYmplY3RcblxuICBpbml0ID0gKHN1YnN0YXRlLCBkaW1lbnNpb25zTGVmdCwgcGF0aCkgLT5cbiAgICBpZiAoZGltZW5zaW9uc0xlZnQpXG4gICAgICBpID0gZGltZW5zaW9uU2l6ZVxuICAgICAgd2hpbGUoaS0tKVxuICAgICAgICBkaW1lbnNpb25QYXRoID0gY2xvbmUgcGF0aFxuICAgICAgICBkaW1lbnNpb25QYXRoLnB1c2goaSlcbiAgICAgICAgc3Vic3RhdGVbaV0gPSBbXVxuICAgICAgICBpZiAoZGltZW5zaW9uc0xlZnQgPT0gMSlcbiAgICAgICAgICBqID0gZGltZW5zaW9uU2l6ZVxuICAgICAgICAgIHdoaWxlKGotLSlcbiAgICAgICAgICAgIGNlbGxQYXRoID0gY2xvbmUgZGltZW5zaW9uUGF0aFxuICAgICAgICAgICAgY2VsbFBhdGgucHVzaChqKVxuICAgICAgICAgICAgc3Vic3RhdGVbaV1bal0gPSBwYXRoOiBjZWxsUGF0aFxuICAgICAgICBpbml0IHN1YnN0YXRlW2ldLCBkaW1lbnNpb25zTGVmdCAtIDEsIGRpbWVuc2lvblBhdGhcblxuICBpbml0IHN0YXRlLCBkaW1lbnNpb25OdW0gLSAxLCBbXVxuIyBQcmVwYXJlIGZvciBmaXJzdCBjZWxsIGluc2VydGlvblxuICBwb3B1bGF0aW9uID0gW11cbiAgaGFsZmRpbWVuc2lvblNpemUgPSB+fihkaW1lbnNpb25TaXplIC8gMilcbiAgc3Vic3RhdGUgPSBzdGF0ZVxuICBjZWxsUGF0aCA9IFtdXG4gIGQgPSBkaW1lbnNpb25OdW1cbiAgd2hpbGUoLS1kKVxuICAgIGNlbGxQYXRoLnB1c2ggaGFsZmRpbWVuc2lvblNpemVcbiAgICBzdWJzdGF0ZSA9IHN1YnN0YXRlW2hhbGZkaW1lbnNpb25TaXplXVxuICBjZWxsUGF0aC5wdXNoIGhhbGZkaW1lbnNpb25TaXplXG4gIHBvcHVsYXRpb24ucHVzaCBjZWxsUGF0aFxuIyBGaW5hbGx5XG4gIHN1YnN0YXRlW2hhbGZkaW1lbnNpb25TaXplXS5pc0FsaXZlID0gdHJ1ZVxuIyBCdWdnZ2dnZ2dnZ2dnZ2dnZ2dzQHRvZG9cbiAgaW5zZXJ0QW5vdGhlck9uZSA9IC0+XG4gICAgY2VsbFBhdGggPSBjbG9uZSBwb3B1bGF0aW9uW3JhbmRvbSBwb3B1bGF0aW9uLmxlbmd0aF1cbiAgIyBTaGlmdCBpdFxuICAgIHNoaWZ0c051bWJlciA9IChyYW5kb20gZGltZW5zaW9uTnVtKSArIDFcbiAgICB3aGlsZShzaGlmdHNOdW1iZXItLSlcbiAgICAgIGkgPSByYW5kb20gZGltZW5zaW9uTnVtXG4gICAgICBpZiByYW5kb20gMlxuICAgICAgICBjZWxsUGF0aFtpXSA9IChjZWxsUGF0aFtpXSArIDEpICUgZGltZW5zaW9uU2l6ZVxuICAgICAgZWxzZVxuICAgICAgICBjZWxsUGF0aFtpXSA9IChjZWxsUGF0aFtpXSAtIDEpXG4gICAgICAgIGlmIGNlbGxQYXRoW2ldIGlzIC0xXG4gICAgICAgICAgY2VsbFBhdGhbaV0gPSBkaW1lbnNpb25TaXplIC0gMVxuICAjIFB1c2ggaXRcbiAgICBzdWJzdGF0ZSA9IHN0YXRlXG4gICAgZm9yIGQgaW4gWzAuLi5kaW1lbnNpb25OdW1dXG4gICAgICB4ID0gY2VsbFBhdGhbZF1cbiAgICAgIGlmIHN1YnN0YXRlIGlzIHVuZGVmaW5lZFxuICAgICAgICBkZWJ1Z2dlclxuICAgICAgc3Vic3RhdGUgPSBzdWJzdGF0ZVt4XVxuICAgIGlmIHN1YnN0YXRlIGlzIHVuZGVmaW5lZFxuICAgICAgZGVidWdnZXJcbiAgICBhbHJlYWR5RXhpc3RzID0gc3Vic3RhdGUuaXNBbGl2ZVxuICAgIGlmIGFscmVhZHlFeGlzdHNcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIGVsc2VcbiAgICAgIHN1YnN0YXRlLmlzQWxpdmUgPSB0cnVlXG4gICAgICBwb3B1bGF0aW9uLnB1c2ggY2VsbFBhdGhcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgd2hpbGUoLS1wb3B1bGF0aW9uU2l6ZSlcbiAgICB3aGlsZSghaW5zZXJ0QW5vdGhlck9uZSgpKVxuICAgICAgY29uc29sZS5sb2cgJ0NlbGwgYWxyZWFkeSBleGlzdHMsIHJlc3Bhd25pbmcuJ1xuICBzdGF0ZS5pbml0aWFsID0gcG9wdWxhdGlvblxuICBzdGF0ZS5wYXJhbXMgPSBhcmd1bWVudHNcbiAgcmV0dXJuIHN0YXRlXG4iLCJpbnB1dCA9IHJlcXVpcmUgJy4vaW5wdXQuY29mZmVlJ1xub3V0cHV0ID0gcmVxdWlyZSAnLi9vdXRwdXQuY29mZmVlJ1xucHJvY2VzcyA9IHJlcXVpcmUgJy4vcHJvY2Vzcy5jb2ZmZWUnXG5cbnNldCA9IFtdXG5ib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ21haW4nKVswXVxuYnlJZCA9ICh4KSAtPiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCB4XG5zcGVjaW1lbk51bWJlciA9IGJ5SWQgJ3NwZWNpbWVuLW51bWJlcidcbmRpbWVuc2lvbk51bWJlciA9IGJ5SWQgJ2RpbWVuc2lvbi1udW1iZXInXG5jZWxsTnVtYmVyID0gYnlJZCAnY2VsbC1udW1iZXInXG5kaW1lbnNpb25TaXplID0gYnlJZCAnZGltZW5zaW9uLXNpemUnXG5pbnRlcnZhbCA9IG51bGxcbmludGVydmFsRnVuY3Rpb24gPSBudWxsXG5pbml0ID0gLT5cbiAgc2V0ID0gW11cbiAgYm9keS5pbm5lckhUTUwgPSAnJ1xuICBmb3IgaSBpbiBbMC4uLnNwZWNpbWVuTnVtYmVyLnZhbHVlXVxuICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdkaXYnXG4gICAgYm9keS5hcHBlbmRDaGlsZCBlbGVtZW50XG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUgJ2lkJywgJ3NwZWNpbWVuJyArIGlcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSAnY2xhc3MnLCAncG9wdWxhdGlvbidcbiAgICBnZW5lcmF0ZWRTdGF0ZSA9IGlucHV0IHBhcnNlSW50KGRpbWVuc2lvbk51bWJlci52YWx1ZSksIGRpbWVuc2lvblNpemUudmFsdWUsIGNlbGxOdW1iZXIudmFsdWVcbiAgICBzcGVjaW1lbiA9XG4gICAgICBzdGF0ZXM6IFtnZW5lcmF0ZWRTdGF0ZV1cbiAgICAgIHN0YXR1czogJ2FsaXZlJ1xuICAgICAgcGFyYW1zOiBnZW5lcmF0ZWRTdGF0ZS5wYXJhbXNcbiAgICAgIGluaXRpYWw6IGdlbmVyYXRlZFN0YXRlLmluaXRpYWxcbiAgICAgIGVsZW1lbnQ6IGVsZW1lbnRcbiAgICAgIGFnZTogMFxuICAgIHN0ciA9ICcnXG4gICAgcHJvamVjdGlvbk51bSA9IHNwZWNpbWVuLnBhcmFtc1swXVxuICAgIHByb2plY3Rpb25OdW0gPSAxIGlmIHByb2plY3Rpb25OdW0gaXMgMlxuICAgIGZvciBqIGluIFswLi4ucHJvamVjdGlvbk51bV1cbiAgICAgIGlmIChqICUgMiBpcyAwKVxuICAgICAgICBzdHIgKz0gJzxkaXYgY2xhc3M9XCJkaW1lbnNpb24tcGFpclwiPidcbiAgICAgIHN0ciArPSAnPGRpdiBjbGFzcz1cImRpbWVuc2lvblwiPidcbiAgICAgIGZvciByb3cgaW4gZ2VuZXJhdGVkU3RhdGVcbiAgICAgICAgc3RyICs9ICc8ZGl2IGNsYXNzPVwicm93XCI+J1xuICAgICAgICBpID0gc3BlY2ltZW4ucGFyYW1zWzFdXG4gICAgICAgIHdoaWxlKGktLSlcbiAgICAgICAgICBzdHIgKz0gJzxkaXYgY2xhc3M9XCJjZWxsXCI+PC9kaXY+J1xuICAgICAgICBzdHIgKz0gJzwvZGl2PidcbiAgICAgIHN0ciArPSAnPC9kaXY+J1xuICAgICAgaWYgKGogJSAyIGlzIDEpXG4gICAgICAgIHN0ciArPSAnPC9kaXY+J1xuICAgIHNwZWNpbWVuLmVsZW1lbnQuaW5uZXJIVE1MICs9IHN0clxuICAgIGRlbGV0ZSBnZW5lcmF0ZWRTdGF0ZS5wYXJhbXNcbiAgICBkZWxldGUgZ2VuZXJhdGVkU3RhdGUuaW5pdGlhbFxuICAgIHNldC5wdXNoIHNwZWNpbWVuXG4gIF9zZXQgPSBbXVxuXG4gIGZvciBzcGVjaW1lbiBpbiBzZXRcbiAgICBjZWxsc1RvVG9nZ2xlID0gW11cbiAgICBmb3IgcGF0aCBpbiBzcGVjaW1lbi5pbml0aWFsXG4gICAgICBjZWxsc1RvVG9nZ2xlLnB1c2gge3BhdGg6IHBhdGh9XG4gICAgb3V0cHV0IHNwZWNpbWVuLnN0YXRlc1tzcGVjaW1lbi5zdGF0ZXMubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgc3BlY2ltZW4uZWxlbWVudCxcbiAgICAgICAgICBzcGVjaW1lbi5wYXJhbXNbMV0sXG4gICAgICAgICAgY2VsbHNUb1RvZ2dsZSxcbiAgICAgICAgICBzcGVjaW1lbi5wYXJhbXNbMF1cblxuICBpbnRlcnZhbEZ1bmN0aW9uID0gLT5cbiAgICBpc0FsbERvbmUgPSB0cnVlXG4gICAgZm9yIHNwZWNpbWVuLCBpIGluIHNldFxuICAgICAgaXNBbGxEb25lID0gZmFsc2VcbiAgICAgIGlmIHNwZWNpbWVuLnN0YXR1cyBpcyAnYWxpdmUnXG4gICAgICAgIHByb2Nlc3Mgc3BlY2ltZW5cbiAgICAgICAgb3V0cHV0IHNwZWNpbWVuLnN0YXRlc1tzcGVjaW1lbi5zdGF0ZXMubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgICAgIHNwZWNpbWVuLmVsZW1lbnQsXG4gICAgICAgICAgICAgIHNwZWNpbWVuLnBhcmFtc1sxXSxcbiAgICAgICAgICAgICAgc3BlY2ltZW4uY2VsbHNUb1RvZ2dsZSxcbiAgICAgICAgICAgICAgc3BlY2ltZW4ucGFyYW1zWzBdXG4gICAgICBlbHNlXG4gICAgICAgIHNwZWNpbWVuLmVsZW1lbnQuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJzdGF0dXNcIj48aDE+JyArXG4gICAgICAgICAgc3BlY2ltZW4uc3RhdHVzICtcbiAgICAgICAgICAnPC9oMT48aDM+YWdlOiAnK1xuICAgICAgICAgIHNwZWNpbWVuLmFnZStcbiAgICAgICAgICAnPC9oMz48L2Rpdj4nK1xuICAgICAgICAgIHNwZWNpbWVuLmVsZW1lbnQuaW5uZXJIVE1MXG4gICAgICAgIF9zZXQucHVzaCBzcGVjaW1lblxuICAgICAgICBpID0gc2V0LmluZGV4T2Ygc3BlY2ltZW5cbiAgICAgICAgc2V0LnNwbGljZSBpLCAxXG4gICAgICAgIGJyZWFrXG5cbiAgICBpZiBpc0FsbERvbmVcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsIGludGVydmFsXG4gICAgICBpbml0KClcbiAgaW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwgaW50ZXJ2YWxGdW5jdGlvbiwgMTAwXG5pbml0KClcbmJ5SWQoJ2FwcGx5JykuYWRkRXZlbnRMaXN0ZW5lciAnY2xpY2snLCAtPlxuICB3aW5kb3cuY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7IGluaXQoKVxuYnlJZCgnc3RvcCcpLmFkZEV2ZW50TGlzdGVuZXIgJ2NsaWNrJywgLT5cbiAgaWYgaW50ZXJ2YWxcbiAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCBpbnRlcnZhbFxuICAgIHRoaXMuaW5uZXJIVE1MID0gJ2NvbnRpbnVlJ1xuICAgIGludGVydmFsID0gdW5kZWZpbmVkXG4gIGVsc2VcbiAgICBpbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbCBpbnRlcnZhbEZ1bmN0aW9uLCAxMDBcbiAgICB0aGlzLmlubmVySFRNTCA9ICdzdG9wJ1xuIl19
;