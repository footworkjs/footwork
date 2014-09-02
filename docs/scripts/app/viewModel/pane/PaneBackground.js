define([ "footwork" ],
  function( ko ) {
    return ko.viewModel({
      namespace: 'PaneBackground',
      initialize: function() {
        this.leftOffset = ko.observable().receiveFrom('Pane', 'leftOffset');
        this.leftTransform = ko.observable().receiveFrom('Pane', 'leftTransform');        
        this.transition = ko.observable().receiveFrom('Pane', 'transition');
        this.width = ko.observable().receiveFrom('Pane', 'width');
      }
    });
  }
);