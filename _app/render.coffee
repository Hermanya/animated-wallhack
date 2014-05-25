define([],()->
  return (state, element)->
    element.html('');
    if (typeof state[0] != 'object')
    # One dimensional state
      for cell in state
        element.append if cell then '|' else '&nbsp;'
    else if (typeof state[0][0] != 'object')
    # Two dimensional state
      for substate in state
        str = '<div class="row">'
        for i in [0...16]#cell in substate
          str += '<div class="cell' +
            (if substate[i] then ' alive' else '') + '"></div>'
        element.append str + '</div>'
    else
      element.html 'This state is unrenderable! See console output.'
)
