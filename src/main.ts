import './style.css'
import logoUrl from './assets/workshop.svg';
import type { Booking } from './models/booking';
import { countSeats } from './lib/count-seats';

// А1: замените выведенный тип Booking явным interface и добавьте BookingStatus.
const initialBookings: Booking[] = [
  { id: 'b1', name: 'Анна', seats: 1, status: 'confirmed', source: 'web' },
  { id: 'b2', name: 'Илья', seats: 1, status: 'new', source: 'web' },
]
const bookings: Booking[] = [...initialBookings]

// А2: явно задайте Booking[] и тип результата, считайте сумму seats.


// А3: пока каждая заявка означает одного участника.
// Замените тело проверкой raw и преобразованием в целое число от 1 до 5.
function readSeats(raw: FormDataEntryValue | null): number | null {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const num = Number(trimmed);
  if (!Number.isInteger(num)) return null;
  if (num < 1 || num > 5) return null;

  return num;
}

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('Не найден контейнер приложения')
app.innerHTML = `
  <main class="workspace">
    <header><div><span class="eyebrow">ВЕБ-МАСТЕРСКАЯ</span><h1>Запись на занятия</h1>
      <p>Небольшие группы. Большие идеи.</p></div><img id="logo" alt="" hidden width="84" height="84"></header>
    <aside class="notice">Стартовая версия: одна заявка = один участник. На практике добавьте размер группы от 1 до 5.</aside>
    <div class="columns"><section class="panel"><h2>Новая заявка</h2>
      <form id="booking-form" novalidate>
        <label>Имя<input name="name" autocomplete="given-name" placeholder="Как к вам обращаться?"></label>
        <label>Участников<input name="seats" type="text" inputmode="numeric" value="1" aria-describedby="seats-hint"></label>
        <small id="seats-hint">Целое число от 1 до 5. Обработка этого поля входит в практику.</small>
        <button type="submit">Записаться</button><p id="message" role="status" aria-live="polite"></p>
      </form></section>
      <section class="panel"><div class="list-heading"><h2>Заявки</h2><span class="counter">Участников: <strong id="total">0</strong></span></div>
        <ul id="bookings"></ul><p class="muted">Данные хранятся в памяти. Перезагрузка вернёт две исходные заявки.</p>
      </section></div>
  </main>`

const form = document.querySelector('#booking-form')
const list = document.querySelector('#bookings')
const totalElement = document.querySelector('#total')
const message = document.querySelector('#message')
const logo = document.querySelector('#logo')
if (!(form instanceof HTMLFormElement) || !(list instanceof HTMLUListElement)
  || !(totalElement instanceof HTMLElement) || !(message instanceof HTMLElement)
  || !(logo instanceof HTMLImageElement)) {
  throw new Error('Не найдены элементы интерфейса')
}
// Б3: импортируйте картинку, задайте logo.src и logo.hidden = false.

function render(items: Booking[], target: HTMLUListElement, counter: HTMLElement) {
  target.replaceChildren()
  items.forEach((booking) => {
    const item = document.createElement('li')
    const title = document.createElement('strong')
    title.textContent = booking.name
    const details = document.createElement('span')
    // А4: добавьте source в эту строку после изменения модели.
    details.textContent = `${booking.seats} участн. · ${booking.status === 'confirmed' ? 'Подтверждена' : 'Новая'} · ${booking.source}`
    item.append(title, details)
    target.append(item)
  })
  counter.textContent = String(countSeats(items))
}

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const data = new FormData(form)
  const rawName = data.get('name')
  if (typeof rawName !== 'string' || rawName.trim() === '') {
    message.textContent = 'Укажите имя.'
    return
  }
  const seats = readSeats(data.get('seats'))
  if (seats === null) {
    message.textContent = 'Введите целое число участников от 1 до 5.'
    return
  }
    const booking: Booking = {
    id: crypto.randomUUID(), name: rawName.trim(), seats, status: 'new', source: 'web',
  }
  bookings.push(booking)
  render(bookings, list, totalElement)
  message.textContent = 'Заявка добавлена.'
  form.reset()
})
render(bookings, list, totalElement)
