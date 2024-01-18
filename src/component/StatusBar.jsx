import "../sass/statusBar.scss";

function StatusBar({ totalTask, completedTask }) {
  return (
    <div id="statusBar">
      <p className="taskLabel">
        Nombre de tâches total : <span className="taskData">{totalTask}</span>
      </p>
      <p className="taskLabel">
        Tâches terminées: <span className="taskData">{completedTask}</span>
      </p>
    </div>
  );
}

export default StatusBar;
