// ============================================================
// SAMAQ — Cart drawer + Checkout + WhatsApp order builder
// ============================================================

function cartTotal(cart) {
  return cart.reduce((sum, l) => sum + Number(l.totalPrice || 0), 0);
}
function cartCount(cart) {
  return cart.reduce((sum, l) => sum + Number(l.qty || 0), 0);
}
function FloatingCartButton({
  cart,
  currency,
  onOpen
}) {
  const count = cartCount(cart);
  if (!count) return null;
  return /*#__PURE__*/React.createElement("button", {
    onClick: onOpen,
    className: "fab-cart no-print fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 bg-samaq-green text-white rounded-full px-5 py-3 flex items-center gap-3 z-40 hover:brightness-110 transition"
  }, /*#__PURE__*/React.createElement("span", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(IconCart, {
    className: "w-5 h-5"
  }), /*#__PURE__*/React.createElement("span", {
    className: "absolute -top-2 -left-2 bg-samaq-gold text-main text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center"
  }, count)), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-sm"
  }, formatPrice(cartTotal(cart), currency)), /*#__PURE__*/React.createElement("span", {
    className: "text-xs opacity-90 hidden sm:inline"
  }, "\u0639\u0631\u0636 \u0627\u0644\u0633\u0644\u0629"));
}
function CartDrawer({
  cart,
  setCart,
  currency,
  onClose,
  onCheckout
}) {
  function updateQty(lineId, delta) {
    setCart(prev => prev.map(l => {
      if (l.lineId !== lineId) return l;
      const qty = Math.max(1, l.qty + delta);
      return {
        ...l,
        qty,
        totalPrice: l.unitPrice * qty
      };
    }));
  }
  function removeLine(lineId) {
    setCart(prev => prev.filter(l => l.lineId !== lineId));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-black/50 fade-in",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-0 bottom-0 left-0 sm:left-auto sm:right-0 w-full sm:w-[420px] bg-surface text-main slide-in flex flex-col",
    style: {
      animationName: "slideIn"
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "samaq-sheet-header px-5 py-4 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "font-extrabold text-lg title"
  }, "\u0633\u0644\u0629 \u0627\u0644\u0637\u0644\u0628\u0627\u062A"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "samaq-text-muted"
  }, /*#__PURE__*/React.createElement(IconClose, {
    className: "w-5 h-5"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-y-auto p-4 flex flex-col gap-3"
  }, cart.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "text-center samaq-text-muted py-16"
  }, /*#__PURE__*/React.createElement(IconCart, {
    className: "w-10 h-10 mx-auto mb-2 opacity-40"
  }), "\u0627\u0644\u0633\u0644\u0629 \u0641\u0627\u0636\u064A\u0629 \u062F\u0644\u0648\u0642\u062A\u064A"), cart.map(l => /*#__PURE__*/React.createElement("div", {
    key: l.lineId,
    className: "samaq-card-surface rounded-2xl p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between gap-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-sm text-main"
  }, l.name), l.optionsSummary && l.optionsSummary.length > 0 && /*#__PURE__*/React.createElement("p", {
    className: "text-xs samaq-text-muted mt-1"
  }, l.optionsSummary.join(" · ")), l.notes && /*#__PURE__*/React.createElement("p", {
    className: "text-xs samaq-text-muted mt-1"
  }, "\u0645\u0644\u0627\u062D\u0638\u0629: ", l.notes)), /*#__PURE__*/React.createElement("button", {
    onClick: () => removeLine(l.lineId),
    className: "text-red-400 hover:text-red-600 shrink-0"
  }, /*#__PURE__*/React.createElement(IconTrash, {
    className: "w-4 h-4"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => updateQty(l.lineId, -1),
    className: "w-7 h-7 rounded-full bg-surface border border-theme flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(IconMinus, {
    className: "w-3.5 h-3.5"
  })), /*#__PURE__*/React.createElement("span", {
    className: "w-5 text-center text-sm font-bold text-main"
  }, l.qty), /*#__PURE__*/React.createElement("button", {
    onClick: () => updateQty(l.lineId, 1),
    className: "w-7 h-7 rounded-full bg-surface border border-theme flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(IconPlus, {
    className: "w-3.5 h-3.5"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "text-samaq-green font-bold text-sm"
  }, formatPrice(l.totalPrice, currency)))))), cart.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-t border-theme"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-main"
  }, "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A"), /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-samaq-green text-lg"
  }, formatPrice(cartTotal(cart), currency))), /*#__PURE__*/React.createElement("button", {
    onClick: onCheckout,
    className: "w-full bg-samaq-green text-white font-extrabold rounded-2xl py-3 hover:brightness-110 transition"
  }, "\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0637\u0644\u0628"))));
}
function buildWhatsappMessage({
  cart,
  currency,
  customerName,
  customerPhone,
  method,
  address,
  notes,
  storeName
}) {
  const lines = [];
  lines.push(`*طلب جديد من ${storeName}*`);
  lines.push("");
  cart.forEach((l, idx) => {
    lines.push(`${idx + 1}. ${l.name} × ${l.qty}`);
    if (l.optionsSummary && l.optionsSummary.length) lines.push(`   الخيارات: ${l.optionsSummary.join("، ")}`);
    if (l.notes) lines.push(`   ملاحظة: ${l.notes}`);
    lines.push(`   السعر: ${formatPrice(l.totalPrice, currency)}`);
  });
  lines.push("");
  lines.push(`*الإجمالي الكلي: ${formatPrice(cartTotal(cart), currency)}*`);
  lines.push("");
  lines.push(`*بيانات العميل*`);
  lines.push(`الاسم: ${customerName}`);
  lines.push(`الهاتف: ${customerPhone}`);
  lines.push(`طريقة الاستلام: ${method === "delivery" ? "توصيل" : "استلام من الفرع"}`);
  if (method === "delivery" && address) lines.push(`العنوان: ${address}`);
  if (notes) lines.push(`ملاحظات عامة: ${notes}`);
  return lines.join("\n");
}
function CheckoutForm({
  cart,
  setCart,
  settings,
  onClose,
  onDone
}) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [method, setMethod] = useState("delivery");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  async function handleSubmit() {
    if (!customerName.trim() || !customerPhone.trim()) {
      setError("من فضلك اكتب الاسم ورقم الهاتف");
      return;
    }
    if (method === "delivery" && !address.trim()) {
      setError("من فضلك اكتب عنوان التوصيل");
      return;
    }
    setError("");
    setSending(true);
    const message = buildWhatsappMessage({
      cart,
      currency: settings.currency,
      customerName,
      customerPhone,
      method,
      address,
      notes,
      storeName: settings.storeName
    });
    const order = {
      id: `order_${Date.now()}`,
      createdAt: new Date().toLocaleString("ar-SA"),
      customerName,
      customerPhone,
      method,
      address: method === "delivery" ? address : "",
      notes,
      itemsSummary: cart.map(l => `${l.name} ×${l.qty}`).join("، "),
      total: cartTotal(cart),
      status: "جديد"
    };

    // الأولوية لواتساب — لو تسجيل الطلب في الشيت فشل، ما نمنعش
    // العميل من إرسال الطلب فعليًا
    try {
      await DataService.addOrder(order);
    } catch (err) {
      console.warn("تعذر تسجيل الطلب في جوجل شيت:", err);
    }
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setSending(false);
    setCart([]);
    onDone();
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 fade-in",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-surface text-main w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto pop-in",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "samaq-sheet-header px-5 py-4 flex items-center justify-between rounded-t-3xl sm:rounded-t-3xl"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "font-extrabold text-lg title"
  }, "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0637\u0644\u0628"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "samaq-text-muted"
  }, /*#__PURE__*/React.createElement(IconClose, {
    className: "w-5 h-5"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-5 flex flex-col gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-bold text-main mb-1 block"
  }, "\u0627\u0644\u0627\u0633\u0645"), /*#__PURE__*/React.createElement("input", {
    value: customerName,
    onChange: e => setCustomerName(e.target.value),
    className: "w-full border bg-page border-theme rounded-xl p-2.5 text-sm focus:outline-none focus:border-samaq-blue text-main",
    placeholder: "\u0627\u0633\u0645\u0643 \u0627\u0644\u0643\u0627\u0645\u0644"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-bold text-main mb-1 block"
  }, "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641"), /*#__PURE__*/React.createElement("input", {
    type: "tel",
    value: customerPhone,
    onChange: e => setCustomerPhone(e.target.value),
    className: "w-full border bg-page border-theme rounded-xl p-2.5 text-sm focus:outline-none focus:border-samaq-blue text-main",
    placeholder: "05xxxxxxxx",
    dir: "ltr"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-bold text-main mb-2 block"
  }, "\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setMethod("delivery"),
    className: `flex-1 rounded-xl py-2.5 text-sm font-bold border ${method === "delivery" ? "bg-samaq-blue text-white border-samaq-blue" : "border-theme samaq-text-muted"}`
  }, "\u062A\u0648\u0635\u064A\u0644"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMethod("pickup"),
    className: `flex-1 rounded-xl py-2.5 text-sm font-bold border ${method === "pickup" ? "bg-samaq-blue text-white border-samaq-blue" : "border-theme samaq-text-muted"}`
  }, "\u0627\u0633\u062A\u0644\u0627\u0645 \u0645\u0646 \u0627\u0644\u0641\u0631\u0639"))), method === "delivery" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-bold text-main mb-1 block"
  }, "\u0627\u0644\u0639\u0646\u0648\u0627\u0646"), /*#__PURE__*/React.createElement("textarea", {
    value: address,
    onChange: e => setAddress(e.target.value),
    rows: 2,
    className: "w-full border bg-page border-theme rounded-xl p-2.5 text-sm focus:outline-none focus:border-samaq-blue text-main",
    placeholder: "\u0627\u0644\u062D\u064A\u060C \u0627\u0644\u0634\u0627\u0631\u0639\u060C \u0623\u0642\u0631\u0628 \u0645\u0639\u0644\u0645"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-bold text-main mb-1 block"
  }, "\u0645\u0644\u0627\u062D\u0638\u0627\u062A (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)"), /*#__PURE__*/React.createElement("textarea", {
    value: notes,
    onChange: e => setNotes(e.target.value),
    rows: 2,
    className: "w-full border bg-page border-theme rounded-xl p-2.5 text-sm focus:outline-none focus:border-samaq-blue text-main"
  })), error && /*#__PURE__*/React.createElement("p", {
    className: "text-red-500 text-xs font-bold"
  }, error), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between border-t pt-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-main"
  }, "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A"), /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-samaq-green text-lg"
  }, formatPrice(cartTotal(cart), settings.currency))), /*#__PURE__*/React.createElement("button", {
    disabled: sending,
    onClick: handleSubmit,
    className: "bg-samaq-green disabled:opacity-60 text-white font-extrabold rounded-2xl py-3 flex items-center justify-center gap-2 hover:brightness-110 transition"
  }, /*#__PURE__*/React.createElement(IconWhatsapp, {
    className: "w-5 h-5"
  }), sending ? "جارِ الإرسال..." : "إرسال الطلب عبر واتساب"))));
}