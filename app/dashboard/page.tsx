"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { JobStatisticsCard } from "@/components/JobStatisticsCard";
import CommitGraph from "@/components/job-commit-graph";
import RecentApplicationsTable from "@/components/recent-apps";
import BlurFade from "@/components/ui/blur-fade";

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
    return <div></div>;
  }

  return (
    <div className="container max-w-6xl mt-4 mx-auto p-4">
      <BlurFade>
        <div className="flex flex-col items-start">
          <h1 className="font-medium text-2xl mb-4">Dashboard</h1>
          <h2 className="font-medium text-lg">
            Welcome, {user.user_metadata.full_name}!
          </h2>
          <p className="text-sm text-neutral-500 mb-4">
            {new Date().toDateString()}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:grid-cols-1">
          <JobStatisticsCard title="Saved Jobs" hasApplied={false} />
          <JobStatisticsCard title="Applications" hasApplied={true} />
          <CommitGraph hasApplied={true} />
        </div>
        <div>
          <h2 className="mt-4 text-lg">Recent Applications</h2>
          <div className="flex flex-col items-start">
            <p className="text-sm text-neutral-500 mb-4">
              Here are your most recent applications
            </p>
          </div>
          <RecentApplicationsTable />
        </div>
      </BlurFade>
    </div>
  );
}
