// ============================================================
// SAMAQ — Header & Footer
// ============================================================

function Header({ cart, onOpenCart, onGoDashboard }) {
  const count = cartCount(cart);
  return (
    <header className="samaq-gradient-header sticky top-0 z-40 h-16 flex items-center px-4 shadow-md">
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="assets/samaq-logo.png" alt="SAMAQ" className="h-11 w-auto drop-shadow" />
          <div className="text-white leading-tight hidden sm:block">
            <p className="font-extrabold text-sm">سمك | SAMAQ</p>
            <p className="text-[11px] opacity-80">منتجات بحرية طازجة</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onOpenCart} className="relative bg-white/15 hover:bg-white/25 transition rounded-full p-2.5">
            <IconCart className="w-5 h-5 text-white" />
            {count > 0 && (
              <span className="absolute -top-1 -left-1 bg-samaq-gold text-[#173a2a] text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center">{count}</span>
            )}
          </button>
          <button onClick={onGoDashboard} title="لوحة التحكم" className="bg-white/10 hover:bg-white/20 transition rounded-full p-2.5">
            <IconGear className="w-5 h-5 text-white/80" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer({ settings }) {
  const social = {
    whatsapp: settings.socialWhatsapp,
    facebook: settings.socialFacebook,
    tiktok: settings.socialTiktok,
    instagram: settings.socialInstagram,
    twitter: settings.socialTwitter,
  };
  return (
    <footer className="no-print bg-[#0b0f0d] text-white pt-10 pb-8 mt-6">
      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-8 text-center">
        <div>
          <p className="text-lg font-bold mb-4">تابعنا</p>
          <div className="flex items-center gap-3 justify-center">
            <a href={social.whatsapp || "#"} target="_blank" rel="noreferrer" className="social-btn"><IconWhatsapp className="w-5 h-5" /></a>
            <a href={social.facebook || "#"} target="_blank" rel="noreferrer" className="social-btn"><IconFacebook className="w-5 h-5" /></a>
            <a href={social.tiktok || "#"} target="_blank" rel="noreferrer" className="social-btn"><IconTiktok className="w-5 h-5" /></a>
            <a href={social.instagram || "#"} target="_blank" rel="noreferrer" className="social-btn"><IconInstagram className="w-5 h-5" /></a>
            <a href={social.twitter || "#"} target="_blank" rel="noreferrer" className="social-btn"><IconTwitterX className="w-5 h-5" /></a>
          </div>
        </div>

        <a href={settings.googleMapsUrl || "#"} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition rounded-full px-5 py-2.5 text-sm font-bold">
          <IconMap className="w-4 h-4" /> موقعنا على الخريطة
        </a>

        <div>
          <p className="text-lg font-bold mb-4">حمّل التطبيق</p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            
              href="https://media-files.tryordersystem.com/tenant/samaq/settings/66434b89aa9d5.jpeg"
              target="_blank"
              rel="noreferrer"
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-[10px] leading-tight text-white/70 hover:bg-white/20 transition"
            >
              ضريبة القيمة<br />المضافة
            </a>
            <a href={settings.googlePlayUrl || "#"} target="_blank" rel="noreferrer" className="store-btn">
              <IconPlay className="w-6 h-6" />
              <span className="text-right leading-tight">
                <span className="block text-[10px] text-gray-300">GET IT ON</span>
                <span className="block text-sm font-bold -mt-0.5">Google Play</span>
              </span>
            </a>
            <a href={settings.appStoreUrl || "#"} target="_blank" rel="noreferrer" className="store-btn">
              <IconApple className="w-6 h-6" />
              <span className="text-right leading-tight">
                <span className="block text-[10px] text-gray-300">Download on the</span>
                <span className="block text-sm font-bold -mt-0.5">App Store</span>
              </span>
            </a>
          </div>
        </div>

        <p className="text-[11px] text-white/40">© {new Date().getFullYear()} سمك SAMAQ — جميع الحقوق محفوظة</p>
      </div>
    </footer>
  );
}