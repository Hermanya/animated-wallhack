module.exports = (state, element, size)->
  element.html ''
  if state[0].path
# One dimensional state
    for cell in state
      element.append if cell.isAlive then '|' else '&nbsp;'
  else if state[0][0].path
# Two dimensional state
    str = '<div class="dimension">'
    for substate in state
      str += '<div class="row">'
    # Dimension size
      i = size
      while(i--)
        str += '<div class="cell' +
          (if substate[i].isAlive then ' alive' else '') + '" title="'+substate[i].path+'"></div>'
      str += '</div>'
    element.append str + '</div>'
  else
    element.html 'This state is unrenderable! See console output.'
    ###
    Project multi-dimensional states to 2D
    e.g. state[i][j][reduced]..[states]

    array join innerHTML
    ###
