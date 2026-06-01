import Link from "next/link";

const links = {
  Company: ["About", "Careers", "Press", "Blog"],
  Shortlets: ["Browse Lagos", "Browse Abuja", "Host Your Space", "Guest Reviews"],
  Furniture: ["Living Room", "Bedroom", "Dining", "Outdoor"],
  Support: ["Help Center", "Contact", "Privacy Policy", "Terms"],
};

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <p className="font-bold text-xl text-white mb-3">
              studio<span className="text-amber-400">mudiaga</span>
            </p>
            <p className="text-white/40 text-sm leading-relaxed">
              Curated living — premium shortlets and handcrafted furniture.
            </p>
            <div className="flex gap-4 mt-5">
              <a href="#" className="text-white/40 hover:text-white transition-colors text-xs font-medium">IG</a>
              <a href="#" className="text-white/40 hover:text-white transition-colors text-xs font-medium">TW</a>
              <a href="#" className="text-white/40 hover:text-white transition-colors text-xs font-medium">FB</a>
            </div>
          </div>

          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">{group}</p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">© 2026 Studio Mudiaga. All rights reserved.</p>
          <p className="text-white/25 text-xs">Lagos · Abuja · Port Harcourt</p>
        </div>
      </div>
    </footer>
  );
}
