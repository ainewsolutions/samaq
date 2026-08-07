// ============================================================
// SAMAQ — Root App
// كل البيانات بتتحمّل من Google Sheets عن طريق Apps Script أول ما
// الصفحة تفتح. مفيش أي بيانات محفوظة على الجهاز نفسه.
// ============================================================

function LoadingScreen() {
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col items-center justify-center gap-3 bg-page"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/samaq-logo.png",
    alt: "",
    className: "w-16 h-16 opacity-80 animate-pulse"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-sm samaq-text-muted font-bold"
  }, "\u062C\u0627\u0631\u0650 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u0646\u064A\u0648..."));
}
function ErrorScreen({
  message,
  onRetry
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col items-center justify-center gap-3 bg-page px-6 text-center"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-red-500 font-bold"
  }, "\u062A\u0639\u0630\u0631 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs samaq-text-muted max-w-xs"
  }, message), /*#__PURE__*/React.createElement("button", {
    onClick: onRetry,
    className: "bg-samaq-green text-white text-sm font-bold rounded-full px-5 py-2 mt-2"
  }, "\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629"));
}

// هل الرابط فيه ?admin؟ (ده الطريقة الوحيدة اللي بتظهر بيها لوحة
// التحكم — مفيش أي زرار أو أيقونة ظاهرة للعميل في صفحة المنيو خالص)
function isAdminEntry() {
  return new URLSearchParams(window.location.search).has("admin");
}
function App() {
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [settings, setSettings] = useState({});
  const [view, setView] = useState("menu"); // "menu" | "dashboard"
  const [showLogin, setShowLogin] = useState(isAdminEntry);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [theme, setTheme] = useState("dark"); // "light" | "dark" — الافتراضي داكن، والعميل يقدر يبدّل

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  function load() {
    setStatus("loading");
    DataService.bootstrap().then(data => {
      setCategories(data.categories);
      setItems(data.items);
      setSettings(data.settings);
      setStatus("ready");
    }).catch(err => {
      setErrorMsg(err.message || "تأكد من اتصال الإنترنت وحاول تاني");
      setStatus("error");
    });
  }
  useEffect(() => {
    load();
  }, []);
  if (status === "loading") return /*#__PURE__*/React.createElement(LoadingScreen, null);
  if (status === "error") return /*#__PURE__*/React.createElement(ErrorScreen, {
    message: errorMsg,
    onRetry: load
  });
  if (view === "dashboard") {
    return /*#__PURE__*/React.createElement(Dashboard, {
      categories: categories,
      setCategories: setCategories,
      items: items,
      setItems: setItems,
      settings: settings,
      setSettings: setSettings,
      onExit: () => setView("menu")
    });
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Header, {
    cart: cart,
    onOpenCart: () => setCartOpen(true),
    theme: theme,
    onToggleTheme: () => setTheme(t => t === "dark" ? "light" : "dark")
  }), /*#__PURE__*/React.createElement(MenuPage, {
    categories: categories,
    items: items,
    settings: settings,
    cart: cart,
    setCart: setCart
  }), /*#__PURE__*/React.createElement(Footer, {
    settings: settings
  }), /*#__PURE__*/React.createElement(FloatingCartButton, {
    cart: cart,
    currency: settings.currency,
    onOpen: () => setCartOpen(true)
  }), cartOpen && /*#__PURE__*/React.createElement(CartDrawer, {
    cart: cart,
    setCart: setCart,
    currency: settings.currency,
    onClose: () => setCartOpen(false),
    onCheckout: () => {
      setCartOpen(false);
      setCheckoutOpen(true);
    }
  }), checkoutOpen && /*#__PURE__*/React.createElement(CheckoutForm, {
    cart: cart,
    setCart: setCart,
    settings: settings,
    onClose: () => setCheckoutOpen(false),
    onDone: () => {
      setCheckoutOpen(false);
      alert("تم إرسال الطلب عبر واتساب بنجاح!");
    }
  }), showLogin && /*#__PURE__*/React.createElement(LoginModal, {
    onClose: () => setShowLogin(false),
    onSuccess: () => {
      setShowLogin(false);
      setView("dashboard");
      // ننضّف الرابط من ?admin بعد الدخول عشان يفضل مظهره عادي
      window.history.replaceState(null, "", window.location.pathname);
    }
  }));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/*#__PURE__*/React.createElement(App, null));