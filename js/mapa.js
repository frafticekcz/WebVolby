/* ==========================================================================
   Mapa projektů — stránka mapa.html

   Vykreslí projekty ze souboru js/projekty.js do mapy postavené na knihovně
   Leaflet nad podkladem OpenStreetMap.

   Projekt bez vyplněných souřadnic se do mapy nekreslí — zůstane jen
   v seznamu s poznámkou, že poloha zatím není určena. Nikdy neodhadujeme
   polohu za uživatele; na mapě by odhad vypadal jako ověřený údaj.
   ========================================================================== */
(function () {
  "use strict";

  var plocha = document.getElementById("mapa-plocha");
  if (!plocha || typeof L === "undefined") return;

  var projekty  = window.PROJEKTY || [];
  var nastaveni = window.MAPA_NASTAVENI || { stred: [50.3304, 14.785], priblizeni: 14, obce: [] };

  var seznam    = document.getElementById("seznam-projektu");
  var filtr     = document.getElementById("filtr-obci");
  var upozorneni = document.getElementById("bez-poloh");

  /* --------------------------------------------------------------- Mapa */
  var mapa = L.map(plocha, { scrollWheelZoom: false })
    .setView(nastaveni.stred, nastaveni.priblizeni);

  // Kolečkem myši se přiblíží až po kliknutí do mapy, ať se stránka
  // při scrollování neprokousává mapou.
  mapa.on("click", function () { mapa.scrollWheelZoom.enable(); });
  mapa.on("mouseout", function () { mapa.scrollWheelZoom.disable(); });

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; přispěvatelé <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(mapa);

  /* Popisky obou obcí — orientační body, souřadnice ověřené */
  (nastaveni.obce || []).forEach(function (o) {
    L.marker(o.souradnice, {
      icon: L.divIcon({
        className: "obec-znacka",
        html: '<span>' + o.nazev + "</span>",
        iconSize: [null, null]
      }),
      interactive: false,
      keyboard: false
    }).addTo(mapa);
  });

  /* ------------------------------------------------------------ Špendlíky */
  var vrstvy = {};   // id projektu → { znacka, cara }
  var umistene = projekty.filter(function (p) { return p.souradnice || p.trasa; });

  function stredTrasy(trasa) {
    var s = trasa.reduce(function (a, b) { return [a[0] + b[0], a[1] + b[1]]; }, [0, 0]);
    return [s[0] / trasa.length, s[1] / trasa.length];
  }

  function ikona(cislo, obec) {
    return L.divIcon({
      className: "",
      html: '<span class="pin-mapa ' +
            (obec === "Hřivno" ? "pin-mapa--hrivno" : "") + '">' + cislo + "</span>",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18]
    });
  }

  umistene.forEach(function (p, i) {
    var poloha = p.souradnice || stredTrasy(p.trasa);
    var zaznam = {};

    if (p.trasa && p.trasa.length > 1) {
      zaznam.cara = L.polyline(p.trasa, {
        color: p.obec === "Hřivno" ? "#3D5FA8" : "#002A7D",
        weight: 5,
        opacity: .85
      }).addTo(mapa);
    }

    zaznam.znacka = L.marker(poloha, {
      icon: ikona(i + 1, p.obec),
      title: p.nazev,
      alt: p.nazev
    }).addTo(mapa);

    zaznam.znacka.bindPopup(
      "<strong>" + p.nazev + "</strong><br>" +
      '<span style="color:#5A6070">' + p.obec + "</span>" +
      (p.popis ? "<br>" + p.popis : ""),
      // Bez omezení šířky přeteče bublina na mobilu přes okraj mapy
      { maxWidth: 220, autoPan: true, autoPanPadding: [18, 18], keepInView: true }
    );

    zaznam.znacka.on("click", function () { zvyraznit(p.id); });
    vrstvy[p.id] = zaznam;
  });

  // Výřez podle skutečně umístěných bodů
  if (umistene.length) {
    var body = umistene.map(function (p) { return p.souradnice || stredTrasy(p.trasa); });
    mapa.fitBounds(L.latLngBounds(body).pad(0.25));
  }

  if (upozorneni) upozorneni.hidden = umistene.length > 0;

  /* -------------------------------------------------------------- Seznam */
  function vykreslitSeznam(obec) {
    seznam.innerHTML = "";
    var poradi = 0;

    projekty.forEach(function (p) {
      var jeUmisten = !!(p.souradnice || p.trasa);
      if (jeUmisten) poradi++;
      if (obec !== "vse" && p.obec !== obec) return;

      var li = document.createElement("li");
      li.id = "polozka-" + p.id;
      li.dataset.projekt = p.id;
      if (!jeUmisten) li.classList.add("bez-polohy");

      li.innerHTML =
        '<span class="mapa__cislo ' +
          (p.obec === "Hřivno" ? "mapa__cislo--hrivno" : "") + '">' +
          (jeUmisten ? poradi : "?") + "</span>" +
        "<span><span class=\"mapa__nazev\">" + p.nazev + "</span>" +
        '<span class="mapa__obec">' + p.obec +
          (p.popis ? " · " + p.popis : "") +
          (jeUmisten ? "" : ' <em class="chybi">poloha zatím není určena</em>') +
        "</span></span>";

      seznam.appendChild(li);
    });
  }

  function zvyraznit(id) {
    seznam.querySelectorAll("li").forEach(function (li) {
      li.classList.toggle("je-aktivni", li.dataset.projekt === id);
    });
  }

  seznam.addEventListener("click", function (e) {
    var li = e.target.closest("li");
    if (!li) return;
    var z = vrstvy[li.dataset.projekt];
    zvyraznit(li.dataset.projekt);
    // Špendlík vycentrujeme a teprve pak otevřeme bublinu — nad středem
    // mapy se vejde symetricky i na úzkém mobilu. (Samotný autoPan bublinu
    // od okraje neposunul dostatečně.)
    if (z) {
      // animate:false schválně — s animovaným posunem do něj otevření
      // bubliny zasáhne a vycentrování se rozpadne.
      mapa.setView(z.znacka.getLatLng(), mapa.getZoom(), { animate: false });
      z.znacka.openPopup();
    }
  });

  vykreslitSeznam("vse");

  /* --------------------------------------------------------------- Filtr */
  if (filtr) {
    filtr.addEventListener("click", function (e) {
      var t = e.target.closest("[data-obec]");
      if (!t) return;
      filtr.querySelectorAll("[data-obec]").forEach(function (b) {
        b.setAttribute("aria-selected", String(b === t));
      });
      vykreslitSeznam(t.dataset.obec);
    });
  }

})();
