// controller.js
angular
    .module('app')
    .controller('languageCtrl', languageCtrl)

    .controller('ModalController', function ($scope, close) {

        $scope.close = function (result) {
            close(result, 500); // close, but give 500ms for bootstrap to animate
        };

    })

    .controller('ModalPermitCtrl', function ($scope, close) {

        $scope.close = function (result) {
            close(result, 500); // close, but give 500ms for bootstrap to animate
        };


    })
    .controller('ModalMatchCtrl', function ($scope, close, userId, storeId) {

        $rootScope.service.JoboApi('on/store',{storeId: storeId}).then(function (data) {
            $scope.store = data.data;
        });
        $rootScope.service.JoboApi('on/profile',{userId: userId}).then(function (data) {
            $scope.user = data.data;
        });
        /*var storeRef = firebase.database().ref('/store/' + storeId);
        storeRef.once('value', function (snap) {
            $scope.store = snap.val()
        });

        var userRef = firebase.database().ref('/profile/' + userId);
        userRef.once('value', function (snap) {
            $scope.user = snap.val()
        });*/


        $scope.close = function (result) {
            close(result, 500); // close, but give 500ms for bootstrap to animate
        };

    })


    .controller('ModalAddressCtrl', function ($scope, close, $http, CONFIG, $rootScope) {

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

        $scope.close = function () {
            close($rootScope.userData, 500); // close, but give 500ms for bootstrap to animate
        };

    })


languageCtrl.$inject = ['$translate', '$scope'];
function languageCtrl($translate, $scope) {
    function checkLanguage(languages, langKey) {
        languages.map(function (language) {
            if (language.langKey == langKey) {
                $scope.flag = language.flag;
                $scope.lang = language.lang;
                return language
            } else {

                return null
            }
        });
    }

    var languages = [
        {
            lang: 'Polish',
            langKey: 'pl',
            flag: 'Poland.png'
        },
        {
            lang: 'English',
            langKey: 'en',
            flag: 'United-Kingdom.png'
        },
        {
            lang: 'Español',
            langKey: 'es',
            flag: 'Spain.png'
        }
    ]
    $scope.languages = languages;
    checkLanguage(languages, $translate.use())
    $scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
        checkLanguage(languages, langKey)
    };
}

