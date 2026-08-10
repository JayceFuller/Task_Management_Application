/** Model for the Task table in the database */
class Task {
    constructor(task) {
        this.TaskId = task.TaskId;
        this.TaskName = task.TaskName;
        this.TaskDesc = task.TaskDesc;
        this.DueDate = new Date(task.DueDate),
        this.PriorityLevel = task.PriorityLevel;
        this.ListId = task.ListId;
        this.IsCompleted = Boolean(task.IsCompleted)
    }

    convertToDBFormat() {
        return {
            TaskId: this.TaskId,
            TaskName: this.TaskName,
            TaskDesc: this.TaskDesc,
            DueDate: this.DueDate.toISOString(),
            PriorityLevel: this.PriorityLevel,
            ListId: this.ListId,
            IsCompleted: this.IsCompleted
        };
    }
}

module.exports = { Task };