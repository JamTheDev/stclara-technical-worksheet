export interface TodoItem {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: Date;
    dueDate?: Date;
}