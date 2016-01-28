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
    



app.controller ("achievementsController",function ($scope,$http,submissions,Shared,achievementTypes,myRequests,myRequestsByBrand,myRequestsByStatus,myRequestsByStatusAndID,myRequestsByType,disclosureTable,usersFile)
{
	 
	$scope.range = function(){
		
		var arry = [] ; 
	     for(var i=1990 ; i<=new Date().getFullYear(); i++){
	    	 arry.push(i) ; 
	     }
		return arry ;
	}
	
	usersFile.getEmployeesInTheSameTeam(Shared.get("employeeId")).success(function(userInfo){
        $scope.users = userInfo;
    });
    
    achievementTypes.success(function(achievements){
        $scope.myAchievementsData = achievements;
    });
        
    myRequests.getAchievementsByEmployeeId(Shared.get("employeeId")).success(function(request){ 
        $scope.myReqData = request;
         });	
    
    $scope.getAchievementsByStatus = function(status){
    myRequestsByStatus.getAchievementsByStatus(status).success(function(request){ 
        $scope.myReqDataStatus = request;
         });
    } ;
    
    $scope.getAchievementsByEmployeeIdAndStatus = function(status){
    myRequestsByStatusAndID.getAchievementsByEmployeeIdAndStatus(Shared.get("employeeId") , status).success(function(request){ 
        $scope.myReqDataStatusAndID = request;
    });
    };
    
    $scope.getAchievementsByType = function(type){
    myRequestsByType.getAchievmentByType(type , Shared.get("employeeId")).success(function(request){ 
        $scope.myReqDataType = request;
    });
    } ; 
    
    $scope.getAchievementsByBrandAndEmployeeId = function(brand){
    myRequestsByBrand.getAchievementsByBrandAndEmployeeId(Shared.get("employeeId") , brand).success(function(request){ 
        $scope.myReqDataBrand = request;
    });
    } ;
    
    submissions.getManagerSubmissions(Shared.get("employeeId")).success(function(request){
        $scope.employeeSubmissions = request;
    });
	
    
    disclosureTable.success(function(disclosureData){
        $scope.Mydisclosure = disclosureData;
        });
   
    
    $scope.username = Shared.get('username');
    
   $scope.showAchievements = function(idValue , achievementType){
	   
	   submissions.getAchievementById(idValue).success(function (resp){
		   $scope.achievementJson = resp ;
		   alert($scope.achievementJson.achievementId) ;
		   var result = document.getElementById("resultDiv");
		   
		   if(achievementType == 'Disclosure'){
               result.innerHTML = 
                   "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/></textarea>" + 
                   "<h3>Shared with: </h3><textarea class='form-control'>" +  $scope.achievementJson.shared + "</textarea>" + 
                   "<h3>Number: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.number + "'/>" + 
                   "<h3>Status: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.status + "'/>" + 
                   "<h3>Comments: </h3><textarea class='form-control'>" +  $scope.achievementJson.comment + "</textarea><br>";
                   
              
          } else if(achievementType == 'Board Reviews'){
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType  + "'/>" + 
                   "<h3>Label: </h3><textarea class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                   "<h3>Type of Certification: </h3><input type='text' class='form-control' value='" +  $scope.achievementJson.typeOfCertificate + "'/>" + 
                   "<h3>Level: </h3><input type='text' class='form-control' value='" +$scope.achievementJson.boardReviewLevel + "'/>" + 
                   "<h3>Review Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.reviewType + "'/>" + 
                   "<h3>Comments: </h3><textarea class='form-control'>" + $scope.achievementJson.comment + "</textarea><br>";
           }
              else if(achievementType == 'Customer Reference'){
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" +$scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.$scope.achievementJson.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                   "<h3>Customer Name: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.customerName + "'/>" + 
                   "<h3>Country: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.country + "'/>" + 
                    "<h3>Link to Customer Reference: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.brand + "'/>" + 
                   "<h3>Business Unit: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.busUnit + "'/>" + 
                   "<h3>Engagement Name: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.engagementName + "'/>" + 
                   "<h3>Comments: </h3><textarea class='form-control'>" + $scope.achievementJson.comment + "</textarea><br>";
           }
           
           else if(achievementType == 'Customer Saves'){
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea class='form-control'>" +  $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate  + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                   "<h3>Customer Name: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.customerName + "'/>" + 
                   "<h3>Country: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.country + "'/>" + 
                   "<h3>Business Unit: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.businessUnits + "'/>" + 
                   "<h3>Employee Contribution: </h3><textarea class='form-control'>" + $scope.achievementJson.employeeContribution + "</textarea>" + 
                   "<h3>Customer Problem: </h3><textarea class='form-control'>" + $scope.achievementJson.customerProblem + "</textarea>" + 
                   "<h3>Engagement Name: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.engagementName + "'/>" + 
                   "<h3>Comments: </h3><textarea class='form-control'>" +$scope.achievementJson.comment  + "</textarea><br>";
           }
           
            else if(achievementType == 'Feedback to Development'){
                if($scope.achievementJson.typeOfFeedback == 'Defect'){
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                   "<h3>Type of Feedback: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.typeOfFeedback + "'/>" + 
                    "<h3>PMR Number: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.pmrNumber + "'/>" + 
                   "<h3>Business Unit: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.businessUnits + "'/>" + 
                   "<h3>Product: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.product + "'/>" + 
                  
                   "<h3>Comments: </h3><textarea class='form-control'>" + $scope.achievementJson.comment + "</textarea><br>";
                }else{
                     result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                   "<h3>Type of Feedback: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.typeOfFeedback + "'/>" + 
                   "<h3>PMR Number: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.pmrNumber + "'/>" + 
                   "<h3>Business Unit: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.businessUnits + "'/>" + 
                   "<h3>Product: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.product + "'/>" + 
                  
                   "<h3>Comments: </h3><textarea class='form-control'>" +  $scope.achievementJson.comment + "</textarea><br>";
                }
           }
           
           else if($scope.achievementJson.achievement.achievementType == 'High Impact Asset'){
                if($scope.achievementJson.typeOfAsset == 'Publication' || $scope.achievementJson.typeOfAsset == 'Material'){
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName  +"'/>" + 
                   "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                   "<h3>Type of Asset: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.typeOfAsset + "'/>" + 
                   "<input type='text' class='form-control' value='" + $scope.achievementJson.typeOfAsset2 + "'/>" + 
                   "<h3>Comments: </h3><textarea class='form-control'>" + $scope.achievementJson.comment + "</textarea><br>";
                }
               else{
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                   "<h3>Type of Asset: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.typeOfAsset + "'/>" + 
                   "<h3>Comments: </h3><textarea class='form-control'>" + $scope.achievementJson.comment + "</textarea><br>";
               }
               
           }
           else if($scope.achievementJson.achievement.achievementType == 'Mentorship'){
               if($scope.achievementJson.typeOfMentorship == 'Certification'){
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType+ "'/>" + 
                   "<h3>Label: </h3><textarea class='form-control'>" + $scope.achievementJson.achievement.lobName+ "</textarea>" + 
                   "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                   "<h3>Type of Mentorship: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.typeOfMentorship + "'/>" + 
                   "<h3>Type of Certification: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.typeOfCertification + "'/>" + 
                   "<h3>Comments: </h3><textarea class='form-control'>" + $scope.achievementJson.comment  + "</textarea><br>";
           }
               else if($scope.achievementJson.achievement.achievementType == 'Skill'){
                   result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                   "<h3>Type of Mentorship: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.typeOfMentorship + "'/>" + 
                   "<h3>Area: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.area + "'/>" + 
                   "<h3>Duration (in weeks): </h3><input type='text' class='form-control' value='" + $scope.achievementJson.duration + "'/>" + 
                   "<h3>Comments: </h3><textarea class='form-control'>" + $scope.achievementJson.comment  + "</textarea><br>";
               }
               else{
                   result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                   "<h3>Type of Mentorship: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.typeOfMentorship + "'/>" + 
                   "<h3>Comments: </h3><textarea class='form-control'>" + $scope.achievementJson.comment  + "</textarea><br>";
               }
           }
           else if($scope.achievementJson.achievement.achievementType == 'Success Stories'){
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                   "<h3>Customer Name: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.customerName + "'/>" + 
                   "<h3>Engagement Name: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.engagementName + "'/>" + 
                   "<h3>Country: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.country + "'/>" + 
                   "<h3>Business Unit: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.businessUnit + "'/>" +
                   "<h3>Link to Success Story: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.linkToSuccessStory + "'/>" + 
                   "<h3>Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.storyType + "'/>" + 
                   "<h3>Comments: </h3><textarea class='form-control'>" + $scope.achievementJson.comment  + "</textarea><br>";
           }
           
             else if($scope.achievementJson.achievement.achievementType == 'Enablement'){
                 if($scope.achievementJson.typeOfEnablement== 'Customer'){
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                   "<h3>Type of Enablement: </h3><input type='text' class='form-control' value='" + $scope.employeeSubmissions[i].typeOfEnablement + "'/>" + 
                   "<h3>Title: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.title + "'/>" + 
                   "<h3>Duration (in weeks): </h3><input type='text' class='form-control' value='" + $scope.achievementJson.duration + "'/>" + 
                   "<h3>Number of Attendees: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.numberOfAttendees + "'/>" +
                   "<h3>Business Unit: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.businessUnit + "'/>" + 
                   "<h3>Customer Name: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.customerName + "'/>" + 
                   "<h3>Customer Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.customerType + "'/>" + 
                   "<h3>Event: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.event + "'/>" + 
                   "<h3>Comments: </h3><textarea class='form-control'>" + $scope.achievementJson.comment  + "</textarea><br>";
           }
                 else{
                 result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType+ "'/>" + 
                   "<h3>Label: </h3><textarea class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                   "<h3>Type of Enablement: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.typeOfEnablement + "'/>" + 
                   "<h3>Title: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.title + "'/>" + 
                   "<h3>Duration (in weeks): </h3><input type='text' class='form-control' value='" + $scope.achievementJson.duration + "'/>" + 
                   "<h3>Number of Attendees: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.numberOfAttendees + "'/>" +
                   "<h3>Business Unit: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.businessUnit + "'/>" + 
                   "<h3>Event: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.event + "'/>" + 
                   "<h3>Comments: </h3><textarea class='form-control'>" + $scope.achievementJson.comment  + "</textarea><br>";
                 }
             }
           
            else if($scope.achievementJson.achievement.achievementType == 'Certifications & Programs'){
                if($scope.achievementJson.typeOfCertification == 'Product'){
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                   "<h3>Type of Certification: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.typeOfCertification + "'/>" + 
                   "<h3>Product Name: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.productName + "'/>" + 
                   "<h3>Business Unit: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.businessUnit + "'/>" + 
                   "<h3>Certification Exam: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.certificationExam + "'/>" +
                   "<h3>Comments: </h3><textarea class='form-control'>" + $scope.achievementJson.comment  + "</textarea><br>";
           }
                else if($scope.employeeSubmissions[i].typeOfCertification == 'Professional'){
                    result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                     
                   "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                   "<h3>Type of Certification: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.typeOfCertification + "'/>" + 
                   "<h3>Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.professionalType + "'/>" + 
                   "<h3>Level: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.level + "'/>" + 
                   
                 
                   "<h3>Comments: </h3><textarea class='form-control'>" + $scope.achievementJson.comment  + "</textarea><br>";
                }
                else{
                      result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                   "<h3>Type of Certification: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.typeOfCertification + "'/>" + 
                   "<h3>Comments: </h3><textarea class='form-control'>" +$scope.achievementJson.comment  + "</textarea><br>";
               
                }
            }
           
            else if($scope.achievementJson.achievement.achievementType == 'Revenue Influence'){
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" +  $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                   "<h3>Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.influenceType + "'/>" + 
                   "<h3>Business Unit: </h3><input type='text' class='form-control' value='"  + $scope.achievementJson.achievement.businessUnit + "'/>" + 
                   "<h3>Amount: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.amount + "'/>" + 
                   "<h3>Description of Contribution: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.descriptionOfContribution + "'/>" +
                   "<h3>Contribution Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.contributionType + "'/>" + 
                   "<h3>Customer Name: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.customerName + "'/>" + 
                   "<h3>Country: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.country + "'/>" + 
                   "<h3>Engagement Name: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.engagementName + "'/>" + 
                   "<h3>Comments: </h3><textarea class='form-control'>" +$scope.achievementJson.comment + "</textarea><br>";
           }
           
           else if($scope.achievementJson.achievement.achievementType == 'Speaking/Organizing Events'){
               if($scope.achievementJson.typeOfEvent == 'Speaker'){
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName  +"'/>" + 
                   "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                   
                   "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.achievementJson.achievement.shared + "</textarea>" + 
                   "<h3>Title of Event: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.titleOfEvent + "'/>" + 
                   "<h3>Role: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.role + "'/>" + 
                   "<h3>Country: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.country + "'/>" +
                   "<h3>Business Unit: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.businessUnit + "'/>" +
                   "<h3>Title of Conference: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.titleOfConference + "'/>" + 
                   "<h3>Session: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.session + "'/>" + 
                   "<h3>Internal or External: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.internalOrExternal + "'/>" + 
                   "<h3>Type of Event: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.typeOfEvent + "'/>" + 
                   "<h3>Comments: </h3><textarea class='form-control'>" +$scope.achievementJson.comment + "</textarea><br>";
           }
               else{
                   result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName  +"'/>" + 
                   "<h3>Achievement Type: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.employeeSubmissions[i].shared + "</textarea>" + 
                   "<h3>Title of Event: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.titleOfEvent + "'/>" + 
                   "<h3>Role: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.role + "'/>" + 
                   "<h3>Role of Organizer: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.roleOfOrganizer + "'/>" + 
                   "<h3>Country: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.country + "'/>" + 
                   "<h3>Business Unit: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.businessUnit + "'/>" +
                   "<h3>Title of Conference: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.titleOfConference + "'/>" + 
                   "<h3>Session: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.session + "'/>" + 
                   "<h3>Internal or External: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.internalOrExternal + "'/>" + 
                   "<h3>Type of Event: </h3><input type='text' class='form-control' value='" + $scope.achievementJson.achievement.typeOfEvent + "'/>" + 
                   "<h3>Comments: </h3><textarea class='form-control'>" +$scope.achievementJson.comment + "</textarea><br>";
               }
           }
           
           else{
           result.innerHTML = '';
          }
       
          var managerFeedback = document.getElementById("managerFeedback");
          managerFeedback.innerHTML = "<h3>Manager's Feedback:</h3> <textarea class='form-control' placeholder='optional'></textarea><br><br>"
          
          var submitButton = document.getElementById("submitDiv");
          submitButton.innerHTML = " <input type='submit' class='btn btn-success' style='margin-bottom: 30px; width:250px; margin-right:20px' value='Submit Changes & Accept'/> <input type='submit' class='btn btn-danger' style='margin-bottom: 30px; width:250px;' value='Reject'/></form>"
          
		   
	   });
	   
	   
       
        
          
           
        
    
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
    	   
    	}else if($scope.myDropDwon=="Board Reviews"){
			
			json["type"] = "BoardReviews" ;
			 json["typeOfCertificate"] = $scope.BoardReviewsCertificationMenu;
			 json["flag"] = document.getElementById("BoardReviewsFlag").value;
			 json["reviewType"] = $scope.BoardReviewsTypeMenu;
			 json["boardReviewLevel"] = $scope.BoardReviewsLevelMenu;
			 alert(JSON.stringify(json));
      	
    	}else if($scope.myDropDown=="Certifications & Programs"){
    		json["type"] = "CertificationsAndPrograms" ;
    		json["TypeOfCertification"] = $scope.CertificationProgramType ;
    		if($scope.CertificationProgramType=="Product"){
    			json["proudctName"] = document.getElementById("CertificationProgramProductName").value;
    		    json["busUnit"] = document.getElementById("CertificationProgramBusinessUnits").value;
    		    json["brand"] = document.getElementById("CertificationProgramBrand").value;
    			json["certificatioExam"] = document.getElementById("CertificationProgramCertificationExam").value;
    		}else if($scope.CertificationProgramType=="Professional"){
    			 json["level"] = $scope.CertificationProgramProfessionalLevel;
    			 json["professionalType"] = $scope.CertificationProgramProfessionalType;
    				 
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
    	}else if($scope.myDropDown=='Customer Saves'){
    		json["type"] = "CustomerSave" ;
    		json["brand"]=document.getElementById("customerSavesSkillBrand").value;
    		json['customerName'] = document.getElementById("customerSavesCustomerName").value;
    		json['country'] = document.getElementById("customerSavesCountry").value;
    		json['businessUnits'] = document.getElementById("customerSavesBusUnit").value;
    		json['employeeContribution'] = document.getElementById("customerSavesEmployeeContribution").value;
    		json['CustomerProblem'] = document.getElementById("customerSavesCustomerProblem").value;
    		json['engagementName'] = document.getElementById("customerSavesEngagmentName").value;
    	}else if($scope.myDropDown=='Revenue Influence'){
    		json["type"] = "RevenueInfluence" ;
    		 var radioType = document.getElementsByName("revenueInfelunceType") ;
    		json["revenueInfelunceType"] = radioType[0].checked ? radioType[0].value:(radioType[1].checked?radioType[1].value:radioType[2].value) ;
    		json["businessUnits"] = document.getElementById("revenueInfluenceBusinessUnits").value;
    		json["amount"] = document.getElementById("revenueInfluenceAmount").value;
    		json["descriptionOfContribution"] = document.getElementById("revenueInfluenceAmountDescriptionOfContribution").value;
    		json["contributionType"] = $scope.ContributionType;
    		json["customerName"] = document.getElementById("revenueInfluenceCustomerName").value;
    		json["country"] = document.getElementById("revenueInfluenceCountry").value;
    		json["engagementName"] = document.getElementById("revenueInfluenceEngagementName").value;
    		json["brand"] = document.getElementById("revenueInfluenceEngagementName").value;
    	}else if($scope.myDropDown=='Speaking/Organizing Events'){
    		json["type"] = "SpeakingOrganizingEvent" ; 
    		json["titleOfEvent"] =document.getElementById("SpeakingOrganizingTitleOfEvent").value; 
    		var radioType = document.getElementsByName("SpeakingOrganizingType") ;
    		json["speakingOrganizingEventsType"] = radioType[0].checked ? radioType[0].value:(radioType[1].checked?radioType[1].value:radioType[2].value) ;
    		json["country"] =document.getElementById("SpeakingOrganizingCountry").value;
    		json["businessUnits"] =document.getElementById("SpeakingOrganizingBusinessUnits").value;
    		json["titleOfConference"] =document.getElementById("SpeakingOrganizingTitleofConference").value;
    		json["sessions"] =document.getElementById("SpeakingOrganizingSession").value;
    		var sessionType = document.getElementsByName("SpeakingOrganizingIBM") ;
    		json["sessionType"] = sessionType[0].checked ? sessionType[0].value: sessionType[1].value;
    		json["typeOfEvent"] = document.getElementById("SpeakingOrganizingTypeOfEvent").value;
    	}else if($scope.myDropDown=='High Impact Asset'){
    		json["type"] = "HighImpactAsset" ; 
    		json['typeOfAsset'] = $scope.assetDropDown ;
    		json["highImpactAssetName"] =document.getElementById("highImpactAssetName").value ;
    		json["description"] =document.getElementById("highImpactAssetDescription").value ;
    		json["brand"] =document.getElementById("highImpactAssetBrand").value ;
    		if($scope.assetDropDown=='publication'){
    			json["typeOfAsset2"] = $scope.publicationDropDown ; 
    		}else if($scope.assetDropDown=='material'){
    			json["typeOfAsset2"] = $scope.materialDropDown ;
    		}else{
    			json["typeOfAsset2"] = "null"
    		}
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






