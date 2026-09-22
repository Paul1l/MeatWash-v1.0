// Verified against the public pages on meat-wash.vercel.app, September 23, 2026.
import {readFile,writeFile} from 'node:fs/promises';
const file=new URL('../dist/assets/meatwash-content.json',import.meta.url);
const d=JSON.parse(await readFile(file,'utf8'));
d.bodyTypes=['Седан','Кроссовер','Внедорожник','Микроавтобус'];
d.programPrices=[[2150,2250,2450,2650],[2850,3150,3450,4250],[4950,5450,5950,6450],[6450,7450,8450,9450],[13950,14950,15950,16950]];
d.programIncludes=[
 ['Предварительная бесконтактная пена','Активная пена, выдержка, смыв','Ручная мойка кузова и стёкол','Сушка кузова и обдув зеркал','Мойка ковриков'],
 ['Всё из трёхфазной мойки','Покрытие кузова воском','Мойка дисков и колёсных арок','Пылесос салона и багажника','Протирка панели, стёкол изнутри'],
 ['Всё из комплексной мойки','Обезжиривание кузова','Удаление реагента с кузова и арок','Чернение шин','Проработка порогов и решётки'],
 ['Всё из детейлинг-мойки','Удаление металлических вкраплений','Очистка кузова от битума','Обработка уплотнителей силиконом','Антидождь передней полусферы','Защитное кварцевое покрытие'],
 ['Всё из пакета «Экстерьер»','Химчистка элементов салона','Озонация или сухой туман','Кондиционер кожи сидений','Восстановление пластика салона','Антидождь всех стёкол']
];
d.extraWork=[{name:'Порошковая покраска дисков',location:'Технопарк',price:null}];
d.locations[0].image='loc-myasnitskaya.webp';d.locations[1].image='loc-technopark.webp';
d.locations[0].floor='Подземный паркинг, −1 этаж';d.locations[1].floor='ТЦ «Мегаполис», 1 этаж';
d.locations[0].benefits=['2 часа закрытого паркинга','Кофемания этажом выше','Wi-Fi и зона ожидания','Оплата из машины'];
d.locations[1].benefits=['Полный цикл детейлинга','Оклейка и бронирование','Порошковая покраска дисков','Приём топливных карт'];
d.sources={...d.sources,programs:'https://meat-wash.vercel.app/programmy',contacts:'https://meat-wash.vercel.app/adresa',detailing:'https://meat-wash.vercel.app/detailing',about:'https://meat-wash.vercel.app/o-nas',accessed:'2026-09-23'};
await writeFile(file,JSON.stringify(d,null,2)+'\n');
