// ============================================================
// SAMAQ — Image Uploader (Drag & Drop)
// مكوّن قابل لإعادة الاستخدام: بيرفع أي صورة على Google Drive
// ويرجع رابط مباشر، من غير ما يظهر رابط الصورة كخانة نص للمستخدم
// خالص — كله بيحصل تلقائي وراء الكواليس.
// ============================================================

// بيصغّر الصورة قبل الرفع (أسرع وأخف على الشبكة والـ Apps Script)
function resizeImageToBase64(file, maxDim, quality) {
  maxDim = maxDim || 1600;
  quality = quality || 0.82;
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = function (e) {
      const img = new Image();
      img.onerror = reject;
      img.onload = function () {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve({
          base64: dataUrl.split(",")[1],
          mimeType: "image/jpeg"
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * ImageUploader
 * props:
 *  - value: رابط الصورة الحالية (لو موجودة)
 *  - onChange(url): بينادى بعد نجاح الرفع
 *  - aspect: "square" | "wide"  (شكل صندوق المعاينة)
 *  - label: نص وصفي بسيط
 */
function ImageUploader({
  value,
  onChange,
  aspect,
  label
}) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  async function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      setError("من فضلك اختر ملف صورة");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const url = await DataService.uploadImage(file);
      onChange(url);
    } catch (err) {
      setError("تعذر رفع الصورة: " + err.message);
    } finally {
      setUploading(false);
    }
  }
  const boxClass = aspect === "wide" ? "aspect-[21/6] sm:aspect-[21/5]" : "aspect-square";
  return /*#__PURE__*/React.createElement("div", null, label && /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold text-gray-500 mb-1 block"
  }, label), /*#__PURE__*/React.createElement("div", {
    onClick: () => inputRef.current && inputRef.current.click(),
    onDragOver: e => {
      e.preventDefault();
      setDragOver(true);
    },
    onDragLeave: () => setDragOver(false),
    onDrop: e => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    className: `relative w-full ${boxClass} rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed transition ${dragOver ? "drag-over border-samaq-blue" : "border-gray-200"} ${value ? "" : "item-image-fallback"}`
  }, value ? /*#__PURE__*/React.createElement("img", {
    src: value,
    alt: "",
    className: "w-full h-full object-cover"
  }) : /*#__PURE__*/React.createElement("div", {
    className: "w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400"
  }, /*#__PURE__*/React.createElement(IconFishWatermark, {
    className: "w-8 h-8 opacity-40"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold"
  }, "\u0627\u0633\u062D\u0628 \u0627\u0644\u0635\u0648\u0631\u0629 \u0647\u0646\u0627 \u0623\u0648 \u062F\u0648\u0633 \u0644\u0644\u0627\u062E\u062A\u064A\u0627\u0631")), uploading && /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-black/50 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-white text-xs font-bold"
  }, "\u062C\u0627\u0631\u0650 \u0627\u0644\u0631\u0641\u0639...")), value && !uploading && /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-black/0 hover:bg-black/40 transition flex items-center justify-center opacity-0 hover:opacity-100"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-white text-xs font-bold"
  }, "\u062F\u0648\u0633 \u0623\u0648 \u0627\u0633\u062D\u0628 \u0644\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0635\u0648\u0631\u0629")), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    type: "file",
    accept: "image/*",
    className: "hidden",
    onChange: e => {
      const file = e.target.files && e.target.files[0];
      if (file) handleFile(file);
      e.target.value = "";
    }
  })), error && /*#__PURE__*/React.createElement("p", {
    className: "text-red-500 text-[11px] mt-1"
  }, error));
}