var app = angular.module ('ibmApp',['ngRoute']);


app.config(function($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'home.html',
            controller: 'homeController'
        })
        .when('/employeeAchievements', {
            templateUrl: 'employeeAchievements.html',
            controller: 'achievementsController'
        })
    .when('/managerAchievements', {
            templateUrl: 'managerAchievements.html',
            controller: 'achievementsController'
        })
        .when('/employeeMyRequests', {
            templateUrl: 'employeeMyRequests.html',
            controller: 'achievementsController'
        })
        .when('/managerMyRequests', {
            templateUrl: 'managerMyRequests.html',
            controller: 'achievementsController'
        })
        .when('/managerSubmissions', {
            templateUrl: 'managerSubmissions.html',
            controller: 'achievementsController'
        })
        .when('/managerReports', {
            templateUrl: 'managerReports.html',
            controller: 'achievementsController'
        })
        .when('/submit', {
            templateUrl: 'submitted.html',
            controller: 'achievementsController'
        })
        .otherwise({
            redirectTo: '/home'
        });
});

app.controller ("indexController",function ($scope){
});

app.controller("homeController",function($scope,$location,$http,usersFile,Shared)
{	
	

    $scope.loginSubmit = function ()
	{  
    usersFile.login($scope.Email  , $scope.Password).success(function(userInfo) { 
    $scope.users = userInfo;
   if($scope.users.length==null){
	   alert('This User Not Exist') ;
   }else{
           if ($scope.Email == $scope.users[0].employeeMail){
               if($scope.Password == $scope.users[0].employeePassword){
                    console.log('WELCOME ' + $scope.users[0].employeeName );
                   Shared.set('username', $scope.users[0].employeeName);
                  
                   Shared.set("employeeEmail" , $scope.users[0].employeeEmail) ;
                   Shared.set("employeeId" , $scope.users[0].employeeId) ;
                   if($scope.users[0].employeeIsManager == '1'){
                    $location.path('managerMyRequests');
                   }
                   else{
                       $location.path('employeeMyRequests');
                   }
         
               }
                else{
                   alert('Email and password do not match!');
                }
           }
   }
       });
                                
	}
});
    


app.controller ("achievementsController",function ($scope,$http,submissions,Shared,achievementTypes,myRequests,disclosureTable,usersFile)
{
	usersFile.getEmployeesInTheSameTeam(Shared.get("employeeId")).success(function(userInfo){
        $scope.users = userInfo;
    });
    
    achievementTypes.success(function(achievements){
        $scope.myAchievementsData = achievements;
    });
        
	
    myRequests.getAchievementsByEmployeeId(Shared.get("employeeId")).success(function(request){ 
        $scope.myReqData = request;
         });	
    submissions.success(function(employeeSubmissions){
        $scope.employeeSubmissions = employeeSubmissions;
    });
	
    
    disclosureTable.success(function(disclosureData){
        $scope.Mydisclosure = disclosureData;
        });
   
    
    $scope.username = Shared.get('username');
    
   $scope.showAchievements = function(idValue){
        var result = document.getElementById("resultDiv");
       for(var i = 0; i<$scope.employeeSubmissions.length; i++){
        if($scope.employeeSubmissions[i].id == idValue){
            
           if($scope.employeeSubmissions[i].type == 'Disclosure'){
                result.innerHTML = 
                    "<form>"+
                    "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.employeeSubmissions[i].name +"'/>" + 
                    "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].type + "'/>" + 
                    "<h3>Label: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].label + "</textarea>" + 
                    "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.employeeSubmissions[i].date + "'/></textarea>" + 
                    "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                    "<h3>Number: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].number + "'/>" + 
                    "<h3>Status: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].status + "'/>" + 
                    "<h3>Comments: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].comments + "</textarea><br>";
                    
               
           }
            else if($scope.employeeSubmissions[i].type == 'Board Reviews'){
                result.innerHTML = 
                "<form>"+
                    "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.employeeSubmissions[i].name +"'/>" + 
                    "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].type + "'/>" + 
                    "<h3>Label: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].label + "</textarea>" + 
                    "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.employeeSubmissions[i].date + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                    "<h3>Type of Certification: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].typeOfCertification + "'/>" + 
                    "<h3>Level: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].level + "'/>" + 
                    "<h3>Review Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].reviewType + "'/>" + 
                    "<h3>Comments: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].comments + "</textarea><br>";
            }
               else if($scope.employeeSubmissions[i].type == 'Customer Reference'){
                result.innerHTML = 
                "<form>"+
                    "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.employeeSubmissions[i].name +"'/>" + 
                    "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].type + "'/>" + 
                    "<h3>Label: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].label + "</textarea>" + 
                    "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.employeeSubmissions[i].date + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                    "<h3>Customer Name: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].customerName + "'/>" + 
                    "<h3>Country: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].country + "'/>" + 
                     "<h3>Link to Customer Reference: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].linkToCustomerReference + "'/>" + 
                    "<h3>Business Unit: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].businessUnit + "'/>" + 
                   
                    "<h3>Engagement Name: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].engagementName + "'/>" + 
                    "<h3>Comments: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].comments + "</textarea><br>";
            }
            
            else if($scope.employeeSubmissions[i].type == 'Customer Saves'){
                result.innerHTML = 
                "<form>"+
                    "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.employeeSubmissions[i].name +"'/>" + 
                    "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].type + "'/>" + 
                    "<h3>Label: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].label + "</textarea>" + 
                    "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.employeeSubmissions[i].date + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                    "<h3>Customer Name: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].customerName + "'/>" + 
                    "<h3>Country: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].country + "'/>" + 
                    "<h3>Business Unit: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].businessUnit + "'/>" + 
                    "<h3>Employee Contribution: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].employeeContribution + "</textarea>" + 
                    "<h3>Customer Problem: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].customerProblem + "</textarea>" + 
                    "<h3>Engagement Name: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].engagementName + "'/>" + 
                    "<h3>Comments: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].comments + "</textarea><br>";
            }
            
             else if($scope.employeeSubmissions[i].type == 'Feedback to Development'){
                 if($scope.employeeSubmissions[i].typeOfFeedback == 'Defect'){
                     
                result.innerHTML = 
                "<form>"+
                    "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.employeeSubmissions[i].name +"'/>" + 
                    "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].type + "'/>" + 
                    "<h3>Label: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].label + "</textarea>" + 
                    "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.employeeSubmissions[i].date + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                    "<h3>Type of Feedback: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].typeOfFeedback + "'/>" + 
                     "<h3>PMR Number: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].pmrNumber + "'/>" + 
                    "<h3>Business Unit: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].businessUnit + "'/>" + 
                    "<h3>Product: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].product + "'/>" + 
                   
                    "<h3>Comments: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].comments + "</textarea><br>";
                 }else{
                      result.innerHTML = 
                "<form>"+
                    "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.employeeSubmissions[i].name +"'/>" + 
                    "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].type + "'/>" + 
                    "<h3>Label: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].label + "</textarea>" + 
                    "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.employeeSubmissions[i].date + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                    "<h3>Type of Feedback: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].typeOfFeedback + "'/>" + 
                    
                    "<h3>Business Unit: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].businessUnit + "'/>" + 
                    "<h3>Product: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].product + "'/>" + 
                   
                    "<h3>Comments: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].comments + "</textarea><br>";
                 }
            }
            
            else if($scope.employeeSubmissions[i].type == 'High Impact Asset'){
                 if($scope.employeeSubmissions[i].typeOfAsset == 'Publication' || $scope.employeeSubmissions[i].typeOfAsset == 'Material'){
                result.innerHTML = 
                "<form>"+
                    "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.employeeSubmissions[i].name +"'/>" + 
                    "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].type + "'/>" + 
                    "<h3>Label: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].label + "</textarea>" + 
                    "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.employeeSubmissions[i].date + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                    "<h3>Type of Asset: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].typeOfAsset + "'/>" + 
                     "<input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].typeOfAsset2 + "'/>" + 
                    
                   
                    "<h3>Comments: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].comments + "</textarea><br>";
                 }
                else{
                result.innerHTML = 
                "<form>"+
                    "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.employeeSubmissions[i].name +"'/>" + 
                    "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].type + "'/>" + 
                    "<h3>Label: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].label + "</textarea>" + 
                    "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.employeeSubmissions[i].date + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                    "<h3>Type of Asset: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].typeOfAsset + "'/>" + 
                     
                    
                   
                    "<h3>Comments: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].comments + "</textarea><br>";
                }
                
            }
            
            else if($scope.employeeSubmissions[i].type == 'Mentorship'){
                if($scope.employeeSubmissions[i].typeOfMentorship == 'Certification'){
                result.innerHTML = 
                "<form>"+
                    "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.employeeSubmissions[i].name +"'/>" + 
                    "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].type + "'/>" + 
                    "<h3>Label: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].label + "</textarea>" + 
                    "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.employeeSubmissions[i].date + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                    "<h3>Type of Mentorship: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].typeOfMentorship + "'/>" + 
                    "<h3>Type of Certification: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].typeOfCertification + "'/>" + 
                  
                    "<h3>Comments: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].comments + "</textarea><br>";
            }
                else if($scope.employeeSubmissions[i].typeOfMentorship == 'Skill'){
                    result.innerHTML = 
                "<form>"+
                    "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.employeeSubmissions[i].name +"'/>" + 
                    "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].type + "'/>" + 
                    "<h3>Label: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].label + "</textarea>" + 
                    "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.employeeSubmissions[i].date + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                    "<h3>Type of Mentorship: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].typeOfMentorship + "'/>" + 
                    "<h3>Area: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].area + "'/>" + 
                    "<h3>Duration (in weeks): </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].duration + "'/>" + 
                    
                    "<h3>Comments: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].comments + "</textarea><br>";
                }
                else{
                    result.innerHTML = 
                "<form>"+
                    "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.employeeSubmissions[i].name +"'/>" + 
                    "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].type + "'/>" + 
                    "<h3>Label: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].label + "</textarea>" + 
                    "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.employeeSubmissions[i].date + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                    "<h3>Type of Mentorship: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].typeOfMentorship + "'/>" + 
                   
                    
                    "<h3>Comments: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].comments + "</textarea><br>";
                }
            }
            else if($scope.employeeSubmissions[i].type == 'Success Stories'){
                result.innerHTML = 
                "<form>"+
                    "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.employeeSubmissions[i].name +"'/>" + 
                    "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].type + "'/>" + 
                    "<h3>Label: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].label + "</textarea>" + 
                    "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.employeeSubmissions[i].date + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                    "<h3>Customer Name: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].customerName + "'/>" + 
                    "<h3>Engagement Name: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].engagementName + "'/>" + 
                    "<h3>Country: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].country + "'/>" + 
                    "<h3>Business Unit: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].businessUnit + "'/>" +
                    "<h3>Link to Success Story: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].linkToSuccessStory + "'/>" + 
                    "<h3>Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].storyType + "'/>" + 
                    "<h3>Comments: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].comments + "</textarea><br>";
            }
            
              else if($scope.employeeSubmissions[i].type == 'Enablement'){
                  if($scope.employeeSubmissions[i].typeOfEnablement == 'Customer'){
                result.innerHTML = 
                "<form>"+
                    "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.employeeSubmissions[i].name +"'/>" + 
                    "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].type + "'/>" + 
                    "<h3>Label: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].label + "</textarea>" + 
                    "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.employeeSubmissions[i].date + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                    "<h3>Type of Enablement: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].typeOfEnablement + "'/>" + 
                    "<h3>Title: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].title + "'/>" + 
                    "<h3>Duration (in weeks): </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].duration + "'/>" + 
                    "<h3>Number of Attendees: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].numberOfAttendees + "'/>" +
                    "<h3>Business Unit: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].businessUnit + "'/>" + 
                    "<h3>Customer Name: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].customerName + "'/>" + 
                    "<h3>Customer Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].customerType + "'/>" + 
                    "<h3>Event: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].event + "'/>" + 
                    "<h3>Comments: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].comments + "</textarea><br>";
            }
                  else{
                  result.innerHTML = 
                "<form>"+
                    "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.employeeSubmissions[i].name +"'/>" + 
                    "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].type + "'/>" + 
                    "<h3>Label: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].label + "</textarea>" + 
                    "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.employeeSubmissions[i].date + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                    "<h3>Type of Enablement: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].typeOfEnablement + "'/>" + 
                    "<h3>Title: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].title + "'/>" + 
                    "<h3>Duration (in weeks): </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].duration + "'/>" + 
                    "<h3>Number of Attendees: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].numberOfAttendees + "'/>" +
                    "<h3>Business Unit: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].businessUnit + "'/>" + 
                    "<h3>Event: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].event + "'/>" + 
                    "<h3>Comments: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].comments + "</textarea><br>";
                  }
              }
            
             else if($scope.employeeSubmissions[i].type == 'Certifications & Programs'){
                 if($scope.employeeSubmissions[i].typeOfCertification == 'Product'){
                result.innerHTML = 
                "<form>"+
                    "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.employeeSubmissions[i].name +"'/>" + 
                    "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].type + "'/>" + 
                    "<h3>Label: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].label + "</textarea>" + 
                    "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.employeeSubmissions[i].date + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                    "<h3>Type of Certification: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].typeOfCertification + "'/>" + 
                    "<h3>Product Name: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].productName + "'/>" + 
                    "<h3>Business Unit: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].businessUnit + "'/>" + 
                    "<h3>Certification Exam: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].certificationExam + "'/>" +
                  
                    "<h3>Comments: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].comments + "</textarea><br>";
            }
                 else if($scope.employeeSubmissions[i].typeOfCertification == 'Professional'){
                     result.innerHTML = 
                "<form>"+
                    "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.employeeSubmissions[i].name +"'/>" + 
                    "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].type + "'/>" + 
                    "<h3>Label: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].label + "</textarea>" + 
                    "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.employeeSubmissions[i].date + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                    "<h3>Type of Certification: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].typeOfCertification + "'/>" + 
                    "<h3>Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].professionalType + "'/>" + 
                    "<h3>Level: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].level + "'/>" + 
                    
                  
                    "<h3>Comments: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].comments + "</textarea><br>";
                 }
                 else{
                       result.innerHTML = 
                "<form>"+
                    "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.employeeSubmissions[i].name +"'/>" + 
                    "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].type + "'/>" + 
                    "<h3>Label: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].label + "</textarea>" + 
                    "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.employeeSubmissions[i].date + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                    "<h3>Type of Certification: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].typeOfCertification + "'/>" + 
                   
                    
                  
                    "<h3>Comments: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].comments + "</textarea><br>";
                
                 }
             }
            
             else if($scope.employeeSubmissions[i].type == 'Revenue Influence'){
                result.innerHTML = 
                "<form>"+
                    "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.employeeSubmissions[i].name +"'/>" + 
                    "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].type + "'/>" + 
                    "<h3>Label: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].label + "</textarea>" + 
                    "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.employeeSubmissions[i].date + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                    "<h3>Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].influenceType + "'/>" + 
                    "<h3>Business Unit: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].businessUnit + "'/>" + 
                    "<h3>Amount: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].amount + "'/>" + 
                    "<h3>Description of Contribution: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].descriptionOfContribution + "'/>" +
                    "<h3>Contribution Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].contributionType + "'/>" + 
                    "<h3>Customer Name: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].customerName + "'/>" + 
                    "<h3>Country: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].country + "'/>" + 
                    "<h3>Engagement Name: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].engagementName + "'/>" + 
                    "<h3>Comments: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].comments + "</textarea><br>";
            }
            
            else if($scope.employeeSubmissions[i].type == 'Speaking/Organizing Events'){
                if($scope.employeeSubmissions[i].role == 'Speaker'){
                result.innerHTML = 
                "<form>"+
                    "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.employeeSubmissions[i].name +"'/>" + 
                    "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].type + "'/>" + 
                    "<h3>Label: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].label + "</textarea>" + 
                    "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.employeeSubmissions[i].date + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                    "<h3>Title of Event: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].titleOfEvent + "'/>" + 
                    "<h3>Role: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].role + "'/>" + 
                    "<h3>Country: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].country + "'/>" +
                    "<h3>Business Unit: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].businessUnit + "'/>" +
                    "<h3>Title of Conference: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].titleOfConference + "'/>" + 
                    "<h3>Session: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].session + "'/>" + 
                    "<h3>Internal or External: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].internalOrExternal + "'/>" + 
                    "<h3>Type of Event: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].typeOfEvent + "'/>" + 
                    "<h3>Comments: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].comments + "</textarea><br>";
            }
                else{
                    result.innerHTML = 
                "<form>"+
                    "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.employeeSubmissions[i].name +"'/>" + 
                    "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].type + "'/>" + 
                    "<h3>Label: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].label + "</textarea>" + 
                    "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.employeeSubmissions[i].date + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                    "<h3>Title of Event: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].titleOfEvent + "'/>" + 
                    "<h3>Role: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].role + "'/>" + 
                        "<h3>Role of Organizer: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].roleOfOrganizer + "'/>" + 
                    "<h3>Country: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].country + "'/>" + 
                    "<h3>Business Unit: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].businessUnit + "'/>" +
                    "<h3>Title of Conference: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].titleOfConference + "'/>" + 
                    "<h3>Session: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].session + "'/>" + 
                    "<h3>Internal or External: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].internalOrExternal + "'/>" + 
                    "<h3>Type of Event: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].typeOfEvent + "'/>" + 
                    "<h3>Comments: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].comments + "</textarea><br>";
                }
            }
            
            else{
            result.innerHTML = '';
           }
        }
        
           var managerFeedback = document.getElementById("managerFeedback");
           managerFeedback.innerHTML = "<h3>Manager's Feedback:</h3> <textarea class='form-control' placeholder='optional'></textarea><br><br>"
           
           var submitButton = document.getElementById("submitDiv");
           submitButton.innerHTML = " <input type='submit' class='btn btn-success' style='margin-bottom: 30px; width:250px; margin-right:20px' value='Submit Changes & Accept'/> <input type='submit' class='btn btn-danger' style='margin-bottom: 30px; width:250px;' value='Reject'/></form>"
           
           
       }
        
    
    };
    
   
    $scope.addAchievement = function(){
    	var json = {} ; 
    	var len = document.getElementsByName("employeeList[]").length ; 
    	var employeeList =  document.getElementsByName("employeeList[]") ;
    	var employees=[] ; 
    	for(var i=0 ; i<len ; i++){
    		if(employeeList[i].checked) employess.push(employeeList[i].value)  ;
    	}    
    	json["lobName"] = document.getElementById("lobName").value ;
    	json["comment"]  = document.getElementById("comment").value ;
    	json["date"] = document.getElementById("achievementDate").value  ; 
    	json["employeeId"] = Shared.get("employeeId");
    	json["sharedEmployess"] = employees ; 
    	
    	if($scope.myDropDown=='Mentorship'){
    		json['description'] =  document.getElementById("mentorShipDescription").value ;
    		json['type'] = "MentorShip" ; 
    	   if($scope.mentorshipDropDown=='career'){
    		   json['typeOfMentorship'] =  "Career";
    	   }else if($scope.mentorshipDropDown=='summerInternship'){
    		   json['typeOfMentorship'] =  "SummerInternship";
    	   }else if($scope.mentorshipDropDown=='skill'){
    		   json['typeOfMentorship'] =  "Skill";
    		   json['area'] = document.getElementById("mentorshipSkillArea").value ;
    		   json['duration'] = document.getElementById("mentorshipSkillDuration").value ;
    		   json['brand'] = document.getElementById("mentorshipSkillBrand").value ;
    		   
    	   }else if($scope.mentorshipDropDown=='certification'){
    		   json['typeOfMentorship'] = "Certification";
    		   json['typeOfCertification'] = document.getElementById("mentorshipCertificationType").value ;
    	   }
    	   
    	}else if ($scope.myDropDown=='Disclosure'){
    		json["title"] = document.getElementById("disclosureTitle").value ; 
    		json["number"]  = document.getElementById("disclosureNumber").value ;  
            json["type"] = "Disclosure" ; 
    	}else if($scope.myDropDown=='Success Stories'){
    		json["type"] = "SuccessStories" ; 
    		json["customerName"]=document.getElementById("successStoriesCustomerName").value;
    		json["engagementName"]=document.getElementById("successStoriesEngagementName").value;
    		json["country"]=document.getElementById("successStoriesCountry").value;
    		json["busUnit"]=document.getElementById("successStoriesBusinessUnits").value;
    		json["successStoryLink"]=document.getElementById("successStoriesLinkToSuccessStory").value;
    		json["successStoriesType"]=document.getElementById("successStoriesType").value;
    		
    	}else if($scope.myDropDown=='Enablement'){
    		json["type"] = "Enablement" ;
    		json["typeOfEnablement"] = $scope.EnablementType ;
    		json["title"] = document.getElementById("enablementTitle").value;
    		json["duration"] = document.getElementById("enablementDuration").value;
    		json["numberOfAttendants"] = document.getElementById("enablementNumberOfAttendees").value;
    		json["busUnit"] = document.getElementById("enablementBusinessUnits").value;
    		json["event"] = document.getElementById("EnablementEvent").value;
    		if($scope.EnablementType=="Customer"){
    			json["customerName"] =  document.getElementById("EnablementCustomerName").value;
    			json["customerType"] =  $scope.CustomerType;
    		}
    	}else if($scope.myDropDown=="Customer Reference"){
    		json["type"] = "CustomerReferences" ;
    		json["customerName"]=document.getElementById("customerReferenceCustomerName").value;
    		json["country"]=document.getElementById("customerReferenceCountry").value;
    		json["brand"]=document.getElementById("customerReferenceBarnd").value;
    		json["busUnit"]=document.getElementById("customerReferenceBusUnit").value;
    		json["engagmentName"]=document.getElementById("customerReferenceEngagementName").value;
    	}else if($scope.myDropDown=="CertificationsAndPrograms"){
    		json["type"] = "CertificationsAndPrograms" ;
    		
    	}
    	 $http({
 		      method:'POST',
 		      url:'http://localhost:9080/Achievements-App/Services/AchievementManipulation/AddAchievement', 
 		      params:{achievementJson:JSON.stringify(json)},
 		      headers:{
 		          'Content-type':'application/json'
     }});
    };
	
	
       $scope.my = [];
    
	
	$scope.addName = function (){	
		
		$scope.my.push($scope.my.name);
		
	}
	
	$scope.clear = function ()
	{
		$scope.my=[];
		$scope.selectedVariant ={};
		$scope.search='';
	}
        
       
		
});


