"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { JobStatisticsCard } from "@/components/JobStatisticsCard";
import ResumeStats from "@/components/ResumeStats";
import CommitGraph from "@/components/job-commit-graph";
import { PacificoFont } from "../fonts";

export default function ProtectedPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/sign-in");
      } else {
        setUser(user);
      }
    };

    fetchUser();
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-6xl mt-4 mx-auto p-4">
      <div className="flex flex-col items-start">
        <h1 className="font-medium text-3xl mb-4">Dashboard</h1>
        <h2 className="font-medium text-xl">
          Welcome,{" "}
          <span className="bg-gradient-to-br from-sky-500 to-green-500 bg-clip-text text-transparent">
            {user.user_metadata.full_name}
          </span>
          !
        </h2>
        <p className="text-sm text-neutral-500 mb-4">
          {new Date().toDateString()}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <JobStatisticsCard title="Saved Jobs" hasApplied={false} />
        <JobStatisticsCard title="Applied Jobs" hasApplied={true} />
        <ResumeStats />
      </div>
      <div className="mt-4">
        <CommitGraph hasApplied={true} />
      </div>
    </div>
  );
}
