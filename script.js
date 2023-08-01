const checkIfBrowserSupported = () => {
  return Boolean(navigator.mediaDevices?.getDisplayMedia);
};

const startCapture = async () => {
  let captureStream = null;

  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia({
      preferCurrentTab: true,
    });
  } catch (err) {
    console.error(`Error: ${err}`);
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

/**
 * Base form
 */
const baseForm = document.querySelector("#base-form");
const baseFormTextInputs = document.querySelectorAll(
  "#base-form input[type='text']"
);
// const submitProfileButton = document.querySelector("#submit-profile-update");

baseFormTextInputs.forEach((input) => {
  if (!input.nextElementSibling) return;

  input.addEventListener("input", (evt) => {
    input.nextElementSibling.textContent = `An error has occurred with ${evt.target.name} input (E01).`;
  });
});

baseForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  window.alert(
    "Click on `Send feedback` to test the feedback screenshot form flow."
  );
});

/**
 * Feedback form modal
 */
const openFeedbackButton = document.querySelector("#open-feedback-modal");
const closeFeedbackButton = document.querySelector("#close-feedback-modal");
const feedbackModal = document.querySelector("#feedback-modal");
const feedbackForm = document.querySelector("#feedback-form");

const captureSection = document.querySelector("#capture-section");
const captureButton = document.querySelector("#capture-section button");

const previewSection = document.querySelector("#preview-section");
const previewImage = document.querySelector("#preview-section img");
const deletePreviewButton = document.querySelector("#delete-preview");

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

  await new Promise((r) => {
    setTimeout(r, 500);
  });

  const videoTrackSettings = video.srcObject?.getTracks()[0].getSettings();

  const canvas = document.createElement("canvas");
  canvas.width = videoTrackSettings?.width ?? 0;
  canvas.height = videoTrackSettings?.height ?? 0;
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(video, 0, 0);

  const screenshot = canvas.toDataURL("image/jpeg", 0.7);

  stopCapture(video);
  feedbackModal.classList.remove("hidden");
  canvas.remove();

  previewImage.src = screenshot;
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
