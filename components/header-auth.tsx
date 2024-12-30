import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.user_metadata.full_name}!
      <form action={signOutAction}>
        <Button
          type="submit"
          variant={"outline"}
          className="bg-black text-white hover:bg-stone-800 hover:text-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white rounded-full"
        >
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button
        asChild
        size="sm"
        variant={"outline"}
        className="bg-white text-black hover:bg-stone-800 hover:text-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white rounded-full"
      >
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
