import { TaskStatus } from "../domain/task-status.enum";
import { Transitions } from "../domain/task-transitions.enum";

export class TaskStatusHandler {
  private static readonly transitions = {
    [Transitions.START]: {
      from: [TaskStatus.PENDING],
      to: TaskStatus.IN_PROGRESS,
    },
    [Transitions.COMPLETE]: {
      from: [TaskStatus.IN_PROGRESS],
      to: TaskStatus.COMPLETED,
    },
    [Transitions.CANCEL]: {
      from: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS],
      to: TaskStatus.CANCELLED,
    },
    [Transitions.RESET]: {
      from: [TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED, TaskStatus.CANCELLED],
      to: TaskStatus.PENDING,
    },
  };

  static handle(action: Transitions, current: TaskStatus): TaskStatus {
    const rule = this.transitions[action];
    if (!rule) throw new Error(`Invalid action: ${action}`);

    if (!rule.from.includes(current)) {
      throw new Error(`Invalid transition from ${current} using ${action}`);
    }

    return rule.to;
  }
}
