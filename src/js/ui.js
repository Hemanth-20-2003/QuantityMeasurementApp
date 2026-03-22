/* =========================
   UC-JS-11: Set Active Button
========================= */
export function setActive(parentEl, clickedEl, childSelector) {
  // ❌ Invalid parent
  if (!parentEl) {
    console.warn("setActive: parent element is null");
    return;
  }

  // Remove active from all children
  parentEl.querySelectorAll(childSelector).forEach(el => {
    el.classList.remove("active");
  });

  // Add active to clicked element
  if (clickedEl) {
    clickedEl.classList.add("active");
  }
}
/* =========================
   UC-JS-10: Populate Unit Dropdown
========================= */
export function populateDropdown(selectEl, units) {
  // ❌ Invalid element
  if (!selectEl) {
    console.warn("populateDropdown: select element is null");
    return;
  }

  // Clear existing options
  selectEl.innerHTML = "";

  // Default option
  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = "-- Select Unit --";
  defaultOpt.disabled = true;
  defaultOpt.selected = true;

  selectEl.appendChild(defaultOpt);

  // If no units, stop here
  if (!Array.isArray(units) || units.length === 0) {
    return;
  }

  // Populate options
  units.forEach(u => {
    const opt = document.createElement("option");
    opt.value = u.symbol;
    opt.textContent = `${u.label} (${u.symbol})`;
    selectEl.appendChild(opt);
  });
}

export function renderHistory(history) {
  const list = document.getElementById("history-list");
  list.innerHTML = "";

  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.value} ${item.from} → ${item.result} ${item.to}`;
    list.appendChild(li);
  });
}

export function showError(msg) {
  alert(msg); // simple for now
}

export function toggleOperators(show) {
  document.getElementById("operator-selector").style.display =
    show ? "block" : "none";
}
// Show result
function showResult(result) {
  document.getElementById("result").textContent = result;
}