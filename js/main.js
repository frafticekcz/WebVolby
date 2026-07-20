/* ==========================================================================
   SPOLU pro Chotětov, Hřivno a ODS 2026 — interakce
   Bez závislostí. Každý blok je samostatný a tiše se přeskočí,
   pokud příslušné prvky na stránce nejsou (sdíleno index.html / program.html).
   ========================================================================== */
(function () {
  "use strict";

  var omezitPohyb = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------ Mobilní menu */
  (function menu() {
    var tlacitko = document.getElementById("hamburger");
    var navigace = document.getElementById("menu");
    if (!tlacitko || !navigace) return;

    function zavrit() {
      navigace.classList.remove("je-otevrene");
      tlacitko.setAttribute("aria-expanded", "false");
      tlacitko.setAttribute("aria-label", "Otevřít menu");
    }

    tlacitko.addEventListener("click", function () {
      var otevreno = navigace.classList.toggle("je-otevrene");
      tlacitko.setAttribute("aria-expanded", String(otevreno));
      tlacitko.setAttribute("aria-label", otevreno ? "Zavřít menu" : "Otevřít menu");
    });

    // Klik na položku menu zavře panel
    navigace.addEventListener("click", function (e) {
      if (e.target.closest("a")) zavrit();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navigace.classList.contains("je-otevrene")) {
        zavrit();
        tlacitko.focus();
      }
    });

    // Po zvětšení okna nad mobilní breakpoint panel zavřít
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) zavrit();
    });
  })();

  /* ------------------------------- Stín hlavičky + ukazatel scrollu */
  (function scrollHlavicka() {
    var hlavicka = document.getElementById("hlavicka");
    var ukazatel = document.getElementById("ukazatel");
    if (!hlavicka) return;

    var ceka = false;

    function prekreslit() {
      var y = window.scrollY || document.documentElement.scrollTop;
      hlavicka.classList.toggle("je-odscrollovano", y > 8);

      if (ukazatel) {
        var celkem = document.documentElement.scrollHeight - window.innerHeight;
        var podil = celkem > 0 ? (y / celkem) * 100 : 0;
        ukazatel.style.width = Math.min(100, Math.max(0, podil)) + "%";
      }
      ceka = false;
    }

    window.addEventListener("scroll", function () {
      if (!ceka) {
        ceka = true;
        window.requestAnimationFrame(prekreslit);
      }
    }, { passive: true });

    prekreslit();
  })();

  /* --------------------------------- Zvýraznění aktivní položky menu */
  (function aktivniOdkaz() {
    var odkazy = Array.prototype.slice.call(
      document.querySelectorAll('.menu a[href^="#"]')
    );
    if (!odkazy.length || !("IntersectionObserver" in window)) return;

    var sekce = odkazy
      .map(function (a) { return document.querySelector(a.getAttribute("href")); })
      .filter(Boolean);
    if (!sekce.length) return;

    var pozorovatel = new IntersectionObserver(function (zaznamy) {
      zaznamy.forEach(function (z) {
        if (!z.isIntersecting) return;
        odkazy.forEach(function (a) {
          a.classList.toggle("je-aktivni", a.getAttribute("href") === "#" + z.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sekce.forEach(function (s) { pozorovatel.observe(s); });
  })();

  /* -------------------------------------- Náběh prvků při scrollování */
  (function nabihani() {
    var prvky = Array.prototype.slice.call(document.querySelectorAll(".nabihat"));
    if (!prvky.length) return;

    if (omezitPohyb || !("IntersectionObserver" in window)) {
      prvky.forEach(function (p) { p.classList.add("je-videt"); });
      return;
    }

    var pozorovatel = new IntersectionObserver(function (zaznamy, self) {
      zaznamy.forEach(function (z) {
        if (!z.isIntersecting) return;
        z.target.classList.add("je-videt");
        self.unobserve(z.target);
      });
    }, { rootMargin: "0px 0px -60px 0px", threshold: .08 });

    prvky.forEach(function (p) { pozorovatel.observe(p); });
  })();

  /* -------------------------------------------------- Odpočet do voleb */
  (function odpocet() {
    var box = document.getElementById("odpocet");
    if (!box) return;

    var cil = new Date(box.dataset.volby).getTime();
    if (isNaN(cil)) return;

    var poleDny     = document.getElementById("dny");
    var popisDny    = document.getElementById("dny-popis");
    var poleHodiny  = document.getElementById("hodiny");
    var poleMinuty  = document.getElementById("minuty");
    var poleSekundy = document.getElementById("sekundy");

    // Volby končí druhý den ve 14:00 — do té doby hlásíme "probíhají"
    var konec = cil + 24 * 60 * 60 * 1000;

    function dva(n) { return n < 10 ? "0" + n : String(n); }

    // České skloňování: 1 den, 2–4 dny, 5+ dní
    function sklonovatDny(n) {
      if (n === 1) return "den";
      if (n >= 2 && n <= 4) return "dny";
      return "dní";
    }

    function tik() {
      var zbyva = cil - Date.now();

      if (zbyva <= 0) {
        box.classList.add("je-aktivni");
        // Po skončení voleb odpočet skryjeme úplně
        if (Date.now() > konec) box.hidden = true;
        clearInterval(casovac);
        return;
      }

      var s = Math.floor(zbyva / 1000);
      var dny = Math.floor(s / 86400);

      poleDny.textContent     = dny;
      popisDny.textContent    = sklonovatDny(dny);
      poleHodiny.textContent  = dva(Math.floor(s / 3600) % 24);
      poleMinuty.textContent  = dva(Math.floor(s / 60) % 60);
      poleSekundy.textContent = dva(s % 60);
    }

    tik();
    var casovac = setInterval(tik, 1000);
  })();

  /* ------------------------------------- Dopočítávání čísel v sekci ---- */
  (function pocitadla() {
    var prvky = Array.prototype.slice.call(document.querySelectorAll("[data-cil]"));
    if (!prvky.length) return;

    // Číslo s desetinnou čárkou a mezerou jako oddělovačem tisíců (české zvyklosti)
    function naText(hodnota, desetinna) {
      var text = desetinna ? hodnota.toFixed(1).replace(".", ",") : String(Math.round(hodnota));
      return desetinna ? text : text.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    function spustit(prvek) {
      var cil = parseFloat(prvek.dataset.cil);
      var desetinna = prvek.dataset.cil.indexOf(".") !== -1;

      if (omezitPohyb) {
        prvek.textContent = naText(cil, desetinna);
        return;
      }

      var trvani = 1500;
      var start = null;

      function krok(cas) {
        if (start === null) start = cas;
        var podil = Math.min((cas - start) / trvani, 1);
        // easeOutCubic – rychlý rozjezd, měkké dojetí
        var e = 1 - Math.pow(1 - podil, 3);
        prvek.textContent = naText(cil * e, desetinna);
        if (podil < 1) requestAnimationFrame(krok);
      }
      requestAnimationFrame(krok);
    }

    if (!("IntersectionObserver" in window)) {
      prvky.forEach(spustit);
      return;
    }

    var pozorovatel = new IntersectionObserver(function (zaznamy, self) {
      zaznamy.forEach(function (z) {
        if (!z.isIntersecting) return;
        spustit(z.target);
        self.unobserve(z.target);
      });
    }, { threshold: .4 });

    prvky.forEach(function (p) { pozorovatel.observe(p); });
  })();

  /* -------------------------------------- Přepínač kandidátních listin */
  (function zalozky() {
    var prepinac = document.querySelector(".prepinac");
    if (!prepinac) return;

    var tlacitka = Array.prototype.slice.call(
      prepinac.querySelectorAll('[role="tab"]')
    );
    if (!tlacitka.length) return;

    function prepnout(cil) {
      tlacitka.forEach(function (t) {
        var vybrano = t === cil;
        t.setAttribute("aria-selected", String(vybrano));
        t.tabIndex = vybrano ? 0 : -1;

        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !vybrano;
      });
    }

    prepinac.addEventListener("click", function (e) {
      var t = e.target.closest('[role="tab"]');
      if (t) prepnout(t);
    });

    // Ovládání šipkami podle zvyklostí pro záložky
    prepinac.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var i = tlacitka.indexOf(document.activeElement);
      if (i === -1) return;
      e.preventDefault();
      var dalsi = tlacitka[(i + (e.key === "ArrowRight" ? 1 : -1) + tlacitka.length) % tlacitka.length];
      dalsi.focus();
      prepnout(dalsi);
    });

    // Výchozí stav podle značek v HTML
    prepnout(prepinac.querySelector('[aria-selected="true"]') || tlacitka[0]);
  })();

})();
