# (RE)NEW IT
Author: Michal Koudela

Webové stránky jsou součástí mého maturitního projektu o tvorbě historické knihy.

Tyto stránky fungují jako portál pro ověření dovedností z knihy a zároveň pro aktuality, které na knihu navazují.
Ve své podstatě pak vypadají jako novinové či blogové stránky.

## API
Součástí [React](https://react.dev/learn) frontendu je i backend, který běží na portu 5050 (Web jej pravděpodobně port-fowarduje na port 10000). Tento Backend slouží k propojení s MongoDB serverem a Cloudinary.

## Hosting
Hosting je poskytován firmou [render.com](render.com). Která mi umožňuje na nulovou cenu hostovat tento web na jejich přidělené [adrese](https://renewit-server.onrender.com/).

To je změna oproti minulé verzi webových stránek, které byli hostované na AWS servrech. To se, ale od té doby dosti zkomplikovalo. A tak jsem zvolil tuto variantu, kterou mohu nahrát přímo z GitHub repozitáře. 

## Databáze
Aplikace pro uchovávání dat využízvá cloudovou službu [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database), která je do 500MB zdarma.
Pro nahrávání obrázků, používám [Cloudinary](https://cloudinary.com), které sice není zautomatizované a články se mi nenahrávají automaticky. Ale mohu odkaz na ně jednoduše zkopírovat a do 10MB na obrázek je zdarma.

## Zranitelnost !
Stránky fungují sice jako webový blog a quiz, ale nejsou nakódované s pokročilejšími bezpečnostními funkecmi. Téměř jakýkoliv průměrný útočník by neměl problém zranitelností zneužít.
