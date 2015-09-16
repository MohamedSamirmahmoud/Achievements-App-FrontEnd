app.factory('usersFile', function($http) { 
	var services = {} ;
	services.login = function(email , password){
  return  $http({
      method:'POST',
      url:'http://localhost:9080/Achievements-App/Services/Authentication/Login', 
      params:{email:email,password:password},
      headers:{
          'Content-type':'application/json'
      }       
  });
   };
   services.getEmployeesInTheSameTeam = function(employeeId){
	  return  $http({
	      method:'POST',
	      url:'http://localhost:9080/Achievements-App/Services/EmployeeQuery/EmployeesInTheSameTeam', 
	      params:{employeeId:employeeId},
	      headers:{
	          'Content-type':'application/json'
	      }       
	  });   
	   
   }; 
   return services ;
});



app.factory('submissions', function($http) { 
    return $http.get('submissions.json');
});

app.factory('achievementTypes', function($http) { 
    return $http.get('achievements.json');
});

app.factory('myRequests', function($http) { 
	var services ={};
	services.getAchievementsByEmployeeId = function(employeeId){
//		return $http.get('myrequests.json');
	return $http.get('http://localhost:9080/Achievements-App/Services/AchievementQuerying/getAchievementsByEmployeeId/'+employeeId);
	}
	   return services;
});
app.factory('disclosureTable', function($http) { 
    return $http.get('disclosure.json');
});

app.factory('Shared', function(){
    var map = {};
    return {
        set: function(key, value){
            map[key] = value;
        },
        get: function (key){
            return map[key];
        }
    };
});