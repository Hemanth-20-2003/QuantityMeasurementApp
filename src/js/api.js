const BASE_URL = "http://localhost:3000";

// Get all units
export async function getUnits() {
  const res = await fetch(`${BASE_URL}/units`);
  return res.json();
}

// Get conversions
export async function getConversions() {
  const res = await fetch(`${BASE_URL}/conversions`);
  return res.json();
}

// Save history
export async function saveHistory(record) {
  const res = await fetch(`${BASE_URL}/history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(record)
  });
  return res.json();
}

// Get history
export async function getHistory() {
  const res = await fetch(`${BASE_URL}/history`);
  return res.json();
}