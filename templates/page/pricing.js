angular.module('app')
    .controller('pricingCtrl', function ($scope, $http, ModalService, $rootScope) {
            $scope.init = function () {
                $rootScope.aside = false

            }
            $scope.buy = function (pack) {

                ModalService.showModal({
                    templateUrl: 'templates/modals/confirmBuy.html',
                    controller: 'ModalConfirmBuyCtrl',
                    inputs: {
                        pack: pack,
                    }
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                        console.log(result);

                    });
                });
            }

        }
    )
    .controller('ModalConfirmBuyCtrl', function ($scope, close, pack) {
        $scope.pack = pack
        $scope.confirm = function () {
            $scope.confirmBuy = true
        };
        $scope.close = function (result) {
            console.log('close')
            close(result, 500); // close, but give 500ms for bootstrap to animate
        };


    })
    .controller('cartCtrl', function ($scope, $http, $timeout, $rootScope, $stateParams) {
            $scope.package = $stateParams.id

            $scope.customer = {package: $scope.package}
            if ($rootScope.userId) {
                $rootScope.service.JoboApi('on/user',{userId: $rootScope.userId}).then(function (data) {
                    $timeout(function () {
                        $scope.customer = Object.assign($scope.customer,data.data)
                    })
                });
                /*db.ref('user/'+ $rootScope.userId).once('value',function (snap) {
                    $timeout(function () {
                        $scope.customer = Object.assign($scope.customer,snap.val())
                    })
                })*/
            }

            $scope.submit = function () {
                console.log($scope.customer)

                var newkey = Math.round(100000000000000 * Math.random());
                $rootScope.service.JoboApi('update/cart', {
                    userId: $rootScope.userId,
                    newkey: newkey,
                    cart: $scope.customer
                })
                /*var newkey = db.ref('cart').push().key;
                db.ref('cart/' + newkey).update($scope.customer)*/

            }
        }
    )