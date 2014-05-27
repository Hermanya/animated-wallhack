(function() {
  define(["random"], function(random) {
    return function(dimensionNum, dimensionSize, populationSize) {
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
                  path: cellPath,
                  isCell: true
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
  });

}).call(this);
