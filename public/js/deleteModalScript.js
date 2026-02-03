const deleteButton = document.querySelector(".delete-btn");
const modal = document.querySelector("dialog");
const modalCancelButton = modal.querySelector(".cancel-btn");

deleteButton.addEventListener("click", () => modal.showModal());
modalCancelButton.addEventListener("click", () => modal.close());
