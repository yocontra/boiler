define(function(){
  var People = dermis.collection({
    getAvailable: function(){
      var out = [];
      this.get('items').forEach(function(item){
        if (!item.get('busy')) {
          out.push(item);
        }
      });

      return out;
    }
  });

  return People;
});