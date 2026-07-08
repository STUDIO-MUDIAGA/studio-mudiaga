"use client";

import { useCallback, useState } from "react";
import HomeV2Intro from "@/components/homev2/HomeV2Intro";
import HeroV2 from "@/components/homev2/HeroV2";
import HeaderV2 from "@/components/homev2/HeaderV2";

export default function HomeV2Page() {
  const [introDone, setIntroDone] = useState(false);
  const handleComplete = useCallback(() => setIntroDone(true), []);

  return (
    <>
      <HomeV2Intro onComplete={handleComplete} />
      <HeaderV2 revealed={introDone} />
      <HeroV2 revealed={introDone} />
    </>
  );
}
