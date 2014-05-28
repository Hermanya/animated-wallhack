module.exports = (specimen)->
  clone = (object)->
    object = JSON.stringify object
    return JSON.parse object
  previousState = specimen.states[specimen.states.length - 1]
  newState = clone previousState
  cellsToToggle = []
  dimensionSize = specimen.params[1]
  nestedMap = (dimension)->
    if not dimension[0].path
      dimension.map nestedMap
    else
      dimension.map (givenCell)->
        lifeCount = 0

        pathTree = (dimensionIndex, _state)->
          if not _state.path
            nextIndex = dimensionIndex + 1;
            pathTree nextIndex, _state[givenCell.path[dimensionIndex]]
            if (givenCell.path[dimensionIndex] - 1 > -1)
              pathTree nextIndex, _state[givenCell.path[dimensionIndex] - 1]
            if (givenCell.path[dimensionIndex] + 1 < dimensionSize)
              pathTree nextIndex, _state[givenCell.path[dimensionIndex] + 1]
          else
            neighbor = _state
            if neighbor.isAlive and (neighbor.path isnt givenCell.path)
              lifeCount++
        pathTree 0, previousState
        if givenCell.isAlive
          if lifeCount < 2 or lifeCount > 3
            cellsToToggle.push givenCell
        else
          if lifeCount is 3
            cellsToToggle.push givenCell

  nestedMap previousState
  for cell in cellsToToggle
    _state = newState
    for index in cell.path
      _state = _state[index]
    _state.isAlive = ! _state.isAlive
  specimen.states.push newState
  ###
  number of surrounding cells = 3 ^ dimensions - 1
  ###
