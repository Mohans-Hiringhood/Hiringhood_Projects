import { useState, useEffect } from "react";
import TodoImage from "../todo-img.svg"; 
import "../styles/todo.css"
import ThemeSwitcher from "../components/ThemeSwitcher";
import { Todo } from "../types";
import { DeleteOutlined, EditOutlined, Add, SearchOutlined } from "@mui/icons-material";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Checkbox,
    Select,
    MenuItem,
    IconButton,
    InputAdornment,
} from "@mui/material";

const TodoList = () => {
    const [todos, setTodos] = useState<Todo[]>(() => {
        // Load saved tasks from Local Storage when component mounts
        const savedTodos = localStorage.getItem("todos");
        return savedTodos ? JSON.parse(savedTodos) : [];
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<"all" | "complete" | "incomplete">("all");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [newTask, setNewTask] = useState("");

    // Save tasks to Local Storage whenever `todos` change
    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    // Add Todo
    const addTodo = () => {
        if (newTask.trim() === "") return;
        const newTodo: Todo = {
            id: Date.now(),
            text: newTask,
            completed: false,
        };
        setTodos([...todos, newTodo]);
        setNewTask("");
        setOpenDialog(false);
    };

    // Toggle Complete
    const toggleComplete = (id: number) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    // Start Editing
    const startEditing = (id: number, text: string) => {
        setEditingId(id);
        setEditText(text);
    };

    // Save Edited Todo
    const saveEdit = () => {
        setTodos(
            todos.map((todo) =>
                todo.id === editingId ? { ...todo, text: editText } : todo
            )
        );
        setEditingId(null);
        setEditText("");
    };

    // Delete Todo
    const deleteTodo = (id: number) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    // Filtered Todos
    const filteredTodos = todos
        .filter((todo) => {
            if (filter === "complete") return todo.completed;
            if (filter === "incomplete") return !todo.completed;
            return true;
        })
        .filter((todo) => todo.text.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="todo-container d-flex">
            <h1 className="todo-text-pri text-center">TODO LIST</h1>
            <div className="todo-search d-flex">
                <TextField
                    label="Search Todos..."
                    variant="outlined"
                    color="secondary"
                    size="small"
                    sx={{ width: "45%" }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        endAdornment: (
                        <InputAdornment position="end">
                            <SearchOutlined sx={{color:"#6C63FF"}}/>
                        </InputAdornment>
                        ),
                    }}
                />
                <Select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    variant="outlined"
                    className="purple-bg todo-filter"
                    size="small"
                >
                    <MenuItem className="todo-text-pen todo-menu" value="all">All</MenuItem>
                    <MenuItem className="todo-text-pen todo-menu" value="incomplete">Incomplete</MenuItem>
                    <MenuItem className="todo-text-pen todo-menu" value="complete">Complete</MenuItem>
                </Select>
                <ThemeSwitcher />
            </div>

            {/* No Tasks Image */}
            {filteredTodos.length === 0 ? (
                <div>
                    <img src={TodoImage} width={"20%"} className="d-flex m-auto" alt="No tasks" />
                    <p className="todo-text-ter text-center">Empty...</p>
                </div>
            ) : (
                <ul className="todo-list">
                    {filteredTodos.map((todo) => (
                        <li
                            key={todo.id}
                        >
                            <div className="d-flex" style={{justifyContent: "space-between"}}>
                                <div className="d-flex" style={{alignItems: "center"}}>
                                    <Checkbox
                                        checked={todo.completed}
                                        onChange={() => toggleComplete(todo.id)}
                                        className="todo-checkbox"
                                        sx={{                              
                                            "& .MuiSvgIcon-root path": {
                                                fill: "#6c63ff", 
                                            },
                                        }}
                                    />
                                    {editingId === todo.id ? (
                                        <TextField
                                            variant="outlined"
                                            size="medium"
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            onBlur={saveEdit}
                                            autoFocus
                                        />
                                    ) : (
                                        <span
                                            className={`cursor-pointer ${
                                                todo.completed ? "text-strike todo-text-ter" : "todo-text-ter"
                                            }`}
                                            onClick={() => startEditing(todo.id, todo.text)}
                                        >
                                            {todo.text}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <IconButton  onClick={() => startEditing(todo.id, todo.text)}>
                                        <EditOutlined className="edit-todo"/>
                                    </IconButton>
                                    <IconButton onClick={() => deleteTodo(todo.id)}>
                                        <DeleteOutlined className="delete-todo"/>
                                    </IconButton>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Floating Add Button */}
            <IconButton
                onClick={() => setOpenDialog(true)}
            >
                <Add  className="add-todo purple-bg"/>
            </IconButton>

            {/* Add Task Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>New Note</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Enter task description"
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={addTodo} color="primary" variant="contained">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TodoList;
