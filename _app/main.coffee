$ = require '../bower_components/jquery/dist/jquery.js'
input = require './input.coffee'
output = require './output.coffee'
process = require './process.coffee'
$(document).ready ()->
  set = []
  for i in [0...4]
    $('body').append('<div class="population" id="specimen' + i + '"></div>');
    generatedState = input 2, 32, 8
    specimen =
      states: [generatedState]
      status: 'alive'
      params: generatedState.params
      initial: generatedState.initial
      element: $('#specimen'+i)
      age: 0
    delete generatedState.params
    delete generatedState.initial
    set.push specimen
  interval = window.setInterval ->
    isAllDone = true
    for specimen, i in set
      if specimen.status is 'alive'
        output specimen.states[specimen.states.length - 1],
              specimen.element,
              specimen.params[1]
        process specimen
        isAllDone = false
      else
        specimen.element.html specimen.status
    if isAllDone
      window.clearInterval interval
  , 100
