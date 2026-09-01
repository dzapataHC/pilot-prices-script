export function dateToISO(
  date: Date,
  hours = 4,
  minutes = 24,
  seconds = 5,
  ms = 23,
) {
  const d = new Date(date);

  d.setUTCHours(hours, minutes, seconds, ms);

  const pad = (num: number, length = 2) => String(num).padStart(length, '0');

  const year = d.getUTCFullYear();
  const month = pad(d.getUTCMonth() + 1); // Months are zero-indexed (0 = Jan)
  const day = pad(d.getUTCDate());
  const hh = pad(d.getUTCHours());
  const mm = pad(d.getUTCMinutes());
  const ss = pad(d.getUTCSeconds());
  const sss = pad(d.getUTCMilliseconds(), 3);

  return `${year}-${month}-${day}T${hh}:${mm}:${ss}.${sss}Z`;
}
