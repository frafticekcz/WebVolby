/* ==========================================================================
   Interaktivní hlasovací lístek — stránka „Jak volit"

   Pravidla podle zákona č. 491/2001 Sb., o volbách do zastupitelstev obcí
   (§ 33 způsob hlasování, § 41 posuzování hlasů), ověřeno proti metodice
   Ministerstva vnitra:

   1. Křížek u záhlaví jedné strany  → hlas dostane jejích prvních N kandidátů.
   2. Křížky u jednotlivých kandidátů napříč stranami → každý po jednom hlasu.
   3. Kombinace → označené strany se hlas dá jen tolika kandidátům v pořadí
      shora, kolik zbývá do počtu volených zastupitelů.

   Hlas je neplatný, když volič neoznačí nic, označí více než jednu stranu,
   nebo označí víc kandidátů, než kolik se volí členů zastupitelstva.
   Označí-li stranu a zároveň její vlastní kandidáty, k těmto značkám
   se nepřihlíží (hlas zůstává platný).
   ========================================================================== */
(function () {
  "use strict";

  var listek = document.getElementById("listek");
  if (!listek) return;

  var MANDATY = parseInt(listek.dataset.mandaty, 10) || 9;

  var vystup    = document.getElementById("vysledek");
  var pocitadlo = document.getElementById("pocitadlo");
  var reset     = document.getElementById("vynulovat");

  var zahlavi   = Array.prototype.slice.call(listek.querySelectorAll(".znacka--strana"));
  var kandidati = Array.prototype.slice.call(listek.querySelectorAll(".znacka--kandidat"));

  function sloupecPrvku(znacka) { return znacka.closest(".listek__sloupec").dataset.strana; }

  /* Vyhodnotí aktuální stav lístku. Vrací popis toho, co se s hlasem stane. */
  function vyhodnotit() {
    var oznaceneStrany = zahlavi.filter(function (z) { return z.checked; });
    var strana = oznaceneStrany.length === 1 ? sloupecPrvku(oznaceneStrany[0]) : null;

    // Značky u kandidátů strany označené v záhlaví se podle § 41 odst. 2 ignorují
    var platneZnacky = kandidati.filter(function (k) {
      return k.checked && sloupecPrvku(k) !== strana;
    });
    var ignorovane = kandidati.filter(function (k) {
      return k.checked && sloupecPrvku(k) === strana;
    });

    var stav = {
      strana: strana,
      viceStran: oznaceneStrany.length > 1,
      platneZnacky: platneZnacky,
      ignorovane: ignorovane,
      // Kolik hlasů reálně rozdáno: jednotliví kandidáti + doplnění ze strany
      zeStrany: 0,
      prazdno: oznaceneStrany.length === 0 && platneZnacky.length === 0 && ignorovane.length === 0,
      prekroceno: platneZnacky.length > MANDATY
    };

    if (strana && !stav.prekroceno) {
      stav.zeStrany = Math.max(0, MANDATY - platneZnacky.length);
    }
    return stav;
  }

  /* Obarví lístek: kdo dostane hlas a čí značka se ignoruje */
  function prekreslitListek(stav) {
    listek.querySelectorAll(".listek__kandidat").forEach(function (radek) {
      radek.classList.remove("ma-hlas", "ignorovano");
    });

    if (stav.viceStran || stav.prekroceno) return;

    stav.platneZnacky.forEach(function (z) {
      z.closest(".listek__kandidat").classList.add("ma-hlas");
    });
    stav.ignorovane.forEach(function (z) {
      z.closest(".listek__kandidat").classList.add("ignorovano");
    });

    if (stav.strana && stav.zeStrany > 0) {
      var sloupec = listek.querySelector('.listek__sloupec[data-strana="' + stav.strana + '"]');
      var radky = Array.prototype.slice.call(sloupec.querySelectorAll(".listek__kandidat"));
      radky.slice(0, stav.zeStrany).forEach(function (r) {
        r.classList.add("ma-hlas");
        r.classList.remove("ignorovano");
      });
    }
  }

  function nazevStrany(klic) {
    var s = listek.querySelector('.listek__sloupec[data-strana="' + klic + '"]');
    return s ? s.querySelector(".listek__nazev").textContent.trim() : klic;
  }

  /* Slovní vysvětlení výsledku */
  function popsat(stav) {
    if (stav.viceStran) {
      return {
        typ: "chyba",
        nadpis: "Takový lístek by byl neplatný",
        text: "Křížek smí být u záhlaví <strong>jen jedné</strong> volební strany. " +
              "Pokud chcete podpořit kandidáty z více stran, křížkujte místo záhlaví " +
              "jednotlivá jména.",
        body: []
      };
    }

    if (stav.prekroceno) {
      return {
        typ: "chyba",
        nadpis: "Takový lístek by byl neplatný",
        text: "Označili jste <strong>" + stav.platneZnacky.length + "</strong> kandidátů, " +
              "ale volí se jich jen <strong>" + MANDATY + "</strong>. " +
              "Uberte křížky tak, abyste jich měli nejvýše " + MANDATY + ".",
        body: []
      };
    }

    if (stav.prazdno) {
      return {
        typ: "prazdny",
        nadpis: "Zatím jste nic neoznačili",
        text: "Zkuste si vyzkoušet některý ze tří způsobů — zakřížkujte záhlaví strany, " +
              "nebo klikejte na jednotlivá jména. Níže uvidíte, jak by se hlasy rozdělily.",
        body: []
      };
    }

    // Sečteme hlasy po stranách
    var podleStran = {};
    stav.platneZnacky.forEach(function (z) {
      var s = sloupecPrvku(z);
      podleStran[s] = (podleStran[s] || 0) + 1;
    });
    if (stav.strana && stav.zeStrany > 0) {
      podleStran[stav.strana] = (podleStran[stav.strana] || 0) + stav.zeStrany;
    }

    var body = Object.keys(podleStran).map(function (s) {
      var n = podleStran[s];
      return "<strong>" + nazevStrany(s) + "</strong> — " + n + "&nbsp;" +
             (n === 1 ? "hlas" : (n >= 2 && n <= 4 ? "hlasy" : "hlasů"));
    });

    var text;
    if (stav.strana && stav.platneZnacky.length > 0) {
      text = "Označili jste stranu <strong>" + nazevStrany(stav.strana) + "</strong> a k tomu " +
             stav.platneZnacky.length + " kandidátů odjinud. Proto se hlas z označené strany " +
             "dá jen prvním <strong>" + stav.zeStrany + "</strong> kandidátům v pořadí — " +
             "na zbytek listiny už hlas nezbyde.";
    } else if (stav.strana) {
      text = "Hlas dostane všech <strong>" + stav.zeStrany + "</strong> kandidátů strany " +
             nazevStrany(stav.strana) + " v pořadí, jak jsou na listině.";
    } else {
      text = "Hlas dostane každý zakřížkovaný kandidát. Zbývá vám ještě <strong>" +
             (MANDATY - stav.platneZnacky.length) + "</strong> křížků, které můžete rozdat — " +
             "nevyužité křížky ale nikomu neuškodí.";
    }

    if (stav.ignorovane.length) {
      text += " Značky u kandidátů strany, kterou jste označili v záhlaví, se nepočítají " +
              "zvlášť — hlas jim už dala samotná strana.";
    }

    return { typ: "ok", nadpis: "Takto by se váš hlas rozdělil", text: text, body: body };
  }

  function prekreslit() {
    var stav = vyhodnotit();
    prekreslitListek(stav);

    var pocet = stav.platneZnacky.length + (stav.strana ? stav.zeStrany : 0);
    pocitadlo.innerHTML = "Rozdáno <strong>" + pocet + "</strong> z " + MANDATY + " hlasů";
    pocitadlo.classList.toggle("je-prekroceno", stav.prekroceno || stav.viceStran);

    var p = popsat(stav);
    vystup.className = "vysledek" +
      (p.typ === "chyba" ? " vysledek--chyba" : p.typ === "prazdny" ? " vysledek--prazdny" : "");
    vystup.innerHTML =
      '<p class="vysledek__nadpis">' + p.nadpis + "</p><p>" + p.text + "</p>" +
      (p.body.length ? "<ul><li>" + p.body.join("</li><li>") + "</li></ul>" : "");
  }

  listek.addEventListener("change", function (e) {
    // Křížek u záhlaví strany vyřadí značky u kandidátů téže strany
    if (e.target.classList.contains("znacka--strana") && e.target.checked) {
      var moje = sloupecPrvku(e.target);
      zahlavi.forEach(function (z) {
        if (z !== e.target && sloupecPrvku(z) === moje) z.checked = false;
      });
    }
    prekreslit();
  });

  reset.addEventListener("click", function () {
    zahlavi.concat(kandidati).forEach(function (z) { z.checked = false; });
    prekreslit();
  });

  prekreslit();
})();
