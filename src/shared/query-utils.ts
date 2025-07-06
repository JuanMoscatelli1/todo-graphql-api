import { TaskFilterInput } from 'src/tasks/presentation/task-filter.input';
import { TaskOrderInput } from 'src/tasks/presentation/task-order.input';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export function applyDynamicFilters<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  alias: string,
  filters: Partial<TaskFilterInput>
): void {
  for (const [field, value] of Object.entries(filters || {})) {
    if (value !== undefined && value !== null) {
      query.andWhere(`${alias}.${field} = :${field}`, { [field]: value });
    }
  }
}

export function applyDynamicOrder<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  alias: string,
  order: Partial<TaskOrderInput>
): void {
  for (const [field, direction] of Object.entries(order || {})) {
    if (direction) {
      query.addOrderBy(`${alias}.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
    }
  }
}
