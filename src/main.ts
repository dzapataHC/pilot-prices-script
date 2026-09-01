import 'dayjs/locale/en';

import dayjs from 'dayjs';

(() => {
  const tomorrow = dayjs().add(1, 'd').format('DD/MM/YYYY');
  console.log(tomorrow);
})();
