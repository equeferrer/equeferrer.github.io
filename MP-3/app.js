const budget = {
    month: document.querySelector('.budget__title--month'),
    netBudgetBox: document.querySelector('.budget__value'),
    totalIncomeBox: document.querySelector('.budget__income--value'),
    totalExpensesBox: document.querySelector('.budget__expenses--value'),
    totalExpensesPercentageBox: document.querySelector('.budget__expenses--percentage'),
    netBudget: 0,
    totalIncome: 0,
    totalExpenses: 0,
    totalExpensesPercentage: 0,
}

let currentDate = new Date();
budget.month.innerText = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;

// Helper function
const formatter = new Intl.NumberFormat('fil-PH', {
    style: 'currency',
    currency: 'PHP',
});

// set all values to 0
budget.netBudgetBox.innerText = formatter.format(0);
budget.totalIncomeBox.innerText = formatter.format(0);
budget.totalExpensesBox.innerText = formatter.format(0);
budget.totalExpensesPercentageBox.innerText = "...";

const inputDescription = document.querySelector(".add__description");
const inputValue = document.querySelector(".add__value");
const addBtn = document.querySelector(".add__btn");
const type = document.querySelector(".add__type");
const container = document.querySelector('.container');

function changeColor(){
    if (type.value === "inc"){
        type.classList.remove('red-focus')
        addBtn.classList.remove('red');
        inputDescription.classList.remove('red-focus');
        inputValue.classList.remove('red-focus')
    } else if (type.value === "exp"){
        type.classList.add('red-focus');
        addBtn.classList.add('red');
        inputDescription.classList.add('red-focus');
        inputValue.classList.add('red-focus')
    }
}

// EVENT LISTENERS 
type.addEventListener("change", changeColor);
container.addEventListener('click', (elem)=> {
    deleteItem(elem);
    computePercentage();
    computeTotals();
    updatePercent();
});
addBtn.addEventListener('click', () => {
    if (inputValue.value > 0 && inputDescription.value !== ""){
        addList();
    } else if (inputDescription.value === "" || inputValue.value === ""){
        alert("Must fill up all the fields");
        return
    } else if (inputValue.value <= 0){
        alert("Cannot put a zero/negative value");
        return
    }
})

function addList() {   
    createItem();
    computePercentage();
    computeTotals();
    updatePercent();
}

function createItem(){
    // ITEM DIV
	const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');
    itemDiv.classList.add('clearfix');
// create new item description
	const newItem = document.createElement('div');
	newItem.innerText = inputDescription.value;
	newItem.classList.add('item__description');
    itemDiv.appendChild(newItem);   
// create new div for right values
    const right = document.createElement('div');
    right.classList.add('right');
    right.classList.add('clearfix');
    itemDiv.appendChild(right);
// create new item value
    const newValue = document.createElement('div');
    newValue.classList.add('item__value');
    right.appendChild(newValue);
// Expense List vs Income List
    if (type.value === "inc"){
        var list = document.querySelector(".income__list");
        newValue.innerText = formatter.format(inputValue.value);
        budget.totalIncome = parseFloat(budget.totalIncome) + parseFloat(inputValue.value);
        budget.totalIncomeBox.innerText = formatter.format(budget.totalIncome);
    } else if (type.value === "exp") {
        let newPctg = document.createElement('div');
        let compute = Math.round(inputValue.value/parseFloat(budget.totalIncome)*100);
        newPctg.classList.add('item__percentage');
        right.appendChild(newPctg);
        newPctg.innerText = `${compute} %`
        var list = document.querySelector(".expenses__list");
        newValue.innerText = formatter.format(inputValue.value);
        budget.totalExpenses = parseFloat(budget.totalExpenses) + parseFloat(inputValue.value);
        budget.totalExpensesBox.innerText = formatter.format(budget.totalExpenses);
    }
// create delete div
    const trashDiv = document.createElement('div');
    trashDiv.classList.add("item__delete");
    right.appendChild(trashDiv)
// create delete button
	const trashButton = document.createElement('button');
	trashButton.innerHTML = '<i class="ion-ios-close-outline">'
	trashButton.classList.add("item__delete--btn");
    trashDiv.appendChild(trashButton);
// Add to itemDiv
    list.appendChild(itemDiv)
//Clear Input Value
    inputDescription.value="";
    inputValue.value="";
}

function deleteItem(e){
	const i__class = e.target;
	if (i__class.classList[0] === "ion-ios-close-outline"){
        const closeDiv = i__class.parentElement.parentElement;
        const item = closeDiv.parentElement.parentElement;
        const itemDiv = item.parentElement;
        
        if (itemDiv.classList[0] === "income__list"){
            let sibling = closeDiv.previousElementSibling.innerText;
            let numSibling = parseFloat(sibling.replace(/,/g, "").slice(1))
            budget.totalIncome = parseFloat(budget.totalIncome) - parseFloat(numSibling);
            budget.totalIncomeBox.innerText = formatter.format(budget.totalIncome);
        } else if (itemDiv.classList[0] === "expenses__list"){
            let sibling = closeDiv.previousElementSibling.previousElementSibling.innerText;
            let numSibling = parseFloat(sibling.replace(/,/g, "").slice(1))
            budget.totalExpenses = parseFloat(budget.totalExpenses) - parseFloat(numSibling);
            budget.totalExpensesBox.innerText = formatter.format(budget.totalExpenses);
        }
        item.remove();        
	}
}

function computePercentage(){
    budget.totalExpensesPercentage = parseFloat(budget.totalExpenses/budget.totalIncome);
    let percent = Math.round(budget.totalExpensesPercentage * 100);
    if (!isNaN(percent) && isFinite(percent)){
        budget.totalExpensesPercentageBox.innerText = `${percent} %`;    
    } else {
        return budget.totalExpensesPercentageBox.innerText = "..."
    }
}

function computeTotals(){
    budget.netBudget = parseFloat(budget.totalIncome - budget.totalExpenses);
    budget.netBudgetBox.innerText = formatter.format(budget.netBudget);
}

function updatePercent(){
    let percentList = document.querySelectorAll('.item__percentage');
    for (i = 0; i < percentList.length; i++) {
        let element = percentList[i];
        let sibling = element.previousElementSibling.innerText;
        let numSibling = parseFloat(sibling.replace(/,/g, "").slice(1))
        let compute = Math.round(numSibling/parseFloat(budget.totalIncome)*100);
        if (!isNaN(compute) && isFinite(compute)){
            element.innerText = `${compute} %`;   
        } else {
            element.innerText = "..."
        }
    }
}

