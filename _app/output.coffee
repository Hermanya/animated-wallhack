define([],()->
  return (state, element, size)->
    console.log state
    element.html ''
    if state[0].isCell
    # One dimensional state
      for cell in state
        element.append if cell.isAlive then '|' else '&nbsp;'
    else if state[0][0].isCell
    # Two dimensional state
      for substate in state
        str = '<div class="row">'
      # Dimension size
        i = size
        while(i--)
          str += '<div class="cell' +
            (if substate[i].isAlive then ' alive' else '') + '" title="'+substate[i].path+'"></div>'
        element.append str + '</div>'
    else
      element.html 'This number of dimensions is unrenderable! See console output.'
)
