 // Undo/Redo Logic
 let undoStack = [];
 let redoStack = [];
 function saveState() {
   const tasks = localStorage.getItem("tasks") || "[]";
   undoStack.push(tasks);
   if (undoStack.length > 20) undoStack.shift();
   redoStack = [];
 }

 // File Menu Functions
 function newPlanner() {
   if (confirm("Start a new planner? This will clear current tasks.")) {
     localStorage.removeItem("tasks");
     undoStack = [];
     redoStack = [];
     location.reload();
   }
 }
 function savePlanner() {
   const tasks = localStorage.getItem("tasks") || "[]";
   const blob = new Blob([tasks], { type: "application/json" });
   const url = URL.createObjectURL(blob);
   const a = document.createElement("a");
   a.href = url;
   a.download = "tasks.json";
   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a);
   URL.revokeObjectURL(url);
 }
 function openPlanner() {
   const fileInput = document.createElement("input");
   fileInput.type = "file";
   fileInput.accept = "application/json";
   fileInput.onchange = function(event) {
     const file = event.target.files[0];
     const reader = new FileReader();
     reader.onload = function(e) {
       try {
         const tasks = JSON.parse(e.target.result);
         saveState();
         localStorage.setItem("tasks", JSON.stringify(tasks));
         alert("Tasks loaded successfully!");
         location.reload();
       } catch(e) {
         alert("Invalid file format.");
       }
     };
     reader.readAsText(file);
   };
   fileInput.click();
 }
 function exitPlanner() {
   const confirmed = confirm("Are you sure you want to exit?");
   if (confirmed) {
     window.open('', '_self');
     window.close();
   }
 }

 // Edit Menu Functions
 function undoAction() {
   if (undoStack.length > 0) {
     const currentState = localStorage.getItem("tasks") || "[]";
     redoStack.push(currentState);
     const prevState = undoStack.pop();
     localStorage.setItem("tasks", prevState);
     alert("Undo performed.");
     loadTasks();
   } else {
     alert("Nothing to undo.");
   }
 }
 function redoAction() {
   if (redoStack.length > 0) {
     const currentState = localStorage.getItem("tasks") || "[]";
     undoStack.push(currentState);
     const nextState = redoStack.pop();
     localStorage.setItem("tasks", nextState);
     alert("Redo performed.");
     loadTasks();
   } else {
     alert("Nothing to redo.");
   }
 }

 // Settings Menu Functions
 function changeTheme() {
   document.body.classList.toggle("dark-theme");
 }
 function aboutPlanner() {
   alert("Day Planner v1.0\nA simple, fully functional planner application.");
 }

 // Task Functions
 function addTask() {
   const time = document.getElementById("timeInput").value;
   const task = document.getElementById("taskInput").value;
   if (time && task) {
     saveState();
     let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
     tasks.push({ time, task });
     localStorage.setItem("tasks", JSON.stringify(tasks));
     alert("Task added successfully!");
     document.getElementById("timeInput").value = "";
     document.getElementById("taskInput").value = "";
   } else {
     alert("Please enter a time and task.");
   }
 }
 function showSchedule() {
   document.getElementById("taskForm").style.display = "none";
   const schedule = document.getElementById("taskSchedule");
   schedule.style.display = "block";
   setTimeout(() => {
     schedule.classList.add("active");
   }, 10);
   loadTasks();
 }
 function showTaskForm() {
   const schedule = document.getElementById("taskSchedule");
   schedule.classList.remove("active");
   setTimeout(() => {
     schedule.style.display = "none";
     document.getElementById("taskForm").style.display = "block";
   }, 500);
 }
 function loadTasks() {
   const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
   const tableBody = document.getElementById("taskTableBody");
   tableBody.innerHTML = "";
   tasks.forEach((task, index) => {
     const row = document.createElement("tr");
     row.classList.add("fade-in");
     row.innerHTML = `
     <td>${task.time}</td>
     <td>${task.task}</td>
     <td>
       <button class="delete-button" onclick="deleteTask(${index})">
         Delete
       </button>
     </td>
   `;
   
     tableBody.appendChild(row);
   });
 }
 function deleteTask(index) {
   saveState();
   let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
   tasks.splice(index, 1);
   localStorage.setItem("tasks", JSON.stringify(tasks));
   loadTasks();
 }
 document.addEventListener("DOMContentLoaded", loadTasks);