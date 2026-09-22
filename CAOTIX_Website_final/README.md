# CAOTIX Website – Hosting- und Pflegeanleitung

Diese Website ist eine **statische Website**. Für den normalen Betrieb ist kein Build-Prozess, keine Datenbank und kein CMS nötig.

Für den Bandalltag gilt hauptsächlich:

> **Texte, Termine, Mitglieder, Releases, Kontaktangaben, Social-Links und der Merch-Hinweis werden in `content.js` gepflegt.**

Die Dateien `style.css`, `script.js`, `easter-eggs/`, `content-render.js`, `shows.js` und die meisten `.html`-Dateien enthalten Design und technische Logik. Für normale Inhaltsänderungen müssen sie nicht angefasst werden.

**Interne Datei:** Diese `README.md` ist als Pflege- und Entwicklerdokumentation gedacht und soll **nicht auf den öffentlichen Webserver hochgeladen werden**. Sie dokumentiert weiter unten bewusst auch die Lösungen der Easter Eggs.

**Wichtig:** Es gibt absichtlich versteckte technische Bereiche der Website. Ordner/Dateien, deren Zweck nicht klar ist, bitte **nicht umbenennen, verschieben oder löschen**. Für normale Pflege ist das nicht nötig.

---

## 1. Website hosten / hochladen

Der komplette Website-Ordner heißt:

```text
caotix_webseite/
```

Beim Hosting muss der **Inhalt dieses Ordners** in das öffentliche Web-Verzeichnis des Hosters geladen werden, sodass `index.html` direkt im Web-Stamm liegt.

Typische Zielordner heißen je nach Anbieter zum Beispiel:

```text
public_html/
www/
htdocs/
```

Wichtig:

- `index.html` muss im öffentlichen Hauptverzeichnis liegen.
- Den Ordner `assets/` und alle weiteren vorhandenen Unterordner mit hochladen.
- Dateinamen und Ordnerstruktur nicht verändern, wenn nicht gleichzeitig die Verweise im Code angepasst werden.
- HTTPS aktivieren.
- Nach jedem Upload Startseite, Navigation und mindestens eine Unterseite testen.

Es ist kein PHP, Node.js oder anderer Servercode für den normalen Betrieb nötig.

### Wichtige Dateien

```text
index.html          Startseite
live.html           Live-Termine
404.html            eigene Fehlerseite für nicht gefundene URLs
content.js          zentrale Inhaltsdatei
style.css           Design
content-render.js   setzt Inhalte aus content.js ein
shows.js            Sortierung der Live-Termine
script.js           allgemeine Website-Logik
easter-eggs/        komplette EP-Easter-Egg-Kampagne (Logik, Observer, Assets, internes README)
assets/             Bilder und Grafiken
README.md           diese Anleitung
```

---

## 2. Texte und Inhalte ändern

Fast alle regelmäßig zu ändernden Inhalte stehen in:

```text
content.js
```

Die Datei kann mit Visual Studio Code, Notepad++, Windows Editor oder einem anderen normalen Texteditor geöffnet werden.

Die wichtigsten Bereiche sind:

```text
site          E-Mail und Social-Media-Links
meta          Seitentitel / Google- und Sharing-Texte
home          Startseitentexte
band          Bandbeschreibung und Geschichte
members       Bandmitglieder
shows         Live-Termine
music         Releases
merchPage     Merch-Hinweis
contact       Booking-/Kontakttexte
```

### Grundregel

Texte stehen zwischen Anführungszeichen:

```js
name: "Joost",
role: "Lead Guitar",
```

Anführungszeichen, Doppelpunkte und Kommas nicht versehentlich löschen.

Zeilenumbrüche innerhalb eines Textes können mit `\n` gesetzt werden:

```js
headline: "BOOK US.\nPRESS US.\nWRITE US.",
```

Nach Änderungen die Datei speichern und die betroffene Seite im Browser neu laden.

### Wenn nach einer Änderung plötzlich nichts mehr angezeigt wird

Meistens wurde versehentlich ein Komma, Anführungszeichen oder eine Klammer gelöscht.

Dann:

1. letzte Änderung rückgängig machen,
2. Datei speichern,
3. Seite neu laden.

Im Zweifel immer zuerst eine Sicherheitskopie von `content.js` anlegen.

---

## 3. Zentrale Daten unter `site`

In `content.js` unter:

```js
site: {
```

stehen unter anderem:

```js
email: "caotixband@gmail.com",
instagram: "...",
tiktok: "...",
youtube: "...",
spotify: "...",
baseUrl: "https://caotix.de",
```

### Social-Media-Link aktivieren

URL eintragen:

```js
youtube: "https://youtube.com/...",
```

### Social-Media-Link vorerst deaktivieren

Einfach leer lassen:

```js
youtube: "",
```

Die Website behandelt leere Social-Links automatisch als noch nicht verfügbar.

### Domain später ändern

Wenn die endgültige Domain feststeht, hier ändern:

```js
baseUrl: "https://eure-domain.de",
```

Danach unbedingt auch **Kapitel 11: Meta-/Sharing-Daten synchronisieren** beachten.

---

## 4. Startseite ändern

In `content.js` unter:

```js
home: {
```

lassen sich unter anderem ändern:

- kleine Zeile über dem Logo
- Tape-Text
- Einleitung
- Buttons
- EP-/Release-Hinweise
- laufender Textstreifen
- Karten-/Collage-Texte

Die nächste Show auf der Startseite wird automatisch aus `shows` übernommen.

### Release-Fläche auf der Startseite

Die große Release-Fläche ist automatisiert:

- solange `music.releases` leer ist → Recording-/Pre-Release-Zustand
- sobald mindestens ein Release eingetragen ist → Cover eines relevanten Releases
- gibt es kommende Releases → automatisch der nächste kommende Release
- gibt es keinen kommenden Release → automatisch der zuletzt veröffentlichte
- Release in der Zukunft → Coming-/Pre-Release-Zustand
- Release-Datum erreicht → Out-Now-Zustand
- der passende Link wird automatisch gewählt

Normalerweise reicht es deshalb später, einen neuen Release unter `music.releases` einzutragen.

---

## 5. Bandtexte ändern

In `content.js` unter:

```js
band: {
```

liegen Bandbeschreibung, große Zitate und Story-Blöcke.

Beispiel:

```js
{
  title: "THE BEGINNING",
  text: "Hier steht die Geschichte ...",
  boldStart: "Dieser Anfang wird fett dargestellt."
},
```

`boldStart` ist optional.

---

## 6. Mitglieder ändern

In `content.js` unter:

```js
members: [
```

Ein Mitglied sieht ungefähr so aus:

```js
{
  id: "joost",
  name: "Joost",
  role: "Lead Guitar",
  image: "assets/joost.webp",
  bio: "Beschreibung ...",
  facts: [
    ["Weapon of choice", "6 strings. 7 if necessary."],
    ["Job", "Leads / demos / making it heavier"]
  ]
},
```

### Foto austauschen

Neue Bilddatei nach `assets/` kopieren und den Dateinamen im Feld `image` ändern.

Beispiel:

```js
image: "assets/joost-neu.webp",
```

Wenn eine neue Bilddatei **denselben Dateinamen** wie die alte bekommt, muss `content.js` nicht geändert werden.

Empfehlung: Fotos möglichst als `.webp` speichern.

---

## 7. Live-Termine pflegen

In `content.js` unter:

```js
shows: [
```

Beispiel:

```js
{
  date: "2027-06-12",
  time: "20:00",
  title: "Festivalname",
  venue: "Venue",
  city: "Stadt",
  ticket: "https://tickets.example.com",
  info: "",
  },
```

Datum immer als:

```text
YYYY-MM-DD
```

Wenn es keinen Ticketlink gibt:

```js
ticket: ""
```

Optional kann stattdessen ein Veranstaltungs-/Infoweblink gesetzt werden:

```js
info: "https://..."
```

Wenn weder `ticket` noch `info` gesetzt ist, wird kein unnötiger Button angezeigt.

### Uhrzeit (optional)

Wenn eine Spiel- oder Startzeit bekannt ist, wird sie **einheitlich im 24-Stunden-Format `HH:MM`** eingetragen:

```js
time: "20:00",
```

Bitte in dieses Feld nur die Uhrzeit eintragen, ohne Zusätze wie `Doors`, `Beginn`, `Festival ab ...`, `Uhr` oder `PM`. So bleibt die Angabe universell für Clubshows, Festivals und feste Slots verwendbar. Zusätzliche Informationen gehören bei Bedarf in den Veranstaltungsnamen, einen Info-Link oder eine separate Textangabe.

Wenn keine verlässliche Uhrzeit feststeht, einfach leer lassen oder die Zeile weglassen.

### Show-Status (optional)

Mit `status` kann ein Konzert klar gekennzeichnet werden:

```js
status: "soldout"
status: "cancelled"
status: "postponed"
```

Das wird auf der Live-Seite als **SOLD OUT**, **CANCELLED** oder **POSTPONED** angezeigt.

Wichtig:

- Ein normal verfügbarer Ticketverkauf wird nicht zusätzlich als Status angezeigt. Dafür gibt es den **GET TICKETS**-Button.
- Bei `soldout`, `cancelled` oder `postponed` wird der Ticketbutton nicht mehr angezeigt.
- Ein `info`-Link kann bei solchen Fällen weiterhin genutzt werden, z. B. für eine Veranstaltermeldung.
- Abgesagte oder verschobene Shows werden nicht als **NEXT SHOW** auf der Startseite verwendet.

Die Website sortiert automatisch:

- zukünftige Shows → `UPCOMING`
- vergangene Shows → `PAST DAMAGE`
- nächste Show → automatisch auf der Startseite

### Vollständige Live-Historie / `SHOW MORE DAMAGE`

Vergangene Shows bitte **nicht aus `content.js` löschen**. Die komplette Live-Historie soll erhalten bleiben, damit Fans, Veranstalter und Booker auch später nachvollziehen können, wann und wo CAOTIX bereits gespielt hat.

Die Darstellung auf der Live-Seite begrenzt sich trotzdem automatisch:

- Zunächst werden immer die **30 zuletzt vergangenen Shows** angezeigt.
- Bei **30 oder weniger** vergangenen Shows erscheint kein zusätzlicher Button.
- Ab der **31. vergangenen Show** erscheint unter `PAST DAMAGE` der Button **SHOW MORE DAMAGE**.
- Jeder Klick lädt **maximal 20 weitere**, jeweils ältere Shows nach.
- Solange noch ältere Shows vorhanden sind, bleibt der Button sichtbar.
- Sobald die gesamte gespeicherte Live-Historie eingeblendet wurde, verschwindet der Button.
- Es gibt **keine Jahresgrenze**: Auch viele Jahre alte Shows bleiben im Datensatz und können über den Button erreicht werden.

Der Buttontext kann bei Bedarf in `content.js` unter `livePage.showMoreText` geändert werden. Die Mengen `30` (initial) und `20` (pro Klick) sind bewusst Teil der Darstellungslogik in `shows.js` und müssen für die normale Showpflege nicht angefasst werden.

Die Jahreszahl auf der Website verwendet teilweise den Platzhalter `{YEAR}` und aktualisiert sich automatisch. Diesen Platzhalter nicht durch eine feste Jahreszahl ersetzen, wenn die automatische Aktualisierung erhalten bleiben soll.

---

## 8. Releases / Musik eintragen

In `content.js` unter:

```js
music: {
```

bzw.

```js
releases: [
```

Solange noch kein Release veröffentlicht oder angekündigt werden soll, bleibt die Liste einfach leer:

```js
releases: [
]
```

Dann zeigt die Website automatisch den aktuellen Recording-Hinweis.

### Beispiel für eine Single

```js
{
  type: "SINGLE",
  title: "Songtitel",
  date: "2027-01-30",
  cover: "assets/single-cover.webp",
  description: "Kurzer Text zum Release.",
  tracks: ["Songtitel"],
  links: {
    spotify: "https://...",
    youtube: "https://...",
    apple: "https://..."
  }
},
```

Bei einer EP einfach mehrere Titel unter `tracks` eintragen.

Das Cover muss vorher in `assets/` liegen.

### Noch nicht vorhandene Links

Nicht raten oder Dummy-Links eintragen. Das jeweilige Feld einfach leer lassen bzw. erst ergänzen, sobald der echte Link existiert.

---

## 9. Merch-Seite pflegen

Die Website hat aktuell **keinen Online-Shop und keine Online-Bestellfunktion**.

Die Merch-Seite informiert ausschließlich darüber, dass CAOTIX-Merch bei Konzerten am Merchstand erhältlich ist.

Die Texte stehen in `content.js` unter:

```js
merchPage: {
```

Wichtig ist insbesondere:

```js
showNotice: {
  label: "NO ONLINE SHOP.",
  headline: "MERCH ONLY AT THE SHOWS.",
  text: "...",
  note: "...",
  button: "LIVE-TERMINE"
}
```

Hier können die sichtbaren Texte jederzeit geändert werden.

Der Button führt zur Live-Seite.

### Wenn später doch Online-Merch verkauft werden soll

Nicht einfach Preise oder Bestelltexte in `content.js` ergänzen. Die aktuelle Website-Version enthält absichtlich **keine Bestelllogik mehr**.

Ein späterer Onlineverkauf sollte als eigene Änderung umgesetzt werden, sobald organisatorische und rechtliche Fragen geklärt sind.

---

## 10. Kontakt, Booking und Press Kit

Die zentrale Mailadresse steht unter:

```js
site: {
  email: "...",
```

Kontakt-/Booking-Texte stehen unter:

```js
contact: {
```

### Vorgefertigte Kontakt-Mail

Betreff und Text können geändert werden:

```js
mailSubject: "CAOTIX Anfrage",
mailBody: "Hallo CAOTIX,\n\nich habe folgende Anfrage:\n\n\n\nMit freundlichen Grüßen\n",
```

`\n` erzeugt einen Zeilenumbruch.

Die Zieladresse wird automatisch aus `site.email` übernommen.

### Press Kit, Rider und Produktionsmaterial

Press Kit, Bandfotos, Technical Rider und Stage Plot sind bewusst **nicht öffentlich verlinkt**.

Die sichtbare Liste wird zentral gepflegt:

```js
materialsLabel: "PRESS / PRODUCTION:",
materialsText: "Weiteres Material schicken wir bei passenden Anfragen direkt per Mail.",
materials: ["Press Kit", "Bandfotos", "Technical Rider", "Stage Plot"],
```

Die Dateien selbst bitte **nicht einfach in einen öffentlich zugänglichen Website-Ordner legen**. Sie werden bei passenden Anfragen separat verschickt.

---

## 11. Meta-, SEO- und Sharing-Daten

Seitentitel, Beschreibungen, Canonical-Pfade und zentrale Sharing-Angaben stehen in `content.js` unter:

```js
meta: {
```

und:

```js
site: {
  baseUrl: "https://...",
  socialImage: "assets/caotix-social.jpg",
  socialImageAlt: "..."
}
```

### Wann muss hier etwas geändert werden?

Zum Beispiel wenn:

- sich die endgültige Domain ändert,
- eine Seitenbeschreibung angepasst wird,
- ein anderes Social-Preview-Bild verwendet wird.

Die Website übernimmt diese Angaben im Browser automatisch. Für WhatsApp, Discord, Facebook und andere Dienste müssen aber zusätzlich die **statischen HTML-Metatags** synchronisiert werden.

Dafür liegt im Website-Ordner:

```text
sync-meta.cmd
```

Unter Windows:

1. `content.js` speichern.
2. `sync-meta.cmd` doppelklicken.
3. Fenster abwarten, bis die Synchronisierung abgeschlossen ist.
4. Danach die geänderten HTML-Dateien zusammen mit `content.js` hochladen.

Voraussetzung dafür ist eine installierte Node.js-Version. Wenn Node.js nicht vorhanden ist, kann die Synchronisierung auch von der Person durchgeführt werden, die den Website-Upload betreut.

**Für normale Änderungen an Shows, Bandtexten, Mitgliedern oder Kontakttexten ist `sync-meta.cmd` nicht nötig.**

---

## 12. Bilder austauschen

Fast alle normalen Bilder liegen in:

```text
assets/
```

Empfohlen:

- Fotos möglichst als `.webp`
- transparente Grafiken bei Bedarf als `.png` oder `.webp`
- Dateinamen klein und ohne Sonderzeichen
- Bilder vor dem Upload sinnvoll verkleinern/komprimieren

### Gruppenfoto / Mitgliederbilder

Die entsprechenden Dateipfade stehen in `content.js`.

### Social-Media-Vorschaubild

Das Vorschaubild ist unter `site.socialImage` eingetragen.

Wenn das Bild ersetzt wird und **derselbe Dateiname** erhalten bleibt, muss `content.js` nicht geändert werden.

---

## 13. Rechtstexte

Die Dateien:

```text
impressum.html
datenschutz.html
```

sollten nicht beiläufig verändert werden.

Wenn sich später insbesondere folgende Dinge ändern, sollte geprüft werden, ob die Rechtstexte angepasst werden müssen:

- Hostinganbieter
- Domain / verantwortlicher Betreiber
- zusätzliche Formulare
- Analytics / Tracking
- eingebettete Drittanbieter-Dienste
- Newsletter
- Online-Shop / Online-Bestellungen

Vor dem endgültigen öffentlichen Launch sollten Impressum und Datenschutzerklärung einmal professionell geprüft werden.

---


### Kampagnenstruktur (Pre-Launch)

Die EP-Kampagne ist bewusst modularisiert. Gemeinsame Easter-Egg-Logik, Observer, Styles und Kampagnenassets liegen unter `easter-eggs/`. Die geheimen URLs `n8k2p/` und `q4m7v/` bleiben am Website-Root. `n8k2p/` ist das dauerhafte CTX-Minispiel; nur der darin per Plugin ergänzte Boxsack gehört zur EP-Kampagne. Normale Seiten laden die Kampagne ausschließlich über den klar markierten **CAOTIX EP EASTER-EGG CAMPAIGN LOADER** am Ende von `script.js`.

Nach Kampagnenende genügt daher im Kern:

1. Den markierten Kampagnen-Loader am Ende von `script.js` entfernen.
2. In `n8k2p/index.html` nur die markierte Script-Zeile `../easter-eggs/the-fight.js` entfernen; das CTX-Spiel selbst bleibt bestehen.
3. Die Ordner `easter-eggs/` und `q4m7v/` löschen.
3. `merch_preview.html` löschen, wenn die interne Vorschau nicht mehr gebraucht wird.
4. Optional am `SPREAD`-Span in `merch.html` die funktionslosen Klassen/Attribute `decay-grow-trigger` und `data-decay-grow-trigger` entfernen.

## 14. Versteckte Website-Funktionen / Easter-Egg-Lösungen

> **Nur intern:** Dieser Abschnitt ist absichtlich ein vollständiger Spickzettel. Die `README.md` deshalb nicht öffentlich hochladen oder verlinken.

Die sechs aktuellen Observer-Funde sind **keine neutralen technischen IDs mehr**, sondern tragen direkt die Titel der sechs Songs der kommenden EP. Das ist bewusst so: Wer den Client-Code tatsächlich untersucht oder die Base64-Hülle der Skripte dekodiert, darf diese zusätzliche Information finden.

Die aktuelle Zuordnung lautet:

```text
From Above
Drowned
Demons Inside
Fear to Die
The Fight
Decay or Grow
```

**`Fear to Die` ist zugleich der Titel der kommenden EP.** Das zugehörige Easter Egg ist deshalb bewusst größer angelegt: Der versteckte Raum teasert nicht nur den Song, sondern auch das spätere Veröffentlichungsdatum und mit der pinken Sonnenfinsternis bereits das zentrale Covermotiv der EP an.

Der Fortschritt wird nur lokal im Browser über `sessionStorage` gespeichert und nach Ende der Browser-Session wieder verworfen.

### 14.1 Observer-System

Das Observer-System kennt aktuell genau diese sechs Song-Funde:

```text
From Above
Drowned
Demons Inside
Fear to Die
The Fight
Decay or Grow
```

Die Songtitel werden Besuchern durch das Observer-Overlay selbst nicht angezeigt. Sie stehen jedoch absichtlich im Client-Code und können von technisch neugierigen Besuchern entdeckt werden.

Je nach Anzahl der entdeckten Observer-Funde erscheinen zusätzliche Vollbildmeldungen:

- **2 Funde:** `YOU'RE CURIOUS...`
- **4 Funde:** `WE NOTICED...`
- **6 Funde:** `YOU WEREN'T SUPPOSED TO FIND THEM ALL...`

Gespeichert wird im Browser unter:

```text
caotix_observer_found_v3
caotix_observer_seen_v3
```

Die Versionsnummer wurde mit dem sechsten Observer-Fund `Decay or Grow` auf `v3` erhöht. So können Testdaten aus Builds mit nur fünf Funden die finale Sechser-Zählung nicht verfälschen.

Zum Zurücksetzen für Tests kann in den Browser-DevTools unter **Application / Storage / Session Storage** der Eintrag für die Seite gelöscht werden. Alternativ genügt normalerweise eine neue Browser-Session.

### 14.2 `Fear to Die` – geheimer Fernseher / `q4m7v`

**Direkter Pfad:**

```text
q4m7v/index.html
```

**Normaler Zugang:** Im Footer ist das Copyright-Zeichen `©` auf den regulären Seiten als unsichtbarer Klickbereich vorbereitet. Ein Klick darauf öffnet den versteckten Raum.

Beim Betreten von `q4m7v` wird nach kurzer Verzögerung automatisch der Observer-Fund **`Fear to Die`** registriert.

Dieses Easter Egg hat bewusst eine Doppelrolle:

- Hinweis auf den Song **Fear to Die**,
- Hinweis auf den EP-Titel **Fear to Die**,
- Teaser für das spätere Veröffentlichungsdatum,
- visueller Vorab-Teaser des EP-Covers über die **pinke Sonnenfinsternis** im Raum.

Die Seite zeigt den dunklen Raum mit Röhrenfernseher (`easter-eggs/assets/easteregg-fear-to-die-room.webp`). Im Motiv selbst ist `FEAR TO DIE` bereits als weiterer Hinweis versteckt. Der Text auf dem Fernseher wird zentral über `content.js` gepflegt:

```js
aux: {
  mode: "text",
  displayText: "XX.XX.XXXX",
  targetDate: "2027-01-01T00:00:00+01:00"
}
```

#### Normaler Textmodus

```js
mode: "text"
```

Dann wird `displayText` angezeigt.

#### Countdown-Modus

```js
mode: "countdown"
```

Dann zählt die Anzeige bis `targetDate` herunter. Das Format ist ungefähr:

```text
12D 04:33:09
```

Nach Erreichen des Zielzeitpunkts steht dort:

```text
NOW
```

**Wichtig:** Ein in `content.js` eingetragenes geheimes Datum ist technisch nicht wirklich geheim. Besucher mit Zugriff auf den Quellcode können `targetDate` auslesen. Das ist hier akzeptiert: Wer so tief gräbt, darf den Hinweis finden.

### 14.3 Geheimes Minispiel / `n8k2p`

**Direkter Pfad:**

```text
n8k2p/index.html
```

Es gibt zwei normale Wege hinein:

1. **Tastatur:** Auf einer normalen Seite einfach die Buchstaben `ctx` hintereinander tippen. Nicht in ein Eingabefeld klicken; die drei Buchstaben müssen als normale Tastatureingabe auf der Seite ankommen.
2. **Startseiten-Logo:** Auf der Startseite die Buchstaben des großen CAOTIX-Logos in der Reihenfolge **C → T → X** anklicken/antippen. Zwischen den Schritten dürfen höchstens ungefähr fünf Sekunden liegen.

Im Minispiel bewegt man sich mit:

- Pfeiltasten oder `WASD`
- auf Touchgeräten über das eingeblendete Steuerkreuz

Interagieren geht mit:

- `Enter`
- `Space`
- `E`
- `X`
- bzw. dem A-Button auf Touchgeräten

#### Die sechs normalen Signale

Für den regulären Abschluss müssen sechs Gegenstände gefunden und angesprochen werden:

1. **MONAS MIKRO**  
   `DAS MIKRO STEHT BEREIT. HIER HAT WOHL JEMAND ALLES IM GRIFF.`

2. **JOOSTS GITARRE**  
   `NOCH EIN BREAKDOWN? JA. NOCH EIN BREAKDOWN.`

3. **JANNICKS SETLIST**  
   `IRGENDWO HIER STEHT BESTIMMT, WIE DER MITTELTEIL NOCHMAL GING.`

4. **ANDIS PEDALBOARD**  
   `EIN PEDAL. DAMIT KANN MAN PROBLEMLOS EINEN GANZEN ABEND VERBRINGEN.`

5. **THEOS DRUMSTICKS**  
   `DIE DRUMSTICKS SEHEN AUS, ALS HAETTEN SIE HEUTE SCHON GENUG MITGEMACHT.`

6. **LEERE TUETE**  
   `DIE SALAMISTICKS SIND SCHON WIEDER ALLE.`

Nach allen sechs Signalen erscheint:

```text
SIGNAL COMPLETE
THE CHAOS IS COMING.
PRESS ANY KEY
```

Danach führt eine beliebige Aktion wieder aus dem Spiel heraus.

#### `The Fight` – Bonus-Gegenstand BOXSACK

Zusätzlich existiert ein Bonus-Gegenstand:

```text
BOXSACK
DER KAMPF BEGINNT GERADE ERST.
```

Der Boxsack zählt **nicht** zu den sechs normalen Signalen. Er wird als separates Kampagnen-Plugin aus `easter-eggs/the-fight.js` in das permanente CTX-Spiel eingesetzt. Beim Schließen seines Dialogs wird der Observer-Fund **`The Fight`** registriert. Nach der Kampagne reicht es, die markierte Plugin-Scriptzeile in `n8k2p/index.html` zu entfernen; das Spiel bleibt unverändert bestehen.

### 14.4 `From Above` – oberer Seitenrand

Auf normalen Seiten gibt es ein verstecktes „weiter nach oben“-Easter-Egg.

Voraussetzung: Die Seite muss ganz oben stehen.

Dann innerhalb kurzer Zeit **dreimal weiter nach oben drücken/scrollen**:

- Mausrad: am oberen Rand dreimal nach oben scrollen,
- Tastatur: dreimal `ArrowUp`,
- Touch: am oberen Rand dreimal deutlich nach unten ziehen, als würde man über den Seitenanfang hinaus scrollen.

Die einzelnen Versuche müssen ungefähr innerhalb von 2,4 Sekunden erfolgen, sonst wird die Sequenz zurückgesetzt.

Dann erscheint das Asset:

```text
easter-eggs/assets/easteregg-from-above.webp
```

mit der Botschaft:

```text
IT WAS ALWAYS ABOVE YOU.
```

Dabei wird Observer-Fund **`From Above`** registriert. Die Mechanik selbst – über den oberen Rand hinauszugehen und etwas von oben erscheinen zu lassen – ist Teil des Song-Hinweises.

### 14.5 `Drowned` – unterer Seitenrand

Das Gegenstück liegt am unteren Seitenrand.

Voraussetzung: Die Seite muss vollständig nach unten gescrollt sein.

Dann innerhalb kurzer Zeit **dreimal weiter nach unten drücken/scrollen**:

- Mausrad: am unteren Rand dreimal nach unten scrollen,
- Tastatur: dreimal `ArrowDown`,
- Touch: am unteren Rand dreimal deutlich nach oben ziehen, als würde man über das Seitenende hinaus scrollen.

Auch hier wird die Folge nach ungefähr 2,4 Sekunden Inaktivität zurückgesetzt.

Die ausgelöste Vollbildsequenz inszeniert das Absinken/Ertrinken unter Wasser und enthält die Botschaft:

```text
THE WATER KEEPS WHAT IT TAKES.
```

Dabei wird Observer-Fund **`Drowned`** registriert.

### 14.6 `Demons Inside` – Bandfoto lange halten

Auf der Band-Seite reagiert das große Element `.band-photo` auf langes Halten/Hovern.

- Desktop: Maus ungefähr **3,8 Sekunden** ohne Verlassen auf dem Bandfoto halten.
- Touch: Finger ungefähr **3,8 Sekunden** ruhig auf dem Bandfoto halten; Bewegen oder Loslassen bricht den Trigger ab.

Danach glitcht das Foto und blendet das versteckte Bild ein:

```text
easter-eggs/assets/easteregg-demons-inside.webp
```

mit:

```text
THEY WERE INSIDE ALL ALONG.
```

Dabei wird Observer-Fund **`Demons Inside`** registriert. Das Motiv ist absichtlich als „etwas war die ganze Zeit im Bild / in ihnen verborgen“ aufgebaut.

### 14.7 Übersicht: Song ↔ Easter Egg ↔ Observer-Fund

| Observer-Key / Song | Lösung / Bedeutung |
|---|---|
| `Fear to Die` | versteckten Fernseher unter `q4m7v/` betreten; zugleich EP-Titel, Datums- und Cover-Teaser |
| `From Above` | am oberen Seitenrand dreimal weiter nach oben drücken/scrollen |
| `Drowned` | am unteren Seitenrand dreimal weiter nach unten drücken/scrollen; Unterwasser-/Ertrinkungssequenz |
| `Demons Inside` | Bandfoto ca. 3,8 Sekunden halten/hovern |
| `The Fight` | im `n8k2p`-Minispiel den Bonus-Gegenstand **BOXSACK** untersuchen |
| `Decay or Grow` | auf der Merch-Seite das Wort **SPREAD** wiederholt anklicken; alle 5 Klicks wächst ein kumulatives Netzwerk aus kräftigen schwarzen Rissen mit pinkem Schimmer und daraus austreibenden Wurzeln weiter; nach 3 Sekunden ohne Klick verfällt es wieder um eine Stufe |

Der normale Minispiel-Zugang über `ctx` bzw. **C → T → X** ist selbst **kein** Observer-Fund; erst der Boxsack darin zählt als `The Fight`.

### 14.8 `Decay or Grow` – Merch / SPREAD

Auf der Merch-Seite ist das große Wort **`SPREAD`** der unsichtbare Trigger. Im normalen Zustand ist keinerlei Easter-Egg-Grafik sichtbar.

Die Mechanik besteht aus **5 Wachstumsstufen mit jeweils 5 Klicks**:

- ab der ersten erreichten Wachstumsstufe gibt jeder weitere Klick auf `SPREAD` ein kurzes, dezentes Puls-/Leuchtsignal,
- nach jeweils 5 Klicks wächst dieselbe Riss-/Wurzelstruktur sichtbar weiter; frühere Äste bleiben exakt bestehen,
- insgesamt sind damit 25 Klicks für Stufe 5 nötig,
- nach **3 Sekunden ohne weiteren Klick** fällt der Fortschritt um eine komplette Wachstumsstufe zurück,
- danach verfällt die Struktur bei weiterer Inaktivität alle 3 Sekunden um eine weitere Stufe bis zurück auf 0,
- Teilklicks innerhalb einer noch nicht abgeschlossenen Stufe gehen beim Verfall verloren.

Beim Erreichen von Stufe 5 erscheint kurz:

```text
DECAY OR GROW
```

Danach wird der Observer-Fund **`Decay or Grow`** registriert. Die Mechanik übersetzt den Songtitel direkt: aktive Interaktion lässt die Struktur wachsen, Inaktivität lässt sie verfallen.

Mit diesem sechsten Fund liegt die finale Observer-Nachricht nun bei **6 Funden**. Die Session-Storage-Version wurde deshalb auf `v3` erhöht.

### 14.9 Interne Dateien und Assets nicht versehentlich löschen

Zu den versteckten Funktionen gehören insbesondere:

```text
n8k2p/
q4m7v/
easter-eggs/observer.js
script.js
easter-eggs/assets/easteregg-from-above.webp
easter-eggs/assets/easteregg-demons-inside.webp
easter-eggs/assets/easteregg-fear-to-die-room.webp
easter-eggs/assets/easteregg-ctx-emboss-mask.png
```

Diese Pfade und Dateien nicht umbenennen oder verschieben, solange die zugehörige Logik nicht ebenfalls angepasst wird.

Die versteckten Seiten besitzen `noindex,nofollow,noarchive` und stehen nicht in der Sitemap. Das macht sie für Suchmaschinen unattraktiv, aber **nicht geheim**: Wer die URL kennt oder den Client-Code untersucht, kann sie trotzdem direkt öffnen.

---

## 15. Sicherheitskopien / empfohlener Ablauf bei Änderungen

Für Leute ohne Coding-Erfahrung ist dieser Ablauf am sichersten:

1. komplette aktuelle Website-ZIP als Backup behalten,
2. `content.js` kopieren, z. B. als `content_backup.js`,
3. gewünschte Änderung in `content.js` vornehmen,
4. lokal im Browser testen,
5. nur wenn alles funktioniert: geänderte Datei hochladen,
6. bei Domain-/SEO-Änderungen zusätzlich `sync-meta.cmd` ausführen und die geänderten HTML-Dateien hochladen.

### Typische Änderungen und benötigte Datei

| Änderung | Datei |
|---|---|
| neuer Gig | `content.js` |
| Ticketlink ergänzen | `content.js` |
| Bandtext ändern | `content.js` |
| Mitgliedsbio ändern | `content.js` |
| Social-Link ergänzen | `content.js` |
| Kontakt-Mail ändern | `content.js` |
| Merch-Hinweis ändern | `content.js` |
| Release eintragen | `content.js` + Cover in `assets/` |
| Mitgliedsfoto ändern | neues Bild in `assets/` + ggf. `content.js` |
| Domain ändern | `content.js` + Meta-Synchronisierung |
| Design ändern | **nicht normale Pflege – vorher Backup machen** |

---

## 16. Was normale Redakteure NICHT anfassen müssen

Für normale Bandpflege bitte möglichst nicht bearbeiten:

```text
style.css
script.js
easter-eggs/observer.js
content-render.js
shows.js
```

und keine unbekannten Unterordner/Assets löschen.

In 95 % der Fälle reicht:

> **`content.js` öffnen → Text/Datum/Link ändern → speichern → testen → hochladen.**

Das ist bewusst so gebaut.


Decay or Grow nutzt jetzt fünf eigenständige transparente Blitz-/Stein-Overlays, die im REA-Bereich von SPREAD verankert sind. Früheste Stufe nur mit minimalem Bröckeln; spätere Stufen lassen SPREAD zunehmend steinartig aufbrechen.


### Decay or Grow v17 visual implementation
The lightning origin is bound directly to the **R** in `SPREAD`. Five same-canvas transparent PNG stages expand radially in all directions without a filled pink field. The R fractures first, then E/A and neighbouring letters; local glass-like shards appear progressively around the R.


### Decay or Grow – Referenz-Look v19
Die Blitzgrafiken wurden auf einen sparsamen, linienartigen Look umgestellt: dünne magenta/weiße Blitzäste, viel Negativfläche, kein flächiger Pink-Nebel. Alle fünf Stufen teilen denselben 1800×1100-Canvas und denselben Ursprung im R von SPREAD; nur die Reichweite/Verzweigung nimmt pro Stufe zu. Letter-Damage und Glassplitter bleiben getrennte Ebenen.
