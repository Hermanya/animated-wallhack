define(["random"], (random)->
  return (dimensionNum, dimensionSize, populationSize)->
      state = []
      init = (substate, dimensionsLeft)->
        if (dimensionsLeft)
          i = dimensionSize
          while(--i)
            substate[i - 1] = []
            init substate[i - 1], dimensionsLeft - 1
        substate = substate[0]
      init state, dimensionNum - 1
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
      substate[halfdimensionSize] = 1
      insertAnotherOne = ()->
        # Clone it
        cellPath = population[random population.length]
        cellPath = JSON.stringify(cellPath);
        cellPath = JSON.parse(cellPath);
        # Shift it
        shiftNumber = (random dimensionNum) + 1
        while(shiftNumber--)
          cellPath[random dimensionNum]+= if random(2) then 1 else -1;
        # Push it
        substate = state
        d = dimensionNum
        while(--d)
          substate = substate[cellPath[dimensionNum - d - 1]]
        if (substate[cellPath[cellPath.length - 1]])
          return false
        else
          substate[cellPath[cellPath.length - 1]] = 1
          population.push cellPath
          return true

      while(--populationSize)
        while(!insertAnotherOne())
          console.log 'Cell already exists, respawning.'
      state.initial = population
      return state
)
