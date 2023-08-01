const baseForm = document.querySelector("#base-form");
const baseFormTextInputs = document.querySelectorAll(
  "#base-form input[type='text']"
);

baseFormTextInputs.forEach((textInput) => {
  if (!textInput.nextElementSibling) return;

  textInput.addEventListener("input", (evt) => {
    textInput.nextElementSibling.textContent = `An error has occurred with ${evt.target.name} input (E01).`;
  });
});

baseForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  window.alert(
    "Click on `Send feedback` to test the feedback screenshot form flow."
  );
});
