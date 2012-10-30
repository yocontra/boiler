define(["js/Person", "js/People"], function(Person, People){
  var app = {};

  var server = Vein.createClient();
  var pulse = Pulsar.createClient();
  var main = pulse.channel('main');

  app.show = function(){
    var employees = People;

    server.ready(function(){

      main.on('change', function(idx, key, val){
        employees.get('items')[idx].set(key, val);
      });

      server.getEmployees(function(emps){
        emps.forEach(function(employee){
          employees.push(Person.create().set(employee));
        });
      });

      // chan.emit('change', 0, 'busy', true)
    });

    employees.bind($("#main"));

    window.employees = employees;
    window.Person = Person;
  };

  return app;
});