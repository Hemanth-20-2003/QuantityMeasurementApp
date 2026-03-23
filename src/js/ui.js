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

export function renderHistory(records) {
  const list = document.querySelector("#history-list");
  list.innerHTML = "";

  if (!records || !records.length) {
    list.innerHTML = "<li>No history yet.</li>";
    return;
  }

  records.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `${r.expression} = ${r.result} (${new Date(r.timestamp).toLocaleString()})`;
    list.appendChild(li);
  });
}

export function showError(msg) {
  alert(msg); // simple for now
}

export function toggleOperators(show) {
  const operatorSelector = document.querySelector("#operator-selector");
  if (!operatorSelector) {
    console.warn("toggleOperators: #operator-selector element not found");
    return;
  }
  operatorSelector.style.display = show ? "flex" : "none";
}
// Show result

/* =========================
   UC-JS-12: Show Result
========================= */
export function showResult(value, unitSymbol) {
  const valueEl = document.querySelector("#result-value");
  const unitEl = document.querySelector("#result-unit");

  // ❌ Missing elements
  if (!valueEl || !unitEl) {
    console.warn("showResult: result elements not found");
    return;
  }

  // ❌ Null value
  if (value === null || value === undefined) {
    valueEl.textContent = "—";
    unitEl.textContent = "";
    return;
  }

  // ✅ Set result
  valueEl.textContent = value;
  unitEl.textContent = unitSymbol || "";

  // ✅ Highlight animation
  valueEl.classList.add("highlight");

  setTimeout(() => {
    valueEl.classList.remove("highlight");
  }, 1500);
}