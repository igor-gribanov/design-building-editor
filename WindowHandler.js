function getRightTop(plane, rollOver){
  var itemX = plane.position.x;
  var itemY = plane.position.y;
  var itemZ = plane.position.z;
  var angle = -plane.rotation.z;
  var planeWidth = plane.children[0].geometry.parameters.width;
  var planeHeight = plane.children[0].geometry.parameters.height;
  var distanseWidth = planeWidth/2 - rollOver.geometry.parameters.width/2;
  itemX = itemX+(distanseWidth*Math.cos(angle));
  itemZ = itemZ+(distanseWidth*Math.sin(angle));
  itemY = itemY+planeHeight/2-rollOver.geometry.parameters.height/2;

  return new Vector3(itemX, itemY, itemZ);
}

function getLineGroup(intersect){
  var object = intersect;
  if(object.parent.parent.parent === null)
    return object;
  while(object.parent.parent.parent.type != "Scene"){
    object = object.parent;
  }
  return object;
}

function getNewPoint(vector1, vector2){
  var angle = Math.atan2(vector2.z - vector1.z, vector2.x - vector1.x);
  return new Vector(vector1.x+(10*Math.cos(angle)), vector1.z+(10*Math.sin(angle)));
}

function getAngleBetween(vector1, vector2){
  return Math.atan2(vector2.z - vector1.z, vector2.x - vector1.x) * 180 / Math.PI;
}

function getDistance(vector1, vector2){
    return Math.sqrt(((vector2.x - vector1.x)*(vector2.x - vector1.x)) + ((vector2.z - vector1.z)*(vector2.z - vector1.z)));
}

function windowMouseMove(event){
  if(event.target === renderer.domElement){
    event.preventDefault();
    rollOverCube.visible = false;
    mouse.set(((event.clientX-controlBarWidth) / redactorContainer.offsetWidth) * 2 - 1, - ((event.clientY-headerHeight) / redactorContainer.offsetHeight) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(objects, true);
    if (intersects.length > 0) {
      var intersect = intersects[0];
      var head = getObject(intersect.object);
      walls.forEach(function(item, i, arr) {
        if (item.sideGrid === head){
          var group = getLineGroup(intersect.object);
          if (rollOveredWall != group){
            var startPos = getRightTop(group, rollOverCube);

            // var x0 = startPos.x;
            // var z0 = startPos.z;
            // var x1 = item.originalWall.children[1].position.x;
            // var z1 = item.originalWall.children[1].position.z;
            // var x2 = item.originalWall.children[2].position.x;
            // var z2 = item.originalWall.children[2].position.z;
            // var l12 = item.width;
            // var dx = (x2-x1)/l12;
            // var dz = (z2-z1)/l12;
            // var l1 = (x0-x1)*dx+(z0-z1)*dz;

            // startPos.x = x1+l1*dx;
            // startPos.z = z1+l1*dz

            rollOverCube.position.x = startPos.x;
            rollOverCube.position.y = startPos.y;
            rollOverCube.position.z = startPos.z;
            rollOveredWall = group;
          }

          rollOverCube.visible = true;

          rollOverCube.position.y = intersect.point.y;
          console.log(rollOverCube.geometry.parameters.height % 20);
          if (rollOverCube.geometry.parameters.height){
            rollOverCube.position.y = (Math.floor(rollOverCube.position.y/10)*10)+5;
          } else{
            rollOverCube.position.y = Math.floor(rollOverCube.position.y/10)*10;
          }


          var vec1 = new Vector(intersect.point.x, intersect.point.z);
          var vec2 = new Vector(rollOverCube.position.x, rollOverCube.position.z);

          while (getDistance(vec1, vec2) >= 10){
            var point = getNewPoint(vec2, vec1);
            // console.log(getDistance(vec2, point));

            rollOverCube.position.x = point.x;
            rollOverCube.position.z = point.z;
            vec2.x = rollOverCube.position.x;
            vec2.z = rollOverCube.position.z;
          }

          rollOverCube.rotation.y = item.originalWall.children[0].rotation.y;
        }
      });

    }
    render();
  }
}

function windowMouseDown(event){
  if(event.target === renderer.domElement){
    event.preventDefault();
    mouse.set(((event.clientX-controlBarWidth) / redactorContainer.offsetWidth) * 2 - 1, - ((event.clientY-headerHeight) / redactorContainer.offsetHeight) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    if (event.button === 0) {
      var intersects = raycaster.intersectObjects(objects, true);
      if (intersects.length > 0) {
        var intersect = intersects[0];
        var head = getObject(intersect.object);
        walls.forEach(function(item, i, arr) {
          if (item.sideGrid === head){
            rollOveredWall = null;
            rollOverCube.visible = false;

            var x0 = rollOverCube.position.x;
            var z0 = rollOverCube.position.z;
            var x1 = item.originalWall.children[1].position.x;
            var z1 = item.originalWall.children[1].position.z;
            var x2 = item.originalWall.children[2].position.x;
            var z2 = item.originalWall.children[2].position.z;
            var l12 = Math.sqrt(((x2 - x1)*(x2 - x1)) + ((z2 - z1)*(z2 - z1)));
            var dx = (x2-x1)/l12;
            var dz = (z2-z1)/l12;
            var l1 = (x0-x1)*dx+(z0-z1)*dz;


            var windowGeometry = new THREE.BoxGeometry(rollOverCube.geometry.parameters.width, rollOverCube.geometry.parameters.height, item.depth*2);
            var windowMesh = new THREE.Mesh(windowGeometry, item.material);
            windowMesh.position.x = x1+l1*dx;
            windowMesh.position.y = rollOverCube.position.y;
            windowMesh.position.z = z1+l1*dz;
            windowMesh.rotation.y = rollOverCube.rotation.y;
            var windowCSG =  new ThreeBSP(windowMesh);

            var subtractBSP = item.solidWall.subtract(windowCSG);
            var windowedWallMesh = subtractBSP.toMesh(item.material);
            item.solidWall = subtractBSP;
            item.addWindow(windowedWallMesh);
          }
        });
      }
    }
    render();
  }
}
