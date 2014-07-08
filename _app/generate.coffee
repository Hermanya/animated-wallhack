random = require './random.coffee'
module.exports = (options) ->
  dimensionNum = options.numberOfDimensions
  dimensionSize = options.numberOfCellsPerDimension
  populationSize = options.numberOfLiveCellsPerInitialPopulation
  stateTree = []
  clone = (object) ->
    object = JSON.stringify object
    return JSON.parse object

  init = (subTree, dimensionsLeft, path) ->
    if dimensionsLeft
      i = dimensionSize
      while(i--)
        dimensionPath = clone path
        dimensionPath.push i
        subTree[i] = []
        if dimensionsLeft is 1
          j = dimensionSize
          while(j--)
            cellPath = clone dimensionPath
            cellPath.push j
            subTree[i][j] =
              path: cellPath
        init subTree[i], dimensionsLeft - 1, dimensionPath

  init stateTree, dimensionNum - 1, []
# Prepare for first cell insertion
  population = []
  cellsToToggle = []
  halfdimensionSize = ~~(dimensionSize / 2)
  subTree = stateTree
  cellPath = []
  d = dimensionNum
  while(--d)
    cellPath.push halfdimensionSize
    subTree = subTree[halfdimensionSize]
  cellPath.push halfdimensionSize
  population.push cellPath
  cellsToToggle.push {path: cellPath}
# Finally
  subTree[halfdimensionSize].isLive = true
# Buggggggggggggggggs@todo
  insertAnotherOne = ->
    cellPath = clone population[random population.length]
  # Shift it
    shiftsNumber = (random dimensionNum) + 1
    while(shiftsNumber--)
      i = random dimensionNum
      if random 2
        cellPath[i] = (cellPath[i] + 1) % dimensionSize
      else
        cellPath[i] = cellPath[i] - 1
        if cellPath[i] is -1
          cellPath[i] = dimensionSize - 1
  # Push it
    subTree = stateTree
    for d in [0...dimensionNum]
      x = cellPath[d]
      subTree = subTree[x]
    alreadyExists = subTree.isLive
    if alreadyExists
      return false
    else
      subTree.isLive = true
      population.push cellPath
      cellsToToggle.push {path: cellPath}
      return true

  while(--populationSize)
    while(!insertAnotherOne())
      console.log 'Cell already exists, respawning.'
  ###
  stateTree[16][15].isLive = true
  stateTree[16][17].isLive = true
  population.push [16,15]
  population.push [16,17]
  ###
  ###
  here i create a working list, which is an array of arrays of
  adjasent points. I also override to string method, so that stringify
  result of the whole thing is short and nice.
  ###
  stateList = []
  stateList.toString = ->
    return stateList.reduce (string, array) ->
      return string + array.toString()
    , ''
  nestedMap = (dimension) ->
    if not dimension[0].path
      dimension.map nestedMap
    else
      dimension.map (givenCell) ->
        adjacent = [givenCell]
        adjacent.toString = -> if this[0].isLive then return 1 else return 0
        stateList.push adjacent
        getAdjacent = (dimensionIndex, cellOrDimension) ->
          if not cellOrDimension.path
            subdimension = cellOrDimension
            d1 = d2 = givenCell.path[dimensionIndex]
            nextIndex = dimensionIndex + 1
            getAdjacent nextIndex, subdimension[d1]
            if d1 is 0
              d1 = dimensionSize
            getAdjacent nextIndex, subdimension[d1 - 1]
            if d2 is dimensionSize - 1
              d2 = -1
            getAdjacent nextIndex, subdimension[d2 + 1]
          else
            adjacentCell = cellOrDimension
            if adjacentCell isnt givenCell
              adjacent.push adjacentCell
        getAdjacent 0, stateTree
  nestedMap stateTree
  return {
    list: stateList
    tree: stateTree
    initialPopulation: population
    parameters: options
    states: [stateList.toString()]
    status: 'live'
    cellsToToggle: cellsToToggle
    age: 0
  }
