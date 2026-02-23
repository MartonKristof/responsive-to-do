
//Api lehívas
const apiUrl = 'https://jsonplaceholder.typicode.com/todos';

// Feladatok tárolása
let tasks = [];
// DOM elemek
const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');

// Feladatok lekérése az API-ról
async function fetchTasks() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        tasks = data;
        renderTasks();
    } catch (error) {
        console.error('Hiba a feladatok lekérésekor:', error);
    }
}

fetchTasks();
// Feladatok megjelenítése
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.textContent = task.title;
        taskList.appendChild(taskItem);
    });
}

// Új feladat létrehozása
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newTask = {
        title: taskInput.value,
        completed: false,
        userId: 1
    };
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        });
        const createdTask = await response.json();
        tasks.unshift(createdTask);
        renderTasks();
        taskInput.value = '';
    } catch (error) {
        console.error('Hiba új feladat létrehozásakor:', error);
    }
});
















































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