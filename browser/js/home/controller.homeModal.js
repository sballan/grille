app.controller('HomeModalCtrl', ['$scope', '$uibModal', '$uibModalInstance', function ($scope, $uibModal, $uibModalInstance) {

  $scope.ok = function (data) {
    $uibModalInstance.close(data)
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]);