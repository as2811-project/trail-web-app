"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getDetails, updateJobDetails } from "@/app/actions/getAppDetails";

interface JobDetails {
  id: number;
  jobTitle: string;
  companyName: string;
  descriptionHtml: string;
  application_date: string;
  jobUrl: string;
  progress: string;
  resume_used?: string;
}

export default function JobDetails({
  initialData,
}: {
  initialData: JobDetails;
}) {
  const [jobData, setJobData] = useState<JobDetails>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleProgressChange = (value: string) => {
    setJobData((prev) => ({ ...prev, progress: value }));
  };

  const handleResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJobData((prev) => ({ ...prev, resume_used: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await updateJobDetails(
        jobData.id,
        jobData.progress,
        jobData.resume_used || ""
      );
      router.refresh();
    } catch (error) {
      console.error("Error updating job details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl">{jobData.jobTitle}</h1>
      <h2 className="text-xl text-muted-foreground">{jobData.companyName}</h2>

      <div className="prose prose-sm max-w-none">
        <div dangerouslySetInnerHTML={{ __html: jobData.descriptionHtml }} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="progress">Progress</Label>
          <Select onValueChange={handleProgressChange} value={jobData.progress}>
            <SelectTrigger id="progress">
              <SelectValue placeholder="Select progress" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Screening">Screening</SelectItem>
              <SelectItem value="Interviewing">Interviewing</SelectItem>
              <SelectItem value="Accepted">Accepted</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="resume">Resume Used</Label>
          <Input
            id="resume"
            value={jobData.resume_used}
            onChange={handleResumeChange}
            placeholder="Enter resume details"
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Details"}
        </Button>
      </form>

      <div>
        <p>
          Application Date:{" "}
          {new Date(jobData.application_date).toLocaleDateString()}
        </p>
        <a
          href={jobData.jobUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View Original Job Posting
        </a>
      </div>
    </div>
  );
}
