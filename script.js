// let container = document.querySelector(".transaction-container");
const deleteBtn = document.querySelector(".delete");
const container = document.querySelector(".transaction-container");

const url = "https://acb-api.algoritmika.org/api/transaction";
// fetch(url)
//   .then((res) => res.json())
//   .then((data) => console.log(data));

const getAllTransaction = async () => {
  let response = await fetch(url);
  if (!response.ok) {
    throw new Error("error");
  }
  let res = await response.json();
  return res;
};

const deleteTransaction = async (id) => {
  fetch(`${url}/${id}`, {
    method: "DELETE",
  });
};

// deleteBtn.addEventListener("click", deleteTransaction);
getAllTransaction()
  .then((data) => {
    container.innerHTML = "";
    console.log(data);
    data.forEach((data) => {
      const card = document.createElement("div");
      card.classList.add("card");
      container.appendChild(card);
      const from = document.createElement("p");
      const to = document.createElement("p");
      const amount = document.createElement("p");
      from.classList.add("from");
      to.classList.add("to");
      amount.classList.add("amount");
      card.appendChild(from);
      card.appendChild(to);
      card.appendChild(amount);
      from.textContent = `From: ${data.from}`;
      to.textContent = `To: ${data.to}`;
      amount.textContent = `Amount: ${data.amount}`;
    });
  })
  .catch((err) => console.log(err));
