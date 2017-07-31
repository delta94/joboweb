'use strict';
app.controller("settingCtrl", function ($scope, $rootScope, $http, $state, toastr,$timeout) {
    $scope.init = function () {
        $rootScope.aside = false
        if($rootScope.userId){
            init()
        }
        $scope.$on('handleBroadcast', function (event, message) {
            init()
        })
    };
    function init() {
        $rootScope.service.JoboApi('on/setting',{
            userId: $rootScope.userId
        }).then(function (data) {
            $timeout(function () {
                $scope.setting = data.data;
                console.log($scope.setting)
            })
        });

        $rootScope.service.JoboApi('on/user',{
            userId: $rootScope.userId
        }). then(function (data) {
            $scope.userData = data.data;
        });

    }

    $scope.submit = function (noti) {
        $rootScope.service.JoboApi('update/setting',{
            userId: $rootScope.userId,
            setting: noti
        }).then(function () {
            toastr.success('Cập nhật thành công')
        },function (error) {
            toastr.error(error)
        });



    }




})

