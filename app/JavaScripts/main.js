(function() {
  define(['jquery', 'input', 'output', 'process'], function($, input, output, process) {
    var ageLimit, i, initialPopulation, set, specimen, _i;
    set = [];
    ageLimit = 8;
    for (i = _i = 0; _i < 4; i = ++_i) {
      $('body').append('<div class="population" id="specimen' + i + '"></div>');
      initialPopulation = input(2, 32, 8);
      specimen = {
        states: [initialPopulation],
        status: 'alive',
        params: initialPopulation.params,
        element: $('#specimen' + i)
      };
      set.push(specimen);
    }
    return window.setInterval(function() {
      var _j, _len, _results;
      _results = [];
      for (i = _j = 0, _len = set.length; _j < _len; i = ++_j) {
        specimen = set[i];
        output(specimen.states[specimen.states.length - 1], specimen.element, specimen.params[1]);
        _results.push(process(specimen));
      }
      return _results;
    }, 1000);
  });

}).call(this);
