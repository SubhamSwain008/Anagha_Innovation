import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCompanyProfile } from "@/lib/data";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const company = await getCompanyProfile();

  return (
    <>
      <Header company={company} />
      <main style={{ minHeight: "calc(100vh - var(--header-height) - 200px)" }}>
        {children}
      </main>
      <Footer company={company} />
    </>
  );
}
