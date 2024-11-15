const container = document.querySelector(".transaction-container");
const url = "https://acb-api.algoritmika.org/api/transaction";
const add = document.querySelector(".add");
const modal = document.querySelector(".modal");
const addTransactionBtn = document.querySelector(".add-transaction");
const cancel = document.querySelector(".cancel");
let fromInput = document.querySelector(".from-input");
let toInput = document.querySelector(".to-input");
let amountInput = document.querySelector(".amount-input");
let editingTransactionId = null;
modal.style.display = "none";
cancel.addEventListener("click", () => {
  modal.style.display = "none";
  container.style.opacity = "1";
  container.style.filter = "blur(0px)";
});
addTransactionBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  container.style.opacity = "0.5";
  container.style.filter = "blur(5px)";
});
const getAllTransaction = async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error fetching transactions");
    const res = await response.json();
    return res;
  } catch (err) {
    console.error(err);
  }
};

const deleteTransaction = async (id) => {
  try {
    const response = await fetch(`${url}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error deleting transaction");
    loadTransactions();
  } catch (err) {
    console.error(err);
  }
};

const addTransaction = async (newTransaction) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newTransaction),
    });
    if (!response.ok) {
      throw new Error("Error adding transaction");
    }
    loadTransactions();
  } catch (err) {
    console.log(err);
  }
};
const editTransaction = async (id, newTransaction) => {
  try {
    const response = await fetch(`${url}/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newTransaction),
    });
    if (!response.ok) {
      throw new Error("Error adding transaction");
    }
    loadTransactions();
  } catch (err) {
    console.log(err);
  }
};
const editModal = (transaction) => {
  modal.style.display = "flex";
  container.style.opacity = "0.5";
  container.style.filter = "blur(5px)";
  fromInput.value = transaction.from;
  toInput.value = transaction.to;
  amountInput.value = transaction.amount;
  editingTransactionId = transaction.id;
};
const createTransactionCard = (transaction) => {
  const card = document.createElement("div");
  card.classList.add("card");

  const information = document.createElement("div");
  information.classList.add("information");

  const from = document.createElement("p");
  from.classList.add("from");
  from.textContent = `From: ${transaction.from}`;

  const to = document.createElement("p");
  to.classList.add("to");
  to.textContent = `To: ${transaction.to}`;

  const amount = document.createElement("p");
  amount.classList.add("amount");
  amount.textContent = `Amount: ${transaction.amount}$`;

  information.appendChild(from);
  information.appendChild(to);
  information.appendChild(amount);

  const buttons = document.createElement("div");
  buttons.classList.add("buttons");

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit");
  const editSvg = document.createElement("img");
  editSvg.src = "/transaction/assets/svg/edit.svg";
  editBtn.appendChild(editSvg);
  editBtn.addEventListener("click", () => editModal(transaction));
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete");
  const deleteSvg = document.createElement("img");
  deleteSvg.src = "/transaction/assets/svg/delete.svg";
  deleteBtn.appendChild(deleteSvg);

  deleteBtn.addEventListener("click", () => deleteTransaction(transaction.id));

  buttons.appendChild(editBtn);
  buttons.appendChild(deleteBtn);

  card.appendChild(information);
  card.appendChild(buttons);

  return card;
};

const loadTransactions = async () => {
  const data = await getAllTransaction();
  console.log(data);
  container.innerHTML = "";
  data.forEach((transaction) => {
    const card = createTransactionCard(transaction);
    container.appendChild(card);
  });
};

add.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(fromInput.value);
  console.log(toInput.value);
  console.log(amountInput.value);

  const newTransaction = {
    from: fromInput.value,
    to: toInput.value,
    amount: Number(amountInput.value),
  };

  if (!newTransaction.from || !newTransaction.to || !newTransaction.amount) {
    console.log("All fields are required.");
    return;
  }
  if (editingTransactionId) {
    editTransaction(editingTransactionId, newTransaction);
  } else {
    addTransaction(newTransaction);
  }

  modal.style.display = "none";
  container.style.opacity = "1";
  container.style.filter = "blur(0px)";
});

loadTransactions();
