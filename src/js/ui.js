export function populateSelect(selectId, units) {
  const select = document.getElementById(selectId);
  select.innerHTML = "";

  units.forEach(unit => {
    const option = document.createElement("option");
    option.value = unit.symbol;
    option.textContent = `${unit.label} (${unit.symbol})`;
    select.appendChild(option);
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