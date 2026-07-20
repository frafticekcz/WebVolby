# Volební web — SPOLU pro Chotětov, Hřivno a ODS 2026

Živý web: <https://frafticekcz.github.io/WebVolby/>

Statický web bez build systému. Otevřete kterýkoli `.html` soubor v prohlížeči
a funguje. Nasazený je na GitHub Pages.

## Nasazení a aktualizace

Po každé úpravě:

```
python verze.py        # jen když jste měnili style.css nebo něco v js/
git add -A
git commit -m "popis změny"
git push
```

Do zhruba minuty po `push` je nová verze na serveru.

## Cachování — proč a jak je to vyřešené

Prohlížeče si soubory ukládají do mezipaměti, aby se web načítal rychleji.
Nevýhoda: po úpravě může návštěvník chvíli vidět starou verzi. Řešíme to
na dvou úrovních.

**CSS a JavaScript** (`style.css`, soubory v `js/`) mají za odkazem značku
verze, například `style.css?v=2026-07-20-2202`. Jakmile se značka změní,
prohlížeč soubor bere jako nový a stáhne ho znovu. O přečíslování se stará
skript — proto před nahráním webu spusťte **`python verze.py`**, pokud jste
tyto soubory upravovali. Ručně v HTML nic přepisovat nemusíte.

**HTML stránky** (`index.html`, `program.html`, …) na GitHub Pages nejde
řídit vlastními hlavičkami — GitHub je servíruje s desetiminutovou platností
mezipaměti a nedá se to změnit. V praxi to znamená, že návštěvník uvidí nový
obsah HTML nejpozději do 10 minut od nahrání. To je běžné a přijatelné.

**Když chcete změnu vidět hned vy** (například při testování), použijte
ve svém prohlížeči tvrdé obnovení: `Ctrl+F5` (Windows) nebo `Cmd+Shift+R`
(Mac). Návštěvníků se to netýká, ti dostanou aktuální verzi sami.

> Soubor `dev-server.py` slouží jen k náhledu na vlastním počítači
> (`python dev-server.py`), na GitHub Pages nemá žádnou roli.

## Kde se doplňuje obsah

Místa čekající na doplnění mají v kódu třídu `chybi` — dají se snadno najít
hledáním toho slova. Konkrétně:

- **Kontaktní údaje** — e-mail, telefon, Facebook. V `index.html`, sekce
  „Kontakt". Nezapomeňte opravit i `href` (`mailto:`, `tel:`, odkaz na FB).
- **Adresa volební místnosti** — v `jak-volit.html`, karta „Kde".
- **Představení kandidátů** — citáty a texty v `kandidati.html`.
- **Podrobnosti k bodům programu** — rozklikávací detaily v `program.html`.
- **Polohy projektů na mapě** — soubor `js/projekty.js`. Návod, jak zjistit
  souřadnice, je nahoře v tomto souboru. Projekt bez souřadnic se v mapě
  neukáže jako špendlík, zůstane jen v seznamu vedle mapy.

## Struktura

```
index.html          úvodní stránka
program.html        celý volební program
mapa.html           mapa projektů (OpenStreetMap + Leaflet)
kandidati.html      profily kandidátů
jak-volit.html      návod k hlasování + zkušební lístek
css/style.css       veškeré styly
js/                 skripty (main, mapa, projekty, volebni-listek, leaflet/)
img/kandidati/      fotografie kandidátů
dokumenty/          volební brožura v PDF
verze.py            přečíslování verze CSS/JS (spustit před nahráním)
dev-server.py       lokální náhledový server (nepovinné)
```
