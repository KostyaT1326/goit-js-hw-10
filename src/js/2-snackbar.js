import iziToast from 'izitoast';

const formEl = document.querySelector('.js-form');
let checkBoxEl = '';
let timeMs = 0;

formEl.addEventListener('change', event => {
  const { target } = event;

  if (target.matches('input[type="number"]')) {
    timeMs = Number(target.value);
  }

  if (target.matches('input[type="radio"]')) {
    checkBoxEl = target.value;
  }
});

formEl.addEventListener('click', event => {
  const { target } = event;

  if (!target.matches('button')) return;
  event.preventDefault();

  if (!isFormValid()) return;

  const selectedTime = timeMs;
  const selectedState = checkBoxEl;

  formEl.reset();
  checkBoxEl = '';
  timeMs = 0;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (selectedState === 'fulfilled') {
        resolve(`✅ Fulfilled promise in ${selectedTime}ms`);
      } else {
        reject(`❌ Rejected promise in ${selectedTime}ms`);
      }
    }, selectedTime);
  });

  promise
    .then(message => {
      iziToastAction(message, '#6bad6b');
      // console.log(message);
    })
    .catch(message => {
      iziToastAction(message, '#d20a0aff');
      // console.log(message);
    });
});

function isFormValid() {
  return timeMs > 0 && checkBoxEl !== '';
}

function iziToastAction(message, backgroundColor) {
  iziToast.show({
    backgroundColor,
    message,
    messageColor: '#fff',
    messageSize: '16',
    position: 'topRight',
    close: false,
    timeout: 3000,
    progressBar: false,
  });
}