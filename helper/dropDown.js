async function selectDropDownByValue (elm, value) {
  await  elm.all(by.css('option[value="' + value.toString() + '"]')).click();
    
}
exports.selectDropDownByValue = selectDropDownByValue;


 