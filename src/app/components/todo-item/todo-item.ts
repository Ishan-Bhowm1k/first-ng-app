import { Component, input, output } from '@angular/core';
import { Todo } from '../../model/todo.type';
import { UpperCasePipe } from '@angular/common';
import { HighlightCompletedTodoDirective } from '../../directives/highlight-completed-todo';

@Component({
  selector: 'app-todo-item',
  imports: [UpperCasePipe, HighlightCompletedTodoDirective],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.scss',
})
export class TodoItem {
  todo = input.required<Todo>();
  todoToggled = output<Todo>();

  todoClicked() {
    this.todoToggled.emit(this.todo());
  }
}
