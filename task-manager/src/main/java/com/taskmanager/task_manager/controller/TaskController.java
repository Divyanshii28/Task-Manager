package com.taskmanager.task_manager.controller;

import com.taskmanager.task_manager.model.Task;
import com.taskmanager.task_manager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService taskService;

    // ── GET ALL TASKS ──────────────────────────────
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    // ── GET TASK BY ID ─────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    // ── CREATE TASK ────────────────────────────────
    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
        Task created = taskService.createTask(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ── UPDATE TASK ────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody Task task) {
        return ResponseEntity.ok(taskService.updateTask(id, task));
    }

    // ── DELETE TASK ────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    // ── TOGGLE STATUS ──────────────────────────────
    @PatchMapping("/{id}/status")
    public ResponseEntity<Task> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.toggleStatus(id));
    }

    // ── FILTER BY STATUS ───────────────────────────
    @GetMapping("/filter/status/{status}")
    public ResponseEntity<List<Task>> getByStatus(
            @PathVariable Task.Status status) {
        return ResponseEntity.ok(taskService.getTasksByStatus(status));
    }

    // ── FILTER BY PRIORITY ─────────────────────────
    @GetMapping("/filter/priority/{priority}")
    public ResponseEntity<List<Task>> getByPriority(
            @PathVariable Task.Priority priority) {
        return ResponseEntity.ok(taskService.getTasksByPriority(priority));
    }

    // ── SEARCH BY TITLE ────────────────────────────
    @GetMapping("/search")
    public ResponseEntity<List<Task>> searchTasks(
            @RequestParam String keyword) {
        return ResponseEntity.ok(taskService.searchTasks(keyword));
    }
}