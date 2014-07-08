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
    clear: function() {
      return this.body.innerHTML = '';
    },
    numberOfElementsCreated: 0,
    createElement: function(specimen) {
      var element;
      element = document.createElement('div');
      this.body.appendChild(element);
      element.setAttribute('id', 'specimen' + this.numberOfElementsCreated);
      this.numberOfElementsCreated++;
      element.setAttribute('class', 'population');
      element.createProjections = function() {
        var j, k, l, projectionNum, str, _i, _j, _k, _ref, _ref1;
        str = '';
        projectionNum = specimen.parameters.numberOfDimensions;
        if (projectionNum === 2) {
          projectionNum = 1;
        }
        for (j = _i = 0; 0 <= projectionNum ? _i < projectionNum : _i > projectionNum; j = 0 <= projectionNum ? ++_i : --_i) {
          if (j % 2 === 0) {
            str += '<div class="dimension-pair">';
          }
          str += '<div class="dimension">';
          for (k = _j = 0, _ref = specimen.parameters.numberOfCellsPerDimension; 0 <= _ref ? _j < _ref : _j > _ref; k = 0 <= _ref ? ++_j : --_j) {
            str += '<div class="row">';
            for (l = _k = 0, _ref1 = specimen.parameters.numberOfCellsPerDimension; 0 <= _ref1 ? _k < _ref1 : _k > _ref1; l = 0 <= _ref1 ? ++_k : --_k) {
              str += '<div class="cell"></div>';
            }
            str += '</div>';
          }
          str += '</div>';
          if (j % 2 === 1) {
            str += '</div>';
          }
        }
        return this.innerHTML += str;
      };
      element.createProjections();
      return element;
    },
    setStatus: function(specimen) {
      return specimen.element.innerHTML = '<div class="status"><h1>' + specimen.status + '</h1><h3>age: ' + specimen.age + '</h3></div>' + specimen.element.innerHTML;
    },
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
        reduce = function(state, index) {
          var iter, mergeBranchesOfBranches, mergeBranchesOfLeaves, mergeLeaves;
          mergeBranchesOfLeaves = function(array) {
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
          mergeBranchesOfBranches = function(array) {
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
          mergeLeaves = function(array) {
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
          iter = function(dimensions, level) {
            var array, i, _j;
            if (dimensions.path) {
              return dimensions;
            } else {
              array = [];
              for (i = _j = 0; 0 <= size ? _j < size : _j > size; i = 0 <= size ? ++_j : --_j) {
                array.push(iter(dimensions[i], level + 1));
              }
              if (level === index || level === (index + 1) % projectionNum) {
                return array;
              }
              if (array[0].path) {
                return mergeLeaves(array);
              }
              if (array[0][0].path) {
                return mergeBranchesOfLeaves(array);
              }
              if (array[0][0][0].path) {
                return mergeBranchesOfBranches(array);
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
    var cellPath, cellsToToggle, clone, d, dimensionNum, dimensionSize, halfdimensionSize, init, insertAnotherOne, nestedMap, population, populationSize, stateList, stateTree, subTree;
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
    cellsToToggle = [];
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
    cellsToToggle.push({
      path: cellPath
    });
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
        cellsToToggle.push({
          path: cellPath
        });
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
      parameters: options,
      states: [stateList.toString()],
      status: 'live',
      cellsToToggle: cellsToToggle,
      age: 0
    };
  };

}).call(this);


},{"./random.coffee":4}],6:[function(require,module,exports){
(function(){(function() {
  var generate, gui, interval, oldestSpecimen, output, process, specimenSet;

  generate = require('./generate.coffee');

  output = require('./output.coffee');

  process = require('./process.coffee');

  gui = require('./gui.coffee');

  specimenSet = null;

  oldestSpecimen = {
    age: 0
  };

  interval = {
    init: function() {
      var i, specimen, _i, _ref;
      specimenSet = [];
      gui.clear();
      for (i = _i = 0, _ref = gui.specimenNumber.value; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        specimen = generate({
          numberOfDimensions: parseInt(gui.dimensionNumber.value),
          numberOfCellsPerDimension: parseInt(gui.dimensionSize.value),
          numberOfLiveCellsPerInitialPopulation: parseInt(gui.cellNumber.value)
        });
        specimen.element = gui.createElement(specimen);
        specimenSet.push(specimen);
        output(specimen);
      }
      return this.id = window.setInterval(this.repeat, 100);
    },
    repeat: function() {
      var i, specimen, _i, _len;
      for (i = _i = 0, _len = specimenSet.length; _i < _len; i = ++_i) {
        specimen = specimenSet[i];
        if (specimen.status === 'live') {
          process(specimen);
          output(specimen);
        } else {
          gui.setStatus(specimen);
          i = specimenSet.indexOf(specimen);
          specimenSet.splice(i, 1);
          if (oldestSpecimen.age < specimen.age) {
            oldestSpecimen.age = specimen;
            oldestSpecimen.initialPopulation = specimen.initialPopulation;
          }
          break;
        }
      }
      if (specimenSet.length === 0) {
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvbGlmZS9fYXBwL2d1aS5jb2ZmZWUiLCIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvbGlmZS9fYXBwL291dHB1dC5jb2ZmZWUiLCIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvbGlmZS9fYXBwL3Byb2Nlc3MuY29mZmVlIiwiL2hvbWUvaGVybWFuL2V4cGVyaW1lbnRzL2xpZmUvX2FwcC9yYW5kb20uY29mZmVlIiwiL2hvbWUvaGVybWFuL2V4cGVyaW1lbnRzL2xpZmUvX2FwcC9nZW5lcmF0ZS5jb2ZmZWUiLCIvaG9tZS9oZXJtYW4vZXhwZXJpbWVudHMvbGlmZS9fYXBwL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtDQUFBLENBQUEsQ0FBaUIsR0FBWCxDQUFOO0NBQWlCLENBQ1QsRUFBTixFQUFNLEVBQVEsWUFBUjtDQURTLENBRVQsQ0FBQSxDQUFOLEtBQU87Q0FBZSxPQUFELEtBQVIsQ0FBQTtDQUZFLElBRVQ7Q0FGUyxDQUdDLEVBQWhCLElBQXdCLE1BQXhCLEdBQWdCO0NBSEQsQ0FJRSxFQUFqQixJQUF5QixNQUFSLENBQWpCLEdBQWlCO0NBSkYsQ0FLSCxFQUFaLElBQW9CLEVBQXBCLEdBQVksQ0FBQTtDQUxHLENBTUEsRUFBZixJQUF1QixLQUF2QixDQUFlLEVBQUE7Q0FOQSxDQU9SLENBQUEsQ0FBUCxDQUFBLElBQU87Q0FDSixFQUFpQixDQUFqQixLQUFELElBQUE7Q0FSYSxJQU9SO0NBUFEsQ0FTVSxFQUF6QixtQkFBQTtDQVRlLENBVUEsQ0FBQSxDQUFmLElBQWUsQ0FBQyxJQUFoQjtDQUNFLE1BQUEsR0FBQTtDQUFBLEVBQVUsRUFBQSxDQUFWLENBQUEsQ0FBa0IsS0FBUjtDQUFWLEdBQ0MsRUFBRCxDQUFBLElBQUE7Q0FEQSxDQUUyQixDQUFhLENBQXhDLEVBQUEsQ0FBTyxHQUFvQixFQUEzQixXQUFBO0FBQ0EsQ0FIQSxD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RUFBWixHQUFBLEVBQTNCLEdBQXFELFlBQXJEO0NBRmtCLENBR3FCLENBQVksRUFBWixHQUFBLEVBQXZDLDJCQUFBO0NBSEYsU0FBVztDQUFYLEVBS21CLElBQW5CLENBQUEsS0FBbUI7Q0FMbkIsR0FNQSxJQUFBLEdBQVc7Q0FOWCxLQU9BLEVBQUE7Q0FSRixNQUZBO0NBV0MsQ0FBRCxDQUFNLENBQUwsRUFBVyxLQUFOLEVBQU47Q0FiTyxJQUNIO0NBREcsQ0FjRCxDQUFBLENBQVIsRUFBQSxHQUFRO0NBQ04sU0FBQSxXQUFBO0FBQUEsQ0FBQSxVQUFBLCtDQUFBO21DQUFBO0NBQ0UsR0FBRyxDQUFtQixDQUFuQixFQUFIO0NBQ0UsTUFBQSxDQUFBLEVBQUE7Q0FBQSxLQUNBLEVBQUEsRUFBQTtNQUZGLElBQUE7Q0FJRSxFQUFHLEtBQUgsQ0FBQSxDQUFBO0NBQUEsRUFDSSxJQUFBLENBQUEsRUFBSixDQUFlO0NBRGYsQ0FFc0IsSUFBdEIsSUFBQSxDQUFXO0NBQ1gsRUFBRyxDQUFBLElBQTZCLEVBQWhDLElBQWlCO0NBQ2YsRUFBQSxLQUFBLElBQUEsRUFBYztDQUFkLEVBQ21DLEtBQVEsSUFBM0MsRUFBYyxHQUFkO1lBTEY7Q0FNQSxlQVZGO1VBREY7Q0FBQSxNQUFBO0NBYUEsR0FBRyxDQUFzQixDQUF6QixLQUFjO0NBQ1osQ0FBQSxJQUFNLEVBQU4sS0FBQTtDQUNTLEdBQVQsSUFBUSxPQUFSO1FBaEJJO0NBZEMsSUFjRDtDQXBCVixHQUFBOztDQUFBLENBc0NBLENBQUcsS0FBSCxRQUFBOztDQXRDQSxDQXVDQSxFQUFBLElBQVE7Q0F2Q1IiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgYm9keTogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ21haW4nKVswXVxuICBieUlkOiAoeCkgLT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgeFxuICBzcGVjaW1lbk51bWJlcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgJ3NwZWNpbWVuLW51bWJlcidcbiAgZGltZW5zaW9uTnVtYmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCAnZGltZW5zaW9uLW51bWJlcidcbiAgY2VsbE51bWJlcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgJ2NlbGwtbnVtYmVyJ1xuICBkaW1lbnNpb25TaXplOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCAnZGltZW5zaW9uLXNpemUnXG4gIGNsZWFyOiAtPlxuICAgIEBib2R5LmlubmVySFRNTCA9ICcnXG4gIG51bWJlck9mRWxlbWVudHNDcmVhdGVkOiAwXG4gIGNyZWF0ZUVsZW1lbnQ6IChzcGVjaW1lbikgLT5cbiAgICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuICAgIEBib2R5LmFwcGVuZENoaWxkIGVsZW1lbnRcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSAnaWQnLCAnc3BlY2ltZW4nICsgQG51bWJlck9mRWxlbWVudHNDcmVhdGVkXG4gICAgQG51bWJlck9mRWxlbWVudHNDcmVhdGVkKytcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSAnY2xhc3MnLCAncG9wdWxhdGlvbidcbiAgICBlbGVtZW50LmNyZWF0ZVByb2plY3Rpb25zID0gLT5cbiAgICAgIHN0ciA9ICcnXG4gICAgICBwcm9qZWN0aW9uTnVtID0gc3BlY2ltZW4ucGFyYW1ldGVycy5udW1iZXJPZkRpbWVuc2lvbnNcbiAgICAgIHByb2plY3Rpb25OdW0gPSAxIGlmIHByb2plY3Rpb25OdW0gaXMgMlxuICAgICAgZm9yIGogaW4gWzAuLi5wcm9qZWN0aW9uTnVtXVxuICAgICAgICBpZiAoaiAlIDIgaXMgMClcbiAgICAgICAgICBzdHIgKz0gJzxkaXYgY2xhc3M9XCJkaW1lbnNpb24tcGFpclwiPidcbiAgICAgICAgc3RyICs9ICc8ZGl2IGNsYXNzPVwiZGltZW5zaW9uXCI+J1xuICAgICAgICBmb3IgayBpbiBbMC4uLnNwZWNpbWVuLnBhcmFtZXRlcnMubnVtYmVyT2ZDZWxsc1BlckRpbWVuc2lvbl1cbiAgICAgICAgICBzdHIgKz0gJzxkaXYgY2xhc3M9XCJyb3dcIj4nXG4gICAgICAgICAgZm9yIGwgaW4gWzAuLi5zcGVjaW1lbi5wYXJhbWV0ZXJzLm51bWJlck9mQ2VsbHNQZXJEaW1lbnNpb25dXG4gICAgICAgICAgICBzdHIgKz0gJzxkaXYgY2xhc3M9XCJjZWxsXCI+PC9kaXY+J1xuICAgICAgICAgIHN0ciArPSAnPC9kaXY+J1xuICAgICAgICBzdHIgKz0gJzwvZGl2PidcbiAgICAgICAgaWYgKGogJSAyIGlzIDEpXG4gICAgICAgICAgc3RyICs9ICc8L2Rpdj4nXG4gICAgICBAaW5uZXJIVE1MICs9IHN0clxuXG4gICAgZWxlbWVudC5jcmVhdGVQcm9qZWN0aW9ucygpXG4gICAgcmV0dXJuIGVsZW1lbnRcbiAgc2V0U3RhdHVzOiAoc3BlY2ltZW4pIC0+XG4gICAgc3BlY2ltZW4uZWxlbWVudC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cInN0YXR1c1wiPjxoMT4nICtcbiAgICAgIHNwZWNpbWVuLnN0YXR1cyArXG4gICAgICAnPC9oMT48aDM+YWdlOiAnK1xuICAgICAgc3BlY2ltZW4uYWdlK1xuICAgICAgJzwvaDM+PC9kaXY+JytcbiAgICAgIHNwZWNpbWVuLmVsZW1lbnQuaW5uZXJIVE1MXG4gIGFkZEV2ZW50SGFuZGxlcnM6IChpbnRlcnZhbCkgLT5cbiAgICBAYnlJZCgnYXBwbHknKS5hZGRFdmVudExpc3RlbmVyICdjbGljaycsIC0+XG4gICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCBpbnRlcnZhbC5pZFxuICAgICAgaW50ZXJ2YWwuaW5pdCgpXG4gICAgQGJ5SWQoJ3N0b3AnKS5hZGRFdmVudExpc3RlbmVyICdjbGljaycsIC0+XG4gICAgICBpZiBpbnRlcnZhbC5pZFxuICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCBpbnRlcnZhbC5pZFxuICAgICAgICB0aGlzLmlubmVySFRNTCA9ICdjb250aW51ZSdcbiAgICAgICAgaW50ZXJ2YWwuaWQgPSB1bmRlZmluZWRcbiAgICAgIGVsc2VcbiAgICAgICAgaW50ZXJ2YWwuaWQgPSB3aW5kb3cuc2V0SW50ZXJ2YWwgaW50ZXJ2YWwucmVwZWF0LCAxMDBcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSAnc3RvcCdcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gKHNwZWNpbWVuKSAtPlxuICBzdGF0ZSA9IHNwZWNpbWVuLnRyZWVcbiAgZWxlbWVudCA9IHNwZWNpbWVuLmVsZW1lbnRcbiAgc2l6ZSA9IHNwZWNpbWVuLnBhcmFtZXRlcnMubnVtYmVyT2ZDZWxsc1BlckRpbWVuc2lvblxuICBwcm9qZWN0aW9uTnVtID0gc3BlY2ltZW4ucGFyYW1ldGVycy5udW1iZXJPZkRpbWVuc2lvbnNcbiAgY2VsbHNUb1RvZ2dsZSA9IHNwZWNpbWVuLmNlbGxzVG9Ub2dnbGVcbiAgc3dpdGNoIHByb2plY3Rpb25OdW1cbiAgICB3aGVuIDFcbiAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gJ1RoaXMgc3RhdGUgaXMgdW5yZW5kZXJhYmxlISBTZWUgY29uc29sZSBvdXRwdXQuJ1xuICAgIHdoZW4gMlxuICAgICAgZm9yIGNlbGwgaW4gY2VsbHNUb1RvZ2dsZVxuICAgICAgICB4ID0gZWxlbWVudC5jaGlsZE5vZGVzWzBdXG4gICAgICAgIHggPSB4LmNoaWxkTm9kZXNbMF1cbiAgICAgICAgeCA9IHguY2hpbGROb2Rlc1tjZWxsLnBhdGhbMF1dXG4gICAgICAgIHggPSB4LmNoaWxkTm9kZXNbY2VsbC5wYXRoWzFdXVxuICAgICAgICB4LmNsYXNzTGlzdC50b2dnbGUgJ2FsaXZlJ1xuICAgIGVsc2VcbiAgICAgIHByb2plY3QgPSAoc3RhdGUsIGluZGV4KSAtPlxuICAgICAgICBmb3Igcm93IGluIFswLi4uc2l6ZV1cbiAgICAgICAgICBmb3IgY29sdW1uIGluIFswLi4uc2l6ZV1cbiAgICAgICAgICAgIHggPSBlbGVtZW50LmNoaWxkTm9kZXNbfn4oaW5kZXggLyAyKV1cbiAgICAgICAgICAgIHggPSB4LmNoaWxkTm9kZXNbaW5kZXggJSAyXVxuICAgICAgICAgICAgeCA9IHguY2hpbGROb2Rlc1tyb3ddXG4gICAgICAgICAgICB4ID0geC5jaGlsZE5vZGVzW2NvbHVtbl1cbiAgICAgICAgICAgIGlmIHN0YXRlW3Jvd11bY29sdW1uXS5pc0xpdmVcbiAgICAgICAgICAgICAgeC5jbGFzc0xpc3QuYWRkICdhbGl2ZSdcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgeC5jbGFzc0xpc3QucmVtb3ZlICdhbGl2ZSdcbiAgICAgIHJlZHVjZSA9IChzdGF0ZSwgaW5kZXgpIC0+XG4gICAgICAgIG1lcmdlQnJhbmNoZXNPZkxlYXZlcyA9IChhcnJheSkgLT5cbiAgICAgICAgICBmb3IgaiBpbiBbMC4uLnNpemVdXG4gICAgICAgICAgICBhcnJheVswXVtqXS5wYXRoLnNwbGljZSgtMiwxKVxuICAgICAgICAgICAgZm9yIGsgaW4gWzEuLi5zaXplXVxuICAgICAgICAgICAgICBpZiBhcnJheVswXVtqXS5pc0xpdmVcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYXJyYXlbMF1bal0uaXNMaXZlID0gYXJyYXlba11bal0uaXNMaXZlXG4gICAgICAgICAgcmV0dXJuIGFycmF5WzBdXG4gICAgICAgIG1lcmdlQnJhbmNoZXNPZkJyYW5jaGVzID0gKGFycmF5KSAtPlxuICAgICAgICAgIGZvciBpIGluIFswLi4uc2l6ZV1cbiAgICAgICAgICAgIGZvciBqIGluIFswLi4uc2l6ZV1cbiAgICAgICAgICAgICAgYXJyYXlbMF1baV1bal0ucGF0aC5zcGxpY2UoLTMsMSlcbiAgICAgICAgICAgICAgZm9yIGsgaW4gWzEuLi5zaXplXVxuICAgICAgICAgICAgICAgIGlmIChhcnJheVswXVtpXVtqXS5pc0xpdmUpXG4gICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgIGFycmF5WzBdW2ldW2pdLmlzTGl2ZSA9IGFycmF5W2tdW2ldW2pdLmlzTGl2ZVxuICAgICAgICAgIHJldHVybiBhcnJheVswXVxuICAgICAgICBtZXJnZUxlYXZlcyA9IChhcnJheSkgLT5cbiAgICAgICAgICB2YWx1ZSA9IGFycmF5LnJlZHVjZSAoKGEsIGMpIC0+IGlmIGMuaXNMaXZlIHRoZW4gYSArIDEgZWxzZSBhKSwgMFxuICAgICAgICAgIGFycmF5WzBdLnBhdGgucG9wKClcbiAgICAgICAgICByZWR1Y2VkQ2VsbCA9IGlzTGl2ZTogISF2YWx1ZSwgcGF0aDogYXJyYXlbMF0ucGF0aFxuICAgICAgICAgIHJldHVybiByZWR1Y2VkQ2VsbFxuICAgICAgICBpdGVyID0gKGRpbWVuc2lvbnMsIGxldmVsKSAtPlxuICAgICAgICAgIGlmIGRpbWVuc2lvbnMucGF0aCAjIGlzIGxhc3QgZGltZW5zaW9uXG4gICAgICAgICAgICByZXR1cm4gZGltZW5zaW9uc1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGFycmF5ID0gW11cbiAgICAgICAgICAgIGZvciBpIGluIFswLi4uc2l6ZV1cbiAgICAgICAgICAgICAgYXJyYXkucHVzaCBpdGVyIGRpbWVuc2lvbnNbaV0sIGxldmVsICsgMVxuICAgICAgICAgICAgaWYgbGV2ZWwgaXMgaW5kZXggb3IgbGV2ZWwgaXMgKGluZGV4ICsgMSkgJSBwcm9qZWN0aW9uTnVtXG4gICAgICAgICAgICAgIHJldHVybiBhcnJheVxuICAgICAgICAgICAgaWYgYXJyYXlbMF0ucGF0aFxuICAgICAgICAgICAgICByZXR1cm4gbWVyZ2VMZWF2ZXMgYXJyYXlcbiAgICAgICAgICAgIGlmIGFycmF5WzBdWzBdLnBhdGhcbiAgICAgICAgICAgICAgcmV0dXJuIG1lcmdlQnJhbmNoZXNPZkxlYXZlcyBhcnJheVxuICAgICAgICAgICAgaWYgYXJyYXlbMF1bMF1bMF0ucGF0aFxuICAgICAgICAgICAgICByZXR1cm4gbWVyZ2VCcmFuY2hlc09mQnJhbmNoZXMgYXJyYXlcbiAgICAgICAgaXRlciBzdGF0ZSwgMFxuICAgICAgZm9yIGkgaW4gWzAuLi5wcm9qZWN0aW9uTnVtXVxuICAgICAgICBfc3RhdGUgPSBKU09OLnBhcnNlIEpTT04uc3RyaW5naWZ5IHN0YXRlXG4gICAgICAgIHByb2plY3QgKHJlZHVjZSBfc3RhdGUsIGkpLCBpXG4gICAgI2VsZW1lbnQuaW5uZXJIVE1MID0gJ1RoaXMgc3RhdGUgaXMgdW5yZW5kZXJhYmxlISBTZWUgY29uc29sZSBvdXRwdXQuJ1xuIyMjXG4gICAgUHJvamVjdCBtdWx0aS1kaW1lbnNpb25hbCBzdGF0ZXMgdG8gMkRcbiAgICBlLmcuIHN0YXRlW2ldW2pdW3JlZHVjZWRdLi5bc3RhdGVzXVxuIyMjXG4iLCJtb2R1bGUuZXhwb3J0cyA9IChzcGVjaW1lbikgLT5cbiAgbGlzdCA9IHNwZWNpbWVuLmxpc3RcbiAgc3BlY2ltZW4uY2VsbHNUb1RvZ2dsZSA9IFtdXG4gIGRpbWVuc2lvblNpemUgPSBzcGVjaW1lbi5wYXJhbWV0ZXJzLm51bWJlck9mQ2VsbHNQZXJEaW1lbnNpb25cbiAgZGltZW5zaW9uTnVtID0gc3BlY2ltZW4ucGFyYW1ldGVycy5udW1iZXJPZkRpbWVuc2lvbnNcbiMgTnVtYmVyIG9mIGFkamFjZW50IGNlbGxzID0gMyBeIG51bWJlck9mRGltZW5zaW9ucyAtIDFcbiAgbnVtYmVyT2ZBZGphY2VudENlbGxzID0gTWF0aC5wb3coMywgZGltZW5zaW9uTnVtKSAtIDFcbiAgayA9IDEgLyA4ICogbnVtYmVyT2ZBZGphY2VudENlbGxzXG4gIGZvciBncm91cCBpbiBsaXN0XG4gICAgY291bnRlciA9IDBcbiAgICBmb3IgaSBpbiBbMS4ubnVtYmVyT2ZBZGphY2VudENlbGxzXVxuICAgICAgaWYgZ3JvdXBbaV0uaXNMaXZlXG4gICAgICAgIGNvdW50ZXIrK1xuICAgIGdpdmVuQ2VsbCA9IGdyb3VwWzBdXG4gICAgaWYgZ2l2ZW5DZWxsLmlzTGl2ZVxuICAgICAgaWYgY291bnRlciA8IDIgb3IgY291bnRlciA+IDNcbiAgICAgICAgc3BlY2ltZW4uY2VsbHNUb1RvZ2dsZS5wdXNoIGdpdmVuQ2VsbFxuICAgIGVsc2VcbiAgICAgIGlmIGNvdW50ZXIgPiAyIGFuZCBjb3VudGVyIDwgNFxuICAgICAgICBzcGVjaW1lbi5jZWxsc1RvVG9nZ2xlLnB1c2ggZ2l2ZW5DZWxsXG5cbiAgZm9yIGNlbGwgaW4gc3BlY2ltZW4uY2VsbHNUb1RvZ2dsZVxuICAgIGNlbGwuaXNMaXZlID0gISBjZWxsLmlzTGl2ZVxuXG4gIHN0cmluZyA9IGxpc3QudG9TdHJpbmcoKVxuICBpZiBzcGVjaW1lbi5jZWxsc1RvVG9nZ2xlLmxlbmd0aCBpcyAwXG4gICAgc3BlY2ltZW4uc3RhdHVzID0gJ2VtcHR5J1xuICAgIGlmIChzdHJpbmcuaW5kZXhPZiAnMScpIGlzbnQgLTFcbiAgICAgIHNwZWNpbWVuLnN0YXR1cyA9ICdzdGlsbCdcbiAgZWxzZVxuICAgIGZvciBwcmV2aW91cywgaW5kZXggaW4gc3BlY2ltZW4uc3RhdGVzXG4gICAgICBpZiBzdHJpbmcgaXMgcHJldmlvdXNcbiAgICAgICAgc3BlY2ltZW4uc3RhdHVzID0gJ3BlcmlvZCAnICsgKHNwZWNpbWVuLnN0YXRlcy5sZW5ndGggLSBpbmRleClcbiAgc3BlY2ltZW4uc3RhdGVzLnB1c2ggc3RyaW5nXG4gIHNwZWNpbWVuLmFnZSsrXG4iLCJtb2R1bGUuZXhwb3J0cyA9IChyYW5nZSkgLT5cbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJhbmdlKVxuIiwicmFuZG9tID0gcmVxdWlyZSAnLi9yYW5kb20uY29mZmVlJ1xubW9kdWxlLmV4cG9ydHMgPSAob3B0aW9ucykgLT5cbiAgZGltZW5zaW9uTnVtID0gb3B0aW9ucy5udW1iZXJPZkRpbWVuc2lvbnNcbiAgZGltZW5zaW9uU2l6ZSA9IG9wdGlvbnMubnVtYmVyT2ZDZWxsc1BlckRpbWVuc2lvblxuICBwb3B1bGF0aW9uU2l6ZSA9IG9wdGlvbnMubnVtYmVyT2ZMaXZlQ2VsbHNQZXJJbml0aWFsUG9wdWxhdGlvblxuICBzdGF0ZVRyZWUgPSBbXVxuICBjbG9uZSA9IChvYmplY3QpIC0+XG4gICAgb2JqZWN0ID0gSlNPTi5zdHJpbmdpZnkgb2JqZWN0XG4gICAgcmV0dXJuIEpTT04ucGFyc2Ugb2JqZWN0XG5cbiAgaW5pdCA9IChzdWJUcmVlLCBkaW1lbnNpb25zTGVmdCwgcGF0aCkgLT5cbiAgICBpZiBkaW1lbnNpb25zTGVmdFxuICAgICAgaSA9IGRpbWVuc2lvblNpemVcbiAgICAgIHdoaWxlKGktLSlcbiAgICAgICAgZGltZW5zaW9uUGF0aCA9IGNsb25lIHBhdGhcbiAgICAgICAgZGltZW5zaW9uUGF0aC5wdXNoIGlcbiAgICAgICAgc3ViVHJlZVtpXSA9IFtdXG4gICAgICAgIGlmIGRpbWVuc2lvbnNMZWZ0IGlzIDFcbiAgICAgICAgICBqID0gZGltZW5zaW9uU2l6ZVxuICAgICAgICAgIHdoaWxlKGotLSlcbiAgICAgICAgICAgIGNlbGxQYXRoID0gY2xvbmUgZGltZW5zaW9uUGF0aFxuICAgICAgICAgICAgY2VsbFBhdGgucHVzaCBqXG4gICAgICAgICAgICBzdWJUcmVlW2ldW2pdID1cbiAgICAgICAgICAgICAgcGF0aDogY2VsbFBhdGhcbiAgICAgICAgaW5pdCBzdWJUcmVlW2ldLCBkaW1lbnNpb25zTGVmdCAtIDEsIGRpbWVuc2lvblBhdGhcblxuICBpbml0IHN0YXRlVHJlZSwgZGltZW5zaW9uTnVtIC0gMSwgW11cbiMgUHJlcGFyZSBmb3IgZmlyc3QgY2VsbCBpbnNlcnRpb25cbiAgcG9wdWxhdGlvbiA9IFtdXG4gIGNlbGxzVG9Ub2dnbGUgPSBbXVxuICBoYWxmZGltZW5zaW9uU2l6ZSA9IH5+KGRpbWVuc2lvblNpemUgLyAyKVxuICBzdWJUcmVlID0gc3RhdGVUcmVlXG4gIGNlbGxQYXRoID0gW11cbiAgZCA9IGRpbWVuc2lvbk51bVxuICB3aGlsZSgtLWQpXG4gICAgY2VsbFBhdGgucHVzaCBoYWxmZGltZW5zaW9uU2l6ZVxuICAgIHN1YlRyZWUgPSBzdWJUcmVlW2hhbGZkaW1lbnNpb25TaXplXVxuICBjZWxsUGF0aC5wdXNoIGhhbGZkaW1lbnNpb25TaXplXG4gIHBvcHVsYXRpb24ucHVzaCBjZWxsUGF0aFxuICBjZWxsc1RvVG9nZ2xlLnB1c2gge3BhdGg6IGNlbGxQYXRofVxuIyBGaW5hbGx5XG4gIHN1YlRyZWVbaGFsZmRpbWVuc2lvblNpemVdLmlzTGl2ZSA9IHRydWVcbiMgQnVnZ2dnZ2dnZ2dnZ2dnZ2dnc0B0b2RvXG4gIGluc2VydEFub3RoZXJPbmUgPSAtPlxuICAgIGNlbGxQYXRoID0gY2xvbmUgcG9wdWxhdGlvbltyYW5kb20gcG9wdWxhdGlvbi5sZW5ndGhdXG4gICMgU2hpZnQgaXRcbiAgICBzaGlmdHNOdW1iZXIgPSAocmFuZG9tIGRpbWVuc2lvbk51bSkgKyAxXG4gICAgd2hpbGUoc2hpZnRzTnVtYmVyLS0pXG4gICAgICBpID0gcmFuZG9tIGRpbWVuc2lvbk51bVxuICAgICAgaWYgcmFuZG9tIDJcbiAgICAgICAgY2VsbFBhdGhbaV0gPSAoY2VsbFBhdGhbaV0gKyAxKSAlIGRpbWVuc2lvblNpemVcbiAgICAgIGVsc2VcbiAgICAgICAgY2VsbFBhdGhbaV0gPSBjZWxsUGF0aFtpXSAtIDFcbiAgICAgICAgaWYgY2VsbFBhdGhbaV0gaXMgLTFcbiAgICAgICAgICBjZWxsUGF0aFtpXSA9IGRpbWVuc2lvblNpemUgLSAxXG4gICMgUHVzaCBpdFxuICAgIHN1YlRyZWUgPSBzdGF0ZVRyZWVcbiAgICBmb3IgZCBpbiBbMC4uLmRpbWVuc2lvbk51bV1cbiAgICAgIHggPSBjZWxsUGF0aFtkXVxuICAgICAgc3ViVHJlZSA9IHN1YlRyZWVbeF1cbiAgICBhbHJlYWR5RXhpc3RzID0gc3ViVHJlZS5pc0xpdmVcbiAgICBpZiBhbHJlYWR5RXhpc3RzXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICBlbHNlXG4gICAgICBzdWJUcmVlLmlzTGl2ZSA9IHRydWVcbiAgICAgIHBvcHVsYXRpb24ucHVzaCBjZWxsUGF0aFxuICAgICAgY2VsbHNUb1RvZ2dsZS5wdXNoIHtwYXRoOiBjZWxsUGF0aH1cbiAgICAgIHJldHVybiB0cnVlXG5cbiAgd2hpbGUoLS1wb3B1bGF0aW9uU2l6ZSlcbiAgICB3aGlsZSghaW5zZXJ0QW5vdGhlck9uZSgpKVxuICAgICAgY29uc29sZS5sb2cgJ0NlbGwgYWxyZWFkeSBleGlzdHMsIHJlc3Bhd25pbmcuJ1xuICAjIyNcbiAgc3RhdGVUcmVlWzE2XVsxNV0uaXNMaXZlID0gdHJ1ZVxuICBzdGF0ZVRyZWVbMTZdWzE3XS5pc0xpdmUgPSB0cnVlXG4gIHBvcHVsYXRpb24ucHVzaCBbMTYsMTVdXG4gIHBvcHVsYXRpb24ucHVzaCBbMTYsMTddXG4gICMjI1xuICAjIyNcbiAgaGVyZSBpIGNyZWF0ZSBhIHdvcmtpbmcgbGlzdCwgd2hpY2ggaXMgYW4gYXJyYXkgb2YgYXJyYXlzIG9mXG4gIGFkamFzZW50IHBvaW50cy4gSSBhbHNvIG92ZXJyaWRlIHRvIHN0cmluZyBtZXRob2QsIHNvIHRoYXQgc3RyaW5naWZ5XG4gIHJlc3VsdCBvZiB0aGUgd2hvbGUgdGhpbmcgaXMgc2hvcnQgYW5kIG5pY2UuXG4gICMjI1xuICBzdGF0ZUxpc3QgPSBbXVxuICBzdGF0ZUxpc3QudG9TdHJpbmcgPSAtPlxuICAgIHJldHVybiBzdGF0ZUxpc3QucmVkdWNlIChzdHJpbmcsIGFycmF5KSAtPlxuICAgICAgcmV0dXJuIHN0cmluZyArIGFycmF5LnRvU3RyaW5nKClcbiAgICAsICcnXG4gIG5lc3RlZE1hcCA9IChkaW1lbnNpb24pIC0+XG4gICAgaWYgbm90IGRpbWVuc2lvblswXS5wYXRoXG4gICAgICBkaW1lbnNpb24ubWFwIG5lc3RlZE1hcFxuICAgIGVsc2VcbiAgICAgIGRpbWVuc2lvbi5tYXAgKGdpdmVuQ2VsbCkgLT5cbiAgICAgICAgYWRqYWNlbnQgPSBbZ2l2ZW5DZWxsXVxuICAgICAgICBhZGphY2VudC50b1N0cmluZyA9IC0+IGlmIHRoaXNbMF0uaXNMaXZlIHRoZW4gcmV0dXJuIDEgZWxzZSByZXR1cm4gMFxuICAgICAgICBzdGF0ZUxpc3QucHVzaCBhZGphY2VudFxuICAgICAgICBnZXRBZGphY2VudCA9IChkaW1lbnNpb25JbmRleCwgY2VsbE9yRGltZW5zaW9uKSAtPlxuICAgICAgICAgIGlmIG5vdCBjZWxsT3JEaW1lbnNpb24ucGF0aFxuICAgICAgICAgICAgc3ViZGltZW5zaW9uID0gY2VsbE9yRGltZW5zaW9uXG4gICAgICAgICAgICBkMSA9IGQyID0gZ2l2ZW5DZWxsLnBhdGhbZGltZW5zaW9uSW5kZXhdXG4gICAgICAgICAgICBuZXh0SW5kZXggPSBkaW1lbnNpb25JbmRleCArIDFcbiAgICAgICAgICAgIGdldEFkamFjZW50IG5leHRJbmRleCwgc3ViZGltZW5zaW9uW2QxXVxuICAgICAgICAgICAgaWYgZDEgaXMgMFxuICAgICAgICAgICAgICBkMSA9IGRpbWVuc2lvblNpemVcbiAgICAgICAgICAgIGdldEFkamFjZW50IG5leHRJbmRleCwgc3ViZGltZW5zaW9uW2QxIC0gMV1cbiAgICAgICAgICAgIGlmIGQyIGlzIGRpbWVuc2lvblNpemUgLSAxXG4gICAgICAgICAgICAgIGQyID0gLTFcbiAgICAgICAgICAgIGdldEFkamFjZW50IG5leHRJbmRleCwgc3ViZGltZW5zaW9uW2QyICsgMV1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBhZGphY2VudENlbGwgPSBjZWxsT3JEaW1lbnNpb25cbiAgICAgICAgICAgIGlmIGFkamFjZW50Q2VsbCBpc250IGdpdmVuQ2VsbFxuICAgICAgICAgICAgICBhZGphY2VudC5wdXNoIGFkamFjZW50Q2VsbFxuICAgICAgICBnZXRBZGphY2VudCAwLCBzdGF0ZVRyZWVcbiAgbmVzdGVkTWFwIHN0YXRlVHJlZVxuICByZXR1cm4ge1xuICAgIGxpc3Q6IHN0YXRlTGlzdFxuICAgIHRyZWU6IHN0YXRlVHJlZVxuICAgIGluaXRpYWxQb3B1bGF0aW9uOiBwb3B1bGF0aW9uXG4gICAgcGFyYW1ldGVyczogb3B0aW9uc1xuICAgIHN0YXRlczogW3N0YXRlTGlzdC50b1N0cmluZygpXVxuICAgIHN0YXR1czogJ2xpdmUnXG4gICAgY2VsbHNUb1RvZ2dsZTogY2VsbHNUb1RvZ2dsZVxuICAgIGFnZTogMFxuICB9XG4iLCJnZW5lcmF0ZSA9IHJlcXVpcmUgJy4vZ2VuZXJhdGUuY29mZmVlJ1xub3V0cHV0ID0gcmVxdWlyZSAnLi9vdXRwdXQuY29mZmVlJ1xucHJvY2VzcyA9IHJlcXVpcmUgJy4vcHJvY2Vzcy5jb2ZmZWUnXG5ndWkgPSByZXF1aXJlICcuL2d1aS5jb2ZmZWUnXG5zcGVjaW1lblNldCA9IG51bGxcbm9sZGVzdFNwZWNpbWVuID0ge2FnZTogMH1cbmludGVydmFsID0ge1xuICBpbml0OiAtPlxuICAgIHNwZWNpbWVuU2V0ID0gW11cbiAgICBndWkuY2xlYXIoKVxuICAgIGZvciBpIGluIFswLi4uZ3VpLnNwZWNpbWVuTnVtYmVyLnZhbHVlXVxuICAgICAgc3BlY2ltZW4gPSBnZW5lcmF0ZSB7XG4gICAgICAgIG51bWJlck9mRGltZW5zaW9uczogcGFyc2VJbnQgZ3VpLmRpbWVuc2lvbk51bWJlci52YWx1ZVxuICAgICAgICBudW1iZXJPZkNlbGxzUGVyRGltZW5zaW9uOiBwYXJzZUludCBndWkuZGltZW5zaW9uU2l6ZS52YWx1ZVxuICAgICAgICBudW1iZXJPZkxpdmVDZWxsc1BlckluaXRpYWxQb3B1bGF0aW9uOiBwYXJzZUludCBndWkuY2VsbE51bWJlci52YWx1ZVxuICAgICAgfVxuICAgICAgc3BlY2ltZW4uZWxlbWVudCA9IGd1aS5jcmVhdGVFbGVtZW50KHNwZWNpbWVuKVxuICAgICAgc3BlY2ltZW5TZXQucHVzaCBzcGVjaW1lblxuICAgICAgb3V0cHV0IHNwZWNpbWVuXG4gICAgQGlkID0gd2luZG93LnNldEludGVydmFsIEByZXBlYXQsIDEwMFxuICByZXBlYXQ6IC0+XG4gICAgZm9yIHNwZWNpbWVuLCBpIGluIHNwZWNpbWVuU2V0XG4gICAgICBpZiBzcGVjaW1lbi5zdGF0dXMgaXMgJ2xpdmUnXG4gICAgICAgIHByb2Nlc3Mgc3BlY2ltZW5cbiAgICAgICAgb3V0cHV0IHNwZWNpbWVuXG4gICAgICBlbHNlXG4gICAgICAgIGd1aS5zZXRTdGF0dXMgc3BlY2ltZW5cbiAgICAgICAgaSA9IHNwZWNpbWVuU2V0LmluZGV4T2Ygc3BlY2ltZW5cbiAgICAgICAgc3BlY2ltZW5TZXQuc3BsaWNlIGksIDFcbiAgICAgICAgaWYgb2xkZXN0U3BlY2ltZW4uYWdlIDwgc3BlY2ltZW4uYWdlXG4gICAgICAgICAgb2xkZXN0U3BlY2ltZW4uYWdlID0gc3BlY2ltZW5cbiAgICAgICAgICBvbGRlc3RTcGVjaW1lbi5pbml0aWFsUG9wdWxhdGlvbiA9IHNwZWNpbWVuLmluaXRpYWxQb3B1bGF0aW9uXG4gICAgICAgIGJyZWFrXG5cbiAgICBpZiBzcGVjaW1lblNldC5sZW5ndGggaXMgMFxuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwgaW50ZXJ2YWwuaWRcbiAgICAgIGludGVydmFsLmluaXQoKVxufVxuZ3VpLmFkZEV2ZW50SGFuZGxlcnMgaW50ZXJ2YWxcbmludGVydmFsLmluaXQoKVxuIl19
;