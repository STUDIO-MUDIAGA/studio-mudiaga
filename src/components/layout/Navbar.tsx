"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import MenuOverlay from "./MenuOverlay";
import { useNavTheme } from "@/context/NavTheme";

// Inline SVG — fill="currentColor" so CSS color controls it
function LogoSVG({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      width="180"
      height="29"
      viewBox="0 0 651 104"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="Studio Mudiaga"
    >
      <path d="M142.349 74.8199H124.919V1.93994H99.3691V102.17H174.379V102.35H199.929V2.47992H174.379V40.6299C174.379 59.5099 160.049 74.8099 142.359 74.8099L142.349 74.8199Z" fill="currentColor"/>
      <path d="M332.26 1.76025H306.93V100.35H332.26V1.76025Z" fill="currentColor"/>
      <path d="M213.801 28.7802H250.651C260.741 28.7802 268.931 37.3702 268.931 47.9702C268.931 63.1902 257.181 75.5302 242.681 75.5302H213.801V100.46H294.371V75.5302H294.261V28.7702H294.371V1.93018H213.801V28.7702V28.7802Z" fill="currentColor"/>
      <path d="M454.061 2.82025V103.86H537.671V52.4202H511.241V76.6902H479.611V58.7902C479.611 42.3002 492.221 28.9302 507.771 28.9302H537.671V1.76025H454.061V2.82025Z" fill="currentColor"/>
      <path d="M380.12 1.93994L345.85 100.46H373.32L385.06 63.4199C388.25 53.2599 401.95 53.2299 405.18 63.3799V63.4199L416.79 100.46H444.39L410.25 1.93994H380.11H380.12Z" fill="currentColor"/>
      <path d="M585.85 1.76025L551.58 102.07H579.05L590.79 64.3602C593.98 54.0102 607.68 53.9902 610.91 64.3203V64.3602L622.52 102.07H650.12L615.98 1.76025H585.84H585.85Z" fill="currentColor"/>
      <path d="M9.89929 9.79514C9.83786 9.17563 9.57418 8.69436 9.10827 8.35133C8.64236 8.0083 8.01006 7.83678 7.21136 7.83678C6.66865 7.83678 6.21042 7.91358 5.83667 8.06718C5.46292 8.21565 5.1762 8.42301 4.97653 8.68924C4.78197 8.95548 4.68469 9.25755 4.68469 9.59546C4.67445 9.87705 4.73333 10.1228 4.86133 10.3327C4.99445 10.5426 5.1762 10.7244 5.4066 10.878C5.63699 11.0265 5.90322 11.157 6.2053 11.2697C6.50737 11.3772 6.82992 11.4693 7.17296 11.5461L8.58604 11.884C9.27211 12.0376 9.90185 12.2424 10.4753 12.4984C11.0487 12.7544 11.5453 13.0693 11.9652 13.4431C12.385 13.8168 12.7101 14.2571 12.9405 14.764C13.176 15.2709 13.2963 15.852 13.3015 16.5073C13.2963 17.4698 13.0506 18.3044 12.5642 19.0109C12.0829 19.7123 11.3866 20.2576 10.4753 20.6467C9.56906 21.0307 8.47597 21.2227 7.196 21.2227C5.92626 21.2227 4.82037 21.0282 3.87831 20.639C2.94137 20.2499 2.20923 19.674 1.68188 18.9111C1.15965 18.1431 0.88574 17.1934 0.86014 16.0619H4.07799C4.11383 16.5892 4.26486 17.0295 4.5311 17.3828C4.80245 17.731 5.1634 17.9946 5.61395 18.1738C6.06962 18.3479 6.58417 18.4349 7.1576 18.4349C7.72078 18.4349 8.20973 18.353 8.62444 18.1892C9.04427 18.0253 9.36939 17.7975 9.59978 17.5057C9.83018 17.2138 9.94537 16.8785 9.94537 16.4996C9.94537 16.1464 9.84042 15.8494 9.6305 15.6088C9.4257 15.3681 9.12363 15.1633 8.72428 14.9944C8.33005 14.8254 7.84622 14.6718 7.27279 14.5336L5.56019 14.1035C4.23414 13.781 3.18713 13.2767 2.41914 12.5906C1.65116 11.9045 1.26973 10.9804 1.27485 9.81818C1.26973 8.86588 1.52317 8.0339 2.03515 7.32223C2.55226 6.61057 3.26137 6.05506 4.16246 5.65571C5.06356 5.25636 6.08754 5.05668 7.23439 5.05668C8.40173 5.05668 9.42058 5.25636 10.291 5.65571C11.1665 6.05506 11.8474 6.61057 12.3338 7.32223C12.8202 8.0339 13.0711 8.8582 13.0864 9.79514H9.89929ZM14.9102 8.50365V5.86545H27.34V8.50365H22.7065V21H19.5437V8.50365H14.9102ZM38.7353 5.86545H41.9351V15.694C41.9351 16.7976 41.6715 17.7632 41.1444 18.5909C40.6222 19.4186 39.8906 20.0639 38.9496 20.527C38.0086 20.9852 36.9124 21.2143 35.6611 21.2143C34.4048 21.2143 33.3061 20.9852 32.3652 20.527C31.4242 20.0639 30.6926 19.4186 30.1704 18.5909C29.6481 17.7632 29.387 16.7976 29.387 15.694V5.86545H32.5869V15.4206C32.5869 15.997 32.7125 16.5094 32.9637 16.9577C33.2199 17.406 33.5796 17.7583 34.0427 18.0145C34.5058 18.2707 35.0452 18.3988 35.6611 18.3988C36.2818 18.3988 36.8213 18.2707 37.2795 18.0145C37.7426 17.7583 38.0997 17.406 38.351 16.9577C38.6072 16.5094 38.7353 15.997 38.7353 15.4206V5.86545ZM49.9328 21H44.5678V5.86545H49.9772C51.4995 5.86545 52.81 6.16844 53.9086 6.77441C55.0072 7.37546 55.8522 8.24008 56.4434 9.36827C57.0395 10.4965 57.3375 11.8464 57.3375 13.4179C57.3375 14.9945 57.0395 16.3493 56.4434 17.4824C55.8522 18.6155 55.0023 19.4851 53.8938 20.091C52.7903 20.697 51.4699 21 49.9328 21ZM47.7676 18.2583H49.7998C50.7457 18.2583 51.5414 18.0908 52.1868 17.7558C52.8371 17.4159 53.3248 16.8912 53.65 16.1818C53.9801 15.4674 54.1451 14.5461 54.1451 13.4179C54.1451 12.2996 53.9801 11.3857 53.65 10.6763C53.3248 9.96686 52.8395 9.44464 52.1942 9.10963C51.5488 8.77462 50.7531 8.60711 49.8072 8.60711H47.7676V18.2583ZM62.9077 5.86545V21H59.7078V5.86545H62.9077ZM79.4482 13.4327C79.4482 15.0831 79.1353 16.4872 78.5096 17.645C77.8889 18.8027 77.0415 19.6871 75.9675 20.298C74.8984 20.9039 73.6963 21.2069 72.3612 21.2069C71.0163 21.2069 69.8092 20.9015 68.7402 20.2906C67.6711 19.6797 66.8262 18.7953 66.2054 17.6376C65.5847 16.4798 65.2743 15.0782 65.2743 13.4327C65.2743 11.7823 65.5847 10.3782 66.2054 9.22048C66.8262 8.06272 67.6711 7.18086 68.7402 6.57489C69.8092 5.96399 71.0163 5.65854 72.3612 5.65854C73.6963 5.65854 74.8984 5.96399 75.9675 6.57489C77.0415 7.18086 77.8889 8.06272 78.5096 9.22048C79.1353 10.3782 79.4482 11.7823 79.4482 13.4327ZM76.204 13.4327C76.204 12.3637 76.0439 11.4621 75.7236 10.728C75.4083 9.99395 74.9625 9.43725 74.3861 9.0579C73.8096 8.67855 73.1347 8.48887 72.3612 8.48887C71.5877 8.48887 70.9128 8.67855 70.3364 9.0579C69.76 9.43725 69.3117 9.99395 68.9914 10.728C68.6761 11.4621 68.5185 12.3637 68.5185 13.4327C68.5185 14.5018 68.6761 15.4034 68.9914 16.1374C69.3117 16.8715 69.76 17.4282 70.3364 17.8076C70.9128 18.1869 71.5877 18.3766 72.3612 18.3766C73.1347 18.3766 73.8096 18.1869 74.3861 17.8076C74.9625 17.4282 75.4083 16.8715 75.7236 16.1374C76.0439 15.4034 76.204 14.5018 76.204 13.4327Z" fill="currentColor"/>
      <path d="M81.15 28.9102H0V31.3002C0 39.3502 6.02 45.9902 13.8 46.9802H0V102.36H19.58V47.1302H51.57C39.5 48.4002 30.1 58.1602 30.1 70.0302V102.37H54.4V47.1402H86.39C74.32 48.4102 64.92 58.1702 64.92 70.0402V102.38H89.22V37.0102C89.22 32.5502 85.6 28.9302 81.14 28.9302L81.15 28.9102Z" fill="currentColor"/>
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { theme } = useNavTheme();
  const isLanding = pathname === "/";

  // On non-landing pages, always treat as "dark" background (white logo)
  const isLight = isLanding && theme === "light";

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);

      // Show only in the early white-panel zone (before the image zoom goes dark)
      // ~1.5 × vh ≈ midway through the editorial zoom, white bg still visible
      const whiteZoneEnd = window.innerHeight * 1.5;

      if (y <= 60) {
        // Back at the very top — always show
        setNavVisible(true);
      } else if (y > lastScrollY.current + 4) {
        // Scrolling down — always hide
        setNavVisible(false);
      } else if (y < lastScrollY.current - 4 && y < whiteZoneEnd) {
        // Scrolling up AND back inside the early white editorial zone — show
        setNavVisible(true);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out"
        style={{ transform: navVisible || menuOpen ? "translateY(0)" : "translateY(-110%)" }}
      >
        <div
          className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 transition-opacity duration-500 pointer-events-none"
          style={{ opacity: !menuOpen && !isLanding ? 1 : 0 }}
        />
        <div
          className="relative flex items-center justify-between w-full"
          style={{ maxWidth: 1200, margin: "0 auto", paddingLeft: 48, paddingRight: 64, paddingTop: 32, paddingBottom: 20 }}
        >
          <Link href="/" className="flex items-center gap-5 group">
            <LogoSVG
              className="transition-colors duration-500"
              style={{ color: isLight ? "#65483E" : "white" }}
            />
            <span
              className="w-px h-9 hidden sm:block transition-colors duration-500"
              style={{ backgroundColor: isLight ? "rgba(101,72,62,0.3)" : "rgba(255,255,255,0.2)" }}
            />
            <span
              className="hidden sm:block text-[10px] tracking-[0.2em] uppercase leading-snug transition-colors duration-500"
              style={{ color: isLight ? "rgba(101,72,62,0.6)" : "rgba(255,255,255,0.4)" }}
            >
              Shortlets
              <br />
              &amp; Furniture
            </span>
          </Link>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              paddingLeft: 24, paddingRight: 20, paddingTop: 12, paddingBottom: 12, gap: 10,
              backgroundColor: isLight ? "transparent" : "#1a1a1a",
              borderColor: isLight ? "rgba(101,72,62,0.25)" : "rgba(255,255,255,0.1)",
              color: isLight ? "#65483E" : "rgba(255,255,255,0.8)",
            }}
            className="flex items-center border rounded-full transition-colors duration-500 z-[201] relative"
            aria-label="Toggle menu"
          >
            <span className="text-sm font-medium select-none tracking-wide">
              {menuOpen ? "Close" : "Menu"}
            </span>
            <span className="text-[18px] leading-none select-none">
              {menuOpen ? <X size={14} /> : "≡"}
            </span>
          </button>
        </div>
      </header>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
