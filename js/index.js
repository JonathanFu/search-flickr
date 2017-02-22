(function (angular) {
  'use strict';
  angular.module('searchFlickr', [])
    .controller('SearchController', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {

      $scope.searching = false;
      $scope.message = '';
      $scope.images = {};
      $scope.imagLink = '';

      $scope.search = function () {
        searchHandler();
      };

      $scope.isSearching = function () {
        return !!$scope.searching;
      };

      $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
      };

      $scope.searchTag = function (obj, event) {
        if (!event.target.dataset.tag) return false;
        $scope.tags = event.target.dataset.tag;
        searchHandler();
      };

      var searchHandler = function () {

        $scope.message = '';
        $scope.images = {};
        if (!$scope.tags) {
          return false;
        }

        $scope.searching = true;
        $scope.form.tags.$setUntouched();
        $scope.form.tags.$setValidity();

        var flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne";
        var reqUrl = flickrAPI + "?jsoncallback=JSON_CALLBACK&format=json"
          + "&tags=" + encodeURIComponent($scope.tags);

        $http.jsonp(reqUrl)
          .success(function (data, status, headers, config) {
            $scope.searching = false;
            $scope.imagesStatus = status;
            if (!Array.isArray(data.items) || data.items.length === 0) {
              $scope.message = 'No Records found';
              return false;
            }
            $scope.images = data.items.map(function (item) {
              item.author = item.author.replace('nobody@flickr.com ("', '').replace('")', '');
              var tagArr = item.tags.split(' ');
              var tagHtml = '<ul>';
              tagArr.forEach(function (tag) {
                if (!tag || tag.length <= 1) return;
                tagHtml += '<li><span class="tag" data-tag="' + tag + '">' + tag + '</span></li>';
              });
              item.tagList = tagHtml + '</ul>';
              return item;
            });

          }).error(function (data, status, headers, config) {
          $scope.images = data;
          $scope.searching = status;
          $scope.message = data;
        });

      };


    }]);
})(window.angular);