// budget data Module
//BUDGET CONTROLLER
var budgetController = (function (){
    //private
//    var x =23;
//    var add = function(a){
//        return x + a;
//    }
//    
//    //exposed to public
//    return {
//        publicTest: function(b) {
//           return add(b);
//        }
//    }
    
    
    //Function constructor for EXPENSE
   var Expense = function(id, description, value) {
       this.id = id;
       this.description = description;
       this.value = value;
       this.percentage = -1;
   };
    
    //to calculate percentage to each item
    Expense.prototype.calcPercentage = function(totalIncome){
        
        if(totalIncome > 0){
             this.percentage = Math.round((this.value / totalIncome) * 100);
            
        }
        else {
            this.percentage = -1;
        }
        
        
        
    };
    
    // to return the percentage
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };
    
    
    
    //Function constructor for INCOME    
   var Income = function(id, description, value) {
       this.id = id;
       this.description = description;
       this.value = value;
   };
    
    
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            //cur.value = the current type(exp or inc). income/expense value >> "this.value"
            /*explanation
             0
             [100,200,300]
             sum = 0 + 100
             sum = 100 + 200
             sum= 300 + 300 = 600
            
            
            */
            
            sum += cur.value;
            
            
        });
        //to store in data structure
        data.totals[type] = sum;
        
        
        
    };
    
  
    
    //DATA STRUTCURE to recieve data
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        
        budget: 0,
        // we set it to -1 because -1 is usually a value we use to say that something not exist because if there is no thing there is no number
        percentage: -1
        
    };
    

    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            
            //To get the Id right
            //[1 2 3 4 5], next id = 6
            //[1 2 4 6 8], next id = 9
            //ID = last id + 1
            // because array is zero based
            //ID = data.allItems[type][data.allItems[type].length - 1]    >> [] to select the last element
            //ID = data.allItems[type][data.allItems[type].length - 1]
            // now we have the very last item but we want the id so
            // ID = data.allItems[type][data.allItems[type].length - 1].id
            // now we have the id but we want the new id for the new item so we add + 1
            //that sentence below is the id for the new item
            // Create new id
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            
            // Create new item based on 'inc' or 'exp' type
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            }
            
            else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            //to store the new item inside data structure 
            // push it into our data structure
            data.allItems[type].push(newItem);
            
            // Return the new element
            return newItem;
            
            
        },
        
        
        deleteItem: function(type, id){
            var ids, index;
            // if we want to delete id =6
            //ids = [1 2 4 6 8]
            //so its index = 3
            ids = data.allItems[type].map(function(current){
                return current.id;
                //which is ids = [1 2 4 6 8]
                
                
                
                
            });
            
            index = ids.indexOf(id);
            // indexof return the index number of the element of the array we input here which is id if the id = 6 so index = 3
            // indexOF returns -1 if the the thing not found
            
            if(index !== -1){
                //splice to remove elements
                //first argument in it the position of element in which we want to start deleting
                //second argmunt the number of element that we want to delete
                data.allItems[type].splice(index, 1);
                
                
                
            }
            
        },
        
        
        
        calculateBudget: function(){
            
            //1-  calculate total income and expenses
               calculateTotal('exp');
               calculateTotal('inc');
            
            
            //2- calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            //3- calculate the percentage of income that we spent
            
            //math round to near it to the first integer and remove decimels
            // we used if/ else because imagine if u put and expense so the percentage give us infinity cuz nothing can divided by zero which in this case its the income which is 0
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
                
            } else {
                
                data.percentage = -1;
            }
            
            
            
            
            
            
        },
        
        
        calculatePercentages: function(){
            /*
            a=20
            b=10
            c=40
            income = 100
            a=20/100=20%
            b=10/100=10%
            c=40/100=40%
            */
            
            // will calcpercentage for each item
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
                
                
                
                
            })
            
            
        },
        // will store the percentage in a new array
        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
                
                
            });
            
            return allPerc;
            
            
            
            
        },
        
        
        
        
        //to return the budget and show it
        getBudget: function(){
            return {
                budget:  data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
                
                
                
                
            };
            
            
            
        },
        
        testing: function() {
            console.log(data);
        }
        
    };
    
    
})();












// UI CONTROLLER
var UIController = (function(){
    //DOMstrings is made to make it easier to change the names later
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
        };
    
    
    var formatNumber = function(num, type){
            var numSplit, int, dec, type;
            /*
            
            + or - before number
            exactly 2 decimal points
            comma seprating the thounds
            
            
            
            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            
            
            
            */
            
            //abs remove the sign of the number
            num = Math.abs(num);
            //to fixed put exactly two decimal number and approximte the number
            num = num.toFixed(2);
            
            numSplit = num.split('.');
            //[0] the int part , [1] the decimal part
            int = numSplit[0];
            //int.length give us the length of string
            //int length >3 which is thousand
            if(int.length > 3){
                //substr takes a part of a string and accept two arg first one is the start position which is zero and the second read elements which is 1 first number
                int = int.substr(0,int.length - 3) + ',' + int.substr(int.length - 3 ,3); // input 2310 , output 2,310
                
                
                
            }
            
            dec = numSplit[1];
            //if exp put - otherwise + ternary opertator
            
            return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
            // +/- + 'space' + 23, + 000
        };
    
    
    
          var nodeListForEach = function(list, callback){
                for (var i = 0; i < list.length; i++){
                    
                    callback(list[i], i);
                    
                    
                    
                }
                };
   
    
    
    return{
        //Get Data
        getInput: function() {
            return {
             type: document.querySelector(DOMstrings.inputType).value, //Will be either inc or exp
             description: document.querySelector(DOMstrings.inputDescription).value,
                //parseFloat convert string into a floating number
             value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
            
            
        },
        
        //obj is the outcome of the Function constructor
        addListItem: function(obj, type){
            var html, newHtml, element;
            // Create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
            } else if (type === 'exp'){
                
                element= DOMstrings.expensesContainer;
                
            html ='<div class="item clearfix" id="exp-%id%"><div class="item__description">description</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            
                
                
            }
            
            
            
            
            
            
            // Replace the placeholer text with some actual data
            newHtml = html.replace('%id%', obj.id);
            // we wrote newhtml . replace to not overwrite the above sentence
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            
            
            
            
            //Insert the HTML into the DOM
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
        },
        
        
        // delete an item from UI
        
        deleteListItem: function(selectorID){
            // in Js we could only remove a child not all so we need to move up utill we reach what we want to delete
           var el = document.getElementById(selectorID); el.parentNode.removeChild(el);
            //strange but it how it works
            
            
            
        },
        
        
        // clear the field after an input
        
        clearFields: function(){
            var fields , fieldsArr;
        // fields now hold the result of this selection
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
        //convert the list returend from qSall to array using slice method
            fieldsArr = Array.prototype.slice.call(fields);
        // receive to 3 arguments
            fieldsArr.forEach(function(current, index, array){
                current.value = "";
                // current here is the fields it self
                
                
            });
            
            //Focus on the description
            //0 is the first element which is the inputDescription
            fieldsArr[0].focus();
            
        },
        
        displayBudget: function(obj){
            var type;
          obj.budget > 0 ? type = 'inc' : type = 'exp';
            
          
            
            
            document.querySelector(DOMstrings.budgetLabel).textContent =formatNumber(obj.budget, type) ;
            
            document.querySelector(DOMstrings.incomeLabel).textContent =formatNumber(obj.totalInc, 'inc') ;
            document.querySelector(DOMstrings.expenseseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            // to show percentage sign %
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                // to not show the -1 if there is not any income
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
                
            }
            
            
        },
        
        displayPercentages: function(percentages){
            //var fields return node list not just list
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            //qSall returns nodelist we could use slice method to convert it to array but we can make a custom for each method with nodelist
            
            
            
            
            nodeListForEach(fields, function(current, index){
                
                //percentages[index] is the percentage at position 0 which first element of array
                if (percentages[index] > 0){
                    //fields.textcontent
                    current.textContent = percentages[index] + '%';
                
                    
                    
                }
                else {
                    
                    
                    current.textContent = '---';
                
                    
                }
                });
            
            
            
            
            
        },
        
        displayMonth: function(){
            var now  ,months,  month  ,  year , day;
            //it returns the current date
             now = new Date();
            
            day = now.getDate();
            
            months = ['January', 'February', 'March', 'April', 'May' , 'June' , 'July', 'August' , 'September' , 'October', 'November' , 'December'];
            
            month = now.getMonth();
            
            year = now.getFullYear();
            
            document.querySelector(DOMstrings.dateLabel).textContent = day + ' ' + months[month] + ' ' + year;
            
            
            
        },
        
        changedType: function(){
            
            var fields = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            
            
            
            
            nodeListForEach(fields, function(cur) {
               cur.classList.toggle('red-focus'); 
                
            });
            
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
            
            
            
        },
        
        
        
        // to expose DOMstrings object into the public so other Modules can read it and access
        getDOMstrings: function() {
            return DOMstrings;
        }
        
    };
    
    
    
    
})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){
    // we will pass the two modules here so the module can connect each other 
    
    var setupEventListeners = function(){
            var DOM = UICtrl.getDOMstrings();
        
     // This Happens at click
             document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    
     // This Happens at pressing Enter
        
             document.addEventListener('keypress', function(event){
                 
     //event.which = event.KeyCode but for older browser which is used
                 
                    if (event.keyCode === 13 || event.which === 13) {
            
                       ctrlAddItem();
            
                      }    
    });
        //EVENT DELEGATION FOR DELETE ITEM BUTTON
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        ///
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
        
    };
    
    
    
    
    
    
   var updateBudget= function(){
        
        //1. calculate the budget 
          budgetCtrl.calculateBudget();
       
       
       
        //2. return the budget
          var budget = budgetCtrl.getBudget();
       
       
       
       
        
        //3. display the budget on UI
          UICtrl.displayBudget(budget);
        
       
       
   };
    
    
    var updatePercentages = function(){
        
        //1. calculate percentages
        budgetCtrl.calculatePercentages();
        
        
        //2. Read percentage from the budget controller
        var percentages = budgetCtrl.getPercentages();
        
        //3. update the UI with the new percentages
        UICtrl.displayPercentages(percentages);        
        
        
        
    };

    var ctrlAddItem = function(){
        var input, newItem;
        
        // 1. get the filed input data
        input = UICtrl.getInput();
       //     console.log(input);
        
        //to prevent empty inputs
        // !isNaN returns true if its a number
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            
        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        //3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);
        
        //4.clear the fields
        UICtrl.clearFields();
        
        //5.calculate and update budget
         updateBudget();
            
        //6. Calculate and update percentages
            updatePercentages();
        
            
            
        }
       
    };
    
    
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type , ID;
//        console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);
        //DOM TRAVERSING untill the element we want which is the id
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        //if there is id / IF ID = TRUE MEANS THERE IS AN ID
        if(itemID){
            //inc-1 is the basic fromat which returns
             /*if w had var x= 'inc-1'
            what split do is to make an array and put it in like this ['inc' , '1']*/
            splitID = itemID.split('-')
            // so inc or exp will be the type its in order of 0 in array
            type = splitID[0];
            ID = parseInt(splitID[1]);
                 //parseInt to convert string into INT
            
            //1. delete the item from the data structure
             budgetCtrl.deleteItem(type, ID);
            
            //2. delete the item from the UI
            UICtrl.deleteListItem(itemID);
            
            //3. update and show the new budget
            updateBudget();
            
            
            //4. Calculate and update percentages
            updatePercentages();
            
        }
        
        
        
        
    };
    
    
    // this run in the begining of the app
    return {
        init: function() {
            console.log('app has started');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget:  0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };
    
 
    
})(budgetController, UIController);


//Event Listeners Run code
controller.init();

