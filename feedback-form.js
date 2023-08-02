/**
 * Feedback form
 */
const openFeedbackButton = document.querySelector("#open-feedback-modal");
const closeFeedbackButton = document.querySelector("#close-feedback-modal");
const feedbackModal = document.querySelector("#feedback-modal");
const feedbackForm = document.querySelector("#feedback-form");

const captureSection = document.querySelector("#capture-section");
const captureButton = document.querySelector("#capture-section button");

const previewSection = document.querySelector("#preview-section");
const previewImage = document.querySelector("#preview-section img");
const deleteScreenshotButton = document.querySelector("#delete-screenshot");

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
    "position:fixed;top:0;left:0;pointer-events:none;visibility:hidden;",
  );

  return video;
};

const videoToCanvas = (video) => {
  const videoTrackSettings = video.srcObject?.getTracks()[0].getSettings();
  const canvas = document.createElement("canvas");
  canvas.width = videoTrackSettings?.width ?? 0;
  canvas.height = videoTrackSettings?.height ?? 0;
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(video, 0, 0);

  return canvas;
};

openFeedbackButton.addEventListener("click", () => {
  feedbackModal.showModal();
});

closeFeedbackButton.addEventListener("click", () => {
  feedbackModal.close();
});

captureButton.addEventListener("click", async () => {
  feedbackModal.close();
  const captureStream = await startCapture();

  if (!captureStream) {
    feedbackModal.showModal();
    return;
  }

  // using video instead of ImageCapture for better browser support
  const video = createVideoElement(captureStream);
  document.body.appendChild(video);

  // workaround to support Safari browsers
  await new Promise((r) => {
    setTimeout(r, 500);
  });

  const canvas = videoToCanvas(video);
  const screenshot = canvas.toDataURL("image/jpeg", 0.7);

  // clean up
  stopCapture(video);
  canvas.remove();

  previewImage.src = screenshot;
  editorImage.src = screenshot;
  captureSection.classList.add("hidden");
  previewSection.classList.remove("hidden");

  feedbackModal.showModal();
});

deleteScreenshotButton.addEventListener("click", () => {
  previewImage.src = "data:,";
  editorImage.src = "data:,";
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
    `End of feedback screenshot form flow. Data: ${JSON.stringify(data)}`,
  );
  feedbackForm.reset();
  feedbackModal.close();
});

/**
 * Screenshot editor modal
 */
const openEditorButton = document.querySelector("#edit-screenshot");
const closeEditorButton = document.querySelector("#close-editor-modal");
const cancelEditorButton = document.querySelector("#cancel-editor-modal");
const updateScreenshotButton = document.querySelector("#update-screenshot");
const editorModal = document.querySelector("#editor-modal");
const editorImage = document.querySelector("#editor-modal img");
const editorCanvas = document.querySelector("#editor-modal canvas");

let isDown = false;
let startX;
let startY;
let rectWidth;
let rectHeight;
let rectangles = [];

const redraw = () => {
  const ctx = editorCanvas.getContext("2d");

  ctx.clearRect(0, 0, editorCanvas.width, editorCanvas.height);

  rectangles.forEach((rect) => {
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  });
};

openEditorButton.addEventListener("click", () => {
  editorModal.showModal();
  feedbackModal.close();

  const aspectRatio = editorImage.naturalWidth / editorImage.naturalHeight;
  const container = document.querySelector("#canvas-container");
  const canvasWidth = container.getBoundingClientRect().width;
  const canvasHeight = canvasWidth / aspectRatio;

  editorCanvas.width = canvasWidth;
  editorCanvas.height = canvasHeight;
});

editorCanvas.addEventListener("mousedown", (evt) => {
  evt.preventDefault();
  evt.stopPropagation();

  const offset = editorCanvas.getBoundingClientRect();
  startX = evt.clientX - offset.left;
  startY = evt.clientY - offset.top;

  isDown = true;
});

editorCanvas.addEventListener("mouseup", (evt) => {
  evt.preventDefault();
  evt.stopPropagation();

  isDown = false;

  rectangles.push({
    x: startX,
    y: startY,
    width: rectWidth,
    height: rectHeight,
  });
});

editorCanvas.addEventListener("mouseout", (evt) => {
  evt.preventDefault();
  evt.stopPropagation();

  if (!isDown) return;

  isDown = false;
  redraw();
});

editorCanvas.addEventListener("mousemove", (evt) => {
  evt.preventDefault();
  evt.stopPropagation();

  if (!isDown) return;

  redraw();

  // draw current
  const offset = editorCanvas.getBoundingClientRect();
  const currentX = evt.clientX - offset.left;
  const currentY = evt.clientY - offset.top;
  rectWidth = currentX - startX;
  rectHeight = currentY - startY;

  const ctx = editorCanvas.getContext("2d");
  ctx.fillRect(startX, startY, rectWidth, rectHeight);
});

closeEditorButton.addEventListener("click", () => {
  editorModal.close();
  feedbackModal.showModal();
  rectangles = [];
});

cancelEditorButton.addEventListener("click", () => {
  editorModal.close();
  feedbackModal.showModal();
  rectangles = [];
});

updateScreenshotButton.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  canvas.width = previewImage.naturalWidth;
  canvas.height = previewImage.naturalHeight;
  const ctx = canvas.getContext("2d");

  // combine
  ctx?.drawImage(editorImage, 0, 0);
  ctx?.drawImage(
    editorCanvas,
    0,
    0,
    editorCanvas.width,
    editorCanvas.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const updatedScreenshot = canvas.toDataURL("image/jpeg", 0.7);
  previewImage.src = updatedScreenshot;
  editorImage.src = updatedScreenshot;

  // cleanup
  canvas.remove();

  editorModal.close();
  feedbackModal.showModal();
  rectangles = [];
});
