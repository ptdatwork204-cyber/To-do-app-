package com.dat.todo.service;

import com.dat.todo.repository.TodoRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ReminderScheduler {

    private final TodoRepository repo;
    private final EmailService emailService;

    public ReminderScheduler(
        TodoRepository repo,
        EmailService emailService
    ) {
        this.repo = repo;
        this.emailService = emailService;
    }

    @Scheduled(fixedRate = 60000)
    public void sendReminders() {

        try {

            List<Map<String, Object>> todos =
                repo.getUpcomingTodos();

            for (Map<String, Object> todo : todos) {

                try {

                    emailService.sendReminder(
                        (String) todo.get("email"),
                        (String) todo.get("title"),
                        String.valueOf(todo.get("dueDate"))
                    );

                    repo.markReminderSent(
                        (Integer) todo.get("id")
                    );

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}