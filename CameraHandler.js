function cameraMouseMove(event){
  if(event.target === renderer.domElement){
    event.preventDefault();
    rollOverCamera.visible = false;
    mouse.set(((event.clientX-controlBarWidth) / redactorContainer.offsetWidth) * 2 - 1, - ((event.clientY-headerHeight)/redactorContainer.offsetHeight) * 2 + 1 );
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(objects, true);
    if (intersects.length > 0) {
      var intersect = intersects[0];
      planes.forEach(function(item, i, arr) {
        if (intersect.object === item.children[0]){
          rollOverCamera.visible = true;
          rollOverCamera.position.x = intersect.point.x;
          rollOverCamera.position.y = intersect.point.y;
          rollOverCamera.position.z = intersect.point.z;
        }
      });
    }
    render();
  }
}

function cameraMouseDown(event){
  if(event.target === renderer.domElement){
    event.preventDefault();
    mouse.set(((event.clientX-controlBarWidth) / redactorContainer.offsetWidth) * 2 - 1, - ((event.clientY-headerHeight) / redactorContainer.offsetHeight) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    if (event.button === 0) {
      var intersects = raycaster.intersectObjects(objects, true);
      if (intersects.length > 0) {
        var intersect = intersects[0];
        planes.forEach(function(item, i, arr) {
          if (intersect.object === item.children[0]){
            targetMesh.visible = true;
            targetMesh.position.x = intersect.point.x;
            targetMesh.position.y = intersect.point.y;
            targetMesh.position.z = intersect.point.z;
            controls.target.x = intersect.point.x;
            controls.target.y = intersect.point.y;
            controls.target.z = intersect.point.z;
          }
        });
        render();
      }
    }
  }
}
