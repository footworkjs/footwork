define(['footwork'], function(fw) {
  var list = [1,2,3];

  describe('list count', function() {
    it('has 3 entries', function() {
      expect(list.length).toEqual(3);
    });
  });

});
