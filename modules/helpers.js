module.exports = {

  joulesToCalories: function(val) {
    if(val === null || val.length < 1) return "";

    var dec = parseFloat(val.replace(',', '.'));
    return (dec / 4.184).toFixed(0);
  },

  formatDecimal: function(val) {
    if(val === null || val.length < 1) return "";

    return parseFloat(val.replace(',', '.')).toFixed(1);
  }

}
