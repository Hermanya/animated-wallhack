(function() {
  require.config({
    paths: {
      "components": "../../bower_components",
      "jquery": "../../bower_components/jquery/dist/jquery"
    }
  });

  if (!window.requireTestMode) {
    require(['main'], function() {});
  }

}).call(this);

//# sourceMappingURL=config.js.map
