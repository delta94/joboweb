"use strict";

app.controller('storeCtrl', storeCtrl)

function storeCtrl($rootScope, $q, $scope, AuthUser, $stateParams, $timeout, $state, toastr, $http, firebase, Upload, usSpinnerService, $sce) {

    $scope.init = function () {
        $timeout(function () {
            $scope.ByHand = true
        })

        $scope.type = $stateParams.id;
        console.log($scope.type);
        $scope.multiple = {
            industry: [],
            languages: [],
            time: [],
            job: []
        };
        $scope.contact = {}
        $scope.picFile = null;
        $scope.tempoExperience = {}

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
                var newstoreKey = 's' + Math.round(100000000000000 * Math.random());
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

                    $rootScope.service.JoboApi('on/store', {
                        storeId: $rootScope.storeId
                    }).then(function (data) {
                        $rootScope.storeData = data.data
                        if ($rootScope.storeData && $rootScope.storeData.job) {
                            $scope.jobData = $rootScope.storeData.jobData
                        } else {
                            //chưa có job
                            $rootScope.storeData.job = {}
                            $scope.jobData = []
                        }

                        //Đã có, vào để update
                        $scope.autocompleteAddress.text = $rootScope.storeData.address
                    })

                } else {

                    $scope.firsttime = true;

                    //tạo mới đầu
                    console.log('Tạo mới');

                    var newstoreKey = 's' + Math.round(100000000000000 * Math.random());
                    // var newstoreKey = firebase.database().ref('store').push().key;
                    $rootScope.userData.currentStore = newstoreKey
                    $rootScope.storeId = newstoreKey

                    $rootScope.storeData = {
                        createdBy: $rootScope.userId,
                        storeId: newstoreKey,
                        createdAt: new Date().getTime(),
                        job: {}

                    }
                    $scope.jobData = []
                }


            }, function (error) {
                console.log(error)
            });
        }
    }


    //admin note
    $scope.addMoreNote = function () {
        $scope.tempoAdminNote = {};
        $scope.tempoAdminNote.date = new Date();
        $scope.tempoAdminNote.adminId = $scope.adminData.userId;
    };
    $scope.deleteNote = function (id) {
        delete $scope.storeData.adminNote[id]
    };
    $scope.deleteTempNote = function () {
        delete $scope.tempoAdminNote
    }
    $scope.saveNote = function () {

        var newkey = 'p' + Math.round(100000000000000 * Math.random());
        $scope.tempoAdminNote.id = newkey;
        if (!$scope.storeData.adminNote) {
            $scope.storeData.adminNote = {}
        }
        $scope.storeData.adminNote[newkey] = $scope.tempoAdminNote;
        delete $scope.tempoAdminNote
    };

    var admin = $stateParams.admin;
    $scope.admin = $stateParams.admin;
    if (admin) {
        console.log($rootScope.storeId)
        $scope.ByHand = true

        AuthUser.user().then(function (adminInfo) {
            $scope.adminData = adminInfo;
            if ($scope.adminData.admin) {
                $rootScope.storeId = admin;
                $rootScope.service.JoboApi('on/store', {
                    storeId: $rootScope.storeId
                }).then(function (data) {
                    $timeout(function () {
                        $rootScope.storeData = data.data
                        $rootScope.userId = $rootScope.storeData.createdBy
                        $rootScope.service.JoboApi('on/user', {
                            userId: $rootScope.userId
                        }).then(function (datauser) {
                            $timeout(function () {
                                $rootScope.userData = datauser.data
                            })
                        })
                        if ($rootScope.storeData && $rootScope.storeData.jobData) {
                            $scope.jobData = $rootScope.storeData.jobData
                        } else {
                            //chưa có job
                            $rootScope.storeData.job = {}
                            $scope.jobData = []
                        }
                        //Đã có, vào để update
                        $scope.autocompleteAddress.text = $rootScope.storeData.address
                    })
                })
            }
        });
    } else {
        $scope.init()
    }


    $scope.createByHand = function () {
        if ($rootScope.storeData && $rootScope.storeData.googleIns) {
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
            url: $rootScope.CONFIG.APIURL + '/api/places',
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

    var delay = false
    $scope.searchAddress = function (textfull) {
        var text = S(textfull).latinise().s
        $scope.URL = 'https://maps.google.com/maps/api/geocode/json?address=' + S($scope.autocompleteAddress.text).latinise().s + '&components=country:VN&sensor=true&key=' + $rootScope.CONFIG.APIKey;
        if (delay == false) {
            delay = true
            $http({
                method: 'GET',
                url: $scope.URL
            }).then(function successCallback(response) {
                $scope.ketquasAddress = response.data.results;
                console.log($scope.ketquasAddress);
                $('#list-add').show();
            });
            $timeout(function () {
                delay = false
            }, 1000)
        }
    };
    $scope.setSelectedAddress = function (selected) {
        $scope.autocompleteAddress.text = selected.formatted_address;
        $scope.address = selected;
        $rootScope.storeData.address = selected.formatted_address;
        $rootScope.storeData.location = selected.geometry.location;

        console.log(selected);
        $('#list-add').hide();

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
                        if (!$rootScope.storeData.photo) {
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
                        });
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

    $scope.workTime = [
        '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00',
        '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
        '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
        '21:00', '22:00', '23:00'];
    $scope.addWorkTime = function (start, end, type) {
        if ((start !== undefined && end !== undefined) && (start !== null && end !== null)) {
            if (type === 'new') {
                $scope.newJob.work_time.push({
                    start: start,
                    end: end
                });
            } else {
                if (!$scope.jobData[type].work_time) {
                    $scope.jobData[type].work_time = [];
                }
                console.log(type);
                $scope.jobData[type].work_time.push({
                    start: start,
                    end: end
                });
                console.log($scope.jobData[type])
            }
        }
    };
    $scope.deleteWorkTime = function (id, type) {
        if (type === 'new') {
            $scope.newJob.work_time.splice(id, 1);
        } else {
            console.log(type);
            $scope.jobData[type].work_time.splice(id, 1);
        }
    };

    $scope.addJob = function () {
        $scope.newJob = {
            createdBy: $rootScope.userId,
            storeId: $rootScope.storeId,
            address: $rootScope.storeData.address,
            location: $rootScope.storeData.location,
            storeName: $rootScope.storeData.storeName,
            work_time: []
        }
    };
    $scope.saveJob = function () {
        if (!$scope.jobData) {
            $scope.jobData = []
        }
        if (!$scope.anaJob) {
            $scope.anaJob = []
        }
        console.log($scope.newJob)

        if ($scope.newJob.job) {
            $scope.jobData.push($scope.newJob);
            console.log($scope.jobData);
            $scope.anaJob.push($scope.newJob.job);

            delete $scope.newJob
        } else {
            toastr.error('Bạn chưa cập nhật vị trí mong muốn');
        }
    };
    $scope.deleteJob = function (id) {
        if (confirm("Bạn muốn xoá job " + [$rootScope.Lang[$scope.jobData[id].job] || $scope.jobData[id].other] + "?") === true) {
            console.log($scope.jobData[id]);
            delete $rootScope.storeData.job[$scope.jobData[id].job];
            $rootScope.service.JoboApi('delete/job', {
                jobId: $scope.jobData[id].jobId
            });
            $scope.jobData.splice(id, 1);
            console.log($rootScope.storeData);
            console.log($scope.jobData);
        }

    };
    $scope.deleteNewJob = function () {
        delete $scope.newJob;
    };
    $scope.submit = function () {
        console.log('submit', $rootScope.storeData)
        $scope.error = $rootScope.userData;

        if ($rootScope.userData.name
            && $rootScope.userData.email
            && $rootScope.userData.phone
            && $rootScope.storeData.location
            && $rootScope.storeData.storeName
            && $rootScope.storeData.industry) {

            for (var i in $scope.jobData) {
                var job = $scope.jobData[i];
                if ($scope.jobData[i].deadline) {
                    $scope.jobData[i].deadline = new Date($scope.jobData[i].deadline).getTime()
                    console.log($scope.jobData[i].deadline)
                }
                if (!$scope.jobData[i].createdAt) {
                    $scope.jobData[i].createdAt = new Date().getTime()
                }
                delete $scope.jobData[i].$$hashKey
                for (var j in $scope.jobData[i].work_time) {
                    delete $scope.jobData[i].work_time[j].$$hashKey;
                }
                if(!$scope.jobData[i].jobId){
                    $scope.jobData[i].jobId = 'j' + Math.round(100000000000000 * Math.random());
                }

                $rootScope.storeData.job[$scope.jobData[i].job] = $scope.jobData[i].jobName;
                console.log($scope.jobData)
            }
            var storeD = Object.assign({},$rootScope.storeData)
            delete storeD.adminData;
            delete storeD.jobData;
            delete storeD.actData;

            storeD.storeId = $rootScope.storeId;

            $rootScope.service.JoboApi('update/user', {
                userId: $rootScope.userId,
                storeId: $rootScope.storeId,
                user: $rootScope.userData,
                store: storeD
            }).then(function (res) {
                console.log(res)
                toastr.success('Cập nhật thông tin thành công')
                $rootScope.service.JoboApi('update/job', {
                    userId: $rootScope.userId,
                    job: JSON.stringify($scope.jobData)
                }).then(function (res) {
                    toastr.success('Cập nhật vị trí thành công')
                    if ($scope.firsttime) {
                        $rootScope.service.Ana('createStore');
                    } else {
                        $rootScope.service.Ana('updateStore', {job: $scope.anaJob || ''});
                    }
                    if ($scope.adminData && $scope.adminData.admin) {
                        $timeout(function () {
                            window.location.href = "/view/store/" + $rootScope.storeId;
                        });
                    } else {
                        $state.go('app.edash')
                    }
                }).catch(function (err) {
                    toastr.error('Lỗi cập nhật tin tuyển dụng')
                });

            }).catch(function (err) {
                toastr.error('Lỗi')

            });


        } else {
            $scope.error = {};
            if (!$rootScope.userData.name) {
                $scope.error.name = true;
            }
            if (!$rootScope.userData.email) {
                $scope.error.email = true;
            }
            if (!$rootScope.userData.phone) {
                $scope.error.phone = true;
            }
            if (!$rootScope.storeData.storeName) {
                $scope.error.storeName = true;
            }
            if (!$rootScope.storeData.industry) {
                $scope.error.industry = true;
            }
            if (!$rootScope.storeData.location) {
                $scope.error.location = true;
            }
            console.log($scope.error);
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
        var card = $rootScope.CONFIG.data.convertIns

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
