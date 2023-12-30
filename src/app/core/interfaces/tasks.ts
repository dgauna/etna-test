export interface TaskWriteModel {
    id?: number;
    title: string;
    description: string;
    priority: number;
    category_id: number;
}

export interface TaskReadModel {
    id: number;
    title: string;
    description: string;
    category_name: string;
    category_id: number;
    priority: number;
    is_completed: boolean;
    last_update_date: Date;
}