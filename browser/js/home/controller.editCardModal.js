app.controller('editCardCtrl', function ($scope, $uibModalInstance) {
  $scope.ok = function (data) {
    $uibModalInstance.close(data);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});