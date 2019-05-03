function groundMouseMove(event){
  if(event.target === renderer.domElement){
    event.preventDefault();
    rollOverGround.visible = false;
    mouse.set(((event.clientX-controlBarWidth) / redactorContainer.offsetWidth) * 2 - 1, - ((event.clientY-headerHeight)/redactorContainer.offsetHeight) * 2 + 1 );
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(objects, true);
    if (intersects.length > 0) {
      var intersect = intersects[0];
      planes.forEach(function(item, i, arr) {
        if (intersect.object === item.children[0]){
          rollOverGround.visible = true;
          rollOverGround.position.copy(intersect.point).add(intersect.face.normal);
          rollOverGround.position.divideScalar(10).floor().multiplyScalar(10);
          rollOverGround.position.y -=1;
        }
      });
    }
    render();
  }
}

function groundMouseDown(event){
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
            rollOverGround.visible = true;
            var planeMaterial = new THREE.MeshBasicMaterial({color: 'gray', depthTest: true, side: THREE.DoubleSide});
            var planeMesh = new THREE.Mesh(rollOverGround.geometry, planeMaterial);
            planeMesh.position.copy(intersect.point).add(intersect.face.normal);
            planeMesh.position.divideScalar(10).floor().multiplyScalar(10);
            planeMesh.position.y -=1;
            planeMesh.rotateX(-Math.PI/2);
            scene.add(planeMesh);
          }
        });
        render();
      }
    }
  }
}
