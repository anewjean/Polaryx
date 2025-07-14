"use client";

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  useEffect(() => {
    router.replace(`/workspaces/${workspaceId}/admin/users`);
  }, [router, workspaceId]);

  return null;
}
