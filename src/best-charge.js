const loadAllItems = require('../src/items.js');
const loadPromotions = require('../src/promotions.js');
module.exports = function bestCharge(inputs) {
  var allItems = loadAllItems();
  var allProItems = loadPromotions();
  let foodItems = countItems(inputs, allItems);
  //console.log(foodItems);
  let proItems = countPromotions(foodItems , allProItems);
  //console.log(proItems);
  let comparedItems = comparePromotions(foodItems , proItems);
  //console.log(comparedItems);
  let printString = printList(foodItems , proItems , comparedItems);
  console.log(printString);
  return printString;
};
function printList(foodItems , proItems, comparedItesms) {
  let print = "============= 订餐明细 ============="+"\n";
  for(let item of foodItems){
    print += item.name + " x " + item.count + " = " + item.count * item.price + "元"+"\n";
  }
  print += "-----------------------------------"+"\n";
  if(comparedItesms.promotionType === "A"){
     print += "使用优惠:" + "\n";
     print += "满30减6元，省6元" + "\n";
     print += "-----------------------------------"+"\n";
  }else if(comparedItesms.promotionType === "B"){
    print += "使用优惠:" + "\n";
    print += "指定菜品半价(";
    let length = proItems.length;
    let proPrice = 0;
    for(let i = 0; i < length - 1; i++){
      print += proItems[i].name + "，";
    }
    for(let item of proItems){
      proPrice += (item.price * item.count) / 2;
    }
    print += proItems[length - 1].name + ")，省" + proPrice+"元" + "\n";
    print += "-----------------------------------"+"\n";
  }
  print += "总计：" + comparedItesms.price + "元" + "\n";
  print += "===================================";
  return print;
}
function comparePromotions(foodItems , proItems) {
  let result = {};//{price:sumPrice , promotionType:A}
  let sumPrice = 0;
  let sumPriceA = 0;
  let flag = "A";
  for(let item of foodItems){
    sumPriceA += item.count * item.price;
  }
  if(sumPriceA >= 30){
    sumPriceA -= 6;
  }else {
    flag = "C";
  }
  let sumPriceB = 0;
  for(let item of foodItems){
    sumPriceB += item.count * item.price;
  }
  for(let item of proItems){
    sumPriceB -= item.price / 2;
  }
  if(sumPriceA < sumPriceB){
    sumPrice = sumPriceA;
    flag = "A";
  }else if(sumPriceA > sumPriceB){
    sumPrice = sumPriceB;
    flag = "B";
  }else{
    if(flag === "C"){
      sumPrice = sumPriceA;
    }
  }
  result = {price: sumPrice , promotionType: flag};
  return result;
}
function countPromotions(foodItems , allProItems){
  let result = [];
  for(let food of foodItems){
    for(let item of allProItems[1].items){
      if (food.id === item){
        result.push(food);
      }
    }
  }
  return result;
}
function  countItems(inputs , allItems) {
  let foodCounts = [];//仅计数
  let result = [];// {包含商品所有信息}
  for(let item of inputs){
    let arr = [];
    arr = item.split(" x ");
    foodCounts.push({id: arr[0] , count:parseInt(arr[1])});
    arr = [];
  }
  for(let food of foodCounts){
    for(let item of allItems){
      if(food.id === item.id){
        food.name = item.name;
        food.price = item.price ;
        result.push(food);
      }
    }
  }

  return result;
}
