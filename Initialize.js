function initRollOverWall(size){
  scene.remove(rollOverPrimitive);
  var rollOverGeo = new THREE.BoxGeometry(size.width, size.height, size.depth);
  var rollOverMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    opacity: 0.5,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  rollOverPrimitive = new THREE.Mesh(rollOverGeo, rollOverMaterial);
  rollOverPrimitive.position.y = rollOverPrimitive.geometry.parameters.height/2;
  rollOverPrimitive.visible = false;
  scene.add(rollOverPrimitive);
}

function initRollOverWindow(size){
  scene.remove(rollOverCube);
  var rollOverGeo = new THREE.BoxGeometry(size.width, size.height, size.depth);
  var rollOverMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    opacity: 0.5,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  rollOverCube = new THREE.Mesh(rollOverGeo, rollOverMaterial);
  rollOverCube.visible = false;
  scene.add(rollOverCube);
}

function initRollOverPlane(width, height){
  scene.remove(rollOverGround);
  var rollOverGeo = new THREE.PlaneGeometry(width, height);
  var rollOverMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    opacity: 0.5,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  rollOverGround = new THREE.Mesh(rollOverGeo, rollOverMaterial);
  rollOverGround.position.y = rollOverPrimitive.geometry.parameters.height/2;
  rollOverGround.visible = false;
  rollOverGround.rotateX(-Math.PI/2);
  scene.add(rollOverGround);
}


function initRollOverCamera(){
  var rollOverGeo = new THREE.SphereGeometry(5, 32, 32);
  var rollOverMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    opacity: 0.5,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  rollOverCamera = new THREE.Mesh(rollOverGeo, rollOverMaterial);
  rollOverCamera.position.y = rollOverPrimitive.geometry.parameters.height/2;
  rollOverCamera.visible = false;
  scene.add(rollOverCamera);
}

function init(){
  var Header = document.getElementById("header");
  var ControlBar = document.getElementById("redactor-controls");
  headerHeight = Header.offsetHeight;
  controlBarWidth = ControlBar.offsetWidth;

  document.getElementById("wall-depth").value = 10;
  document.getElementById("wall-height").value = 200;
  document.getElementById("window-width").value = 50;
  document.getElementById("window-height").value = 50;
  document.getElementById("ground-width").value = 200;
  document.getElementById("ground-height").value = 200;

  var CameraMode = document.getElementById("camera_mode");
  var WallMode = document.getElementById("wall_mode");
  var WindowMode = document.getElementById("window_mode");
  var GroundMode = document.getElementById("ground_mode");
  var ScaleChange = document.getElementById("scale_change");
  var AddFloor = document.getElementById("add_floor");
  redactorContainer = document.getElementById('workspace');

  scene = new THREE.Scene();
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  var sizeWall = new Size(10, 200, 10);
  initRollOverWall(sizeWall);

  var initSizeWindow = new Size(100, 100, 10);
  initRollOverWindow(initSizeWindow);

  initRollOverCamera();

  initRollOverPlane(100, 100);
  camera = new THREE.PerspectiveCamera(65, redactorContainer.offsetWidth/redactorContainer.offsetHeight, 0.1, 4000);

  camera.position.y = 600;


  controls = new THREE.OrbitControls(camera, redactorContainer);
  controls.noPan = true;
  controls.minDistance = 10;
  controls.maxPolarAngle = 1.5;
  controls.maxDistance = 2000;

  var targetGeo = new THREE.SphereGeometry(5, 32, 32);
  var targetMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});
  targetMesh = new THREE.Mesh(targetGeo, targetMaterial);
  targetMesh.position.x = controls.target.x;
  targetMesh.position.y = controls.target.y;
  targetMesh.position.z = controls.target.z;
  targetMesh.visible = false;
  scene.add(targetMesh);
  //invisible ground
  var groupGroud = new THREE.Group();
  var geometry = new THREE.PlaneBufferGeometry(2000, 2000);
  geometry.rotateX(-Math.PI/2);
  var plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({visible: false}));

  objects.push(plane);
  groupGroud.add(plane);

  // grid
  var size = 2000;
  var divisions = size/10;
  var gridHelper = new THREE.GridHelper(size, divisions, 0x888888, 0x888888);
  groupGroud.add(gridHelper);
  planes.push(groupGroud);
  scene.add(groupGroud);

  var floorList = document.getElementById("floor_list");

  planes.forEach(function(item, i, arr) {
    var floor_element = document.createElement("div");
    $(floor_element).addClass("floor_element");
    $(floor_element).attr('id',"floor_element_"+(i));

    var floor_title = document.createElement("div");
    $(floor_title).addClass("floor_title");
    var span_title = document.createElement("span");
    $(span_title).addClass("active");
    $(span_title).attr('id',"floor_title_"+(i));
    $(span_title).text("Этаж "+(i+1));
    var eye_icon = document.createElement("i");
    $(eye_icon).addClass("fa fa-eye");
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
  });

  // lights
  scene.add( new THREE.AmbientLight(0x505050));
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.angle = Math.PI / 5;
  spotLight.penumbra = 0.2;
  spotLight.position.set(2, 3, 3);
  spotLight.castShadow = true;
  spotLight.shadow.camera.near = 3;
  spotLight.shadow.camera.far = 10;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  scene.add(spotLight);
  var dirLight = new THREE.DirectionalLight(0x55505a, 1);
  dirLight.position.set(0, 3, 0);
  dirLight.castShadow = true;
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 10;
  dirLight.shadow.camera.right = 1;
  dirLight.shadow.camera.left = - 1;
  dirLight.shadow.camera.top  = 1;
  dirLight.shadow.camera.bottom = - 1;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  scene.add(dirLight);

  //renderer
  renderer = new THREE.WebGLRenderer({antialias: true });
  renderer.setClearColor(0xf0f0f0, 1);
  renderer.setSize(redactorContainer.offsetWidth, redactorContainer.offsetHeight);
  renderer.domElement.style.width = "100%";
  redactorContainer.appendChild(renderer.domElement);

  controls.addEventListener('change', render);
  CameraMode.addEventListener('click', enterCameraMode);
  WallMode.addEventListener('click', enterWallMode);
  WindowMode.addEventListener('click', enterWindowMode);
  GroundMode.addEventListener('click', enterGroundMode);
  ScaleChange.addEventListener('click', changeScale);
  AddFloor.addEventListener('click', addFloor);
  document.addEventListener('keydown', onDocumentKeyDown, false );
  document.addEventListener('keyup', onDocumentKeyUp, false );
  window.addEventListener('resize', onWindowResize, false);
}

function animate(){
  requestAnimationFrame(animate);
  controls.update();
}

function render(){
  renderer.render(scene, camera);
}
