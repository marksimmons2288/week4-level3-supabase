import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";
import TaskItem from "./TaskItem.jsx";
import NewTaskForm from "./NewTaskForm.jsx";    


/**
 * TaskList is responsible for:
 *  - Fetching tasks from Supabase on mount.
 *  - Managing loading and error state for the list.
 *  - Rendering a list of TaskItem components.
 */
function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Loads tasks from the Supabase "tasks" table. (call supabase client instance)
   */
  const loadTasks = async () => {
    // Set loading and errors
    setLoading(true);
    setError(null);

    //  function from supabase to fetch data from the tasks table
    const { data, error: queryError } = await supabase
      .from('tasks')
      .select('*')
      .order("created_at", { ascending: false });
   
      // Handle errors and set tasks state according to response
    if (queryError) {
      setError('Error loading tasks: ' + queryError.message);
    } else {
      setTasks(data);
    }
    setLoading(false);
  };

  /**
   * Adds a new task by inserting it into Supabase "tasks" table and updating local state.
   * @param {string} title - The title of the new task.
   */
  const handleAddTask = async (title) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title }])
      .select(); // Return the inserted row(s)

    if (error) {
      // Re-throw so NewTaskForm can handle it. (display error message)
      throw error;
    }
   
    const insertedTask = data?.[0];
    if (insertedTask) {
      
      // Prepend the new task to the existing list.
      setTasks((prevTasks) => [insertedTask, ...prevTasks]);
    }
  };
   

  useEffect(() => {
    const fetchTasks = async () => {
      await loadTasks();
    };
    
    fetchTasks();
  }, []);

  // Derived summary information based on current tasks state.
  const totalTasks = tasks.length;  
  const completedTasks = tasks.filter(task => task.is_complete).length; // filter method to count (length) completed tasks that are true.  

  return (
    <section className="card">
      <h2>Tasks</h2>

      <NewTaskForm onAddTask={handleAddTask} />

      {loading && <p>Loading tasks…</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && tasks.length === 0 && <p>No tasks yet.</p>}

      {totalTasks > 0 && (
        <p className="task-summary">
          <strong>{totalTasks}</strong> tasks - <strong>{completedTasks}</strong> completed
        </p>
      )}

      <ul className="task-list">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </section>
  );
};

export default TaskList;

// CRUD - Create, Read, Update and Delete