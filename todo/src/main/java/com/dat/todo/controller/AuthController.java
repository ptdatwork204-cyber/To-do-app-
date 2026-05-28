package com.dat.todo.controller;
import io.github.bucket4j.Bucket;
import com.dat.todo.config.RateLimiterConfig;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.dat.todo.service.TodoService;
import com.dat.todo.util.JwtUtil;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final TodoService service;
    private final RateLimiterConfig rateLimiter;

    public AuthController(TodoService service, RateLimiterConfig rateLimiter) {
        this.service = service;
        this.rateLimiter = rateLimiter;
    }

    @PostMapping("/register")
    public void register(@RequestBody Map<String, String> body) throws SQLException {
        String email = body.get("email");
        String password = body.get("password");

        service.register(email, password);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @RequestBody Map<String, String> body,
            HttpServletRequest request
    ) throws SQLException {

    Bucket bucket = rateLimiter.resolveBucket(request.getRemoteAddr());

    if (!bucket.tryConsume(1)) {
        return ResponseEntity
                .status(HttpStatus.TOO_MANY_REQUESTS)
                .body(Map.of("error", "Too many requests. Try again later."));
    }

    String email = body.get("email");
    String password = body.get("password");

    int userId = service.login(email, password);

    String token = JwtUtil.generateToken(userId);

    Map<String, String> res = new HashMap<>();
    res.put("token", token);

    return ResponseEntity.ok(res);
}
}