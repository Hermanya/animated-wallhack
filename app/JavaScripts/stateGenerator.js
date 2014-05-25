(function() {
  define(["random"], function(random) {
    return function(dimensionNum, dimensionSize, populationSize) {
      var cellPath, d, halfdimensionSize, init, insertAnotherOne, population, state, substate;
      state = [];
      init = function(substate, dimensionsLeft) {
        var i;
        if (dimensionsLeft) {
          i = dimensionSize;
          while (--i) {
            substate[i - 1] = [];
            init(substate[i - 1], dimensionsLeft - 1);
          }
        }
        return substate = substate[0];
      };
      init(state, dimensionNum - 1);
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
      substate[halfdimensionSize] = 1;
      insertAnotherOne = function() {
        var shiftNumber;
        cellPath = population[random(population.length)];
        cellPath = JSON.stringify(cellPath);
        cellPath = JSON.parse(cellPath);
        shiftNumber = (random(dimensionNum)) + 1;
        while (shiftNumber--) {
          cellPath[random(dimensionNum)] += random(2) ? 1 : -1;
        }
        substate = state;
        d = dimensionNum;
        while (--d) {
          substate = substate[cellPath[dimensionNum - d - 1]];
        }
        if (substate[cellPath[cellPath.length - 1]]) {
          return false;
        } else {
          substate[cellPath[cellPath.length - 1]] = 1;
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
      return state;
    };
  });

}).call(this);
