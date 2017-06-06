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
        var settingRef = firebase.database().ref('setting/' + $rootScope.userId);
        settingRef.on('value', function (snap) {
            $timeout(function () {
                $scope.setting = snap.val()
                console.log($scope.setting)

            })
        })
        var userRef = firebase.database().ref('user/' + $rootScope.userId);
        userRef.on('value', function (snap) {
            $scope.userData = snap.val()
        })
    }

    $scope.submit = function (noti) {
        var settingRef = firebase.database().ref('setting/' + $rootScope.userId);
        settingRef.update(noti).then(function () {
            toastr.success('Cập nhật thành công')

        }, function (error) {
            toastr.error(error)

        })


    }




})

