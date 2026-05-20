package com.taskmanager.task_manager.service;

import com.taskmanager.task_manager.exception.TaskNotFoundException;
import com.taskmanager.task_manager.model.Task;
import com.taskmanager.task_manager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    // ── GET ALL TASKS ──────────────────────────────
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // ── GET TASK BY ID ─────────────────────────────
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(
                        "Task not found with id: " + id));
    }

    // ── CREATE TASK ────────────────────────────────
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    // ── UPDATE TASK ────────────────────────────────
    public Task updateTask(Long id, Task updatedTask) {
        Task existingTask = getTaskById(id);

        existingTask.setTitle(updatedTask.getTitle());
        existingTask.setDescription(updatedTask.getDescription());
        existingTask.setPriority(updatedTask.getPriority());
        existingTask.setDueDate(updatedTask.getDueDate());
        existingTask.setStatus(updatedTask.getStatus());

        return taskRepository.save(existingTask);
    }

    // ── DELETE TASK ────────────────────────────────
    public void deleteTask(Long id) {
        Task task = getTaskById(id);
        taskRepository.delete(task);
    }

    // ── TOGGLE STATUS ──────────────────────────────
    public Task toggleStatus(Long id) {
        Task task = getTaskById(id);

        if (task.getStatus() == Task.Status.PENDING) {
            task.setStatus(Task.Status.COMPLETED);
        } else {
            task.setStatus(Task.Status.PENDING);
        }

        return taskRepository.save(task);
    }

    // ── FILTER BY STATUS ───────────────────────────
    public List<Task> getTasksByStatus(Task.Status status) {
        return taskRepository.findByStatus(status);
    }

    // ── FILTER BY PRIORITY ─────────────────────────
    public List<Task> getTasksByPriority(Task.Priority priority) {
        return taskRepository.findByPriority(priority);
    }

    // ── SEARCH BY TITLE ────────────────────────────
    public List<Task> searchTasks(String keyword) {
        return taskRepository.findByTitleContainingIgnoreCase(keyword);
    }
}