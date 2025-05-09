# Aplikace pro podporu výuky metrických přístupových metod

Interaktivní aplikace pro vizualizaci a pochopení principů metrických indexačních metod.

## O projektu

Tato webová aplikace demonstruje, jak fungují metrické indexační metody pro efektivní vyhledávání v metrických prostorech. Vizuálně zobrazuje jednotlivé kroky algoritmů při různých typech dotazů a pomáhá pochopit jejich principy a výhody.

### Implementované metody:

- **AESA** (Approximating Eliminating Search Algorithm)
- **LAESA** (Linear AESA)
- **M-Tree**

### Typy algoritmů:

- **kNN dotaz** (k-nejbližších sousedů)
- **Rozsahový dotaz** (Range Query)
- **Dynamické vkládání** (Dynamic Insert)

## Technické informace

Projekt je implementován pomocí:

- React 18
- TypeScript 4
- Material-UI 5
- React Router 6
- XState pro správu stavů
- SVG pro vizualizaci

## Instalace a spuštění

### Požadavky
- Node.js verze 14 nebo vyšší
- npm nebo yarn

### Kroky pro spuštění

1. Naklonujte repozitář:
git clone <URL-repozitáře>

2. Nainstalujte závislosti:
npm install

3. Spusťte vývojový server:
npm start

4. Otevřete prohlížeč na adrese [http://localhost:3000](http://localhost:3000)

## Nasazení

Aplikace je nakonfigurována pro nasazení na platformě Vercel pomocí souboru `vercel.json`, který zajišťuje správné fungování client-side routingu.

## Struktura projektu

Projekt využívá nástroje pro analýzu závislostí (dependency-cruiser, madge) pro udržení čisté architektury.

### Další dostupné příkazy

- `npm run build` - Vytvoří produkční build aplikace ve složce `build`
- `npm test` - Spustí testy
- `npm run eject` - Vyextrahuje konfigurační soubory z Create React App (nevratná operace)