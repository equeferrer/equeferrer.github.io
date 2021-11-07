const budget = {
    netBudgetBox: document.querySelector('.budget__value'),
    totalIncomeBox: document.querySelector('.budget__income--value'),
    totalExpensesBox: document.querySelector('.budget__expenses--value'),
    totalNumberOfPeopleBox: document.querySelector('.budget__expenses--number-of-people'),
    totalExpensePerPersonBox: document.querySelector('.budget__expenses--value-per-people'),
    netBudget: 0,
    totalIncome: 0,
    totalExpenses: 0,
    totalPeople: 4,
    netPerPerson: 0,
}

// Helper function
const formatter = new Intl.NumberFormat('fil-PH', {
    style: 'currency',
    currency: 'PHP',
});

// set all values to 0
budget.netBudgetBox.innerText = formatter.format(0);
budget.totalIncomeBox.innerText = formatter.format(0);
budget.totalExpensesBox.innerText = formatter.format(0);
budget.totalExpensePerPersonBox.innerText = formatter.format(0);

const inputDescription = document.querySelector(".add__description");
const inputValue = document.querySelector(".add__value");
const addBtn = document.querySelector(".add__btn");
const inputPeople = document.querySelector(".add__number__of__people");
const type = document.querySelector(".add__type");
const container = document.querySelector('.container');

let startingItems = document.querySelectorAll('.item__value');
for (i = 0; i < startingItems.length; i++) {
    let element = startingItems[i];

    budget.totalExpenses += parseFloat(element.innerText)
    budget.totalExpensesBox.innerText = formatter.format(budget.totalExpenses);
}

computeTotals();
updatePerPerson();

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
    computeTotals();
    updatePerPerson();
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
inputPeople.addEventListener("change", updatePerPerson)

document.querySelectorAll('.item__quantity').forEach(item => {
    item.addEventListener('change', () => {
        originalPrice = item.getAttribute('id');
        multiplier = item.value
        if (isNaN(multiplier) || (multiplier < 0)){
            return item.previousElementSibling.firstElementChild.innerText = formatter.format(0);
        } else {
            oldValue = item.parentElement.nextElementSibling.firstElementChild.innerText;
            newValue = multiplier * originalPrice
        
            budget.totalExpenses += newValue - oldValue
            budget.totalExpensesBox.innerText = formatter.format(budget.totalExpenses);
            item.parentElement.nextElementSibling.firstElementChild.innerText = newValue

            computeTotals();
            updatePerPerson();
        }
    });
})

document.querySelectorAll('.quantity__info-buttons').forEach(item => {
    item.addEventListener('click', () =>{
        if (item.value === '+'){
            oldCount = parseFloat(item.previousElementSibling.value);
            newCount = parseFloat(oldCount) + 0.5
            originalPrice = item.previousElementSibling.getAttribute('id');

            newValue = newCount * originalPrice
            oldValue = oldCount * originalPrice
            budget.totalExpenses += newValue - oldValue

            item.previousElementSibling.innerText = newCount
            item.previousElementSibling.value = newCount

            budget.totalExpensesBox.innerText = formatter.format(budget.totalExpenses);
            item.parentElement.nextElementSibling.firstElementChild.innerText = newValue
        } else if (item.value === '-'){
            oldCount = parseFloat(item.nextElementSibling.value)
            if (oldCount > 0){
                newCount = parseFloat(oldCount) - 0.5
                originalPrice = item.nextElementSibling.getAttribute('id');

                newValue = newCount * originalPrice
                oldValue = oldCount * originalPrice
                budget.totalExpenses += newValue - oldValue

                item.nextElementSibling.innerText = newCount
                item.nextElementSibling.value = newCount 

                budget.totalExpensesBox.innerText = formatter.format(budget.totalExpenses);
                item.parentElement.nextElementSibling.firstElementChild.innerText = newValue
            }
        }
        computeTotals();
        updatePerPerson();
    })
});

function addList() {   
    createItem();
    computeTotals();
    updatePerPerson();
}

function createItem(){
    // ITEM DIV
	const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');
    itemDiv.classList.add('clearfix');
    itemDiv.classList.add('row');
    // LEFT DIV
    const left = document.createElement('div');
    left.classList.add('left');
    itemDiv.appendChild(left);

    // inside left div
    // left.innerHTML += (`
    //     <input type="button" class='quantity__info-buttons btn-tiny' value="-"/>                           
    //     <input type="number" class="item__quantity" id="${inputPeople.value}" min="0" step="0.5" value="1" placeholder="Qty">
    //     <input type="button" class='quantity__info-buttons btn-tiny' value="+"/>
    // `);

    // RIGHT DIV
    const right = document.createElement('div');
    right.classList.add('right');
    right.classList.add('clearfix');
    itemDiv.appendChild(right);

// create new item value
    const newValue = document.createElement('div');
    newValue.classList.add('item__value');
    right.appendChild(newValue);

    // create new item description
	const newItem = document.createElement('div');
	newItem.innerText = inputDescription.value;
	newItem.classList.add('item__description');
    right.appendChild(newItem);  

// Expense List vs Income List
    if (type.value === "inc"){
        var list = document.querySelector(".income__list");
        newValue.innerText = formatter.format(inputValue.value);
        budget.totalIncome = parseFloat(budget.totalIncome) + parseFloat(inputValue.value);
        budget.totalIncomeBox.innerText = formatter.format(budget.totalIncome);
    } else if (type.value === "exp") {
        let newPctg = document.createElement('div');
        let compute = Math.round(inputValue.value/parseFloat(budget.totalIncome)*100);
        // newPctg.classList.add('item__percentage');
        // right.appendChild(newPctg);
        // newPctg.innerText = `${compute} %`
        var list = document.querySelector(".expenses__list");
        newValue.innerText = formatter.format(inputValue.value);
        budget.totalExpenses = parseFloat(budget.totalExpenses) + parseFloat(inputValue.value);
        budget.totalExpensesBox.innerText = formatter.format(budget.totalExpenses);
    }
// create delete div
    const trashDiv = document.createElement('div');
    trashDiv.classList.add("item__delete");
    left.appendChild(trashDiv)
// create delete button
	const trashButton = document.createElement('button');
	trashButton.innerHTML = '<i class="ion-ios-close-outline">'
	trashButton.classList.add("item__delete--btn");
    trashButton.classList.add("btn-tiny");

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

        console.log(item)
        if (itemDiv.classList[0] === "income__list"){
            let sibling = closeDiv.previousElementSibling.innerText;
            let numSibling = parseFloat(sibling.replace(/,/g, "").slice(1))
            budget.totalIncome = parseFloat(budget.totalIncome) - parseFloat(numSibling);
            budget.totalIncomeBox.innerText = formatter.format(budget.totalIncome);
        } else if (itemDiv.classList[0] === "expenses__list"){
            let sibling = closeDiv.parentElement.nextElementSibling.firstElementChild.innerText;
            let numSibling = parseFloat(sibling.replace(/,/g, "").slice(1))
            console.log(sibling, numSibling)
            budget.totalExpenses = parseFloat(budget.totalExpenses) - parseFloat(numSibling);
            budget.totalExpensesBox.innerText = formatter.format(budget.totalExpenses);
        }
        item.remove();        
	}
}

function computeTotals(){
    budget.netBudget = parseFloat(budget.totalIncome - budget.totalExpenses);
    budget.netBudgetBox.innerText = formatter.format(budget.netBudget);
}

function updatePerPerson(){
    budget.totalPeople = document.querySelector('.add__number__of__people').value;
    budget.netPerPerson = parseFloat(budget.totalExpenses/budget.totalPeople);
    budget.totalExpensePerPersonBox.innerText = formatter.format(budget.netPerPerson);
}
