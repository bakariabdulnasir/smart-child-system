import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Calendar, 
  ClipboardList, 
  LogOut, 
  User, 
  Plus, 
  CheckCircle, 
  Trash2,
  Edit,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChildren } from '../context/ChildrenContext';
import { apiFetch } from '../services/api';

const Tasks = () => {
  const { user, logout } = useAuth();
  const { children, loading: childrenLoading } = useChildren();
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Form state - backend expects: title, due_date (date), priority (low/medium/high), child_id (required), status (pending/completed)
  const [taskForm, setTaskForm] = useState({
    title: '',
    due_date: '',
    priority: 'medium',
    child_id: '',
    status: 'pending',
    description: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      // Fetch all tasks
      const tasksRes = await apiFetch('/tasks');
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        const taskList = tasksData.data?.tasks || tasksData.tasks || [];
        setTasks(taskList);
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getChildName = (childId) => {
    if (!children || children.length === 0) return 'Unknown';
    const child = children.find(c => c.id === childId);
    return child?.full_name || child?.name || 'Unknown';
  };

  // Check if we have children available
  const hasChildren = children && children.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
if (!taskForm.title || !taskForm.child_id) {
      setError('Title and child are required');
      return;
    }
    
    // Validate child_id is a valid number (not 0, empty string, or invalid)
    const childIdNum = parseInt(taskForm.child_id, 10);
    if (isNaN(childIdNum) || childIdNum <= 0) {
      setError('Please select a valid child');
      return;
    }
    
    // Transform frontend field names to match backend schema
    const taskData = {
      title: taskForm.title,
      due_date: taskForm.due_date || null,
      priority: taskForm.priority,
      child_id: taskForm.child_id,
      status: taskForm.status,
      description: taskForm.description || null
    };
    
    try {
      let res;
      if (editingTask) {
        res = await apiFetch(`/tasks/${editingTask.id}`, {
          method: 'PUT',
          body: JSON.stringify(taskData)
        });
      } else {
        res = await apiFetch('/tasks', {
          method: 'POST',
          body: JSON.stringify(taskData)
        });
      }
      
if (res.ok) {
        setSuccess(editingTask ? 'Task updated successfully!' : 'Task added successfully!');
        setTaskForm({
          title: '',
          due_date: '',
          priority: 'medium',
          child_id: '',
          status: 'pending',
          description: ''
        });
        setShowForm(false);
        setEditingTask(null);
        fetchTasks();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json();
const errorMsg = data.message || data.error || (data.errors && JSON.stringify(data.errors)) || 'Failed to save task';
        setError(errorMsg);
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title || '',
      due_date: task.due_date ? task.due_date.split('T')[0] : '',
      priority: task.priority || 'medium',
      child_id: task.child_id || '',
      status: task.status || 'pending',
      description: task.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const res = await apiFetch(`/tasks/${id}`, {
          method: 'DELETE'
        });
if (res.ok) {
          setSuccess('Task deleted successfully!');
          fetchTasks();
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError('Failed to delete task');
        }
      } catch (err) {
        setError('Network error');
      }
    }
  };

  const handleComplete = async (task) => {
    try {
      const res = await apiFetch(`/tasks/${task.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'completed' })
      });
if (res.ok) {
        setSuccess('Task completed!');
        fetchTasks();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to complete task');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
    setTaskForm({
      title: '',
      due_date: '',
      priority: 'medium',
      child_id: '',
      status: 'pending',
      description: ''
    });
    setError('');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Loading Tasks...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Message Toast */}
      {error && (
        <div className="fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg bg-red-500 text-white flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      {success && (
        <div className="fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg bg-green-500 text-white">
          {success}
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <h1 className="text-2xl font-bold text-indigo-600">Smart Child</h1>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
<button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-indigo-600">Dashboard</button>
              <button onClick={() => navigate('/schedule')} className="text-gray-500 hover:text-indigo-600">Schedule</button>
              <button className="text-indigo-600">Tasks</button>
              <button onClick={() => navigate('/family')} className="text-gray-500 hover:text-indigo-600">Family</button>
              <button onClick={() => navigate('/amenities')} className="text-gray-500 hover:text-indigo-600">Amenities</button>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Bell className="text-gray-500" size={20} />
<div className="flex items-center gap-2">
              {user?.profile_image ? (
                <img src={user.profile_image} alt="profile" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : '?'}
                </div>
              )}
              <span className="font-medium">{user?.full_name || "User"}</span>
            </div>
            <button onClick={logout} className="flex items-center gap-2 text-red-500">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
{!showForm && (
            <button
              onClick={() => setShowForm(true)}
              disabled={!hasChildren || childrenLoading}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                !hasChildren || childrenLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
              title={
                !hasChildren
                  ? 'Add a child first to create a task'
                  : childrenLoading
                  ? 'Loading children...'
                  : 'Add a new task'
              }
            >
              <Plus size={20} />
              Add Task
            </button>
          )}
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Task Form */}
        {showForm && (
          <div className="bg-white rounded-3xl p-6 shadow-sm mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter task title"
                    required
                  />
                </div>
<div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Child *</label>
                  {childrenLoading ? (
                    <div className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-500">
                      Loading children...
                    </div>
                  ) : !hasChildren ? (
                    <div className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-500">
                      No children available. Please add a child first.
                    </div>
                  ) : (
                    <select
                      value={taskForm.child_id}
                      onChange={(e) => setTaskForm({ ...taskForm, child_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select Child</option>
                      {children.map(child => (
                        <option key={child.id} value={child.id}>
                          {child.full_name || child.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskForm.due_date}
                    onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    rows="3"
                    placeholder="Task description (optional)"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition">
                  {editingTask ? 'Update Task' : 'Save Task'}
                </button>
                <button type="button" onClick={cancelForm} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 shadow-sm text-center text-gray-500">
            <ClipboardList size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No tasks found</p>
            <p className="text-sm">Click "Add Task" to create your first task.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{task.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        {getChildName(task.child_id)}
                      </span>
                      {task.due_date && (
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="mt-2 text-gray-600">{task.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => handleComplete(task)}
                        className="text-green-600 hover:text-green-800 p-2"
                        title="Mark as completed"
                      >
                        <CheckCircle size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Edit task"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Delete task"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
