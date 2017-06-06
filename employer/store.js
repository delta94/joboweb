"use strict";

app.controller('storeCtrl', storeCtrl)

function storeCtrl($rootScope, $q, $scope, AuthUser, $stateParams, $timeout, $state, toastr, $http, firebase, CONFIG, Upload, usSpinnerService, $sce) {
    var staticData = {
        viewed: 0,
        liked: 0,
        shared: 0,
        rated: 0,
        rateAverage: 0,
        matched: 0,
        chated: 0,
        like: 0,
        share: 0,
        rate: 0,
        match: 0,
        chat: 0,
        timeOnline: 0,
        login: 1,
        profile: 0
    }


    $scope.init = function () {
        $scope.type = $stateParams.id;
        console.log($scope.type);
        //
        $scope.multiple = {
            industry: [],
            languages: [],
            time: [],
            job: []
        };
        $scope.contact = {}
        $scope.picFile = null;
        $scope.tempoExperience = {}


        //


        if ($scope.type == 'new') {

            $scope.firsttime = true;

            //tạo thêm cửa hàng
            console.log('new');

            AuthUser.user().then(function (result) {
                if (result.name) {
                    $scope.contact.name = true
                }
                if (result.email) {
                    $scope.contact.email = true
                }
                if (result.phone) {
                    $scope.contact.phone = true
                }
                var newstoreKey = firebase.database().ref('store').push().key
                $rootScope.storeData = {
                    createdBy: result.userId,
                    storeId: newstoreKey,
                    createdAt: new Date().getTime(),
                    job: {},
                }
                $scope.jobData = []

                $rootScope.userData.currentStore = newstoreKey
                $rootScope.storeId = newstoreKey


            }, function (error) {
                console.log(error)
                // error
            });


        } else {

            AuthUser.user().then(function (result) {
                if (result.name) {
                    $scope.contact.name = true
                }
                if (result.email) {
                    $scope.contact.email = true
                }
                if (result.phone) {
                    $scope.contact.phone = true
                }

                console.log(result)
                if (result.currentStore) {
                    $scope.ByHand = true
                    firebase.database().ref('store/' + result.currentStore).once('value', function (snap) {
                        $timeout(function () {
                            $rootScope.storeData = snap.val();
                            console.log($rootScope.storeData);
                            if ($rootScope.storeData && $rootScope.storeData.job) {
                                $rootScope.service.loadJob($rootScope.storeData)
                                    .then(function (data) {
                                        $timeout(function () {
                                            $scope.jobData = data
                                            console.log($scope.jobData)

                                        })
                                    })
                            } else {
                                //chưa có job
                                $rootScope.storeData.job = {}
                                $scope.jobData = []
                            }

                            //Đã có, vào để update
                            $scope.autocompleteAddress.text = $rootScope.storeData.address
                        })
                    })
                } else {

                    $scope.firsttime = true;

                    //tạo mới đầu
                    console.log('Tạo mới');
                    var newstoreKey = firebase.database().ref('store').push().key;
                    $rootScope.userData.currentStore = newstoreKey
                    $rootScope.storeId = newstoreKey

                    $rootScope.storeData = {
                        createdBy: $rootScope.userId,
                        storeId: newstoreKey,
                        createdAt: new Date().getTime(),
                        job: {},
                        static: staticData

                    }
                    $scope.jobData = []
                }


            }, function (error) {
                console.log(error)
                // error
            });


        }


    }
    $scope.createByHand = function () {
        if ($rootScope.storeData.googleIns) {
            $rootScope.storeData.industry = $scope.convertIns($rootScope.storeData.googleIns[0])
        }
        $timeout(function () {
            $scope.ByHand = true
        })

    }
    $scope.uploadFiles = function (imageData, errFiles) {
        $scope.startSpin('avatar');

        var uploadRef = firebase.storage().ref().child('images/' + $rootScope.userId + Math.random())
        uploadRef.putString(imageData, 'data_url').then(function (snapshot) {
            console.log('Uploaded a base64 string!', snapshot);
            var downloadURL = snapshot.downloadURL;
            console.log(downloadURL);
            $rootScope.storeData.avatar = downloadURL;
            $scope.$apply(function () {
                $scope.stopSpin('avatar');
                delete $scope.picFile
            })
        });

    };

//Store
    $scope.autocompleteStore = {text: ''};
    $scope.searchStore = function () {
        var params = {
            query: S($scope.autocompleteStore.text).latinise().s
        }
        $http({
            method: 'GET',
            url: CONFIG.APIURL + '/api/places',
            params: params
        }).then(function successCallback(response) {
            $scope.ketquasStore = response.data.results;
            console.log($scope.ketquasStore);
            $('#list-store').show();
        })
    };
    $scope.setSelectedStore = function (selected) {
        $scope.location = selected;
        console.log($scope.location)
        $rootScope.storeData.location = {};
        $rootScope.storeData.storeName = $scope.location.name;
        $rootScope.storeData.address = $scope.location.formatted_address;
        $rootScope.storeData.location.lat = $scope.location.geometry.location.lat;
        $rootScope.storeData.location.lng = $scope.location.geometry.location.lng;
        $rootScope.storeData.googleIns = $scope.location.types;
        $scope.autocompleteStore.text = $scope.location.name
        $scope.autocompleteAddress.text = $scope.location.formatted_address
        console.log($rootScope.storeData)
        $('#list-store').hide();

    };
    $scope.eraseStore = function () {
        $scope.autocompleteStore.text = null;
        $('#list-store').hide();
    }

//address
    $scope.autocompleteAddress = {text: ''};
    $scope.ketquasAddress = [];
    $scope.searchAddress = function () {
        $scope.URL = 'https://maps.google.com/maps/api/geocode/json?address=' + S($scope.autocompleteAddress.text).latinise().s + '&components=country:VN&sensor=true&key=' + CONFIG.APIKey;
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
        $rootScope.storeData.address = selected.formatted_address;
        $rootScope.storeData.location = selected.geometry.location;

        console.log(selected);
        $('#list-add').hide();
        //$rootScope.userData.address = selected.formatted_address;
        //$rootScope.userData.location = selected.geometry.location;

    };
    $scope.eraseAddress = function () {
        $scope.autocompleteAddress.text = null;
        $('#list-add').hide();
    }

//upload more image
    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });
    $scope.$watch('file', function () {
        if ($scope.file != null) {
            $scope.files = [$scope.file];
        }
    });
    $scope.log = {};
    $scope.deleteImage = function (images) {
        console.log('clicked', images)
        $rootScope.storeData.photo.splice(images, 1);
    }

    $scope.upload = function (files) {
        $scope.startSpin('photo');
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (!file.$error) {

                    var metadata = {
                        'contentType': file.type
                    };
                    var storageRef = firebase.storage().ref();
                    var uploadTask = {};

                    uploadTask[i] = storageRef.child('images/' + $rootScope.userId + Math.random()).put(file, metadata);

                    uploadTask[i].then(function (snapshot) {
                        var downloadURL = snapshot.downloadURL;
                        console.log(downloadURL);
                        if(!$rootScope.storeData.photo){
                            $rootScope.storeData.photo = []
                        }
                        $rootScope.storeData.photo.push(downloadURL);
                    });

                    uploadTask[i].on('state_changed', function (snapshot) {
                        $timeout(function () {
                                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                $scope.log[i] = progress + '%';
                                console.log('Upload is ' + progress + '% done');
                            }
                        );
                        // Observe state change events such as progress, pause, and resume
                    }, function (error) {
                        // Handle unsuccessful uploads
                    }, function () {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        $scope.stopSpin('photo')
                    })

                }
            }
        }
    };

    $scope.addJob = function () {
        $scope.newJob = {}
    };
    $scope.saveJob = function () {
        if (!$scope.jobData) {
            $scope.jobData = []
        }
        if (!$scope.anaJob) {
            $scope.anaJob = []
        }
        if($scope.newJob.job == 'other'){
            $scope.newJob.job = $scope.newJob.other
        }

        console.log($scope.newJob)

        $scope.jobData.push($scope.newJob)
        console.log($scope.jobData)
        $scope.anaJob.push($scope.newJob.job)

        delete $scope.newJob
    }
    $scope.deleteJob = function (id) {
        delete  $scope.jobData[id]
    };
    $scope.submit = function () {
        console.log('submit',$rootScope.storeData)
        $scope.error = $rootScope.userData;

        if ($rootScope.userData.email && $rootScope.userData.phone && $rootScope.storeData.location) {

            for (var i in $scope.jobData) {
                var job = $scope.jobData[i]
                if (job.deadline) {
                    job.deadline = new Date(job.deadline).getTime()
                    console.log(job.deadline)
                }
                if(!job.createdAt){
                    job.createdAt = new Date().getTime()
                }
                delete job.$$hashKey

                if(job.other){
                    var jobkey = $rootScope.service.latinese(job.job)
                    $rootScope.storeData.job[jobkey] = job.job
                    firebase.database().ref('job/' + $rootScope.storeId + ":" + jobkey).update(job)
                } else {

                    $rootScope.storeData.job[job.job] = true
                    firebase.database().ref('job/' + $rootScope.storeId + ":" + job.job).update(job)
                }


            }
            firebase.database().ref('store/' + $rootScope.storeData.storeId).update($rootScope.storeData)

            firebase.database().ref('user/' + $rootScope.userId).update($rootScope.userData);

            if ($scope.firsttime) {
                $rootScope.service.Ana('createStore');
                toastr.success('Tạo cửa hàng thành công')
            } else {
                $rootScope.service.Ana('updateStore', {job: $scope.anaJob || ''});
                toastr.success('Cập nhật thành công')

            }
            $state.go('app.edash')



        } else {
            toastr.error('Bạn chưa cập nhật đủ thông tin', 'Lỗi');
        }
    }


    $scope.startSpin = function (spin) {
        usSpinnerService.spin(spin);
    }
    $scope.stopSpin = function (spin) {
        usSpinnerService.stop(spin);
    }
    $scope.convertIns = function (job) {
        var card = CONFIG.data.convertIns

        var converted;
        if
        (card.beauty_salon[job]) {
            converted = 'beauty_salon'
        } else if (card.store[job]) {
            converted = 'store'

        } else if (card.restaurant_bar[job]) {
            converted = 'restaurant_bar'

        } else if (card.education_centre[job]) {
            converted = 'education_centre'

        } else if (card.resort[job]) {
            converted = 'resort'

        } else if (card.real_estate[job]) {
            converted = 'real_estate'
        } else if (card.supermarket_cinema[job]) {
            converted = 'supermarket_cinema'
        } else if (card.unique[job]) {
            converted = job

        } else {
            converted = 'other'
        }
        console.log('converted', converted)
        return converted
    }

}
