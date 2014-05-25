(function() {
  define(["random"], function(random) {
    return function(dimensionNum, stageSize, populationSize) {
      var cellPath, d, halfStageSize, i, insertAnotherOne, population, stage, substage;
      stage = [];
      d = dimensionNum;
      while (--d) {
        i = stageSize;
        while (i--) {
          stage[i] = [];
        }
      }
      population = [];
      halfStageSize = stageSize / 2;
      substage = stage;
      cellPath = [];
      d = dimensionNum;
      while (--d) {
        cellPath.push(halfStageSize);
        substage = substage[halfStageSize];
      }
      cellPath.push(halfStageSize);
      population.push(cellPath);
      substage[halfStageSize] = 1;
      insertAnotherOne = function() {
        var shiftNumber;
        cellPath = population[random(population.length)];
        cellPath = JSON.stringify(cellPath);
        cellPath = JSON.parse(cellPath);
        shiftNumber = (random(dimensionNum)) + 1;
        while (shiftNumber--) {
          cellPath[random(dimensionNum)] += random(2) ? 1 : -1;
        }
        substage = stage;
        d = dimensionNum;
        while (d--) {
          substage = stage[cellPath[d]];
        }
        if (substage[cellPath[cellPath.length - 1]]) {
          return false;
        } else {
          substage[cellPath[cellPath.length - 1]] = 1;
          population.push(cellPath);
          console.log(cellPath);
          return true;
        }
      };
      while (--populationSize) {
        while (!insertAnotherOne()) {
          console.log('Have a good day!');
        }
      }
      console.log(population);
      return stage;
    };
  });

}).call(this);

//# sourceMappingURL=stageGenerator.js.map
