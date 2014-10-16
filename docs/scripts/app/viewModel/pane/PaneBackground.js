define([ "footwork" ],
  function( fw ) {
    return fw.viewModel({
      namespace: 'PaneBackground',
      initialize: function() {
        this.leftOffset = fw.observable().receiveFrom('Pane', 'leftOffset');
        this.leftTransform = fw.observable().receiveFrom('Pane', 'leftTransform');        
        this.transition = fw.observable().receiveFrom('Pane', 'transition');
        this.width = fw.observable().receiveFrom('Pane', 'width');
      }
    });
  }
);