/* ==========================================================================
   Seznam projektů zobrazených na mapě

   TOHLE JE JEDINÝ SOUBOR, KTERÝ POTŘEBUJETE UPRAVIT, když chcete
   změnit body na mapě. Kódu rozumět nemusíte, stačí přepisovat texty
   v uvozovkách a čísla v hranatých závorkách.

   Jak doplnit polohu projektu:
     1. Otevřete Mapy.cz (nebo Google Maps) a najděte místo projektu.
     2. Klikněte na něj pravým tlačítkem → volba pro zobrazení / kopírování
        souřadnic. Dostanete dvě čísla, například 50.337499, 14.801600
        (nejdřív zeměpisná šířka, pak délka).
     3. Tato dvě čísla vložte sem místo `null` do hranatých závorek:
        souradnice: [50.337499, 14.801600]

   Projekt, který má `souradnice: null`, se na mapě nezobrazí jako špendlík —
   zůstane jen v seznamu vedle mapy s poznámkou, že poloha není určena.

   Souvislé trasy (cyklostezky, chodníky) můžete místo bodu zadat jako čáru:
   vypište víc souřadnic za sebou do `trasa`, například
     trasa: [[50.3375, 14.8016], [50.3350, 14.7950], [50.3320, 14.7900]]
   Body se propojí čárou. `souradnice` pak slouží jako místo špendlíku;
   necháte-li je null, špendlík se umístí doprostřed trasy automaticky.
   ========================================================================== */

window.PROJEKTY = [

  /* ------------------------------------------------------------ Chotětov */
  {
    id: "pr-1",
    nazev: "Cyklostezka na místě bývalé cukrovarnické vlečky",
    obec: "Chotětov",
    popis: "Stavební povolení jsme získali už ve volebním období 2018 – 2022.",
    souradnice: null,
    trasa: null
  },
  {
    id: "pr-2",
    nazev: "Cyklostezka Chotětov – Bezno",
    obec: "Chotětov",
    popis: "Navážeme na projekt rozpracovaný současným vedením městyse.",
    souradnice: null,
    trasa: null
  },
  {
    id: "pr-3",
    nazev: "Tělocvična u ZŠ Chotětov",
    obec: "Chotětov",
    popis: "Projektová dokumentace na modernizaci školy včetně tělocvičny je hotová.",
    souradnice: null,
    trasa: null
  },
  {
    id: "pr-4",
    nazev: "Společenské centrum v budově č. p. 51",
    obec: "Chotětov",
    popis: "Husovo náměstí. Zázemí pro spolky, akce a setkávání.",
    souradnice: null,
    trasa: null
  },
  {
    id: "pr-5",
    nazev: "Oddechová zóna Na Výslunní",
    obec: "Chotětov",
    popis: "Zeleň a místo k odpočinku v nové zástavbě.",
    souradnice: null,
    trasa: null
  },
  {
    id: "pr-6",
    nazev: "Workoutové prvky, tenisový kurt a hřiště",
    obec: "Chotětov",
    popis: "Sanace zanedbaného kurtu, víceúčelového hřiště a hřiště pro plážový volejbal.",
    souradnice: null,
    trasa: null
  },
  {
    id: "pr-11",
    nazev: "Modernizace a oprava sběrného dvora",
    obec: "Chotětov",
    popis: "Navazujeme na zakoupení nových prostor pro sběrný dvůr.",
    souradnice: null,
    trasa: null
  },
  {
    id: "pr-12",
    nazev: "Studie na novou vodní nádrž",
    obec: "Chotětov",
    popis: "Navazuje na revitalizaci a odbahnění nádrže na Husově náměstí.",
    souradnice: null,
    trasa: null
  },

  /* -------------------------------------------------------------- Hřivno */
  {
    id: "pr-7",
    nazev: "Hřivenský plácek",
    obec: "Hřivno",
    popis: "Nové víceúčelové hřiště, obměna dětského hřiště a zázemí s WC.",
    souradnice: null,
    trasa: null
  },
  {
    id: "pr-8",
    nazev: "Komunitní a společenské centrum",
    obec: "Hřivno",
    popis: "Vedle budovy č. p. 15. Zatím ve fázi studie.",
    souradnice: null,
    trasa: null
  },
  {
    id: "pr-9",
    nazev: "Obnova a oprava chodníků po etapách",
    obec: "Hřivno",
    popis: "Projektová dokumentace je zpracovaná z období 2018 – 2022.",
    souradnice: null,
    trasa: null
  },
  {
    id: "pr-10",
    nazev: "Rekonstrukce silnice III/27216 Hřivno – Zdětín",
    obec: "Hřivno",
    popis: "Jednáme s krajem a Krajskou správou a údržbou silnic. Vozovka je v havarijním stavu.",
    souradnice: null,
    trasa: null
  },
  {
    id: "pr-13",
    nazev: "Propojení polních cest směrem na Zdětín",
    obec: "Hřivno",
    popis: "Jednáme s obcí Zdětín. Cílem je víc pěších tras do Chotětova i okolí.",
    souradnice: null,
    trasa: null
  }

];

/* Střed mapy při načtení a výchozí přiblížení.
   Souřadnice obou obcí podle Wikipedie; upravte, pokud chcete jiný výřez. */
window.MAPA_NASTAVENI = {
  stred: [50.3304, 14.7850],
  priblizeni: 14,
  obce: [
    { nazev: "Chotětov", souradnice: [50.337499, 14.801600] },
    { nazev: "Hřivno",   souradnice: [50.323300, 14.768300] }
  ]
};
