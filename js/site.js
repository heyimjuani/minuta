$(document).ready(function() {
	var task, totalTasks, taskHTML, session, totalSessions, currentSession, currentTasks, toExport, sessionToLoad, date;

  var dropdown = $("#newEntry .fields").html();
  var tempTotal = 0;

  if (typeof (Storage) !== undefined) {
    for (var key in localStorage){
      if (key.indexOf("session") === 0) {
        var loadButton = "<a href='' class='load' data-load='" + key + "'>" + JSON.parse(localStorage.getItem(key)).name + "<small>" + moment(JSON.parse(localStorage.getItem(key)).date).fromNow() + "</small></a>";
        $("nav").prepend(loadButton);
      }
      if (key === "total" || key.indexOf("task") === -1) { continue; }
      if (key.indexOf("task") === 0) { tempTotal++; }
      localStorage.setItem("total", tempTotal);
      var prevStr = localStorage.getItem(key);
      var prevObj = JSON.parse(prevStr);
      taskHTML = "<li data-task='" + key + "'><form>" + dropdown + "</form> <div class='actions'><i class='taskEdit'>Edit</i> <i class='taskDelete'>Delete</i></div></li>";
      $("#done").append(taskHTML);
      $("li[data-task=" + key + "] .entryType").val(prevObj.type);
      $("li[data-task=" + key + "] .entryText").val(prevObj.text);
      $("li[data-task=" + key + "] .entryType, li[data-task=" + key + "] .entryText").attr("disabled", "disabled");
    }
    // check if the user is new
    if (localStorage.currentSession) {
      $("body").removeClass("newUser");
      $("body").addClass("existingUser");
      var activeSession = JSON.parse(localStorage.currentSession);
      $(".list-name a").text(activeSession.name);
      $("nav .load[data-load=" + activeSession.id + "]").addClass("active");
      totalTasks = localStorage.total;
      task = totalTasks;
      totalSessions = localStorage.totalSessions;
      session = totalSessions;
      // console.log("user was here");
    } else {
      // console.log("user is new");
      $("body").addClass("newUser");
      task = 0;
      totalTasks = 0;
      session = 0;
      localStorage.setItem("total", 0);
      localStorage.setItem("totalSessions", 0);
      // var sessionFriendly = ("00" + session).slice(-3);
      /*currentSession = prompt("name this session");
      localStorage.setItem("currentSession", "{\"name\": \"" + currentSession + "\", \"id\": \"session" + sessionFriendly + "\"}");
      var loadButton = "<button class='load' data-load='session" + sessionFriendly + "'>" + currentSession + "</button>";
      $("nav").append(loadButton);
      localStorage.setItem("session" + sessionFriendly, "{ \"name\": \"" + currentSession + "\", \"tasks\": []}");
      localStorage.setItem("currentTasks", localStorage.getItem("session" + sessionFriendly));*/
    }
  }

  $("#newEntry").submit(function(){
    totalTasks++;
    task++;
    // if (currentTasks) {
    //   for (var key in localStorage){
    //     var getSessionName = JSON.parse(key);
    //     var here = getSessionName.name;
    //     if (here === localStorage.currentSession) {
    //       session = key;
    //     }
    //   }
    // }
    var taskFriendly = ("00" + task).slice(-3);

    var type = $("#newEntry .entryType").val();
    var text = $("#newEntry .entryText").val();

    localStorage.setItem("total", totalTasks);
    localStorage.setItem("task" + taskFriendly, "{ \"type\": \"" + type + "\", \"text\": \"" + text + "\" }");

    // console.log(dropdown);

    taskHTML = "<li data-task='task" + taskFriendly + "'><form>" + dropdown + "</form><div class='actions'><i class='taskEdit'>Edit</i> <i class='taskDelete'>Delete</i></div></li>";

    // console.log($("li[data-task=" + taskFriendly + "]").find(".entryType"));

    var taskStr = localStorage.getItem("task" + taskFriendly);
    var taskObj = JSON.parse(taskStr);

    // console.log(taskObj);

    $("#done").append(taskHTML);

    $("li[data-task=task" + taskFriendly + "] .entryType").val(type);
    $("li[data-task=task" + taskFriendly + "] .entryText").val(text);
    $("li[data-task=task" + taskFriendly + "] .entryType, li[data-task=task" + taskFriendly + "] .entryText").attr("disabled", "disabled");

    currentTasks = [];
    for (var key in localStorage){
      // if (key === "total" || key.indexOf("session") === -1) { continue; }
      if (key.indexOf("task") === 0) { currentTasks.push(localStorage.getItem(key)); }
      // console.log(key);
    }
    var oneSession = JSON.parse(localStorage.currentSession);
    var thisSession = oneSession.name;
    var date = new Date();
    localStorage.setItem("currentTasks", "{ \"name\": \"" + thisSession + "\", \"date\": \"" + date.toUTCString() + "\", \"tasks\": [" + currentTasks + "]}");
    var sessionFriendly = ("00" + session).slice(-3);
    localStorage.setItem(oneSession.id, "{ \"name\": \"" + thisSession + "\", \"date\": \"" + date.toUTCString() + "\", \"tasks\": [" + currentTasks + "]}");

    $("#newEntry .entryType").focus();
    $("#newEntry .entryText").val("");

    return false;
  });

  $("#done").on("click", ".actions .taskEdit", function(){
    var editing = $(this).parent().parent().attr("data-task");
    console.log("editing " + editing);
    $("li[data-task=" + editing + "]").addClass("editing");
    $("li[data-task=" + editing + "] .entryType").removeAttr("disabled");
    $("li[data-task=" + editing + "] .entryText").removeAttr("disabled");
    $("li[data-task=" + editing + "] .entryText").focus();
  });

  $("#done").on("submit", "form", function(){
    var submitting = $(this).parent().attr("data-task");
    // console.log(submitting);

    var editableType = $("li[data-task=" + submitting + "] .entryType");
    var editableText = $("li[data-task=" + submitting + "] .entryText");
    var newType = editableType.val();
    var newText = editableText.val();

    localStorage.setItem(submitting, "{ \"type\": \"" + newType + "\", \"text\": \"" + newText + "\" }");

    editableText.attr("disabled", "disabled"); 
    editableType.attr("disabled", "disabled");

    currentTasks = [];
    for (var key in localStorage){
      // if (key === "total" || key.indexOf("session") === -1) { continue; }
      if (key.indexOf("task") === 0) { currentTasks.push(localStorage.getItem(key)); }
      // console.log(key);
    }
    var twoSession = JSON.parse(localStorage.currentSession);
    var thiisSession = twoSession.name;

    var date = new Date();

    localStorage.setItem("currentTasks", "{ \"name\": \"" + thiisSession + "\", \"date\": \"" + date.toUTCString() + "\", \"tasks\": [" + currentTasks + "]}");
    localStorage.setItem(twoSession.id, "{ \"name\": \"" + thiisSession + "\", \"date\": \"" + date.toUTCString() + "\", \"tasks\": [" + currentTasks + "]}");

    $("li[data-task=" + submitting + "]").removeClass("editing");

    return false;
  });

  $("#done").on("click", ".taskDelete", function(){
    var deleting = $(this).parent().parent().attr("data-task");
    $("li[data-task=" + deleting + "]").remove();
    localStorage.removeItem(deleting);

    currentTasks = [];
    for (var key in localStorage){
      // if (key === "total" || key.indexOf("session") === -1) { continue; }
      if (key.indexOf("task") === 0) { currentTasks.push(localStorage.getItem(key)); }
      // console.log(key);
    }
    var threeSession = JSON.parse(localStorage.currentSession);
    var thiiisSession = threeSession.name;
    localStorage.setItem("currentTasks", "{ \"name\": \"" + thiiisSession + "\", \"tasks\": [" + currentTasks + "]}");
    localStorage.setItem(threeSession.id, "{ \"name\": \"" + thiiisSession + "\", \"tasks\": [" + currentTasks + "]}");
  });

  //get rid of everything on localStorage
  $("#clear").on("click", function() {
    for (var key in localStorage){
      if (key.indexOf("task") === 0) { localStorage.removeItem(key); }
    }
    $("#done").empty();
    console.log("shit cleared");
    task = 0;
    totalTasks = 0;
    localStorage.setItem("total", 0);
    localStorage.removeItem("currentTasks");
    return false;
  });

  // save shit on a key
  $(".newList").on("click", function(e){
    session++;
    var sessionFriendly = ("00" + session).slice(-3);
    // var saveName = prompt("name that shit");
    var saveData = [];
    localStorage.setItem("totalSessions", session);
    // console.log(localStorage.getItem("session" + sessionFriendly));
    for (var key in localStorage){
      // if (key === "total" || key.indexOf("session") === -1) { continue; }
      if (key.indexOf("task") === 0) { saveData.push(localStorage.getItem(key)); }
      if (key === "total" || key.indexOf("task") === 0) { localStorage.removeItem(key); }
      // console.log(key);
    }
    $("#done").empty();
    currentSession = prompt("What project will you be taking notes for?");

    localStorage.setItem("currentSession", "{\"name\": \"" + currentSession + "\", \"id\": \"session" + sessionFriendly + "\"}");
    var loadButton = "<a href='' class='load new' data-load='session" + sessionFriendly + "'>" + currentSession + "<small>" + moment(JSON.parse(localStorage.getItem(key)).date).fromNow() + "</small></a>";
    $("nav").prepend(loadButton);
    $("nav .new").siblings().removeClass("active");
    localStorage.setItem("total", 0);
    date = new Date();
    localStorage.setItem("session" + sessionFriendly, "{ \"name\": \"" + currentSession + "\", \"date\": \"" + date.toUTCString() + "\", \"tasks\": []}");
    localStorage.removeItem("currentTasks");
    e.preventDefault;
  });
  
  // change session
  $("nav").on("click", ".load", function(e){
    sessionToLoad = $(this).attr("data-load");
    // console.log(sessionToLoad);

    var previousList = JSON.parse(localStorage.getItem(sessionToLoad));
    //console.log(previousList.tasks.length);
    var previousAmount = previousList.tasks.length;
    // console.log(previousAmount);
    localStorage.setItem("total", previousAmount);

    for (var key in localStorage){
      if (key.indexOf("task") === 0) { localStorage.removeItem(key); }
    }

    localStorage.setItem("currentSession", "{\"name\": \"" + previousList.name + "\", \"id\": \"" + sessionToLoad + "\"}");
    localStorage.setItem("currentTasks", localStorage.getItem(sessionToLoad));

    $("#done").empty();

    for (var i=0;i<previousAmount;i++) {
      var taskFriendly = ("00" + (i+1)).slice(-3);
      localStorage.setItem("task" + taskFriendly, "{ \"type\": \"" + previousList.tasks[i].type + "\", \"text\": \"" + previousList.tasks[i].text + "\" }")

      var prevStr = localStorage.getItem(key);
      var prevObj = JSON.parse(prevStr);
      taskHTML = "<li data-task='" + "task" + taskFriendly + "'><form>" + dropdown + "</form> <div class='actions'><i class='taskEdit'>Edit</i> <i class='taskDelete'>Delete</i></div></li>";
      $("#done").append(taskHTML);
      $("li[data-task=" + "task" + taskFriendly + "] .entryType").val(previousList.tasks[i].type);
      $("li[data-task=" + "task" + taskFriendly + "] .entryText").val(previousList.tasks[i].text);
      $("li[data-task=" + "task" + taskFriendly + "] .entryType, li[data-task=" + "task" + taskFriendly + "] .entryText").attr("disabled", "disabled");
    }
    var activeSession = JSON.parse(localStorage.currentSession);
    $(".list-name a").text(activeSession.name);
    $(this).addClass("active");
    $(this).siblings().removeClass("active");

    $("#newEntry .entryType").focus();

    e.preventDefault();
  });

  $("#reset").on("click", function(){
    for (var key in localStorage){
      localStorage.removeItem(key);
    }
    location.reload();
  });

  $("#export").on("click", function(e){
    if (localStorage.total === "0") {
      $(".toast.error").fadeIn();
      setTimeout(function(){
        $(".toast.error").fadeOut();
      }, 3000);

      return false
    }

    $("#past table").empty();
    var currentParsed = JSON.parse(localStorage.currentTasks);
    $("#past table").append("<tr><th>" + currentParsed.name + "</th></td>");
    console.log(currentParsed.tasks.length);

    for (var i = 0; i < currentParsed.tasks.length; i++) {
      var previousTask = "<tr><td><strong>" + currentParsed.tasks[i].type.toUpperCase() + "</strong></td><td>" + currentParsed.tasks[i].text + "</td></tr>";
      $("#past table").append(previousTask);
    }

    var emails = prompt("Email notes to: ");

    $.ajax({
      type: "POST",
      email: emails,
      data: localStorage.currentTasks
    });

    var serverUrl = "https://minuta.herokuapp.com/share";

    $.post( serverUrl, {
      email: emails,
      taskData: localStorage.currentTasks
    }, "json");

    console.log(emails);

    $(".toast.success").fadeIn();
    setTimeout(function(){
      $(".toast.success").fadeOut();
    }, 3000);

    e.preventDefault();
    // var fetchTasks = JSON.parse(localStorage.currentParsed);
    // var previousTask = "<tr data-task='" + "task" + taskFriendly + "'><td><strong>" + previousList.tasks[i].type.toUpperCase() + "</strong></td><td>" + previousList.tasks[i].text + "</td></tr>";
    // $("#past table").append(previousTask);
  });

  $("#remove").on("click", function(e){
    var killSession = JSON.parse(localStorage.currentSession);
    console.log(killSession.id);
    e.preventDefault();
  });

  $(".btn-dropdown").on("click", function(e){
    var target = $(this).attr("data-target");
    var el = $("#" + target);
    
    el.toggle();

    var offsetLeft = $(this).offset().left;
    // console.log(offsetLeft);
    var height = $(this).height();
    var offsetTop = $(this).offset().top + height - $(window).scrollTop();

    el.css({
      "top": offsetTop,
      "left": offsetLeft
    });

    e.preventDefault();
    e.stopPropagation();
  });

  $(".dropdown a").on("click", function(){
    $(".dropdown").hide();
  });
});

$(document).on("click", function(){
  if ($(".dropdown").is(":visible")) {
    $(".dropdown").hide();
  }
});