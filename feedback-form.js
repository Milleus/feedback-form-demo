const openFeedbackButton = document.querySelector("#open-feedback-modal");
const closeFeedbackButton = document.querySelector("#close-feedback-modal");
const feedbackModal = document.querySelector("#feedback-modal");
const feedbackForm = document.querySelector("#feedback-form");

const captureSection = document.querySelector("#capture-section");
const captureButton = document.querySelector("#capture-section button");

const previewSection = document.querySelector("#preview-section");
const previewImage = document.querySelector("#preview-section img");
const deletePreviewButton = document.querySelector("#delete-preview");

// const isDisplayMediaSupported = () => {
//   return Boolean(navigator.mediaDevices?.getDisplayMedia);
// };

const startCapture = async () => {
  let captureStream = null;

  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia({
      preferCurrentTab: true,
    });
  } catch (err) {
    console.error(err);
  }
  return captureStream;
};

const stopCapture = (video) => {
  if (!video.srcObject) return;

  const tracks = video.srcObject.getTracks();

  tracks.forEach((track) => {
    track.stop();
  });

  video.srcObject = null;
};

const createVideoElement = (captureStream) => {
  const video = document.createElement("video");
  video.autoplay = true;
  video.muted = true;
  video.playsInline = true;
  video.srcObject = captureStream;
  video.setAttribute(
    "style",
    "position:fixed;top:0;left:0;pointer-events:none;visibility:hidden;"
  );

  document.body.appendChild(video);

  return video;
};

const generateScreenshot = (video) => {
  const videoTrackSettings = video.srcObject?.getTracks()[0].getSettings();
  const canvas = document.createElement("canvas");
  canvas.width = videoTrackSettings?.width ?? 0;
  canvas.height = videoTrackSettings?.height ?? 0;
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(video, 0, 0);

  return canvas.toDataURL("image/jpeg", 0.7);
};

// EVENT LISTENERS
openFeedbackButton.addEventListener("click", () => {
  feedbackModal.classList.remove("hidden");
});

closeFeedbackButton.addEventListener("click", () => {
  feedbackModal.classList.add("hidden");
});

captureButton.addEventListener("click", async () => {
  feedbackModal.classList.add("hidden");
  const captureStream = await startCapture();

  if (!captureStream) {
    feedbackModal.classList.remove("hidden");
    return;
  }

  // using video instead of ImageCapture for better browser support
  const video = createVideoElement(captureStream);

  // workaround to support Safari browsers
  await new Promise((r) => {
    setTimeout(r, 500);
  });

  const screenshot = generateScreenshot(video);

  // clean up
  stopCapture(video);
  canvas.remove();

  previewImage.src = screenshot;
  feedbackModal.classList.remove("hidden");
  captureSection.classList.add("hidden");
  previewSection.classList.remove("hidden");
});

deletePreviewButton.addEventListener("click", () => {
  previewImage.src = "data:,";
  captureSection.classList.remove("hidden");
  previewSection.classList.add("hidden");
});

feedbackForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const formData = new FormData(feedbackForm);

  const data = {
    datetime: new Date().toISOString(),
    userAgent: window.navigator.userAgent,
    url: window.location.href,
    description: formData.get("feedback-description"),
    username: "autofilled",
    email: "autofilled",
    contact: "autofilled",
    screenshot: previewImage.src !== "data:," ? previewImage.src : null,
  };

  window.alert(
    `End of feedback screenshot form flow. Data: ${JSON.stringify(data)}`
  );
  feedbackForm.reset();
  feedbackModal.classList.add("hidden");
});
