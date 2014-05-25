(function() {
  define([], function() {
    return function(dimensionNum, dimensionSizeNum, populationSize) {
      var i, population, state;
      state = [];
      while (--dimensionNum) {
        i = dimensionSizeNum;
        while (i--) {
          state[i] = [];
        }
      }
      population = [];
      return state;
    };
  });

}).call(this);

//# sourceMappingURL=generator.js.map
