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
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public TodoService(TodoRepository repo) {
        this.repo = repo;
    }

    //  USER-BASED TODOS ONLY
    public List<Todo> getTodos(int userId) throws SQLException {
        return repo.findAllByUser(userId);
    }

    public void addTodo(
        String title,
        String priority,
        String dueDate,
        String repeatType,
        int userId
        ) throws SQLException {

        repo.save(title, priority, dueDate, repeatType, userId);
    }

    public void deleteTodo(int id, int userId) throws SQLException {
        repo.delete(id, userId);
    }

    public void updateTodo(int id, boolean completed, int userId) throws SQLException {
        repo.updateStatus(id, completed, userId);
        // only when marking completed
        if (completed) {

            Todo todo = repo.findById(id);

            if (!todo.getRepeatType().equals("NONE")) {

                String nextDate =
                    calculateNextDate(
                        todo.getDueDate(),
                        todo.getRepeatType()
                    );

                repo.save(
                    todo.getTitle(),
                    todo.getPriority(),
                    nextDate,
                    todo.getRepeatType(),
                    userId
                    );
            }
        }
    }

    //  AUTH
    public void register(String email, String password) throws SQLException {
        String hashed = encoder.encode(password);
        repo.createUser(email, hashed);
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
        repo.updateDisplayName(userId, name);
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

    public Map<String, Integer> getAnalytics(int userId)
        throws SQLException {

    String role = repo.getRoleById(userId);

    if (!role.equals("ADMIN")) {
        throw new RuntimeException("Access denied");
    }

    return repo.getAnalytics();
    }

    private String calculateNextDate(
    String dueDate,
    String repeatType
) {

    LocalDateTime date =
        LocalDateTime.parse(
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
    }

    return date.toString();
}

}