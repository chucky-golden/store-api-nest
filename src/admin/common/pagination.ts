import { Model } from 'mongoose';

export interface PaginationResult<T> {
    data: T[];
    totalDocuments: number;
    hasPreviousPage: boolean;
    previousPage: number | null;
    hasNextPage: boolean;
    nextPage: number | null;
    totalPages: number;
    currentPage: number;
}

export async function paginate<T>(model: Model<T>, query: any, additionalFilter: Record<string, any> = {}): Promise<PaginationResult<T>> {
    const resPerPage = 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const totalDocuments = await model.countDocuments(additionalFilter);
    const data = await model.find(additionalFilter).sort({ createdAt: -1 }).skip(skip).limit(resPerPage);

    const totalPages = Math.ceil(totalDocuments / resPerPage);
    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;

    return {
        data,
        totalDocuments,
        hasPreviousPage,
        previousPage: hasPreviousPage ? currentPage - 1 : null,
        hasNextPage,
        nextPage: hasNextPage ? currentPage + 1 : null,
        totalPages,
        currentPage
    };
}
