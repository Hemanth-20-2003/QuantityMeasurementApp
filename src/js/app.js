// Import API + UI helpers
import { getUnits, getConversion, saveHistory, getHistory } from "./api.js";
import { populateDropdown, renderHistory, showError, toggleOperators, setActive, showResult } from "./ui.js";
import { performArithmetic, compareValues } from "./conversions.js";

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
   UC-JS-07: Apply Conversion
========================= */
export function applyConversion(value, convObj, fromUnit, toUnit) {
  // ❌ Invalid number
  if (!Number.isFinite(value)) {
    throw new Error("Invalid number");
  }

  // ✅ Same unit → no conversion
  if (fromUnit === toUnit) {
    return parseFloat(value.toFixed(6));
  }

  try {
    // ✅ Factor-based conversion
    if (convObj.factor !== null) {
      return parseFloat((value * convObj.factor).toFixed(6));
    }

    // ✅ Formula-based conversion (temperature)
    if (convObj.formula) {
      const expr = convObj.formula.replace("x", value);

      const result = eval(expr); // safe: only from db.json

      return parseFloat(result.toFixed(6));
    }

    // ❌ Neither factor nor formula
    throw new Error("Invalid conversion object");

  } catch (err) {
    console.error("Conversion error:", err);
    throw new Error("Bad formula");
  }
}

async function calculate() {
  try {
    const { fromVal, toVal, fromUnit, toUnit, type, action, operator } = state;
    console.log("calculate() state:", state);

    if (action === "Conversion") {
      if (!Number.isFinite(fromVal) || !fromUnit || !toUnit) return;

      const conv = await getConversion(fromUnit, toUnit);
      const result = applyConversion(fromVal, conv, fromUnit, toUnit);
      const expression = `${fromVal} ${fromUnit} → ${result} ${toUnit}`;
      showResult(result, toUnit);

      const record = { type, action, expression, result, timestamp: new Date().toISOString() };
      //await saveHistory(record);
      renderHistory(await getHistory());
      return;
    }

    if (!Number.isFinite(fromVal) || !Number.isFinite(toVal) || !fromUnit || !toUnit) return;

    if (action === "Comparison") {
      let comparison;
      let expression;
      if (fromUnit === toUnit) {
        comparison = compareValues(fromVal, fromUnit, toVal, toUnit, fromVal, toVal);
        expression = `${fromVal} ${fromUnit} ? ${toVal} ${toUnit}`;
      } else {
        const toNormalized = await getConversion(toUnit, fromUnit);
        const convertedToVal = applyConversion(toVal, toNormalized, toUnit, fromUnit);
        comparison = compareValues(fromVal, fromUnit, convertedToVal, fromUnit, fromVal, convertedToVal);
        expression = `${fromVal} ${fromUnit} ? ${toVal} ${toUnit} (${convertedToVal} ${fromUnit})`;
      }
      showResult(comparison, "");
      const record = { type, action, expression, result: comparison, timestamp: new Date().toISOString() };
      //await saveHistory(record);
      renderHistory(await getHistory());
      return;
    }

    if (action === "Arithmetic") {
      let result;
      let expression;
      if (fromUnit === toUnit) {
        result = performArithmetic(fromVal, toVal, operator);
        expression = `${fromVal} ${fromUnit} ${operator} ${toVal} ${toUnit}`;
      } else {
        const conv = await getConversion(toUnit, fromUnit);
        const normalized = applyConversion(toVal, conv, toUnit, fromUnit);
        result = performArithmetic(fromVal, normalized, operator);
        expression = `${fromVal} ${fromUnit} ${operator} ${toVal} ${toUnit} (→ ${normalized} ${fromUnit})`;
      }
      showResult(result, fromUnit);
      const record = { type, action, expression, result, timestamp: new Date().toISOString() };
      //await saveHistory(record);
      renderHistory(await getHistory());
      return;
    }
  } catch (err) {
    console.error(err);
    showResult(`Error: ${err.message}`, "");
  }
}

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

    // Load and render history
    const history = await getHistory();
    renderHistory(history);


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
    populateDropdown(document.getElementById("from-unit"), filtered);
    populateDropdown(document.getElementById("to-unit"), filtered);

  } catch (err) {
    console.error(err);
    showError("Failed to load units");
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
  document.getElementById("from-value").addEventListener("input", async (e) => {
    state.fromVal = parseFloat(e.target.value);
    await calculate();
  });

  document.getElementById("to-value").addEventListener("input", async (e) => {
    state.toVal = parseFloat(e.target.value);
    await calculate();
  });

  window.addEventListener("beforeunload", () => {
    console.log("PAGE IS RELOADING");
  });

  document.getElementById("from-unit").addEventListener("change", async (e) => {
    state.fromUnit = e.target.value;
    await calculate();
  });

  document.getElementById("to-unit").addEventListener("change", async (e) => {
    state.toUnit = e.target.value;
    await calculate();
  });
  /* TYPE CHANGE */
  const typeSelector = document.querySelector(".types");
  const fromInput = document.getElementById("from-value");
  const fromSelect = document.getElementById("from-unit");
  const toSelect = document.getElementById("to-unit");

  document.querySelectorAll(".type-card").forEach(card => {
    card.addEventListener("click", async () => {
      state.type = card.dataset.type;

      setActive(typeSelector, card, ".type-card");

      fromInput.value = "";
      document.getElementById("to-value").value = "";
      toSelect.value = "";
      state.fromVal = null;
      state.toVal = null;
      state.fromUnit = "";
      state.toUnit = "";
      showResult(0, "");

      try {
        const units = await getUnits(state.type);
        populateDropdown(fromSelect, units);
        populateDropdown(toSelect, units);
      } catch (err) {
        console.error(err);
        showError("Failed to load units");
        // Do not clear existing dropdowns from previous state
      }
    });
  });


  /* ACTION CHANGE */
  const actionSelector = document.querySelector(".buttons");
  document.querySelectorAll(".action-btn").forEach(btn => {
    btn.addEventListener("click", () => {

      state.action = btn.dataset.action;

      setActive(actionSelector, btn, ".action-btn");

      // Show operators only for Arithmetic
      toggleOperators(state.action === "Arithmetic");

      // Reset result for any action switch
      showResult(0, "");
    });
  });





  /* OPERATOR SELECT */
  document.querySelectorAll("#operator-selector button").forEach(btn => {
    btn.addEventListener("click", () => {
      state.operator = btn.dataset.op;
    });
  });
}
