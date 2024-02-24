const DECITION_THRESHOLD = 140;
let isAnimating = false;
let pullDeltaX = 0;

function startDrag (event) {
  if (isAnimating) return;

  // get the first article element
  const currentCard = event.target.closest('article');
  if (!currentCard) return;

  // get initial position of mouse or finger
  const startX = event.pageX ?? event.touches[0].pageX;

  // listen the mouse and touch movements
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);

  document.addEventListener('touchmove', onMove, { passive: true });
  document.addEventListener('touchend', onEnd, { passive: true });

  function onMove (moveEvent) {
    // current position of mouse or finger
    const currentX = moveEvent.pageX ?? moveEvent.touches[0].pageX;

    // the distance between the onitial and current position
    pullDeltaX = currentX - startX;

    // no hay distancia recorrida
    if (pullDeltaX === 0) return;

    //
    isAnimating = true;

    // calculate rotation of the card using the distance
    const deg = pullDeltaX / 14;

    // apply transform style to the card
    currentCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`
    // cursor
    currentCard.style.cursor = 'grabbing';

    // change opacity of the choice info
    const opacity = Math.abs(pullDeltaX) / 100;

    const isRight = pullDeltaX > 0;

    const choiceElem =  isRight
    ?  currentCard.querySelector('.choice.like')
    :  currentCard.querySelector('.choice.nope');

    choiceElem.style.opacity = `${opacity}`
  }

  function onEnd (event) {
    // remove event listeners
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onEnd);

    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onEnd);

    const decisionMade = Math.abs(pullDeltaX) >= DECITION_THRESHOLD;

    if (decisionMade) {
      const goRight = pullDeltaX >= 0;

      currentCard.classList.add(goRight ? 'go-right' : 'go-left');
      currentCard.addEventListener('transitionend', () => {
        currentCard.remove();
      });
    } else {
      currentCard.classList.add('reset');
      currentCard.classList.remove('go-right', 'go-left');
    }

    // reset  variables for next use
    currentCard.addEventListener('transitionend', () => {
      currentCard.removeAttribute('style');
      currentCard.classList.remove('reset');

      pullDeltaX = 0;
      isAnimating= false;
    })

    currentCard
      .querySelectorAll('.choice')
      .forEach(elem => elem.style.opacity = 0);
  }
}

document.addEventListener('mousedown', startDrag);
document.addEventListener('touchstart', startDrag, { passive: true });