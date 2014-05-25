(function() {
  define(['jquery', 'stateGenerator', 'render'], function($, generatestate, render) {
    var i, initialPopulation, population, populations, _i, _j, _len, _results;
    populations = [];
    for (i = _i = 0; _i < 16; i = ++_i) {
      initialPopulation = generatestate(2, 16, 4);
      $('body').append('<div class="population" id="population' + i + '"></div>');
      populations.push(initialPopulation);
    }
    _results = [];
    for (i = _j = 0, _len = populations.length; _j < _len; i = ++_j) {
      population = populations[i];
      _results.push(render(population, $('#population' + i)));
    }
    return _results;
  });

}).call(this);
