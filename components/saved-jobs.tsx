"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@nextui-org/react";
import { getAllApplications } from "../app/actions/getAllApps";
import { getResumes } from "@/app/actions/getResumes";

type Application = {
  jobTitle: string;
  companyName: string;
  application_date: string;
  jobUrl: string;
  progress: string;
  resume_used: string;
};

const progressColors = {
  applied: "primary",
  "In Progress": "warning",
  Rejected: "danger",
  Accepted: "success",
  Interview: "secondary",
} as const;

export default function SavedJobsComponent() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const result = await getAllApplications(false);
        if (Array.isArray(result)) {
          setApplications(result);
        } else {
          console.error("Failed to fetch applications:", result.data);
        }
      } catch (error) {
        console.error("An error occurred while fetching applications:", error);
      }
    };
    fetchApplications();
  }, []);

  return (
    <Table aria-label="All job applications" className="">
      <TableHeader className="bg-red-500">
        <TableColumn>Title</TableColumn>
        <TableColumn>Company</TableColumn>
        <TableColumn>LinkedIn URL</TableColumn>
        <TableColumn>Action</TableColumn>
      </TableHeader>
      <TableBody loadingState="loading">
        {applications.map((app, index) => (
          <TableRow key={index}>
            <TableCell>{app.jobTitle}</TableCell>
            <TableCell>{app.companyName}</TableCell>
            <TableCell>
              <a
                href={app.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:underline"
              >
                View Job
              </a>
            </TableCell>
            <TableCell>
              <Chip
                color={
                  progressColors[app.progress as keyof typeof progressColors] ||
                  "default"
                }
                variant="flat"
              >
                {app.progress}
              </Chip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
