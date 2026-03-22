/* =========================
   BASE URL
========================= */
const BASE_URL = "http://localhost:3000";

/* =========================
   UC-JS-04: Fetch Conversion Record
========================= */
export async function getConversion(from, to) {
  try {
    const res = await fetch(
      `${BASE_URL}/conversions?from=${from}&to=${to}`
    );

    // Check HTTP status
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    // json-server ALWAYS returns an array
    const data = await res.json();

    // If no conversion found → throw error
    if (!data.length) {
      throw new Error("No conversion found");
    }

    // Return the first match
    return data[0];

  } catch (err) {
    console.error("Error fetching conversion:", err);
    throw err; // let caller handle UI message
  }
}

/* =========================
   UC-JS-03: Fetch Units by Type
========================= */
export async function getUnits(type) {
  try {
    const res = await fetch(`${BASE_URL}/units?type=${type.toLowerCase()}`);

    // Always check HTTP status
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();

  } catch (err) {
    console.error("Error fetching units:", err);

    // Return safe fallback (important for Alternate/Exception flow)
    return [];
  }
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