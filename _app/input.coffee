random = require './random.coffee'
module.exports = (dimensionNum, dimensionSize, populationSize) ->
  state = []

  clone = (object) ->
    object = JSON.stringify object
    return JSON.parse object

  init = (substate, dimensionsLeft, path) ->
    if (dimensionsLeft)
      i = dimensionSize
      while(i--)
        dimensionPath = clone path
        dimensionPath.push(i)
        substate[i] = []
        if (dimensionsLeft == 1)
          j = dimensionSize
          while(j--)
            cellPath = clone dimensionPath
            cellPath.push(j)
            substate[i][j] = path: cellPath
        init substate[i], dimensionsLeft - 1, dimensionPath

  init state, dimensionNum - 1, []
# Prepare for first cell insertion
  population = []
  halfdimensionSize = dimensionSize / 2
  substate = state
  cellPath = []
  d = dimensionNum
  while(--d)
    cellPath.push halfdimensionSize
    substate = substate[halfdimensionSize]
  cellPath.push halfdimensionSize
  population.push cellPath
# Finally
  substate[halfdimensionSize].isAlive = true

  insertAnotherOne = ->
    cellPath = clone population[random population.length]
  # Shift it
    shiftsNumber = (random dimensionNum) + 1
    while(shiftsNumber--)
      cellPath[random dimensionNum]+= if random(2) then 1 else -1
  # Push it
    substate = state
    d = dimensionNum
    while(--d)
      substate = substate[cellPath[dimensionNum - d - 1]]
    alreadyExists = substate[cellPath[cellPath.length - 1]].isAlive
    if alreadyExists
      return false
    else
      substate[cellPath[cellPath.length - 1]].isAlive = true
      population.push cellPath
      return true

  while(--populationSize)
    while(!insertAnotherOne())
      console.log 'Cell already exists, respawning.'
  state.initial = population
  state.params = arguments
  return state
