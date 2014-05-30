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
            d = d1 = givenCell.path[dimensionIndex]
            pathTree nextIndex, _state[d]
            if d is 0
              d = dimensionSize
            pathTree nextIndex, _state[d - 1]
            if d1 is dimensionSize - 1
              d1 = -1
            pathTree nextIndex, _state[d1 + 1]
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

  if cellsToToggle.length is 0
    specimen.status = 'dead'
    nestedMap = (dimension)->
      if not dimension[0].path
        dimension.map nestedMap
      else
        dimension.map (cell)->
          if cell.isAlive
            specimen.status = 'still'
            return false
  specimen.age++;
  specimen.states = [previousState, newState]
  ###
  number of surrounding cells = 3 ^ dimensions - 1
  ###
