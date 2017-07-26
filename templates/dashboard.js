"use strict"

angular.module('app').controller('dashboardCtrl', dashboardCtrl);

function dashboardCtrl($scope, $timeout, $sce, toastr, $state, CONFIG, $http, $rootScope) {
    $scope.loading = true
    $rootScope.aside = false


    if (!$rootScope.UserCard && !$rootScope.StoreCard) {
        $http({
            method: 'GET',
            url: CONFIG.APIURL + '/api/dashboard'
        }).then(function successCallback(response) {
            console.log("respond", response);
            $timeout(function () {
                $rootScope.UserCard = response.data.jobseeker;
                $rootScope.StoreCard = response.data.employer
            })
        }, function (error) {
            console.log(error)
        })
        $http({
            method: 'GET',
            url: CONFIG.APIURL + '/api/job?show=hot'
        }).then(function successCallback(response) {
            console.log("respond", response);
            $timeout(function () {
                $rootScope.JobCard = response.data.data;
            })
        }, function (error) {
            console.log(error)
        })
    }
    $scope.showVideo = function (user) {
        $rootScope.service.Ana('show_video', {watched: user.userId})
        $scope.showVid = user.userId
        $scope.videoTrusted = $sce.trustAsResourceUrl(user.videourl)
    }


    $scope.sortFilter = function (param) {
        $rootScope.newfilter = {
            show: param
        }
        $rootScope.JobCard = {}
        $scope.getUserFiltered($rootScope.newfilter)

    }
    $scope.newfilterFilter = function () {
        toastr.info('Bạn phải đăng nhập để thực hiện tác vụ này!');
        $state.go('intro')

    };
    $scope.changefilter = function () {
        $rootScope.service.Ana('createProfile', {where: 'haytaohoso'})

        console.log('click');
        toastr.info('Hãy đăng ký tài khoản và bắt đầu tạo hồ sơ!');
        $state.go('signup', {id: 2})

    }
    $scope.change = function () {
        console.log('click')
        toastr.info('Bạn phải đăng nhập để thực hiện tác vụ này!');
        $state.go('signup', {id: 1})

    }


    $(window).load(function () {
        $('.post-module').hover(function () {
            $(this).find('.description').stop().animate({
                height: "toggle",
                opacity: "toggle"
            }, 300);
        });
    });
}
