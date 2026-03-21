// Import API + UI helpers
import { getUnits, getHistory } from "./api.js";
import { populateSelect, renderHistory, showError, toggleOperators } from "./ui.js";

/* =========================
   GLOBAL STATE (SINGLE SOURCE OF TRUTH)
========================= */
const state = {
  type: "Length",
  action: "Conversion",
  fromVal: null,
  fromUnit: "",
  toVal: null,
  toUnit: "",
  operator: "+"
};

/* =========================
   INITIALISATION
========================= */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    attachEventListeners();
    console.log("Event listeners attached");
    // Set default active UI
    setDefaultActive();

    // Load units for default type
    await loadUnits("Length");

    // Hide operator row initially
    toggleOperators(false);

    // Load history
    await loadHistory();

  } catch (err) {
    console.error(err);
    showError("Server unavailable");
  }
});


/* =========================
   LOAD UNITS
========================= */
async function loadUnits(type) {
  try {
    const units = await getUnits(type);

    // Filter units by type
    const filtered = units.filter(
      u => u.type.toLowerCase() === type.toLowerCase()
    );
    populateSelect("from-unit", units);
    populateSelect("to-unit", units);

  } catch (err) {
    console.error(err);
    showError("Failed to load units");
  }
}


/* =========================
   LOAD HISTORY
========================= */
async function loadHistory() {
  try {
    const history = await getHistory();
    renderHistory(history);
  } catch (err) {
    console.error(err);
    showError("Failed to load history");
  }
}


/* =========================
   DEFAULT ACTIVE UI
========================= */
function setDefaultActive() {
  // Type cards
  document.querySelectorAll(".type-card").forEach(card => {
    card.classList.remove("active");
    if (card.dataset.type === "Length") {
      card.classList.add("active");
    }
  });

  // Action buttons
  document.querySelectorAll(".action-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.dataset.action === "Conversion") {
      btn.classList.add("active");
    }
  });
}


/* =========================
   EVENT LISTENERS
========================= */
function attachEventListeners() {

  /* TYPE CHANGE */
  document.querySelectorAll(".type-card").forEach(card => {
    card.addEventListener("click", async () => {

      // Update state
      state.type = card.dataset.type;

      // UI update
      document.querySelectorAll(".type-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      // Reload units
      await loadUnits(state.type);
    });
  });


  /* ACTION CHANGE */
  document.querySelectorAll(".action-btn").forEach(btn => {
    btn.addEventListener("click", () => {

      state.action = btn.dataset.action;

      document.querySelectorAll(".action-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Show operators only for Arithmetic
      toggleOperators(state.action === "Arithmetic");
    });
  });


  /* INPUT VALUE */
  document.getElementById("from-value").addEventListener("input", (e) => {
    state.fromVal = parseFloat(e.target.value);
  });


  /* UNIT SELECTION */
  document.getElementById("from-unit").addEventListener("change", (e) => {
    state.fromUnit = e.target.value;
  });

  document.getElementById("to-unit").addEventListener("change", (e) => {
    state.toUnit = e.target.value;
  });


  /* OPERATOR SELECT */
  document.querySelectorAll("#operator-selector button").forEach(btn => {
    btn.addEventListener("click", () => {
      state.operator = btn.dataset.op;
    });
  });
}