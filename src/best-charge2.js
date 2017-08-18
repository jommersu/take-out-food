const loadAllItems = require('../src/items.js');
const loadPromotions = require('../src/promotions.js');
module.exports = function bestCharge2(inputs) {
  var allItems = loadAllItems();
  var allProItems = loadPromotions();
  let foodCount = foodCounts(inputs);
  let foodItems = getFood(foodCount, allItems);
  let proItems = countPromotions(foodItems , allProItems);
  let comparedItems = comparePromotions(foodItems, proItems, allProItems);
  let printString = printList(foodItems  ,proItems, comparedItems);
  return printString;
};
function printList(foodItems , proItems, comparedItems) {
  let print = "============= 订餐明细 ============="+"\n";
  for(let item of foodItems){
    print += item.name + " x " + item.count + " = " + item.sumprice + "元"+"\n";
  }
  print += "-----------------------------------"+"\n";
  if(comparedItems.save > 0){
    print += "使用优惠:" + "\n";
    print += comparedItems.proType ;
    if(comparedItems.proType === "指定菜品半价"){
      print += "(";
      for(i = 0; i < proItems.length - 1; i ++){
        print += proItems[i].name + "，";
      }
      print += proItems[proItems.length - 1].name + ")";
    }
    print += "，省" + comparedItems.save+"元" + "\n";
    print += "-----------------------------------"+"\n";
  }
  print += "总计：" + comparedItems.sumPrice + "元" + "\n";
  print += "===================================";
  return print;
}
function  comparePromotions(foodItems, proItems, allProItems) {
  let sumPriceNone = 0, saveA = 0, saveB = 0;
  foodItems.forEach(ele => {
    sumPriceNone += ele.sumprice;
    saveA = sumPriceNone > 30 ? 6: 0;
    proItems.forEach( item => {
      if(item.barcode === ele.id){
        saveB += ele.sumprice / 2;
      }
    });
  });
  let save = (saveA > saveB) ? saveA : saveB;
  let type = (save > 0) ? ((save === saveA)? allProItems[0].type : allProItems[1].type): "没有优惠";
  return {save : save ,sumPrice : sumPriceNone - save , proType : type};
}
function getFood(foodCount , allItems) {
  let result = allItems.filter( ele => {
      return foodCount.find( item => {
        return ele.id === item.barcode;
      });
  });
  result.forEach( item => {
    item.count = foodCount[result.indexOf(item)].count;
    item.sumprice = item.price * item.count;
  });
  return result;
}

function countPromotions(foodItems, allProItems) {
  let result =  [];
  for(let item of foodItems){
    allProItems[1].items.filter( ele => {
      if(ele === item.id){

        result.push({barcode : item.id , name: item.name , count : item.count});
      }
    });
  }
  return result;
}
function foodCounts(inputs) {
  let result =  [];
    inputs.forEach( ele => {
    let arr = ele.split(" x ");
    if(arr.length > 1){
      result.push({barcode : arr[0], count : parseInt(arr[1])});
    }else {
      result.push({barcode:ele , count : parseInt(1)});
    }
 });
  return result;
}
