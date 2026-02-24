import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <main
        style={{
          flex: 1,
          padding: "2rem",
          background: "var(--muted-bg)",
          overflow: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}
