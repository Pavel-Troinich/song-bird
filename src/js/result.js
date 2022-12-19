import { generalScore } from '../js/index';

function showResult() {
  const bodyWrapper = document.querySelector('.wrapper')
  let uncompleteWin = `Вы набрали ${generalScore} очков из 30! Попробуйте ещё раз!`;
  let completeWin = `Молодец! Вы набрали ${generalScore} очков из 30! Можете ознакомиться со всеми птицами в нашей галерее!`;
  let congratulation = (generalScore === 30) ? completeWin : uncompleteWin;
  bodyWrapper.innerHTML = `
  <div class="result">
    <div class="result-content">${congratulation}</div>
    <div class="btn-wrapper">
      <div class="btn-again">
        <a class="nav-item_link" href="./quiz.html"><div class="btn">Играть ещё раз</div></a>
      </div>
      <div class="btn-main">
        <a class="nav-item_link" href="./gallery.html"><div class="btn">Посмотреть галерею</div></a>
      </div>
    </div>
  </div>
  `;
}

export { showResult }