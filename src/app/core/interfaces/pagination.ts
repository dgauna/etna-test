export interface Pagination {
    current_page:number;
    page_size: number;
    completed : boolean,
    searchText?: string
}