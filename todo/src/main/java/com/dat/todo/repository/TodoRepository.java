// file: TodoRepository.java
package com.dat.todo.repository;

import com.dat.todo.model.Todo;
import org.springframework.stereotype.Repository;


import javax.sql.DataSource;
import java.sql.*;
import java.util.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class TodoRepository {
    private final DataSource dataSource;

    public TodoRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public List<Todo> findAllByUser(int userId) throws SQLException {
        String sql = "SELECT * FROM todos WHERE user_id = ?";
        List<Todo> list = new ArrayList<>();

        try (
            Connection conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ) {
            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                list.add(new Todo(
                rs.getInt("id"),
                rs.getString("title"),
                rs.getBoolean("completed"),
                rs.getString("created_at"),
                rs.getString("completed_at"),
                rs.getString("deleted_at"),
                rs.getString("priority"),
                rs.getString("due_date"),
                rs.getString("repeat_type"),
                rs.getString("category"),
                rs.getString("next_activation_at")
                ));
            }
        }

        return list;
    }

        public void save(
        String title,
        String priority,
        String dueDate,
        String repeatType,
        String category,
        int userId
        ) throws SQLException {
        String sql = "INSERT INTO todos (title, completed, user_id, priority, due_date, repeat_type, category, next_activation_at) VALUES (?, false, ?, ?, ?, ?, ?, ?)";

        try (
            Connection conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ) {
            ps.setString(1, title);
            ps.setInt(2, userId);
            ps.setString(3, priority);
            if (dueDate == null || dueDate.isEmpty()) {

                ps.setTimestamp(4, null);

            } else {

            ps.setTimestamp(
                4,
                Timestamp.valueOf(
                    dueDate.replace("T", " ") + ":00"
                )
            );
        }
            ps.setString(5, repeatType);
            ps.setString(6, category);
            ps.executeUpdate();
        }
    }

    public void delete(int id, int userId) throws SQLException {
        String sql = "DELETE FROM todos WHERE id = ? AND user_id = ?";

        try (
            Connection conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ) {
            ps.setInt(1, id);
            ps.setInt(2, userId);
            ps.executeUpdate();
        }
    }

    public void updateStatus(int id, boolean completed, int userId) throws SQLException {
        String sql = "UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?";

        try (
            Connection conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ) {
            ps.setBoolean(1, completed);
            ps.setInt(2, id);
            ps.setInt(3, userId);
            ps.executeUpdate();
        }
    }

    public void createUser(String email, String password) throws SQLException {
        String sql = "INSERT INTO users (email, password) VALUES (?, ?)";

        try (
            Connection conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ) {
            ps.setString(1, email);
            ps.setString(2, password);
            ps.executeUpdate();
        }
    }

    public String findPasswordByEmail(String email) throws SQLException {
    String sql = "SELECT password FROM users WHERE email = ?";

    try (
        Connection conn = dataSource.getConnection();
        PreparedStatement ps = conn.prepareStatement(sql)
    ) {
        ps.setString(1, email);
        ResultSet rs = ps.executeQuery();

        if (rs.next()) {
            return rs.getString("password");
        } else {
            throw new RuntimeException("User not found");
        }
    }
}

//  NEW METHOD 
    public int findUserIdByEmail(String email) throws SQLException {
    String sql = "SELECT id FROM users WHERE email = ?";

    try (
        Connection conn = dataSource.getConnection();
        PreparedStatement ps = conn.prepareStatement(sql)
    ) {
        ps.setString(1, email);
        ResultSet rs = ps.executeQuery();

        if (rs.next()) {
            return rs.getInt("id");
        } else {
            throw new RuntimeException("User not found");
        }
    }   
}
    
    public Todo findById(int id) throws SQLException {

    String sql = "SELECT * FROM todos WHERE id = ?";

    try (
        Connection conn = dataSource.getConnection();
        PreparedStatement ps = conn.prepareStatement(sql)
    ) {

        ps.setInt(1, id);

        ResultSet rs = ps.executeQuery();

        if (rs.next()) {

            return new Todo(
                rs.getInt("id"),
                rs.getString("title"),
                rs.getBoolean("completed"),
                rs.getString("created_at"),
                rs.getString("completed_at"),
                rs.getString("deleted_at"),
                rs.getString("priority"),
                rs.getString("due_date"),
                rs.getString("repeat_type"),
                rs.getString("category")
            );
        }

        throw new RuntimeException("Todo not found");
    }
}

    public String getDisplayName(int userId) throws SQLException {
    String sql = "SELECT display_name, email FROM users WHERE id = ?";

    try (
        Connection conn = dataSource.getConnection();
        PreparedStatement ps = conn.prepareStatement(sql)
    ) {
        ps.setInt(1, userId);
        ResultSet rs = ps.executeQuery();

        if (rs.next()) {
            String name = rs.getString("display_name");
            String email = rs.getString("email");

            return (name != null && !name.isEmpty()) ? name : email;
        } else {
            throw new RuntimeException("User not found");
        }
    }
}
    public void updateDisplayName(int userId, String name) throws SQLException {
    String sql = "UPDATE users SET display_name = ? WHERE id = ?";

    try (
        Connection conn = dataSource.getConnection();
        PreparedStatement ps = conn.prepareStatement(sql)
    ) {
        ps.setString(1, name);
        ps.setInt(2, userId);
        ps.executeUpdate();
    }
}
    public String getEmailById(int userId) throws SQLException {
    String sql = "SELECT email FROM users WHERE id = ?";

    try (
        Connection conn = dataSource.getConnection();
        PreparedStatement ps = conn.prepareStatement(sql)
    ) {
        ps.setInt(1, userId);
        ResultSet rs = ps.executeQuery();

        if (rs.next()) {
            return rs.getString("email");
        } else {
            throw new RuntimeException("User not found");
        }
    }
}

    public String getRoleById(int userId) throws SQLException {
        String sql = "SELECT role FROM users WHERE id = ?";

        try (
            Connection conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)
        ) {
            ps.setInt(1, userId);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                return rs.getString("role");
            }

            throw new RuntimeException("User not found");
        }
    }

    public List<Map<String, Object>> getAllTodosAdmin() throws SQLException {

    String sql = "SELECT\n"
        + "    todos.id,\n"
        + "    todos.title,\n"
        + "    todos.completed,\n"
        + "    todos.created_at,\n"
        + "    todos.completed_at,\n"
        + "    todos.deleted_at,\n"
        + "    todos.priority,\n"
        + "    todos.due_date,\n"
        + "    users.email,\n"
        + "    users.display_name\n"
        + "FROM todos\n"
        + "JOIN users ON todos.user_id = users.id\n"
        + "ORDER BY todos.created_at DESC";

    List<Map<String, Object>> list = new ArrayList<>();

    try (
        Connection conn = dataSource.getConnection();
        PreparedStatement ps = conn.prepareStatement(sql)
    ) {

        ResultSet rs = ps.executeQuery();

        while (rs.next()) {

            Map<String, Object> todo = new HashMap<>();

            todo.put("id", rs.getInt("id"));
            todo.put("title", rs.getString("title"));
            todo.put("completed", rs.getBoolean("completed"));

            todo.put("createdAt", rs.getTimestamp("created_at"));
            todo.put("completedAt", rs.getTimestamp("completed_at"));
            todo.put("deletedAt", rs.getTimestamp("deleted_at"));
            
            todo.put("priority", rs.getString("priority"));
            todo.put("dueDate", rs.getTimestamp("due_date"));

            todo.put("email", rs.getString("email"));
            todo.put("displayName", rs.getString("display_name"));

            
            list.add(todo);
        }
    }

    return list;
}
    public Map<String, Integer> getAnalytics() throws SQLException {

    Map<String, Integer> data = new HashMap<>();

    try (Connection conn = dataSource.getConnection()) {

        // total users
        PreparedStatement ps1 =
            conn.prepareStatement("SELECT COUNT(*) FROM users");

        ResultSet rs1 = ps1.executeQuery();

        if (rs1.next()) {
            data.put("totalUsers", rs1.getInt(1));
        }

        // total todos
        PreparedStatement ps2 =
            conn.prepareStatement("SELECT COUNT(*) FROM todos");

        ResultSet rs2 = ps2.executeQuery();

        if (rs2.next()) {
            data.put("totalTodos", rs2.getInt(1));
        }

        // completed todos
        PreparedStatement ps3 =
            conn.prepareStatement(
                "SELECT COUNT(*) FROM todos WHERE completed = true"
            );

        ResultSet rs3 = ps3.executeQuery();

        if (rs3.next()) {
            data.put("completedTodos", rs3.getInt(1));
        }

        // pending todos
        PreparedStatement ps4 =
            conn.prepareStatement(
                "SELECT COUNT(*) FROM todos WHERE completed = false"
            );

        ResultSet rs4 = ps4.executeQuery();

        if (rs4.next()) {
            data.put("pendingTodos", rs4.getInt(1));
        }

        // high priority
        PreparedStatement ps5 =
            conn.prepareStatement(
                "SELECT COUNT(*) FROM todos WHERE priority = 'HIGH'"
            );

        ResultSet rs5 = ps5.executeQuery();

        if (rs5.next()) {
            data.put("highPriority", rs5.getInt(1));
        }
    }

    return data;
}

    public List<Map<String, Object>>
getUpcomingTodos() throws SQLException {

    String sql =
        "SELECT " +
        "todos.id, " +
        "todos.title, " +
        "todos.due_date, " +
        "users.email " +
        "FROM todos " +
        "JOIN users " +
        "ON todos.user_id = users.id " +
        "WHERE completed = false " +
        "AND due_date IS NOT NULL " +
        "AND due_date <= NOW() + INTERVAL '24 HOURS' " +
        "AND reminder_sent = false";

    List<Map<String, Object>> list =
        new ArrayList<>();

    try (
        Connection conn =
            dataSource.getConnection();

        PreparedStatement ps =
            conn.prepareStatement(sql)
    ) {

        ResultSet rs = ps.executeQuery();

        while (rs.next()) {

            Map<String, Object> todo =
                new HashMap<>();

            todo.put(
                "id",
                rs.getInt("id")
            );

            todo.put(
                "title",
                rs.getString("title")
            );

            todo.put(
                "dueDate",
                rs.getTimestamp("due_date")
            );

            todo.put(
                "email",
                rs.getString("email")
            );

            list.add(todo);
        }
    }

    return list;
}

    public void markReminderSent(int todoId)
        throws SQLException {

        String sql =
            "UPDATE todos SET reminder_sent = true WHERE id = ?";

        try (
            Connection conn =
                dataSource.getConnection();

            PreparedStatement ps =
                conn.prepareStatement(sql)
        ) {

            ps.setInt(1, todoId);

            ps.executeUpdate();
        }
    }
}