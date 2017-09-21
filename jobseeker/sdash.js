"use strict";

app.controller('sDashCtrl', function ($scope, $state, $http, $stateParams
    , CONFIG
    , AuthUser
    , $window
    , $log
    , $rootScope
    , toastr
    , $timeout
    , ModalService) {




    if ($rootScope.newNoti && $rootScope.Lang) {
        $rootScope.og = {
            title: '(' + $rootScope.newNoti + ') Jobo'
        }
    } else if ($rootScope.newfilter && $rootScope.newfilter.job && $rootScope.Lang) {
        $rootScope.og = {
            title: 'Jobo - Việc làm ' + $rootScope.Lang[$rootScope.newfilter.job]
        }
    } else {
        $rootScope.og = {
            title: 'Jobo - Việc làm lương tốt'
        }
    }

    $scope.getUserFiltered = function (newfilter) {
        console.log('filtering..', newfilter)
        $scope.loading = true;
        $http({
            method: 'GET',
            url: CONFIG.APIURL + '/api/job',
            params: newfilter
        }).then(function successCallback(response) {
            console.log("respond", response);

            $scope.total = response.data.total;

            $timeout(function () {
                if (!$rootScope.jobCard) {
                    $rootScope.jobCard = []
                }
                for (var i in response.data.data) {


                    var jobData = response.data.data[i]

                    if (jobData.act) {
                        var ref = 'activity/like/' + jobData.actId
                        db.ref(ref).on('value', function (snap) {
                            response.data.data[i].act = snap.val()
                        })
                    }
                }
                $rootScope.jobCard = $rootScope.jobCard.concat(response.data.data);
                console.log($rootScope.jobCard)
                $scope.loading = false
            })
        }, function (error) {
            console.log(error)

            $scope.loading = false

        })

        $http({
            method: 'GET',
            url: CONFIG.APIURL + '/api/jobOther',
            params: newfilter
        }).then(function successCallback(response) {
            console.log("respond", response);
            $scope.totalGG = response.data.total
            if (response.data && response.data.data) {
                $timeout(function () {
                    if (!$rootScope.jobCardGoogle) {
                        $rootScope.jobCardGoogle = []
                    }
                    $rootScope.jobCardGoogle = $rootScope.jobCardGoogle.concat(response.data.data);
                    console.log($rootScope.jobCard)
                    $scope.loading = false
                })
            }

        }, function (error) {
            console.log(error)

            $scope.loading = false

        })


    };




    $scope.autocompleteAddress = {text: ''};
    $scope.ketquasAddress = [];
    $scope.searchAddress = function () {
        $scope.URL = 'https://maps.google.com/maps/api/geocode/json?address=' + $scope.autocompleteAddress.text + '&sensor=true&key=' + CONFIG.APIKey;
        $http({
            method: 'GET',
            url: $scope.URL
        }).then(function successCallback(response) {
            $scope.ketquasAddress = response.data.results;
            console.log($scope.ketquasAddress);
            $('#list-add').show();

        })
    };

    $scope.setSelectedAddress = function (selected) {
        $scope.autocompleteAddress.text = selected.formatted_address;
        $scope.address = selected;
        if (!$rootScope.newfilter) {
            $rootScope.newfilter = {}
        }
        $rootScope.newfilter.lat = selected.geometry.location.lat;
        $rootScope.newfilter.lng = selected.geometry.location.lng;
        $rootScope.jobCard = []
        $rootScope.jobCardGoogle = []

        $scope.getUserFiltered($rootScope.newfilter)

        console.log(selected);
        $('#list-add').hide();

    };

    $rootScope.$watch('onlineList', function (newvlue) {
        if (newvlue) {
            $rootScope.aside = true
        }
    })
    $scope.init = function () {
        $rootScope.newfilter = {
            p: 1,
            distance: 50,
        }
        if($stateParams.job){
            $rootScope.newfilter.job = $stateParams.job
        }
        if($stateParams.add){
            $scope.searchAddress = function () {
                $scope.URL = 'https://maps.google.com/maps/api/geocode/json?address=' + $stateParams.add + '&sensor=true&key=' + CONFIG.APIKey;
                $http({
                    method: 'GET',
                    url: $scope.URL
                }).then(function successCallback(response) {
                    var Address = response.data.results[0];
                    $rootScope.newfilter.lat = Address.lat
                    $rootScope.newfilter.lng = Address.lng
                    $scope.getUserFiltered($rootScope.newfilter);

                })
            };
        }else if($rootScope.userData && $rootScope.userData.location){
            $rootScope.newfilter.lat = $rootScope.userData.location.lat
            $rootScope.newfilter.lng = $rootScope.userData.location.lng

            $scope.getUserFiltered($rootScope.newfilter);
        } else {
            $scope.getUserFiltered($rootScope.newfilter);
        }
    };
    $scope.setSalary = function () {
        $scope.salary = true
    }

    $scope.salary = false
    $rootScope.newfilterFilter = function (type, key) {
        $rootScope.jobCard = []
        $rootScope.storeCard = []
        if (!$rootScope.newfilter) {
            $rootScope.newfilter = {
                userId: $rootScope.userId,
                type: 'job',
                p: 1,
            }
        }
        $rootScope.newfilter.p = 1
        $rootScope.newfilter[type] = key
        console.log($rootScope.newfilter)
        $scope.getUserFiltered($rootScope.newfilter)
        if (type == 'expect_salary') {
            $scope.salary = false
        }

    }

    $scope.sortFilter = function (param) {
        $rootScope.newfilter = {
            show: param
        }
        $scope.getUserFiltered($rootScope.newfilter)

    }


    $scope.selectFilter = function (card) {
        console.log('$rootScope.newfilter', $rootScope.newfilter)
        $rootScope.newfilter = card;
        $scope.getUserFiltered($rootScope.newfilter)
    };

    $rootScope.maxMatchJob = 0
    $rootScope.maxMatchStore = 0


    $scope.slideHasChanged = function (index) {
        console.log('slideHasChanged');
        $scope.slideIndex = index
    };

    $scope.slideTo = function (index) {
        $ionicSlideBoxDelegate.slide(index);
    };
    $scope.deviceHeight = window.innerHeight;

    $scope.slideIndex = 1;
// to logout


    $scope.matchlike = "";

    if (!$rootScope.userliked) {
        $rootScope.userliked = [];
    }
    if (!$rootScope.userdisliked) {
        $rootScope.userdisliked = [];
    }

    $scope.filterSearchMook = function () {
        console.log($rootScope.newfilter)
    }
    $scope.applyThis = function (id, key) {
        if ($scope.selectedJob && $scope.selectedJob[id] && $scope.selectedJob[id][key]) {
            delete $scope.selectedJob[id][key]
        } else {

            if (!$scope.selectedJob) {
                $scope.selectedJob = {}
            }
            if (!$scope.selectedJob[id]) {
                $scope.selectedJob[id] = {}
            }
            $scope.selectedJob[id][key] = true;
        }
        console.log($scope.selectedJob)
    };


    $scope.like = function (card, action, selectedJob) {

        AuthUser.userLike(card, action, selectedJob).then(function (result) {
            console.log(result)

        })
    };




    $scope.loading = false;
    $scope.loadMoreStore = function () {
        if ($scope.newfilter && $scope.response && $scope.newfilter.type == 'store') {
            console.log('request load', $scope.newfilter.p, $scope.response.total_pages)
            if (!$scope.loading && $scope.newfilter) {
                if ($scope.newfilter.p < $scope.response.total_pages) {
                    $scope.loading = true;
                    console.log('loading')

                    $scope.newfilter.p++
                    $scope.getUserFiltered($scope.newfilter);
                    $timeout(function () {
                        $scope.loading = false;
                    }, 500)
                } else {
                    console.log('max page')
                }

            }
        }

    }
    $scope.loadMoreJob = function () {
        if ($scope.newfilter && $scope.response && $scope.newfilter.type == 'job') {
            console.log('request load', $scope.newfilter.p, $scope.response.total_pages)
            if (!$scope.loading && $scope.newfilter) {
                if ($scope.newfilter.p < $scope.response.total_pages) {
                    $scope.loading = true;
                    console.log('loading')

                    $scope.newfilter.p++
                    $scope.getUserFiltered($scope.newfilter);
                    $timeout(function () {
                        $scope.loading = false;
                    }, 500)
                } else {
                    console.log('max page')
                }
            }
        }
    }


});

$(window).scroll(function () {
    var scroll = $(window).scrollTop();

    if (scroll >= 300) {
        $(".filter-tab").addClass("fixed-top").css({top: 60, 'z-index': 1});
    } else {
        $(".filter-tab").removeClass("fixed-top").css({top: 0});
    }
});