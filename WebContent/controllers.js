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
    



app.controller ("achievementsController",function ($scope,$http,$compile,$location,submissions,Shared,achievementTypes,myRequests,myRequestsByBrand,myRequestsByStatus,myRequestsByStatusAndID,myRequestsByType,disclosureTable,usersFile)
{
	 
	$scope.range = function(){
		
		var arry = [] ; 
	     for(var i=1990 ; i<=new Date().getFullYear(); i++){
	    	 arry.push(i) ; 
	     }
		return arry ;
	}
	
	$scope.splitEmployees = function (employees){
		var names = "";
		for (var i = 0; i < employees.length ; i++) {
			names += employees[i].employeeName + ";" ;
			
		}
		return names;
	}
	
	$scope.getFirstEmployee = function(employees){
		try{
		return employees[0].employeeName ;
		}catch(err){
			return "" ;
		}
	};
	
	
	usersFile.getEmployeesInTheSameTeam(Shared.get("employeeId")).success(function(userInfo){
        $scope.users = userInfo;
    });
    
    achievementTypes.success(function(achievements){
        $scope.myAchievementsData = achievements;
    });
        
    myRequests.getAchievementsByEmployeeId(Shared.get("employeeId")).success(function(request){ 
        $scope.myReqData = request;
         });	
    $scope.getAchievementsByEmployeeId = function (id){
    	myRequests.getAchievementsByEmployeeId(id).success(function(request){ 
            $scope.myReqData = request;
             });
    }
    
    $scope.getAchievementsByStatus = function(status){
    myRequestsByStatus.getAchievementsByStatus(status).success(function(request){ 
        $scope.myReqDataStatus = request;
         });
    } ;
    
    $scope.getAchievementsByQuarter = function() {
    	var quarter = document.getElementById("quarterDate").value ; 
    	var year = document.getElementById("yearDate").value ; 
    	submissions.getAchievementByQuarter( quarter, year,  Shared.get("employeeId")).success(function(req){
    		$scope.myReqData = req ; 
    	});
    };
    
    $scope.getAchievementsByMonth = function() {
    	var month = document.getElementById("monthDate").value ; 
    	var year = document.getElementById("yearDate").value ; 
    	submissions.getAchievementsByMonth( month , year ,  Shared.get("employeeId")).success(function(req){
    		$scope.myReqData = req ; 
    	});
    };
    
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
	
    
    
   
    
    $scope.username = Shared.get('username');
    
   $scope.showAchievements = function(idValue , achievementType , isManager){
	   
	   submissions.getAchievementById(idValue).success(function (resp){
		   $scope.achievementJson = resp ;
		   $scope.achievementId = idValue ; 
		   var result = document.getElementById("resultDiv");
		   result.innerHTML = '' ;
		   alert(achievementType) ;
		   
		   if(achievementType == 'Disclosure'){
               result.innerHTML = 
                   "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input  id='achievementType' type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea id='lobName' class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Title: </h3><input  id='achievementTitle' type='text' class='form-control' value='" + $scope.achievementJson.title + "'/>" +
                   "<h3>Date: </h3><input id='achievementDate' type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/></textarea>" + 
                   "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.splitEmployees( $scope.achievementJson.achievement.employees) + "</textarea>" + 
                   "<h3>Number: </h3><input id='achievementNum' type='text' class='form-control' value='" + $scope.achievementJson.number + "'/>" + 
                   "<h3>Comments: </h3><textarea id='comment' class='form-control'>" +  $scope.achievementJson.achievement.comment + "</textarea><br>";
          }else if(achievementType == 'BoardReviews'){
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input id='achievementType' type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType  + "'/>" + 
                   "<h3>Label: </h3><textarea id='lobName' class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>flag: </h3><input id='flag' class='form-control' value='" + $scope.achievementJson.flag + "'/>" +
                   "<h3>Date: </h3><input id='achievementDate' type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                    
                   "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.splitEmployees( $scope.achievementJson.achievement.employees) + "</textarea>" + 
                   "<h3>Type of Certification: </h3><input id='typeOfCertification'  type='text' class='form-control' value='" +  $scope.achievementJson.typeOfCertificate + "'/>" + 
                   "<h3>Level: </h3><input id='level' type='text' class='form-control' value='" +$scope.achievementJson.boardReviewLevel + "'/>" + 
                   "<h3>Review Type: </h3><input id='reviewType' type='text' class='form-control' value='" + $scope.achievementJson.reviewType + "'/>" + 
                   "<h3>Comments: </h3><textarea id='comment' class='form-control'>" + $scope.achievementJson.achievement.comment + "</textarea><br>";
           }
              else if(achievementType == 'CustomerReferences'){
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" +$scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input id='achievementType' type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea id='lobName' class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input id='achievementDate' type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" + "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.splitEmployees( $scope.achievementJson.achievement.employees) + "</textarea>" + 
                   "<h3>Customer Name: </h3><input id='customerName' type='text' class='form-control' value='" + $scope.achievementJson.customerName + "'/>" + 
                   "<h3>Country: </h3><input type='text' id='country' class='form-control' value='" + $scope.achievementJson.country + "'/>" + 
                   "<h3>Brand: </h3><input type='text' id='brand' class='form-control' value='" + $scope.achievementJson.brand + "'/>" + 
                    "<h3>Link to Customer Reference: </h3><input id='customerReference' type='text' class='form-control' value='" + $scope.achievementJson.brand + "'/>" + 
                   "<h3>Business Unit: </h3><input type='text' id='businessUnit' class='form-control' value='" + $scope.achievementJson.busUnit + "'/>" + 
                   "<h3>Engagement Name: </h3><input type='text' id='engagementName' class='form-control' value='" + $scope.achievementJson.engagementName + "'/>" + 
                   "<h3>Comments: </h3><textarea id='comment' class='form-control'>" + $scope.achievementJson.achievement.comment + "</textarea><br>";
           }
           else if(achievementType == 'CustomerSave'){
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input id='achievementType' type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><input id='lobName' type='text' class='form-control' value='" +  $scope.achievementJson.achievement.lobName + "'/>" + 
                   "<h3>Date: </h3><input id='achievementDate' type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate  + "'/>" +"<h3>Shared with: </h3><textarea class='form-control'>" +  $scope.splitEmployees( $scope.achievementJson.achievement.employees)+ "</textarea>" + 
                   "<h3>Customer Name: </h3><input id='customerName' type='text' class='form-control' value='" + $scope.achievementJson.customerName + "'/>" + 
                   "<h3>Country: </h3><input type='text' id='country' class='form-control' value='" + $scope.achievementJson.country + "'/>" + 
                   "<h3>Brand: </h3><input type='text' id='brand' class='form-control' value='" + $scope.achievementJson.brand + "'/>" + 
                   "<h3>Business Unit: </h3><input type='text' id='businessUnit' class='form-control' value='" + $scope.achievementJson.businessUnits + "'/>" + 
                   "<h3>Employee Contribution: </h3><textarea id='employeeContribution' class='form-control'>" + $scope.achievementJson.employeeContribution + "</textarea>" + 
                   "<h3>Customer Problem: </h3><textarea id='customerProblem' class='form-control'>" + $scope.achievementJson.customerProblem + "</textarea>" + 
                   "<h3>Engagement Name: </h3><input id='engagementName' type='text' class='form-control' value='" + $scope.achievementJson.engagementName + "'/>" + 
                   "<h3>Comments: </h3><textarea id='comment' class='form-control'>" +$scope.achievementJson.achievement.comment  + "</textarea><br>";
           }
            else if(achievementType == 'FeedbackToDevelopment'){
                if($scope.achievementJson.typeOfFeedback == 'Defect'){
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input id='achievementType' type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea id='lobName' class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' id='achievementDate' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" + "<h3>Shared with: </h3><textarea class='form-control'>" +  $scope.splitEmployees( $scope.achievementJson.achievement.employees) + "</textarea>" + 
                   "<h3>Type of Feedback: </h3><input type='text' id='typeOfFeedback' class='form-control' value='" + $scope.achievementJson.typeOfFeedback + "'/>" + 
                    "<h3>PMR Number: </h3><input type='text' id='pmrNum' class='form-control' value='" + $scope.achievementJson.pmrNumber + "'/>" + 
                   "<h3>Business Unit: </h3><input type='text' id='businessUnit' class='form-control' value='" + $scope.achievementJson.businessUnits + "'/>" + 
                   "<h3>Product: </h3><input type='text' id='product' class='form-control' value='" + $scope.achievementJson.product + "'/>" + 
                   "<h3>Comments: </h3><textarea id='comment' class='form-control'>" + $scope.achievementJson.achievement.comment + "</textarea><br>";
                }else{
                     result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input id='achievementType' type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea id='lobName' class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' id='achievementDate' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +  "<h3>Shared with: </h3><textarea class='form-control'>" +  $scope.splitEmployees( $scope.achievementJson.achievement.employees) + "</textarea>" + 
                   "<h3>Type of Feedback: </h3><input type='text' id='typeOfFeedback' class='form-control' value='" + $scope.achievementJson.typeOfFeedback + "'/>" + 
                   "<h3>Business Unit: </h3><input type='text' id='businessUnit' class='form-control' value='" + $scope.achievementJson.businessUnits + "'/>" + 
                   "<h3>Product: </h3><input type='text' id='product' class='form-control' value='" + $scope.achievementJson.product + "'/>" + 
                   "<h3>Comments: </h3><textarea id='comment' class='form-control'>" +  $scope.achievementJson.achievement.comment + "</textarea><br>";
                }
           }
           
           else if(achievementType== 'HighImpactAsset'){
                if($scope.achievementJson.typeOfAsset == 'publication' || $scope.achievementJson.typeOfAsset == 'material'){
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName  +"'/>" + 
                   "<h3>Achievement Type: </h3><input id='achievementType' type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Brand: </h3><input id='brand' type='text' class='form-control' value='" + $scope.achievementJson.brand + "'/>" + 
                   "<h3>Description: </h3><input id='description' type='text' class='form-control' value='" + $scope.achievementJson.description + "'/>" + 
                   "<h3>High Impact Asset Name: </h3><input id='highImpactAssetName' type='text' class='form-control' value='" + $scope.achievementJson.highImpactAssetName + "'/>" + 
                   "<h3>Label: </h3><textarea id='lobName' class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' id='achievementDate' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" +  $scope.splitEmployees( $scope.achievementJson.achievement.employees) + "</textarea>" + 
                   "<h3>Type of Asset: </h3><input id='typeOfAsset' type='text' class='form-control' value='" + $scope.achievementJson.typeOfAsset + "'/>" + 
                   "<input type='text' id='typeOfAsset2' class='form-control' value='" + $scope.achievementJson.typeOfAsset2 + "'/>" + 
                   "<h3>Comments: </h3><textarea id='comment' class='form-control'>" + $scope.achievementJson.achievement.comment + "</textarea><br>";
                }
               else{
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input id='achievementType' type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Brand: </h3><input id='brand' type='text' class='form-control' value='" + $scope.achievementJson.brand + "'/>" + 
                   "<h3>Description: </h3><input id='description' type='text' class='form-control' value='" + $scope.achievementJson.description + "'/>" + 
                   "<h3>High Impact Asset Name: </h3><input id='highImpactAssetName' type='text' class='form-control' value='" + $scope.achievementJson.highImpactAssetName + "'/>" + 
                   "<h3>Label: </h3><textarea id='lobName' class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' id='achievementDate' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" +  $scope.splitEmployees( $scope.achievementJson.achievement.employees) + "</textarea>" + 
                   "<h3>Type of Asset: </h3><input id='typeOfAsset' type='text' class='form-control' value='" + $scope.achievementJson.typeOfAsset + "'/>" + 
                   "<h3>Comments: </h3><textarea id='comment' class='form-control'>" + $scope.achievementJson.achievement.comment + "</textarea><br>";
               }
               
           }
           else if(achievementType == 'MentorShip'){
        	   try{
               if($scope.achievementJson.mentorship.typeOfMentorship == 'Certification'){
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.mentorship.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input id='achievementType' type='text' class='form-control' value='" + $scope.achievementJson.mentorship.achievement.achievementType+ "'/>" + 
                   "<h3>Label: </h3><textarea id='lobName' class='form-control'>" + $scope.achievementJson.mentorship.achievement.lobName+ "</textarea>" + 
                   "<h3>Date: </h3><input type='date' id='achievementDate' class='form-control' value='" + $scope.achievementJson.mentorship.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" +  $scope.splitEmployees( $scope.achievementJson.mentorship.achievement.employees) + "</textarea>" + 
                   "<h3>Type of Mentorship: </h3><input id='typeMentorship' type='text' class='form-control' value='" + $scope.achievementJson.mentorship.typeOfMentorship + "'/>" + 
                   "<h3>Type of Certification: </h3><input type='text' id='typeCertification' class='form-control' value='" + $scope.achievementJson.typeOfCertification + "'/>" + 
                   "<h3>Description of Mentorship: </h3><input type='text' id='mentorShipDescription' class='form-control' value='" + $scope.achievementJson.mentorship.description + "'/>" + 
                   "<h3>Comments: </h3><textarea id='comment' class='form-control'>" + $scope.achievementJson.mentorship.achievement.comment  + "</textarea><br>";
           }
               else if($scope.achievementJson.mentorship.typeOfMentorship == 'Skill'){
                   result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.mentorship.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input id='achievementType' type='text' class='form-control' value='" + $scope.achievementJson.mentorship.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea id='lobName' class='form-control'>" + $scope.achievementJson.mentorship.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' id='achievementDate' class='form-control' value='" + $scope.achievementJson.mentorship.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" +  $scope.splitEmployees( $scope.achievementJson.mentorship.achievement.employees) + "</textarea>" + 
                   "<h3>Type of Mentorship: </h3><input type='text' id='typeMentorship' class='form-control' value='" + $scope.achievementJson.mentorship.typeOfMentorship + "'/>" + 
                   "<h3>Area: </h3><input type='text' id='area' class='form-control' value='" + $scope.achievementJson.area + "'/>" + 
                   "<h3>Description of Mentorship: </h3><input type='text' id='mentorShipDescription' class='form-control' value='" + $scope.achievementJson.mentorship.description + "'/>" + 
                   "<h3>Brand: </h3><input type='text' id='brand' class='form-control' value='" + $scope.achievementJson.brand + "'/>" + 
                   "<h3>Duration (in weeks): </h3><input type='text' id='duration' class='form-control' value='" + $scope.achievementJson.skillDuration + "'/>" + 
                   "<h3>Comments: </h3><textarea id='comment' class='form-control'>" + $scope.achievementJson.mentorship.achievement.comment  + "</textarea><br>";
               }
        	   }catch(err){
                   result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input id='achievementType' type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea id='lobName' class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Description of Mentorship: </h3><input type='text' id='mentorShipDescription' class='form-control' value='" + $scope.achievementJson.description + "'/>" + 
                   "<h3>Date: </h3><input type='date' id='achievementDate' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.splitEmployees( $scope.achievementJson.achievement.employees) + "</textarea>" + 
                   "<h3>Type of Mentorship: </h3><input type='text' id='typeMentorship' class='form-control' value='" + $scope.achievementJson.typeOfMentorship + "'/>" + 
                   "<h3>Comments: </h3><textarea id='comment' class='form-control'>" + $scope.achievementJson.achievement.comment  + "</textarea><br>";
               }
           }
           else if(achievementType == 'SuccessStories'){
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input id='achievementType' type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea id='lobName' class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' id='achievementDate' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" +  $scope.splitEmployees( $scope.achievementJson.achievement.employees) + "</textarea>" + 
                   "<h3>Customer Name: </h3><input type='text' id='customerName' class='form-control' value='" + $scope.achievementJson.customerName + "'/>" + 
                   "<h3>Engagement Name: </h3><input type='text' id='engagementName' class='form-control' value='" + $scope.achievementJson.engagementName + "'/>" + 
                   "<h3>Country: </h3><input type='text' id='country' class='form-control' value='" + $scope.achievementJson.country + "'/>" + 
                   "<h3>Business Unit: </h3><input type='text' id='businessUnit' class='form-control' value='" + $scope.achievementJson.busUnit + "'/>" +
                   "<h3>Link to Success Story: </h3><input type='text'  id='linkTo' class='form-control' value='" + $scope.achievementJson.successStoryLink + "'/>" + 
                   "<h3>Type: </h3><input type='text' id='type' class='form-control' value='" + $scope.achievementJson.type + "'/>" + 
                   "<h3>Comments: </h3><textarea id='comment' class='form-control'>" + $scope.achievementJson.achievement.comment  + "</textarea><br>";
           }
             else if(achievementType == 'Enablement'){
            	 try{
                 if($scope.achievementJson.enablement.typeOfEnablement== 'Customer'){
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.enablement.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input id='achievementType' type='text' class='form-control' value='" + $scope.achievementJson.enablement.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea id='lobName' class='form-control'>" + $scope.achievementJson.enablement.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' id='achievementDate' class='form-control' value='" + $scope.achievementJson.enablement.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" +  $scope.splitEmployees( $scope.achievementJson.enablement.achievement.employees) + "</textarea>" + 
                   "<h3>Type of Enablement: </h3><input id='typeOfEnablement' type='text' class='form-control' value='" + $scope.achievementJson.enablement.typeOfEnablement + "'/>" + 
                   "<h3>Title: </h3><input type='text' id='title' class='form-control' value='" + $scope.achievementJson.enablement.title + "'/>" + 
                   "<h3>Duration (in weeks): </h3><input id='duration' type='text' class='form-control' value='" + $scope.achievementJson.enablement.duration + "'/>" + 
                   "<h3>Number of Attendees: </h3><input type='text' id='numOfAtendees' class='form-control' value='" + $scope.achievementJson.enablement.numberOfAttendants + "'/>" +
                   "<h3>Business Unit: </h3><input type='text' id='businessUnit' class='form-control' value='" + $scope.achievementJson.enablement.busUnit + "'/>" + 
                   "<h3>Customer Name: </h3><input type='text' id='customerName' class='form-control' value='" + $scope.achievementJson.customerName + "'/>" + 
                   "<h3>Customer Type: </h3><input type='text' id='customerType' class='form-control' value='" + $scope.achievementJson.customerType + "'/>" + 
                   "<h3>Event: </h3><input type='text' id='event' class='form-control' value='" + $scope.achievementJson.enablement.event + "'/>" + 
                   "<h3>Comments: </h3><textarea id='comment' class='form-control'>" + $scope.achievementJson.enablement.achievement.comment  + "</textarea><br>";
           }
            	 }catch(err){
                 result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input id='achievementType' type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType+ "'/>" + 
                   "<h3>Label: </h3><textarea id='lobName' class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input id='achievementDate' type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                  
                   "<h3>Shared with: </h3><textarea id='sharedWith' class='form-control'>" + $scope.splitEmployees( $scope.achievementJson.achievement.employees)+ "</textarea>" + 
                   "<h3>Type of Enablement: </h3><input id='typeOfEnablement' id='typeOfEnablement' type='text' class='form-control' value='" + $scope.achievementJson.typeOfEnablement + "'/>" + 
                   "<h3>Title: </h3><input type='text' id='title' class='form-control' value='" + $scope.achievementJson.title + "'/>" + 
                   "<h3>Duration (in weeks): </h3><input id='duration' type='text' class='form-control' value='" + $scope.achievementJson.duration + "'/>" + 
                   "<h3>Number of Attendees: </h3><input type='text' id='numOfAtendees' class='form-control' value='" + $scope.achievementJson.numberOfAttendants + "'/>" +
                   "<h3>Business Unit: </h3><input type='text' id='businessUnit' class='form-control' value='" + $scope.achievementJson.busUnit + "'/>" + 
                   "<h3>Event: </h3><input type='text' id='event' class='form-control' value='" + $scope.achievementJson.event + "'/>" + 
                   "<h3>Comments: </h3><textarea id='comment' class='form-control'>" + $scope.achievementJson.achievement.comment  + "</textarea><br>";
                 }
             }
            else if(achievementType == 'CertificationsAndPrograms'){
            	try{
                if($scope.achievementJson.certificationsandprogram.typeOfCertification == 'Product'){
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.certificationsandprogram.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input id='achievementType' type='text' class='form-control' value='" + $scope.achievementJson.certificationsandprogram.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea id='lobName' class='form-control'>" + $scope.achievementJson.certificationsandprogram.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input id='achievementDate' type='date' class='form-control' value='" + $scope.achievementJson.certificationsandprogram.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" +  $scope.splitEmployees( $scope.achievementJson.certificationsandprogram.achievement.employees) + "</textarea>" + 
                   "<h3>Type of Certification: </h3><input id='typeOfCertification' type='text' class='form-control' value='" + $scope.achievementJson.certificationsandprogram.typeOfCertification + "'/>" + 
                   "<h3>Product Name: </h3><input id='productName' type='text' class='form-control' value='" + $scope.achievementJson.productName + "'/>" + 
                   "<h3>Business Unit: </h3><input id='businessUnit' type='text' class='form-control' value='" + $scope.achievementJson.busUnit + "'/>" + 
                   "<h3>Brand: </h3><input id='brand' type='text' class='form-control' value='" + $scope.achievementJson.brand + "'/>" + 
                   "<h3>Certification Exam: </h3><input id='certificationExam' type='text' class='form-control' value='" + $scope.achievementJson.certificationExam + "'/>" +
                   "<h3>Comments: </h3><textarea id='comment' class='form-control'>" + $scope.achievementJson.certificationsandprogram.achievement.comment  + "</textarea><br>";
           }
                
                else if($scope.achievementJson.certificationsandprogram.typeOfCertification == 'Professional'){
                    result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.certificationsandprogram.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input id='achievementType' type='text' class='form-control' value='" + $scope.achievementJson.certificationsandprogram.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea id='lobName' class='form-control'>" + $scope.achievementJson.certificationsandprogram.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input id='achievementDate' type='date' class='form-control' value='" + $scope.achievementJson.certificationsandprogram.achievement.achievementDate + "'/>" +                      "<h3>Shared with: </h3><textarea class='form-control'>" +   $scope.splitEmployees( $scope.achievementJson.certificationsandprogram.achievement.employees) + "</textarea>" + 
                   "<h3>Type of Certification: </h3><input id='typeOfCertification' type='text' class='form-control' value='" + $scope.achievementJson.certificationsandprogram.typeOfCertification + "'/>" + 
                   "<h3>Type: </h3><input id='professionalType' type='text' class='form-control' value='" + $scope.achievementJson.professionalType + "'/>" + 
                   "<h3>Level: </h3><input id='professionalLevel' type='text' class='form-control' value='" + $scope.achievementJson.professionalLevel + "'/>" + 
                   "<h3>Comments: </h3><textarea id='comment' class='form-control'>" + $scope.achievementJson.comment  + "</textarea><br>";
                }
            }	catch(e){
                      result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input id='achievementType' type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea id='lobName' class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input id='achievementDate' type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" +  $scope.splitEmployees( $scope.achievementJson.achievement.employees) + "</textarea>" + 
                   "<h3>Type of Certification: </h3><input id='typeOfCertification' type='text' class='form-control' value='" + $scope.achievementJson.typeOfCertification + "'/>" + 
                   "<h3>Comments: </h3><textarea id='comment' class='form-control'>" +$scope.achievementJson.achievement.comment  + "</textarea><br>";
               
                }
            }
           
            else if(achievementType == 'RevenueInfluence'){
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" +  $scope.achievementJson.achievement.employees[0].employeeName +"'/>" + 
                   "<h3>Achievement Type: </h3><input id='achievementType' type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea id='lobName' class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input id='achievementDate' type='date' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                     "<h3>Shared with: </h3><textarea class='form-control'>" + $scope.splitEmployees( $scope.achievementJson.achievement.employees) + "</textarea>" + 
                   "<h3>Type: </h3><input type='text' id='type' class='form-control' value='" + $scope.achievementJson.revenueInfelunceType + "'/>" + 
                   "<h3>Business Unit: </h3><input id='businessUnit' type='text' class='form-control' value='"  + $scope.achievementJson.businessUnits + "'/>" + 
                   "<h3>Amount: </h3><input type='text' id='amount' class='form-control' value='" + $scope.achievementJson.amount + "'/>" + 
                   "<h3>Brand: </h3><input type='text' id='brand' class='form-control' value='" + $scope.achievementJson.brand + "'/>" + 
                   "<h3>Description of Contribution: </h3><input id='description' type='text' class='form-control' value='" + $scope.achievementJson.descriptionOfContribution + "'/>" +
                   "<h3>Contribution Type: </h3><input type='text' id='contributionType' class='form-control' value='" + $scope.achievementJson.contributionType + "'/>" + 
                   "<h3>Customer Name: </h3><input type='text' id='customerName' class='form-control' value='" + $scope.achievementJson.customerName + "'/>" + 
                   "<h3>Country: </h3><input type='text' id='country' class='form-control' value='" + $scope.achievementJson.country + "'/>" + 
                   "<h3>Engagement Name: </h3><input type='text' id='engagementName' class='form-control' value='" + $scope.achievementJson.engagementName + "'/>" + 
                   "<h3>Comments: </h3><textarea id='comment' class='form-control'>" +$scope.achievementJson.achievement.comment + "</textarea><br>";
           }
           else if(achievementType == 'SpeakingOrganizingEvent'){
               if($scope.achievementJson.role == 'Speaker'){
               result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName  +"'/>" + 
                   "<h3>Achievement Type: </h3><input id='achievementType' type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea id='lobName' class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' id='achievementDate' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                   
                   "<h3>Shared with: </h3><textarea id='sharedWith' class='form-control'>" + $scope.splitEmployees( $scope.achievementJson.achievement.employees) + "</textarea>" + 
                   "<h3>Title of Event: </h3><input id='title' type='text' class='form-control' value='" + $scope.achievementJson.titleOfEvent + "'/>" + 
                   "<h3>Role: </h3><input type='text' id='role' class='form-control' value='" + $scope.achievementJson.role + "'/>" + 
                   "<h3>Country: </h3><input type='text' id='country' class='form-control' value='" + $scope.achievementJson.country + "'/>" +
                   "<h3>Business Unit: </h3><input type='text' id='businessUnit' class='form-control' value='" + $scope.achievementJson.businessUnits + "'/>" +
                   "<h3>Title of Conference: </h3><input id='titleOfConference' type='text' class='form-control' value='" + $scope.achievementJson.titleOfConference + "'/>" + 
                   "<h3>Session: </h3><input type='text' id='session' class='form-control' value='" + $scope.achievementJson.session + "'/>" + 
                   "<h3>Internal or External: </h3><input type='text' id='iOrE' class='form-control' value='" + $scope.achievementJson.sessionType + "'/>" + 
                   "<h3>Type of Event: </h3><input type='text' id='typeOfEvent' class='form-control' value='" + $scope.achievementJson.typeOfEvent + "'/>" + 
                   "<h3>Comments: </h3><textarea id='comment' class='form-control'>" +$scope.achievementJson.achievement.comment + "</textarea><br>";
           }
               else{ 
                   result.innerHTML = 
               "<form>"+
                   "<h3>Employee Name: </h3><input type='text' class='form-control' disabled value='" + $scope.achievementJson.achievement.employees[0].employeeName  +"'/>" + 
                   "<h3>Achievement Type: </h3><input  id='achievementType' type='text' class='form-control' value='" + $scope.achievementJson.achievement.achievementType + "'/>" + 
                   "<h3>Label: </h3><textarea id='lobName' class='form-control'>" + $scope.achievementJson.achievement.lobName + "</textarea>" + 
                   "<h3>Date: </h3><input type='date' id='achievementDate' class='form-control' value='" + $scope.achievementJson.achievement.achievementDate + "'/>" +                    
                   "<h3>Shared with: </h3><textarea id='sharedWith' class='form-control'>" +$scope.splitEmployees( $scope.achievementJson.achievement.employees) + "</textarea>" + 
                   "<h3>Title of Event: </h3><input type='text' id='title' class='form-control' value='" + $scope.achievementJson.titleOfEvent + "'/>" + 
                   "<h3>Role: </h3><input type='text' id='role' class='form-control' value='" + $scope.achievementJson.role + "'/>" +
                   "<h3>Role of Organizer: </h3><input type='text' id='roleOfOrganizer' class='form-control' value='" + $scope.achievementJson.roleOfOrganizer + "'/>" + 
                   "<h3>Country: </h3><input type='text' id='country' class='form-control' value='" + $scope.achievementJson.country + "'/>" + 
                   "<h3>Business Unit: </h3><input type='text' id='businessUnit' class='form-control' value='" + $scope.achievementJson.businessUnits + "'/>" +
                   "<h3>Title of Conference: </h3><input type='text' id='titleOfConference' class='form-control' value='" + $scope.achievementJson.titleOfConference + "'/>" + 
                   "<h3>Session: </h3><input type='text' id='session' class='form-control' value='" + $scope.achievementJson.session + "'/>" + 
                   "<h3>Internal or External: </h3><input type='text' id='iOrE' class='form-control' value='" + $scope.achievementJson.sessionType + "'/>" + 
                   "<h3>Type of Event: </h3><input type='text' id='typeOfEvent' class='form-control' value='" + $scope.achievementJson.typeOfEvent + "'/>" + 
                   "<h3>Comments: </h3><textarea id='comment' class='form-control'>" +$scope.achievementJson.achievement.comment + "</textarea><br>";
               }
           }
           else{
           result.innerHTML = '';
          }
		  
		   if(isManager){
			   angular.element(result).append($compile("<input type='submit'  ng-click='updateAchievement(\"Approved\")' class='btn btn-success' style='margin-bottom: 30px; width:250px; margin-right:20px;' value='Submit Changes & Accept'/> <input ng-click='updateAchievement(\"Rejected\")' type='submit' class='btn btn-danger' style='margin-bottom: 30px; width:250px;margin-right:20px;' value='Reject'/>")($scope)) ;
			   angular.element(result).append($compile("<input type='submit'  ng-click='updateAchievement(\"Returned\")' class='btn btn-primary' style='margin-bottom: 30px; width:250px;' value='Returned'/> </form>")($scope)) ;
		   }else{
			   angular.element(result).append($compile('<a ng-click="updateAchievement(\'Pending\')" class="btn btn-primary" style="margin-bottom: 30px;" value="Submit">Submit </a>')($scope));
		   }
		   
	   });
    };
    

       
    $scope.updateAchievement = function(status){
    	alert(status) ;
    	var json = {} ; 
    	var type= document.getElementById("achievementType").value;
    	json["lobName"] = document.getElementById("lobName").value ;
    	json["comment"]  = document.getElementById("comment").value ;
    	json["date"] = document.getElementById("achievementDate").value  ; 
    	json["employeeId"] = Shared.get("employeeId");
    	json["busUnits"] = document.getElementById("busUnits").value ; 
    	json["achievementId"] = $scope.achievementId ; 
    	json["status"] = status  ;
    	if(type =="BoardReviews"){
			 json["type"] = "BoardReviews" ;
			 json["typeOfCertificate"] = document.getElementById("typeOfCertification").value;
			 json["flag"] = document.getElementById("flag").value;
			 json["reviewType"] = document.getElementById("reviewType").value;
			 json["boardReviewLevel"] = document.getElementById("level").value;
    	}else if (type=='Disclosure'){
    		json["title"] = document.getElementById("achievementTitle").value ; 
    		json["number"]  = document.getElementById("achievementNum").value ;  
            json["type"] = "Disclosure" ; 
    	}else if(type=="CustomerReferences"){
    		json["type"] = "CustomerReferences" ;
    		json["customerName"]=document.getElementById("customerName").value;
    		json["country"]=document.getElementById("country").value;
    		json["engagementName"]=document.getElementById("engagementName").value;
    	}else if(type=='CustomerSave'){
    		json["type"] = "CustomerSave" ;
    		json['customerName'] = document.getElementById("customerName").value;
    		json['country'] = document.getElementById("country").value;
    		json['employeeContribution'] = document.getElementById("employeeContribution").value;
    		json['customerProblem'] = document.getElementById("customerProblem").value;
    		json['engagementName'] = document.getElementById("engagementName").value;
    	}else if(type=='SuccessStories'){
    		json["type"] = "SuccessStories" ; 
    		json["customerName"]=document.getElementById("customerName").value;
    		json["engagementName"]=document.getElementById("engagementName").value;
    		json["country"]=document.getElementById("country").value;
    		json["successStoryLink"]=document.getElementById("linkTo").value;
    		json["successStoriesType"]=document.getElementById("type").value;
    		
    	}else if(type=='RevenueInfluence'){
    		json["type"] = "RevenueInfluence" ;
   		json["revenueInfelunceType"] = document.getElementById("type").value ;
   		json["amount"] = document.getElementById("amount").value;
   		json["descriptionOfContribution"] = document.getElementById("description").value;
   		json["contributionType"] = document.getElementById("contributionType").value;
   		json["customerName"] = document.getElementById("customerName").value;
   		json["country"] = document.getElementById("country").value;
   		json["engagementName"] = document.getElementById("engagementName").value;
   	}
    	else if(type=='MentorShip'){
		json['description'] =  document.getElementById("mentorShipDescription").value ;
		json['type'] = "MentorShip" ;
		try{
			if($scope.achievementJson.mentorship.typeOfMentorship=='Skill'){
				   json['typeOfMentorship'] =  "Skill";
				   json['area'] = document.getElementById("area").value ;
				   json['duration'] = document.getElementById("duration").value ;
			   }else if($scope.achievementJson.mentorship.typeOfMentorship=='Certification'){
				   json['typeOfMentorship'] = "Certification";
				   json['typeOfCertification'] = document.getElementById("typeCertification").value ;
			   }
		}catch(err){
			 if($scope.achievementJson.typeOfMentorship=='Career'){
				   json['typeOfMentorship'] =  "Career";
			   }else if($scope.achievementJson.typeOfMentorship=='SummerInternship'){
				   json['typeOfMentorship'] =  "SummerInternship";
			   }
		}
	}
    	else if(type=='HighImpactAsset'){
    		json["type"] = "HighImpactAsset" ; 
    		json['typeOfAsset'] =document.getElementById("typeOfAsset").value ;
    		json["highImpactAssetName"] =document.getElementById("highImpactAssetName").value ;
    		json["description"] =document.getElementById("description").value ;
    		if(document.getElementById("typeOfAsset").value=='publication'){
    			json["typeOfAsset2"] =document.getElementById("typeOfAsset2").value ; 
    		}else if(document.getElementById("typeOfAsset").value=='material'){
    			json["typeOfAsset2"] = document.getElementById("typeOfAsset2").value ;
    		}else{
    			json["typeOfAsset2"] = "null"
    		}
    	}
    	
    	else if(type=='Enablement'){
    		json["type"] = "Enablement" ;
    		json["typeOfEnablement"] = document.getElementById("typeOfEnablement").value ;
    		json["title"] = document.getElementById("title").value;
    		json["duration"] = document.getElementById("duration").value;
    		json["numberOfAttendants"] = document.getElementById("numOfAtendees").value;
    		json["event"] = document.getElementById("event").value;
    		if( document.getElementById("typeOfEnablement").value=="Customer"){
    			json["customerName"] =  document.getElementById("customerName").value;
    			json["customerType"] =  document.getElementById("customerType").value;
    		}
    	}else if(type=='SpeakingOrganizingEvent'){
    		json["type"] = "SpeakingOrganizingEvent" ; 
    		json["titleOfEvent"] =document.getElementById("title").value; 
    		json["role"] =  document.getElementById("role").value ;
    		if(document.getElementById("role").value=="Speaker") json["roleOfOrganizer"] =  document.getElementById("roleOfOrganizer").value ;
    		else json["roleOfOrganizer"] = "" ;  
    		json["country"] =document.getElementById("country").value;
    		json["titleOfConference"] =document.getElementById("titleOfConference").value;
    		json["session"] =document.getElementById("session").value;
    		json["sessionType"] = document.getElementById("iOrE").value ;
    		json["typeOfEvent"] = document.getElementById("typeOfEvent").value;
    		
    		
    	}else if(type=="CertificationsAndPrograms"){
    		json["type"] = "CertificationsAndPrograms" ;
    		json["typeOfCertification"] = document.getElementById("typeOfCertification").value ;
    		if(document.getElementById("typeOfCertification").value=="Product"){
    			json["proudctName"] = document.getElementById("productName").value;
    			json["certificatioExam"] = document.getElementById("certificationExam").value;
    		}else if(document.getElementById("typeOfCertification").value=="Professional"){
    			 json["level"] = document.getElementById("professionalLevel").value;
    			 json["professionalType"] = document.getElementById("professionalType").value;
    		}
    	}else if(type=="FeedbackToDevelopment"){
    		json["type"] = "FeedbackToDevelopment";
    		json["typeOfFeedback"]=document.getElementById("typeOfFeedback").value;

    		json["product"]=document.getElementById("product").value;
    		if(document.getElementById("typeOfFeedback").value=="Defect"){
    			json["pmrNumber"]=document.getElementById("pmrNum").value;
    		}else{
    			json["pmrNumber"]="0";
    		}
    	}
    	alert(JSON.stringify(json));
    	document.getElementById("resultDiv").innerHTML= '' ;
    	
    	$http({
		      method:'POST',
		      url:'http://localhost:9080/Achievements-App/Services/AchievementManipulation/EditAchievement', 
		      params:{achievementJson:JSON.stringify(json)},
		      headers:{
		          'Content-type':'application/json'
   }});
    	
    };
    
   
    $scope.addAchievement = function(isManager){
    	var json = {} ; 
    	var len = document.getElementsByName("employeeList[]").length ; 
    	var employeeList =  document.getElementsByName("employeeList[]") ;
    	var employees=[] ; 
    	for(var i=0 ; i<len ; i++){
    		if(employeeList[i].checked) employees.push(employeeList[i].value)  ;
    	}    
    	json["busUnits"] = document.getElementById("busUnits").value ; 
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
    	   
    	}else if($scope.myDropDown=="BoardReviews"){
			
			json["type"] = "BoardReviews" ;
			 json["typeOfCertificate"] = $scope.BoardReviewsCertificationMenu;
			 json["flag"] = document.getElementById("BoardReviewsFlag").value;
			 json["reviewType"] = $scope.BoardReviewsTypeMenu;
			 json["boardReviewLevel"] = $scope.BoardReviewsLevelMenu;
			 alert(JSON.stringify(json));
      	
    	}else if($scope.myDropDown=="CertificationsAndPrograms"){
    		json["type"] = "CertificationsAndPrograms" ;
    		json["TypeOfCertification"] = $scope.CertificationProgramType ;
    		if($scope.CertificationProgramType=="Product"){
    			json["proudctName"] = document.getElementById("CertificationProgramProductName").value;
    			json["certificatioExam"] = document.getElementById("CertificationProgramCertificationExam").value;
    		}else if($scope.CertificationProgramType=="Professional"){
    			 json["level"] = $scope.CertificationProgramProfessionalLevel;
    			 json["professionalType"] = $scope.CertificationProgramProfessionalType;
    		}
    		
    	}else if ($scope.myDropDown=='Disclosure'){
    		json["title"] = document.getElementById("disclosureTitle").value ; 
    		json["number"]  = document.getElementById("disclosureNumber").value ;  
            json["type"] = "Disclosure" ; 
    	}else if($scope.myDropDown=='SuccessStories'){
    		json["type"] = "SuccessStories" ; 
    		json["customerName"]=document.getElementById("successStoriesCustomerName").value;
    		json["engagementName"]=document.getElementById("successStoriesEngagementName").value;
    		json["country"]=document.getElementById("successStoriesCountry").value;
    		json["successStoryLink"]=document.getElementById("successStoriesLinkToSuccessStory").value;
    		json["successStoriesType"]=document.getElementById("successStoriesType").value;
    	}else if($scope.myDropDown=='Enablement'){
    		json["type"] = "Enablement" ;
    		json["typeOfEnablement"] = $scope.EnablementType ;
    		json["title"] = document.getElementById("enablementTitle").value;
    		json["duration"] = document.getElementById("enablementDuration").value;
    		json["numberOfAttendants"] = document.getElementById("enablementNumberOfAttendees").value;
    		json["event"] = document.getElementById("EnablementEvent").value;
    		if($scope.EnablementType=="Customer"){
    			json["customerName"] =  document.getElementById("EnablementCustomerName").value;
    			json["customerType"] =  $scope.CustomerType;
    		}
    	}else if($scope.myDropDown=="CustomerReferences"){
    		json["type"] = "CustomerReferences" ;
    		json["customerName"]=document.getElementById("customerReferenceCustomerName").value;
    		json["country"]=document.getElementById("customerReferenceCountry").value;
    		json["brand"]=document.getElementById("customerReferenceBarnd").value;
    		json["engagmentName"]=document.getElementById("customerReferenceEngagementName").value;
    	}else if($scope.myDropDown=='CustomerSave'){
    		json["type"] = "CustomerSave" ;
    		json['customerName'] = document.getElementById("customerSavesCustomerName").value;
    		json['country'] = document.getElementById("customerSavesCountry").value;
    		json['employeeContribution'] = document.getElementById("customerSavesEmployeeContribution").value;
    		json['customerProblem'] = document.getElementById("customerSavesCustomerProblem").value;
    		json['engagementName'] = document.getElementById("customerSavesEngagmentName").value;
    	}else if($scope.myDropDown=='RevenueInfluence'){
    		json["type"] = "RevenueInfluence" ;
    		 var radioType = document.getElementsByName("revenueInfelunceType") ;
    		json["revenueInfelunceType"] = radioType[0].checked ? radioType[0].value:(radioType[1].checked?radioType[1].value:radioType[2].value) ;
    		json["amount"] = document.getElementById("revenueInfluenceAmount").value;
    		json["descriptionOfContribution"] = document.getElementById("revenueInfluenceAmountDescriptionOfContribution").value;
    		json["contributionType"] = $scope.ContributionType;
    		json["customerName"] = document.getElementById("revenueInfluenceCustomerName").value;
    		json["country"] = document.getElementById("revenueInfluenceCountry").value;
    		json["engagementName"] = document.getElementById("revenueInfluenceEngagementName").value;
    	}else if($scope.myDropDown=='SpeakingOrganizingEvent'){
    		json["type"] = "SpeakingOrganizingEvent" ; 
    		json["titleOfEvent"] =document.getElementById("SpeakingOrganizingTitleOfEvent").value; 
    		var radioType = document.getElementsByName("SpeakingOrganizingType") ;
    		json["role"] = radioType[0].checked ? radioType[0].value:(radioType[1].checked?radioType[1].value:radioType[2].value) ;
    		json["roleOfOrganizer"] =  document.getElementById("SpeakingOrganizingRoleOfOrganizer").value; 
    		json["country"] =document.getElementById("SpeakingOrganizingCountry").value;
    		json["titleOfConference"] =document.getElementById("SpeakingOrganizingTitleofConference").value;
    		json["session"] =document.getElementById("SpeakingOrganizingSession").value;
    		var sessionType = document.getElementsByName("SpeakingOrganizingIBM") ;
    		json["sessionType"] = sessionType[0].checked ? sessionType[0].value: sessionType[1].value;
    		json["typeOfEvent"] = document.getElementById("SpeakingOrganizingTypeOfEvent").value;
    		
    	}else if($scope.myDropDown=='HighImpactAsset'){
    		json["type"] = "HighImpactAsset" ; 
    		json['typeOfAsset'] = $scope.assetDropDown ;
    		json["highImpactAssetName"] =document.getElementById("highImpactAssetName").value ;
    		json["description"] =document.getElementById("highImpactAssetDescription").value ;
    		if($scope.assetDropDown=='publication'){
    			json["typeOfAsset2"] = $scope.publicationDropDown ; 
    		}else if($scope.assetDropDown=='material'){
    			json["typeOfAsset2"] = $scope.materialDropDown ;
    		}else{
    			json["typeOfAsset2"] = "null"
    		}
    		
    	}else if($scope.myDropDown=='FeedbackToDevelopment'){
    		json["type"] = "FeedbackToDevelopment";
    		json["typeOfFeedback"] = $scope.feedbackMenu ; 
    		json["product"] = document.getElementById("feedBackProuduct").value ;
    		var pmrBuffer = document.getElementById("feedBackPMR").value ; 
    		json["pmrNumber"] = (pmrBuffer==""||pmrBuffer==null)? "0" : pmrBuffer ;
    		
    	}   		
    	 $http({
 		      method:'POST',
 		      url:'http://localhost:9080/Achievements-App/Services/AchievementManipulation/AddAchievement', 
 		      params:{achievementJson:JSON.stringify(json)},
 		      headers:{
 		          'Content-type':'application/json'
     }});
    	 
    	 myRequests.getAchievementsByEmployeeId(Shared.get("employeeId")).success(function(request){ 
    	        $scope.myReqData = request;
    	        if(isManager) $location.path("/managerMyRequests") ;
    	        else $location.path("/employeeMyRequests") ; 
    	         });
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






