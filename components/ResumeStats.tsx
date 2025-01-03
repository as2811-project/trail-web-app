"use client";
import { use, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { getResumes } from "@/app/actions/getResumes";

export default function ResumeStats() {
  const [state, setState] = useState<{
    count: number | null;
    error: string | null;
    isLoading: boolean;
  }>({ count: null, error: null, isLoading: true });

  useEffect(() => {
    const fetchStatistics = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));
      const { count, error } = await getResumes(true);
      setState({ count, error, isLoading: false });
    };

    fetchStatistics();
  }, []);
  return (
    <Card className="border border-transparent dark:shadow-lg dark:bg-stone-900 dark:shadow-lg">
      <CardHeader>
        <CardTitle className="font-normal text-md">Resumes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-medium">{state.count}</p>
      </CardContent>
    </Card>
  );
}
