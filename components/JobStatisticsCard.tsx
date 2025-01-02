"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getJobStatistics } from "@/app/actions/getJobStatistics";

interface JobStatisticsCardProps {
  title: string;
  hasApplied: boolean;
}

export function JobStatisticsCard({
  title,
  hasApplied,
}: JobStatisticsCardProps) {
  const [state, setState] = useState<{
    count: number | null;
    error: string | null;
    isLoading: boolean;
  }>({ count: null, error: null, isLoading: true });

  useEffect(() => {
    const fetchStatistics = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));
      const { count, error } = await getJobStatistics(hasApplied);
      setState({ count, error, isLoading: false });
    };

    fetchStatistics();
  }, [hasApplied]);

  return (
    <Card className="border border-transparent dark:shadow-lg dark:bg-stone-900 dark:shadow-lg">
      <CardHeader>
        <CardTitle className="font-normal text-md">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {state.isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : state.error ? (
          <p className="text-red-500">Error: {state.error}</p>
        ) : (
          <p className="text-3xl font-medium">{state.count}</p>
        )}
      </CardContent>
    </Card>
  );
}
