// shortcut: catalog metadata is illustrative; replace with approved records before public launch.
export const categories = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'romance', label: 'ความรัก' },
  { id: 'horror', label: 'สยองขวัญ' },
  { id: 'documentary', label: 'สารคดี' },
  { id: 'independent', label: 'หนังอิสระ' },
];

export const films = [
  { id: 'capybara-2026', title: 'Capybara 2026', subtitle: 'การผจญภัยในโลกใบใหญ่', year: 2026, minutes: 30, category: 'documentary', type: 'short', poster: 'assets/capybara.jpg', scene: 'assets/capybara.jpg', rating: 'ข้อมูลเพื่อทดลองหน้าจอ', synopsis: 'ติดตามคาปิบาราออกเดินทางท่ามกลางธรรมชาติ และมองโลกใบใหญ่ผ่านเรื่องราวเล็ก ๆ ที่พบระหว่างทาง', tags: ['ธรรมชาติ', 'การเดินทาง'], order: 5 },
  { id: 'pinku-pastels', title: 'Pinku Pastels', subtitle: 'สีสันของความสัมพันธ์', year: null, minutes: 22, category: 'romance', type: 'short', poster: 'assets/pinku-pastels.png', scene: 'assets/pinku-scene.png', rating: 'ข้อมูลเพื่อทดลองหน้าจอ', synopsis: 'เรื่องราวความสัมพันธ์และช่วงเวลาที่อยากเก็บไว้ ชวนมองความรู้สึกเล็ก ๆ ที่อาจเปลี่ยนวันธรรมดาให้มีความหมาย', tags: ['ความสัมพันธ์', 'วัยรุ่น'], order: 4 },
  { id: 'lovely', title: 'Lovely', subtitle: '7 วันนี้ สักคนมีแฟนยัง', year: null, minutes: 17, category: 'romance', type: 'short', poster: 'assets/lovely.jpg', scene: 'assets/lovely.jpg', rating: 'ข้อมูลเพื่อทดลองหน้าจอ', synopsis: 'เมื่อความรักไม่ได้เป็นไปตามแผนเสมอไป การทำความรู้จักใครสักคนจึงพาเราไปพบคำตอบที่คาดไม่ถึง', tags: ['ความรัก', 'ชีวิตประจำวัน'], order: 3 },
  { id: 'somewhere-over-the-rainbow', title: 'Somewhere Over the Rainbow', subtitle: 'เรื่องราวอีกด้านของสายรุ้ง', year: null, minutes: 15, category: 'romance', type: 'independent', poster: 'assets/rainbow.jpg', scene: 'assets/rainbow.jpg', rating: 'ข้อมูลเพื่อทดลองหน้าจอ', synopsis: 'การเดินทาง ความทรงจำ และความหวัง ท่ามกลางเมืองที่เต็มไปด้วยผู้คนและความเป็นไปได้', tags: ['การเดินทาง', 'ความหวัง'], order: 2 },
  { id: 'rim', title: 'Rim', subtitle: 'เรื่องราวที่ริมขอบความกลัว', year: null, minutes: 12, category: 'horror', type: 'independent', poster: 'assets/rim.jpg', scene: 'assets/rim.jpg', rating: 'ข้อมูลเพื่อทดลองหน้าจอ', synopsis: 'บรรยากาศคุ้นเคยค่อย ๆ เปลี่ยนไป เมื่อสิ่งเล็กน้อยที่เคยมองข้ามเริ่มชวนให้ตั้งคำถาม', tags: ['ความลึกลับ', 'บรรยากาศ'], order: 1 },
  ...[
    ['in-the-same-breath', 'ในลมหายใจเดียวกัน', 'In the Same Breath', 'Natcha Sanpawichu'],
    ['our-march', 'Our March', '', 'Thanwalai Sungkaputti'],
    ['sometime-somewhere-someone', 'Sometime Somewhere Someone', '', 'Thanyawee Thongdeephan'],
    ['lonely-dragon', 'To Kill the Lonely Dragon', '', 'Jittinont Sujjakulvanich'],
    ['mermaid-mimicry', 'Mermaid Mimicry', 'นางเงือกจำแลง', 'Chitpon Paengwiengjan'],
    ['mimosa', 'Mimosa', 'มิโมซ่า', 'Kanyapa Tubuntung'],
    ['straight-forward', 'Straight Forward', '', 'Nopchanok Panyapoon'],
    ['noodle-film', 'ก๋วยเตี๋ยวเย็น', '', null],
  ].map(([id, title, subtitle, director], i) => ({ id, title, subtitle, director, year: null, minutes: null, category: 'independent', type: 'independent', poster: `assets/${id}.jpg`, scene: `assets/${id}.jpg`, rating: null, synopsis: null, tags: [], order: 13 - i })),
];

export function selectFilms({ query = '', category = 'all', type = 'all', duration = 'all', sort = 'latest', savedIds = null } = {}) {
  const term = query.normalize('NFC').trim().toLocaleLowerCase('th');
  const result = films.filter(film => {
    const categoryName = categories.find(item => item.id === film.category)?.label || '';
    const text = [film.title, film.subtitle, film.synopsis, film.director, categoryName, ...film.tags].join(' ').normalize('NFC').toLocaleLowerCase('th');
    return (!term || text.includes(term)) && (category === 'all' || film.category === category) && (type === 'all' || film.type === type) && (duration === 'all' || (film.minutes != null && film.minutes <= Number(duration))) && (!savedIds || savedIds.includes(film.id));
  });
  return result.sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title, 'th') : sort === 'duration' ? (a.minutes ?? Infinity) - (b.minutes ?? Infinity) || b.order - a.order : b.order - a.order);
}

export function validSavedIds(value) {
  return Array.isArray(value) ? [...new Set(value.filter(id => films.some(film => film.id === id)))] : [];
}
