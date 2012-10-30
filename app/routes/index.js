define(["js/Person", "js/People"], function(Person, People){
  var app = {};

  app.show = function(){
    var employees = People;

    var john = Person.create();
    john.set('name', 'John');
    john.set('currentProject', 'Nothing');
    employees.push(john);

    var paul = Person.create();
    paul.set('name', 'Paul');
    paul.set('currentProject', 'Nothing');
    employees.push(paul);
    

    employees.bind($("#main"));
  };

  return app;
});