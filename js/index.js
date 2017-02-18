(function (angular) {
  'use strict';
  angular.module('formFlickr', [])
    .controller('FlickrController', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {

      $scope.searching = false;
      $scope.message = '';
      $scope.images = {};

      $scope.search = function (searchCriteria) {

        if (!searchCriteria.tags) {
          return false;
        }

        $scope.searching = true;
        $scope.message = '';
        $scope.images = {};
        $scope.form.tags.$setUntouched();
        $scope.form.tags.$setValidity();

        // build URL for Flickr API
        var flickrAPI = "http://api.flickr.com/services/feeds/photos_public.gne";
        flickrAPI = flickrAPI + "?jsoncallback=JSON_CALLBACK"
          + "&tags=" + encodeURIComponent($scope.searchCriteria.tags)
          + "&format=json";

        $http.jsonp(flickrAPI)
          .success(function (data, status, headers, config) {
            $scope.searching = false;
            $scope.imagesStatus = status;
            if(!Array.isArray(data.items) || data.items.length === 0){
              $scope.message = 'No Records found';
              return false;
            }
          $scope.images = data.items.map(function (item) {
            item.author = item.author.replace('nobody@flickr.com ("', '').replace('")','');
            var tagArr = item.tags.split(' ');
            var tagHtml = '';
            tagArr.forEach(function (tag) {
              tagHtml += '<span class="tag">' + tag + '</span><span>&nbsp;</span>';
            });
            item.tagList = tagHtml;
            return item;
          });

        }).error(function (data, status, headers, config) {
          $scope.images = data;
          $scope.searching = status;
          $scope.message = data;
        });

      };

      $scope.isSearching = function () {
        return !!$scope.searching;
      };

      $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
      };

    }]);
})(window.angular);