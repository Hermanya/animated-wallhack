(function() {
  define([], function() {
    return function(dimensionNum, stageSizeNum, populationSize) {
      var i, population, stage;
      stage = [];
      while (--dimensionNum) {
        i = stageSizeNum;
        while (i--) {
          stage[i] = [];
        }
      }
      population = [];
      return stage;
    };
  });

}).call(this);

//# sourceMappingURL=generator.js.map
