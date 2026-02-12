type Task = () => Promise<void>;

class Queue {
	private readonly tasks: Task[] = [];

	private isProcessing = false;

	addTask(task: Task): void {
		this.tasks.push(task);
		if (!this.isProcessing) {
			this.processNext(); // Explicit void to avoid unhandled promise lint error
		}
	}

	private async processNext(): Promise<void> {
		if (this.tasks.length === 0) {
			this.isProcessing = false;
			return;
		}

		this.isProcessing = true;
		const task = this.tasks.shift();

		if (task) {
			try {
				await task();
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error("Task failed:", error);
			} finally {
				this.processNext(); // Explicit void to avoid unhandled promise lint error
			}
		}
	}
}

export const queue = new Queue();
