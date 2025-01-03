import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import NavLinks from "./nav-links";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <NavLinks />

      <form action={signOutAction}>
        <Button
          type="submit"
          variant={"outline"}
          className="bg-pink-500 dark:bg-pink-600 text-white hover:bg-stone-800 hover:text-white dark:text-white dark:hover:bg-black dark:hover:text-white rounded-full"
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
      <Button
        asChild
        size="sm"
        variant={"default"}
        className="bg-pink-500 dark:bg-pink-600 text-white hover:bg-stone-800 hover:text-white dark:text-white dark:hover:bg-black dark:hover:text-white rounded-full"
      >
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
