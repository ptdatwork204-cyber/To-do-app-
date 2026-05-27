package com.dat.todo.controller;
import com.dat.todo.util.JwtUtil;
import com.dat.todo.model.Todo;
import com.dat.todo.service.TodoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.sql.SQLException;
import java.util.*;
import java.util.HashMap;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:5173")
public class TodoController {

    private final TodoService service;

    public TodoController(TodoService service) {
        this.service = service;
    }

    //  GET todos by user
    @GetMapping
    public List<Todo> getTodos(@RequestHeader("Authorization") String authHeader) throws SQLException {

    String token = authHeader.replace("Bearer ", "");
    int userId = JwtUtil.extractUserId(token);

    return service.getTodos(userId);
    }

    // ADD todo
    @PostMapping
    public void addTodo(
        @RequestBody Map<String, String> body,
        @RequestHeader("Authorization") String authHeader
    ) throws SQLException {

    String token = authHeader.replace("Bearer ", "");
    int userId = JwtUtil.extractUserId(token);

    String title = body.get("title");
    String priority = body.get("priority");
    String dueDate = body.get("dueDate");
    String repeatType = body.get("repeatType");

    service.addTodo(
        title,
        priority,
        dueDate,
        repeatType,
        userId
    );
}

    //  DELETE (FIXED)
    @DeleteMapping("/{id}")
    public void deleteTodo(
        @PathVariable int id,
        @RequestHeader("Authorization") String authHeader
    ) throws SQLException {

        String token = authHeader.replace("Bearer ", "");
        int userId = JwtUtil.extractUserId(token);

        service.deleteTodo(id, userId);
    }

    //  UPDATE (FIXED)
    @PutMapping("/{id}")
    public void updateTodo(
        @PathVariable int id,
        @RequestBody Map<String, Boolean> body,
        @RequestHeader("Authorization") String authHeader
    ) throws SQLException {

        String token = authHeader.replace("Bearer ", "");
        int userId = JwtUtil.extractUserId(token);

        boolean completed = body.get("completed");

        service.updateTodo(id, completed, userId);
    }

    // GET user info
    @GetMapping("/me")
    public Map<String, String> getUser(@RequestHeader("Authorization") String authHeader) throws SQLException {
        String token = authHeader.replace("Bearer ", "");
        int userId = JwtUtil.extractUserId(token);

        String name = service.getDisplayName(userId);

        Map<String, String> res = new HashMap<>();
        res.put("name", name);

        return res;
    }


    // UPDATE display name
    @PutMapping("/me")
    public void updateUser(
        @RequestHeader("Authorization") String authHeader,
        @RequestBody Map<String, String> body
    ) throws SQLException {

        String token = authHeader.replace("Bearer ", "");
        int userId = JwtUtil.extractUserId(token);

        service.updateDisplayName(userId, body.get("name"));
    }
    @GetMapping("/admin/analytics")
    public Map<String, Integer> getAnalytics(
            @RequestHeader("Authorization") String authHeader
    ) throws SQLException {

        String token = authHeader.replace("Bearer ", "");

        int userId = JwtUtil.extractUserId(token);

        return service.getAnalytics(userId);
    }
}