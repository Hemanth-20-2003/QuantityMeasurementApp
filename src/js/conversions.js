// Convert using factor
function convert(value, factor) {
  return value * factor;
}

/* =========================
   UC-JS-09: Arithmetic Operation
========================= */
export function performArithmetic(v1, v2normalised, op) {
  // ❌ Validate inputs
  if (!Number.isFinite(v1) || !Number.isFinite(v2normalised)) {
    throw new Error("Invalid numbers");
  }

  switch (op) {
    case "+":
      return parseFloat((v1 + v2normalised).toFixed(6));

    case "-":
      return parseFloat((v1 - v2normalised).toFixed(6));

    case "*":
      return parseFloat((v1 * v2normalised).toFixed(6));

    case "/":
      if (v2normalised === 0) {
        throw new Error("Divide by zero");
      }
      return parseFloat((v1 / v2normalised).toFixed(6));

    default:
      throw new Error("Unknown operator");
  }
}
/* =========================
   UC-JS-08: Compare Two Values
========================= */
export function compareValues(v1, u1, v2, u2, base1, base2) {
  // ❌ Invalid input
  if (!Number.isFinite(v1) || !Number.isFinite(v2)) {
    return "Invalid values — cannot compare";
  }

  // ✅ Same units (skip normalization)
  if (u1 === u2) {
    if (v1 > v2) {
      return `${v1} ${u1} is GREATER than ${v2} ${u2}`;
    }
    if (v1 < v2) {
      return `${v1} ${u1} is LESS than ${v2} ${u2}`;
    }
    return `${v1} ${u1} is EQUAL to ${v2} ${u2}`;
  }

  // ❌ Invalid base values
  if (!Number.isFinite(base1) || !Number.isFinite(base2)) {
    return "Invalid values — cannot compare";
  }

  // ✅ Compare using normalized base values
  if (base1 > base2) {
    return `${v1} ${u1} is GREATER than ${v2} ${u2}`;
  }

  if (base1 < base2) {
    return `${v1} ${u1} is LESS than ${v2} ${u2}`;
  }

  return `${v1} ${u1} is EQUAL to ${v2} ${u2}`;
}
// Compare values
function compare(a, b) {
  if (a > b) return "greater";
  if (a < b) return "smaller";
  return "equal";
}

// Add/Subtract values
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}