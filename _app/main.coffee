generate = require './generate.coffee'
output = require './output.coffee'
process = require './process.coffee'
gui = require './gui.coffee'
specimenSet = null
oldestSpecimen = {age: 0}
interval = {
  init: ->
    specimenSet = []
    gui.clear()
    for i in [0...gui.specimenNumber.value]
      specimen = generate {
        numberOfDimensions: parseInt gui.dimensionNumber.value
        numberOfCellsPerDimension: parseInt gui.dimensionSize.value
        numberOfLiveCellsPerInitialPopulation: parseInt gui.cellNumber.value
      }
      specimen.element = gui.createElement(specimen)
      specimenSet.push specimen
      output specimen
    @id = window.setInterval @repeat, 100
  repeat: ->
    for specimen, i in specimenSet
      if specimen.status is 'live'
        process specimen
        output specimen
      else
        gui.setStatus specimen
        i = specimenSet.indexOf specimen
        specimenSet.splice i, 1
        if oldestSpecimen.age < specimen.age
          oldestSpecimen.age = specimen
          oldestSpecimen.initialPopulation = specimen.initialPopulation
        break

    if specimenSet.length is 0
      window.clearInterval interval.id
      interval.init()
}
gui.addEventHandlers interval
interval.init()
