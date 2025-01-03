import JobDetails from "@/components/job-details";
import { getDetails } from "@/app/actions/getAppDetails";
import BlurFade from "@/components/ui/blur-fade";

export default async function EditApplication({
  params,
}: {
  params: { id: number };
}) {
  const { data, error } = await getDetails(params.id);
  if (error || !data) {
    return <div>Error loading job details.</div>;
  }

  return (
    <div className="container max-w-6xl mt-4 mx-auto p-4">
      <BlurFade>
        <JobDetails initialData={data} />
      </BlurFade>
    </div>
  );
}
