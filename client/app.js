var employeeAmmount = 0;
var hiddenEmployees = [];
var monthTotal= 0;
var salary = 0;
var monthlyPay = 0;

$(document).ready(function(){

  //Works with totalSalCalc to display information from forms
  $('#employeeForm').on('submit', submitEmployee);

  $('.employee-data').on('click', '.removeEmp', deactivateEmployee);
  $('.drop-down-submit').on('click', reactivateEmployee);
  getAllEmployees();
  //totalMonthCalc(employeeArray);
});


function submitEmployee(event) {
    //Prevents page from being reloded upon submit
    event.preventDefault();
    //creates a temporary employee to push into the array
    var Employee = {};
    $.each($("#employeeForm").serializeArray(), function(i, field) {
      Employee[field.name] = field.value;
    });
    $.ajax({
      type: "POST",
      url: "/employee",
      data: Employee,
      success: function(data){
        justSubmitted(data[0].name);
        getAllEmployees();
      }
    });
    //Erases form cache
    $('#employeeform').find('input[type=text]' || 'input[type=number]').text('');

}

function getAllEmployees(){
  $.ajax({
    type: "GET",
    url: "/employee",
    success: function(data){
      displayAllEmployees(data);
    }
  });
}

function displayAllEmployees(data){
  monthTotal= 0;
  salary = 0;
  monthlyPay = 0;
  employeeAmmount = 0;
  hiddenEmployees = [];
  $('.employee-data').empty();
  hiddenEmployees = [];
  for (var i = 0; i <data.length; i++){
    if(data[i].active){
      displayIndividualEmployee(data[i]);
      employeeAmmount++;
      totalMonthCalc(data[i]);
    }
    else{
      hiddenEmployees.push(data[i]);
    }
  }
  refreshDropdown();
  if(!employeeAmmount){
    totalMonthCalc();
  }
}

function displayIndividualEmployee(employee){

    $('.employee-data').append('<div class="recent-submit">');
    var $sub = $('.employee-data').children().last();
    $sub.append('<h3>'+employee.name+'</h2>');
    $sub.append('<p>Employee Number: <span>'+employee.number+'</span></p>');
    $sub.append('<p>Job title: <span>'+employee.job+'</span></p>');
    $sub.append('<p>Yearly Salary: <span>$'+employee.salary+'</span></p>');
    $sub.append('<p>Monthly Pay: <span>$'+parseInt(employee.salary*10/12)/10+'</span></p>');
    $sub.append('<button class="removeEmp"> Remove '+employee.name+'</button>');
    $sub.data("id", employee.id);

}

function reactivateEmployee(event){
  //take the option displayed and set that as the id
  // in order to be reactivated
  var reactivation = {};
  reactivation.id = $('.drop-down-menu :selected').data("id");
  $.ajax({
    type: "PUT",
    url: "/employee/reactivate",
    data: reactivation,
    success: function (data){
      successfulReactivate(data[0].name);
      getAllEmployees();
    }
  });
}

function refreshDropdown(){
  $('.drop-down-menu').html('<option>SELECT</option>');
  for(var i = 0; i < hiddenEmployees.length; i++){
    var name = hiddenEmployees[i].name;
    var data = hiddenEmployees[i].id;
    $('.drop-down-menu').append('<option>'+name+'</option>');
    $('.drop-down-menu').children().last().data("id", data);
  }
}

function totalMonthCalc(workingEmployee){
    if(employeeAmmount){
      salary = parseInt(workingEmployee.salary);
    } else{
      salary = 0;
    }
    monthlyPay = Math.round(salary / 12);
    monthTotal += parseInt(monthlyPay);
    $('.running-total').text("Monthly pay for employees entered: $" + monthTotal);
}


function justSubmitted(name){
  $('.just-submitted').text("Added: "+ name);
}


function deactivateEmployee(event){
  var sendingObject = {};
  event.preventDefault();
    sendingObject.id = $(this).parent().data("id");
    $.ajax({
      type: "PUT",
      url: "/employee/deactivate",
      data: sendingObject,
      success: function(data){
        getAllEmployees();
        successfulDelete(data[0].name);
      }
    });
}

function successfulDelete(name){
  $('.just-submitted').text("You have deleted: " + name);
}
function successfulReactivate(name){
  $('.just-submitted').text("You have reactivated: " + name);
}
