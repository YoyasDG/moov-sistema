import { AcceptInviteForm } from "@/components/auth/accept-invite-form";

export default function AcceptInvitePage({ searchParams }: { searchParams?: { token?: string; email?: string } }) {
  const token = searchParams?.token ?? "";
  const email = searchParams?.email ?? "";
  return <AcceptInviteForm token={token} email={email} />;
}
