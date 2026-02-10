/**
 * Pagination middleware - wrapper for Prisma models
 * Provides a generic pagination function
 */

import { PaginationParam, PaginationResult } from './pagination.types';

/**
 * Prisma delegate interface - any model with findMany and count
 */
interface PrismaDelegate<T> {
  findMany: (args: any) => Promise<T[]>;
  count: (args: any) => Promise<number>;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

/**
 * Parse pick string into Prisma select object
 * Ex: "id created_at" -> { id: true, created_at: true }
 */
const parsePick = (pick: string): Record<string, boolean> | undefined => {
  if (!pick?.trim()) return undefined;
  const fields = pick.trim().split(/\s+/);
  return Object.fromEntries(fields.map((f) => [f, true]));
};

/**
 * Parse populate string into Prisma include object
 * Ex: "reactions" -> { reactions: true }
 */
const parsePopulate = (populate: string): Record<string, boolean> | undefined => {
  if (!populate?.trim()) return undefined;
  const relations = populate.trim().split(/[\s,]+/);
  return Object.fromEntries(relations.map((r) => [r, true]));
};

/**
 * Build Prisma orderBy from sort_by and direction
 */
const parseOrderBy = (
  sort_by?: string,
  direction?: string
): Record<string, 'asc' | 'desc'> | undefined => {
  if (!sort_by?.trim()) return undefined;
  const dir = direction?.toLowerCase() === 'asc' ? 'asc' : 'desc';
  return { [sort_by.trim()]: dir };
};

/**
 * Pagination wrapper - fetches paginated data from any Prisma model delegate
 *
 * @param delegate - Prisma model delegate (e.g. prisma.kudo)
 * @param params - Pagination and query params (PaginationParam & where)
 * @returns PaginationResult with data and pagination metadata
 *
 * @example
 * const result = await pagination(prisma.kudo, {
 *   page: 1,
 *   limit: 20,
 *   sort_by: 'created_at',
 *   direction: 'desc',
 *   populate: 'reactions',
 *   where: { sender_id: userId }
 * });
 */
export const pagination = async <T>(
  delegate: PrismaDelegate<T>,
  params: PaginationParam & { where?: any }
): Promise<PaginationResult<T>> => {
  const page = Math.max(1, params.page ?? DEFAULT_PAGE);
  const limit = Math.min(100, Math.max(1, params.limit ?? DEFAULT_LIMIT));
  const skip = (page - 1) * limit;

  const where = params.where ?? {};

  const selectOpt = parsePick(params.pick ?? '');
  const includeOpt = parsePopulate(params.populate ?? '');

  // Reason: Prisma select and include are mutually exclusive - pick takes precedence
  const findManyArgs: any = {
    where,
    skip,
    take: limit,
    orderBy: parseOrderBy(params.sort_by, params.direction)
  };
  if (selectOpt) findManyArgs.select = selectOpt;
  else if (includeOpt) findManyArgs.include = includeOpt;

  const [data, total_results] = await Promise.all([
    delegate.findMany(findManyArgs),
    delegate.count({ where })
  ]);

  const total_pages = Math.ceil(total_results / limit) || 1;

  return {
    data,
    pagination: {
      page,
      limit,
      total_pages,
      total_results
    }
  };
};
