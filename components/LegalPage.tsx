export default function LegalPage({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-x py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-brand">{title}</h1>
      <div className="mt-6 prose prose-sm max-w-none text-gray-700 [&_h2]:text-brand [&_h2]:mt-8 [&_h2]:font-semibold [&_h2]:text-lg [&_p]:mt-2 [&_ul]:mt-2 [&_li]:ml-5 [&_li]:list-disc">
        {children}
      </div>
    </div>
  );
}
