import { Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { TodosService } from '../services/todos';
import { Todo } from '../model/todo.type';
import { catchError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todos',
  imports: [FormsModule, CommonModule],
  templateUrl: './todos.html',
  styleUrl: './todos.scss',
  
})
export class Todos implements OnInit {
  todosService = inject(TodosService);
  todoItems = signal<Todo[]>([]);
  showAddInput = signal(false);
  newTodoText = signal('');
  editingId = signal<number | null>(null);
  editingText = signal('');

  private readonly STORAGE_KEY='todoItems';

  ngOnInit() {
    const savedTodos = this.loadTodosFromStorage();

    if (savedTodos && savedTodos.length > 0) {
      this.todoItems.set(savedTodos);
    } 
  }

  loadTodosFromStorage():Todo[] | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading todos from localStorage:', error);
      return null;
    }
  }

  saveTodosToStorage(todos: Todo[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos to localStorage:', error);
    }
  }

  toggleTodo(id: number) {
    this.todoItems.update(todos => {
      const updated = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      this.saveTodosToStorage(updated);
      return updated;
    });
  }

  addNewTodo() {
    this.showAddInput.set(true);
    this.newTodoText.set('');
  }

  saveNewTodo() {
    const text = this.newTodoText().trim();
    if (text) {
      const newTodo: Todo = {
        id: Date.now(),
        title: text,
        completed: false,
        userId: 1
      };
      this.todoItems.update(items => {
        const updatedItems = [...items, newTodo];
        this.saveTodosToStorage(updatedItems);
        return updatedItems;
      });
      this.showAddInput.set(false);
    }
  }

  cancelAddTodo() {
    this.showAddInput.set(false);
  }

  deleteTodo(id: number) {
    this.todoItems.update(items => {
      const updated = items.filter(todo => todo.id !== id);
      this.saveTodosToStorage(updated);
      return updated;
    });
  }

  // start editing a todo
  startEdit(todo: Todo) {
    this.editingId.set(todo.id);
    this.editingText.set(todo.title);
  }

  // save edited todo
  saveEdit(id: number) {
    const text = this.editingText().trim();
    if (!text) {
      this.cancelEdit();
      return;
    }
    this.todoItems.update(items => {
      const updated = items.map(t => t.id === id ? { ...t, title: text } : t);
      this.saveTodosToStorage(updated);
      return updated;
    });
    this.editingId.set(null);
    this.editingText.set('');
  }

  // cancel editing
  cancelEdit() {
    this.editingId.set(null);
    this.editingText.set('');
  }
}