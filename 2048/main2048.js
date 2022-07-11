var board = new Array() //游戏数据
var score = 0 //游戏分数

var hasConflicted = new Array() //做一个二维数组记录碰撞变化

var startx = 0//记录手指点击的位置
var starty = 0
var endx = 0
var endy = 0
$(document).ready(function () { //加载新游戏这个函数
  newgame()
  prepareForMobile()
})


function prepareForMobile() {
  $('#grid-container').css('width', gridContainerWidth - 2 * cellSpace);
  $('#grid-container').css('height', gridContainerWidth - 2 * cellSpace);
  $('#grid-container').css('padding', cellSpace);
  $('#grid-container').css('border-radius', 0.02 * gridContainerWidth);

  $('.grid-cell').css('width', cellSideLength);
  $('.grid-cell').css('height', cellSideLength);
  $('.grid-cell').css('border-radius', 0.02 * cellSideLength);
}


function newgame() {
  // 初始化棋盘格
  init()
  // 在随机两格子中生成数字，因为每次是俩数字所以调用两次
  //首先要找到空闲的格子
  generateOneNumber()
  generateOneNumber()
}


function init() { // 初始化棋盘格

  for (var i = 0; i < 4; i++) { //对16个小格子进行赋值
    for (var j = 0; j < 4; j++) {
      var gridCell = $("#grid-cell-" + i + "-" + j) // 拿到相应的格子，取到其id
      gridCell.css('top', getPosTop(i, j))
      gridCell.css('left', getPosLeft(i, j))
    }
  }
  //构造二维数组世界 在刚开始时候每一个值都为0
  for (var i = 0; i < 4; i++) {
    board[i] = new Array()
    hasConflicted[i] = new Array()
    for (var j = 0; j < 4; j++) {
      board[i][j] = 0

      hasConflicted[i][j] = false// 在初始情况下每一个格子都没有碰撞状态
    }
  }
  updateBoardView() // 通过这个函数让前面知道里面数字发生改变
  score = 0
  updateScore(score)
}

function updateBoardView() {
  $(".number-cell").remove()
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      $("#grid-container").append('<div class = "number-cell" id = "number-cell-' + i + '-' + j + '"></div>')
      var theNumberCell = $('#number-cell-' + i + '-' + j) // 添加有数格子
      //格子里面的值不同。格子状态不相同
      if (board[i][j] == 0) {
        theNumberCell.css('width', '0px') //格子宽高为0，格子隐藏
        theNumberCell.css('height', '0px')
        theNumberCell.css('top', getPosTop(i, j) + cellSideLength/2) //位置在原来的格子中间的位置
        theNumberCell.css('left', getPosLeft(i, j) + cellSideLength/2)
      } else {
        theNumberCell.css('width', cellSideLength) //格子宽高为100，格子显现出来
        theNumberCell.css('height', cellSideLength)
        theNumberCell.css('top', getPosTop(i, j)) //位置在原来的格子中间的位置移动到现在的位置
        theNumberCell.css('left', getPosLeft(i, j))
        theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j])) // 格子的背景色因为数字不同而不同
        theNumberCell.css('color', getNumberColor(board[i][j])) //格子的字颜色因为数字不同而不同

        theNumberCell.text(board[i][j]) //格子显示的值
      }
        hasConflicted[i][j] = false //新的一轮碰撞变成false
    }
  }
      $('.number-cell').css('line-height', cellSideLength + 'px');
  $('.number-cell').css('font-size', 0.6 * cellSideLength + 'px');
}

//在随机空闲两格子中生成数字
function generateOneNumber() {
  if (nospace(board)) { // 看看有没有空格子的函数
    return false
  }

  //随机一个位置
  var randx = parseInt(Math.floor(Math.random() * 4)) //随机生成x，y的坐标
  var randy = parseInt(Math.floor(Math.random() * 4))
  var times = 0
  while (times < 50) { //如果是空就跳出循环，如果不是就继续随机位置
    if (board[randx][randy] == 0) {
      break
    }
    randx = parseInt(Math.floor(Math.random() * 4))
    randy = parseInt(Math.floor(Math.random() * 4))
    times++
  }
  if (times == 50) {
    for (var i = 0; i < 4; i++){
      for (var j = 0; j < 4; j++){
        if (board[i][j] == 0) {
          randx = j
          randy = i
        }
      }
    }
  }
  //随机一个数字，随机生成2或4
  var randNumber = Math.random() < 0.5 ? 2 :4;
  //在随机位置显示随机数字
  board[randx][randy] = randNumber
  showNumberWithAnimation(randx, randy, randNumber) //让随机数显现的动画函数

  return true
}

$(document).keydown(function (event) {

  switch (event.keyCode) {
    case 37:
      event.preventDefault()
      if (moveLeft()) { // 37左边按键
        setTimeout("generateOneNumber()", 210)
        setTimeout("isgameover()", 300);
      }
      break;
    case 38:
      if (moveUp()) {
        event.preventDefault()
        setTimeout("generateOneNumber()", 210)
        setTimeout("isgameover()", 300);
      }
      break;
    case 39:
      if (moveRight()) {
        event.preventDefault()
        setTimeout("generateOneNumber()", 210)
        setTimeout("isgameover()", 300);
      }
      break;
    case 40:
      if (moveDown()) {
        event.preventDefault()
        setTimeout("generateOneNumber()", 210)
        setTimeout("isgameover()", 300);
      }
      default:
        break;
  }
})

// 移动端响应
//手指移动获得初始位置
document.addEventListener('touchstart', function (event) {
  startx = event.touches[0].pageX // 开始移动的x，y位置
  starty = event.touches[0].pageY
})
document.addEventListener('touchend', function (event) {
  endx = event.changedTouches[0].pageX //移动后的x,y位置
  endy = event.changedTouches[0].pageY

  var deltax = endx - startx
  var deltay = endy - starty

   if (Math.abs(deltax) < 0.3 * documentWidth && Math.abs(deltay) < 0.3 * documentWidth)
     return; // 如果触碰位置小于一定值不发生移动

  if (Math.abs(deltax ) > Math.abs(deltay)) { // 如果x移动方向位置大于y 就是左右移动
    if (deltax > 0) {
      // mover right

      if (moveRight()) {
        event.preventDefault();
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    } else {
      //move left
      if (moveLeft()) {
        event.preventDefault();
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    }
  } else { // 上下移动
    if (deltay > 0) {
       //move down
      if (moveDown()) {
         event.preventDefault();
         setTimeout("generateOneNumber()", 210);
         setTimeout("isgameover()", 300);
       }
    } else {
      //move up
      if (moveUp()) {
        event.preventDefault();
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    }
    }
})

function moveLeft() {
  if (!canMoveLeft(board)) { //判断是否可以向左移动
    return false
  }

  //moveleft
  for (var i = 0; i < 4; i++) {
    for (var j = 1; j < 4; j++) {
      if (board[i][j] != 0) { // 如果格子有内容
        if (board[i][j] > 1000) {
          $('#number-cell-' + i + '-' + j).css('font-size' ,'30px')
        }
        for (var k = 0; k < j; k++) { // 遍历左边的每一项
          if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) { //如果左边为空 并且没有障碍物 就移动
            // move
            showMoveAnimation(i, j, i, k) // 移动动画
            board[i][k] = board[i][j]
            if (board[i][k] > 1000) {
              $('#number-cell-' + i + '-' + k).css('font-size', '30px')
            }
            board[i][j] = 0


            continue
          } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) { // 如果左边的跟右边的内容一样 并且没有障碍物 移动，数字相加 并且没有碰撞
            //move
            showMoveAnimation(i, j, i, k)
            //add 数字相加
            board[i][k] += board[i][j]
            board[i][j] = 0

            //add score分数相加两个相同在一起
            score += board[i][k]
            updateScore(score)
            hasConflicted[i][k] = true //碰撞一次过后变为true
            continue
          }
        }
      }
    }
  }
  setTimeout("updateBoardView()", 200)
  return true
}

function isgameover() { //如果没有格子或者是没有办法移动 游戏结束
  if (nospace(board) && nomove(board)) {
    gameover()
  }
}

function gameover() {
  var over = $(".over")
  over.css("display", 'block')
  over.css("width", gridContainerWidth)
  over.css('height', gridContainerWidth)
  document.addEventListener("click", function (e) {
    over.css("display" , 'none')
  })
}

function moveRight() {
  if (!canMoveRight(board)) {
    return false
  }

  for (var i = 0; i < 4; i++) {
    for (var j = 2; j >= 0; j--) {
      if (board[i][j] != 0) {
        for (var k = 3; k > j; k--) {
          if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
            showMoveAnimation(i, j, i, k)
            board[i][k] = board[i][j]
            board[i][j] = 0
            continue
          } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
            showMoveAnimation(i, j, i, k)
            board[i][k] += board[i][j]

            board[i][j] = 0

             score += board[i][k]
            updateScore(score)
            hasConflicted[i][k] = true
            continue
          }
        }
      }
    }
  }
  setTimeout("updateBoardView()", 200)
  return true
}

function moveUp() {
  if (!canMoveUp(board)) {
    return false
  }
  // moveup

  for (var j = 0; j < 4; j++) {
    for (var i = 1; i < 4; i++) {
      if (board[i][j] != 0) {
        for (var k = 0; k < i; k++) { //遍历上面的每一项
          if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) { //如果上面没有障碍物
            showMoveAnimation(i, j, k, j)
            board[k][j] = board[i][j]
            board[i][j] = 0
            continue
          } else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) { // 大的在后面
            showMoveAnimation(i, j, k, j)
            board[k][j] += board[i][j]
            board[i][j] = 0

             score += board[k][j]
            updateScore(score)
            hasConflicted[k][j] = true
            continue
          }
        }
      }
    }
  }
  setTimeout("updateBoardView()", 200)
  return true
}

function moveDown() {
  if (!canMoveDown(board)) {
    return false
  }
  for (var j = 0; j < 4; j++) {
    for (var i = 2; i >= 0; i--) {
      if (board[i][j] != 0) {
        for (var k = 3; k > i; k--) {
          if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
            showMoveAnimation(i, j, k, j)
            board[k][j] = board[i][j]
            board[i][j] = 0
            continue
          } else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
            showMoveAnimation(i, j, k, j)
            board[k][j] += board[i][j]
            board[i][j] = 0

             score += board[k][j]
            updateScore(score)
            hasConflicted[k][j] = true
            continue
          }
        }
      }
    }
  }
  setTimeout("updateBoardView()", 200)
  return true

}

  setInterval(() => {
    const NUMBERCELL = document.getElementsByClassName('number-cell')
    for (let i = 0; i < NUMBERCELL.length; i++) {
      if (NUMBERCELL[i].innerText.length >= 3) {
        NUMBERCELL[i].style.fontSize = '35px'
      }
    }
  }, 1);
