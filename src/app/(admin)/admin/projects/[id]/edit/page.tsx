"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProjectForm from "@/components/admin/ProjectForm";
import type { DbProject } from "@/lib/projects";

export default function EditProjectPage() {
  const params = useParams();
  const id = params.id as string;
  const [project, setProject] = useState<DbProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/projects/${id}`).then((r) => r.json()).then((data) => {
      setProject(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
        <Loader2 size={20} color="#1e156d" style={{ animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!project) {
    return <p style={{ color: "#dc2626", fontSize: 13 }}>Project not found.</p>;
  }

  return <ProjectForm mode="edit" projectId={id} initial={project} />;
}
