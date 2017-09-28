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

    $scope.getUserFiltered = function (newfilter = {}, card = []) {
        return new Promise(function (resolve, reject) {
            if (!newfilter.page) {
                newfilter.page = 1
            }
            if (!newfilter.distance) {
                newfilter.distance = 50
            }
            if (!newfilter.type) {
                newfilter.type = 'premium'
            }

            console.log('filtering..', newfilter)

            $scope.loading = true;
            axios({
                method: 'GET',
                url: CONFIG.APIURL + '/api/job',
                params: newfilter
            }).then(function successCallback(response) {
                var result = response.data

                for (var i in result.data) {
                    var jobData = result.data[i]
                    if (jobData.act) {
                        var ref = 'activity/like/' + jobData.actId
                        db.ref(ref).on('value', function (snap) {
                            result.data[i].act = snap.val()
                        })
                    }
                }
                result.data = card.concat(result.data)

                $timeout(function () {
                    $scope.loading = false
                })
                console.log("result", result);
                resolve(result)
            }, function (error) {
                reject(error)
                $timeout(function () {
                    $scope.loading = false
                })
            })
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
        $rootScope.jobCard = {}

        $scope.getUserFiltered($rootScope.newfilter)

        console.log(selected);
        $('#list-add').hide();

    };

    $rootScope.$watch('onlineList', function (newvlue) {
        if (newvlue) {
            $rootScope.aside = true
        }
    })
    $scope.initStatic = function () {
        $rootScope.jobCard = {}
        $scope.getUserFiltered({type: 'premium'}).then(function (result) {
            $rootScope.jobCard['premium'] = result
        })
        $scope.getUserFiltered({type: 'basic'}).then(function (result) {
            $rootScope.jobCard['basic'] = result
        })
    }

    $scope.setSalary = function () {
        $scope.salary = true
    }

    $scope.salary = false
    $rootScope.newfilterFilter = function (type, key, collection) {
        if (!collection) {
            collection = 'premium'
        }
        $rootScope.jobCard[collection].data = []
        $rootScope.jobCard[collection].newfilter[type] = key
        $rootScope.jobCard[collection].newfilter.page = 1

        console.log(' $rootScope.jobCard[collection].newfilter', $rootScope.jobCard[collection].newfilter)
        $scope.getUserFiltered($rootScope.jobCard[collection].newfilter)
            .then(result => $rootScope.jobCard[collection] = result)


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


    $scope.like = function (card, action, selectedJob) {

        AuthUser.userLike(card, action, selectedJob).then(function (result) {
            console.log(result)

        })
    };


    $scope.loading = false;
    $scope.loadMore = function (type) {
        var current = $rootScope.jobCard[type]
        var filter = current.newfilter

        if (filter.page < current.total_pages) {
            $scope.loading = true;
            console.log('loading')
            filter.page++
            $scope.getUserFiltered(filter, current.data).then(function (result) {
                $rootScope.jobCard[type] = result
                $scope.loading = false;

            })

        } else {
            console.log('max page')
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