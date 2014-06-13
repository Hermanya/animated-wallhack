input = require './input.coffee'
output = require './output.coffee'
process = require './process.coffee'

set = []
body = document.getElementsByTagName('body')[0]
for i in [0...2]
  element = document.createElement 'div'
  body.appendChild element
  element.setAttribute 'id', 'specimen' + i
  element.setAttribute 'class', 'population'
  generatedState = input 2, 64, 16
  specimen =
    states: [generatedState]
    status: 'alive'
    params: generatedState.params
    initial: generatedState.initial
    element: element
    age: 0
  str = ''
  projectionNum = specimen.params[0]
  projectionNum = 1 if projectionNum is 2
  for j in [0...projectionNum]
    if (j % 2 is 0)
      str += '<div class="dimension-pair">'
    str += '<div class="dimension">'
    for row in generatedState
      str += '<div class="row">'
      i = specimen.params[1]
      while(i--)
        str += '<div class="cell"></div>'
      str += '</div>'
    str += '</div>'
    if (j % 2 is 1)
      str += '</div>'
  specimen.element.innerHTML += str
  delete generatedState.params
  delete generatedState.initial
  set.push specimen
_set = []

for specimen in set
  cellsToToggle = []
  for path in specimen.initial
    cellsToToggle.push {path: path}
  output specimen.states[specimen.states.length - 1],
        specimen.element,
        specimen.params[1],
        cellsToToggle,
        specimen.params[0]

interval = window.setInterval ->
  isAllDone = true
  for specimen, i in set
    isAllDone = false
    if specimen.status is 'alive'
      process specimen
      output specimen.states[specimen.states.length - 1],
            specimen.element,
            specimen.params[1],
            specimen.cellsToToggle,
            specimen.params[0]
    else
      specimen.element.innerHTML = '<div class="status"><h1>' +
        specimen.status +
        '</h1><h3>age: '+
        specimen.age+
        '</h3></div>'+
        specimen.element.innerHTML
      _set.push specimen
      i = set.indexOf specimen
      set.splice i, 1
      break

  if isAllDone
    window.clearInterval interval
    window.location.reload()
, 100
