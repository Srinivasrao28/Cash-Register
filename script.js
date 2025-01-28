// const price = document.getElementById("price").value; // The price of the item
const cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];

// Denomination values
const currencyUnits = {
  "PENNY": 0.01,
  "NICKEL": 0.05,
  "DIME": 0.1,
  "QUARTER": 0.25,
  "ONE": 1,
  "FIVE": 5,
  "TEN": 10,
  "TWENTY": 20,
  "ONE HUNDRED": 100,
};

// Event listener for the purchase button
document.getElementById("purchase-btn").addEventListener("click", function () {
  const cash = parseFloat(document.getElementById("cash").value); // User input
  const changeDue = parseFloat((cash - price).toFixed(2));

  if (cash < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  if (cash === price) {
    document.getElementById("change-due").innerText = "No change due - customer paid with exact cash";
    return;
  }

  const result = calculateChange(changeDue, cid, currencyUnits);

  if (result.status === "INSUFFICIENT_FUNDS") {
    document.getElementById("change-due").innerText = "Status: INSUFFICIENT_FUNDS";
  } else if (result.status === "CLOSED") {
    const formattedChange = formatChange(result.change);
    document.getElementById("change-due").innerText = `Status: CLOSED ${formattedChange}`;
  } else if (result.status === "OPEN") {
    const formattedChange = formatChange(result.change);
    document.getElementById("change-due").innerText = `Status: OPEN ${formattedChange}`;
  }
});

// Function to calculate change
function calculateChange(changeDue, cid, currencyUnits) {
  // Calculate total cash in drawer
  const totalCid = cid.reduce((total, denom) => total + denom[1], 0).toFixed(2);

  // Handle "CLOSED" condition
  if (parseFloat(totalCid) === changeDue) {
    return {
      status: "CLOSED",
      change: cid,
    };
  }

  // Handle "INSUFFICIENT_FUNDS" condition
  if (parseFloat(totalCid) < changeDue) {
    return {
      status: "INSUFFICIENT_FUNDS",
      change: [],
    };
  }

  // Handle "OPEN" condition
  let remainingChange = changeDue;
  const change = [];

  for (let i = cid.length - 1; i >= 0; i--) {
    const denomName = cid[i][0];
    const denomTotal = cid[i][1];
    const denomValue = currencyUnits[denomName];
    let amount = 0;

    while (remainingChange >= denomValue && denomTotal >= amount + denomValue) {
      remainingChange -= denomValue;
      amount += denomValue;
      remainingChange = parseFloat(remainingChange.toFixed(2));
    }

    if (amount > 0) {
      change.push([denomName, amount]);
    }
  }

  if (remainingChange > 0) {
    return {
      status: "INSUFFICIENT_FUNDS",
      change: [],
    };
  }

  return {
    status: "OPEN",
    change: change,
  };
}

// Helper function to format change
function formatChange(change) {
  return change
    .filter((denom) => denom[1] > 0)
    .map((denom) => `${denom[0]}: $${denom[1].toFixed(2)}`)
    .join(", ");
}
