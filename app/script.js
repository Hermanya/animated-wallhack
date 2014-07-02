;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0](function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function() {
  module.exports = {
    body: document.getElementsByTagName('main')[0],
    byId: function(x) {
      return document.getElementById(x);
    },
    specimenNumber: document.getElementById('specimen-number'),
    dimensionNumber: document.getElementById('dimension-number'),
    cellNumber: document.getElementById('cell-number'),
    dimensionSize: document.getElementById('dimension-size'),
    addEventHandlers: function(interval) {
      this.byId('apply').addEventListener('click', function() {
        window.clearInterval(interval.id);
        return interval.init();
      });
      return this.byId('stop').addEventListener('click', function() {
        if (interval.id) {
          window.clearInterval(interval.id);
          this.innerHTML = 'continue';
          return interval.id = void 0;
        } else {
          interval.id = window.setInterval(interval.repeat, 100);
          return this.innerHTML = 'stop';
        }
      });
    }
  };

}).call(this);


},{}],2:[function(require,module,exports){
(function() {
  module.exports = function(specimen) {
    var cell, cellsToToggle, element, i, project, projectionNum, reduce, size, state, x, _i, _j, _len, _results, _results1, _state;
    state = specimen.tree;
    element = specimen.element;
    size = specimen.parameters.numberOfCellsPerDimension;
    projectionNum = specimen.parameters.numberOfDimensions;
    cellsToToggle = specimen.cellsToToggle;
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
                x = element.childNodes[~~(index / 2)];
                x = x.childNodes[index % 2];
                x = x.childNodes[row];
                x = x.childNodes[column];
                if (state[row][column].isLive) {
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
                if (array[0][j].isLive) {
                  break;
                } else {
                  array[0][j].isLive = array[k][j].isLive;
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
                  if (array[0][i][j].isLive) {
                    break;
                  } else {
                    array[0][i][j].isLive = array[k][i][j].isLive;
                  }
                }
              }
            }
            return array[0];
          };
          merge = function(array) {
            var reducedCell, value;
            value = array.reduce((function(a, c) {
              if (c.isLive) {
                return a + 1;
              } else {
                return a;
              }
            }), 0);
            array[0].path.pop();
            reducedCell = {
              isLive: !!value,
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
  module.exports = function(specimen) {
    var cell, counter, dimensionNum, dimensionSize, givenCell, group, i, index, k, list, numberOfAdjacentCells, previous, string, _i, _j, _k, _l, _len, _len1, _len2, _ref, _ref1;
    list = specimen.list;
    specimen.cellsToToggle = [];
    dimensionSize = specimen.parameters.numberOfCellsPerDimension;
    dimensionNum = specimen.parameters.numberOfDimensions;
    numberOfAdjacentCells = Math.pow(3, dimensionNum) - 1;
    k = 1 / 8 * numberOfAdjacentCells;
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      group = list[_i];
      counter = 0;
      for (i = _j = 1; 1 <= numberOfAdjacentCells ? _j <= numberOfAdjacentCells : _j >= numberOfAdjacentCells; i = 1 <= numberOfAdjacentCells ? ++_j : --_j) {
        if (group[i].isLive) {
          counter++;
        }
      }
      givenCell = group[0];
      if (givenCell.isLive) {
        if (counter < 2 || counter > 3) {
          specimen.cellsToToggle.push(givenCell);
        }
      } else {
        if (counter > 2 && counter < 4) {
          specimen.cellsToToggle.push(givenCell);
        }
      }
    }
    _ref = specimen.cellsToToggle;
    for (_k = 0, _len1 = _ref.length; _k < _len1; _k++) {
      cell = _ref[_k];
      cell.isLive = !cell.isLive;
    }
    string = list.toString();
    if (specimen.cellsToToggle.length === 0) {
      specimen.status = 'empty';
      if ((string.indexOf('1')) !== -1) {
        specimen.status = 'still';
      }
    } else {
      _ref1 = specimen.states;
      for (index = _l = 0, _len2 = _ref1.length; _l < _len2; index = ++_l) {
        previous = _ref1[index];
        if (string === previous) {
          specimen.status = 'period ' + (specimen.states.length - index);
        }
      }
    }
    specimen.states.push(string);
    return specimen.age++;
  };

}).call(this);


},{}],4:[function(require,module,exports){
(function() {
  module.exports = function(range) {
    return Math.floor(Math.random() * range);
  };

}).call(this);


},{}],5:[function(require,module,exports){
(function() {
  var random;

  random = require('./random.coffee');

  module.exports = function(options) {
    var cellPath, clone, d, dimensionNum, dimensionSize, halfdimensionSize, init, insertAnotherOne, nestedMap, population, populationSize, stateList, stateTree, subTree;
    dimensionNum = options.numberOfDimensions;
    dimensionSize = options.numberOfCellsPerDimension;
    populationSize = options.numberOfLiveCellsPerInitialPopulation;
    stateTree = [];
    clone = function(object) {
      object = JSON.stringify(object);
      return JSON.parse(object);
    };
    init = function(subTree, dimensionsLeft, path) {
      var cellPath, dimensionPath, i, j, _results;
      if (dimensionsLeft) {
        i = dimensionSize;
        _results = [];
        while (i--) {
          dimensionPath = clone(path);
          dimensionPath.push(i);
          subTree[i] = [];
          if (dimensionsLeft === 1) {
            j = dimensionSize;
            while (j--) {
              cellPath = clone(dimensionPath);
              cellPath.push(j);
              subTree[i][j] = {
                path: cellPath
              };
            }
          }
          _results.push(init(subTree[i], dimensionsLeft - 1, dimensionPath));
        }
        return _results;
      }
    };
    init(stateTree, dimensionNum - 1, []);
    population = [];
    halfdimensionSize = ~~(dimensionSize / 2);
    subTree = stateTree;
    cellPath = [];
    d = dimensionNum;
    while (--d) {
      cellPath.push(halfdimensionSize);
      subTree = subTree[halfdimensionSize];
    }
    cellPath.push(halfdimensionSize);
    population.push(cellPath);
    subTree[halfdimensionSize].isLive = true;
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
      subTree = stateTree;
      for (d = _i = 0; 0 <= dimensionNum ? _i < dimensionNum : _i > dimensionNum; d = 0 <= dimensionNum ? ++_i : --_i) {
        x = cellPath[d];
        subTree = subTree[x];
      }
      alreadyExists = subTree.isLive;
      if (alreadyExists) {
        return false;
      } else {
        subTree.isLive = true;
        population.push(cellPath);
        return true;
      }
    };
    while (--populationSize) {
      while (!insertAnotherOne()) {
        console.log('Cell already exists, respawning.');
      }
    }
    /*
    stateTree[16][15].isLive = true
    stateTree[16][17].isLive = true
    population.push [16,15]
    population.push [16,17]
    */

    /*
    here i create a working list, which is an array of arrays of
    adjasent points. I also override to string method, so that stringify
    result of the whole thing is short and nice.
    */

    stateList = [];
    stateList.toString = function() {
      return stateList.reduce(function(string, array) {
        return string + array.toString();
      }, '');
    };
    nestedMap = function(dimension) {
      if (!dimension[0].path) {
        return dimension.map(nestedMap);
      } else {
        return dimension.map(function(givenCell) {
          var adjacent, getAdjacent;
          adjacent = [givenCell];
          adjacent.toString = function() {
            if (this[0].isLive) {
              return 1;
            } else {
              return 0;
            }
          };
          stateList.push(adjacent);
          getAdjacent = function(dimensionIndex, cellOrDimension) {
            var adjacentCell, d1, d2, nextIndex, subdimension;
            if (!cellOrDimension.path) {
              subdimension = cellOrDimension;
              d1 = d2 = givenCell.path[dimensionIndex];
              nextIndex = dimensionIndex + 1;
              getAdjacent(nextIndex, subdimension[d1]);
              if (d1 === 0) {
                d1 = dimensionSize;
              }
              getAdjacent(nextIndex, subdimension[d1 - 1]);
              if (d2 === dimensionSize - 1) {
                d2 = -1;
              }
              return getAdjacent(nextIndex, subdimension[d2 + 1]);
            } else {
              adjacentCell = cellOrDimension;
              if (adjacentCell !== givenCell) {
                return adjacent.push(adjacentCell);
              }
            }
          };
          return getAdjacent(0, stateTree);
        });
      }
    };
    nestedMap(stateTree);
    return {
      list: stateList,
      tree: stateTree,
      initialPopulation: population,
      parameters: options
    };
  };

}).call(this);


},{"./random.coffee":4}],6:[function(require,module,exports){
(function(){(function() {
  var generate, gui, interval, output, process, specimenSet;

  generate = require('./generate.coffee');

  output = require('./output.coffee');

  process = require('./process.coffee');

  gui = require('./gui.coffee');

  specimenSet = null;

  interval = {
    init: function() {
      var element, generated, i, j, k, l, path, projectionNum, specimen, str, _i, _j, _k, _l, _len, _len1, _m, _ref, _ref1, _ref2;
      specimenSet = [];
      gui.body.innerHTML = '';
      for (i = _i = 0, _ref = gui.specimenNumber.value; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        element = document.createElement('div');
        gui.body.appendChild(element);
        element.setAttribute('id', 'specimen' + i);
        element.setAttribute('class', 'population');
        generated = generate({
          numberOfDimensions: parseInt(gui.dimensionNumber.value),
          numberOfCellsPerDimension: parseInt(gui.dimensionSize.value),
          numberOfLiveCellsPerInitialPopulation: parseInt(gui.cellNumber.value)
        });
        specimen = {
          list: generated.list,
          tree: generated.tree,
          states: [generated.list.toString()],
          status: 'live',
          parameters: generated.parameters,
          initial: generated.initialPopulation,
          element: element,
          age: 0
        };
        str = '';
        projectionNum = specimen.parameters.numberOfDimensions;
        if (projectionNum === 2) {
          projectionNum = 1;
        }
        for (j = _j = 0; 0 <= projectionNum ? _j < projectionNum : _j > projectionNum; j = 0 <= projectionNum ? ++_j : --_j) {
          if (j % 2 === 0) {
            str += '<div class="dimension-pair">';
          }
          str += '<div class="dimension">';
          for (k = _k = 0, _ref1 = specimen.parameters.numberOfCellsPerDimension; 0 <= _ref1 ? _k < _ref1 : _k > _ref1; k = 0 <= _ref1 ? ++_k : --_k) {
            str += '<div class="row">';
            i = (function() {
              var _l, _ref2, _results;
              _results = [];
              for (l = _l = 0, _ref2 = specimen.parameters.numberOfCellsPerDimension; 0 <= _ref2 ? _l < _ref2 : _l > _ref2; l = 0 <= _ref2 ? ++_l : --_l) {
                _results.push(str += '<div class="cell"></div>');
              }
              return _results;
            })();
            str += '</div>';
          }
          str += '</div>';
          if (j % 2 === 1) {
            str += '</div>';
          }
        }
        specimen.element.innerHTML += str;
        delete generated.parameters;
        delete generated.initial;
        specimenSet.push(specimen);
      }
      for (_l = 0, _len = specimenSet.length; _l < _len; _l++) {
        specimen = specimenSet[_l];
        specimen.cellsToToggle = [];
        _ref2 = specimen.initial;
        for (_m = 0, _len1 = _ref2.length; _m < _len1; _m++) {
          path = _ref2[_m];
          specimen.cellsToToggle.push({
            path: path
          });
        }
        output(specimen);
      }
      return this.id = window.setInterval(this.repeat, 100);
    },
    repeat: function() {
      var i, isAllDone, specimen, _i, _len;
      isAllDone = true;
      for (i = _i = 0, _len = specimenSet.length; _i < _len; i = ++_i) {
        specimen = specimenSet[i];
        isAllDone = false;
        if (specimen.status === 'live') {
          process(specimen);
          output(specimen);
        } else {
          specimen.element.innerHTML = '<div class="status"><h1>' + specimen.status + '</h1><h3>age: ' + specimen.age + '</h3></div>' + specimen.element.innerHTML;
          i = specimenSet.indexOf(specimen);
          specimenSet.splice(i, 1);
          break;
        }
      }
      if (isAllDone) {
        window.clearInterval(interval.id);
        return interval.init();
      }
    }
  };

  gui.addEventHandlers(interval);

  interval.init();

}).call(this);


})()
},{"./generate.coffee":5,"./output.coffee":2,"./process.coffee":3,"./gui.coffee":1}]},{},[5,1,6,2,3,4])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvbGlmZS9fYXBwL2d1aS5jb2ZmZWUiLCIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvbGlmZS9fYXBwL291dHB1dC5jb2ZmZWUiLCIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvbGlmZS9fYXBwL3Byb2Nlc3MuY29mZmVlIiwiL2hvbWUvaGVybWFuL2V4cGVyaW1lbnRzL2xpZmUvX2FwcC9yYW5kb20uY29mZmVlIiwiL2hvbWUvaGVybWFuL2V4cGVyaW1lbnRzL2xpZmUvX2FwcC9nZW5lcmF0ZS5jb2ZmZWUiLCIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvbGlmZS9fYXBwL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtDQUFBLENBQUEsQ0FBaUIsR0FBWCxDQUFOO0NBQWlCLENBQ1QsRUFBTixFQUFNLEVBQVEsWUFBUjtDQURTLENBRVQsQ0FBQSxDQUFOLEtBQU87Q0FBZSxPQUFELEtBQVIsQ0FBQTtDQUZFLElBRVQ7Q0FGUyxDQUdDLEVBQWhCLElBQXdCLE1BQXhCLEdBQWdCO0NBSEQsQ0FJRSxFQUFqQixJQUF5QixNQUFSLENBQWpCLEdBQWlCO0NBSkYsQ0FLSCxFQUFaLElBQW9CLEVBQXBCLEdBQVksQ0FBQTtDQUxHLENBTUEsRUFBZixJQUF1QixLQUF2QixDQUFlLEVBQUE7Q0FOQSxDQU9HLENBQUEsQ0FBbEIsSUFBa0IsQ0FBQyxPQUFuQjtDQUNFLENBQXlDLENBQUEsQ0FBeEMsRUFBRCxDQUFBLEVBQXlDLE9BQXpDO0NBQ0UsQ0FBQSxJQUFNLEVBQU4sS0FBQTtDQUNTLEdBQVQsSUFBUSxPQUFSO0NBRkYsTUFBeUM7Q0FHeEMsQ0FBdUMsQ0FBQSxDQUF2QyxFQUFELENBQUEsRUFBd0MsSUFBeEMsR0FBQTtDQUNFLENBQUEsRUFBRyxJQUFIO0NBQ0UsQ0FBQSxJQUFNLEVBQXVCLEVBQTdCLEdBQUE7Q0FBQSxFQUNpQixDQUFiLEtBQUos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QUFNLENBQUwsRUFBVyxLQUFOLEVBQU47Q0FqRE8sSUFDSDtDQURHLENBa0RELENBQUEsQ0FBUixFQUFBLEdBQVE7Q0FDTixTQUFBLHNCQUFBO0NBQUEsRUFBWSxDQUFaLEVBQUEsR0FBQTtBQUNBLENBQUEsVUFBQSwrQ0FBQTttQ0FBQTtDQUNFLEVBQVksRUFBWixHQUFBLENBQUE7Q0FDQSxHQUFHLENBQW1CLENBQW5CLEVBQUg7Q0FDRSxNQUFBLENBQUEsRUFBQTtDQUFBLEtBQ0EsRUFBQSxFQUFBO01BRkYsSUFBQTtDQUlFLEVBQTZCLEdBQUEsQ0FBYixDQUFSLENBQVIsQ0FBQSxHQUE2QixHQUFBLFVBQUE7Q0FBN0IsRUFNSSxJQUFBLENBQUEsRUFBSixDQUFlO0NBTmYsQ0FPc0IsSUFBdEIsSUFBQSxDQUFXO0NBQ1gsZUFaRjtVQUZGO0NBQUEsTUFEQTtDQWlCQSxHQUFHLEVBQUgsR0FBQTtDQUNFLENBQUEsSUFBTSxFQUFOLEtBQUE7Q0FDUyxHQUFULElBQVEsT0FBUjtRQXBCSTtDQWxEQyxJQWtERDtDQXhEVixHQUFBOztDQUFBLENBOEVBLENBQUcsS0FBSCxRQUFBOztDQTlFQSxDQStFQSxFQUFBLElBQVE7Q0EvRVIiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgYm9keTogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ21haW4nKVswXVxuICBieUlkOiAoeCkgLT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgeFxuICBzcGVjaW1lbk51bWJlcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgJ3NwZWNpbWVuLW51bWJlcidcbiAgZGltZW5zaW9uTnVtYmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCAnZGltZW5zaW9uLW51bWJlcidcbiAgY2VsbE51bWJlcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgJ2NlbGwtbnVtYmVyJ1xuICBkaW1lbnNpb25TaXplOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCAnZGltZW5zaW9uLXNpemUnXG4gIGFkZEV2ZW50SGFuZGxlcnM6IChpbnRlcnZhbCkgLT5cbiAgICBAYnlJZCgnYXBwbHknKS5hZGRFdmVudExpc3RlbmVyICdjbGljaycsIC0+XG4gICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCBpbnRlcnZhbC5pZFxuICAgICAgaW50ZXJ2YWwuaW5pdCgpXG4gICAgQGJ5SWQoJ3N0b3AnKS5hZGRFdmVudExpc3RlbmVyICdjbGljaycsIC0+XG4gICAgICBpZiBpbnRlcnZhbC5pZFxuICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCBpbnRlcnZhbC5pZFxuICAgICAgICB0aGlzLmlubmVySFRNTCA9ICdjb250aW51ZSdcbiAgICAgICAgaW50ZXJ2YWwuaWQgPSB1bmRlZmluZWRcbiAgICAgIGVsc2VcbiAgICAgICAgaW50ZXJ2YWwuaWQgPSB3aW5kb3cuc2V0SW50ZXJ2YWwgaW50ZXJ2YWwucmVwZWF0LCAxMDBcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSAnc3RvcCdcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gKHNwZWNpbWVuKSAtPlxuICBzdGF0ZSA9IHNwZWNpbWVuLnRyZWVcbiAgZWxlbWVudCA9IHNwZWNpbWVuLmVsZW1lbnRcbiAgc2l6ZSA9IHNwZWNpbWVuLnBhcmFtZXRlcnMubnVtYmVyT2ZDZWxsc1BlckRpbWVuc2lvblxuICBwcm9qZWN0aW9uTnVtID0gc3BlY2ltZW4ucGFyYW1ldGVycy5udW1iZXJPZkRpbWVuc2lvbnNcbiAgY2VsbHNUb1RvZ2dsZSA9IHNwZWNpbWVuLmNlbGxzVG9Ub2dnbGVcbiAgc3dpdGNoIHByb2plY3Rpb25OdW1cbiAgICB3aGVuIDFcbiAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gJ1RoaXMgc3RhdGUgaXMgdW5yZW5kZXJhYmxlISBTZWUgY29uc29sZSBvdXRwdXQuJ1xuICAgIHdoZW4gMlxuICAgICAgZm9yIGNlbGwgaW4gY2VsbHNUb1RvZ2dsZVxuICAgICAgICB4ID0gZWxlbWVudC5jaGlsZE5vZGVzWzBdXG4gICAgICAgIHggPSB4LmNoaWxkTm9kZXNbMF1cbiAgICAgICAgeCA9IHguY2hpbGROb2Rlc1tjZWxsLnBhdGhbMF1dXG4gICAgICAgIHggPSB4LmNoaWxkTm9kZXNbY2VsbC5wYXRoWzFdXVxuICAgICAgICB4LmNsYXNzTGlzdC50b2dnbGUgJ2FsaXZlJ1xuICAgIGVsc2VcbiAgICAgIHByb2plY3QgPSAoc3RhdGUsIGluZGV4KSAtPlxuICAgICAgICBmb3Igcm93IGluIFswLi4uc2l6ZV1cbiAgICAgICAgICBmb3IgY29sdW1uIGluIFswLi4uc2l6ZV1cbiAgICAgICAgICAgIHggPSBlbGVtZW50LmNoaWxkTm9kZXNbfn4oaW5kZXggLyAyKV1cbiAgICAgICAgICAgIHggPSB4LmNoaWxkTm9kZXNbaW5kZXggJSAyXVxuICAgICAgICAgICAgeCA9IHguY2hpbGROb2Rlc1tyb3ddXG4gICAgICAgICAgICB4ID0geC5jaGlsZE5vZGVzW2NvbHVtbl1cbiAgICAgICAgICAgIGlmIHN0YXRlW3Jvd11bY29sdW1uXS5pc0xpdmVcbiAgICAgICAgICAgICAgeC5jbGFzc0xpc3QuYWRkICdhbGl2ZSdcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgeC5jbGFzc0xpc3QucmVtb3ZlICdhbGl2ZSdcbiAgICAgIHJlZHVjZSA9IChzdGF0ZSwgcHJvamVjdGlvbkluZGV4KSAtPlxuICAgICAgICAjIyNcbiAgICAgICAgICBmaXJzdCByZWR1Y2UgbGVhdmVzIHVudGlsIGRlZXBuZXNzIGlzIHByb2plY3Rpb24gSW5kZXggKyAxXG4gICAgICAgICAgdGhlbiBza2lwIDJcbiAgICAgICAgICB0aGVuIG1lcmdlIDIgZGltZW5zaW9uYWwgbWF0cmljZXNcbiAgICAgICAgIyMjXG4gICAgICAgIG1lcmdlMSA9IChhcnJheSkgLT5cbiAgICAgICAgICBmb3IgaiBpbiBbMC4uLnNpemVdXG4gICAgICAgICAgICBhcnJheVswXVtqXS5wYXRoLnNwbGljZSgtMiwxKVxuICAgICAgICAgICAgZm9yIGsgaW4gWzEuLi5zaXplXVxuICAgICAgICAgICAgICBpZiBhcnJheVswXVtqXS5pc0xpdmVcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYXJyYXlbMF1bal0uaXNMaXZlID0gYXJyYXlba11bal0uaXNMaXZlXG4gICAgICAgICAgcmV0dXJuIGFycmF5WzBdXG4gICAgICAgIG1lcmdlMiA9IChhcnJheSkgLT5cbiAgICAgICAgICBmb3IgaSBpbiBbMC4uLnNpemVdXG4gICAgICAgICAgICBmb3IgaiBpbiBbMC4uLnNpemVdXG4gICAgICAgICAgICAgIGFycmF5WzBdW2ldW2pdLnBhdGguc3BsaWNlKC0zLDEpXG4gICAgICAgICAgICAgIGZvciBrIGluIFsxLi4uc2l6ZV1cbiAgICAgICAgICAgICAgICBpZiAoYXJyYXlbMF1baV1bal0uaXNMaXZlKVxuICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICBhcnJheVswXVtpXVtqXS5pc0xpdmUgPSBhcnJheVtrXVtpXVtqXS5pc0xpdmVcbiAgICAgICAgICByZXR1cm4gYXJyYXlbMF1cbiAgICAgICAgbWVyZ2UgPSAoYXJyYXkpIC0+XG4gICAgICAgICAgdmFsdWUgPSBhcnJheS5yZWR1Y2UgKChhLCBjKSAtPiBpZiBjLmlzTGl2ZSB0aGVuIGEgKyAxIGVsc2UgYSksIDBcbiAgICAgICAgICBhcnJheVswXS5wYXRoLnBvcCgpXG4gICAgICAgICAgcmVkdWNlZENlbGwgPSBpc0xpdmU6ICEhdmFsdWUsIHBhdGg6IGFycmF5WzBdLnBhdGhcbiAgICAgICAgICByZXR1cm4gcmVkdWNlZENlbGxcbiAgICAgICAgaXRlciA9IChkaW1lbnNpb25zLCBkZWVwbmVzcykgLT5cbiAgICAgICAgICBpZiBkaW1lbnNpb25zLnBhdGggIyBpcyBsYXN0IGRpbWVuc2lvblxuICAgICAgICAgICAgcmV0dXJuIGRpbWVuc2lvbnNcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgIyBwb3AgZXZlcnkgcmVkdWNlXG4gICAgICAgICAgIyBpcyBnb29kPyByZXR1cm4gYXJyYXksIGVsc2UgbWVyZ2UgZGVwZW5kZW50IG9uIG51bWJlciBvZiBnb29kXG4gICAgICAgICAgIyBpcyBhcnJheSBvZiBwYmtlY3RzLiBlbGVzZSBhcnJheSBvZiBhcnJheXNcbiAgICAgICAgICAgIGFycmF5ID0gW11cbiAgICAgICAgICAgIGZvciBpIGluIFswLi4uc2l6ZV1cbiAgICAgICAgICAgICAgYXJyYXkucHVzaCBpdGVyIGRpbWVuc2lvbnNbaV0sIGRlZXBuZXNzICsgMVxuICAgICAgICAgICAgaWYgZGVlcG5lc3MgaXMgcHJvamVjdGlvbkluZGV4IG9yIGRlZXBuZXNzIGlzIChwcm9qZWN0aW9uSW5kZXggKyAxKSAlIHByb2plY3Rpb25OdW1cbiAgICAgICAgICAgICAgcmV0dXJuIGFycmF5XG4gICAgICAgICAgICBpZiBhcnJheVswXS5wYXRoXG4gICAgICAgICAgICAgIHJldHVybiBtZXJnZSBhcnJheVxuICAgICAgICAgICAgaWYgYXJyYXlbMF1bMF0ucGF0aFxuICAgICAgICAgICAgICByZXR1cm4gbWVyZ2UxIGFycmF5XG4gICAgICAgICAgICBpZiBhcnJheVswXVswXVswXS5wYXRoXG4gICAgICAgICAgICAgIHJldHVybiBtZXJnZTIgYXJyYXlcbiAgICAgICAgaXRlciBzdGF0ZSwgMFxuICAgICAgZm9yIGkgaW4gWzAuLi5wcm9qZWN0aW9uTnVtXVxuICAgICAgICBfc3RhdGUgPSBKU09OLnBhcnNlIEpTT04uc3RyaW5naWZ5IHN0YXRlXG4gICAgICAgIHByb2plY3QgKHJlZHVjZSBfc3RhdGUsIGkpLCBpXG4gICAgI2VsZW1lbnQuaW5uZXJIVE1MID0gJ1RoaXMgc3RhdGUgaXMgdW5yZW5kZXJhYmxlISBTZWUgY29uc29sZSBvdXRwdXQuJ1xuIyMjXG4gICAgUHJvamVjdCBtdWx0aS1kaW1lbnNpb25hbCBzdGF0ZXMgdG8gMkRcbiAgICBlLmcuIHN0YXRlW2ldW2pdW3JlZHVjZWRdLi5bc3RhdGVzXVxuIyMjXG4iLCJtb2R1bGUuZXhwb3J0cyA9IChzcGVjaW1lbikgLT5cbiAgbGlzdCA9IHNwZWNpbWVuLmxpc3RcbiAgc3BlY2ltZW4uY2VsbHNUb1RvZ2dsZSA9IFtdXG4gIGRpbWVuc2lvblNpemUgPSBzcGVjaW1lbi5wYXJhbWV0ZXJzLm51bWJlck9mQ2VsbHNQZXJEaW1lbnNpb25cbiAgZGltZW5zaW9uTnVtID0gc3BlY2ltZW4ucGFyYW1ldGVycy5udW1iZXJPZkRpbWVuc2lvbnNcbiMgTnVtYmVyIG9mIGFkamFjZW50IGNlbGxzID0gMyBeIG51bWJlck9mRGltZW5zaW9ucyAtIDFcbiAgbnVtYmVyT2ZBZGphY2VudENlbGxzID0gTWF0aC5wb3coMywgZGltZW5zaW9uTnVtKSAtIDFcbiAgayA9IDEgLyA4ICogbnVtYmVyT2ZBZGphY2VudENlbGxzXG4gIGZvciBncm91cCBpbiBsaXN0XG4gICAgY291bnRlciA9IDBcbiAgICBmb3IgaSBpbiBbMS4ubnVtYmVyT2ZBZGphY2VudENlbGxzXVxuICAgICAgaWYgZ3JvdXBbaV0uaXNMaXZlXG4gICAgICAgIGNvdW50ZXIrK1xuICAgIGdpdmVuQ2VsbCA9IGdyb3VwWzBdXG4gICAgaWYgZ2l2ZW5DZWxsLmlzTGl2ZVxuICAgICAgaWYgY291bnRlciA8IDIgb3IgY291bnRlciA+IDNcbiAgICAgICAgc3BlY2ltZW4uY2VsbHNUb1RvZ2dsZS5wdXNoIGdpdmVuQ2VsbFxuICAgIGVsc2VcbiAgICAgIGlmIGNvdW50ZXIgPiAyIGFuZCBjb3VudGVyIDwgNFxuICAgICAgICBzcGVjaW1lbi5jZWxsc1RvVG9nZ2xlLnB1c2ggZ2l2ZW5DZWxsXG5cbiAgZm9yIGNlbGwgaW4gc3BlY2ltZW4uY2VsbHNUb1RvZ2dsZVxuICAgIGNlbGwuaXNMaXZlID0gISBjZWxsLmlzTGl2ZVxuXG4gIHN0cmluZyA9IGxpc3QudG9TdHJpbmcoKVxuICBpZiBzcGVjaW1lbi5jZWxsc1RvVG9nZ2xlLmxlbmd0aCBpcyAwXG4gICAgc3BlY2ltZW4uc3RhdHVzID0gJ2VtcHR5J1xuICAgIGlmIChzdHJpbmcuaW5kZXhPZiAnMScpIGlzbnQgLTFcbiAgICAgIHNwZWNpbWVuLnN0YXR1cyA9ICdzdGlsbCdcbiAgZWxzZVxuICAgIGZvciBwcmV2aW91cywgaW5kZXggaW4gc3BlY2ltZW4uc3RhdGVzXG4gICAgICBpZiBzdHJpbmcgaXMgcHJldmlvdXNcbiAgICAgICAgc3BlY2ltZW4uc3RhdHVzID0gJ3BlcmlvZCAnICsgKHNwZWNpbWVuLnN0YXRlcy5sZW5ndGggLSBpbmRleClcbiAgc3BlY2ltZW4uc3RhdGVzLnB1c2ggc3RyaW5nXG4gIHNwZWNpbWVuLmFnZSsrXG4iLCJtb2R1bGUuZXhwb3J0cyA9IChyYW5nZSkgLT5cbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlKVxuIiwicmFuZG9tID0gcmVxdWlyZSAnLi9yYW5kb20uY29mZmVlJ1xubW9kdWxlLmV4cG9ydHMgPSAob3B0aW9ucykgLT5cbiAgZGltZW5zaW9uTnVtID0gb3B0aW9ucy5udW1iZXJPZkRpbWVuc2lvbnNcbiAgZGltZW5zaW9uU2l6ZSA9IG9wdGlvbnMubnVtYmVyT2ZDZWxsc1BlckRpbWVuc2lvblxuICBwb3B1bGF0aW9uU2l6ZSA9IG9wdGlvbnMubnVtYmVyT2ZMaXZlQ2VsbHNQZXJJbml0aWFsUG9wdWxhdGlvblxuICBzdGF0ZVRyZWUgPSBbXVxuICBjbG9uZSA9IChvYmplY3QpIC0+XG4gICAgb2JqZWN0ID0gSlNPTi5zdHJpbmdpZnkgb2JqZWN0XG4gICAgcmV0dXJuIEpTT04ucGFyc2Ugb2JqZWN0XG5cbiAgaW5pdCA9IChzdWJUcmVlLCBkaW1lbnNpb25zTGVmdCwgcGF0aCkgLT5cbiAgICBpZiBkaW1lbnNpb25zTGVmdFxuICAgICAgaSA9IGRpbWVuc2lvblNpemVcbiAgICAgIHdoaWxlKGktLSlcbiAgICAgICAgZGltZW5zaW9uUGF0aCA9IGNsb25lIHBhdGhcbiAgICAgICAgZGltZW5zaW9uUGF0aC5wdXNoIGlcbiAgICAgICAgc3ViVHJlZVtpXSA9IFtdXG4gICAgICAgIGlmIGRpbWVuc2lvbnNMZWZ0IGlzIDFcbiAgICAgICAgICBqID0gZGltZW5zaW9uU2l6ZVxuICAgICAgICAgIHdoaWxlKGotLSlcbiAgICAgICAgICAgIGNlbGxQYXRoID0gY2xvbmUgZGltZW5zaW9uUGF0aFxuICAgICAgICAgICAgY2VsbFBhdGgucHVzaCBqXG4gICAgICAgICAgICBzdWJUcmVlW2ldW2pdID1cbiAgICAgICAgICAgICAgcGF0aDogY2VsbFBhdGhcbiAgICAgICAgaW5pdCBzdWJUcmVlW2ldLCBkaW1lbnNpb25zTGVmdCAtIDEsIGRpbWVuc2lvblBhdGhcblxuICBpbml0IHN0YXRlVHJlZSwgZGltZW5zaW9uTnVtIC0gMSwgW11cbiMgUHJlcGFyZSBmb3IgZmlyc3QgY2VsbCBpbnNlcnRpb25cbiAgcG9wdWxhdGlvbiA9IFtdXG4gIGhhbGZkaW1lbnNpb25TaXplID0gfn4oZGltZW5zaW9uU2l6ZSAvIDIpXG4gIHN1YlRyZWUgPSBzdGF0ZVRyZWVcbiAgY2VsbFBhdGggPSBbXVxuICBkID0gZGltZW5zaW9uTnVtXG4gIHdoaWxlKC0tZClcbiAgICBjZWxsUGF0aC5wdXNoIGhhbGZkaW1lbnNpb25TaXplXG4gICAgc3ViVHJlZSA9IHN1YlRyZWVbaGFsZmRpbWVuc2lvblNpemVdXG4gIGNlbGxQYXRoLnB1c2ggaGFsZmRpbWVuc2lvblNpemVcbiAgcG9wdWxhdGlvbi5wdXNoIGNlbGxQYXRoXG4jIEZpbmFsbHlcbiAgc3ViVHJlZVtoYWxmZGltZW5zaW9uU2l6ZV0uaXNMaXZlID0gdHJ1ZVxuIyBCdWdnZ2dnZ2dnZ2dnZ2dnZ2dzQHRvZG9cbiAgaW5zZXJ0QW5vdGhlck9uZSA9IC0+XG4gICAgY2VsbFBhdGggPSBjbG9uZSBwb3B1bGF0aW9uW3JhbmRvbSBwb3B1bGF0aW9uLmxlbmd0aF1cbiAgIyBTaGlmdCBpdFxuICAgIHNoaWZ0c051bWJlciA9IChyYW5kb20gZGltZW5zaW9uTnVtKSArIDFcbiAgICB3aGlsZShzaGlmdHNOdW1iZXItLSlcbiAgICAgIGkgPSByYW5kb20gZGltZW5zaW9uTnVtXG4gICAgICBpZiByYW5kb20gMlxuICAgICAgICBjZWxsUGF0aFtpXSA9IChjZWxsUGF0aFtpXSArIDEpICUgZGltZW5zaW9uU2l6ZVxuICAgICAgZWxzZVxuICAgICAgICBjZWxsUGF0aFtpXSA9IGNlbGxQYXRoW2ldIC0gMVxuICAgICAgICBpZiBjZWxsUGF0aFtpXSBpcyAtMVxuICAgICAgICAgIGNlbGxQYXRoW2ldID0gZGltZW5zaW9uU2l6ZSAtIDFcbiAgIyBQdXNoIGl0XG4gICAgc3ViVHJlZSA9IHN0YXRlVHJlZVxuICAgIGZvciBkIGluIFswLi4uZGltZW5zaW9uTnVtXVxuICAgICAgeCA9IGNlbGxQYXRoW2RdXG4gICAgICBzdWJUcmVlID0gc3ViVHJlZVt4XVxuICAgIGFscmVhZHlFeGlzdHMgPSBzdWJUcmVlLmlzTGl2ZVxuICAgIGlmIGFscmVhZHlFeGlzdHNcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIGVsc2VcbiAgICAgIHN1YlRyZWUuaXNMaXZlID0gdHJ1ZVxuICAgICAgcG9wdWxhdGlvbi5wdXNoIGNlbGxQYXRoXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgICAgXG4gIHdoaWxlKC0tcG9wdWxhdGlvblNpemUpXG4gICAgd2hpbGUoIWluc2VydEFub3RoZXJPbmUoKSlcbiAgICAgIGNvbnNvbGUubG9nICdDZWxsIGFscmVhZHkgZXhpc3RzLCByZXNwYXduaW5nLidcbiAgIyMjXG4gIHN0YXRlVHJlZVsxNl1bMTVdLmlzTGl2ZSA9IHRydWVcbiAgc3RhdGVUcmVlWzE2XVsxN10uaXNMaXZlID0gdHJ1ZVxuICBwb3B1bGF0aW9uLnB1c2ggWzE2LDE1XVxuICBwb3B1bGF0aW9uLnB1c2ggWzE2LDE3XVxuICAjIyNcbiAgIyMjXG4gIGhlcmUgaSBjcmVhdGUgYSB3b3JraW5nIGxpc3QsIHdoaWNoIGlzIGFuIGFycmF5IG9mIGFycmF5cyBvZlxuICBhZGphc2VudCBwb2ludHMuIEkgYWxzbyBvdmVycmlkZSB0byBzdHJpbmcgbWV0aG9kLCBzbyB0aGF0IHN0cmluZ2lmeVxuICByZXN1bHQgb2YgdGhlIHdob2xlIHRoaW5nIGlzIHNob3J0IGFuZCBuaWNlLlxuICAjIyNcbiAgc3RhdGVMaXN0ID0gW11cbiAgc3RhdGVMaXN0LnRvU3RyaW5nID0gLT5cbiAgICByZXR1cm4gc3RhdGVMaXN0LnJlZHVjZSAoc3RyaW5nLCBhcnJheSkgLT5cbiAgICAgIHJldHVybiBzdHJpbmcgKyBhcnJheS50b1N0cmluZygpXG4gICAgLCAnJ1xuICBuZXN0ZWRNYXAgPSAoZGltZW5zaW9uKSAtPlxuICAgIGlmIG5vdCBkaW1lbnNpb25bMF0ucGF0aFxuICAgICAgZGltZW5zaW9uLm1hcCBuZXN0ZWRNYXBcbiAgICBlbHNlXG4gICAgICBkaW1lbnNpb24ubWFwIChnaXZlbkNlbGwpIC0+XG4gICAgICAgIGFkamFjZW50ID0gW2dpdmVuQ2VsbF1cbiAgICAgICAgYWRqYWNlbnQudG9TdHJpbmcgPSAtPiBpZiB0aGlzWzBdLmlzTGl2ZSB0aGVuIHJldHVybiAxIGVsc2UgcmV0dXJuIDBcbiAgICAgICAgc3RhdGVMaXN0LnB1c2ggYWRqYWNlbnRcbiAgICAgICAgZ2V0QWRqYWNlbnQgPSAoZGltZW5zaW9uSW5kZXgsIGNlbGxPckRpbWVuc2lvbikgLT5cbiAgICAgICAgICBpZiBub3QgY2VsbE9yRGltZW5zaW9uLnBhdGhcbiAgICAgICAgICAgIHN1YmRpbWVuc2lvbiA9IGNlbGxPckRpbWVuc2lvblxuICAgICAgICAgICAgZDEgPSBkMiA9IGdpdmVuQ2VsbC5wYXRoW2RpbWVuc2lvbkluZGV4XVxuICAgICAgICAgICAgbmV4dEluZGV4ID0gZGltZW5zaW9uSW5kZXggKyAxXG4gICAgICAgICAgICBnZXRBZGphY2VudCBuZXh0SW5kZXgsIHN1YmRpbWVuc2lvbltkMV1cbiAgICAgICAgICAgIGlmIGQxIGlzIDBcbiAgICAgICAgICAgICAgZDEgPSBkaW1lbnNpb25TaXplXG4gICAgICAgICAgICBnZXRBZGphY2VudCBuZXh0SW5kZXgsIHN1YmRpbWVuc2lvbltkMSAtIDFdXG4gICAgICAgICAgICBpZiBkMiBpcyBkaW1lbnNpb25TaXplIC0gMVxuICAgICAgICAgICAgICBkMiA9IC0xXG4gICAgICAgICAgICBnZXRBZGphY2VudCBuZXh0SW5kZXgsIHN1YmRpbWVuc2lvbltkMiArIDFdXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgYWRqYWNlbnRDZWxsID0gY2VsbE9yRGltZW5zaW9uXG4gICAgICAgICAgICBpZiBhZGphY2VudENlbGwgaXNudCBnaXZlbkNlbGxcbiAgICAgICAgICAgICAgYWRqYWNlbnQucHVzaCBhZGphY2VudENlbGxcbiAgICAgICAgZ2V0QWRqYWNlbnQgMCwgc3RhdGVUcmVlXG4gIG5lc3RlZE1hcCBzdGF0ZVRyZWVcbiAgcmV0dXJuIHtcbiAgICBsaXN0OiBzdGF0ZUxpc3RcbiAgICB0cmVlOiBzdGF0ZVRyZWVcbiAgICBpbml0aWFsUG9wdWxhdGlvbjogcG9wdWxhdGlvblxuICAgIHBhcmFtZXRlcnM6IG9wdGlvbnNcbiAgfVxuIiwiZ2VuZXJhdGUgPSByZXF1aXJlICcuL2dlbmVyYXRlLmNvZmZlZSdcbm91dHB1dCA9IHJlcXVpcmUgJy4vb3V0cHV0LmNvZmZlZSdcbnByb2Nlc3MgPSByZXF1aXJlICcuL3Byb2Nlc3MuY29mZmVlJ1xuZ3VpID0gcmVxdWlyZSAnLi9ndWkuY29mZmVlJ1xuc3BlY2ltZW5TZXQgPSBudWxsXG5cbmludGVydmFsID0ge1xuICBpbml0OiAtPlxuICAgIHNwZWNpbWVuU2V0ID0gW11cbiAgICBndWkuYm9keS5pbm5lckhUTUwgPSAnJ1xuICAgIGZvciBpIGluIFswLi4uZ3VpLnNwZWNpbWVuTnVtYmVyLnZhbHVlXVxuICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2RpdidcbiAgICAgIGd1aS5ib2R5LmFwcGVuZENoaWxkIGVsZW1lbnRcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlICdpZCcsICdzcGVjaW1lbicgKyBpXG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSAnY2xhc3MnLCAncG9wdWxhdGlvbidcbiAgICAgIGdlbmVyYXRlZCA9IGdlbmVyYXRlIHtcbiAgICAgICAgbnVtYmVyT2ZEaW1lbnNpb25zOiBwYXJzZUludCBndWkuZGltZW5zaW9uTnVtYmVyLnZhbHVlXG4gICAgICAgIG51bWJlck9mQ2VsbHNQZXJEaW1lbnNpb246IHBhcnNlSW50IGd1aS5kaW1lbnNpb25TaXplLnZhbHVlXG4gICAgICAgIG51bWJlck9mTGl2ZUNlbGxzUGVySW5pdGlhbFBvcHVsYXRpb246IHBhcnNlSW50IGd1aS5jZWxsTnVtYmVyLnZhbHVlXG4gICAgICB9XG4gICAgICBzcGVjaW1lbiA9XG4gICAgICAgIGxpc3Q6IGdlbmVyYXRlZC5saXN0XG4gICAgICAgIHRyZWU6IGdlbmVyYXRlZC50cmVlXG4gICAgICAgIHN0YXRlczogW2dlbmVyYXRlZC5saXN0LnRvU3RyaW5nKCldXG4gICAgICAgIHN0YXR1czogJ2xpdmUnXG4gICAgICAgIHBhcmFtZXRlcnM6IGdlbmVyYXRlZC5wYXJhbWV0ZXJzXG4gICAgICAgIGluaXRpYWw6IGdlbmVyYXRlZC5pbml0aWFsUG9wdWxhdGlvblxuICAgICAgICBlbGVtZW50OiBlbGVtZW50XG4gICAgICAgIGFnZTogMFxuICAgICAgc3RyID0gJydcbiAgICAgIHByb2plY3Rpb25OdW0gPSBzcGVjaW1lbi5wYXJhbWV0ZXJzLm51bWJlck9mRGltZW5zaW9uc1xuICAgICAgcHJvamVjdGlvbk51bSA9IDEgaWYgcHJvamVjdGlvbk51bSBpcyAyXG4gICAgICBmb3IgaiBpbiBbMC4uLnByb2plY3Rpb25OdW1dXG4gICAgICAgIGlmIChqICUgMiBpcyAwKVxuICAgICAgICAgIHN0ciArPSAnPGRpdiBjbGFzcz1cImRpbWVuc2lvbi1wYWlyXCI+J1xuICAgICAgICBzdHIgKz0gJzxkaXYgY2xhc3M9XCJkaW1lbnNpb25cIj4nXG4gICAgICAgIGZvciBrIGluIFswLi4uc3BlY2ltZW4ucGFyYW1ldGVycy5udW1iZXJPZkNlbGxzUGVyRGltZW5zaW9uXVxuICAgICAgICAgIHN0ciArPSAnPGRpdiBjbGFzcz1cInJvd1wiPidcbiAgICAgICAgICBpID1cbiAgICAgICAgICBmb3IgbCBpbiBbMC4uLnNwZWNpbWVuLnBhcmFtZXRlcnMubnVtYmVyT2ZDZWxsc1BlckRpbWVuc2lvbl1cbiAgICAgICAgICAgIHN0ciArPSAnPGRpdiBjbGFzcz1cImNlbGxcIj48L2Rpdj4nXG4gICAgICAgICAgc3RyICs9ICc8L2Rpdj4nXG4gICAgICAgIHN0ciArPSAnPC9kaXY+J1xuICAgICAgICBpZiAoaiAlIDIgaXMgMSlcbiAgICAgICAgICBzdHIgKz0gJzwvZGl2PidcbiAgICAgIHNwZWNpbWVuLmVsZW1lbnQuaW5uZXJIVE1MICs9IHN0clxuICAgICAgZGVsZXRlIGdlbmVyYXRlZC5wYXJhbWV0ZXJzXG4gICAgICBkZWxldGUgZ2VuZXJhdGVkLmluaXRpYWxcbiAgICAgIHNwZWNpbWVuU2V0LnB1c2ggc3BlY2ltZW5cblxuICAgIGZvciBzcGVjaW1lbiBpbiBzcGVjaW1lblNldFxuICAgICAgc3BlY2ltZW4uY2VsbHNUb1RvZ2dsZSA9IFtdXG4gICAgICBmb3IgcGF0aCBpbiBzcGVjaW1lbi5pbml0aWFsXG4gICAgICAgIHNwZWNpbWVuLmNlbGxzVG9Ub2dnbGUucHVzaCB7cGF0aDogcGF0aH1cbiAgICAgIG91dHB1dCBzcGVjaW1lblxuICAgIEBpZCA9IHdpbmRvdy5zZXRJbnRlcnZhbCBAcmVwZWF0LCAxMDBcbiAgcmVwZWF0OiAtPlxuICAgIGlzQWxsRG9uZSA9IHRydWVcbiAgICBmb3Igc3BlY2ltZW4sIGkgaW4gc3BlY2ltZW5TZXRcbiAgICAgIGlzQWxsRG9uZSA9IGZhbHNlXG4gICAgICBpZiBzcGVjaW1lbi5zdGF0dXMgaXMgJ2xpdmUnXG4gICAgICAgIHByb2Nlc3Mgc3BlY2ltZW5cbiAgICAgICAgb3V0cHV0IHNwZWNpbWVuXG4gICAgICBlbHNlXG4gICAgICAgIHNwZWNpbWVuLmVsZW1lbnQuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJzdGF0dXNcIj48aDE+JyArXG4gICAgICAgICAgc3BlY2ltZW4uc3RhdHVzICtcbiAgICAgICAgICAnPC9oMT48aDM+YWdlOiAnK1xuICAgICAgICAgIHNwZWNpbWVuLmFnZStcbiAgICAgICAgICAnPC9oMz48L2Rpdj4nK1xuICAgICAgICAgIHNwZWNpbWVuLmVsZW1lbnQuaW5uZXJIVE1MXG4gICAgICAgIGkgPSBzcGVjaW1lblNldC5pbmRleE9mIHNwZWNpbWVuXG4gICAgICAgIHNwZWNpbWVuU2V0LnNwbGljZSBpLCAxXG4gICAgICAgIGJyZWFrXG5cbiAgICBpZiBpc0FsbERvbmVcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsIGludGVydmFsLmlkXG4gICAgICBpbnRlcnZhbC5pbml0KClcbn1cbmd1aS5hZGRFdmVudEhhbmRsZXJzIGludGVydmFsXG5pbnRlcnZhbC5pbml0KClcbiJdfQ==
;