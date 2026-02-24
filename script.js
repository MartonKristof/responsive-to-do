
//Api lehívas
const apiVegpont = 'https://jsonplaceholder.typicode.com/todos';
const TAROLASI_KULCS = 'feladatokTarolo';
const CIM_MAX_HOSSZ = 60;
const LEIRAS_MAX_HOSSZ = 200;
const UZENET_IDOZITO = 3000;

// Feladatok tárolása
let feladatok = [];
// DOM elemek
const kartyakKontener = document.querySelector('.kartyak');
const feladatUrlap = document.getElementById('ujFeladatUrlap');
const feladatCimInput = document.getElementById('feladatCim');
const feladatLeirasInput = document.getElementById('feladatLeiras');
const keresoInput = document.getElementById('feladatKereses');
const keresoUrlap = document.getElementById('keresoUrlap');
const feladatokKapcsoloGomb = document.getElementById('feladatokKapcsolo');
const hamburgerGomb = document.getElementById('hamburgerGomb');
const navigacioMenu = document.getElementById('navigacio');
const temaValtoGomb = document.getElementById('temaValto');
const allapotUzenet = document.getElementById('allapotUzenet');
const betoltesAllapot = document.getElementById('betoltesAllapot');
const uresAllapot = document.getElementById('uresAllapot');
const cimHibaUzenet = document.getElementById('cimHibaUzenet');
const leirasHibaUzenet = document.getElementById('leirasHibaUzenet');
const kuldesGomb = feladatUrlap ? feladatUrlap.querySelector('button[type="submit"]') : null;
const ALAP_FELADAT_LIMIT = 10;
let mutassMindet = false;
let keresoKifejezes = '';
let uzenetIdozito;
let betoltesFolyamatban = false;

betoltesAllit(false);

function uzenetMegjelenit(szoveg, tipus = 'info', idozites = UZENET_IDOZITO) {
    if (!allapotUzenet) {
        return;
    }
    allapotUzenet.textContent = szoveg;
    allapotUzenet.className = `allapot ${tipus}`;
    allapotUzenet.hidden = false;
    if (uzenetIdozito) {
        clearTimeout(uzenetIdozito);
    }
    if (idozites) {
        uzenetIdozito = setTimeout(() => {
            allapotUzenet.hidden = true;
        }, idozites);
    }
}

function betoltesAllit(betoltes, cimke = 'Betöltés...') {
    betoltesFolyamatban = betoltes;
    if (betoltesAllapot) {
        betoltesAllapot.textContent = cimke;
        betoltesAllapot.hidden = !betoltes;
    }
    if (kartyakKontener) {
        kartyakKontener.setAttribute('aria-busy', String(betoltes));
    }
}

function urlapBetoltesAllit(betoltes) {
    if (!kuldesGomb) {
        return;
    }
    kuldesGomb.disabled = betoltes;
    kuldesGomb.textContent = betoltes ? 'Mentés...' : 'Hozzáadás';
}

function mezoHibaAllit(elem, uzenet) {
    if (!elem) {
        return;
    }
    elem.textContent = uzenet;
    elem.hidden = !uzenet;
}

function feladatNormalizal(feladat) {
    return {
        id: feladat.id ?? Date.now(),
        title: feladat.title || 'Névtelen feladat',
        description: feladat.description || '',
        completed: Boolean(feladat.completed),
        userId: feladat.userId ?? 1
    };
}

function feladatokMentese() {
    localStorage.setItem(TAROLASI_KULCS, JSON.stringify(feladatok));
}

function feladatokBetolteseTarolobol() {
    try {
        const tarolt = localStorage.getItem(TAROLASI_KULCS);
        if (!tarolt) {
            return [];
        }
        const feldolgozott = JSON.parse(tarolt);
        if (!Array.isArray(feldolgozott)) {
            return [];
        }
        return feldolgozott.map(feladatNormalizal);
    } catch (hiba) {
        console.error('Hiba a helyi tároló olvasásakor:', hiba);
        return [];
    }
}

// Feladatok lekérése az API-ról
async function feladatokLekerse() {
    betoltesAllit(true);
    try {
        const valasz = await fetch(apiVegpont);
        if (!valasz.ok) {
            throw new Error(`API hiba: ${valasz.status}`);
        }
        const adatok = await valasz.json();
        feladatok = adatok.map(feladatNormalizal);
        feladatokMentese();
        feladatokRenderel();
        uzenetMegjelenit('Feladatok betöltve az API-ból.', 'siker');
    } catch (hiba) {
        console.error('Hiba a feladatok lekérésekor:', hiba);
        uzenetMegjelenit('Nem sikerült betölteni az API-t. Helyi adatokkal próbálkozunk.', 'hiba');
        const taroltFeladatok = feladatokBetolteseTarolobol();
        if (taroltFeladatok.length > 0) {
            feladatok = taroltFeladatok;
            feladatokRenderel();
        } else {
            feladatok = [];
            feladatokRenderel();
        }
    } finally {
        betoltesAllit(false);
    }
}

const taroltFeladatok = feladatokBetolteseTarolobol();
if (taroltFeladatok.length > 0) {
    feladatok = taroltFeladatok;
    feladatokRenderel();
    betoltesAllit(false);
} else {
    feladatokLekerse();
}
// feladatkártya létrehozó függvény
function feladatKartyaLetrehoz(feladat) {
    const feladatKartya = document.createElement('div');
    feladatKartya.className = 'feladat-kartya';
    if (feladat.completed) {
        feladatKartya.classList.add('kesz');
    }

    const jelolo = document.createElement('input');
    const jeloloId = `feladat-${feladat.id}`;
    jelolo.type = 'checkbox';
    jelolo.id = jeloloId;
    jelolo.checked = feladat.completed;
    jelolo.setAttribute('aria-label', `Feladat kész: ${feladat.title}`);
    jelolo.addEventListener('change', () => {
        feladat.completed = jelolo.checked;
        feladatKartya.classList.toggle('kesz', feladat.completed);
        feladatokMentese();
        uzenetMegjelenit(feladat.completed ? 'Feladat késznek jelölve.' : 'Feladat visszaállítva.', 'siker');
    });

    const jeloloCimke = document.createElement('label');
    jeloloCimke.className = 'csak-olvaso';
    jeloloCimke.setAttribute('for', jeloloId);
    jeloloCimke.textContent = 'Feladat kész';

    const cim = document.createElement('h3');
    cim.textContent = feladat.title;

    const leiras = document.createElement('p');
    if (feladat.description) {
        leiras.textContent = feladat.description;
    }

    const felhasznalo = document.createElement('p');
    felhasznalo.textContent = `User: ${feladat.userId}`;

    const torlesGomb = document.createElement('button');
    torlesGomb.type = 'button';
    torlesGomb.className = 'feladat-torles';
    torlesGomb.textContent = 'Törlés';
    torlesGomb.addEventListener('click', () => {
        feladatok = feladatok.filter(item => item.id !== feladat.id);
        feladatokMentese();
        feladatokRenderel();
        uzenetMegjelenit('Feladat törölve.', 'info');
    });

    feladatKartya.appendChild(jelolo);
    feladatKartya.appendChild(jeloloCimke);
    feladatKartya.appendChild(cim);
    if (feladat.description) {
        feladatKartya.appendChild(leiras);
    }
    feladatKartya.appendChild(felhasznalo);
    feladatKartya.appendChild(torlesGomb);
    return feladatKartya;
}

// dom feladat lista renderelése
function feladatokRenderel() {
    if (!kartyakKontener) {
        return;
    }
    kartyakKontener.innerHTML = '';
    const toredelek = document.createDocumentFragment();
    const szurtFeladatLista = szurtFeladatok();
    const lathatoFeladatok = mutassMindet ? szurtFeladatLista : szurtFeladatLista.slice(0, ALAP_FELADAT_LIMIT);
    if (uresAllapot) {
        uresAllapot.hidden = betoltesFolyamatban || szurtFeladatLista.length !== 0;
    }
    lathatoFeladatok.forEach(feladat => {
        toredelek.appendChild(feladatKartyaLetrehoz(feladat));
    });
    kartyakKontener.appendChild(toredelek);
    kapcsoloGombFrissit(szurtFeladatLista.length);
}

function kapcsoloGombFrissit(feladatDb) {
    if (!feladatokKapcsoloGomb) {
        return;
    }
    if (feladatDb <= ALAP_FELADAT_LIMIT) {
        feladatokKapcsoloGomb.hidden = true;
        return;
    }
    feladatokKapcsoloGomb.hidden = false;
    feladatokKapcsoloGomb.textContent = mutassMindet ? 'Vissza 10-re' : 'Összes megjelenítése';
}

function szurtFeladatok() {
    if (!keresoKifejezes) {
        return feladatok;
    }
    const normalizaltKereses = keresoKifejezes.toLowerCase();
    return feladatok.filter(feladat => {
        const cimTalalat = feladat.title.toLowerCase().includes(normalizaltKereses);
        const leirasTalalat = feladat.description && feladat.description.toLowerCase().includes(normalizaltKereses);
        return cimTalalat || leirasTalalat;
    });
}

// Új feladat létrehozása
if (feladatUrlap) {
    feladatUrlap.addEventListener('submit', async (esemeny) => {
        esemeny.preventDefault();
        const cimErtek = feladatCimInput.value.trim();
        const leirasErtek = feladatLeirasInput.value.trim();
        mezoHibaAllit(cimHibaUzenet, '');
        mezoHibaAllit(leirasHibaUzenet, '');
        if (!cimErtek) {
            mezoHibaAllit(cimHibaUzenet, 'A feladat címe kötelező.');
            uzenetMegjelenit('Hiányzó mező: feladat címe.', 'hiba');
            return;
        }
        if (!leirasErtek) {
            mezoHibaAllit(leirasHibaUzenet, 'A feladat leírása kötelező.');
            uzenetMegjelenit('Hiányzó mező: feladat leírása.', 'hiba');
            return;
        }
        if (cimErtek.length > CIM_MAX_HOSSZ) {
            mezoHibaAllit(cimHibaUzenet, `A cím maximum ${CIM_MAX_HOSSZ} karakter lehet.`);
            uzenetMegjelenit('Túl hosszú cím.', 'hiba');
            return;
        }
        if (leirasErtek.length > LEIRAS_MAX_HOSSZ) {
            mezoHibaAllit(leirasHibaUzenet, `A leírás maximum ${LEIRAS_MAX_HOSSZ} karakter lehet.`);
            uzenetMegjelenit('Túl hosszú leírás.', 'hiba');
            return;
        }
        const ujFeladat = {
            id: Date.now(),
            title: cimErtek,
            description: leirasErtek,
            completed: false,
            userId: 1
        };
        urlapBetoltesAllit(true);
        try {
            const valasz = await fetch(apiVegpont, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ujFeladat)
            });
            if (!valasz.ok) {
                throw new Error(`API hiba: ${valasz.status}`);
            }
            const letrehozottFeladat = await valasz.json();
            feladatok.unshift(feladatNormalizal({ ...ujFeladat, id: letrehozottFeladat.id ?? ujFeladat.id }));
            feladatokMentese();
            feladatokRenderel();
            feladatCimInput.value = '';
            feladatLeirasInput.value = '';
            uzenetMegjelenit('Feladat sikeresen létrehozva.', 'siker');
        } catch (hiba) {
            console.error('Hiba új feladat létrehozásakor:', hiba);
            feladatok.unshift(feladatNormalizal(ujFeladat));
            feladatokMentese();
            feladatokRenderel();
            uzenetMegjelenit('API hiba. A feladat helyben elmentve.', 'hiba');
        } finally {
            urlapBetoltesAllit(false);
        }
    });
}

if (feladatCimInput) {
    feladatCimInput.addEventListener('input', () => mezoHibaAllit(cimHibaUzenet, ''));
}

if (feladatLeirasInput) {
    feladatLeirasInput.addEventListener('input', () => mezoHibaAllit(leirasHibaUzenet, ''));
}

if (keresoInput) {
    keresoInput.addEventListener('input', (esemeny) => {
        keresoKifejezes = esemeny.target.value.trim();
        mutassMindet = false;
        feladatokRenderel();
    });
}

if (keresoUrlap) {
    keresoUrlap.addEventListener('submit', (esemeny) => {
        esemeny.preventDefault();
        keresoKifejezes = keresoInput ? keresoInput.value.trim() : '';
        mutassMindet = false;
        feladatokRenderel();
    });
}

if (feladatokKapcsoloGomb) {
    feladatokKapcsoloGomb.addEventListener('click', () => {
        mutassMindet = !mutassMindet;
        feladatokRenderel();
    });
}

if (hamburgerGomb && navigacioMenu) {
    hamburgerGomb.addEventListener('click', () => {
        navigacioMenu.classList.toggle('menu-nyitva');
        const menuNyitva = navigacioMenu.classList.contains('menu-nyitva');
        hamburgerGomb.setAttribute('aria-expanded', String(menuNyitva));
    });

    hamburgerGomb.addEventListener('keydown', (esemeny) => {
        if (esemeny.key === 'Enter' || esemeny.key === ' ') {
            esemeny.preventDefault();
            hamburgerGomb.click();
        }
    });
}

function temaAlkalmaz(tema) {
    if (tema === 'vilagos') {
        document.body.classList.add('vilagos');
        if (temaValtoGomb) {
            temaValtoGomb.textContent = 'Sötét mód';
        }
    } else {
        document.body.classList.remove('vilagos');
        if (temaValtoGomb) {
            temaValtoGomb.textContent = 'Világos mód';
        }
    }
}

if (temaValtoGomb) {
    const mentettTema = localStorage.getItem('tema');
    if (mentettTema) {
        temaAlkalmaz(mentettTema);
    }

    temaValtoGomb.addEventListener('click', () => {
        const vilagosAktiv = document.body.classList.contains('vilagos');
        const kovetkezoTema = vilagosAktiv ? 'sotet' : 'vilagos';
        localStorage.setItem('tema', kovetkezoTema);
        temaAlkalmaz(kovetkezoTema);
    });
}




















































// Reszponzív Feladatkezelő Webalkalmazás
// Projekt célja
// Készítsenek egy reszponzív feladatkezelő webalkalmazást, amely lehetővé teszi feladatok
// létrehozását, kezelését és nyomon követését. Az alkalmazás API-n keresztül kommunikál a
// szerverrel.
// A fejlesztés során használják a GitHub verziókezelést, a csapatmunkát pedig a Trello
// segítségével, a KANBAN módszertan szerint. Az AI használatát minden esetben dokumentálni
// kell.
// A projekt eredményét a csapat egy 5–7 perces prezentációban mutatja be.

// 1. Csapat szervezés
// Létszám: 2–3 fő
// Szerepkörök:
// - Frontend fejlesztő: HTML + CSS felelőse
// - JavaScript fejlesztő: API integráció, logika, eseménykezelés

// 2. GitHub használata
// • Projekt repository létrehozása
// • Rendszeres, értelmes commit üzenetek
// • README.md a projektről

// 3. Trello – KANBAN tábla
// • Backlog: Ötletek, még nem kiosztott feladatok
// • Todo: Következő megvalósítandó feladatok
// • In Progress: Folyamatban lévő munkák
// • Code Review: Elkészült, ellenőrzésre váró feladatok
// • Done: Befejezett feladatok
// Szabályok:
// - Egyszerre max. 3 kártya lehet folyamatban
// - Egy fejlesztőnél max. 2 kártya lehet egyszerre

// 4. AI használati dokumentáció
// • Az AI csak segítség, nem másoljuk át vakon a kódot
// • Minden AI által generált kódrészletet megértünk és testreszabunk
// • Az AI használatot egy Word vagy Excel fájlban dokumentáljuk

// Minta bejegyzés:
// 1. Bejegyzés
// Dátum: 2026.02.02
// Prompt: Hogyan kell reszponzív grid-et készíteni CSS Grid-del, ami mobilon 1, tabletten
// 2, desktopon 3 oszlopos?
// AI válasz: Rövid összefoglalás
// Mit tanultam: Megértettem a repeat() és minmax() használatát
// Hol implementáltam: style.css 45–60. sorok

// 5. Önértékelés (egyéni)
// • Mi ment jól?
// • Mi okozott nehézséget?
// • Miben fejlődött?
// • Hogyan járult hozzá a csapatmunkához?
// • Melyik AI válasz volt a leghasznosabb?

// 6. Prezentáció (csapat)
// Időtartam: 5–7 perc
// Tartalom:
// - A projekt célja
// - A funkciók élő bemutatása
// - GitHub használat
// - Trello / KANBAN folyamat
// - AI használat összefoglalása
// - Tanulságok, nehézségek, megoldások

// 7. Tippek a fejlesztéshez
// • Mobile-first megközelítés
// • API tesztelése böngészőben
// • Fokozatos fejlesztés: először GET → POST → design
// • Git commitok: kis lépésekben
// • Kommunikáció: Trello kommentek

// Feladatkezelő alkalmazás specifikáció
// 1. Funkciók összefoglalása
// • Feladatok listázása
// • Új feladat létrehozása
// • Feladat státuszának módosítása
// • Feladat törlése
// • Keresés a feladatok között
// • Sötét/világos téma váltása
// 2. Funkcionális követelmények
// Feladatok listázása (GET): https://jsonplaceholder.typicode.com/todos
// Új feladat létrehozása (POST): https://jsonplaceholder.typicode.com/todos
// Státusz módosítása: kattintásra változik a completed érték, CSS osztály módosul (.completed)
// Törlés: feladat eltávolítása a listából
// Reszponzív design: mobil (1 oszlop), tablet (2 oszlop), desktop (3 oszlop)
// Téma váltó: sötét / világos mód CSS változókkal
// 3. Megjelenés
// Header:
// • alkalmazás neve (Feladatkezelő),
// • navigáció (hamburger menü mobilon)
// Main:
// • feladatok listája,
// • új feladat űrlap
// Feladatkártya:
// • checkbox,
// • szöveg,
// • userId,
// • törlés gomb
// 4. API végpontok
// GET /todos → válasz: [{userId, id, title, completed}]
// POST /todos → JSON: {"title": "Új feladat", "completed": false, "userId": 1}

// 5. Technikai specifikáció
// CSS:
// • Mobile-first,
// • Flexbox vagy Grid,
// • 3 media query,
// • CSS változók,
// • Reszponzív mértéjkegységek: %, vw, rem
// JavaScript:
// • ES6+,
// • Fetch API,
// • async/await,
// • eseménykezelők
// Fájlstruktúra:
// project/
// ├── index.html
// ├── style.css
// ├── script.js
// ├── README.md
// └── assets/
// ├── images/
// └── icons/