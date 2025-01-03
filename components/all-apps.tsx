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
import { Edit01Icon } from "@/components/icons/edit";
import { Delete02Icon } from "@/components/icons/delete";

type Application = {
  id: number;
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

export default function AllApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [resumes, setResumes] = useState<string[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const result = await getAllApplications(true);
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
        <TableColumn>Application Date</TableColumn>
        <TableColumn>LinkedIn URL</TableColumn>
        <TableColumn>Resume</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn>Actions</TableColumn>
      </TableHeader>
      <TableBody loadingState="loading">
        {applications.map((app, index) => (
          <TableRow key={index}>
            <TableCell>{app.jobTitle}</TableCell>
            <TableCell>{app.companyName}</TableCell>
            <TableCell>
              {new Date(app.application_date).toLocaleDateString()}
            </TableCell>
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
              {app.resume_used ? (
                <a
                  href={app.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:underline"
                >
                  View Resume
                </a>
              ) : (
                <Dropdown className="text-pink-500">
                  <DropdownTrigger>
                    <Button variant="light">Select a resume</Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem key="resume1">Resume 1</DropdownItem>
                    <DropdownItem key="resume2">Resume 2</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}
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
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  isIconOnly
                  className="bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full"
                  onPress={() => {
                    window.location.href = `/applications/${app.id}`;
                  }}
                >
                  <Edit01Icon className="dark:text-white h-5 w-5" />
                </Button>
                <Button isIconOnly color="danger" className="rounded-full">
                  <Delete02Icon className="text-white h-5 w-5" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
