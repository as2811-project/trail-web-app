"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getJobStatistics } from "@/app/actions/getJobStatistics";

const getColor = (count: number): string => {
  const colors: { [key: number]: string } = {
    0: "bg-gray-300",
    1: "bg-pink-200 dark:bg-pink-300",
    2: "bg-pink-400 dark:bg-pink-600",
    3: "bg-pink-600 dark:bg-pink-700",
  };
  return colors[Math.min(count, 3)] ?? "bg-pink-800";
};

interface CommitGraphProps {
  hasApplied: boolean;
}

function CommitGraph({ hasApplied }: CommitGraphProps) {
  const [commitsData, setCommitsData] = useState<number[]>(Array(10).fill(0));

  useEffect(() => {
    const fetchData = async () => {
      const applications = await getJobStatistics(hasApplied);
      console.log("applications", applications);
      const counts = Array.isArray(applications.data)
        ? applications.data.reduce(
            (
              acc: Record<string, number>,
              application: { application_date: string }
            ) => {
              const key = application.application_date.split("T")[0];
              acc[key] = (acc[key] || 0) + 1;
              return acc;
            },
            {}
          )
        : {};

      const today = new Date();
      const data = [];
      for (let i = 9; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const key = date.toISOString().split("T")[0];
        data.push(counts[key] || 0);
      }

      setCommitsData(data);
    };

    fetchData();
  }, [hasApplied]);

  return (
    <Card className="w-full max-w-md border border-transparent dark:shadow-lg dark:bg-stone-900 dark:shadow-lg">
      <CardHeader>
        <CardTitle className="font-normal text-md">
          Job Application Activity
        </CardTitle>
        <CardDescription>
          Your applications over the last 10 days
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <div className="p-6 ml-2 mr-2">
          <div id="contributions" className="flex gap-1">
            {commitsData.map((commitCount, i) => (
              <div
                key={`day-${i}`}
                id={`day-${i}`}
                className="flex flex-col gap-1"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        className={cn(
                          "h-7 w-7 rounded-sm",
                          getColor(commitCount)
                        )}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      {commitCount} application
                      {commitCount !== 1 ? "s" : ""} {commitsData.length - i}{" "}
                      day(s) ago
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CommitGraph;
