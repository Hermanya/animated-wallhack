generate = require './generate.coffee'
output = require './output.coffee'
process = require './process.coffee'
gui = require './gui.coffee'
specimenSet = null

interval = {
  init: ->
    specimenSet = []
    gui.body.innerHTML = ''
    for i in [0...gui.specimenNumber.value]
      element = document.createElement 'div'
      gui.body.appendChild element
      element.setAttribute 'id', 'specimen' + i
      element.setAttribute 'class', 'population'
      generated = generate {
        numberOfDimensions: parseInt gui.dimensionNumber.value
        numberOfCellsPerDimension: parseInt gui.dimensionSize.value
        numberOfLiveCellsPerInitialPopulation: parseInt gui.cellNumber.value
      }
      specimen =
        list: generated.list
        tree: generated.tree
        states: [generated.list.toString()]
        status: 'live'
        parameters: generated.parameters
        initial: generated.initialPopulation
        element: element
        age: 0
      str = ''
      projectionNum = specimen.parameters.numberOfDimensions
      projectionNum = 1 if projectionNum is 2
      for j in [0...projectionNum]
        if (j % 2 is 0)
          str += '<div class="dimension-pair">'
        str += '<div class="dimension">'
        for k in [0...specimen.parameters.numberOfCellsPerDimension]
          str += '<div class="row">'
          i =
          for l in [0...specimen.parameters.numberOfCellsPerDimension]
            str += '<div class="cell"></div>'
          str += '</div>'
        str += '</div>'
        if (j % 2 is 1)
          str += '</div>'
      specimen.element.innerHTML += str
      delete generated.parameters
      delete generated.initial
      specimenSet.push specimen

    for specimen in specimenSet
      specimen.cellsToToggle = []
      for path in specimen.initial
        specimen.cellsToToggle.push {path: path}
      output specimen
    @id = window.setInterval @repeat, 100
  repeat: ->
    isAllDone = true
    for specimen, i in specimenSet
      isAllDone = false
      if specimen.status is 'live'
        process specimen
        output specimen
      else
        specimen.element.innerHTML = '<div class="status"><h1>' +
          specimen.status +
          '</h1><h3>age: '+
          specimen.age+
          '</h3></div>'+
          specimen.element.innerHTML
        i = specimenSet.indexOf specimen
        specimenSet.splice i, 1
        break

    if isAllDone
      window.clearInterval interval.id
      interval.init()
}
gui.addEventHandlers interval
interval.init()
