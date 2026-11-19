import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postDismissAnomaly, postReviewAnomaly } from '@/apis/anomaly';
import { ACTIVITY_LOGS_QUERY_KEY } from '@/queries/useActivityLogsQuery';
import { ANOMALIES_QUERY_KEY } from '@/queries/useAnomaliesQuery';

const useInvalidateAnomalies = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ANOMALIES_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: ACTIVITY_LOGS_QUERY_KEY }),
    ]);
};

export const useReviewAnomalyMutation = (anomalyId: number) => {
  const invalidate = useInvalidateAnomalies();
  return useMutation({
    mutationFn: (action: 'STOCK_PAUSE' | 'USER_BLOCK') => postReviewAnomaly(anomalyId, action),
    retry: false,
    onSuccess: invalidate,
  });
};

export const useDismissAnomalyMutation = (anomalyId: number) => {
  const invalidate = useInvalidateAnomalies();
  return useMutation({
    mutationFn: (reason: string) => postDismissAnomaly(anomalyId, reason),
    retry: false,
    onSuccess: invalidate,
  });
};
