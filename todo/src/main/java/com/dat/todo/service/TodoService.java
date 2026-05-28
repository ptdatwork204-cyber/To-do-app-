package com.dat.todo.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.dat.todo.model.Todo;
import com.dat.todo.repository.TodoRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

@Service
public class TodoService {

    private final TodoRepository repo;
    private final ActivityService activityService;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public TodoService(TodoRepository repo, ActivityService activityService) {
        this.repo = repo;
        this.activityService = activityService;
    }

    // GET TODOS
    public List<Todo> getTodos(int userId) throws SQLException {
        return repo.findAllByUser(userId);
    }

    // ADD TODO
    public void addTodo(
            String title,
            String priority,
            String dueDate,
            String repeatType,
            String category,
            int userId
    ) throws SQLException {

        repo.save(title, priority, dueDate, repeatType, category, userId);

        String details = String.format("Priority: %s, Due: %s, Repeat: %s, Category: %s",
            priority, dueDate != null && !dueDate.isEmpty() ? dueDate : "None",
            repeatType, category);
        activityService.logActivity(userId, "TASK_CREATED", title, null, details);
    }

    // DELETE TODO
    public void deleteTodo(int id, int userId) throws SQLException {
        Todo todo = repo.findById(id);
        String title = todo.getTitle();

        repo.delete(id, userId);

        activityService.logActivity(userId, "TASK_DELETED", title, id, "Task deleted");
    }

    // UPDATE TODO (FIXED SAFE VERSION)
    public void updateTodo(int id, boolean completed, int userId) throws SQLException {

        Todo oldTodo = repo.findById(id);
        String oldTitle = oldTodo.getTitle();
        String oldPriority = oldTodo.getPriority();

        repo.updateStatus(id, completed, userId);

        if (completed) {
            activityService.logActivity(userId, "TASK_COMPLETED", oldTitle, id, "Task marked as completed");
        } else {
            activityService.logActivity(userId, "TASK_UNCOMPLETED", oldTitle, id, "Task marked as incomplete");
        }

        if (!completed) return;

        Todo todo = repo.findById(id);

        String repeatType = todo.getRepeatType();

        if (repeatType == null || repeatType.equals("NONE")) {
            return;
        }

        String dueDate = todo.getDueDate();

        String nextDate = null;

        if (dueDate != null && !dueDate.isEmpty()) {
            nextDate = calculateNextDate(dueDate, repeatType);
        }

        repo.save(
                todo.getTitle(),
                todo.getPriority(),
                nextDate,
                repeatType,
                todo.getCategory(),
                userId
        );
    }

    // Update priority
    public void updatePriority(int id, String priority, int userId) throws SQLException {
        Todo todo = repo.findById(id);
        String title = todo.getTitle();
        String oldPriority = todo.getPriority();

        repo.updatePriority(id, priority, userId);

        activityService.logActivity(userId, "PRIORITY_CHANGED", title, id,
            String.format("From %s to %s", oldPriority, priority));
    }

    // AUTH
    public void register(String email, String password) throws SQLException {
        String hashed = encoder.encode(password);
        repo.createUser(email, hashed);

        int userId = repo.findUserIdByEmail(email);
        activityService.logActivity(userId, "USER_REGISTERED", null, null, "New user registered");
    }

    public int login(String email, String password) throws SQLException {

        String hashed = repo.findPasswordByEmail(email);

        if (!encoder.matches(password, hashed)) {
            throw new RuntimeException("Invalid credentials");
        }

        return repo.findUserIdByEmail(email);
    }

    public String getDisplayName(int userId) throws SQLException {
        return repo.getDisplayName(userId);
    }

    public void updateDisplayName(int userId, String name) throws SQLException {
        String oldName = repo.getDisplayName(userId);
        repo.updateDisplayName(userId, name);

        activityService.logActivity(userId, "PROFILE_UPDATED", null, null,
            String.format("Display name changed from '%s' to '%s'", oldName, name));
    }

    public Map<String, String> getUserInfo(int userId) throws SQLException {

        Map<String, String> user = new HashMap<>();

        user.put("email", repo.getEmailById(userId));
        user.put("displayName", repo.getDisplayName(userId));
        user.put("role", repo.getRoleById(userId));

        return user;
    }

    public String getUserRole(int userId) throws SQLException {
        return repo.getRoleById(userId);
    }

    public List<Map<String, Object>> getAllTodosAdmin(int userId) throws SQLException {

        String role = repo.getRoleById(userId);

        if (!role.equals("ADMIN")) {
            throw new RuntimeException("Access denied");
        }

        return repo.getAllTodosAdmin();
    }

    public Map<String, Integer> getAnalytics(int userId) throws SQLException {

        String role = repo.getRoleById(userId);

        if (!role.equals("ADMIN")) {
            throw new RuntimeException("Access denied");
        }

        return repo.getAnalytics();
    }

    // SAFE DATE CALCULATOR
    private String calculateNextDate(String dueDate, String repeatType) {

        if (dueDate == null) return null;

        LocalDateTime date = LocalDateTime.parse(
                dueDate.replace(" ", "T")
        );

        switch (repeatType) {

            case "DAILY":
                date = date.plusDays(1);
                break;

            case "WEEKLY":
                date = date.plusWeeks(1);
                break;

            case "MONTHLY":
                date = date.plusMonths(1);
                break;

            default:
                return null;
        }

        return date.toString();
    }
}