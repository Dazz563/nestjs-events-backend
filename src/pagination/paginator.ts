import { SelectQueryBuilder } from "typeorm";

export interface PaginateOptions {
    limit: number;
    currentPage: number;
    total?: boolean;
}

export interface PaginationResult<T> {
    firstPage: number;
    lastPage: number;
    limit: number;
    total?: number;
    data: T[];
}

export async function paginate<T>(
    qb: SelectQueryBuilder<T>,
    options: PaginateOptions = {
        limit: 10,
        currentPage: 1
    }
): Promise<PaginationResult<T>> {
    const offset = (options.currentPage - 1) * options.limit;
    const data = await qb.limit(options.limit).offset(offset).getMany();

    return {
        firstPage: offset + 1,
        lastPage: offset + data.length,
        limit: options.limit,
        total: options.total ? await qb.getCount() : null,
        data
    }
}