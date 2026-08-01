/* ==========================================================================
   Seznam projektů zobrazených na mapě

   TOHLE JE JEDINÝ SOUBOR, KTERÝ POTŘEBUJETE UPRAVIT, když chcete
   změnit body na mapě. Kódu rozumět nemusíte, stačí přepisovat texty
   v uvozovkách a čísla v hranatých závorkách.

   Každý projekt má:
     nazev       — název bodu (zobrazí se v bublině i v seznamu)
     obec        — "Chotětov" nebo "Hřivno" (podle toho funguje filtr)
     popis       — krátký popis pod názvem
     souradnice  — [zeměpisná šířka, délka], např. [50.337499, 14.801600]

   Jak zjistit souřadnice nového bodu:
     1. Otevřete Mapy.cz a najděte místo projektu.
     2. Klikněte pravým tlačítkem → kopírovat souřadnice.
     3. Vložte je do hranatých závorek: souradnice: [50.337499, 14.801600]

   Projekt se `souradnice: null` se na mapě neukáže jako špendlík, zůstane
   jen v seznamu vedle mapy. Body níže jsou z podkladu z 1. 8. 2026.
   ========================================================================== */

window.PROJEKTY = [

  /* ------------------------------------------------------------ Chotětov */
  {
    id: "pr-1",
    nazev: "Cyklostezka na místě bývalé cukrovarnické vlečky",
    obec: "Chotětov",
    popis: "Ve volebním období 2018 – 2022 získáno stavební povolení.",
    souradnice: [50.340282, 14.813686]
  },
  {
    id: "pr-2",
    nazev: "Cyklostezka Chotětov – Bezno",
    obec: "Chotětov",
    popis: "Navážeme na projekt rozpracovaný současným vedením městyse.",
    souradnice: [50.351870, 14.801446]
  },
  {
    id: "pr-3",
    nazev: "Tělocvična u ZŠ Chotětov",
    obec: "Chotětov",
    popis: "Nechali jsme zpracovat projektovou dokumentaci; projekt bychom rádi realizovali za podpory dotačních prostředků.",
    souradnice: [50.337154, 14.799780]
  },
  {
    id: "pr-4",
    nazev: "Společenské centrum Chotětov, č. p. 51",
    obec: "Chotětov",
    popis: "Husovo náměstí. Možnost konání voleb a společenských akcí, využití pro spolky, soukromé akce i oslavy.",
    souradnice: [50.337090, 14.801553]
  },
  {
    id: "pr-5",
    nazev: "Oddechová zóna Na Výslunní",
    obec: "Chotětov",
    popis: "Podobně jako v lokalitě Do Haček vznik zeleně, nového místa k odpočinku a hracích prvků.",
    souradnice: [50.333706, 14.801317]
  },
  {
    id: "pr-6",
    nazev: "Sportovní areál – modernizace hřišť a hracích prvků",
    obec: "Chotětov",
    popis: "Sanace víceúčelového hřiště, tenisového kurtu a hřiště pro plážový volejbal, zřízení workoutových posilovacích prvků.",
    souradnice: [50.340397, 14.800410]
  },
  {
    id: "pr-7",
    nazev: "Sběrný dvůr – modernizace",
    obec: "Chotětov",
    popis: "Navázání na zakoupení nových prostor pro sběrný dvůr.",
    souradnice: [50.337017, 14.798858]
  },
  {
    id: "pr-8",
    nazev: "Nová vodní plocha – studie plochy K4",
    obec: "Chotětov",
    popis: "Studie proveditelnosti na výstavbu nové vodní nádrže v Chotětově, plocha K4.",
    souradnice: [50.336414, 14.797686]
  },
  {
    id: "pr-9",
    nazev: "Nová vodní plocha – studie plochy K5",
    obec: "Chotětov",
    popis: "Studie proveditelnosti na výstavbu nové vodní nádrže v Chotětově, plocha K5.",
    souradnice: [50.335075, 14.798491]
  },

  /* -------------------------------------------------------------- Hřivno */
  {
    id: "pr-10",
    nazev: "Hřivenský plácek",
    obec: "Hřivno",
    popis: "Nové víceúčelové hřiště, obměna prvků na dětském hřišti, výstavba zázemí s WC.",
    souradnice: [50.324180, 14.770316]
  },
  {
    id: "pr-11",
    nazev: "Společenské centrum Hřivno, vedle č. p. 15",
    obec: "Hřivno",
    popis: "Možnost konání voleb a společenských akcí, využití pro spolky, soukromé akce i oslavy.",
    souradnice: [50.323143, 14.767176]
  },
  {
    id: "pr-12",
    nazev: "Rekonstrukce komunikace III/27216 Hřivno – Zdětín",
    obec: "Hřivno",
    popis: "Chceme jednat s krajem a KSÚS Středočeského kraje o rekonstrukci havarijního stavu této komunikace.",
    souradnice: [50.319603, 14.777606]
  },
  {
    id: "pr-13",
    nazev: "Propojení polních cest v okolí Hřivna",
    obec: "Hřivno",
    popis: "Studie variantního řešení propojení polních cest a jednání s obcí Zdětín o průchodu přes její katastrální území.",
    souradnice: [50.322520, 14.781200]
  },

  /* ------- Chotětov (v podkladu poslední, proto na konci = číslo 14) ------- */
  {
    id: "pr-14",
    nazev: "Rezidence Jizera",
    obec: "Chotětov",
    popis: "Soukromý investor zřídí dům s pečovatelskou službou; chceme poskytnout maximální možnou součinnost při výstavbě.",
    souradnice: [50.336815, 14.806402]
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
