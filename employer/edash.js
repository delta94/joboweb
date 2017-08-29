"use strict";

app.controller('eDashCtrl', function ($scope, $state, $http, $sce, toastr, $q
    , CONFIG
    , AuthUser
    , $window
    , $log
    , $rootScope
    , $timeout
    , $stateParams
    , ModalService) {


    $scope.autocompleteAddress = {text: ''};
    $scope.ketquasAddress = [];
    $scope.searchAddress = function () {
        $scope.URL = 'https://maps.google.com/maps/api/geocode/json?address=' + $scope.autocompleteAddress.text + '&components=country:VN&sensor=true&key=' + CONFIG.APIKey;
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
        $rootScope.usercard = []

        $scope.getUserFiltered($rootScope.newfilter)

        console.log(selected);
        $('#list-add').hide();
        //$rootScope.userData.address = selected.formatted_address;
        //$rootScope.userData.location = selected.geometry.location;

    };

    $rootScope.$watch('newNoti', function (newNoti) {
        $rootScope.og = {
            title: '(' + newNoti + ') Jobo' || 'Jobo'
        }
    });

    $(document).ready(function () {
        $('[data-toggle="popover"]').popover();
    });
    $rootScope.$watch('onlineList', function (newvlue) {
        if (newvlue) {
            $rootScope.aside = true
        }
    });
    $scope.init = function () {

        if ($rootScope.storeData) {
            $scope.initData($rootScope.storeData)
        }
        if (!$rootScope.newfilter) {
            $rootScope.newfilter = {
                p: 1
            }
        }
        if ($rootScope.storeId) {
            $rootScope.newfilter.userId = $rootScope.storeId
        }
        if ($stateParams.lat && $stateParams.lng) {
            $rootScope.newfilter.lat = $stateParams.lat
            $rootScope.newfilter.lng = $stateParams.lng
        } else if ($rootScope.storeData && $rootScope.storeData.location) {
            $rootScope.newfilter.lat = $rootScope.storeData.location.lat
            $rootScope.newfilter.lng = $rootScope.storeData.location.lng

            $scope.autocompleteAddress = {text: $rootScope.storeData.address}

        }
        if ($stateParams.job) {
            $rootScope.newfilter.job = $stateParams.job
        }
        $rootScope.usercard = []

        $scope.getUserFiltered($rootScope.newfilter)


    };
    $scope.calculateAge = function calculateAge(birthday) { // birthday is a date
        var ageDifMs = Date.now() - new Date(birthday).getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    $scope.initData = function (storeData) {
        if (!storeData) {
            $state.go('store', {id: null})
            toastr.info('Hãy tạo cửa hàng đầu tiên của bạn')
        } else if (!$rootScope.storeData.location) {
            $state.go('store', {id: null})
            toastr.info('Hãy tạo cửa hàng đầu tiên của bạn')
        } else if (!$rootScope.storeData.job) {
            toastr.info('Hãy cập nhật địa chỉ cửa hàng?')
            $state.go('store', {id: 'job'})
        }
    }

    $rootScope.newfilterFilter = function (type, key) {
        $rootScope.newfilter[type] = key
        $rootScope.newfilter.p = 1
        if ($rootScope.newfilter.experience == false) {
            delete $rootScope.newfilter.experience
        }
        if ($rootScope.newfilter.figure == false) {
            delete $rootScope.newfilter.figure
        }

        console.log($rootScope.newfilter)
        $rootScope.usercard = []
        $scope.getUserFiltered($rootScope.newfilter)
    }
    $scope.setAge = function () {
        $scope.age = true
    }
    $scope.age = false;
    $rootScope.newAgeFilter = function (type, key1, key2) {
        $rootScope.jobCard = []
        $rootScope.storeCard = []
        $rootScope.newfilter.p = 1
        $rootScope.newfilter.age1 = key1
        $rootScope.newfilter.age2 = key2
        console.log($rootScope.newfilter)
        $rootScope.usercard = []
        $scope.getUserFiltered($rootScope.newfilter)
        $scope.age = false
    }


    $scope.showVideo = function (user) {
        $scope.showVid = user.userId
        $scope.videoTrusted = $sce.trustAsResourceUrl(user.videourl)
    }

    $scope.loading = false;
    $scope.loadMore = function () {
        console.log('request load')
        if (!$scope.loading && $rootScope.newfilter && $rootScope.newfilter.p < $scope.response.total_pages) {
            $scope.loading = true;

            console.log('loading')
            $rootScope.newfilter.p++
            $scope.getUserFiltered($rootScope.newfilter);
            $timeout(function () {
                $scope.loading = false;
            }, 500)
        }
    }
    $rootScope.maxMatchUser = 0


    $scope.getUserFiltered = function (newfilter) {
        console.log('filtering..', newfilter)
        $scope.loading = true
        $http({
            method: 'GET',
            url: CONFIG.APIURL + '/api/users',
            params: newfilter
        }).then(function successCallback(response) {
            console.log("respond", response);
            $scope.response = response.data;
            if ($rootScope.maxMatchUser == 0) {
                $rootScope.maxMatchUser = $scope.response.data[0].match
                console.log($rootScope.maxMatchUser)
            }

            $timeout(function () {
                if (!$rootScope.usercard) {
                    $rootScope.usercard = []
                }
                for (var i in $scope.response.data) {
                    var profileData = $scope.response.data[i]
                    $scope.response.data[i].matchPer = Math.round($scope.response.data[i].match * 100 / $rootScope.maxMatchUser)

                    if (profileData.act) {
                        var ref = 'activity/like/' + $rootScope.storeId + ':' + profileData.userId
                        firebase.database().ref(ref).on('value', function (snap) {
                            $scope.response.data[i].act = snap.val()
                        })
                    }

                }
                $rootScope.usercard = $rootScope.usercard.concat($scope.response.data);
                console.log($rootScope.usercard)
                $scope.loading = false
            })
        }, function (error) {
            console.log(error)
            $scope.loading = false

        })


    };


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
    };

    $scope.offer = function (id) {
        if (!$scope.jobOffer) {
            $scope.jobOffer = {}
        }
        $scope.jobOffer[id] = true
    }
    $scope.like = function (card, action, selectedJob) {
        AuthUser.storeLike(card, action, selectedJob).then(function (out) {
            console.log(out)
            delete $scope.jobOffer[card.userId]
        })
    };

    $scope.chatto = function (id) {
        $state.go("employer.chats", {to: id, slide: 1})
    };

})
;
