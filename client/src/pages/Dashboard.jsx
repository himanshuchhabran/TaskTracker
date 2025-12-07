import { useEffect, useState } from 'react';
import { getTasks, createTask, deleteTask, updateTask } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Trash2, Edit, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logoutUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  

  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', status: 'pending' });
  const [isEditing, setIsEditing] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [filter]); 

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchTasks();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchTasks = async () => {
    try {
      const query = `?status=${filter}&search=${search}`;
      const { data } = await getTasks(query);
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateTask(isEditing, newTask);
        toast.success('Task Updated');
        setIsEditing(null);
      } else {
        await createTask(newTask);
        toast.success('Task Created');
      }
      setNewTask({ title: '', description: '', priority: 'medium', status: 'pending' });
      fetchTasks();
    } catch (error) {
      toast.error('Error saving task');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await deleteTask(id);
      toast.success('Task Deleted');
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      toast.error('Error deleting task');
    }
  };

  const startEdit = (task) => {
    setIsEditing(task._id);
    setNewTask({ 
        title: task.title, 
        description: task.description, 
        priority: task.priority,
        status: task.status
    });
  };

  return (
    <div className="min-h-screen bg-gray-300 ">

      <nav className=" shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">TaskTracker</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Hello, {user?.name}</span>
            <button onClick={logoutUser} className="text-red-500 hover:text-red-700">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5"/>
                <input 
                    type="text" 
                    placeholder="Search tasks..." 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <select 
                className="border p-2 rounded-lg" 
                onChange={(e) => setFilter(e.target.value)}
                value={filter}
            >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
            </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Task' : 'Add New Task'}</h3>
                <form onSubmit={handleCreateOrUpdate} className="flex flex-col gap-4">
                    <input 
                        type="text" placeholder="Title" required 
                        className="border p-2 rounded"
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    />
                    <textarea 
                        placeholder="Description" 
                        className="border p-2 rounded"
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    />
                    <select 
                        className="border p-2 rounded"
                        value={newTask.priority}
                        onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                    </select>
                    <select 
                        className="border p-2 rounded"
                        value={newTask.status}
                        onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                    >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2">
                        {isEditing ? <Edit size={18}/> : <Plus size={18}/>}
                        {isEditing ? 'Update Task' : 'Create Task'}
                    </button>
                    {isEditing && (
                        <button type="button" onClick={() => {setIsEditing(null); setNewTask({ title: '', description: '', priority: 'medium', status: 'pending' });}} className="text-gray-500 text-sm">Cancel Edit</button>
                    )}
                </form>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tasks.map((task) => (
                    <div key={task._id} className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-blue-500 hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-lg">{task.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-green-100 text-green-800'
                            }`}>
                                {task.priority}
                            </span>
                        </div>
                        <p className="text-gray-600 mt-2 text-sm">{task.description}</p>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-xs text-gray-400">Status: {task.status}</span>
                            <div className="flex gap-2">
                                <button onClick={() => startEdit(task)} className="text-blue-500 hover:text-blue-700"><Edit size={18}/></button>
                                <button onClick={() => handleDelete(task._id)} className="text-red-500 hover:text-red-700"><Trash2 size={18}/></button>
                            </div>
                        </div>
                    </div>
                ))}
                {tasks.length === 0 && <p className="text-gray-500 col-span-2 text-center py-10">No tasks found.</p>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;