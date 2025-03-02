import angular from 'angular';
import 'angular-route';
import './styles.css';
import { categories, categoryImages, defaultBackgrounds, frames, landscapeSizes, portraitSizes, squareSizes } from './data.js';
import { MainController } from './controllers/MainController.js';

// Create the AngularJS application
angular.module('artCustomizationApp', ['ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'src/templates/main.html',
        controller: 'MainController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .controller('MainController', MainController)
  .directive('imageCrop', function() {
    return {
      restrict: 'E',
      templateUrl: 'src/templates/image-crop.html',
      scope: {
        mainImage: '=',
        originalImage: '=',
        selectedSize: '=',
        orientation: '=',
        onApplyCrop: '&',
        onCancelCrop: '&'
      },
      link: function(scope, element) {
        scope.scale = 1;
        scope.rotate = 0;
        scope.flipHorizontal = false;
        scope.flipVertical = false;
        scope.position = { x: 0, y: 0 };
        scope.isDragging = false;
        scope.dragStart = { x: 0, y: 0 };
        scope.isExternalImage = false;
        
        // Check if image is external
        scope.$watch('mainImage', function(newValue) {
          if (newValue && newValue.startsWith('http') && !newValue.startsWith(window.location.origin)) {
            scope.isExternalImage = true;
          } else {
            scope.isExternalImage = false;
          }
        });
        
        // Mouse events for dragging
        scope.handleMouseDown = function(e) {
          scope.isDragging = true;
          scope.dragStart = {
            x: e.clientX - scope.position.x,
            y: e.clientY - scope.position.y
          };
        };
        
        scope.handleMouseMove = function(e) {
          if (scope.isDragging) {
            scope.position.x = e.clientX - scope.dragStart.x;
            scope.position.y = e.clientY - scope.dragStart.y;
            scope.$apply();
          }
        };
        
        scope.handleMouseUp = function() {
          scope.isDragging = false;
        };
        
        // Touch events for mobile
        scope.handleTouchStart = function(e) {
          if (e.touches.length === 1) {
            scope.isDragging = true;
            scope.dragStart = {
              x: e.touches[0].clientX - scope.position.x,
              y: e.touches[0].clientY - scope.position.y
            };
          }
        };
        
        scope.handleTouchMove = function(e) {
          if (scope.isDragging && e.touches.length === 1) {
            scope.position.x = e.touches[0].clientX - scope.dragStart.x;
            scope.position.y = e.touches[0].clientY - scope.dragStart.y;
            scope.$apply();
          }
        };
        
        scope.handleTouchEnd = function() {
          scope.isDragging = false;
        };
        
        // Add event listeners
        const cropContainer = element[0].querySelector('.crop-container');
        if (cropContainer) {
          cropContainer.addEventListener('mousedown', scope.handleMouseDown);
          cropContainer.addEventListener('mousemove', scope.handleMouseMove);
          cropContainer.addEventListener('mouseup', scope.handleMouseUp);
          cropContainer.addEventListener('mouseleave', scope.handleMouseUp);
          cropContainer.addEventListener('touchstart', scope.handleTouchStart);
          cropContainer.addEventListener('touchmove', scope.handleTouchMove);
          cropContainer.addEventListener('touchend', scope.handleTouchEnd);
        }
        
        // Clean up event listeners when directive is destroyed
        scope.$on('$destroy', function() {
          if (cropContainer) {
            cropContainer.removeEventListener('mousedown', scope.handleMouseDown);
            cropContainer.removeEventListener('mousemove', scope.handleMouseMove);
            cropContainer.removeEventListener('mouseup', scope.handleMouseUp);
            cropContainer.removeEventListener('mouseleave', scope.handleMouseUp);
            cropContainer.removeEventListener('touchstart', scope.handleTouchStart);
            cropContainer.removeEventListener('touchmove', scope.handleTouchMove);
            cropContainer.removeEventListener('touchend', scope.handleTouchEnd);
          }
        });
      }
    };
  })
  .directive('categoryPage', function() {
    return {
      restrict: 'E',
      templateUrl: 'src/templates/category-page.html',
      scope: {
        category: '=',
        images: '=',
        onClose: '&',
        onSelectImage: '&'
      }
    };
  });