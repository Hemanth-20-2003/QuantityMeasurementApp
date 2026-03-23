// Import API + UI helpers
import { getUnits, getConversion, saveHistory, getHistory } from "./api.js";
import { populateDropdown, renderHistory, showError, toggleOperators } from "./ui.js";

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

async function handleConversion() {
  try {
    const { fromVal, fromUnit, toUnit, type, action } = state;
    console.log("Handling conversion with state:", state);
    if (!fromVal || !fromUnit || !toUnit) return;

    let result;
    let expression;

    if (fromUnit === toUnit) {
      result = fromVal;
      expression = `${fromVal} ${fromUnit} = ${result} ${toUnit}`;
    } else {
      const conv = await getConversion(fromUnit, toUnit);

      if (conv.factor !== null) {
        result = fromVal * conv.factor;
        expression = `${fromVal} ${fromUnit} → ${toUnit}`;
      } else {
        result = eval(conv.formula.replace("x", fromVal));
        expression = `${conv.formula} where x=${fromVal}`;
      }
    }

    // ✅ Update UI
    document.getElementById("result-value").textContent = result;
    document.getElementById("result-unit").textContent = toUnit;

    // ✅ Prepare history record
    const record = {
      type,
      action,
      expression,
      result,
      timestamp: new Date().toISOString()
    };

    // ✅ Save to history
    await saveHistory(record);

    // ✅ Render updated history
    const history = await getHistory();
    renderHistory(history);


  } catch (err) {
    console.error(err);
    alert("Conversion not available for this pair");
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
  await handleConversion();
});
window.addEventListener("beforeunload", () => {
  console.log("PAGE IS RELOADING");
});
document.getElementById("from-unit").addEventListener("change", async (e) => {
  state.fromUnit = e.target.value;
  await handleConversion();
});

document.getElementById("to-unit").addEventListener("change", async (e) => {
  state.toUnit = e.target.value;
  await handleConversion();
});
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





  /* OPERATOR SELECT */
  document.querySelectorAll("#operator-selector button").forEach(btn => {
    btn.addEventListener("click", () => {
      state.operator = btn.dataset.op;
    });
  });
}
