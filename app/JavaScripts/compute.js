(function() {
  define([], function() {
    return function(specimen) {
      var d, nestedMap, state;
      state = specimen.states[specimen.states.length - 1];
      nestedMap = function(substate) {
        if (typeof substate[0] === 'object') {
          return substate.map(nestedMap);
        } else {
          return substate.map(function(givenCell) {
            var aliveCount, cellPath, exploreDeviation, info;
            info = givenCell.split('@');
            cellPath = "[" + info[1] + "]";
            cellPath = JSON.parse(cellPath);
            aliveCount = 0;
            exploreDeviation = function(substate) {
              var isAlive, neighbor, nextDimension;
              if (cellPath.length !== 1) {
                nextDimension = cellPath.pop();
                exploreDeviation(substate[nextDimension - 1]);
                exploreDeviation(substate[nextDimension]);
                return exploreDeviation(substate[nextDimension + 1]);
              } else {
                neighbor = substate[cellPath.pop()];
                if (neighbor !== givenCell) {
                  isAlive = neighbor.split("at")[0];
                  if (isAlive) {
                    return aliveCount++;
                  }
                }
              }
            };
            exploreDeviation(state);
            return console.log(aliveCount, givenCell);
          });
        }
      };
      return d = state.params[0];

      /*
      number of surrounding cells = 3 ^ dimensions - 1
      isAlive@[path,to,cell]
      iterate by splitting into three options
      check if value equals including the path
      computer
        init
        process
      i/o proc
       */
    };
  });

}).call(this);
