// ============================================================
// SAMAQ — Header & Footer
// ============================================================

function Header({
  cart,
  onOpenCart,
  theme,
  onToggleTheme
}) {
  const count = cartCount(cart);
  return /*#__PURE__*/React.createElement("header", {
    className: "samaq-header sticky top-0 z-40 h-16 flex items-center px-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-5xl mx-auto w-full flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/samaq-logo.png",
    alt: "SAMAQ",
    className: "h-10 w-auto"
  }), /*#__PURE__*/React.createElement("div", {
    className: "leading-tight hidden sm:block"
  }, /*#__PURE__*/React.createElement("p", {
    className: "samaq-logo-text font-extrabold text-base"
  }, "\u0633\u0645\u0643 | SAMAQ"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] samaq-text-muted"
  }, "\u0645\u0646\u062A\u062C\u0627\u062A \u0628\u062D\u0631\u064A\u0629 \u0637\u0627\u0632\u062C\u0629"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onToggleTheme,
    className: "theme-toggle",
    title: "\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u062F\u0627\u0643\u0646/\u0627\u0644\u0641\u0627\u062A\u062D"
  }, theme === "dark" ? "☀️" : "🌙"), /*#__PURE__*/React.createElement("button", {
    onClick: onOpenCart,
    className: "theme-toggle relative",
    style: {
      color: "var(--primary-color)"
    }
  }, /*#__PURE__*/React.createElement(IconCart, {
    className: "w-5 h-5"
  }), count > 0 && /*#__PURE__*/React.createElement("span", {
    className: "absolute -top-1 -left-1 bg-samaq-gold text-[#173a2a] text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center"
  }, count)))));
}
function Footer({
  settings
}) {
  const social = {
    whatsapp: settings.socialWhatsapp,
    facebook: settings.socialFacebook,
    tiktok: settings.socialTiktok,
    instagram: settings.socialInstagram,
    twitter: settings.socialTwitter
  };
  return /*#__PURE__*/React.createElement("footer", {
    className: "no-print bg-[#0b0f0d] text-white pt-10 pb-8 mt-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-5xl mx-auto px-6 flex flex-col items-center gap-8 text-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-bold mb-4"
  }, "\u062A\u0627\u0628\u0639\u0646\u0627"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 justify-center"
  }, /*#__PURE__*/React.createElement("a", {
    href: social.whatsapp || "#",
    target: "_blank",
    rel: "noreferrer",
    className: "social-btn"
  }, /*#__PURE__*/React.createElement(IconWhatsapp, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("a", {
    href: social.facebook || "#",
    target: "_blank",
    rel: "noreferrer",
    className: "social-btn"
  }, /*#__PURE__*/React.createElement(IconFacebook, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("a", {
    href: social.tiktok || "#",
    target: "_blank",
    rel: "noreferrer",
    className: "social-btn"
  }, /*#__PURE__*/React.createElement(IconTiktok, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("a", {
    href: social.instagram || "#",
    target: "_blank",
    rel: "noreferrer",
    className: "social-btn"
  }, /*#__PURE__*/React.createElement(IconInstagram, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("a", {
    href: social.twitter || "#",
    target: "_blank",
    rel: "noreferrer",
    className: "social-btn"
  }, /*#__PURE__*/React.createElement(IconTwitterX, {
    className: "w-5 h-5"
  })))), /*#__PURE__*/React.createElement("a", {
    href: settings.googleMapsUrl || "#",
    target: "_blank",
    rel: "noreferrer",
    className: "flex items-center gap-2 bg-white/10 hover:bg-white/20 transition rounded-full px-5 py-2.5 text-sm font-bold"
  }, /*#__PURE__*/React.createElement(IconMap, {
    className: "w-4 h-4"
  }), " \u0645\u0648\u0642\u0639\u0646\u0627 \u0639\u0644\u0649 \u0627\u0644\u062E\u0631\u064A\u0637\u0629"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-bold mb-4"
  }, "\u062D\u0645\u0651\u0644 \u0627\u0644\u062A\u0637\u0628\u064A\u0642"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 flex-wrap justify-center"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://media-files.tryordersystem.com/tenant/samaq/settings/66434b89aa9d5.jpeg",
    target: "_blank",
    rel: "noreferrer",
    className: "bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-[10px] leading-tight text-white/70 hover:bg-white/20 transition"
  }, "\u0636\u0631\u064A\u0628\u0629 \u0627\u0644\u0642\u064A\u0645\u0629", /*#__PURE__*/React.createElement("br", null), "\u0627\u0644\u0645\u0636\u0627\u0641\u0629"), /*#__PURE__*/React.createElement("a", {
    href: settings.googlePlayUrl || "#",
    target: "_blank",
    rel: "noreferrer",
    className: "store-btn"
  }, /*#__PURE__*/React.createElement(IconPlay, {
    className: "w-6 h-6"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-right leading-tight"
  }, /*#__PURE__*/React.createElement("span", {
    className: "block text-[10px] text-gray-300"
  }, "GET IT ON"), /*#__PURE__*/React.createElement("span", {
    className: "block text-sm font-bold -mt-0.5"
  }, "Google Play"))), /*#__PURE__*/React.createElement("a", {
    href: settings.appStoreUrl || "#",
    target: "_blank",
    rel: "noreferrer",
    className: "store-btn"
  }, /*#__PURE__*/React.createElement(IconApple, {
    className: "w-6 h-6"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-right leading-tight"
  }, /*#__PURE__*/React.createElement("span", {
    className: "block text-[10px] text-gray-300"
  }, "Download on the"), /*#__PURE__*/React.createElement("span", {
    className: "block text-sm font-bold -mt-0.5"
  }, "App Store"))))), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-white/40"
  }, "\xA9 ", new Date().getFullYear(), " \u0633\u0645\u0643 SAMAQ \u2014 \u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0642 \u0645\u062D\u0641\u0648\u0638\u0629")));
}