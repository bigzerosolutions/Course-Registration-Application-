(function () {
    'use strict';
    angular
        .module('app')
        .controller('EnrollStudentController', EnrollStudentController);

    EnrollStudentController.$inject = ['$rootScope','$http', '$scope'];

    function EnrollStudentController($rootScope, $http, $scope) 
    {
        var vm = this;
        loadCourse();
        
        vm.submit = function()
        {
            var fullName = vm.firstName+' '+vm.secondName;
            var courseId = vm.courseSelect.value;
            var id;
            console.log(vm.courseSelect.label);
            
            /*To check avilability of a course*/

            $http.post('/api/checkAvailability', {CourseId:courseId})
            .success(function (response) 
            {
                console.log("course availability Checked");
                var current = response.value[0].count;
                var max = response.value[1].count;
                
                if (current<max) 
                {
                    
                    /*To add to student table*/
                    $http.post('/api/enrollStudent', {FullName:fullName,Address:vm.studentAddress,EmailAddress:vm.studentEmail,ContactNo:vm.studentContact})
                    .success(function (response) 
                    {
                        console.log("student detail added successfully");               
                    }).
                    error(function(response)
                    {
                        console.log("Couldn't insert Student details to database");
                    });
                    
                    /*To retrieve studentId*/
                    
                    $http.post('/api/getStudentId', {})
                    .success(function (response) 
                    {
                        id = response.value[0].AUTO_INCREMENT;
                        id=id-1;
                        /*To add to register table*/
                    
                        $http.post('/api/enterRegister', {StudentId:id,CourseId:courseId,ModeOfPayment:vm.paymentType,InstallmentPaid:vm.installmentPaid,JoiningDate:vm.joinDate})
                        .success(function (response) 
                        {
                            console.log("register detail added successfully");
                            alert("Student Details Added!")
                        }).
                        error(function(response)
                        {
                            console.log("Couldn't insert Student register details to database");
                        });

                    }).
                    error(function(response)
                    {
                        console.log("Couldn't insert Student register details to database");

                    });
                }
                else{
                    alert ("sorry seats are empty")
                }
            }).
            error(function(response)
            {
                console.log("Couldn't count course count");
            });
           
            
        }
        vm.clear= function()
        {
            vm.firstName="";

            vm.secondName="";

            vm.studentAddress="";

            vm.studentEmail="";

            vm.studentContact="";

            vm.courseSelect="";

            vm.paymentType="";

            vm.installmentPaid="";

            vm.joinDate="";

        }
        function loadCourse() 
        {
            $http.post('/api/getCourse', {})
            .success(function (response) 
            {
                $scope.options = [{label:"",value:""}];
                var values = response.value;
                var i;
                for(i=0;i<values.length;i++)
                {
                    $scope.options.push({label:values[i].CourseName,value:values[i].CourseId});
                   /* console.log(values[i].CourseName);
                */}
            }).
            error(function(response)
            {
                console.log("Couldn't insert Student details to database");
            });
        }
    }
})();
