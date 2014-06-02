module.exports = (state, element, size, cellsToToggle)->
  if state[0].path
# One dimensional state
    element.innerHTML = 'This state is unrenderable! See console output.'
  else if state[0][0].path
# Two dimensional state
    for cell in cellsToToggle
      element
      .childNodes[0]
      .childNodes[cell.path[0]]
      .childNodes[cell.path[1]]
      .classList.toggle 'alive'
  else
    element.innerHTML = 'This state is unrenderable! See console output.'
    ###
    Project multi-dimensional states to 2D
    e.g. state[i][j][reduced]..[states]
    ###
