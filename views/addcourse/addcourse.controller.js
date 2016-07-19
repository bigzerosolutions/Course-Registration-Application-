(function () {
    'use strict';
    angular
        .module('app')
        .controller('AddCourseController', AddCourseController);

    AddCourseController.$inject = ['$rootScope', '$http'];
    
    function AddCourseController($rootScope, $http) 
    {
        var vm = this;
        vm.submit = function()
        {
            console.log("heasdkal");
                
            $http.post('/api/addcourse', { CourseName: vm.courseName, Duration: vm.courseDuration, BatchSize: vm.courseBatchSize, FacultyName: vm.courseFaculty, NoOfInstallmentsAllowed: vm.courseInstallation, fees:vm.courseFee})
            .success(function (response) 
            {
	            console.log("Course details successfully inserted");
                clearAll();
            }).
            error(function(response)
            {
                console.log("Couldn't insert course details to Course database");
            });
        }
        vm.clear= function()
        {
            vm.courseName="";

            vm.courseDuration="";

            vm.courseInstallation="";

            vm.courseFee="";

            vm.courseBatchSize="";

            vm.courseFaculty="";

           

        }
    }
    function clearAll()
    {
        var vm = this;
        vm.courseName = "";
        vm.courseDuration = "";
        vm.courseInstallation = "";

    }
})();