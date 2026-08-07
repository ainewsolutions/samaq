// ============================================================
// SAMAQ — Menu components: CategoryTabs, ItemCard, ItemModal
// ============================================================

function formatPrice(n, currency) {
  const val = Number(n || 0);
  return `${val.toFixed(2)} ${currency || "ر.س"}`;
}
function categoryIconFor(name) {
  const n = String(name || "");
  if (/سمك|روبيان|بحري/.test(n)) return IconCatFish;
  if (/مشروب/.test(n)) return IconCatDrink;
  if (/صلص/.test(n)) return IconCatSauce;
  if (/كافيار/.test(n)) return IconCatCaviar;
  if (/مجمد/.test(n)) return IconCatFrozen;
  if (/طبخ|طبي/.test(n)) return IconCatChef;
  return IconCatDefault;
}
function CategoryTabs({
  categories,
  activeId,
  onSelect
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sticky top-[64px] z-30 bg-page/95 backdrop-blur border-b border-theme"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-5xl mx-auto px-3 py-2 flex gap-2 overflow-x-auto no-scrollbar"
  }, categories.map(c => {
    const Icon = categoryIconFor(c.name);
    return /*#__PURE__*/React.createElement("button", {
      key: c.id,
      "data-active": c.id === activeId,
      onClick: () => onSelect(c.id),
      className: "category-pill px-4 py-2 rounded-full text-sm font-bold shrink-0 flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement(Icon, {
      className: "w-4 h-4"
    }), /*#__PURE__*/React.createElement("span", null, c.name));
  })));
}
function ItemImage({
  item,
  className
}) {
  if (item.image) {
    return /*#__PURE__*/React.createElement("img", {
      src: item.image,
      alt: item.name,
      className: className,
      loading: "lazy"
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: `item-image-fallback flex items-center justify-center ${className}`
  }, /*#__PURE__*/React.createElement(IconFishWatermark, {
    className: "w-10 h-10 text-samaq-blue opacity-40"
  }));
}
function ItemCard({
  item,
  currency,
  onOpen
}) {
  const hasOptions = item.options && item.options.length > 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "item-card rounded-2xl overflow-hidden flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative w-full bg-[#eef3ee] cursor-pointer",
    onClick: () => item.available && onOpen(item)
  }, /*#__PURE__*/React.createElement(ItemImage, {
    item: item,
    className: "w-full h-48 sm:h-40 object-contain"
  }), !item.available && /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-white/70 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-black/80 text-white text-xs px-3 py-1 rounded-full"
  }, "\u063A\u064A\u0631 \u0645\u062A\u0627\u062D \u062D\u0627\u0644\u064A\u064B\u0627"))), /*#__PURE__*/React.createElement("div", {
    className: "p-3 flex flex-col gap-1 flex-1"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-main text-sm leading-snug line-clamp-2"
  }, item.name), item.description && /*#__PURE__*/React.createElement("p", {
    className: "text-xs samaq-text-muted line-clamp-2"
  }, item.description), /*#__PURE__*/React.createElement("div", {
    className: "mt-auto pt-2 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-samaq-green font-extrabold text-sm"
  }, formatPrice(item.price, currency)), /*#__PURE__*/React.createElement("button", {
    disabled: !item.available,
    onClick: () => onOpen(item),
    className: "bg-samaq-blue disabled:bg-gray-300 text-white text-xs font-bold rounded-full px-3 py-1.5 hover:brightness-110 transition"
  }, hasOptions ? "اختر" : "إضافة"))));
}
function ItemModal({
  item,
  currency,
  onClose,
  onAdd
}) {
  const [qty, setQty] = useState(1);
  const [selections, setSelections] = useState({}); // groupId -> choiceId | [choiceId,...]
  const [notes, setNotes] = useState("");
  useEffect(() => {
    const init = {};
    (item.options || []).forEach(g => {
      if (g.required && g.choices.length) {
        init[g.id] = g.multiple ? [g.choices[0].id] : g.choices[0].id;
      }
    });
    setSelections(init);
  }, [item]);
  const extra = useMemo(() => {
    let sum = 0;
    (item.options || []).forEach(g => {
      const sel = selections[g.id];
      if (!sel) return;
      const ids = Array.isArray(sel) ? sel : [sel];
      ids.forEach(cid => {
        const choice = g.choices.find(c => c.id === cid);
        if (choice) sum += Number(choice.priceDelta || 0);
      });
    });
    return sum;
  }, [selections, item]);
  const unitPrice = Number(item.price || 0) + extra;
  const totalPrice = unitPrice * qty;
  const missingRequired = (item.options || []).some(g => {
    if (!g.required) return false;
    const sel = selections[g.id];
    return !sel || Array.isArray(sel) && sel.length === 0;
  });
  function toggleChoice(group, choiceId) {
    setSelections(prev => {
      const next = {
        ...prev
      };
      if (group.multiple) {
        const cur = new Set(next[group.id] || []);
        cur.has(choiceId) ? cur.delete(choiceId) : cur.add(choiceId);
        next[group.id] = Array.from(cur);
      } else {
        next[group.id] = choiceId;
      }
      return next;
    });
  }
  function handleAdd() {
    if (missingRequired) return;
    const optionsSummary = (item.options || []).map(g => {
      const sel = selections[g.id];
      if (!sel) return null;
      const ids = Array.isArray(sel) ? sel : [sel];
      const labels = ids.map(cid => g.choices.find(c => c.id === cid)?.label).filter(Boolean);
      return labels.length ? `${g.title}: ${labels.join("، ")}` : null;
    }).filter(Boolean);
    onAdd({
      lineId: `${item.id}_${Date.now()}`,
      itemId: item.id,
      name: item.name,
      unitPrice,
      qty,
      optionsSummary,
      notes: notes.trim(),
      totalPrice
    });
    onClose();
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 fade-in",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-surface text-main w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto pop-in",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(ItemImage, {
    item: item,
    className: "w-full h-56 sm:h-52 object-contain bg-[#eef3ee]"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "absolute top-3 left-3 bg-white/90 rounded-full p-2 shadow"
  }, /*#__PURE__*/React.createElement(IconClose, {
    className: "w-4 h-4 text-[#333]"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-5 flex flex-col gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-extrabold text-main"
  }, item.name), item.description && /*#__PURE__*/React.createElement("p", {
    className: "text-sm samaq-text-muted mt-1"
  }, item.description), /*#__PURE__*/React.createElement("p", {
    className: "text-samaq-green font-bold mt-2"
  }, formatPrice(item.price, currency))), (item.options || []).map(g => /*#__PURE__*/React.createElement("div", {
    key: g.id,
    className: "dashed-sep pt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-2"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-sm text-main"
  }, g.title), g.required && /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] bg-samaq-gold/30 text-[#7a5b00] px-2 py-0.5 rounded-full font-bold"
  }, "\u0645\u0637\u0644\u0648\u0628")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-2"
  }, g.choices.map(c => {
    const sel = selections[g.id];
    const checked = Array.isArray(sel) ? sel.includes(c.id) : sel === c.id;
    return /*#__PURE__*/React.createElement("label", {
      key: c.id,
      className: `flex items-center justify-between border rounded-xl px-3 py-2 cursor-pointer text-sm text-main ${checked ? "border-samaq-blue" : "border-theme"}`
    }, /*#__PURE__*/React.createElement("span", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("input", {
      type: g.multiple ? "checkbox" : "radio",
      name: g.id,
      checked: checked,
      onChange: () => toggleChoice(g, c.id),
      className: "accent-[#006994]"
    }), /*#__PURE__*/React.createElement("span", {
      className: "font-bold"
    }, c.label)), c.priceDelta ? /*#__PURE__*/React.createElement("span", {
      className: "text-xs samaq-text-muted"
    }, "+", c.priceDelta, " ", currency) : null);
  })))), /*#__PURE__*/React.createElement("div", {
    className: "dashed-sep pt-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-sm text-main mb-2"
  }, "\u0645\u0644\u0627\u062D\u0638\u0627\u062A (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)"), /*#__PURE__*/React.createElement("textarea", {
    value: notes,
    onChange: e => setNotes(e.target.value),
    rows: 2,
    placeholder: "\u0645\u062B\u0627\u0644: \u0628\u062F\u0648\u0646 \u0641\u0644\u0641\u0644 \u062D\u0627\u0631",
    className: "w-full bg-page border-theme rounded-xl p-2 text-sm focus:outline-none focus:border-samaq-blue text-main"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between dashed-sep pt-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-sm text-main"
  }, "\u0627\u0644\u0643\u0645\u064A\u0629"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(q => Math.max(1, q - 1)),
    className: "w-9 h-9 rounded-full bg-page border border-theme text-main flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(IconMinus, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement("span", {
    className: "w-6 text-center font-bold"
  }, qty), /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(q => q + 1),
    className: "w-9 h-9 rounded-full bg-page border border-theme text-main flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(IconPlus, {
    className: "w-4 h-4"
  })))), /*#__PURE__*/React.createElement("button", {
    disabled: missingRequired,
    onClick: handleAdd,
    className: "bg-samaq-green disabled:bg-gray-300 text-white font-extrabold rounded-2xl py-3 flex items-center justify-center gap-2 hover:brightness-110 transition"
  }, "\u0625\u0636\u0627\u0641\u0629 \u0644\u0644\u0633\u0644\u0629 \u2014 ", formatPrice(totalPrice, currency)))));
}
function MenuPage({
  categories,
  items,
  settings,
  cart,
  setCart
}) {
  const activeCategories = categories.filter(c => c.active).sort((a, b) => a.order - b.order);
  const [activeCat, setActiveCat] = useState(activeCategories[0]?.id);
  const [openItem, setOpenItem] = useState(null);
  const sectionRefs = useRef({});
  useEffect(() => {
    if (!activeCat && activeCategories.length) setActiveCat(activeCategories[0].id);
  }, [activeCategories]);
  function scrollToCategory(id) {
    setActiveCat(id);
    const el = sectionRefs.current[id];
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({
        top: y,
        behavior: "smooth"
      });
    }
  }
  function addToCart(line) {
    setCart(prev => [...prev, line]);
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center pt-6 pb-2 bg-page"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/samaq-logo.png",
    alt: "SAMAQ",
    className: "h-24 sm:h-28 w-auto drop-shadow-sm"
  })), /*#__PURE__*/React.createElement(CategoryTabs, {
    categories: activeCategories,
    activeId: activeCat,
    onSelect: scrollToCategory
  }), /*#__PURE__*/React.createElement("div", {
    className: "max-w-5xl mx-auto px-3 pb-28"
  }, activeCategories.map(cat => {
    const catItems = items.filter(i => i.categoryId === cat.id).sort((a, b) => (a.order || 0) - (b.order || 0));
    return /*#__PURE__*/React.createElement("section", {
      key: cat.id,
      ref: el => sectionRefs.current[cat.id] = el,
      className: "pt-6"
    }, cat.bannerImage && /*#__PURE__*/React.createElement("div", {
      className: "w-full aspect-[21/6] sm:aspect-[21/5] rounded-2xl overflow-hidden mb-3"
    }, /*#__PURE__*/React.createElement("img", {
      src: cat.bannerImage,
      alt: cat.name,
      className: "w-full h-full object-cover",
      loading: "lazy"
    })), /*#__PURE__*/React.createElement("h2", {
      className: "category-section-title text-lg font-extrabold mb-3 flex items-center gap-2"
    }, (() => {
      const Icon = categoryIconFor(cat.name);
      return /*#__PURE__*/React.createElement(Icon, {
        className: "w-5 h-5 text-samaq-blue"
      });
    })(), cat.name), catItems.length > 0 ? /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-1 sm:grid-cols-3 gap-3"
    }, catItems.map(it => /*#__PURE__*/React.createElement(ItemCard, {
      key: it.id,
      item: it,
      currency: settings.currency,
      onOpen: setOpenItem
    }))) : /*#__PURE__*/React.createElement("p", {
      className: "text-sm samaq-text-muted text-center py-8 bg-surface rounded-2xl border border-theme"
    }, "\u0644\u0627 \u064A\u0648\u062C\u062F \u0623\u0635\u0646\u0627\u0641 \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u062A\u0635\u0646\u064A\u0641 \u062D\u0627\u0644\u064A\u064B\u0627"));
  })), openItem && /*#__PURE__*/React.createElement(ItemModal, {
    item: openItem,
    currency: settings.currency,
    onClose: () => setOpenItem(null),
    onAdd: addToCart
  }));
}