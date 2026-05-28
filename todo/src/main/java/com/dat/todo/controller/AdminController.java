package com.dat.todo.controller;

import com.dat.todo.service.TodoService;
import com.dat.todo.util.JwtUtil;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final TodoService service;

    public AdminController(TodoService service) {
        this.service = service;
    }

    @GetMapping("/todos")
    public List<Map<String, Object>> getAllTodos(
        @RequestHeader("Authorization") String authHeader
    ) throws SQLException {

        String token = authHeader.replace("Bearer ", "");
        int userId = JwtUtil.extractUserId(token);

        return service.getAllTodosAdmin(userId);
    }
}