package com.dat.todo.model;

public class Activity {

    private int id;
    private int userId;
    private String userEmail;
    private String userDisplayName;
    private String action;
    private String taskTitle;
    private Integer todoId;
    private String details;
    private String timestamp;

    public Activity() {}

    public Activity(
        int id,
        int userId,
        String userEmail,
        String userDisplayName,
        String action,
        String taskTitle,
        Integer todoId,
        String details,
        String timestamp
    ) {
        this.id = id;
        this.userId = userId;
        this.userEmail = userEmail;
        this.userDisplayName = userDisplayName;
        this.action = action;
        this.taskTitle = taskTitle;
        this.todoId = todoId;
        this.details = details;
        this.timestamp = timestamp;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserDisplayName() {
        return userDisplayName;
    }

    public void setUserDisplayName(String userDisplayName) {
        this.userDisplayName = userDisplayName;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getTaskTitle() {
        return taskTitle;
    }

    public void setTaskTitle(String taskTitle) {
        this.taskTitle = taskTitle;
    }

    public Integer getTodoId() {
        return todoId;
    }

    public void setTodoId(Integer todoId) {
        this.todoId = todoId;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}