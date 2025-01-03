import AllApplications from "@/components/all-apps";
import BlurFade from "@/components/ui/blur-fade";

export default function Applications() {
  return (
    <div className="container max-w-6xl mt-4 mx-auto p-4">
      <BlurFade>
        <div className="flex flex-col items-start">
          <h1 className="font-medium text-2xl mb-4">Applications</h1>
          <p className="text-sm text-neutral-500 mb-4">
            View and manage your applications
          </p>
        </div>
        <div>
          <AllApplications />
        </div>
      </BlurFade>
    </div>
  );
}
