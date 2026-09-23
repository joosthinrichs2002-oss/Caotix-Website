/*
 * ================================================================
 * CAOTIX WEBSITE – INHALTE
 * ================================================================
 * DIESE DATEI ist die wichtigste Datei für die laufende Pflege.
 * Hier können Texte, Termine, Mitglieder, Releases, Merch, Kontakt-
 * und Social-Links geändert werden, ohne das Layout anzufassen.
 *
 * Wichtig:
 * - Texte stehen immer zwischen Anführungszeichen.
 * - Nach fast jeder Zeile steht ein Komma.
 * - Bilder liegen im Ordner "assets".
 * - Datumsformat: YYYY-MM-DD (z. B. 2027-03-06).
 * - Ausführliche Anleitung: README.md
 */

window.CAOTIX_CONTENT = {
  site: {
    email: "caotixband@gmail.com",
    instagram: "https://www.instagram.com/caotix.band/",
    tiktok: "https://www.tiktok.com/@caotix.band",
    youtube: "",      // leer lassen, solange der Kanal noch nicht verlinkt werden soll
    spotify: "",      // leer lassen, solange Spotify noch nicht verlinkt werden soll
    footerText: "CAOTIX – Alternative Metal from Meppen",
    baseUrl: "https://caotix.de",
    socialImage: "assets/caotix-social.jpg",
    socialImageAlt: "CAOTIX – Alternative Metal aus Meppen"
  },

  // Seitentitel, Beschreibungen und Sharing-Daten zentral pflegen.
  // Die Website übernimmt diese Angaben im Browser automatisch.
  // Für Social-Media-Crawler können die statischen HTML-Metadaten zusätzlich
  // mit tools/sync-meta.js synchronisiert werden (siehe README).
  meta: {
    siteName: "CAOTIX",
    locale: "de_DE",
    pages: {
      index: {
        path: "/",
        title: "CAOTIX – Alternative Metal aus Meppen | Offizielle Website",
        description: "CAOTIX ist eine Alternative-Metal-Band aus Meppen. Druckvolle Riffs, melodische Hooks und rohe Live-Energie – Musik, Liveshows und News auf der offiziellen Website."
      },
      band: {
        path: "/band.html",
        title: "Band – CAOTIX | Alternative Metal aus Meppen",
        description: "Lerne CAOTIX kennen: Alternative Metal aus Meppen, fünf Musiker, druckvolle Riffs, melodische Hooks und rohe Live-Energie."
      },
      music: {
        path: "/music.html",
        title: "Musik – CAOTIX | Songs & Debüt-EP",
        description: "Musik von CAOTIX aus Meppen: Songs, Releases, Tracklists und Streaming-Links auf der offiziellen Website."
      },
      members: {
        path: "/members.html",
        title: "Bandmitglieder – CAOTIX | Die fünf hinter dem Lärm",
        description: "Mona, Joost, Jannick, Andreas und Theo: Lerne die fünf Mitglieder von CAOTIX und ihre Rollen in der Alternative-Metal-Band aus Meppen kennen."
      },
      live: {
        path: "/live.html",
        title: "CAOTIX Live | Konzerte & Termine",
        description: "Alle kommenden Konzerte und Live-Termine von CAOTIX. Finde heraus, wann die Alternative-Metal-Band aus Meppen als Nächstes auf der Bühne steht."
      },
      merch: {
        path: "/merch.html",
        title: "CAOTIX Merch | Offizieller Band-Merch",
        description: "CAOTIX Merch gibt's direkt bei unseren Shows am Merchstand. Kein Onlineshop – aktuelle Konzerttermine findest du auf unserer Live-Seite."
      },
      contact: {
        path: "/contact.html",
        title: "Kontakt & Booking – CAOTIX",
        description: "Booking, Presse und Kontakt für CAOTIX. Anfragen für Shows, Festivals, Support-Slots und Presse direkt an die Band."
      },
      impressum: {
        path: "/impressum.html",
        title: "Impressum – CAOTIX",
        description: "Impressum der offiziellen Website von CAOTIX."
      },
      datenschutz: {
        path: "/datenschutz.html",
        title: "Datenschutz – CAOTIX",
        description: "Datenschutzerklärung der offiziellen Website von CAOTIX."
      }
    }
  },

  home: {
    kicker: "Meppen // Alternative Metal // {YEAR}",
    tape: "Noise from the Northwest.",
    intro: "Fünf Leute, zu viel Lautstärke und eine Debüt-EP in Arbeit. CAOTIX klingt nicht sauber, nicht brav und schon gar nicht nach Hintergrundmusik.",
    primaryButton: { label: "See us live", href: "live.html" },
    secondaryButton: { label: "First EP", href: "music.html" },

    // Große Release-Fläche rechts auf der Startseite.
    // Solange music.releases leer ist, bleiben X + Pre-Release-Sticker aktiv.
    // Sobald Releases eingetragen sind: nächster kommender Release, sonst zuletzt veröffentlichter Release.
    releaseHero: {
      enabled: true,
      preReleaseImage: "assets/xmark.webp",
      preReleaseAlt: "CAOTIX X",
      preReleaseSticker: "DEBUT EP\nIN THE WORKS",
      releasedSticker: "OUT NOW\n{TITLE}",
      upcomingSticker: "COMING {DATE}\n{TITLE}",
      upcomingUndatedSticker: "COMING SOON\n{TITLE}",
      releasedButton: "Listen now",
      upcomingButton: "Release details",
      fallbackButton: "Music",
      fallbackHref: "music.html",
      preferredLinks: ["presave", "spotify", "youtube", "apple"]
    },
    sticker: "DEBUT EP\nIN THE WORKS",
    chaosStrip: ["CAOTIX", "LOUD ENOUGH TO LEAVE A MARK", "MEPPEN MADE", "SPREAD THE CHAOS", "LIVE {YEAR}"],
    sectionTape: "Enter the mess.",
    sectionHeadline: "No clean edges.",
    sectionHeadlinePink: "No filler.",
    cards: {
      band: { kicker: "WHO THE FUCK IS CAOTIX?", title: "THE BAND", text: "Five people. Too much volume." },
      live: { kicker: "YOU'LL HEAR US FIRST", title: "LIVE {YEAR}", text: "Stages. Sweat. More noise." },
      music: { kicker: "CURRENTLY RECORDING", title: "FIRST RECORD.\nNO PRESSURE.", text: "Debut EP in progress. You'll get it when it's ready." },
      members: { kicker: "THE FIVE", title: "MEMBERS", text: "Vocals. Guitars. Bass. Drums." },
      merch: { sticker: "MERCH AT THE SHOWS", title: "SPREAD\nTHE ", titlePink: "CHAOS.", text: "No online shop. Find us at the merch stand." },
      contact: { kicker: "BOOKING / PRESS / CONTACT", title: "BOOK US.\nPRESS US.\n", titlePink: "WRITE US.", text: "Shows, press, production and everything in between." }
    }
  },

  band: {
    heroTape: "WHO THE FUCK IS CAOTIX?",
    tagline: "Meppen made. Stage proven.",
    introLabel: "NO CLEAN EDGES.",
    introParagraphs: [
      "CAOTIX steht für modernen Alternative Metal aus Meppen – druckvolle Riffs, melodische Hooks und rohe Live-Energie ohne unnötigen Hochglanz.",
      "Der Sound ist laut, direkt und irgendwo zwischen schwer, eingängig und komplett außer Kontrolle. Aktuell arbeitet die Band an ihrer ersten EP."
    ],
    introQuote: "FIVE PEOPLE.\nTOO MUCH VOLUME.",
    storyTape: "HOW WE GOT HERE",
    storyHeadline: "NO MASTERPLAN.",
    storyHeadlinePink: "JUST FIVE PEOPLE.",
    stories: [
      {
        title: "THE BEGINNING",
        text: "CAOTIX ist Ende 2025 eher zufällig entstanden. Mona und Joost kannten sich schon aus einer früheren Band. Als die auseinandergegangen ist, war ziemlich schnell klar, dass beide trotzdem weitermachen wollen. Also mussten neue Leute her.",
        boldStart: "CAOTIX ist Ende 2025 eher zufällig entstanden."
      },
      {
        title: "THE LINEUP",
        text: "Die Besetzung hat sich nach und nach ergeben. Theo kam über Mona dazu, weil sie ihn kannte und wusste, dass er musikalisch was draufhat. Bei Jannick war es etwas zufälliger: Ein Kumpel von Joost meinte irgendwann, dass jemand aus seiner Klasse Gitarre spielt und vielleicht Bock auf eine Band hätte. Also ging eine Instagram-Nachricht raus – und kurze Zeit später stand Jannick mit im Proberaum. Für den Bass haben wir schließlich selbst auf Instagram gesucht. Auf den Aufruf hat sich Andreas gemeldet und damit war die Runde komplett."
      },
      {
        title: "THE MUSIC",
        text: "Eigene Songs waren eigentlich von Anfang an das Ziel. Für die ersten Proben und Shows haben wir trotzdem erstmal mit Covers angefangen. Nach und nach sind die dann rausgeflogen und durch eigene Songs ersetzt worden. Einen festen Stil haben wir nie beschlossen. Wenn wir zusammen schreiben, landen wir aber ziemlich zuverlässig irgendwo im Alternative Metal.",
        boldStart: "Eigene Songs waren eigentlich von Anfang an das Ziel."
      },
      {
        title: "WHAT KEEPS IT TOGETHER",
        text: "Die Musik natürlich. Aber mindestens genauso wichtig sind dumme Sprüche, schlechte Witze und der ganze Quatsch, der im Proberaum passiert. Und Salamisticks. Vor allem Salamisticks.",
        boldStart: "Die Musik natürlich.",
        stamp: "STILL MAKING\nPROPER NOISE."
      }
    ]
  },

  membersPage: {
    heroTape: "THE FIVE",
    tagline: "Five roles. One loud problem."
  },

  members: [
    {
      id: "mona", name: "Mona", role: "Vocals", image: "assets/mona.webp", placeholder: false,
      bio: "Vorne am Mikro, aber längst nicht nur dort wichtig. Mona hält bei CAOTIX organisatorisch erstaunlich viele Fäden zusammen, kümmert sich um Gig-Möglichkeiten und sorgt meistens dafür, dass aus „müssten wir mal“ irgendwann tatsächlich ein Plan wird. Und wenn es irgendwo etwas durchzusetzen gibt, stehen die Chancen ziemlich gut, dass sie einen Weg findet.",
      facts: [
        ["Weapon of choice", "Voice / confidence / persistence"],
        ["Job", "Vocals / hooks / getting things done"],
        ["Stage rule", "If you mean it, people hear it"],
        ["Influences", "Spiritbox / Jinjer / Bring Me The Horizon / Architects / Paramore"],
        ["Where it started", "Started singing, stayed for the noise – and somewhere along the way also became the person who actually makes sure things happen."]
      ]
    },
    {
      id: "joost", name: "Joost", role: "Lead Guitar", image: "assets/joost.webp", modalImage: "assets/joost-modal.webp", modalFit: "contain", placeholder: false,
      bio: "Leadgitarre, Songideen und meistens derjenige, der den ersten Entwurf für neue Songs anschleppt. Joost baut zuhause die Grundrichtung zusammen und bringt daraus Demos mit, die im Proberaum gemeinsam weiter zerlegt, verändert und fertiggemacht werden. Seine besondere Schwäche: Breakdowns. Wenn irgendwo noch Platz für einen härteren Part ist, wird er ihn wahrscheinlich finden.",
      facts: [
        ["Weapon of choice", "6 strings. 7 if necessary."],
        ["Job", "Leads / demos / making it heavier"],
        ["Amp rule", "If in doubt, add gain."],
        ["Influences", "Lorna Shore / Knocked Loose / Spiritbox / Architects / Bring Me The Horizon"],
        ["Where it started", "Started playing guitar in second grade. School bands came first. Proper noise came later."]
      ]
    },
    {
      id: "jannick", name: "Jannick", role: "Rhythm Guitar", image: "assets/jannick.webp", placeholder: false,
      bio: "Rhythmusgitarre, Riffs und grundsätzlich immer irgendein Song, der „eigentlich schon fast sitzt“. Jannick übt viel, ist trotzdem erstaunlich oft derjenige, der kurz vor der Probe noch einmal herausfinden muss, wie der Mittelteil eigentlich ging. Dafür sitzt jeder dumme Spruch zuverlässig beim ersten Versuch.",
      facts: [
        ["Weapon of choice", "Guitar / downstrokes / questionable memory"],
        ["Job", "Rhythm / riffs / keeping it tight"],
        ["Amp rule", "Tight first. Loud second. Louder third."],
        ["Special skill", "Bad jokes / good timing"],
        ["Influences", "Architects / Parkway Drive / Knocked Loose / While She Sleeps / Bring Me The Horizon"],
        ["Where it started", "Started with riffs, stayed for the breakdowns. Still learning the songs. Probably."]
      ]
    },
    {
      id: "andreas", name: "Andreas / Andi", role: "Bass", image: "assets/andreas.webp", placeholder: false,
      bio: "Der entspannte Gegenpol im Chaos – zumindest so lange, bis es um Technik geht. Andi kümmert sich um das Low End und kann gleichzeitig erschreckend viel Zeit damit verbringen, sein Pedalboard umzubauen, neue Effekte auszuprobieren und noch irgendeine Lösung zu finden, die technisch bestimmt absolut notwendig war.",
      facts: [
        ["Weapon of choice", "Bass / pedalboard / too many options"],
        ["Job", "Bass / low end / technical overthinking"],
        ["Stage rule", "If the floor doesn’t shake, try again"],
        ["Special skill", "Turning one pedal into an evening project"],
        ["Influences", "Deftones / Architects / Spiritbox / Bring Me The Horizon / Gojira"],
        ["Where it started", "Somewhere between heavy music and the urge to understand exactly why something sounds the way it does. The bass stayed. The pedalboard kept growing."]
      ]
    },
    {
      id: "theo", name: "Theo", role: "Drums", image: "assets/theo.webp", placeholder: false,
      bio: "Der vermutlich ruhigste Mensch der Band sitzt ausgerechnet hinter dem lautesten Instrument. Theo hält das Chaos im Takt und ist nebenbei ein echtes Multitalent, bei dem schnell klar wird, dass musikalisch noch deutlich mehr drinsteckt als nur Schlagzeug.",
      facts: [
        ["Weapon of choice", "Sticks / precision / suspiciously calm energy"],
        ["Job", "Drums / dynamics / keeping the chaos on time"],
        ["Drum rule", "Stay calm. Hit hard."],
        ["Special skill", "Quietly being good at everything"],
        ["Influences", "Gojira / Lorna Shore / Architects / Slipknot / Knocked Loose"],
        ["Where it started", "Music first, instruments second. Eventually ended up behind the kit – which turned out to be a pretty good place to keep everyone else under control."]
      ]
    }
  ],

  livePage: {
    heroTape: "YOU'LL HEAR US BEFORE YOU SEE US.",
    tagline: "Upcoming dates",
    upcomingLabel: "UPCOMING",
    upcomingSmall: "Next damage",
    pastLabel: "PAST DAMAGE",
    pastSmall: "Already happened",

    // Link- und Fallback-Texte für Shows. Ticket- oder Info-Link nur eintragen,
    // wenn es wirklich einen gibt; ohne Link bleibt die Live-Liste bewusst sauber.
    ticketText: "GET TICKETS ↗",
    infoText: "MORE INFO ↗",
    noLinkText: "",
    emptyUpcomingHeadline: "NO DATES LOCKED IN.",
    emptyUpcomingText: "More damage soon.",
    emptyPastText: "Nothing here yet.",
    showMoreText: "SHOW MORE DAMAGE",
    homeTicketText: "Get tickets",
    homeInfoText: "More info",
    homeFallbackText: "Show details",
    statusLabels: {
      soldout: "SOLD OUT",
      cancelled: "CANCELLED",
      postponed: "POSTPONED"
    },
    homeNoDatesDate: "TBA",
    homeNoDatesYear: "SOON",
    homeNoDatesTitle: "New dates incoming",
    homeNoDatesPlace: "Keep an eye on the live page.",
    homeNoDatesButton: "Live page"
  },

  shows: [
    { date: "2026-01-31", time: "20:00", title: "Redemption Fest", venue: "Alter Schlachthof", city: "Lingen", ticket: "", info: "" },
    { date: "2026-09-18", time: "20:15", title: "Altstadtfest Lingen", venue: "EMILI Bühne", city: "Lingen", ticket: "", info: "", admission: "FREE ENTRY" },
    { date: "2026-09-19", time: "19:00", title: "Rock am Pferdemarkt", venue: "Alter Pferdemarkt", city: "Lingen", ticket: "", info: "", admission: "FREE ENTRY" },
    { date: "2026-11-14", time: "15:00", title: "Beard Rock Festival", venue: "JAM – Jugend- und Kulturzentrum Meppen", city: "Meppen", ticket: "https://www.eventim.de/eventseries/beard-rock-festival-vol-iii-the-barber-strikes-back-4091827/", info: "" },
    { date: "2027-03-06", title: "Metalblast", venue: "Alter Schlachthof", city: "Lingen", ticket: "", info: "" }
  ],

  music: {
    heroTape: "IN THE STUDIO",
    tagline: "First record. No pressure.",
    // Wenn releases leer ist, wird automatisch der Recording-Hinweis gezeigt.
    recordingLabel: "CURRENTLY RECORDING",
    recordingHeadline: "WE'RE MAKING NOISE.\nYOU'LL GET IT WHEN IT'S READY.",
    recordingParagraphs: [
      "Die erste CAOTIX-EP entsteht gerade. Noch gibt es keinen offiziellen Release-Termin.",
      "Sobald die ersten Songs draußen sind, landen hier Cover, Tracklist, Spotify, YouTube und weitere Streaming-Links."
    ],
    releases: [
      {
        type: "SINGLE",
        title: "From Above",
        status: "upcoming",
        date: "",
        dateLabel: "COMING SOON",
        cover: "assets/from-above.webp",
        description: "Die erste Single von CAOTIX. Bald auf allen gängigen Streaming-Plattformen.",
        tracks: ["From Above"],
        links: {}
      }
    ]
  },

  merchPage: {
    heroTape: "OFFICIAL CAOTIX GEAR",
    tagline: "Wear it loud.",
    headline: "SPREAD THE",
    headlinePink: "CHAOS.",
    subline: "Wear it. Share it. Drag it into the pit.",
    showNotice: {
      label: "NO ONLINE SHOP.",
      headline: "MERCH ONLY AT THE SHOWS.",
      text: "Shirts, Patches und was wir sonst gerade dabeihaben, bekommt ihr direkt bei uns am Merchstand auf unseren Konzerten. Was verfügbar ist, kann von Show zu Show variieren.",
      note: "COME FOR THE NOISE. LEAVE WITH MERCH.",
      button: "LIVE-TERMINE"
    }
  },

  contact: {
    heroTape: "BOOKING / PRESS / CONTACT",
    tagline: "Bring CAOTIX to your stage.",
    label: "GET IN TOUCH",
    headline: "BOOK US.\nPRESS US.\nWRITE US.",
    intro: "Für Shows, Festivals, Support-Slots, Presse und sonstige Anfragen.",

    booking: {
      label: "BOOKING",
      headline: "BRING THE NOISE.",
      text: "Schickt uns direkt Datum, Venue/Location, Art des Events und eine kurze Beschreibung.",
      button: "BOOKING ANFRAGE ↗",
      subject: "CAOTIX Booking-Anfrage",
      body: "Hallo CAOTIX,\n\nich möchte euch für folgende Veranstaltung anfragen:\n\nDatum: \nVenue / Location: \nArt des Events: \nWeitere Infos: \n\nMit freundlichen Grüßen\n"
    },

    production: {
      label: "PRODUCTION",
      headline: "READY FOR THE STAGE.",
      text: "Alles Wichtige für Bühne und Technik – ohne Mail-Pingpong.",
      downloads: [
        { label: "TECHNICAL RIDER ↓", meta: "PDF · INPUT LIST / MONITORING / TECH", href: "assets/downloads/CAOTIX_Technical_Rider.pdf" },
        { label: "STAGE PLOT ↓", meta: "PDF · POSITIONS / MONITORS / SIGNAL", href: "assets/downloads/CAOTIX_Stage_Plot.pdf" }
      ],
      note: "Hospitality & weitere Produktionsdetails gibt's nach bestätigtem Booking."
    },

    press: {
      label: "PRESS / MEDIA",
      headline: "TAKE WHAT YOU NEED.",
      text: "EPK, Pressetext, Logos und das komplette Press-Fotokit stehen direkt zum Download bereit.",
      button: "PRESS ANFRAGE ↗",
      subject: "CAOTIX Presseanfrage",
      body: "Hallo CAOTIX,\n\nich habe folgende Presse-/Medienanfrage:\n\nMedium / Projekt: \nAnfrage: \nDeadline: \n\nMit freundlichen Grüßen\n",
      downloads: [
        { label: "EPK BUNDLE ↓", meta: "ZIP · PRESS TEXT / LOGOS / PRESS PHOTOS / TECH RIDER / STAGE PLOT", href: "assets/downloads/CaotiX_EPK.zip", featured: true },
        { label: "PRESS PHOTO KIT ↓", meta: "ZIP · 9 JPGS · PRESS + LIVE PHOTOS", href: "assets/downloads/CAOTIX_Press_Photos.zip" },
        { label: "PRESS TEXT ↓", meta: "ZIP · SHORT + LONG / PDF + TXT", href: "assets/downloads/CaotiX_Press_Text.zip" },
        { label: "LOGO PACK ↓", meta: "ZIP · PNG + SVG / BLACK + WHITE", href: "assets/downloads/CaotiX_Logo_Pack.zip" }
      ],
      pendingText: "Im EPK-Bundle stecken Pressetext, Logos, Technical Rider, Stage Plot und die ausgewählten Originalfotos in voller Auflösung."
    },

    generalLabel: "GENERAL CONTACT",
    mailSubject: "CAOTIX Anfrage",
    mailBody: "Hallo CAOTIX,\n\nich habe folgende Anfrage:\n\n\n\nMit freundlichen Grüßen\n",
    asideNote: "LOUD MUSIC.\nSMALL INBOX.",
    asideText: "Antworten gibt's per Mail. Kein Formular. Kein Bullshit."
  },

  aux: {
    mode: "text",
    displayText: "XX.XX.XXXX",
    targetDate: "2027-01-01T00:00:00+01:00"
  }
};
