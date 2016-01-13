/// <reference path="../../includes.ts"/>
/// <reference path="forgeHelpers.ts"/>
/// <reference path="secretHelpers.ts"/>

module Forge {

  export var CamelNodeController = controller("CamelNodeController", ["$scope", "$dialog", "$window", "$element", "$templateCache", "$routeParams", "$location", "localStorage", "$http", "$timeout", "ForgeApiURL", "ForgeModel", "KubernetesModel",
    ($scope, $dialog, $window, $element, $templateCache, $routeParams, $location:ng.ILocationService, localStorage, $http, $timeout, ForgeApiURL, ForgeModel, KubernetesModel) => {

      var node = $scope.node || {};
      var key = node.key;

      // TODO make this visible in the parent scope!
      var xml = $scope.xml || "META-INF/spring/camel-context.xml";
      var resourcePath = "";

      $scope.pattern = node.pattern;
      $scope.label = node.label || $scope.pattern;
      $scope.description = node.description || $scope.pattern;

      switch ($scope.pattern) {
        case "camelContext":
          $scope.addRouteEnabled = true;
          break;
        default:
          $scope.addRouteEnabled = false;
      }
      $scope.editLink = "TODO";

      $scope.deletePrompt = () => {
        UI.multiItemConfirmActionDialog(<UI.MultiItemConfirmActionOptions>{
          collection: [node],
          index: 'label',
          onClose: (result:boolean) => {
            if (result) {
              doDelete();
            }
          },
          title: 'Delete Node',
          action: 'The following node will be deleted:',
          okText: 'Delete',
          okClass: 'btn-danger',
          custom: "This operation is permanent once completed!",
          customClass: "alert alert-warning"
        }).open();
      };

      function doDelete() {
        log.info("Deleting node " + key + " from xml " + xml);
        var commandId = "camel-delete-node-xml";
        var projectId = $scope.projectId;
        var request = {
          namespace: $scope.namespace,
          projectName: projectId,
          resource: "",
          inputList: [
            {
              node: key,
              xml: xml
            }
          ]
        };
        var onData = (jsonData) => {
          log.info("Deleted and got data: " + angular.toJson(jsonData, true));
          $scope.updateData();
        };
        executeCommand($scope, $http, ForgeApiURL, commandId, projectId, request, onData);
      }

      $scope.deleteNode = () => {
        var input = {
          node: key,
          xml: xml
        };
        var nextCommand = "camel-delete-node-xml";
        var nextPage = 1;
        gotoCommand($location, $scope.projectId, nextCommand, resourcePath, input, nextPage);
      };

      $scope.addRoute = () => {
        var input = {
          xml: xml
        };
        var nextCommand = "camel-add-route-xml";
        var nextPage = 1;
        gotoCommand($location, $scope.projectId, nextCommand, resourcePath, input, nextPage);
      };

    }]);
}
