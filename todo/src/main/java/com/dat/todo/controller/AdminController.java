package com.dat.todo.controller;

import com.dat.todo.model.Activity;
import com.dat.todo.service.ActivityService;
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
    private final ActivityService activityService;

    public AdminController(TodoService service, ActivityService activityService) {
        this.service = service;
        this.activityService = activityService;
    }

    @GetMapping("/todos")
    public List<Map<String, Object>> getAllTodos(
        @RequestHeader("Authorization") String authHeader
    ) throws SQLException {

        String token = authHeader.replace("Bearer ", "");
        int userId = JwtUtil.extractUserId(token);

        return service.getAllTodosAdmin(userId);
    }

    @GetMapping("/activities")
    public List<Activity> getAllActivities(
        @RequestHeader("Authorization") String authHeader,
        @RequestParam(defaultValue = "100") int limit
    ) {
        String token = authHeader.replace("Bearer ", "");
        int userId = JwtUtil.extractUserId(token);

        try {
            String role = service.getUserRole(userId);
            if (!role.equals("ADMIN")) {
                throw new RuntimeException("Access denied");
            }
        } catch (SQLException e) {
            throw new RuntimeException("Access denied");
        }

        return activityService.getAllActivities(limit);
    }
}