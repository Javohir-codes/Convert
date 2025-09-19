const amount = document.getElementById("amount");
const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const result = document.getElementById("result");
const convert = document.getElementById("convertBtn");
const swap = document.getElementById("swapBtn");
const hint = document.getElementById("hint");
// https://open.er-api.com/v6/latest/USD


// Loading currencies into dropdowns
async function loadCurrencies() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();
    if (!data || !data.rates) throw new Error("No rates in response");

    const codes = Object.keys(data.rates).sort();
    fromSelect.innerHTML = "";
    toSelect.innerHTML = "";

    for (const c of codes) {
      fromSelect.add(new Option(c, c));
      toSelect.add(new Option(c, c));
    }

    fromSelect.value = "USD";
    toSelect.value = codes.includes("UZS") ? "UZS" : (codes.includes("RUB") ? "RUB" : codes[0]);
    hint.textContent = "Currencies loaded"
    ;
  } catch (err) {
    console.error("loadCurrencies error:", err);
    hint.textContent = "Failed to load currencies.";
  }
}

// Convert Func
async function convertCurrency() {
    const summ = parseFloat(amount.value) || 0;
    const fromValue = fromSelect.value;
    const toValue = toSelect.value;

    if (fromValue === toValue){
        result.textContent = `${amount} ${fromValue} = ${amount} ${toValue}`;
        return;
    }

    result.textContent = "Converting..."

    try {
        const res = await fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(fromValue)}`)
        const data = await res.json();

        if (!data || !data.rates || typeof data.rates[toValue] !== "number") {
            throw new Error("Target currency not found");
        }
        
        const converted = (summ * data.rates[toValue])

        result.textContent = `${summ} ${fromValue} = ${converted.toFixed(2)} ${toValue}`
    } catch (error) {
        console.error("converting error", error);
        result.textContent = "Eror while converting."
    }
}

// Swap Func
function swapCurrencies() {
    const a = fromSelect.value;

    fromSelect.value = toSelect.value;
    toSelect.value = a;

    convertCurrency()
}


// Events
convert.addEventListener("click", convertCurrency)
swap.addEventListener("click", swapCurrencies)

// Start
loadCurrencies()
