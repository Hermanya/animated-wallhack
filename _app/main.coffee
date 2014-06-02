input = require './input.coffee'
output = require './output.coffee'
process = require './process.coffee'

set = []
body = document.getElementsByTagName('body')[0]
for i in [0...8]
  element = document.createElement 'div'
  body.appendChild element
  element.setAttribute 'id', 'specimen' + i
  element.setAttribute 'class', 'population'
  generatedState = input 2, 32, 32
  specimen =
    states: [generatedState]
    status: 'alive'
    params: generatedState.params
    initial: generatedState.initial
    element: element
    age: 0
  str = '<div class="dimension">'
  for row in generatedState
    str += '<div class="row">'
    i = specimen.params[1]
    while(i--)
      str += '<div class="cell' +
        (if row[i].isAlive then ' alive' else '') +
         '"></div>'
    str += '</div>'
  specimen.element.innerHTML+= str + '</div>'
  delete generatedState.params
  delete generatedState.initial
  set.push specimen
_set = []

interval = window.setInterval ->
  isAllDone = true
  for specimen, i in set
    isAllDone = false
    if specimen.status is 'alive'
      process specimen
      output specimen.states[specimen.states.length - 1],
            specimen.element,
            specimen.params[1],
            specimen.cellsToToggle
    else
      specimen.element.innerHTML+= '<div class="status"><h1>' +
        specimen.status +
        '</h1><h3>age: '+
        specimen.age+
        '</h3></div>'
      _set.push specimen
      i = set.indexOf specimen
      set.splice i, 1
      break

  if isAllDone
    window.clearInterval interval
, 100
