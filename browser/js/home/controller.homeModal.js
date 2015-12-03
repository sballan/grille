app.controller('HomeModalCtrl', function ($scope, $uibModal, $uibModalInstance) {

  $scope.ok = function (data) {
    $uibModalInstance.close(data);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});