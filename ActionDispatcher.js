function onWindowResize() {
  camera.aspect = redactorContainer.offsetWidth / redactorContainer.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(redactorContainer.offsetWidth, redactorContainer.offsetHeight);
  renderer.domElement.style.width = "100%";
  render();
}

function addFloor(){
  var floorList = document.getElementById("floor_list");
  var position_y = document.getElementById("floor_position").value;

  var groupGroud = new THREE.Group();
  var geometry = new THREE.PlaneBufferGeometry(2000, 2000);
  geometry.rotateX(-Math.PI/2);
  var plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({visible: false}));

  objects.push(plane);
  groupGroud.add(plane);

  var size = 2000;
  var divisions = size/10;
  var gridHelper = new THREE.GridHelper(size, divisions, 0x888888, 0x888888);
  groupGroud.add(gridHelper);
  groupGroud.position.y = parseInt(position_y);
  planes.push(groupGroud);
  scene.add(groupGroud);

  $(floorList).empty();
  planes.forEach(function(item, i, arr) {
    item.visible = false;
    var floor_element = document.createElement("div");
    $(floor_element).addClass("floor_element");
    $(floor_element).attr('id',"floor_element_"+(i));

    var floor_title = document.createElement("div");
    $(floor_title).addClass("floor_title");
    var span_title = document.createElement("span");
    $(span_title).attr('id',"floor_title_"+(i));
    $(span_title).text("Этаж "+(i+1));
    var eye_icon = document.createElement("i");
    $(eye_icon).addClass("fa fa-eye disable");
    $(eye_icon).attr('aria-hidden',"true");
    floor_title.appendChild(span_title);
    floor_title.appendChild(eye_icon);

    var trash_div = document.createElement("div");
    var trash_icon = document.createElement("i");
    $(trash_icon).addClass("fa fa-trash-o");
    $(trash_icon).attr('aria-hidden',"true");
    trash_div.appendChild(trash_icon);

    floor_element.appendChild(floor_title);
    floor_element.appendChild(trash_div);

    floorList.appendChild(floor_element);

    if(i === planes.length-1){
      item.visible = true;
      $(span_title).addClass("active");
      $(eye_icon).removeClass("disable");
    }

    $(floor_title).click(function(){
      if (!($("#floor_title_"+i).hasClass("active"))){
        var index = i;
        planes.forEach(function(item, i, arr){
          item.visible = false;
          objects[objects.indexOf(item.children[0])].visible = false;
          $("#floor_title_"+i).removeClass("active");
          $("#floor_title_"+i).next().addClass("disable");
        });

        planes[index].visible = true;
        controls.target.x = 0;
        controls.target.y = planes[index].position.y;
        controls.target.z = 0;
        camera.position.y += -planes[currentFloor].position.y + planes[index].position.y;
        currentFloor = index;
        objects[objects.indexOf(planes[index].children[0])].visible = true;
        $("#floor_title_"+index).addClass("active");
        $("#floor_title_"+index).next().removeClass("disable");
      }
      console.log(planes);
      render();
    });
  });
  render();
}

function enterCameraMode(){
  targetMesh.visible = true;
  document.addEventListener('mousemove', cameraMouseMove, false);
  document.addEventListener('mousedown', cameraMouseDown, false);
  render();
}

function exitCameraMode(){
  targetMesh.visible = false;
  rollOverCamera.visible = false;
  document.removeEventListener('mousemove', cameraMouseMove, false);
  document.removeEventListener('mousedown', cameraMouseDown, false);
  render();
}

//plane.visible = true;

function enterWallMode(){
  var wallDepth = document.getElementById("wall-depth").value;
  var wallHeight = document.getElementById("wall-height").value;

  var sizeWall = new Size(wallDepth, wallHeight, wallDepth);
  initRollOverWall(sizeWall);

  document.addEventListener('mousemove', wallMouseMove, false);
  document.addEventListener('mousedown', wallMouseDown, false);
  exitWindowMode();
}

function exitWallMode(){
  rollOverPrimitive.visible = false;
  walls.forEach(function(item, i, arr) {
    item.highlightWall(item.material);
  });
  document.removeEventListener('mousemove', wallMouseMove, false);
  document.removeEventListener('mousedown', wallMouseDown, false);
  render();
}

function enterWindowMode(){
  rollOveredWall = null;

  var windowWidth = document.getElementById("window-width").value;
  var windowHeight = document.getElementById("window-height").value;

  var sizeWindow = new Size(windowWidth, windowHeight, 10);
  initRollOverWindow(sizeWindow);

  document.addEventListener('mousemove', windowMouseMove, false);
  document.addEventListener('mousedown', windowMouseDown, false);
  walls.forEach(function(item, i, arr) {
    if(item.sideGrid != null){
      item.sideGrid.visible = true;
    }
  });
  render();
}

function exitWindowMode(){
  rollOveredWall = null;
  rollOverCube.visible = false;
  document.removeEventListener('mousemove', windowMouseMove, false);
  document.removeEventListener('mousedown', windowMouseDown, false);
  walls.forEach(function(item, i, arr) {
    if(item.sideGrid != null){
      item.sideGrid.visible = false;
    }
  });
  render();
}

function enterGroundMode(){
  var groundWidth = document.getElementById("ground-width").value;
  var groundHeight = document.getElementById("ground-height").value;

  initRollOverPlane(groundWidth, groundHeight);

  document.addEventListener('mousemove', groundMouseMove, false);
  document.addEventListener('mousedown', groundMouseDown, false);
  render();
}
function exitGroundMode(){
  rollOverGround.visible = false;

  document.removeEventListener('mousemove', groundMouseMove, false);
  document.removeEventListener('mousedown', groundMouseDown, false);
  render();
}

function changeScale(){
  if (isShowing){
	  walls.forEach(function(item, i, arr) {
	    item.scaleHideWall();
	  });
	  isShowing = false;
	  scale_change.value = "Показать стены";
	  render();
  } else {
	  walls.forEach(function(item, i, arr) {
	    item.scaleRecoverWall();
	  });
	  isShowing = true;
	  scale_change.value = "Спрятать стены";
	  render();
  }
}

function modifyScale(intersect){
  var head = getHead(intersect.object);
  walls.forEach(function(item, i, arr) {
    if (item.parent === head){
      if (item.isHiding()){
        item.scaleRecoverWall();
      } else {
        item.scaleHideWall();
      }
    }
  });
}

function onDocumentKeyDown(event) {
  switch (event.keyCode){
    case 16:isShiftDown = true; break;
    case 27:{
    	exitWallMode();
    	exitWindowMode();
      exitCameraMode();
      exitGroundMode();
    }break;
  }
}

function onDocumentKeyUp(event) {
  switch (event.keyCode){
    case 16: {
      isShiftDown = false;
      breakPoints.forEach(function(item, i, arr) {
        scene.remove(item);
      });
      breakPoints.splice(0,breakPoints.length);
      scene.remove(rollOverWall);
      render();
    }break;
  }
}
