import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "../sass/form.scss";
import taskList from "./taskList";
import TaskItem from "./TaskItem";
import StatusBar from "./StatusBar";

function AddTaskForm() {
  // 1.States :
  // taskList:
  const [todoList, setToDoList] = useState(() => {
    const savedTasks = localStorage.getItem("todoList");
    return savedTasks ? JSON.parse(savedTasks) : taskList;
  });

  const [formData, setFormData] = useState({
    taskName: "",
    taskDescription: "",
  });

  //   Input Errors :
  const [inputTaskNameError, setInputTaskNameError] = useState("");
  const [inputTaskDescriptionError, setInputTaskDescriptionError] =
    useState("");

  // Update {task} :
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  // StatusBar :
  const [countCompletedTask, setCountCompletedTask] = useState(0);

  // Ref :
  const addTaskForm = useRef(null);

  //   2.Functions/Behaviors :
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleTaskStatusChange = (taskId, isChecked) => {
    setToDoList((prevToDoList) =>
      prevToDoList.map((task) =>
        task.id === taskId ? { ...task, completed: isChecked } : task
      )
    );

    if (isChecked) {
      setCountCompletedTask((prevCount) => prevCount + 1);
    } else {
      setCountCompletedTask((prevCount) => prevCount - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    /**
     * ⁉️ Possible upgrading because too much code repetition for the handler error  input
     */
    if (formData.taskName.length < 2) {
      setInputTaskNameError(
        `Veuillez saisir plus de 2 caractères pour l'intitulé`
      );
      setTimeout(() => {
        setInputTaskNameError("");
      }, 10000);
    }
    if (formData.taskName.length === 0) {
      setInputTaskNameError(`L'intitulé ne peut être vide !`);
      setTimeout(() => {
        setInputTaskNameError("");
      }, 10000);
    }

    if (formData.taskDescription.length < 2) {
      setInputTaskDescriptionError(
        `Veuillez saisir plus de 2 caractères pour la description`
      );
      setTimeout(() => {
        setInputTaskDescriptionError("");
      }, 10000);
    }
    if (formData.taskDescription.length === 0) {
      setInputTaskDescriptionError(`La description ne peut être vide !`);
      setTimeout(() => {
        setInputTaskDescriptionError("");
      }, 10000);
    }

    if (
      formData.taskName.trim() === "" ||
      formData.taskDescription.trim() === ""
    ) {
      console.log(
        "Le formulaire est vide, veuillez remplir les champs nécessaires !"
      );
      return;
    } else if (isEditing && editingTaskId) {
      setToDoList((prevToDoList) =>
        prevToDoList.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                name: formData.taskName,
                description: formData.taskDescription,
              }
            : task
        )
      );
      showToast(`Tâche mise à jour avec succès !`);

      setFormData({
        taskName: "",
        taskDescription: "",
      });

      setIsEditing(false);
    } else {
      // Create a {task} :
      let newTask = {
        id: uuidv4(),
        name: formData.taskName,
        description: formData.taskDescription,
      };

      //   Add {task }into [todoList] array
      setToDoList((prevToDoList) => [...prevToDoList, newTask]);

      showToast(`Tâche créée avec succès !`);

      // Clean form:
      setFormData({
        taskName: "",
        taskDescription: "",
      });
    }
  };

  // Delete {task} :
  const handleDelete = (taskId) => {
    const confirmDelete = confirm(`Voulez vous supprimer cette tâche ?`);
    if (confirmDelete) {
      setToDoList((prevToDoList) => {
        return prevToDoList.filter((task) => taskId !== task.id);
      });
      showToast(`Tâche supprimée avec succès !`);
    } else {
      return;
    }
  };

  // Scroll to while update task :
  const scrollToAddTaskForm = () => {
    addTaskForm.current?.scrollIntoView({ behavior: "smooth" });
  };
  // Update {task} :
  const handleUpdate = (taskId) => {
    const taskToEdit = todoList.find((task) => task.id === taskId);
    if (taskToEdit) {
      // Scroll to form :
      scrollToAddTaskForm();
      setFormData({
        taskName: taskToEdit.name,
        taskDescription: taskToEdit.description,
      });
      setIsEditing(true);
      setEditingTaskId(taskId);

      // Add an orange style "editing mode":
      const addTaskForm = document.querySelector("form#addTaskForm");
      addTaskForm.classList.toggle("editingMode");
    }
  };

  // CancelUpdate :
  const cancelUpdate = () => {
    setIsEditing(false);
    setFormData({
      taskName: "",
      taskDescription: "",
    });
    showToast("Modification annulée");

    const addTaskForm = document.querySelector("form#addTaskForm");
    addTaskForm.classList.toggle("editingMode");
  };

  // Save into localStorage :
  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(todoList));
  }, [todoList]);

  // Toast :
  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  };
  const todos = todoList.map((task) => (
    <TaskItem
      key={task.id}
      id={task.id}
      taskName={task.name}
      taskDescription={task.description}
      taskStatus={task.completed}
      onChange={(e) => handleTaskStatusChange(task.id, e.target.checked)}
      onUpdateClick={() => handleUpdate(task.id)}
      onDeleteClick={() => handleDelete(task.id)}
    />
  ));

  //   3.Render:
  return (
    <>
      <h1>🙆‍♂️DaddyDoList🙆‍♂️</h1>
      <StatusBar totalTask={todos.length} completedTask={countCompletedTask} />
      <ul id="taskList">{todos}</ul>
      <form ref={addTaskForm} onSubmit={handleSubmit} id="addTaskForm">
        <h2>{isEditing ? "Modifier une tâche" : "Ajouter une tâche"}</h2>
        <div className="inputGroup">
          <label htmlFor="taskName">Intitulé de la tâche :</label>
          <input
            type="text"
            id="taskName"
            name="taskName"
            placeholder="Intitulé"
            value={formData.taskName}
            onChange={handleChange}
          />
          <div className="errorInputContainer">
            {inputTaskNameError && (
              <p className="errorInput">{inputTaskNameError}</p>
            )}
          </div>
        </div>
        <div className="inputGroup">
          <label htmlFor="taskDescription">Description :</label>
          <textarea
            id="taskDescription"
            name="taskDescription"
            placeholder="détail de la tâche"
            value={formData.taskDescription}
            onChange={handleChange}
          ></textarea>{" "}
          <div className="errorInputContainer">
            {inputTaskDescriptionError && (
              <p className="errorInput">{inputTaskDescriptionError}</p>
            )}
          </div>
        </div>
        <button id="addTaskButton">{isEditing ? "Modifier" : "Ajouter"}</button>
        {isEditing && (
          <button onClick={cancelUpdate} id="cancelUpdateButton" type="button">
            Annuler
          </button>
        )}{" "}
      </form>
    </>
  );
}

export default AddTaskForm;
