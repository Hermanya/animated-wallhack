(function() {
  define([], function() {
    return function(specimen) {
      var cell, cellsToToggle, clone, dimensionSize, index, nestedMap, newState, previousState, _i, _j, _len, _len1, _ref, _state;
      clone = function(object) {
        object = JSON.stringify(object);
        return JSON.parse(object);
      };
      previousState = specimen.states[specimen.states.length - 1];
      newState = clone(previousState);
      cellsToToggle = [];
      dimensionSize = specimen.params[1];
      nestedMap = function(dimension) {
        if (!dimension[0].isCell) {
          return dimension.map(nestedMap);
        } else {
          return dimension.map(function(givenCell) {
            var lifeCount, pathTree;
            lifeCount = 0;
            pathTree = function(dimensionIndex, _state) {
              var neighbor, nextIndex;
              if (!_state.isCell) {
                nextIndex = dimensionIndex + 1;
                pathTree(nextIndex, _state[givenCell.path[dimensionIndex]]);
                if (givenCell.path[dimensionIndex] - 1 > -1) {
                  pathTree(nextIndex, _state[givenCell.path[dimensionIndex] - 1]);
                }
                if (givenCell.path[dimensionIndex] + 1 < dimensionSize) {
                  return pathTree(nextIndex, _state[givenCell.path[dimensionIndex] + 1]);
                }
              } else {
                neighbor = _state;
                if (neighbor.isAlive && (neighbor.path !== givenCell.path)) {
                  return lifeCount++;
                }
              }
            };
            pathTree(0, previousState);
            if (givenCell.isAlive) {
              if (lifeCount < 2 || lifeCount > 3) {
                return cellsToToggle.push(givenCell);
              }
            } else {
              if (lifeCount === 3) {
                return cellsToToggle.push(givenCell);
              }
            }
          });
        }
      };
      nestedMap(previousState);
      for (_i = 0, _len = cellsToToggle.length; _i < _len; _i++) {
        cell = cellsToToggle[_i];
        _state = newState;
        _ref = cell.path;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          index = _ref[_j];
          _state = _state[index];
        }
        _state.isAlive = !_state.isAlive;
      }
      return specimen.states.push(newState);

      /*
      number of surrounding cells = 3 ^ dimensions - 1
       */
    };
  });

}).call(this);
