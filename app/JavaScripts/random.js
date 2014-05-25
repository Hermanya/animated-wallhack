(function() {
  define([], function() {
    return function(range) {
      return Math.floor(Math.random() * range);
    };
  });

}).call(this);
