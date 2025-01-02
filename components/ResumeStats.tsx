import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function ResumeStats() {
  return (
    <Card className="border border-transparent dark:shadow-lg dark:bg-stone-900 dark:shadow-lg">
      <CardHeader>
        <CardTitle className="font-normal text-md">Resumes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-medium">0</p>
      </CardContent>
    </Card>
  );
}
