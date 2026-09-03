"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MudresAuthForm from "@/components/mudres/MudresAuthForm";
import { HEADER_SPACE } from "@/components/mudres/MudresHeader";

export default function MudresLoginPage() {
  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", paddingTop: HEADER_SPACE + 24 }}>
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "32px 20px 80px" }}>
        <Suspense fallback={null}>
          <Form />
        </Suspense>
      </div>
    </div>
  );
}

function Form() {
  return <MudresAuthForm mode="login" nextParam={useSearchParams().get("next")} />;
}
