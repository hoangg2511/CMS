document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("toggleSidebar");
  const wrapper = document.getElementById("wrapper");
  const sidebar = document.getElementById("sidebar");
  const closeBtn = document.getElementById("closeSidebarBtn");
  const formHomePage = document.getElementById("homepageForm");
  const navLinks = sidebar ? sidebar.querySelectorAll(".nav-link") : [];

  function closeSidebar() {
    if (wrapper.classList.contains("sidebar-open")) {
      wrapper.classList.remove("sidebar-open");
    }
  }

  if (toggleBtn && wrapper) {
    toggleBtn.addEventListener("click", function () {
      wrapper.classList.toggle("sidebar-open");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeSidebar);
  }
  if (navLinks.length > 0) {
    navLinks.forEach((link) => {
      link.addEventListener("click", closeSidebar);
    });
  }

  document.addEventListener("click", function (event) {
    if (wrapper.classList.contains("sidebar-open")) {
      const isClickInsideSidebar = sidebar && sidebar.contains(event.target);
      const isClickOnToggleBtn = toggleBtn && toggleBtn.contains(event.target);
      const isClickOnCloseBtn = closeBtn && closeBtn.contains(event.target);
      if (!isClickInsideSidebar && !isClickOnToggleBtn && !isClickOnCloseBtn) {
        closeSidebar();
      }
    }
  });
});
function handleToggleStatus(checkbox) {
  const statusLabel = document.getElementById("statusLabel");
  const statusHidden = document.getElementById("statusHidden");

  // Xác định giá trị dựa trên trạng thái check
  const newStatus = checkbox.checked ? "published" : "draft";

  // 1. Cập nhật nhãn hiển thị bên cạnh switch
  statusLabel.innerText = checkbox.checked ? "Published" : "Draft";

  // 2. Cập nhật hidden input (nếu dùng form submit truyền thống)
  if (statusHidden) {
    statusHidden.value = newStatus;
  }

  // 3. Gọi hàm cập nhật dữ liệu hiện tại của bạn
  console.log("Trạng thái mới:", newStatus);
  if (typeof updateStatusHomePage === "function") {
    updateStatusHomePage(newStatus);
  }
}
async function uploadSingleImage({
  fileInputId,
  previewImageId,
  hiddenInputId,
  uploadButton,
  successMessage = "Upload ảnh thành công!",
  uploadUrl = "/upload/image",
}) {
  const fileInput = document.getElementById(fileInputId);
  const imagePreview = document.getElementById(previewImageId);
  const imageInput = document.getElementById(hiddenInputId);

  if (!fileInput || !fileInput.files.length) {
    alert("Chọn ảnh trước!");
    return;
  }

  // Loading state
  if (uploadButton) {
    uploadButton.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
    uploadButton.disabled = true;
  }

  const formData = new FormData();
  formData.append("image", fileInput.files[0]);

  try {
    const res = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Upload thất bại");
    }

    // Update preview + hidden input
    if (imagePreview) imagePreview.src = `/uploads/${data.url}`;
    if (imageInput) imageInput.value = data.url;

    alert(successMessage);
  } catch (err) {
    console.error(err);
    alert("Lỗi upload ảnh");
  } finally {
    if (uploadButton) {
      uploadButton.innerHTML = '<i class="bi bi-upload"></i> Upload Ảnh Mới';
      uploadButton.disabled = false;
    }
    fileInput.value = "";
  }
}

async function uploadMultiImage({
  fileInputId,
  previewImageId,
  hiddenInputId,
  uploadUrl = "/upload/images", // Đảm bảo khớp với router.post("/images")
}) {
  const fileInput = document.getElementById(fileInputId);
  const previewDiv = document.getElementById(previewImageId);
  const hiddenInput = document.getElementById(hiddenInputId);

  if (!fileInput || !fileInput.files.length) return;

  const formData = new FormData();
  // Gửi nhiều file với key là "images" (khớp với upload.array("images"))
  Array.from(fileInput.files).forEach((file) => {
    formData.append("images", file);
  });

  try {
    const res = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success && data.files) {
      // 1. CHỈNH SỬA TẠI ĐÂY: Trích xuất mảng URL từ mảng Object 'files'
      // Postman trả về: files: [{url: "abc.jpg", filename: "..."}, ...]
      const urlList = data.files.map((f) => f.url);

      // 2. Cập nhật input ẩn (dạng chuỗi: "anh1.jpg, anh2.jpg")
      hiddenInput.value = urlList.join(", ");

      // 3. Cập nhật Preview
      previewDiv.innerHTML = urlList
        .map(
          (url) => `
        <img src="/uploads/${url}" class="img-thumbnail me-2 mb-2" 
             style="height:120px; width:120px; object-fit:cover;">
      `
        )
        .join("");

      alert("Upload thành công " + urlList.length + " ảnh!");
    } else {
      alert(data.message || "Upload thất bại");
    }
  } catch (err) {
    console.error("Lỗi:", err);
    alert("Không thể kết nối đến server");
  } finally {
    fileInput.value = ""; // Xóa bộ nhớ đệm file input
  }
}

function uploadWhyChooseImage() {
  uploadSingleImage({
    fileInputId: "singleWhyChooseImageInput",
    previewImageId: "whyChooseImagePreview",
    hiddenInputId: "whyChooseImageInput",
    uploadButton: document.querySelector("#whyChooseUploadBtn"),
    successMessage: "Upload ảnh đại diện thành công!",
  });
}

function uploadHomepageHeroImage() {
  uploadSingleImage({
    fileInputId: "singleHeroImageInput",
    previewImageId: "heroImagePreview",
    hiddenInputId: "heroBackgroundImageInput",
    uploadButton: document.querySelector("#heroUploadBtn"),
    successMessage: "Upload ảnh nền thành công!",
  });
}

function uploadAccreditationImage() {
  uploadSingleImage({
    fileInputId: "singleAccreditationImageInput",
    previewImageId: "AccreditationImagePreview",
    hiddenInputId: "AccreditationImageInput",
    uploadButton: document.querySelector("#accreditationUploadBtn"),
    successMessage: "Upload ảnh chứng nhận thành công!",
  });
}

function uploadFeatureImage() {
  uploadSingleImage({
    fileInputId: "singleImageInput",
    previewImageId: "imagePreview",
    hiddenInputId: "imageInput",
    uploadButton: document.querySelector("#FeatureUploadBtn"),
    successMessage: "Upload ảnh chứng nhận thành công!",
  });
}

async function submitPublish() {
  // 2. Xác nhận với người dùng

  try {
    const res = await fetch("/admin/homepage/publish", {
      method: "POST",
    });

    const result = await res.json();

    if (result.success) {
      alert("Cập nhật trạng thái thành công!");
      location.reload(); // Tải lại để cập nhật giao diện
    } else {
      throw new Error(result.message || "Lỗi khi cập nhật trạng thái");
    }
  } catch (err) {
    console.error("Update Status Error:", err);
    alert("Có lỗi xảy ra: " + err.message);
    location.reload();
  }
}

async function updateHomePage(event) {
  if (event) event.preventDefault();
  console.log("Submit form started...");

  try {
    const payload = {
      heroSection: {
        title: document
          .querySelector('[name="heroSection.title"]')
          .value.trim(),
        subtitle: document
          .querySelector('[name="heroSection.subtitle"]')
          .value.trim(),
        backgroundImage: document
          .querySelector('[name="heroSection.backgroundImage"]')
          .value.trim(),
        ctaButtons: [],
      },
      whoWeAreSection: {
        title: document
          .querySelector('[name="whoWeAreSection.title"]')
          .value.trim(),
        content: document
          .querySelector('[name="whoWeAreSection.content"]')
          .value.trim(),
      },
      visionMissionPhilosophySection: {},
      whyChooseLAMSSection: {
        title: document
          .querySelector('[name="whyChooseLAMSSection.title"]')
          .value.trim(),
        content: document
          .querySelector('[name="whyChooseLAMSSection.content"]')
          .value.trim(),
        image: document
          .querySelector('[name="whyChooseLAMSSection.image"]')
          .value.trim(),
        features: [],
      },
      accreditationSection: {
        title: document
          .querySelector('[name="accreditationSection.title"]')
          .value.trim(),
        content: document
          .querySelector('[name="accreditationSection.content"]')
          .value.trim(),
        image: document
          .querySelector('[name="accreditationSection.image"]')
          .value.trim(),
        statistics: [],
      },
      featuredNewsSection: {
        title: document
          .querySelector('[name="featuredNewsSection.title"]')
          .value.trim(),
        news: [],
      },
      seoMetaTag: {
        metaTitle: document
          .querySelector('[name="seoMetaTag.metaTitle"]')
          .value.trim(),
        metaDescription: document
          .querySelector('[name="seoMetaTag.metaDescription"]')
          .value.trim(),
        ogImage: document
          .querySelector('[name="seoMetaTag.ogImage"]')
          .value.trim(),
        metaKeywords: [],
      },
    };

    // 2. Sử dụng forEach để xử lý các mảng dữ liệu động

    // --- CTA Buttons ---
    document.querySelectorAll(".cta-item").forEach((item) => {
      const inputs = item.querySelectorAll("input");
      const text = inputs[0]?.value.trim();
      const link = inputs[1]?.value.trim();
      if (text && link) payload.heroSection.ctaButtons.push({ text, link });
    });

    // --- Vision, Mission, Philosophy (Dùng forEach lặp qua object keys) ---
    ["vision", "mission", "philosophy"].forEach((key) => {
      payload.visionMissionPhilosophySection[key] = {
        title: document
          .querySelector(`[name="visionMissionPhilosophySection.${key}.title"]`)
          .value.trim(),
        content: document
          .querySelector(
            `[name="visionMissionPhilosophySection.${key}.content"]`
          )
          .value.trim(),
      };
    });

    document.querySelectorAll(".feature-item input").forEach((input) => {
      const val = input.value.trim();
      if (val) payload.whyChooseLAMSSection.features.push(val);
    });

    document.querySelectorAll(".stat-item").forEach((item) => {
      const inputs = item.querySelectorAll("input");
      const label = inputs[0]?.value.trim();
      const value = inputs[1]?.value.trim();
      if (label && value)
        payload.accreditationSection.statistics.push({ label, value });
    });

    document
      .querySelectorAll('#featuredNewsContainer input[type="hidden"]')
      .forEach((input) => {
        if (input.value) payload.featuredNewsSection.news.push(input.value);
      });

    document.querySelectorAll(".keyword-item input").forEach((input) => {
      const val = input.value.trim();
      if (val) payload.seoMetaTag.metaKeywords.push(val);
    });

    console.log("Payload ready:", payload);

    const res = await fetch("/admin/homepage/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    // 4. Bắt lỗi Success/Fail
    if (result.success) {
      alert("Update HomePage Success!");
      location.reload();
    } else {
      alert("Failed " + (result.message || "Uncertain Error"));
    }
  } catch (err) {
    console.error("Submit error:", err);
    alert("Server error: Connect failed");
  }
}

async function updateAboutUs(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span> Saving...';

    /* ===== INTRO ===== */
    const introSection = {
      label:
        form.querySelector('[name="introSection.label"]')?.value.trim() || "",
      title:
        form.querySelector('[name="introSection.title"]')?.value.trim() || "",
      content:
        form.querySelector('[name="introSection.content"]')?.value.trim() || "",
    };

    /* ===== FEATURES ===== */
    const features = [];
    form.querySelectorAll(".feature-item").forEach((item) => {
      const number =
        item
          .querySelector('[name^="features"][name$=".number"]')
          ?.value.trim() || "";
      const title =
        item
          .querySelector('[name^="features"][name$=".title"]')
          ?.value.trim() || "";
      const content =
        item
          .querySelector('[name^="features"][name$=".content"]')
          ?.value.trim() || "";

      if (number || title || content) {
        features.push({ number, title, content });
      }
    });

    /* ===== QUOTE ===== */
    const quoteBanner = {
      quoteText:
        form.querySelector('[name="quoteBanner.quoteText"]')?.value.trim() ||
        "",
      author:
        form.querySelector('[name="quoteBanner.author"]')?.value.trim() || "",
      backgroundImage:
        form
          .querySelector('[name="quoteBanner.backgroundImage"]')
          ?.value.trim() || "",
    };

    /* ===== VARIETY OPTIONS ===== */
    const varietyOptionsSection = {
      label:
        form
          .querySelector('[name="varietyOptionsSection.label"]')
          ?.value.trim() || "",
      title:
        form
          .querySelector('[name="varietyOptionsSection.title"]')
          ?.value.trim() || "",
      content:
        form
          .querySelector('[name="varietyOptionsSection.content"]')
          ?.value.trim() || "",
      images: [],
      ctaButton: {
        text:
          form
            .querySelector('[name="varietyOptionsSection.ctaButton.text"]')
            ?.value.trim() || "",
        link:
          form
            .querySelector('[name="varietyOptionsSection.ctaButton.link"]')
            ?.value.trim() || "",
      },
    };

    form
      .querySelectorAll('[name^="varietyOptionsSection.images"]')
      .forEach((input) => {
        if (input.value.trim()) {
          varietyOptionsSection.images.push({ image: input.value.trim() });
        }
      });

    /* ===== HOW IT WORKS ===== */
    const howItWorksSection = {
      label:
        form.querySelector('[name="howItWorksSection.label"]')?.value.trim() ||
        "",
      title:
        form.querySelector('[name="howItWorksSection.title"]')?.value.trim() ||
        "",
      image:
        form.querySelector('[name="howItWorksSection.image"]')?.value.trim() ||
        "",
      steps: [],
    };

    form.querySelectorAll(".step-item").forEach((item) => {
      const icon =
        item
          .querySelector('[name^="howItWorksSection.steps"][name$=".icon"]')
          ?.value.trim() || "";
      const title =
        item
          .querySelector('[name^="howItWorksSection.steps"][name$=".title"]')
          ?.value.trim() || "";
      const description =
        item
          .querySelector(
            '[name^="howItWorksSection.steps"][name$=".description"]'
          )
          ?.value.trim() || "";

      if (icon || title || description) {
        howItWorksSection.steps.push({ icon, title, description });
      }
    });

    /* ===== CATEGORIES ===== */
    const categoriesSection = { features: [], images: [] };

    form.querySelectorAll(".category-feature-item").forEach((item) => {
      const icon =
        item
          .querySelector('[name^="categoriesSection.features"][name$=".icon"]')
          ?.value.trim() || "";
      const title =
        item
          .querySelector('[name^="categoriesSection.features"][name$=".title"]')
          ?.value.trim() || "";
      const description =
        item
          .querySelector(
            '[name^="categoriesSection.features"][name$=".description"]'
          )
          ?.value.trim() || "";

      if (icon || title || description) {
        categoriesSection.features.push({ icon, title, description });
      }
    });

    form
      .querySelectorAll('[name^="categoriesSection.images"]')
      .forEach((input) => {
        if (input.value.trim())
          categoriesSection.images.push(input.value.trim());
      });

    /* ===== SUBSCRIBE ===== */
    const subscribeSection = {
      title:
        form.querySelector('[name="subscribeSection.title"]')?.value.trim() ||
        "",
      description:
        form
          .querySelector('[name="subscribeSection.description"]')
          ?.value.trim() || "",
    };

    /* ===== SEO ===== */
    const seo = {
      metaTitle:
        form.querySelector('[name="seo.metaTitle"]')?.value.trim() || "",
      metaDescription:
        form.querySelector('[name="seo.metaDescription"]')?.value.trim() || "",
      metaKeywords:
        form.querySelector('[name="seo.metaKeywords"]')?.value.trim() || "",
      ogImage: form.querySelector('[name="seo.ogImage"]')?.value.trim() || "",
    };

    /* ===== PAYLOAD ===== */
    const payload = {
      status: form.querySelector('[name="status"]')?.value || "draft",
      introSection,
      features,
      quoteBanner,
      varietyOptionsSection,
      howItWorksSection,
      categoriesSection,
      subscribeSection,
      seo,
    };

    console.log("Payload:", payload);

    const response = await fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (result.success) {
      alert("Update AboutUs Success!");
      location.reload();
    } else {
      alert("Failed " + (result.message || "Uncertain Error"));
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="bi bi-save"></i> Save`;
  }
}

async function updateContactForm(event) {
  event.preventDefault();
  const form = event.target;

  // Khởi tạo Object đúng cấu trúc Schema
  const finalData = {
    mainCampus: {
      address: form.querySelector('[name="mainCampus.address"]').value,
      phone: form.querySelector('[name="mainCampus.phone"]').value,
      email: form.querySelector('[name="mainCampus.email"]').value,
      mapUrl: form.querySelector('[name="mainCampus.mapUrl"]').value,
    },
    additionalOffices: [], // Sẽ dùng forEach để đẩy vào
    socialMediaLinks: {
      facebook: form.querySelector('[name="socialMediaLinks.facebook"]').value,
      twitter: form.querySelector('[name="socialMediaLinks.twitter"]').value,
      linkedin: form.querySelector('[name="socialMediaLinks.linkedin"]').value,
      instagram: form.querySelector('[name="socialMediaLinks.instagram"]')
        .value,
      youtube: form.querySelector('[name="socialMediaLinks.youtube"]').value,
    },
    contactFormSettings: {
      enabled: form.querySelector('[name="contactFormSettings.enabled"]')
        .checked,
      recipientEmail: form.querySelector(
        '[name="contactFormSettings.recipientEmail"]'
      ).value,
      autoReplyEnabled: form.querySelector(
        '[name="contactFormSettings.autoReplyEnabled"]'
      ).checked,
      autoReplyMessage: form.querySelector(
        '[name="contactFormSettings.autoReplyMessage"]'
      ).value,
    },
    businessHours: {
      weekdays: form.querySelector('[name="businessHours.weekdays"]').value,
      weekends: form.querySelector('[name="businessHours.weekends"]').value,
    },
  };

  // Xử lý Mảng Additional Offices bằng forEach
  const officeItems = form.querySelectorAll(".office-item");
  officeItems.forEach((item, index) => {
    finalData.additionalOffices.push({
      name: item.querySelector(`[name="additionalOffices[${index}].name"]`)
        .value,
      address: item.querySelector(
        `[name="additionalOffices[${index}].address"]`
      ).value,
      phone: item.querySelector(`[name="additionalOffices[${index}].phone"]`)
        .value,
      email: item.querySelector(`[name="additionalOffices[${index}].email"]`)
        .value,
    });
  });

  // Gửi dữ liệu đi
  try {
    const res = await fetch("/admin/contact/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalData),
    });

    // Chuyển đổi phản hồi sang JSON
    const result = await res.json();

    if (result.success) {
      // Trường hợp Server trả về thành công
      alert("Update data contact success!");
      location.reload();
    } else {
      // Trường hợp Server nhận được yêu cầu nhưng xử lý thất bại (ví dụ: lỗi validation)
      alert("Failed: " + (result.message || "Server failed."));
    }
  } catch (err) {
    // Trường hợp lỗi kết nối, mất mạng, hoặc Server sập (Crash)
    console.error("Fetch Error:", err);
    alert("Error Server: Disconnect Server. Please try again later!");
  }
}
