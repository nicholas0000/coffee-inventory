const selectAllCheckbox = document.querySelector("thead .checkbox");
let rowCheckboxes = document.querySelectorAll("tbody .checkbox");

const allCheckboxesChecked = (rowCheckboxes) =>
	[...rowCheckboxes].every((checkbox) => checkbox.checked);
const someCheckboxesChecked = (rowCheckboxes) =>
	[...rowCheckboxes].some((checkbox) => checkbox.checked);

const handleChangeOnSelectAllCheckbox = (e) => {
	const rowCheckboxes = document.querySelectorAll("tbody .checkbox");
	const selectAll = e.currentTarget;

	for (const checkbox of rowCheckboxes) {
		if (!selectAll.checked) checkbox.checked = false;
		else checkbox.checked = true;
	}
};

const handleClickOnRowCheckbox = (e) => {
	e.stopPropagation();

	rowCheckboxes = document.querySelectorAll("tbody .checkbox");

	if (allCheckboxesChecked(rowCheckboxes)) {
		selectAllCheckbox.indeterminate = false;
		selectAllCheckbox.checked = true;
		return;
	}

	selectAllCheckbox.indeterminate = someCheckboxesChecked(rowCheckboxes);
	selectAllCheckbox.checked = false;
};

/* MAIN */
if (someCheckboxesChecked(rowCheckboxes))
	selectAllCheckbox.indeterminate = true;

selectAllCheckbox.addEventListener("change", handleChangeOnSelectAllCheckbox);

for (const checkbox of rowCheckboxes)
	checkbox.addEventListener("click", handleClickOnRowCheckbox);
