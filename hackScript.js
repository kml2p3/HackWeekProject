angular.module('todoApp', [])
	.controller('TodoListController', function() {
	
		var todoList = this;

		todoList.todos = (localStorage.getItem('todos')!==null) ? JSON.parse(localStorage.getItem('todos')) : [];
 
		todoList.addTodo = function() {
			todoList.todos.push( {text:todoList.todoText, done:false} );
			todoList.todoText = '';
			localStorage.setItem('todos', JSON.stringify(todoList.todos));
		};
 
		todoList.remaining = function() {
			var count = 0;
		
			angular.forEach(todoList.todos, function(todo) {
				count += todo.done ? 0 : 1;
			});
		
			return count;
		};
 
		todoList.archive = function() {
			var oldTodos = todoList.todos;
		
			todoList.todos = [];
		
			angular.forEach(oldTodos, function(todo) {
				if (!todo.done) todoList.todos.push(todo);
			});
			
			localStorage.setItem('todos', JSON.stringify(todoList.todos));
		};
		
		todoList.refresh = function(checked) {
            	      	
            	var tempTodos = JSON.parse(localStorage.getItem('todos'));

				angular.forEach(tempTodos, function(todo) {

					if(angular.equals(checked.todo.text, todo.text)){
						todo.done = !todo.done; 
							
						localStorage.setItem("todos", JSON.stringify(tempTodos));
					}
				});
            }
	});