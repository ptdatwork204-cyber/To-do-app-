package com.dat.todo.service;

import com.dat.todo.model.Activity;
import com.dat.todo.repository.ActivityRepository;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository repo;

    public ActivityService(ActivityRepository repo) {
        this.repo = repo;
    }

    public void logActivity(
        int userId,
        String action,
        String taskTitle,
        Integer todoId,
        String details
    ) {
        try {
            repo.save(userId, action, taskTitle, todoId, details);
        } catch (SQLException e) {
            System.err.println("Failed to log activity: " + e.getMessage());
        }
    }

    public List<Activity> getAllActivities(int limit) {
        try {
            return repo.findAll(limit);
        } catch (SQLException e) {
            System.err.println("Failed to fetch activities: " + e.getMessage());
            return List.of();
        }
    }

    public List<Activity> getUserActivities(int userId, int limit) {
        try {
            return repo.findByUserId(userId, limit);
        } catch (SQLException e) {
            System.err.println("Failed to fetch user activities: " + e.getMessage());
            return List.of();
        }
    }
}