import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startButton = document.querySelector('.js-button');
const inputField = document.querySelector('.js-input');
const valueDate = document.querySelectorAll('.js-value');

let userSelectedDate;
let countdownInterval = null;
let startTimer = 0;

const disarmStartButton = () => {
  startButton.style.backgroundColor = '#cfcfcf';
  startButton.style.color = '#989898';
  startButton.disabled = true;
};
const disarmInputField = () => {
  inputField.style.backgroundColor = '#fafafa';
  inputField.style.color = '#808080';
  inputField.style.border = '1px solid #808080';
  inputField.disabled = true;
};
const armInputField = () => {
  inputField.style.backgroundColor = '';
  inputField.style.color = '';
  inputField.style.border = '';
  inputField.disabled = false;
};
const armStartButton = () => {
  startButton.style.backgroundColor = '';
  startButton.style.color = '';
  startButton.disabled = false;
};

const picker = flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onChange(selectedDates) {
    iziToast.destroy();
  },

  onClose(selectedDates) {
    const currentDate = Date.now();
    userSelectedDate = selectedDates[0].getTime();
    startTimer = userSelectedDate - currentDate;
    if (startTimer <= 0) {
      iziToast.error({
        title: 'Please choose a date in the future',
        position: 'topRight',
        timeout: 10000,
      });
      disarmStartButton();
      return;
    }
    armStartButton();
  },
});

startButton.addEventListener('click', () => {
  disarmStartButton();
  disarmInputField();
  if (countdownInterval) clearInterval(countdownInterval);

  countdownInterval = setInterval(() => {
    const now = Date.now();
    const timeLeft = userSelectedDate - now;

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      armInputField();
      return;
    }

    const timer = convertMs(timeLeft);
    updateTimer(timer);
  }, 1000);
});

function updateTimer({ days, hours, minutes, seconds }) {
  document.querySelector('[data-days]').textContent = String(days).padStart(
    2,
    '0'
  );
  document.querySelector('[data-hours]').textContent = String(hours).padStart(
    2,
    '0'
  );
  document.querySelector('[data-minutes]').textContent = String(
    minutes
  ).padStart(2, '0');
  document.querySelector('[data-seconds]').textContent = String(
    seconds
  ).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

disarmStartButton();