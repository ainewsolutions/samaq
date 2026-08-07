// ============================================================
// SAMAQ — DataService (API client)
// كل البيانات (منيو، تصنيفات، إعدادات، طلبات، صور) بتتقرأ وتتكتب
// من/لـ Google Sheets وGoogle Drive مباشرة عن طريق Apps Script.
// مفيش أي تخزين على جهاز المستخدم (لا localStorage ولا غيره).
// ============================================================

const DataService = {
  // تحميل كل حاجة محتاجها الصفحة الرئيسية دفعة واحدة
  async bootstrap() {
    const res = await fetch(`${SAMAQ_CONFIG.sheetsApiUrl}?action=bootstrap`);
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || "تعذر تحميل البيانات من الشيت");
    return json; // { categories, items, settings }
  },

  async getOrders() {
    const res = await fetch(`${SAMAQ_CONFIG.sheetsApiUrl}?action=orders`);
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || "تعذر تحميل الطلبات");
    return json.data;
  },

  async _post(action, payload) {
    const res = await fetch(SAMAQ_CONFIG.sheetsApiUrl, {
      method: "POST",
      // text/plain عشان نتفادى CORS preflight (Apps Script مش بيرد على OPTIONS)
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(Object.assign({ action }, payload)),
    });
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || "حصل خطأ غير متوقع");
    return json;
  },

  addOrder(order) {
    return DataService._post("addOrder", { order });
  },
  updateOrderStatus(orderId, status) {
    return DataService._post("updateOrderStatus", { orderId, status });
  },
  saveCategories(categories) {
    return DataService._post("saveCategories", { categories });
  },
  saveMenu(items) {
    return DataService._post("saveMenu", { items });
  },
  saveSettings(settings) {
    return DataService._post("saveSettings", { settings });
  },
  login(password) {
    return DataService._post("login", { password });
  },
  changePassword(currentPassword, newPassword) {
    return DataService._post("changePassword", { currentPassword, newPassword });
  },

  // بيرفع الصورة (بعد تصغيرها) على Drive ويرجع الرابط المباشر
  async uploadImage(file) {
    const { base64, mimeType } = await resizeImageToBase64(file);
    const result = await DataService._post("uploadImage", {
      fileName: file.name,
      mimeType,
      base64Data: base64,
    });
    return result.url;
  },
};
