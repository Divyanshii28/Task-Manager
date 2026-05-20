package com.taskmanager.task_manager.repository;

import com.taskmanager.task_manager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Find tasks by status
    List<Task> findByStatus(Task.Status status);

    // Find tasks by priority
    List<Task> findByPriority(Task.Priority priority);

    // Find tasks by status and priority together
    List<Task> findByStatusAndPriority(Task.Status status, Task.Priority priority);

    // Find tasks whose title contains a keyword (search)
    List<Task> findByTitleContainingIgnoreCase(String keyword);
}