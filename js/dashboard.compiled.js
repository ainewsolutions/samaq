// ============================================================
// SAMAQ — Dashboard (لوحة تحكم صاحب المطعم)
// كل التعديلات هنا بتتحفظ فورًا في Google Sheets عن طريق الـ API،
// مفيش أي تخزين محلي على الجهاز.
// ============================================================

function isToday(dateStr) {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  } catch (e) {
    return false;
  }
}
function isThisWeek(dateStr) {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = (now - d) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  } catch (e) {
    return false;
  }
}

// ---------------- تسجيل الدخول ----------------
function LoginModal({
  onClose,
  onSuccess
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit() {
    if (!password) return;
    setLoading(true);
    setError("");
    try {
      const res = await DataService.login(password);
      if (res.ok) onSuccess();else setError("كلمة المرور غير صحيحة");
    } catch (err) {
      setError("تعذر الاتصال بالسيرفر: " + err.message);
    } finally {
      setLoading(false);
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 fade-in",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl w-full max-w-sm p-6 pop-in",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-[#173a2a] mb-1"
  }, "\u062F\u062E\u0648\u0644 \u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-400 mb-4"
  }, "\u0644\u0635\u0627\u062D\u0628 \u0627\u0644\u0645\u0637\u0639\u0645 \u0641\u0642\u0637"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    autoFocus: true,
    value: password,
    onChange: e => setPassword(e.target.value),
    onKeyDown: e => e.key === "Enter" && submit(),
    placeholder: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631",
    className: "w-full border border-gray-200 rounded-xl p-2.5 text-sm mb-2",
    dir: "ltr"
  }), error && /*#__PURE__*/React.createElement("p", {
    className: "text-red-500 text-xs font-bold mb-2"
  }, error), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mt-3"
  }, /*#__PURE__*/React.createElement("button", {
    disabled: loading,
    onClick: submit,
    className: "flex-1 bg-samaq-green disabled:opacity-60 text-white rounded-xl py-2.5 font-bold"
  }, loading ? "..." : "دخول"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "flex-1 border rounded-xl py-2.5 font-bold"
  }, "\u0625\u0644\u063A\u0627\u0621"))));
}

// ---------------- نظرة عامة ----------------
function DashboardOverview({
  orders,
  items
}) {
  const todayOrders = orders.filter(o => isToday(o.createdAt));
  const weekOrders = orders.filter(o => isThisWeek(o.createdAt));
  const salesToday = todayOrders.reduce((s, o) => s + Number(o.total || 0), 0);
  const salesWeek = weekOrders.reduce((s, o) => s + Number(o.total || 0), 0);
  const itemCount = {};
  orders.forEach(o => {
    (o.itemsSummary || "").split("،").forEach(seg => {
      const name = seg.split("×")[0].trim();
      if (!name) return;
      itemCount[name] = (itemCount[name] || 0) + 1;
    });
  });
  const top = Object.entries(itemCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCount = top.length ? top[0][1] : 1;
  const cards = [{
    label: "طلبات اليوم",
    value: todayOrders.length
  }, {
    label: "مبيعات اليوم",
    value: `${salesToday.toFixed(2)} ر.س`
  }, {
    label: "مبيعات الأسبوع",
    value: `${salesWeek.toFixed(2)} ر.س`
  }, {
    label: "إجمالي الأصناف",
    value: items.length
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-3"
  }, cards.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.label,
    className: "bg-white rounded-2xl border border-gray-100 p-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mb-1"
  }, c.label), /*#__PURE__*/React.createElement("p", {
    className: "text-xl font-extrabold text-[#173a2a]"
  }, c.value)))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl border border-gray-100 p-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-[#173a2a] mb-3"
  }, "\u0627\u0644\u0623\u0643\u062B\u0631 \u0645\u0628\u064A\u0639\u064B\u0627"), top.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-400"
  }, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0637\u0644\u0628\u0627\u062A \u0628\u0639\u062F"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-2"
  }, top.map(([name, count]) => /*#__PURE__*/React.createElement("div", {
    key: name,
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs w-32 truncate"
  }, name), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-samaq-green h-full rounded-full",
    style: {
      width: `${count / maxCount * 100}%`
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-gray-500 w-5 text-left"
  }, count))))));
}

// ---------------- التصنيفات والأصناف ----------------
function DashboardCategories({
  categories,
  setCategories,
  items,
  setItems,
  selectedCat,
  setSelectedCat
}) {
  const [dragId, setDragId] = useState(null);
  const [editingCat, setEditingCat] = useState(null); // {id?, name, bannerImage}
  const [saving, setSaving] = useState(false);
  async function persistCats(list) {
    setSaving(true);
    try {
      const res = await DataService.saveCategories(list);
      setCategories(res.categories);
    } catch (err) {
      alert("تعذر الحفظ في جوجل شيت: " + err.message);
    } finally {
      setSaving(false);
    }
  }
  async function persistItems(list) {
    setSaving(true);
    try {
      const res = await DataService.saveMenu(list);
      setItems(res.items);
    } catch (err) {
      alert("تعذر الحفظ في جوجل شيت: " + err.message);
    } finally {
      setSaving(false);
    }
  }
  function reorder(list, fromId, toId) {
    const sorted = [...list].sort((a, b) => a.order - b.order);
    const fromIdx = sorted.findIndex(x => x.id === fromId);
    const toIdx = sorted.findIndex(x => x.id === toId);
    if (fromIdx === -1 || toIdx === -1) return list;
    const [moved] = sorted.splice(fromIdx, 1);
    sorted.splice(toIdx, 0, moved);
    return sorted.map((x, i) => ({
      ...x,
      order: i + 1
    }));
  }
  function onDropCategory(targetId) {
    if (!dragId || dragId === targetId) return;
    persistCats(reorder(categories, dragId, targetId));
    setDragId(null);
  }
  function toggleCatActive(id) {
    persistCats(categories.map(c => c.id === id ? {
      ...c,
      active: !c.active
    } : c));
  }
  function deleteCategory(id) {
    if (!confirm("هل تريد حذف التصنيف؟ سيتم حذف كل الأصناف بداخله أيضًا.")) return;
    persistCats(categories.filter(c => c.id !== id));
    persistItems(items.filter(i => i.categoryId !== id));
    if (selectedCat === id) setSelectedCat(null);
  }
  function saveCategory() {
    if (!editingCat.name.trim()) return;
    if (editingCat.id) {
      persistCats(categories.map(c => c.id === editingCat.id ? {
        ...c,
        name: editingCat.name,
        bannerImage: editingCat.bannerImage
      } : c));
    } else {
      persistCats([...categories, {
        id: "",
        name: editingCat.name,
        bannerImage: editingCat.bannerImage || "",
        order: categories.length + 1,
        active: true
      }]);
    }
    setEditingCat(null);
  }
  const catItems = selectedCat ? items.filter(i => i.categoryId === selectedCat) : [];
  return /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl border border-gray-100 p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-[#173a2a]"
  }, "\u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A ", saving && /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-gray-400 font-normal"
  }, "(\u062C\u0627\u0631\u0650 \u0627\u0644\u062D\u0641\u0638...)")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditingCat({
      name: "",
      bannerImage: ""
    }),
    className: "text-xs bg-samaq-green text-white rounded-full px-3 py-1.5 font-bold"
  }, "+ \u062A\u0635\u0646\u064A\u0641 \u062C\u062F\u064A\u062F")), editingCat && /*#__PURE__*/React.createElement("div", {
    className: "border border-gray-100 rounded-xl p-3 mb-3 flex flex-col gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    value: editingCat.name,
    onChange: e => setEditingCat({
      ...editingCat,
      name: e.target.value
    }),
    placeholder: "\u0627\u0633\u0645 \u0627\u0644\u062A\u0635\u0646\u064A\u0641",
    className: "border border-gray-200 rounded-lg p-2 text-sm"
  }), /*#__PURE__*/React.createElement(ImageUploader, {
    label: "\u0628\u0627\u0646\u0631 \u0627\u0644\u062A\u0635\u0646\u064A\u0641 (\u0635\u0648\u0631\u0629 \u0639\u0631\u064A\u0636\u0629 \u062A\u0638\u0647\u0631 \u0623\u0639\u0644\u0649 \u0627\u0644\u0645\u0646\u064A\u0648)",
    aspect: "wide",
    value: editingCat.bannerImage,
    onChange: url => setEditingCat({
      ...editingCat,
      bannerImage: url
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: saveCategory,
    className: "flex-1 bg-samaq-blue text-white text-xs py-2 rounded-lg font-bold"
  }, "\u062D\u0641\u0638"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditingCat(null),
    className: "flex-1 text-xs py-2 rounded-lg border"
  }, "\u0625\u0644\u063A\u0627\u0621"))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-2"
  }, categories.sort((a, b) => a.order - b.order).map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    draggable: true,
    onDragStart: () => setDragId(c.id),
    onDragOver: e => e.preventDefault(),
    onDrop: () => onDropCategory(c.id),
    onClick: () => setSelectedCat(c.id),
    className: `flex items-center gap-2 border rounded-xl p-2.5 cursor-pointer ${selectedCat === c.id ? "border-samaq-blue bg-blue-50" : "border-gray-100"}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "drag-handle text-gray-400"
  }, /*#__PURE__*/React.createElement(IconDrag, {
    className: "w-4 h-4"
  })), c.bannerImage && /*#__PURE__*/React.createElement("img", {
    src: c.bannerImage,
    className: "w-8 h-8 rounded-lg object-cover",
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    className: "flex-1 text-sm font-bold"
  }, c.name), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      setEditingCat({
        id: c.id,
        name: c.name,
        bannerImage: c.bannerImage
      });
    },
    className: "text-gray-400 hover:text-samaq-blue"
  }, /*#__PURE__*/React.createElement(IconEdit, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement("label", {
    className: "inline-flex items-center cursor-pointer",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: c.active,
    onChange: () => toggleCatActive(c.id),
    className: "sr-only peer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-9 h-5 bg-gray-200 peer-checked:bg-samaq-green rounded-full relative transition"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-0.5 bg-white w-4 h-4 rounded-full transition-all",
    style: {
      right: c.active ? "18px" : "2px"
    }
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      deleteCategory(c.id);
    },
    className: "text-red-300 hover:text-red-500"
  }, /*#__PURE__*/React.createElement(IconTrash, {
    className: "w-4 h-4"
  })))))), /*#__PURE__*/React.createElement(DashboardItems, {
    categoryId: selectedCat,
    items: catItems,
    allItems: items,
    setItems: persistItems
  }));
}
function emptyItem(categoryId, order) {
  return {
    id: "",
    categoryId,
    name: "",
    description: "",
    price: 0,
    image: "",
    options: [],
    available: true,
    order
  };
}

// يحوّل بنية options الكاملة لقائمة بسيطة {label, priceDelta} تتعامل معاها الواجهة بسهولة
function optionsToAddons(options) {
  if (!options || !options.length || !options[0].choices) return [];
  return options[0].choices.map(c => ({
    label: c.label,
    priceDelta: c.priceDelta
  }));
}
function optionsMeta(options) {
  if (!options || !options.length) return {
    required: false,
    multiple: true
  };
  return {
    required: !!options[0].required,
    multiple: options[0].multiple !== false
  };
}
function addonsToOptions(addons, required, multiple) {
  const valid = (addons || []).filter(a => a.label && a.label.trim());
  if (!valid.length) return [];
  return [{
    id: "addons",
    title: required ? "النوع" : "إضافات",
    required: !!required,
    multiple: multiple !== false,
    choices: valid.map((a, i) => ({
      id: "c" + i,
      label: a.label.trim(),
      priceDelta: parseFloat(a.priceDelta) || 0
    }))
  }];
}
function DashboardItems({
  categoryId,
  items,
  allItems,
  setItems
}) {
  const [dragId, setDragId] = useState(null);
  const [editing, setEditing] = useState(null);
  if (!categoryId) {
    return /*#__PURE__*/React.createElement("div", {
      className: "bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-center text-sm text-gray-400"
    }, "\u0627\u062E\u062A\u0631 \u062A\u0635\u0646\u064A\u0641\u064B\u0627 \u0645\u0646 \u0627\u0644\u064A\u0633\u0627\u0631 \u0644\u0625\u062F\u0627\u0631\u0629 \u0623\u0635\u0646\u0627\u0641\u0647");
  }
  function persist(newList) {
    const others = allItems.filter(i => i.categoryId !== categoryId);
    setItems([...others, ...newList]);
  }
  function reorder(list, fromId, toId) {
    const sorted = [...list].sort((a, b) => a.order - b.order);
    const fromIdx = sorted.findIndex(x => x.id === fromId);
    const toIdx = sorted.findIndex(x => x.id === toId);
    if (fromIdx === -1 || toIdx === -1) return list;
    const [moved] = sorted.splice(fromIdx, 1);
    sorted.splice(toIdx, 0, moved);
    return sorted.map((x, i) => ({
      ...x,
      order: i + 1
    }));
  }
  function onDrop(targetId) {
    if (!dragId || dragId === targetId) return;
    persist(reorder(items, dragId, targetId));
    setDragId(null);
  }
  function toggleAvailable(id) {
    persist(items.map(i => i.id === id ? {
      ...i,
      available: !i.available
    } : i));
  }
  function deleteItem(id) {
    if (!confirm("حذف هذا الصنف؟")) return;
    persist(items.filter(i => i.id !== id));
  }
  function startAdd() {
    setEditing({
      ...emptyItem(categoryId, items.length + 1),
      addons: [],
      required: false,
      multiple: true
    });
  }
  function saveEdit() {
    if (!editing.name.trim()) return;
    const {
      addons,
      required,
      multiple,
      ...rest
    } = editing;
    const itemToSave = {
      ...rest,
      options: addonsToOptions(addons, required, multiple)
    };
    const exists = items.some(i => i.id && i.id === itemToSave.id);
    const next = exists ? items.map(i => i.id === itemToSave.id ? itemToSave : i) : [...items, itemToSave];
    persist(next);
    setEditing(null);
  }
  function updateAddon(index, field, value) {
    setEditing(prev => {
      const addons = [...(prev.addons || [])];
      addons[index] = {
        ...addons[index],
        [field]: value
      };
      return {
        ...prev,
        addons
      };
    });
  }
  function addAddonRow() {
    setEditing(prev => ({
      ...prev,
      addons: [...(prev.addons || []), {
        label: "",
        priceDelta: 0
      }]
    }));
  }
  function removeAddonRow(index) {
    setEditing(prev => ({
      ...prev,
      addons: (prev.addons || []).filter((_, i) => i !== index)
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl border border-gray-100 p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-[#173a2a]"
  }, "\u0623\u0635\u0646\u0627\u0641 \u0627\u0644\u062A\u0635\u0646\u064A\u0641"), /*#__PURE__*/React.createElement("button", {
    onClick: startAdd,
    className: "text-xs bg-samaq-green text-white rounded-full px-3 py-1.5 font-bold"
  }, "+ \u0635\u0646\u0641 \u062C\u062F\u064A\u062F")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-2 max-h-[420px] overflow-y-auto"
  }, items.sort((a, b) => (a.order || 0) - (b.order || 0)).map(it => /*#__PURE__*/React.createElement("div", {
    key: it.id || it.name,
    draggable: true,
    onDragStart: () => setDragId(it.id),
    onDragOver: e => e.preventDefault(),
    onDrop: () => onDrop(it.id),
    className: "flex items-center gap-2 border border-gray-100 rounded-xl p-2.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "drag-handle text-gray-400"
  }, /*#__PURE__*/React.createElement(IconDrag, {
    className: "w-4 h-4"
  })), it.image && /*#__PURE__*/React.createElement("img", {
    src: it.image,
    className: "w-9 h-9 rounded-lg object-cover",
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-bold truncate"
  }, it.name || "(بدون اسم)"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-400"
  }, Number(it.price).toFixed(2), " \u0631.\u0633", it.options && it.options.length > 0 && it.options[0].choices?.length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "text-samaq-blue font-bold"
  }, " \xB7 ", it.options[0].choices.length, " \u0625\u0636\u0627\u0641\u0627\u062A"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditing({
      ...it,
      addons: optionsToAddons(it.options),
      ...optionsMeta(it.options)
    }),
    className: "text-gray-400 hover:text-samaq-blue"
  }, /*#__PURE__*/React.createElement(IconEdit, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement("label", {
    className: "inline-flex items-center cursor-pointer"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: it.available,
    onChange: () => toggleAvailable(it.id),
    className: "sr-only peer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-9 h-5 bg-gray-200 peer-checked:bg-samaq-green rounded-full relative transition"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-0.5 bg-white w-4 h-4 rounded-full transition-all",
    style: {
      right: it.available ? "18px" : "2px"
    }
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => deleteItem(it.id),
    className: "text-red-300 hover:text-red-500"
  }, /*#__PURE__*/React.createElement(IconTrash, {
    className: "w-4 h-4"
  })))), items.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-400 text-center py-6"
  }, "\u0644\u0627 \u064A\u0648\u062C\u062F \u0623\u0635\u0646\u0627\u0641 \u0628\u0639\u062F \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u062A\u0635\u0646\u064A\u0641")), editing && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 fade-in",
    onClick: () => setEditing(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl w-full max-w-md p-5 max-h-[90vh] overflow-y-auto pop-in",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-[#173a2a] mb-4"
  }, "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0635\u0646\u0641"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-3"
  }, /*#__PURE__*/React.createElement(ImageUploader, {
    aspect: "square",
    value: editing.image,
    onChange: url => setEditing({
      ...editing,
      image: url
    })
  }), /*#__PURE__*/React.createElement("input", {
    value: editing.name,
    onChange: e => setEditing({
      ...editing,
      name: e.target.value
    }),
    placeholder: "\u0627\u0633\u0645 \u0627\u0644\u0635\u0646\u0641",
    className: "border border-gray-200 rounded-lg p-2.5 text-sm"
  }), /*#__PURE__*/React.createElement("textarea", {
    value: editing.description,
    onChange: e => setEditing({
      ...editing,
      description: e.target.value
    }),
    placeholder: "\u0627\u0644\u0648\u0635\u0641 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)",
    rows: 2,
    className: "border border-gray-200 rounded-lg p-2.5 text-sm"
  }), /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.01",
    value: editing.price,
    onChange: e => setEditing({
      ...editing,
      price: parseFloat(e.target.value) || 0
    }),
    placeholder: "\u0627\u0644\u0633\u0639\u0631",
    className: "border border-gray-200 rounded-lg p-2.5 text-sm"
  }), /*#__PURE__*/React.createElement("label", {
    className: "flex items-center gap-2 text-sm"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: editing.available,
    onChange: e => setEditing({
      ...editing,
      available: e.target.checked
    })
  }), "\u0645\u062A\u0627\u062D \u0644\u0644\u0637\u0644\u0628"), /*#__PURE__*/React.createElement("div", {
    className: "border-t pt-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold text-gray-500 mb-2 block"
  }, "\u062E\u064A\u0627\u0631\u0627\u062A \u0625\u0636\u0627\u0641\u064A\u0629 \u0644\u0644\u0635\u0646\u0641 (\u0625\u0636\u0627\u0641\u0627\u062A \u0627\u062E\u062A\u064A\u0627\u0631\u064A\u0629 \u0632\u064A \u0634\u0648\u064A/\u0642\u0644\u064A/\u0645\u062A\u0628\u0644\u060C \u0623\u0648 \u0623\u0646\u0648\u0627\u0639 \u0625\u062C\u0628\u0627\u0631\u064A\u0629 \u0632\u064A \u0633\u0645\u0643/\u0631\u0648\u0628\u064A\u0627\u0646)"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-1.5 mb-3 bg-gray-50 rounded-xl p-2.5"
  }, /*#__PURE__*/React.createElement("label", {
    className: "flex items-center gap-2 text-xs"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!editing.required,
    onChange: e => setEditing({
      ...editing,
      required: e.target.checked
    })
  }), "\u0627\u062E\u062A\u064A\u0627\u0631 \u0625\u062C\u0628\u0627\u0631\u064A (\u0627\u0644\u0639\u0645\u064A\u0644 \u0644\u0627\u0632\u0645 \u064A\u062E\u062A\u0627\u0631 \u0642\u0628\u0644 \u0645\u0627 \u064A\u0636\u064A\u0641 \u0644\u0644\u0633\u0644\u0629) \u2014 \u0627\u0633\u062A\u062E\u062F\u0645\u0647\u0627 \u0644\u0648 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0645\u062E\u062A\u0644\u0641\u0629 \u0641\u0639\u0644\u064A\u064B\u0627 \u062D\u0633\u0628 \u0627\u0644\u0646\u0648\u0639"), /*#__PURE__*/React.createElement("label", {
    className: "flex items-center gap-2 text-xs"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: editing.multiple !== false,
    onChange: e => setEditing({
      ...editing,
      multiple: e.target.checked
    })
  }), "\u064A\u0633\u0645\u062D \u0628\u0627\u062E\u062A\u064A\u0627\u0631 \u0623\u0643\u062B\u0631 \u0645\u0646 \u062E\u064A\u0627\u0631 \u0645\u0639 \u0628\u0639\u0636 (\u0633\u064A\u0628\u0647\u0627 \u0645\u0641\u0639\u0651\u0644\u0629 \u0644\u0644\u0625\u0636\u0627\u0641\u0627\u062A\u060C \u0634\u064A\u0644\u0647\u0627 \u0644\u0644\u0623\u0646\u0648\u0627\u0639)")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-2"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-400 -mt-1"
  }, "\u0627\u0644\u0633\u0639\u0631 \u0647\u0646\u0627 \u0647\u0648 ", /*#__PURE__*/React.createElement("b", null, "\u0627\u0644\u0641\u0631\u0642"), " \u0639\u0646 \u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0623\u0633\u0627\u0633\u064A \u0644\u0644\u0635\u0646\u0641\u060C \u0645\u0634 \u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0643\u0627\u0645\u0644. \u0645\u062B\u0627\u0644: \u0644\u0648 \u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0623\u0633\u0627\u0633\u064A 22.95 \u0648\u0627\u0644\u0646\u0648\u0639 \u0627\u0644\u062A\u0627\u0646\u064A \u0633\u0639\u0631\u0647 \u0627\u0644\u0643\u0627\u0645\u0644 36.95\u060C \u0627\u0643\u062A\u0628 \u0647\u0646\u0627 14 \u0628\u0633 (\u0627\u0644\u0641\u0631\u0642)."), (editing.addons || []).map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "flex gap-2 items-center"
  }, /*#__PURE__*/React.createElement("input", {
    value: a.label,
    onChange: e => updateAddon(i, "label", e.target.value),
    placeholder: "\u0627\u0633\u0645 \u0627\u0644\u062E\u064A\u0627\u0631 (\u0634\u0648\u064A / \u0628\u0631\u064A\u0627\u0646\u064A \u0633\u0645\u0643)",
    className: "flex-1 border border-gray-200 rounded-lg p-2 text-sm"
  }), /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.01",
    value: a.priceDelta,
    onChange: e => updateAddon(i, "priceDelta", e.target.value),
    placeholder: "\u0627\u0644\u0633\u0639\u0631",
    className: "w-20 border border-gray-200 rounded-lg p-2 text-sm"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => removeAddonRow(i),
    className: "text-red-300 hover:text-red-500 shrink-0"
  }, /*#__PURE__*/React.createElement(IconTrash, {
    className: "w-4 h-4"
  }))))), /*#__PURE__*/React.createElement("button", {
    onClick: addAddonRow,
    className: "text-xs bg-samaq-blue text-white rounded-full px-3 py-1.5 font-bold mt-2"
  }, "+ \u0625\u0636\u0627\u0641\u0629 \u062E\u064A\u0627\u0631 \u062C\u062F\u064A\u062F"))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mt-5"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: saveEdit,
    className: "flex-1 bg-samaq-green text-white rounded-xl py-2.5 font-bold"
  }, "\u062D\u0641\u0638"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditing(null),
    className: "flex-1 border rounded-xl py-2.5 font-bold"
  }, "\u0625\u0644\u063A\u0627\u0621")))));
}

// ---------------- الطلبات ----------------
// ---------------- الإعدادات ----------------
function DashboardSettings({
  settings,
  setSettings
}) {
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  async function save() {
    setSaving(true);
    try {
      const res = await DataService.saveSettings(form);
      setSettings(res.settings);
      alert("تم حفظ الإعدادات في جوجل شيت");
    } catch (err) {
      alert("تعذر الحفظ: " + err.message);
    } finally {
      setSaving(false);
    }
  }
  async function changePass() {
    setPassMsg("");
    if (!curPass || !newPass) {
      setPassMsg("املأ كل الخانات");
      return;
    }
    if (newPass !== confirmPass) {
      setPassMsg("كلمة المرور الجديدة غير متطابقة");
      return;
    }
    setPassLoading(true);
    try {
      const res = await DataService.changePassword(curPass, newPass);
      if (res.ok) {
        setPassMsg("تم تغيير كلمة المرور بنجاح");
        setCurPass("");
        setNewPass("");
        setConfirmPass("");
      }
    } catch (err) {
      setPassMsg(err.message);
    } finally {
      setPassLoading(false);
    }
  }
  function setSocial(key, val) {
    setForm({
      ...form,
      ["social" + key]: val
    });
  }
  const field = (label, value, onChange, dir) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold text-gray-500 mb-1 block"
  }, label), /*#__PURE__*/React.createElement("input", {
    value: value || "",
    onChange: e => onChange(e.target.value),
    dir: dir || "rtl",
    className: "w-full border border-gray-200 rounded-lg p-2.5 text-sm"
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-4 max-w-lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-[#173a2a] mb-1"
  }, "\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0639\u0627\u0645\u0629"), field("رقم الواتساب لاستقبال الطلبات (بدون +)", form.whatsappNumber, v => setForm({
    ...form,
    whatsappNumber: v
  }), "ltr"), field("رابط خرائط جوجل", form.googleMapsUrl, v => setForm({
    ...form,
    googleMapsUrl: v
  }), "ltr"), field("رابط Google Play", form.googlePlayUrl, v => setForm({
    ...form,
    googlePlayUrl: v
  }), "ltr"), field("رابط App Store", form.appStoreUrl, v => setForm({
    ...form,
    appStoreUrl: v
  }), "ltr"), field("واتساب (سوشيال)", form.socialWhatsapp, v => setSocial("Whatsapp", v), "ltr"), field("فيسبوك", form.socialFacebook, v => setSocial("Facebook", v), "ltr"), field("تيك توك", form.socialTiktok, v => setSocial("Tiktok", v), "ltr"), field("انستجرام", form.socialInstagram, v => setSocial("Instagram", v), "ltr"), field("إكس / تويتر", form.socialTwitter, v => setSocial("Twitter", v), "ltr"), /*#__PURE__*/React.createElement("button", {
    disabled: saving,
    onClick: save,
    className: "bg-samaq-green disabled:opacity-60 text-white rounded-xl py-2.5 font-bold mt-2"
  }, saving ? "جارِ الحفظ..." : "حفظ الإعدادات")), /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-[#173a2a] mb-1"
  }, "\u062A\u063A\u064A\u064A\u0631 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: curPass,
    onChange: e => setCurPass(e.target.value),
    placeholder: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062D\u0627\u0644\u064A\u0629",
    className: "border border-gray-200 rounded-lg p-2.5 text-sm",
    dir: "ltr"
  }), /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: newPass,
    onChange: e => setNewPass(e.target.value),
    placeholder: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629",
    className: "border border-gray-200 rounded-lg p-2.5 text-sm",
    dir: "ltr"
  }), /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: confirmPass,
    onChange: e => setConfirmPass(e.target.value),
    placeholder: "\u062A\u0623\u0643\u064A\u062F \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629",
    className: "border border-gray-200 rounded-lg p-2.5 text-sm",
    dir: "ltr"
  }), passMsg && /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-samaq-blue"
  }, passMsg), /*#__PURE__*/React.createElement("button", {
    disabled: passLoading,
    onClick: changePass,
    className: "bg-samaq-blue disabled:opacity-60 text-white rounded-xl py-2.5 font-bold"
  }, passLoading ? "..." : "تغيير كلمة المرور")));
}

// ---------------- اللوحة نفسها ----------------
function Dashboard({
  categories,
  setCategories,
  items,
  setItems,
  settings,
  setSettings,
  onExit
}) {
  const [tab, setTab] = useState("overview");
  const [selectedCat, setSelectedCat] = useState(categories[0]?.id || null);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    DataService.getOrders().then(setOrders).catch(err => console.warn("تعذر تحميل الطلبات:", err));
  }, []);
  const tabs = [{
    id: "overview",
    label: "نظرة عامة"
  }, {
    id: "menu",
    label: "الأصناف والتصنيفات"
  }, {
    id: "settings",
    label: "الإعدادات"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-[#F4F6F4]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "samaq-gradient-header text-white px-4 py-4 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onExit,
    className: "bg-white/15 hover:bg-white/25 rounded-full p-2"
  }, /*#__PURE__*/React.createElement(IconChevronLeft, {
    className: "w-5 h-5 rotate-180"
  })), /*#__PURE__*/React.createElement("h1", {
    className: "font-extrabold"
  }, "\u0644\u0648\u062D\u0629 \u062A\u062D\u0643\u0645 SAMAQ"))), /*#__PURE__*/React.createElement("div", {
    className: "max-w-5xl mx-auto px-4 py-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 overflow-x-auto no-scrollbar mb-5"
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setTab(t.id),
    className: `px-4 py-2 rounded-full text-sm font-bold shrink-0 ${tab === t.id ? "bg-samaq-blue text-white" : "bg-white border border-gray-200 text-gray-600"}`
  }, t.label))), tab === "overview" && /*#__PURE__*/React.createElement(DashboardOverview, {
    orders: orders,
    items: items
  }), tab === "menu" && /*#__PURE__*/React.createElement(DashboardCategories, {
    categories: categories,
    setCategories: setCategories,
    items: items,
    setItems: setItems,
    selectedCat: selectedCat,
    setSelectedCat: setSelectedCat
  }), tab === "settings" && /*#__PURE__*/React.createElement(DashboardSettings, {
    settings: settings,
    setSettings: setSettings
  })));
}