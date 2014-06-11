module.exports = (specimen) ->
  clone = (object) ->
    object = JSON.stringify object
    return JSON.parse object
  previousState = specimen.states[specimen.states.length - 1]
  newState = clone previousState
  cellsToToggle = []
  dimensionSize = specimen.params[1]
  dimensionNum = specimen.params[0]
  k = 1 / 8 * (Math.pow(3, dimensionNum) - 1)
  nestedMap = (dimension) ->
    if not dimension[0].path
      dimension.map nestedMap
    else
      dimension.map (givenCell) ->
        lifeCount = 0
        pathTree = (dimensionIndex, _state) ->
          if not _state.path
            nextIndex = dimensionIndex + 1
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
          if lifeCount < 2 * k or lifeCount > 3 * k
            cellsToToggle.push givenCell
        else
          if lifeCount is 3 * k
            cellsToToggle.push givenCell

  nestedMap previousState

  for cell in cellsToToggle
    _state = newState
    for index in cell.path
      _state = _state[index]
    _state.isAlive = ! _state.isAlive

  if cellsToToggle.length is 0
    specimen.status = 'dead'
    if (JSON.stringify(newState).indexOf 'true') isnt -1
      specimen.status = 'still'
  else
    for state, index in specimen.states
      if JSON.stringify(newState) is JSON.stringify(state)
        specimen.status = 'period ' + (specimen.states.length - index)
  specimen.age++
  specimen.cellsToToggle = cellsToToggle
  specimen.states = [previousState, newState]
  ###
 #specimen.states.push newState
  number of surrounding cells = 3 ^ dimensions - 1
  ###
