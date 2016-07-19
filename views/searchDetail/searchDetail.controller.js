(function () {
    'use strict';

    angular
        .module('app')
        .controller('searchDetailsController', searchDetailsController);

    searchDetailsController.$inject = ['$rootScope','$http', '$scope'];
    function searchDetailsController($rootScope, $http, $scope) 
    {
        var vm = this;
        vm.submit =function()
        {      
            $http.post('/api/searchDetail', {keyword: vm.keyword})
            .success(function (response) 
            {
                var values = response.value[0];
                console.log(values);
                $scope.details = [{StudentId:"",FullName:"",Address:"",EmailAddress:"",ContactNo:"",CourseId:"",InstallmentPaid:"",JoiningDate:"",ModeOfPayment:""}];
                
                $scope.details.push({StudentId:values.StudentId,FullName:values.FullName,Address:values.Address,EmailAddress:values.EmailAddress,ContactNo:values.ContactNo,CourseId:values.CourseId,InstallmentPaid:values.InstallmentPaid,JoiningDate:values.JoiningDate,ModeOfPayment:values.ModeOfPayment});
                
            }).
            error(function(response)
            {
                console.log("not found");
            });
        }
    }

})();