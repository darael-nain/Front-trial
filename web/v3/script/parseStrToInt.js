var reFromCurrency = (currency) => {	
    let patternThousand = `\\${currency.thousands_sep !== "" ? currency.thousands_sep : currency[currency.code.toLowerCase()].thousands_sep }`;
    let patternDecimal = `\\${ currency.decimals_sep !== "" ? currency.decimals_sep : currency[currency.code.toLowerCase()].decimals_sep}`;
    let thousand = new RegExp(patternThousand, "g");
    let decimal = new RegExp(patternDecimal, "g");

    return {
    	thousand,
    	decimal
    }
}

var parseStrToInt = (str, currency) => {

    let re = reFromCurrency(currency);
	return parseFloat(str.replace(re.thousand,"").replace(re.decimal, "."), currency.decimals);
}