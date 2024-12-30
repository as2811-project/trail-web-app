"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

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

        const cookies = document.cookie
          .split("; ")
          .reduce((acc: { [key: string]: string }, cookie) => {
            const [key, value] = cookie.split("=");
            acc[key] = value;
            return acc;
          }, {});

        const sbAccessToken = cookies["sb-ogubbwjbocvlumqcwosf-auth-token"];
        if (sbAccessToken) {
          localStorage.setItem("sbAccessToken", sbAccessToken);
          console.log("sb-access-token stored in localStorage.");
        } else {
          console.warn("sb-access-token cookie not found.");
        }
      }
    };

    fetchUser();
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-medium text-2xl mb-4">
          Welcome, {user.user_metadata.full_name}!
        </h2>
      </div>
      <div></div>
    </div>
  );
}
