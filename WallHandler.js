function Size(width, height, depth){
  this.width = width;
  this.height = height;
  this.depth = depth;
}

function Vector(x, z){
  this.x = x;
  this.z = z;
}

function Vector3(x, y, z){
  this.x = x;
  this.y = y;
  this.z = z;
}

function Wall(intersect, size, material){
  this.parent = intersect;
  this.originalWall = intersect.children[0];
  this.solidWall = null;
  this.windowedWall = null;
  this.material = material;
  this.sideGrid = null;

  this.width = size.width + size.depth;
  this.height = size.height;
  this.depth = size.depth;

  this.highlightWall = function(material){
    this.originalWall.children.forEach(function(item, i, arr){
      item.material = material;
    });
    if(this.windowedWall != null){
      this.windowedWall.material = material;
    }
  }

  // this.recoverMaterial = function(){
  //   this.originalWall.children.forEach(function(item, i, arr){
  //     item.material = this.material;
  //   });
  //   if(this.windowedWall != null){
  //     this.windowedWall.material = this.material;
  //   }
  // }

  this.createSolidGeometry = function(){
    this.originalWall.children.forEach(function(item, i, arr){
      item.updateMatrix();
    });
    var wallBSP = new ThreeBSP(this.originalWall.children[0]);
    var pileStart = new ThreeBSP(this.originalWall.children[1]);
    var pileFinish = new ThreeBSP(this.originalWall.children[2]);
    wallBSP = wallBSP.union(pileStart);
    wallBSP = wallBSP.union(pileFinish);

    this.solidWall = wallBSP;
  }

  this.createGrid = function(){
    var step = 10;
    var geometry = new THREE.Geometry();

    var width = Math.floor(this.width/step)*step;
    var height = Math.floor(this.height/step)*step;

    for (var i = -height/2; i <= height/2; i += step) {
      geometry.vertices.push(new THREE.Vector3( - width/2, 0, i));
      geometry.vertices.push(new THREE.Vector3(   width/2, 0, i));
    }

    for (var i = - width/2; i <= width/2; i += step) {
      geometry.vertices.push( new THREE.Vector3(i, 0, - height/2));
      geometry.vertices.push( new THREE.Vector3(i, 0,   height/2));
    }

    var distance = this.depth/2+1;

    var x1 = this.originalWall.children[0].position.x;
    var y1 = this.originalWall.children[0].position.z;
    var x2 = this.originalWall.children[1].position.x;
    var y2 = this.originalWall.children[1].position.z;

    var vec1 = new Vector(x1, y1);
    var vec2 = new Vector(x2, y2);

    var point1 = getSideGridPoint(vec1, vec2, distance);
    var point2 = getSideGridPoint(vec1, vec2, -distance);

    var material1 = new THREE.LineBasicMaterial({
      color: 0x000000,
      opacity: 0.5,
      transparent: true,
      side: THREE.FrontSide
    });
    var line1 = new THREE.LineSegments(geometry, material1);
    line1.position.copy(this.originalWall.children[0].position);
    line1.rotateX(-Math.PI/2);
    line1.position.x = point1.x;
    line1.position.z = point1.z;
    line1.rotation.z = this.originalWall.children[0].rotation.y;


    var material2 = new THREE.LineBasicMaterial({
      color: 0x000000,
      opacity: 0.5,
      transparent: true,
      side: THREE.BackSide
    });
    var line2 = new THREE.LineSegments(geometry, material2);
    line2.position.copy(this.originalWall.children[0].position);
    line2.rotateX(-Math.PI/2);
    line2.position.x = point2.x;
    line2.position.z = point2.z;
    line2.rotation.z = this.originalWall.children[0].rotation.y;

    var geometry = new THREE.PlaneBufferGeometry(width, height);
    geometry.rotateX(-Math.PI/2);
    var plane1 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xff0000, visible:false, side:THREE.DoubleSide}));
    line1.add(plane1);
    var plane2 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xff0000, visible:false, side:THREE.DoubleSide}));
    line2.add(plane2);

    var grid = new THREE.Group();
    grid.add(line1);
    grid.add(line2);

    this.parent.add(grid);
    this.sideGrid = grid;
    this.sideGrid.visible = false;
  }


  this.scaleHideWall = function(){
    this.parent.scale.y = 0.1;
    if (this.windowedWall != null){
      var highligtMaterial = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        shininess: 100,
        side: THREE.DoubleSide
      });
      this.originalWall.children.forEach(function(item, i, arr){
        item.material = highligtMaterial;
      });
      this.originalWall.visible = true;
      this.windowedWall.visible = false;
    }
  }

  this.scaleRecoverWall = function(){
    this.parent.scale.y = 1;
    if (this.windowedWall != null){
      this.originalWall.children.forEach(function(item, i, arr){
        item.material = this.material;
      });
      this.originalWall.visible = false;
      this.windowedWall.visible = true;
    }
  }

  this.isHiding = function(){
    if (this.parent.scale.y === 0.1)
      return true;
    return false;
  }

  this.addWindow = function(window){
    if(this.windowedWall === null){
      this.parent.add(window);
      this.windowedWall = window;
    } else {
      this.parent.remove(this.windowedWall);
      this.parent.add(window);
      this.windowedWall = window;
    }
    this.originalWall.visible = false;
  }

}

function getSideGridPoint(v1, v2, a){
  var v3 = new Vector((v2.x-v1.x),(v2.z-v1.z)); // известный катет
  var L = Math.sqrt(v3.x*v3.x + v3.z*v3.z); // длина катета
  v3.x = v3.x/L;
  v3.z = v3.z/L; // нормализовать
  // повернуть на 90 градусов
  var v = new Vector(v3.z, -v3.x);
  v.x *= a;
  v.z *= a;
  var result = new Vector(v1.x+v.x, v1.z+v.z);
  return result;
}

function getHead(intersect){
  var object = intersect;
  while(object.parent.type != "Scene"){
    object = object.parent;
  }
  return object;
}

function getObject(intersect){
  var object = intersect;
  if(object.parent.parent === null)
    return object;
  while(object.parent.parent.type != "Scene"){
    object = object.parent;
  }
  return object;
}

function getBoxMaterial(){
  // var materialArray = [];
  // materialArray.push( new THREE.MeshBasicMaterial({color: 0xfeb74c, side: THREE.DoubleSide}));
  // materialArray.push( new THREE.MeshBasicMaterial({color: 0xfeb74c, side: THREE.DoubleSide}));
  // materialArray.push( new THREE.MeshBasicMaterial({color: 0x5E5E5E, side: THREE.DoubleSide}));
  // materialArray.push( new THREE.MeshBasicMaterial({color: 0x5E5E5E, side: THREE.DoubleSide}));
  // materialArray.push( new THREE.MeshBasicMaterial({color: 0xfeb74c, side: THREE.DoubleSide}));
  // materialArray.push( new THREE.MeshBasicMaterial({color: 0xfeb74c, side: THREE.DoubleSide}));
  // return new THREE.MultiMaterial(materialArray);
  // var wall_texture = new THREE.Texture();
  // var loader = new THREE.ImageLoader();

  // loader.load("textures/Brick_1.jpg", function(image){
  //   wall_texture.image = image;
  //   wall_texture.needsUpdate = true;
  // });

  // return new THREE.MeshBasicMaterial({map:wall_texture, overdraw: true});
  return new THREE.MeshPhongMaterial({color: 0x00ff00, shininess: 100, side: THREE.DoubleSide})
}

function addWallOnScene(intersect){
  addBreakPoint(intersect, rollOverPrimitive, getBoxMaterial());
  scene.remove(rollOverWall);
  var wallMaterial = getBoxMaterial();

  var wallWrapper = new THREE.Group();
  var wall = new THREE.Group();
  var wallMesh = buildWall(breakPoints[0], breakPoints[1], wallMaterial);
  wall.add(wallMesh);
  var wallSize = calcWallSize(breakPoints[0], breakPoints[1]);


  breakPoints.forEach(function(item, i, arr) {
    var pile = new THREE.Mesh(item.geometry, wallMaterial);
    pile.position.set(item.position.x, item.position.y, item.position.z);
    pile.geometry.name = "Wall Pile";
    wall.add(pile);
    scene.remove(item);
  });

  wallWrapper.add(wall);
  scene.add(wallWrapper);
  objects.push(wallWrapper);

  var wallObj = new Wall(wallWrapper, wallSize, wallMaterial);
  wallObj.createGrid();
  wallObj.createSolidGeometry();

  walls.push(wallObj);
  breakPoints.splice(0,breakPoints.length-1);
}

function modifyPosition(object, intersect){
  object.position.copy(intersect.point).add(intersect.face.normal);
  object.position.divideScalar(10).floor().multiplyScalar(10).addScalar(5);
  object.position.y += (object.geometry.parameters.height/2)-5;
}

function addBreakPoint(intersect, rollOverObject, material){
  var breakPoint = new THREE.Mesh(rollOverObject.geometry, material);
  modifyPosition(breakPoint, intersect);
  breakPoints.push(breakPoint);
  scene.add(breakPoint);
}

function calcWallSize(start, finish){
  var wallWidth = Math.sqrt(((start.position.x - finish.position.x)*(start.position.x - finish.position.x))
 + ((start.position.z - finish.position.z)*(start.position.z - finish.position.z)));
  var wallHeight = parseInt(start.geometry.parameters.height);
  var wallDepth = parseInt(start.geometry.parameters.depth);

  return new Size(wallWidth, wallHeight, wallDepth);
}

function buildWall(start, finish, material){
  var wallSize = calcWallSize(start, finish);

  var wallGeometry = new THREE.BoxGeometry(wallSize.width, wallSize.height, wallSize.depth);
  var wall = new THREE.Mesh(wallGeometry, material);

  var meshPositionX = (start.position.x + finish.position.x)/2;
  var meshPositionY = (start.position.y + finish.position.y)/2;
  var meshPositionZ = (start.position.z + finish.position.z)/2;

  wall.position.set(meshPositionX, meshPositionY, meshPositionZ);
  wall.rotation.y = -Math.atan2(finish.position.z - start.position.z, finish.position.x - start.position.x);
  wall.updateMatrix();

  return wall;
}

function wallMouseMove(event){
  if(event.target === renderer.domElement){
    event.preventDefault();
    rollOverPrimitive.visible = false;
    mouse.set(((event.clientX-controlBarWidth) / redactorContainer.offsetWidth) * 2 - 1, - ((event.clientY-headerHeight)/redactorContainer.offsetHeight) * 2 + 1 );
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(objects, true);
    if (intersects.length > 0) {
      var intersect = intersects[0];
      planes.forEach(function(item, i, arr) {
        if (intersect.object === item.children[0]){
          rollOverPrimitive.visible = true;
          modifyPosition(rollOverPrimitive, intersect);
          if (isShiftDown && breakPoints.length === 1){
            scene.remove(rollOverWall);
            var wallMaterial = new THREE.MeshBasicMaterial({color: 0x009900, opacity: 0.5, transparent: true});
            rollOverWall = buildWall(breakPoints[0], rollOverPrimitive, wallMaterial);
            scene.add(rollOverWall);
          }
        }
      });
    }
    render();
  }
}

function wallMouseDown(event){
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
            if (isShiftDown && breakPoints.length < 1){
              var rollOverMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00, opacity: 0.5, transparent: true});
              addBreakPoint(intersect, rollOverPrimitive, rollOverMaterial);
            } else if (isShiftDown && breakPoints.length === 1){
              addWallOnScene(intersect);
            } else {
              var pileGroup = new THREE.Group();
              var pileSize = new Size(rollOverPrimitive.geometry.parameters.width, rollOverPrimitive.geometry.parameters.height, rollOverPrimitive.geometry.parameters.depth);
              var pile = new THREE.Mesh(new THREE.BoxGeometry(pileSize.width, pileSize.height, pileSize.depth), getBoxMaterial());
              modifyPosition(pile, intersect);
              pile.name = "Pile";
              pileGroup.add(pile);
              objects.push(pileGroup);
              scene.add(pileGroup);
              var pileObj = new Wall(pileGroup, pileSize, getBoxMaterial());
              walls.push(pileObj);
            }
          }
      });
      var head = getHead(intersect.object);
      walls.forEach(function(item, i, arr) {
        item.highlightWall(item.material);
        if (item.parent === head){
          selectedObject = item;
          var highlightMaterial = new THREE.MeshPhongMaterial({color: 0x0000ff, shininess: 100, side: THREE.DoubleSide});
          item.highlightWall(highlightMaterial);
          $("#current_width").text(item.width);
          $("#current_height").text(item.height);
          $("#current_depth").text(item.depth);
          $("#delete_element").click(function(){
            scene.remove(selectedObject.parent);
            render();
          });
          $("#restore_element").click(function(){
            selectedObject.parent.remove(selectedObject.windowedWall);
            scene.remove(selectedObject.windowedWall);
            selectedObject.windowedWall = null;
            selectedObject.originalWall.visible = true;
            selectedObject.createSolidGeometry();
            render();
          });
        }
      });
      render();
      }
    }
  }
}
