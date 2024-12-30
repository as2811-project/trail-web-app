export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-12">{children}</div>
  );
}
