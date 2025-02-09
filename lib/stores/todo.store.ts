import { createSlice, configureStore } from "@reduxjs/toolkit";
import { createTodo, getTodo, getAllTodos, updateTodo, deleteTodo } from "../actions/todo.actions";
import { Payload } from "@prisma/client/runtime/library";

// Define the Todo interface based on your API
export interface Todo {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
  dueDate: Date | null;
}

interface TodoState {
  todos: Todo[];
  selectedTodo: Todo | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  selectedTodo: null,
  isLoading: false,
  error: null,
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create Todo
    builder.addCase(createTodo.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createTodo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.todos.push(action.payload);
    });
    builder.addCase(createTodo.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Get a single Todo
    builder.addCase(getTodo.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getTodo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedTodo = action.payload;
    });
    builder.addCase(getTodo.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Get all Todos
    builder.addCase(getAllTodos.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getAllTodos.fulfilled, (state, action) => {
      state.isLoading = false;
      state.todos = action.payload;
    });
    builder.addCase(getAllTodos.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update Todo
    builder.addCase(updateTodo.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateTodo.fulfilled, (state, action) => {
        console.log(action.payload);
      state.isLoading = false;
      state.todos = state.todos.map((t) =>
        t.id === action.payload.id ? action.payload : t
      );
      if (state.selectedTodo?.id === action.payload.id) {
        state.selectedTodo = action.payload;
      }
    });
    builder.addCase(updateTodo.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Delete Todo
    builder.addCase(deleteTodo.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteTodo.fulfilled, (state, action: Payload<any>) => {
        console.log(action.payload);
      state.todos = state.todos.filter((t) => t.id !== action.payload.id);
      if (state.selectedTodo?.id === action.payload.id) {
        state.selectedTodo = null;
      }
      state.isLoading = false;
    });
    builder.addCase(deleteTodo.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const todoReducer = todoSlice.reducer;

// Create the store for the Todo slice
export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});

// Optional: Infer the `RootState` and `AppDispatch` types for use in your app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
