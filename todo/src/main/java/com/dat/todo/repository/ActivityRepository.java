package com.dat.todo.repository;

import com.dat.todo.model.Activity;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

@Repository
public class ActivityRepository {
    private final DataSource dataSource;

    public ActivityRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public void save(
        int userId,
        String action,
        String taskTitle,
        Integer todoId,
        String details
    ) throws SQLException {
        String sql = "INSERT INTO activities (user_id, action, task_title, todo_id, details) VALUES (?, ?, ?, ?, ?)";

        try (
            Connection conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ) {
            ps.setInt(1, userId);
            ps.setString(2, action);
            ps.setString(3, taskTitle);
            if (todoId != null) {
                ps.setInt(4, todoId);
            } else {
                ps.setNull(4, Types.INTEGER);
            }
            ps.setString(5, details);
            ps.executeUpdate();
        }
    }

    public List<Activity> findAll(int limit) throws SQLException {
        String sql = "SELECT a.*, u.email, u.display_name FROM activities a JOIN users u ON a.user_id = u.id ORDER BY a.timestamp DESC LIMIT ?";
        List<Activity> list = new ArrayList<>();

        try (
            Connection conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ) {
            ps.setInt(1, limit);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Activity activity = new Activity(
                    rs.getInt("id"),
                    rs.getInt("user_id"),
                    rs.getString("email"),
                    rs.getString("display_name"),
                    rs.getString("action"),
                    rs.getString("task_title"),
                    rs.getObject("todo_id") != null ? rs.getInt("todo_id") : null,
                    rs.getString("details"),
                    rs.getString("timestamp")
                );
                list.add(activity);
            }
        }

        return list;
    }

    public List<Activity> findByUserId(int userId, int limit) throws SQLException {
        String sql = "SELECT a.*, u.email, u.display_name FROM activities a JOIN users u ON a.user_id = u.id WHERE a.user_id = ? ORDER BY a.timestamp DESC LIMIT ?";
        List<Activity> list = new ArrayList<>();

        try (
            Connection conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ) {
            ps.setInt(1, userId);
            ps.setInt(2, limit);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Activity activity = new Activity(
                    rs.getInt("id"),
                    rs.getInt("user_id"),
                    rs.getString("email"),
                    rs.getString("display_name"),
                    rs.getString("action"),
                    rs.getString("task_title"),
                    rs.getObject("todo_id") != null ? rs.getInt("todo_id") : null,
                    rs.getString("details"),
                    rs.getString("timestamp")
                );
                list.add(activity);
            }
        }

        return list;
    }
}