package com.dat.todo.model;

public class Todo {

    private int id;
    private String title;
    private boolean completed;
    private String createdAt;
    private String completedAt;
    private String deletedAt;
    private String priority;
    private String dueDate;
    private String repeatType;

    // constructor
    public Todo(
        int id,
        String title,
        boolean completed,
        String createdAt,
        String completedAt,
        String deletedAt,
        String priority,
        String dueDate,
        String repeatType
    ) {

        this.id = id;
        this.title = title;
        this.completed = completed;
        this.createdAt = createdAt;
        this.completedAt = completedAt;
        this.deletedAt = deletedAt;
        this.priority = priority;
        this.dueDate = dueDate;
        this.repeatType = repeatType;
    }

    // default constructor
    public Todo() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(String completedAt) {
        this.completedAt = completedAt;
    }

    public String getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(String deletedAt) {
        this.deletedAt = deletedAt;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getRepeatType() {
        return repeatType;
    }

    public void setRepeatType(String repeatType) {
        this.repeatType = repeatType;
    }
}