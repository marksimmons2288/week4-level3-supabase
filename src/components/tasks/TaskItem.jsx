/**
 * Displays a single task as a list item.
 *
 * @param {object} props
 * @param {{ id: number, title: string, is_complete: boolean }} props.task
 * @param {(id: number) => void} props.onToggleComplete
 * @param {(id: number) => void} props.onDelete
 */
export default function TaskItem({ task, onToggleComplete, onDelete }) {

/**
 * Handles checkbox change events and notifies the parent component.                           
 */
const handleToggle = () => {
    onToggleComplete(task.id, !task.is_complete);
  };

  /**
   * Handles delete button clicks and notifies the parent component.
   */
  const handleDelete = () => {
    onDelete(task.id);
  };
  return (
    <li className="task-item">
      <label className="task-item_content">
        <input
          type="checkbox"
          checked={task.is_complete}
          onChange={handleToggle}
        />
        <span className={task.is_complete ? "task-item_title task-item_title--done" : "task-item_title"}>
          {task.title}
        </span>
      </label>  
      <button
        className="task-item_delete"  
        onClick={handleDelete}
        aria-label= "Delete task"
        >
        x
      </button>
    </li>
  );
}