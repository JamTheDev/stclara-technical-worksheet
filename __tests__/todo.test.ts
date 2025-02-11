import { todoReducer } from "../lib/stores/todo.store";
import {
  createTodo,
  getTodo,
  getAllTodos,
  updateTodo,
  deleteTodo,
} from "../lib/actions/todo.actions";
import { Todo } from "../lib/stores/todo.store";
import { makeAuthStore, makeTodolistStore } from "@/lib/store";
import { loginUser } from "@/lib/actions/auth.actions";
import { generateCUID } from "@/utils/cuid";
import { credentialsUserA } from "../utils/_config";

describe("Todo Store", () => {
  let initialState: {
    todos: Todo[];
    selectedTodo: Todo | null;
    isLoading: boolean;
    error: string | null;
  };

  beforeEach(() => {
    initialState = {
      todos: [],
      selectedTodo: null,
      isLoading: false,
      error: null,
    };
  });

  describe("createTodo", () => {
    it("should handle pending action", () => {
      const action = { type: createTodo.pending.type };
      const state = todoReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle fulfilled action", () => {
      const newTodo: Todo = {
        id: "1",
        userId: "user1",
        title: "Test Todo",
        description: "Test Description",
        completed: false,
        createdAt: new Date(),
        dueDate: new Date(),
      };
      const action = { type: createTodo.fulfilled.type, payload: newTodo };
      const state = todoReducer({ ...initialState, isLoading: true }, action);
      expect(state.isLoading).toBe(false);
      expect(state.todos).toHaveLength(1);
      expect(state.todos[0]).toEqual(newTodo);
    });

    it("should handle rejected action", () => {
      const errorMsg = "Error creating todo";
      const action = { type: createTodo.rejected.type, payload: errorMsg };
      const state = todoReducer({ ...initialState, isLoading: true }, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMsg);
    });
  });

  describe("getTodo", () => {
    it("should handle pending action", () => {
      const action = { type: getTodo.pending.type };
      const state = todoReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle fulfilled action", () => {
      const todoItem: Todo = {
        id: "1",
        userId: "user1",
        title: "Single Todo",
        description: "Some Description",
        completed: false,
        createdAt: new Date(),
        dueDate: null,
      };
      const action = { type: getTodo.fulfilled.type, payload: todoItem };
      const state = todoReducer({ ...initialState, isLoading: true }, action);
      expect(state.isLoading).toBe(false);
      expect(state.selectedTodo).toEqual(todoItem);
    });

    it("should handle rejected action", () => {
      const errorMsg = "Error fetching todo";
      const action = { type: getTodo.rejected.type, payload: errorMsg };
      const state = todoReducer({ ...initialState, isLoading: true }, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMsg);
    });
  });

  describe("getAllTodos", () => {
    it("should handle pending action", () => {
      const action = { type: getAllTodos.pending.type };
      const state = todoReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle fulfilled action", () => {
      const todos: Todo[] = [
        {
          id: "1",
          userId: "user1",
          title: "Todo 1",
          description: null,
          completed: false,
          createdAt: new Date(),
          dueDate: null,
        },
        {
          id: "2",
          userId: "user1",
          title: "Todo 2",
          description: "Desc",
          completed: true,
          createdAt: new Date(),
          dueDate: null,
        },
      ];
      const action = { type: getAllTodos.fulfilled.type, payload: todos };
      const state = todoReducer({ ...initialState, isLoading: true }, action);
      expect(state.isLoading).toBe(false);
      expect(state.todos).toEqual(todos);
    });

    it("should handle rejected action", () => {
      const errorMsg = "Error fetching todos";
      const action = { type: getAllTodos.rejected.type, payload: errorMsg };
      const state = todoReducer({ ...initialState, isLoading: true }, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMsg);
    });
  });

  describe("updateTodo", () => {
    it("should handle pending action", () => {
      const action = { type: updateTodo.pending.type };
      const state = todoReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should update an existing todo on fulfilled", () => {
      const existingTodo: Todo = {
        id: "1",
        userId: "user1",
        title: "Old Title",
        description: "Old Desc",
        completed: false,
        createdAt: new Date(),
        dueDate: null,
      };
      const updatedTodo: Todo = {
        ...existingTodo,
        title: "Updated Title",
        completed: true,
      };
      const stateWithTodo = {
        ...initialState,
        todos: [existingTodo],
        selectedTodo: existingTodo,
        isLoading: true,
      };
      const action = { type: updateTodo.fulfilled.type, payload: updatedTodo };
      const state = todoReducer(stateWithTodo, action);
      expect(state.isLoading).toBe(false);
      expect(state.todos[0]).toEqual(updatedTodo);
      expect(state.selectedTodo).toEqual(updatedTodo);
    });

    it("should handle rejected action", () => {
      const errorMsg = "Error updating todo";
      const action = { type: updateTodo.rejected.type, payload: errorMsg };
      const state = todoReducer({ ...initialState, isLoading: true }, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMsg);
    });
  });

  describe("deleteTodo", () => {
    it("should handle pending action", () => {
      const action = { type: deleteTodo.pending.type };
      const state = todoReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should remove a todo on fulfilled", () => {
      const existingTodo: Todo = {
        id: "1",
        userId: "user1",
        title: "Title",
        description: null,
        completed: false,
        createdAt: new Date(),
        dueDate: null,
      };
      const stateWithTodo = {
        ...initialState,
        todos: [existingTodo],
        selectedTodo: existingTodo,
        isLoading: true,
      };
      // The fulfilled payload for deleteTodo contains an object with the id of the deleted Todo.
      const action = { type: deleteTodo.fulfilled.type, payload: { id: "1" } };
      const state = todoReducer(stateWithTodo, action);
      expect(state.isLoading).toBe(false);
      expect(state.todos).toHaveLength(0);
      expect(state.selectedTodo).toBeNull();
    });

    it("should handle rejected action", () => {
      const errorMsg = "Error deleting todo";
      const action = { type: deleteTodo.rejected.type, payload: errorMsg };
      const state = todoReducer({ ...initialState, isLoading: true }, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMsg);
    });
  });
});

describe("Todo Actions", () => {
  const todoStore = makeTodolistStore();
  const authStore = makeAuthStore();

  it("should not create a new todo for unauthenticated user", async () => {
    todoStore
      .dispatch(
        createTodo({
          title: "Test Todo",
          description: "Test Description",
          dueDate: new Date(),
        })
      )
      .then((result) => {
        expect(result).toHaveProperty("error");
      });
  });

  it("should not fetch a todo for unauthenticated user", async () => {
    todoStore.dispatch(getTodo(generateCUID())).then((result) => {
      expect(result).toHaveProperty("error");
    });
  });

  it("should create a new todo for authenticated user", async () => {
    await authStore.dispatch(loginUser({
        email: credentialsUserA.email,
        password: credentialsUserA.password,
    }));
    const newTodo = {
      title: "Test Todo",
      description: "Test Description",
      dueDate: new Date(),
    };
    const result = await todoStore.dispatch(createTodo(newTodo));
    expect(result).toHaveProperty("payload");
    expect(result.payload).toHaveProperty("title", newTodo.title);
    expect(result.payload).toHaveProperty("description", newTodo.description);
  });

  it("should fetch a todo for authenticated user", async () => {
    const _ = await authStore.dispatch(loginUser({
        email: credentialsUserA.email,
        password: credentialsUserA.password,
    }));
    const todos = await todoStore.dispatch(getAllTodos());
    const todoId = (todos.payload as any)[0].id;
    const result = await todoStore.dispatch(getTodo(todoId));
    expect(result).toHaveProperty("payload");
    expect(result.payload).toHaveProperty("id", todoId);
  });

  it("should enable an authenticated user to mark a todo as complete", async () => {
    const _ = await authStore.dispatch(loginUser({
        email: credentialsUserA.email,
        password: credentialsUserA.password,
    }));
    const todos = await todoStore.dispatch(getAllTodos());
    const todo = (todos.payload as any)[0];
    const result = await todoStore.dispatch(
      updateTodo({ ...todo, completed: true })
    );
    expect(result).toHaveProperty("payload");
    expect(result.payload).toHaveProperty("completed", true);
  });
});
