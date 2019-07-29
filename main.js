

var amount = 10;            // current amount entered by user
var rate = undefined;       // current rate of currency selected by user 
var currency = undefined;   // current currency selected by user 
var currenciesAndRatesArray = undefined; // convert array


function onLoad() {

    console.log('onLoad') 
    
    // get currencies from fixer.io
    getCurrenciesHttpRequest();
}


/* oninput event */
function onAmountChange() {
    console.log('onAmountChange')
    // get the current amount
    amount = document.querySelector("#amount_input").value

    //Convert the amount
    let result = convertAmount();
    document.querySelector("#resultDiv").innerHTML = result
}


/* onchange event */
function onCurrencyChange() {
    console.log('onCurrencyChange')
    // get the selected currency
    let splits = document.querySelector("#currency_select").value.split(',');
    currency = splits[0]
    rate = splits[1]
    console.log("rate="+rate+ " currency=" +currency)
    
    //Convert the amount
    let result = convertAmount();
    document.querySelector("#resultDiv").innerHTML = result
}


/* Convert amount */
function convertAmount() {
    //console.log("convert " + amount + "  - " + rate)
    let convertAmount = (amount * rate)
    convertAmount = convertAmount.toFixed(5) //limit to 5 decimals
    return convertAmount + " " + currency;
}


/* Get all curencies supported by fixer.io */
function getCurrenciesHttpRequest() {

    const Http = new XMLHttpRequest();
    const url = "http://data.fixer.io/api/latest?access_key=bc2de7431699ca48cec0c994deac832a"
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) // Http request success
        {
           var jsonResponse = JSON.parse(Http.responseText); //parsing string response to json object
            if (jsonResponse.success==true)  // Fixer.io API success
            {
                currenciesAndRatesArray = Object.entries(jsonResponse.rates) // Get array of currencies and rates

                // created subnodes of select element
                initCurrencySelect();
            }
            else
                M.toast({html: "fixer.io Error : <br>" + jsonResponse.error.info, classes: 'rounded red'})
        }
        else if (this.readyState == 4)
            M.toast({html: "HTTPRequest Error :    status=" + this.status, classes: 'rounded red'})
    }
}

/* Initialize select wifget with currencies */
function initCurrencySelect() {

    let selectNode = document.querySelector("#currency_select")
    if (currenciesAndRatesArray)
    {
        currenciesAndRatesArray.forEach(function(cur) {

            // Create "Option" node with currencies
            let node = document.createElement("OPTION");
            node.setAttribute("value", cur)                
            node.appendChild(document.createTextNode(cur[0]));
            selectNode.appendChild(node);
        })

        //Set first element 
        currency = currenciesAndRatesArray[0][0]
        rate = currenciesAndRatesArray[0][1]
        let result = convertAmount();
        document.querySelector("#resultDiv").innerHTML = result
    }
    else
        console.log("currenciesAndRatesArray is undefined - HTTP request failed ?")
    
    // Init select Materialize widget
    M.FormSelect.init(selectNode)
}