
(function(){
    var app = angular.module('app', ['ngResource', 'ngAnimate', 'infinite-scroll']);

    app.constant('nafApiVersionsLocation', '/versions');

    app.constant('nafApiDefaultPathParams', {
        version: 'naf2008',
        niveau: 'niv1',
        p: 1,
        npp: 10,
        q: ''
    });

    app.directive('tooltip', [function() {
        return {
            restrict:'A',
            link: function(scope, element/*, attrs*/) {
                element.tooltip();
            }
        }
    }]);

    app.controller('NavbarCtrl', ['$scope', 'nafService', function($scope, nafService) {
        nafService.then(
            function(service){
                $scope.service = service;

            },
            function(reason){
                console.dir(reason);
            }
        );
    }]);


    app.controller('JumbotronCtrl', ['$scope', 'nafService', function($scope, nafService){

        nafService.then(
            function(service){
                $scope.service = service;

                $scope.viderFiltre = function(){
                    $scope.service.filtre = '';
                    angular.element('#filterInput').focus();
                };

            },
            function(reason){
                console.dir(reason);
            }
        );

    }]);

    app.controller('PageCtrl', ['$scope', 'nafService', function($scope, nafService){

        nafService.then(
            function(service){
                $scope.service = service;

                $scope.viderFiltre = function(){
                    $scope.service.filtre = '';
                    angular.element('#filterInput2').focus();
                };
            },
            function(reason){
                console.dir(reason);
            }
        );


    }]);


    app.factory('nafService', ['$q', '$resource', '$rootScope', 'nafApiVersionsLocation', 'nafApiDefaultPathParams', function($q, $resource, $rootScope, nafApiVersionsLocation, nafApiDefaultPathParams){
        var _apiVersionsResource = $resource(nafApiVersionsLocation);
        var _apiVersionResource = $resource('/:version');
        var _apiResource = $resource('/:version/:niveau');

        var _pathParams = angular.copy(nafApiDefaultPathParams);

        /*
        Le service retourné est un scope partagé, ce qui lui permet de s'observer ($watch)
        et de se mettre à jour automatiquement.

        L'initialisation de l'ensemble des champs est différée par les appels aux API qu'elle nécessite.
        Pour cette raison, on utilise un deferred pour retourner une promise
         */

        var deferred = $q.defer();

        // Le service est un scope capable de s'observer ($watch)
        var _service = $rootScope.$new();


        var update = function(){
            _pathParams.p = 0;
            _pathParams.q = _service.filtre;
            _service.articles = [];

            return _service.paging();
        };


        var paging = function(){
            _service.updated = false;

            // Le nombre d'éléments doit être égale au numéro de page X nombre par page pour qu'une nouvelle requête soit lancée
            if(_service.articles.length === _pathParams.p * _pathParams.npp){

                _pathParams.p += 1;
                _pathParams.version = _service.version['ref'];
                _pathParams.niveau = _service.niveau['ref'];

                return _apiResource.query(
                    _pathParams,
                    function(articles){
                        _service.niveau = _service.version['endpoints'][_pathParams.niveau];

                        angular.forEach(articles, function(article){
                            _service.articles.push(article);
                        });
                        _service.updated = true;
                        return _service.articles;
                    }
                ).$promise;
            } else {
                var deferred = $q.defer();
                deferred.resolve(_service.articles);
                _service.updated = true;
                return deferred.promise;
            }


        };





        _service.$watch('version', function(newVersion, oldVersion){
            if(newVersion !== oldVersion){
                update();
            }
        });

        _service.$watch('niveau', function(newNiveau, oldNiveau){
            if(newNiveau !== oldNiveau){
                update();
            }
        });

        _service.$watch('filtre', function(newFiltre, oldFiltre){
            if(newFiltre !== oldFiltre){
                update();
            }
        });


        angular.extend(_service,{
            filtre: _pathParams.q,
            articles: [],
            paging: paging
        });

        _apiVersionsResource.query().$promise
            .then(function (versionsRef) {
                var promises = {};
                for (var i = 0; i < versionsRef.length; i++) {
                    promises[versionsRef[i]] = _apiVersionResource.get({version: versionsRef[i]}).$promise;
                }
                $q.all(promises)
                    .then(function (versions) {
                        _service.versions = versions;
                        _service.version = versions[_pathParams.version];
                        _service.niveau = versions[_pathParams.version]['endpoints'][_pathParams.niveau];
                        return versions;
                    })
                    .then(function () {
                        // La page est ré-incrémentée lors de l'appel de paging()
                        _pathParams.p -= 1;
                        _service.paging()
                            .then(
                                function() { deferred.resolve(_service); },
                                function(reason) { deferred.reject(reason); }
                        );
                    });
            });

        return deferred.promise;
    }]);



    app.factory('versionsService', ['$resource', function ($resource) {
        return $resource('/versions');
    }]);

}());
