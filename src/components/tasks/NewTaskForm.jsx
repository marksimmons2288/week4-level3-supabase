import { useState } from "react";

/**
 * NewTaskForm lets the user add a new task.(correlated to TaskItem.jsx and TaskList.jsx)
 *
 * @param {object} props
 * @param {(title: string) => Promise<void> | void} props.onAddTask
 *        Callback invoked when the form is submitted with a non-empty title. (Correlated to TaskList.jsx === Tasklist and loadTasks function)
 */

// Three states: title, submitting, error for form handling
const NewTaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);


  // Handle form submission using handleSubmit function and prevent default behavior
  const handleSubmit = async (event) => {
    event.preventDefault();

 // trim input whitespace due to storage and bit costs
    const trimmed = title.trim();

    if (!trimmed) {
      setError("Task title cannot be empty.");
      return;
    }

    if (trimmed.length > 80) {
      setError("Task title cannot exceed 80 characters.");
      return;
    }
    
    // Reset error and set submitting state if conditions are valid
    setError(null);
    setSubmitting(true);

    // Call onAddTask prop-(pass data from parent to child component) and handle errors using try-catch-finally async pattern 
    try {
      await onAddTask(trimmed);
      setTitle('');
    } catch (formError) {
      console.log(formError);
      setError("Failed to add a task. Error message: "+ formError?.message);

      setTimeout(() => {
        setError("");
      }, 5000);
  
      // finally block to reset submitting state(regardless of success or failure) 
    } finally {
      setSubmitting(false);
    }
  };

  // Render the form with input field, submit button, and error message display (html structure)
  return (
    <form onSubmit={handleSubmit} className="new-task-form">
      <label htmlFor="task-title" className="sr-only">
        Task title
      </label>

      <input
        id="task-title"
        type="text"
        placeholder="Add a new task…"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={submitting}
      />

      <button type="submit" disabled={submitting || !title.trim()}>
        {submitting ? "Adding…" : "Add"}
      </button>

      {error && <p className="error-text">{error}</p>}
    </form>
  );
};

export default NewTaskForm;