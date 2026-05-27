package com.dat.todo.controller;

import com.dat.todo.service.TodoService;
import com.dat.todo.util.JwtUtil;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final TodoService service;

    public UserController(TodoService service) {
        this.service = service;
    }

    @GetMapping("/me")
    public Map<String, String> getUser(@RequestHeader("Authorization") String authHeader) throws SQLException {
        String token = authHeader.replace("Bearer ", "");
        int userId = JwtUtil.extractUserId(token);

        return service.getUserInfo(userId);
    }

    @PutMapping("/display-name")
    public void updateName(
        @RequestHeader("Authorization") String authHeader,
        @RequestBody Map<String, String> body
    ) throws SQLException {

        String token = authHeader.replace("Bearer ", "");
        int userId = JwtUtil.extractUserId(token);

        service.updateDisplayName(userId, body.get("displayName"));
    }
}