import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchAshbyRoleById } from "@/modules/careers/lib/ashby";
import { RoleDetailPage } from "@/modules/careers/components/role-detail-page";
import { SITE_NAME } from "@/lib/site-config";

type RolePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: RolePageProps): Promise<Metadata> {
  const { id } = await params;
  const role = await fetchAshbyRoleById(id);

  if (!role) {
    return { title: `Careers — ${SITE_NAME}` };
  }

  const title = `${role.title} — Careers — ${SITE_NAME}`;
  const description = `${role.team} · ${role.location} · ${role.employmentType}. Apply for the ${role.title} role at ${SITE_NAME}.`;

  return {
    title,
    description,
    alternates: { canonical: `/careers/roles/${role.id}` },
    openGraph: {
      type: "website",
      url: `/careers/roles/${role.id}`,
      siteName: SITE_NAME,
      title,
      description,
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function RolePage({ params }: RolePageProps) {
  const { id } = await params;
  const role = await fetchAshbyRoleById(id);

  if (!role) {
    notFound();
  }

  return <RoleDetailPage role={role} />;
}
