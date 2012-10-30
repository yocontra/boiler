define(["js/Person", "js/People"], function(Person, People){
  var app = {};

  app.show = function(){
    var employees = People;

    var john = Person.create();
    john.set('name', 'John');
    john.set('photo', 'http://cdn.nesn.com/cat/cat_john_beattie_48.jpg');
    john.set('busy', true);
    john.set('currentProject', 'Hacking');
    employees.push(john);

    var paul = Person.create();
    paul.set('name', 'Paul');
    paul.set('busy', false);
    paul.set('currentProject', null);
    employees.push(paul);
    

    employees.bind($("#main"));

    window.employees = employees;
    window.Person = Person;
  };

  return app;
});