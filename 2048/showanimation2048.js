function showNumberWithAnimation(i, j, randNumber) { //让随机数显现的动画函数
  var numberCell = $('#number-cell-' + i + '-' + j) // 找到数字格子

  numberCell.css('background-color', getNumberBackgroundColor(randNumber)); //背景颜色设置成
  numberCell.css('color', getNumberColor(randNumber)); //字体颜色设置
  numberCell.text(randNumber); //内容显示

  numberCell.animate({ //用动画效果 50毫秒显现出
    width: cellSideLength,
    height: cellSideLength,
    top: getPosTop(i, j),
    left : getPosLeft(i , j)
  } , 50)

}

function showMoveAnimation(fromx, fromy, tox, toy) {  //移动动画
  var numberCell = $('#number-cell-' + fromx + '-' + fromy) //找到要移动的格子
  numberCell.animate({
    top: getPosTop(tox, toy), //位置设置成移动到位置的格子
    left:getPosLeft(tox,toy)
  }, 200)
}


function updateScore(score) {
  $("#score").text(score)
}

