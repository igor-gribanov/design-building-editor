function setupInterface(){

  $("#floor_title").click(function(){
    $("#floor_detail").slideToggle("slow");
    if($("#floor_title > .fa-caret-down").hasClass("disable")){
      $("#floor_title > .fa-caret-down").removeClass("disable");
      $("#floor_title > .fa-caret-up").addClass("disable");
    } else {
      $("#floor_title > .fa-caret-up").removeClass("disable");
      $("#floor_title > .fa-caret-down").addClass("disable");
    }
  });

  $("#camera_title").click(function(){
    $("#camera_detail").slideToggle("slow");
    if($("#camera_title > .fa-caret-down").hasClass("disable")){
      $("#camera_title > .fa-caret-down").removeClass("disable");
      $("#camera_title > .fa-caret-up").addClass("disable");
    } else {
      $("#camera_title > .fa-caret-up").removeClass("disable");
      $("#camera_title > .fa-caret-down").addClass("disable");
    }
  });

  $("#wall_title").click(function(){
    $("#wall_detail").slideToggle("slow");
    if($("#wall_title > .fa-caret-down").hasClass("disable")){
      $("#wall_title > .fa-caret-down").removeClass("disable");
      $("#wall_title > .fa-caret-up").addClass("disable");
    } else {
      $("#wall_title > .fa-caret-up").removeClass("disable");
      $("#wall_title > .fa-caret-down").addClass("disable");
    }
  });

  $("#window_title").click(function(){
    $("#window_detail").slideToggle("slow");
    if($("#window_title > .fa-caret-down").hasClass("disable")){
      $("#window_title > .fa-caret-down").removeClass("disable");
      $("#window_title > .fa-caret-up").addClass("disable");
    } else {
      $("#window_title > .fa-caret-up").removeClass("disable");
      $("#window_title > .fa-caret-down").addClass("disable");
    }
  });

  $("#ground_title").click(function(){
    $("#ground_detail").slideToggle("slow");
    if($("#ground_title > .fa-caret-down").hasClass("disable")){
      $("#ground_title > .fa-caret-down").removeClass("disable");
      $("#ground_title > .fa-caret-up").addClass("disable");
    } else {
      $("#ground_title > .fa-caret-up").removeClass("disable");
      $("#ground_title > .fa-caret-down").addClass("disable");
    }
  });

  $("#current_title").click(function(){
    $("#current_detail").slideToggle("slow");
    if($("#current_title > .fa-caret-down").hasClass("disable")){
      $("#current_title > .fa-caret-down").removeClass("disable");
      $("#current_title > .fa-caret-up").addClass("disable");
    } else {
      $("#current_title > .fa-caret-up").removeClass("disable");
      $("#current_title > .fa-caret-down").addClass("disable");
    }
  });

  $("#save_scene").click(function(){
    // console.log(scene);
    // var output = JSON.stringify(scene);
    // console.log(output);
    sceneLoad = scene;
    // localStorage.setItem("Scene", output);
    scene = new THREE.Scene();
    render();
  });

  $("#load_scene").click(function(){
    // console.log(JSON.parse(localStorage.getItem("Scene")));
    if(sceneLoad != null){
      scene = sceneLoad;
    }
    render();
  });
}

