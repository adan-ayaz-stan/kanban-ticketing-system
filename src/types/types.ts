export interface User {
    id: string;
    aud: string;
    email: string;
    phone: string;
    role: string;
    aal: string;
    session_id: string;
}

export interface Project {
    created_at: string;
    name: string;
    ownership: string;
    project_id: string;
    task_categories: string[];
}