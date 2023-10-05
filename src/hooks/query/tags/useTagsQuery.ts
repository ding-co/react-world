import { queryKeys } from '@/react-query/queryKeys';
import { useQuery } from '@tanstack/react-query';

import { getTags } from '@/api/tags';

export const useTagsQuery = ({
  headers = {},
  options = {},
}: {
  headers?: HeadersInit;
  options?: RequestInit;
}) => {
  const query = useQuery([queryKeys.GetTags], () =>
    getTags({ headers, options }),
  );

  return query;
};
