# to depend on a bower installed component:
# define(['bower_components/componentName/file'])

define(['jquery',
'input',
'output','process'], ($, input, output, process)->
  set = []
  ageLimit = 8
  for i in [0...4]
    $('body').append('<div class="population" id="specimen'+i+'"></div>')
    initialPopulation = input(2, 32, 8);
    specimen =
      states: [initialPopulation]
      status: 'alive'
      params: initialPopulation.params
      element: $('#specimen'+i)
    set.push specimen
  window.setInterval ->
    for specimen, i in set
      output specimen.states[specimen.states.length - 1],
            specimen.element,
            specimen.params[1]
      process specimen
  , 1000

)
