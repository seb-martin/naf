'use strict';

/* jasmine specs for services go here */


describe('karma jasmine install', function () {
    it('karma devrait être exécuté et le test jasmine passer', function(){
        expect(true).toBe(true);
    });
});

describe('services', function () {
    beforeEach(module('app'));
    describe('versionsService', function () {
        var $httpBackend;

        beforeEach(inject(function(_$httpBackend_){
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('/versions').respond(['naf2008', 'naf2003']);
        }));

        it('devrait retourner la liste des versions', inject(function(versionsService) {
            var versions = versionsService.query();

            $httpBackend.flush();

            expect(versions).toBeDefined();
            expect(versions.length).toEqual(2);
            expect(versions[0]).toEqual('naf2008');


        }))
    });



});
