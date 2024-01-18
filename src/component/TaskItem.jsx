import { useState } from "react";
import "../sass/taskItem.scss";

function TaskItem({
  id,
  taskName,
  taskDescription,
  taskStatus,
  onChange,
  onUpdateClick,
  onDeleteClick,
}) {
  const [isChecked, setIsChecked] = useState(taskStatus || false);

  const checkBoxIsChecked = (e) => {
    setIsChecked(e.target.checked);
    onChange(e);
  };

  return (
    <li id={id}>
      <div className="formGroup">
        <p className="taskLabel">Intitulé:</p>
        <p className="taskData">{taskName}</p>
      </div>
      <div className="formGroup taskDetail">
        <label htmlFor="taskDetail">Détails:</label>
        <textarea
          value={taskDescription}
          id="taskDetail"
          name="taskDetail"
          readOnly
        ></textarea>
      </div>
      <div className="formGroup">
        <div className="formGroup checkBox">
          <label htmlFor="checkBoxCompleted">Status ?</label>
          <input
            type="checkbox"
            name="checkBoxCompleted"
            id="checkBoxCompleted"
            checked={isChecked}
            onChange={checkBoxIsChecked}
          />
          <span> {isChecked ? "terminée ✅" : "en cours ⚙️"}</span>
        </div>
      </div>
      <div className="buttonUDContainer">
        <button onClick={onUpdateClick} type="button" className="updateButton">
          Modifier
        </button>
        <button onClick={onDeleteClick} type="button" className="deleteButton">
          Supprimer
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
