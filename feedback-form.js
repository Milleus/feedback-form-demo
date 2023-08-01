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
    "position:fixed;top:0;left:0;pointer-events:none;visibility:hidden;"
  );

  document.body.appendChild(video);

  return video;
};

const createCanvasElement = (video) => {
  const videoTrackSettings = video.srcObject?.getTracks()[0].getSettings();
  const canvas = document.createElement("canvas");
  canvas.width = videoTrackSettings?.width ?? 0;
  canvas.height = videoTrackSettings?.height ?? 0;
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(video, 0, 0);

  return canvas;
};

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

  const canvas = createCanvasElement(video);
  const screenshot = canvas.toDataURL("image/jpeg", 0.7);

  // clean up
  stopCapture(video);
  canvas.remove();

  previewImage.src = screenshot;
  editorImage.src = screenshot;
  feedbackModal.classList.remove("hidden");
  captureSection.classList.add("hidden");
  previewSection.classList.remove("hidden");
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
    `End of feedback screenshot form flow. Data: ${JSON.stringify(data)}`
  );
  feedbackForm.reset();
  feedbackModal.classList.add("hidden");
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
const editorCanvasCtx = editorCanvas.getContext("2d");

let isDown = false;
let startX;
let startY;
let rectWidth;
let rectHeight;
let rectangles = [];

openEditorButton.addEventListener("click", () => {
  editorModal.classList.remove("hidden");
  feedbackModal.classList.add("hidden");

  const aspectRatio = previewImage.naturalWidth / previewImage.naturalHeight;
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
  const offsetX = offset.left;
  const offsetY = offset.top;

  startX = parseInt(evt.clientX - offsetX);
  startY = parseInt(evt.clientY - offsetY);

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

  isDown = false;

  editorCanvasCtx.clearRect(0, 0, editorCanvas.width, editorCanvas.height);
  rectangles.forEach((rect) => {
    editorCanvasCtx.fillRect(rect.x, rect.y, rect.width, rect.height);
  });
});

editorCanvas.addEventListener("mousemove", (evt) => {
  evt.preventDefault();
  evt.stopPropagation();

  if (!isDown) return;

  const offset = editorCanvas.getBoundingClientRect();
  const offsetX = offset.left;
  const offsetY = offset.top;

  const currentX = parseInt(evt.clientX - offsetX);
  const currentY = parseInt(evt.clientY - offsetY);

  editorCanvasCtx.clearRect(0, 0, editorCanvas.width, editorCanvas.height);

  rectangles.forEach((rect) => {
    editorCanvasCtx.fillRect(rect.x, rect.y, rect.width, rect.height);
  });

  rectWidth = currentX - startX;
  rectHeight = currentY - startY;

  editorCanvasCtx.fillRect(startX, startY, rectWidth, rectHeight);
});

closeEditorButton.addEventListener("click", () => {
  editorModal.classList.add("hidden");
  feedbackModal.classList.remove("hidden");
  rectangles = [];
});

cancelEditorButton.addEventListener("click", () => {
  editorModal.classList.add("hidden");
  feedbackModal.classList.remove("hidden");
  rectangles = [];
});

updateScreenshotButton.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  canvas.width = previewImage.naturalWidth;
  canvas.height = previewImage.naturalHeight;
  const ctx = canvas.getContext("2d");

  // draw existing
  ctx?.drawImage(editorImage, 0, 0);
  ctx.drawImage(editorCanvas, 0, 0);

  const updatedScreenshot = canvas.toDataURL("image/jpeg", 0.7);
  previewImage.src = updatedScreenshot;
  editorImage.src = updatedScreenshot;

  // cleanup
  canvas.remove();
  editorModal.classList.add("hidden");
  feedbackModal.classList.remove("hidden");
  rectangles = [];
});
