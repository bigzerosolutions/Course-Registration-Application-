(function () {
    'use strict';

    angular
        .module('app')
        .controller('FeeInstallController', FeeInstallController);

    FeeInstallController.$inject = ['$rootScope','$http', '$scope'];
    function FeeInstallController($rootScope, $http, $scope) 
    {
       	var vm = this;
       	$http.post('/api/feeInstall', {})
        .success(function (response) 
        {
            var values = response.value;
            var aFees = $rootScope;

            $scope.details = [{StudentId:"",CourseId:"",InstallmentPaid:"",JoiningDate:"",ModeOfPayment:"",JoiningDate:""}];
            aFees.arr = 'test';
            var i;
            var balance;
            for(i=0;i<values.length;i++)
            {
                balance = values[i].Fees - values[i].InstallmentPaid;
                var joindate = new Date(values[i].JoiningDate);
                
                var newM = joindate.getMonth()-1;
                var newD = joindate.getDate();
                var newY = joindate.getFullYear()+values[i].Duration;
                var newdate = new Date(newY,newM,newD); 
                
                newdate=new Date(newdate).toUTCString();
                newdate=newdate.split(' ').slice(1, 4).join(' ');

                var todayDate = new Date();
                todayDate=new Date(todayDate).toUTCString();
                todayDate=todayDate.split(' ').slice(1, 4).join(' ');
                if (newdate==todayDate) 
                {
                    console.log(values[i].EmailAddress);
                    $http.post('/api/send', {to:values[i].EmailAddress, subject:'Course Fee payment pending', text:'Please pay your Fee Pending'})
                    .success(function (response) 
                    {
                    console.log("email sent");
                    });
                }
               $scope.details.push({StudentId:values[i].StudentId,CourseId:values[i].CourseId,InstallmentPaid:values[i].InstallmentPaid,JoiningDate:values[i].JoiningDate,ModeOfPayment:values[i].ModeOfPayment,CourseFee:balance});
            }
        }).
        error(function(response)
        {
            console.log("not found");
        });
    }
    function sendEmail($http)
    {
        $http.post('/api/send', {to:'vishmealone@gmail.com ', subject:'Course Fee payment pending', text:'Please pay your Fee Pending'})
        .success(function (response) 
        {
            console.log("email sent");
        });
    }


})();