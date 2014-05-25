define(["random"], (random)->
  return (dimensionNum, stageSize, populationSize)->
      stage = []
      d = dimensionNum
      while(--d)
        i = stageSize
        while(i--)
          stage[i]=[]
    # Prepare for first cell insertion
      population = []
      halfStageSize = stageSize / 2
      substage = stage
      cellPath = []
      d = dimensionNum
      while(--d)
        cellPath.push halfStageSize
        substage = substage[halfStageSize]
      cellPath.push halfStageSize
      population.push cellPath
    # Finally
      substage[halfStageSize] = 1

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
        substage = stage
        d = dimensionNum
        while(d--)
          substage = stage[cellPath[d]]
        if (substage[cellPath[cellPath.length - 1]])
          return false
        else
          substage[cellPath[cellPath.length - 1]] = 1
          population.push cellPath
          console.log cellPath
          return true

      while(--populationSize)
        while(!insertAnotherOne())
          console.log 'Have a good day!'
      console.log population
      return stage
)
