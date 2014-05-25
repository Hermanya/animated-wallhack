# to depend on a bower installed component:
# define(['bower_components/componentName/file'])

define(['jquery',
'stateGenerator',
'render'], ($, generatestate, render)->
  populations = []
  for i in [0...16]
    initialPopulation = generatestate(2, 16, 4);
    $('body').append('<div class="population" id="population'+i+'"></div>')
    populations.push initialPopulation
  for population, i in populations
    render population, $('#population'+i)
)
