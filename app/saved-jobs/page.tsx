import SavedJobsComponent from "@/components/saved-jobs";
import BlurFade from "@/components/ui/blur-fade";

export default function SavedJobs() {
  return (
    <div className="container max-w-6xl mt-4 mx-auto p-4">
      <BlurFade>
        <div className="flex flex-col items-start">
          <h1 className="font-medium text-2xl mb-4">Saved Jobs</h1>
          <p className="text-sm text-neutral-500 mb-4">
            View and manage job postings you've saved
          </p>
        </div>
        <div>
          <SavedJobsComponent />
        </div>
      </BlurFade>
    </div>
  );
}
