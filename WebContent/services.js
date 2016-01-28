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
   var services ={} ; 
   services.getManagerSubmissions = function(mangerId){
	   return  $http({
		      method:'POST',
		      url:'http://localhost:9080/Achievements-App/Services/AchievementQuerying/getManagerSubmissions', 
		      params:{'managerId':mangerId},
		      headers:{
		          'Content-stype':'application/json'
		      }       
		  });
   } ;
   services.getAchievementById = function(achievementId){
	   return  $http({
		      method:'POST',
		      url:'http://localhost:9080/Achievements-App/Services/AchievementQuerying/GetAchievementById', 
		      params:{'achievementId':achievementId},
		      headers:{
		          'Content-stype':'application/json'
		      }       
		  });
	   
   };
   return services ;
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

app.factory('myRequestsByStatus', function($http) { 
	var services ={};
	services.getAchievementsByStatus = function(status){
	return $http.get('http://localhost:9080/Achievements-App/Services/AchievementQuerying/getAchievementsByStatus/'+status);
	}
	   return services;
});

app.factory('myRequestsByStatusAndID', function($http) { 
	var services ={};
	services.getAchievementsByEmployeeIdAndStatus = function(employeeId,status){
	return $http.get('http://localhost:9080/Achievements-App/Services/AchievementQuerying/getAchievementsByEmployeeIdAndStatus/'+employeeId+'/'+status);
	}
	   return services;
});

app.factory('myRequestsByType', function($http) { 
	var services ={};
	services.getAchievmentByType = function(type  , managerId){
	return $http.get('http://localhost:9080/Achievements-App/Services/AchievementQuerying/getAchievmentByType/'+type+'/'+managerId);
	}
	   return services;
});


app.factory('myRequestsByBrand', function($http) { 
	var services ={};
	services.getAchievementsByBrandAndEmployeeId = function(employeeId,brand){
	return $http.get('http://localhost:9080/Achievements-App/Services/AchievementQuerying/getAchievementsByBrandAndEmployeeId/'+employeeId+brand);
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