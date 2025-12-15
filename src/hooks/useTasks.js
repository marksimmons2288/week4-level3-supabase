/** 
 * Custom HOOK that encapulstes all task-related Supabase logic:
 * load task
 * add task
 * toggle completion
 * delete task
 * optional- realtime updates
*/
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function useTasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

/**
   * Loads tasks from the Supabase "tasks" table. (call supabase client instance)
   */

const loadTasks = useCallback(async () => {
    // Set loading and errors
    setLoading(true);
    setError(null);

    //  function from supabase to fetch data from the tasks table.(taskList- renders everytime something updates= re-renders the handleToggleComplet(below))
    
    const { data, error: queryError } = await supabase
      .from('tasks')
      // select all columns
      .select('*')
      .order("created_at", { ascending: false });
   
      // Handle errors and set tasks state according to response
    if (queryError) {
      setError('Error loading tasks: ' + queryError.message);
    } else {
      setTasks(data);
    }
    setLoading(false);
  }, []);
/**
 * Adds a new task by inserting it into Supabase "tasks" table and updating local state.
 
* @param {string} title - The title of the new task.
*/

// Calls the event inside the handle function (handleAddTask=addTask)
  const addTask = useCallback(async (title) => {
    const { data, error: insertError } = await supabase
      .from('tasks')
      .insert([{ title, is_complete: false }])
      .select(); // Return the inserted row(s)

      if (insertError) {
      
        console.error(insertError);
        throw insertError;
      }
   
    const inserted = data?.[0];
    if (inserted) {
      
      setTasks((prevTasks) => [inserted, ...prevTasks]);
    }
  }, []);

  /**
   * Toggles the is_complete status of a task.
   * @param {number} id - The ID of the task to update.
   * @param {boolean} isComplete - Desired completion state.
   */
  const toggleTask = useCallback(async (id, isComplete) => {
    const { error: updateError } = await supabase
    .from('tasks')
    .update({ is_complete: isComplete })
    .eq('id', id);
    
    if (updateError) {
  
      console.error(updateError);
      throw updateError;
    }
   
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, is_complete: isComplete } : task
      )
    );
  }, []);

   /**
   * Deletes a task by ID from Supabase and updates local state.
   * 
   * @param {number} id - The ID of the task to delete.
   */
  const deleteTask = useCallback(async (id) => {
    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);  
      
    if (deleteError) {

      console.error(deleteError);
      throw deleteError;
    }
    
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }, []);

useEffect(() => {
    const fetchTasks = async () => {
      await loadTasks();
    };
    
    fetchTasks();
  }, [loadTasks]);
  
  return {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    deleteTask
  };
}

export { useTasks };