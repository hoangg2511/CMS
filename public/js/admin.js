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

  //   formHomePage.addEventListener("submit", async (e) => {
  //     e.preventDefault();
  //     await submitHomepage();
  //   });
});

function deleteNews(id) {
  if (!id) {
    alert("Invalid news ID");
    return;
  }

  if (!confirm("Are you sure you want to delete this news?")) {
    return;
  }

  $.ajax({
    url: "/admin/news/delete/" + id,
    type: "DELETE",
    success: function (res) {
      if (res.success) {
        alert("Deleted successfully");
        location.reload();
      } else {
        alert(res.message || "Delete failed");
      }
    },
    error: function (xhr) {
      alert(xhr.responseJSON?.message || "Server error, please try again");
    },
  });
}

function saveNews(id) {
  const form = $("#newsForm");

  if (!form[0].checkValidity()) {
    form[0].reportValidity();
    return;
  }
  let data = form.serializeArray();

  const featured = $("input[name='featured']").is(":checked");

  data.push({
    name: "featured",
    value: featured,
  });
  const url = id ? `/admin/news/update/${id}` : `/admin/news/create`;
  const method = id ? "PUT" : "POST";
  $.ajax({
    url,
    type: method,
    data: $.param(data),
    success(res) {
      if (res.success) {
        alert("Save news successfully!");
        window.location.href = "/admin/news";
      } else {
        alert(res.message || "Save failed");
      }
    },
    error(xhr) {
      alert(xhr.responseJSON?.message || "Server error");
    },
  });
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

async function updateStatusHomePage(newStatus) {
  // 1. Tìm ID của bản ghi (nên đặt một input hidden chứa ID trong form)
  const homepageId = document.querySelector('[name="_id"]')?.value;

  // 2. Xác nhận với người dùng
  const confirmMsg =
    newStatus === "published"
      ? "Bạn có chắc chắn muốn CÔNG KHAI trang chủ này?"
      : "Bạn muốn chuyển trang chủ về bản NHÁP?";

  if (!confirm(confirmMsg)) {
    location.reload(); // Reset lại dropdown nếu hủy
    return;
  }

  try {
    // Hiển thị trạng thái đang xử lý (nếu cần)
    console.log(`Đang cập nhật trạng thái sang: ${newStatus}`);

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

async function submitHomepage(event) {
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

async function submitAboutUs(pageIndex, event) {
  if (event) event.preventDefault();

  // 1. Lấy form và kiểm tra
  const form = document.getElementById(`aboutUsForm-${pageIndex}`);
  if (!form) {
    console.error("Không tìm thấy form với ID:", `aboutUsForm-${pageIndex}`);
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');

  try {
    // Vô hiệu hóa nút và hiển thị loading
    submitBtn.disabled = true;
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span> Saving...';

    console.log("Đang xử lý dữ liệu cho Page Index:", pageIndex);

    // --- Thu thập dữ liệu (Giữ nguyên logic của bạn nhưng bọc trong try để bắt lỗi querySelector) ---
    const introSection = {
      label:
        form.querySelector('[name="introSection.label"]')?.value.trim() || "",
      title:
        form.querySelector('[name="introSection.title"]')?.value.trim() || "",
      content:
        form.querySelector('[name="introSection.content"]')?.value.trim() || "",
    };

    const features = [];
    form.querySelectorAll(".feature-item").forEach((item, index) => {
      const number =
        item
          .querySelector(`[name="features[${index}].number"]`)
          ?.value.trim() || "";
      const title =
        item.querySelector(`[name="features[${index}].title"]`)?.value.trim() ||
        "";
      const content =
        item
          .querySelector(`[name="features[${index}].content"]`)
          ?.value.trim() || "";
      if (number || title || content) features.push({ number, title, content });
    });

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
        if (input.value)
          varietyOptionsSection.images.push({ image: input.value });
      });

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
    form.querySelectorAll(".step-item").forEach((item, index) => {
      const title =
        item
          .querySelector(`[name="howItWorksSection.steps[${index}].title"]`)
          ?.value.trim() || "";
      const content =
        item
          .querySelector(`[name="howItWorksSection.steps[${index}].content"]`)
          ?.value.trim() || "";
      const icon =
        item
          .querySelector(`[name="howItWorksSection.steps[${index}].icon"]`)
          ?.value.trim() || "";
      if (title || content || icon)
        howItWorksSection.steps.push({ title, content, icon });
    });

    const categoriesSection = {
      features: [],
      images: [],
    };
    form.querySelectorAll(".category-feature-item").forEach((item, index) => {
      const icon =
        item
          .querySelector(`[name="categoriesSection.features[${index}].icon"]`)
          ?.value.trim() || "";
      const title =
        item
          .querySelector(`[name="categoriesSection.features[${index}].title"]`)
          ?.value.trim() || "";
      const description =
        item
          .querySelector(
            `[name="categoriesSection.features[${index}].description"]`
          )
          ?.value.trim() || "";
      if (icon || title || description)
        categoriesSection.features.push({ icon, title, description });
    });
    form
      .querySelectorAll('[name^="categoriesSection.images"]')
      .forEach((input) => {
        if (input.value) categoriesSection.images.push(input.value);
      });

    const subscribeSection = {
      title:
        form.querySelector('[name="subscribeSection.title"]')?.value.trim() ||
        "",
      description:
        form
          .querySelector('[name="subscribeSection.description"]')
          ?.value.trim() || "",
    };

    const seo = {
      metaTitle:
        form.querySelector('[name="seo.metaTitle"]')?.value.trim() || "",
      metaDescription:
        form.querySelector('[name="seo.metaDescription"]')?.value.trim() || "",
      metaKeywords:
        form.querySelector('[name="seo.metaKeywords"]')?.value.trim() || "",
      ogImage: form.querySelector('[name="seo.ogImage"]')?.value.trim() || "",
    };
    form.querySelectorAll(".keyword-item input").forEach((input) => {
      if (input.value.trim()) seo.metaKeywords.push(input.value.trim());
    });

    const payload = {
      _id: form.querySelector('[name="_id"]')?.value || null,
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

    // 2. Gửi dữ liệu
    const response = await fetch("/admin/about/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Kiểm tra lỗi HTTP (ví dụ 404, 500)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // 3. Xử lý kết quả trả về từ Server
    if (result.success) {
      console.log("Update Success:", result.success);
      alert("About Us updated successfully!:", result.message);
      location.reload(); // Hoặc chuyển hướng nếu cần
    } else {
      // Lỗi nghiệp vụ từ Server (ví dụ thiếu trường bắt buộc)
      throw new Error(result.message || "Update failed from server");
    }
  } catch (err) {
    // --- Bắt toàn bộ lỗi tại đây ---
    console.error("Error during submission:", err);
    alert("Error: " + err.message);

    // Khôi phục lại nút bấm để người dùng sửa lỗi và thử lại
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="bi bi-save"></i> Save & Update Page ${
      pageIndex + 1
    }`;
  }
}

async function submitContactForm(event) {
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
