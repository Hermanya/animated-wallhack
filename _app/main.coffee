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
  _set = []
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
        specimen.element.append '<div class="status"><h1>' + specimen.status + '</h1></div>'
        _set.push specimen
        i = set.indexOf specimen
        set.splice i, 1
    if isAllDone
      window.clearInterval interval
  , 100
