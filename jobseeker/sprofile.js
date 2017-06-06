"use strict";

app.controller('sprofileCtrl', sprofileCtrl).filter('propsFilter', propsFilter);

function sprofileCtrl($rootScope, $scope, AuthUser, $window, $timeout, $state, toastr, $http, firebase, CONFIG, Upload, usSpinnerService, $sce, $anchorScroll, $location) {
    $scope.startSpin = function (spin) {
        usSpinnerService.spin(spin);
    };
    $scope.stopSpin = function (spin) {
        usSpinnerService.stop(spin);
    };
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
        $scope.progress = 0


        $scope.multiple = {
            industry: [],
            languages: [],
            time: [],
            job: []
        };

        $scope.picFile = null;
        AuthUser.user()
            .then(function (userInfo) {
                    $scope.userInfo = userInfo
                    var profileRef = firebase.database().ref('profile/' + $rootScope.userId);
                    profileRef.once('value', function (snap) {
                        $rootScope.userData = snap.val();
                        $timeout(function () {
                            if (!$rootScope.userData) {
                                //chưa có hồ sơ
                                $scope.firsttime = true
                                $rootScope.userData = {
                                    userId: $rootScope.userId,
                                    name: userInfo.name,
                                    photo: [],
                                    static: staticData
                                }
                            }

                            $rootScope.userData.email = userInfo.email;
                            $rootScope.userData.phone = userInfo.phone;

                            if ($rootScope.userData.school) {
                                $scope.autocompleteSchool = {text: $rootScope.userData.school}
                            }
                            if ($rootScope.userData.address) {
                                $scope.autocompleteAddress = {text: $rootScope.userData.address}
                            }

                            if ($rootScope.userData.industry) {
                                for (var i in $rootScope.userData.industry) {
                                    $scope.multiple.industry.push(i)
                                }
                            }
                            if ($rootScope.userData.languages) {
                                for (var i in $rootScope.userData.languages) {
                                    $scope.multiple.languages.push(i)
                                }
                            }

                            if ($rootScope.userData.job) {
                                for (var i in $rootScope.userData.job) {
                                    $scope.multiple.job.push(i)
                                }
                            }
                            if ($rootScope.userData.birth) {
                                $rootScope.userData.birth = $rootScope.service.convertDateRes($rootScope.userData.birth)
                            }

                            if (!$rootScope.userData.photo) {
                                $rootScope.userData.photo = []
                            }

                            $scope.videoTrusted = $sce.trustAsResourceUrl($rootScope.userData.videourl)
                        })


                    })
                }, function (error) {
                    console.log(error)
                    // error
                }
            );
    }
    $scope.rangeFinishCallback = function (sliderObj) {
        var newValue = sliderObj.from;
        console.log(newValue)

        if ($scope.userData) {
            $scope.userData.expect_distance = newValue
        }
    }
    $scope.uploadAvatar = function (imageData, errFiles) {
        $scope.avatarUpload = true
        $scope.startSpin('avatar');

        var uploadRef = firebase.storage().ref().child('images/' + $rootScope.userId)
        uploadRef.putString(imageData, 'data_url').then(function (snapshot) {
            if ($scope.avatarUpload == true) {
                console.log('Uploaded a base64 string!', snapshot);
                var downloadAvatar = snapshot.downloadURL;
                console.log(downloadAvatar);
                $rootScope.userData.avatar = downloadAvatar;
                $scope.$apply(function () {
                    $scope.stopSpin('avatar');
                    delete $scope.picFile;
                    downloadAvatar = null;
                    $scope.avatarUpload = false
                })
            }

        });


    };
    $scope.uploadVideo = function (imageData) {
        $scope.startSpin('video');
        $scope.videoUpload = true

        console.log('imageData', imageData)
        var metadata = {
            'contentType': imageData.type
        };
        var storageRef = firebase.storage().ref();
        var uploadTask = storageRef.child('video/' + $rootScope.userId).put(imageData, metadata);
        uploadTask.then(function (snapVideo) {
            if ($scope.videoUpload == true) {
                var downloadVideo = snapVideo.downloadURL;
                console.log(downloadVideo);
                $timeout(function () {
                    $rootScope.userData.videourl = downloadVideo;
                    $scope.videoTrusted = $sce.trustAsResourceUrl($rootScope.userData.videourl)
                    $scope.$apply(function () {
                        $scope.stopSpin('video');
                        downloadVideo = null
                    })

                })

                $scope.videoUpload = false
            }
        })
        uploadTask.on('state_changed', function (snapVideo) {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded

            var progress = (snapVideo.bytesTransferred / snapVideo.totalBytes) * 100;
            $timeout(function () {
                $scope.progress = Math.round(progress * 10) / 10

            });
            $scope.progress = progress

            console.log('Upload is ' + progress + '% done');

            switch (snapVideo.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        }, function (error) {
            // Handle unsuccessful uploads
        }, function () {
            // Handle successful uploads on complete

        });
    };

    //school
    $scope.autocompleteSchool = {text: ''};
    $scope.searchSchool = function () {
        var params = {
            query: S($scope.autocompleteSchool.text).latinise().s,
            type: 'university'
        }
        $http({
            method: 'GET',
            url: CONFIG.APIURL + '/api/places',
            params: params
        }).then(function successCallback(response) {
            $scope.ketquasSchool = response.data.results;
            console.log($scope.ketquasSchool);
            $('#list-school').show();
        })
    };

    $scope.setSelectedSchool = function (selected) {
        $scope.school = selected;
        console.log($scope.school)
        $scope.autocompleteSchool.text = $scope.school.name
        $rootScope.userData.school = $scope.school.name
        $('#list-school').hide();

    };


    $scope.eraseSchool = function () {
        $scope.autocompleteSchool.text = null;
        $('#list-school').hide();
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
        $rootScope.userData.address = selected.formatted_address;
        $rootScope.userData.location = selected.geometry.location;

        console.log(selected);
        $('#list-add').hide();
        //$rootScope.userData.address = selected.formatted_address;
        //$rootScope.userData.location = selected.geometry.location;

    };
    $scope.eraseAddress = function () {
        $scope.autocompleteAddress.text = null;
        $('#list-add').hide();
    }
    $scope.deleteExp = function (id) {
        delete  $scope.userData.experience[id]
    }
    $scope.addMoreExp = function () {
        $scope.tempoExperience = {}
    }
    $scope.saveJob = function () {
        var experienceRef = firebase.database().ref('profile/' + $rootScope.userId + '/experience');
        var newkey = experienceRef.push().key;
        $scope.tempoExperience.id = newkey
        if (!$scope.userData.experience) {
            $scope.userData.experience = {}
        }
        $scope.userData.experience[newkey] = $scope.tempoExperience
        delete $scope.tempoExperience
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
        $scope.userData.photo.splice(images, 1);
    }

    $scope.upload = function (files) {
        $scope.uploadPhoto = true
        $scope.startSpin('photo');

        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                console.log(i)
                var file = files[i];
                console.log(file)

                if (!file.$error) {

                    var metadata = {
                        'contentType': file.type
                    };
                    var storageRef = firebase.storage().ref();
                    var newkey = firebase.database().ref('profile/' + $rootScope.userId + '/photo').push().key;
                    var uploadTask = storageRef.child('images/' + newkey).put(file, metadata);

                    uploadTask.then(function (snapshot) {
                        if ($scope.uploadPhoto == true) {
                            var downloadPhoto = snapshot.downloadURL;
                            console.log(downloadPhoto);

                            $rootScope.userData.photo.push(downloadPhoto);
                            console.log($rootScope.userData.photo)
                        }
                    });

                    uploadTask.on('state_changed', function (snapshot) {
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


    $scope.submit = function () {
        console.log('$rootScope.userData', $rootScope.userData)
        if ($rootScope.userData.email && $rootScope.userData.phone && $rootScope.userData.address && $rootScope.userData.name && $rootScope.userData.birth) {
            $rootScope.userData.name = $rootScope.service.upperName($rootScope.userData.name)
            $rootScope.userData.birth = $rootScope.service.convertDate($rootScope.userData.birth);
            console.log($rootScope.userData);

            $timeout(function () {
                console.log($scope.multiple)
                if ($scope.multiple.industry.length >= 0) {
                    $rootScope.userData.industry = {};
                    angular.forEach($scope.multiple.industry, function (card) {
                        $rootScope.userData.industry[card] = true
                    })
                }
                if ($scope.multiple.job.length >= 0) {
                    $rootScope.userData.job = {};
                    angular.forEach($scope.multiple.job, function (card) {
                        $rootScope.userData.job[card] = true
                    })
                }

                if ($scope.multiple.languages.length >= 0) {
                    $rootScope.userData.languages = {};
                    angular.forEach($scope.multiple.languages, function (card) {
                        $rootScope.userData.languages[card] = true
                    })
                }

                console.log($rootScope.userData);

                var profileRef = firebase.database().ref('profile/' + $rootScope.userId);
                profileRef.update($rootScope.userData);

                var userRef = firebase.database().ref('user/' + $rootScope.userId);
                userRef.update({
                    name: $rootScope.userData.name,
                    phone: $rootScope.userData.phone,
                    email: $rootScope.userData.email
                });

                //init profile
                if ($scope.firsttime) {
                    $rootScope.service.Ana('createProfile');
                } else {
                    $rootScope.service.Ana('updateProfile');
                }
                toastr.success('Cập nhật hồ sơ thành công');
                if ($rootScope.preApply) {
                    $rootScope.service.userLike($rootScope.preApply.card, 0, $rootScope.preApply.jobOffer)
                }
                $state.go('app.sdash', {}, {reload: true})
            }, 1000)
        } else {
            console.log($rootScope.userData);
            $scope.error = {}
            for (var i in $rootScope.userData) {
                if ($rootScope.userData[i]) {

                } else {
                    $scope.error[i] = true;

                    $timeout(function () {
                        console.log($scope.error)

                    })
                }
            }
            toastr.error('Bạn chưa cập nhật đủ thông tin', 'Lỗi');
            $scope.gotoAnchor('name')
        }
    }

    $scope.gotoAnchor = function (x) {
        var newHash = 'anchor' + x;
        if ($location.hash() !== newHash) {
            // set the $location.hash to `newHash` and
            // $anchorScroll will automatically scroll to it
            $location.hash('anchor' + x);
        } else {
            // call $anchorScroll() explicitly,
            // since $location.hash hasn't changed
            $anchorScroll();
        }
    };


}

function propsFilter() {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    }
}
