export interface ApiErrorMessage {
    status?: number;
    type?: string;
    title?: string;
    errors?: {[key: string]: string[]}
}
