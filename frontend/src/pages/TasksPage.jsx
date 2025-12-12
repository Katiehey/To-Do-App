import { useState, useEffect } from "react";
import TaskList from "../components/tasks/TaskList";
import Pagination from "../components/common/Pagination";
import taskService from "../services/taskService"; // adjust path

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // show 5 tasks per page

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await taskService.getTasks({ page: currentPage, limit });
        setTasks(res.data.tasks);
        setTotalPages(res.pages); // backend sends total pages
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await taskService.updateTask(id, { taskStatus: newStatus });
      // refetch tasks for current page
      const res = await taskService.getTasks({ page: currentPage, limit });
      setTasks(res.data.tasks);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleEdit = (task) => {
    console.log("Edit task:", task);
    // open modal or navigate to edit page
  };

  const handleDelete = async (id) => {
    try {
      await taskService.deleteTask(id);
      // refetch tasks for current page
      const res = await taskService.getTasks({ page: currentPage, limit });
      setTasks(res.data.tasks);
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  return (
    <div className="space-y-6">
      <TaskList
        tasks={tasks}
        loading={loading}
        onUpdateStatus={handleUpdateStatus}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default TasksPage;
