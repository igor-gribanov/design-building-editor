var assert = require('assert');

function Vector(x, z){
  this.x = x;
  this.z = z;
}

function getDistanceMutant(vector1, vector2){
    return Math.sqrt(((vector2.x - vector1.x)/(vector2.x - vector1.x))
      + ((vector2.z - vector1.z)*(vector2.z - vector1.z)));
}

function getNewPointMutant(vector1, vector2){
  var angle = Math.atan2(vector2.z - vector1.z, vector2.x - vector1.x);
  return new Vector(vector1.x+(10*Math.sin(angle)), vector1.z+(10*Math.sin(angle)));
}

function getAngleBetweenMutant(vector1, vector2){
  return Math.atan2(vector2.z - vector1.z, vector2.x - vector1.x) / 180 * Math.PI;
}

function getDistance(vector1, vector2){
    return Math.sqrt(((vector2.x - vector1.x)*(vector2.x - vector1.x)) + ((vector2.z - vector1.z)*(vector2.z - vector1.z)));
}

function getNewPoint(vector1, vector2){
  var angle = Math.atan2(vector2.z - vector1.z, vector2.x - vector1.x);
  return new Vector(vector1.x+(10*Math.cos(angle)), vector1.z+(10*Math.sin(angle)));
}

function getAngleBetween(vector1, vector2){
  return Math.atan2(vector2.z - vector1.z, vector2.x - vector1.x) * 180 / Math.PI;
}

describe('Geometry based function test', function() {

  describe('getDistance', function() {
    describe('the function must return expected distance between points', function() {
      it('expected distance between (0, 0) and (0, 5) is 5', function() {
        var startVector = new Vector(0,0);
        var finishVector = new Vector(0,5);
        assert.equal(5, getDistance(startVector, finishVector));
      });
      it('expected distance between (0, 0) and (10, 0) is 10', function() {
        var startVector = new Vector(0,0);
        var finishVector = new Vector(10,0);
        assert.equal(10, getDistance(startVector, finishVector));
      });
    });
  });

  describe('getNewPoint', function() {
    describe('distance between old point and new point must be equal 10', function() {
      it('old point (10, 10) modified by intersected point (23, 18)', function() {
        var oldPoint = new Vector(10, 10);
        var intersectPoint = new Vector(23, 18);
        var newPoint = getNewPoint(oldPoint, intersectPoint);
        assert.equal(10, Math.floor(getDistance(oldPoint, newPoint)));
      });
      it('old point (3, 19) modified by intersected point (23, 100)', function() {
        var oldPoint = new Vector(3, 19);
        var intersectPoint = new Vector(23, 100);
        var newPoint = getNewPoint(oldPoint, intersectPoint);
        assert.equal(10, Math.floor(getDistance(oldPoint, newPoint)));
      });
    });
  });

  describe('getAngleBetween', function() {
    describe('should return expected angle in degrees', function() {
      it('expected angle between (0, 0) and (0, 5) is 90 degrees', function() {
        var startVector = new Vector(0, 0);
        var finishVector = new Vector(0, 5);
        assert.equal(90, getAngleBetween(startVector, finishVector));
      });
      it('expected angle between (0, 0) and (5, 5) is 45 degrees', function() {
        var startVector = new Vector(0, 0);
        var finishVector = new Vector(5, 5);
        assert.equal(45, getAngleBetween(startVector, finishVector));
      });
      it('expected angle between (0, 0) and (5, 0) is 0 degrees', function() {
        var startVector = new Vector(0, 0);
        var finishVector = new Vector(5, 0);
        assert.equal(0, getAngleBetween(startVector, finishVector));
      });
    });
  });

});

describe('Mutation testing', function() {

  describe('getDistanceMutant', function() {
    describe('the function must return expected distance between points', function() {
      it('expected distance between (0, 0) and (0, 5) is 5', function() {
        var startVector = new Vector(0,0);
        var finishVector = new Vector(0,5);
        assert.equal(5, getDistanceMutant(startVector, finishVector));
      });
      it('expected distance between (0, 0) and (10, 0) is 10', function() {
        var startVector = new Vector(0,0);
        var finishVector = new Vector(10,0);
        assert.equal(10, getDistanceMutant(startVector, finishVector));
      });
    });
  });

  describe('getNewPointMutant', function() {
    describe('distance between old point and new point must be equal 10', function() {
      it('old point (10, 10) modified by intersected point (23, 18)', function() {
        var oldPoint = new Vector(10, 10);
        var intersectPoint = new Vector(23, 18);
        var newPoint = getNewPointMutant(oldPoint, intersectPoint);
        assert.equal(10, Math.floor(getDistance(oldPoint, newPoint)));
      });
      it('old point (3, 19) modified by intersected point (23, 100)', function() {
        var oldPoint = new Vector(3, 19);
        var intersectPoint = new Vector(23, 100);
        var newPoint = getNewPointMutant(oldPoint, intersectPoint);
        assert.equal(10, Math.floor(getDistance(oldPoint, newPoint)));
      });
    });
  });

  describe('getAngleBetweenMutant', function() {
    describe('should return expected angle in degrees', function() {
      it('expected angle between (0, 0) and (0, 5) is 90 degrees', function() {
        var startVector = new Vector(0, 0);
        var finishVector = new Vector(0, 5);
        assert.equal(90, getAngleBetweenMutant(startVector, finishVector));
      });
      it('expected angle between (0, 0) and (5, 5) is 45 degrees', function() {
        var startVector = new Vector(0, 0);
        var finishVector = new Vector(5, 5);
        assert.equal(45, getAngleBetweenMutant(startVector, finishVector));
      });
      it('expected angle between (0, 0) and (5, 0) is 0 degrees', function() {
        var startVector = new Vector(0, 0);
        var finishVector = new Vector(5, 0);
        assert.equal(0, getAngleBetweenMutant(startVector, finishVector));
      });
    });
  });

});
