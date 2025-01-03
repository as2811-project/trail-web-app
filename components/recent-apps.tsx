"use client";

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
import { getRecentApplications } from "@/app/actions/getApplications";

type Application = {
  jobTitle: string;
  companyName: string;
  application_date: string;
  jobUrl: string;
  progress: string;
};

const progressColors = {
  applied: "primary",
  "In Progress": "warning",
  Rejected: "danger",
  Accepted: "success",
  Interview: "secondary",
} as const;

export default function RecentApplicationsTable() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const result = await getRecentApplications();
        if (Array.isArray(result)) {
          setApplications(result);
        } else {
          console.error("Failed to fetch applications:", result.error);
        }
      } catch (error) {
        console.error("An error occurred while fetching applications:", error);
      }
    };
    fetchApplications();
  }, []);

  return (
    <>
      {applications.length === 0 ? (
        <p>You haven't tracked any applications yet</p>
      ) : (
        <Table
          aria-label="Recent job applications"
          removeWrapper={true}
          className=""
        >
          <TableHeader className="bg-red-500">
            <TableColumn>Title</TableColumn>
            <TableColumn>Company</TableColumn>
            <TableColumn>Application Date</TableColumn>
            <TableColumn>LinkedIn URL</TableColumn>
            <TableColumn>Progress</TableColumn>
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
                  <Chip
                    color={
                      progressColors[
                        app.progress as keyof typeof progressColors
                      ] || "default"
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
      )}
    </>
  );
}
