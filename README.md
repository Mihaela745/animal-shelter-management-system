# Animal Shelter Management System

Aplicație web pentru administrarea unui adăpost de animale, realizată în cadrul lucrării de licență. Proiectul oferă o platformă completă pentru gestionarea animalelor, a personalului, a programărilor, a cererilor de adopție și a istoricului adopțiilor, având atât o interfață destinată publicului, cât și zone private pentru utilizatori și angajați.

Sistemul este construit pe o arhitectură `frontend + backend + baza de date`, folosind React pentru interfață, Express pentru API și MySQL împreună cu Sequelize pentru persistarea datelor.

## Scopul proiectului

Scopul aplicației este digitalizarea proceselor dintr-un adăpost de animale și centralizarea informațiilor importante într-un singur sistem:

- evidența animalelor disponibile, adoptate sau aflate în foster;
- administrarea boxelor, a capacității și a distribuirii animalelor;
- gestionarea personalului și a responsabilităților;
- programarea vizitelor și întâlnirilor pentru adopție;
- urmărirea fișelor medicale și a tratamentelor;
- procesarea cererilor de adopție;
- păstrarea istoricului adopțiilor;
- recomandări asistate de AI pentru potrivirea dintre utilizator și animal.

## Tehnologii folosite

### Frontend

- React 19
- Vite
- Redux Toolkit
- React Router
- Material UI
- Recharts
- jsPDF

### Backend

- Node.js
- Express
- Sequelize ORM
- MySQL
- JWT pentru autentificare
- Nodemailer pentru email
- Multer + Cloudinary pentru încărcare imagini

### Integrări externe

- Gemini API pentru funcționalitatea de recomandare AI
- API-uri externe pentru rase de câini și pisici
- Gmail App Password pentru trimiterea emailurilor
- Cloudinary pentru stocarea imaginilor

## Funcționalități principale

### Zonă publică

- pagină de prezentare a platformei;
- autentificare și înregistrare;
- resetare parolă prin email;
- previzualizare animale disponibile pentru adopție.

### Utilizator obișnuit

- vizualizare animale disponibile;
- acces la pagină de detalii pentru fiecare animal;
- trimitere cereri de adopție;
- vizualizare istoric personal de adopții;
- vizualizare programări;
- profil personal;
- pagină AI Match pentru recomandări de animale pe baza preferințelor descrise în limbaj natural.

### Manager

- dashboard cu indicatori și grafice;
- adăugare, actualizare și gestionare animale;
- vizualizare și procesare cereri de adopție;
- administrare programări;
- gestionare boxe și distribuirea animalelor;
- gestionare utilizatori;
- gestionare personal;
- acces la rapoarte;
- acces la fișele medicale.

### Medic veterinar

- dashboard dedicat;
- acces la animale și la detaliile lor;
- vizualizare și editare fișe medicale;
- adăugare medicație;
- vizualizare boxe și animale pe boxe;
- acces la rapoarte.

### Îngrijitor

- dashboard dedicat;
- vizualizare animale și boxe;
- acces la programări;
- acces la anumite informații medicale;
- acces la rapoarte.

## Arhitectura aplicației

Proiectul este împărțit în două directoare principale:

- `frontend/` conține interfața utilizator;
- `backend/` conține API-ul, logica de business și accesul la baza de date.

### Structură generală

```text
animal-shelter-management-system/
├── backend/
│   ├── server.js
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── utils/
├── frontend/
│   └── src/
│       ├── app/
│       ├── components/
│       ├── features/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       └── utils/
├── DATABASE_SCHEMA.md
└── README.md
```

## Roluri în sistem

Aplicația folosește control al accesului pe bază de rol. În modelul de utilizator există următoarele roluri:

- `user`
- `Manager`
- `Vet`
- `Caretaker`

Accesul în frontend este protejat prin rute dedicate, iar fiecare rol vede doar secțiunile relevante pentru activitatea sa.

## Module backend

API-ul este expus sub prefixul `/api`, iar principalele zone funcționale sunt:

- `/api/auth` pentru autentificare și recuperare parolă;
- `/api/animals` pentru gestionarea animalelor;
- `/api/adoption-requests` pentru cererile de adopție;
- `/api/adoptions` pentru istoricul adopțiilor;
- `/api/appointments` pentru programări;
- `/api/medical-files` pentru fișe medicale;
- `/api/staff` pentru personal;
- `/api/users` pentru utilizatori;
- `/api/boxes` pentru boxe;
- `/api/species` pentru specii;
- `/api/breeds` și `/api/breed-metadata` pentru date despre rase;
- `/api/rooms` pentru camere;
- `/api/reports` pentru rapoarte;
- `/api/ai` pentru recomandările asistate de inteligență artificială.

Backend-ul rulează implicit pe portul `3000`.

## Baza de date

Aplicația folosește MySQL, iar modelele sunt gestionate prin Sequelize. Printre entitățile importante se numără:

- `Users`
- `Staff`
- `Positions`
- `Animals`
- `Species`
- `Boxes`
- `Responsible_boxes`
- `Medical_files`
- `Medications`
- `Appointments`
- `Adoption_requests`
- `Adoption_history`
- `Rooms`
- `ResetTokens`
- `Breed_Metadata`


## Cerințe pentru rulare

Înainte de pornirea proiectului, este recomandat să existe instalate:

- Node.js
- npm
- MySQL Server

## Instalare și configurare

### 1. Clonarea proiectului

```bash
git clone https://github.com/Mihaela745/animal-shelter-management-system.git
cd animal-shelter-management-system
```

### 2. Instalarea dependențelor pentru backend

```bash
cd backend
npm install
```

### 3. Instalarea dependențelor pentru frontend

```bash
cd ../frontend
npm install
```

## Variabile de mediu

Proiectul folosește variabile de mediu pentru conectarea la baza de date, autentificare, servicii externe și email. În backend trebuie configurat un fișier `.env`.

Un exemplu de structură:

```env
DB_NAME=animal_shelter
DB_USER=root
DB_PASS=parola_ta

JWT_SECRET=un_secret_sigur
CLIENT_URL=http://localhost:5173

EMAIL_SEND=exemplu@gmail.com
GOOGLE_APP_PASSWORD=parola_app_gmail

CLOUDINARY_CLOUD_NAME=cloud_name
CLOUDINARY_API_KEY=api_key
CLOUDINARY_API_SECRET=api_secret

GEMINI_API_KEY=cheie_gemini

DOG_BREED_API_URL=https://exemplu-api-caini
DOG_API_KEY=cheie_api_caini

CAT_BREED_API_URL=https://exemplu-api-pisici
CAT_API_KEY=cheie_api_pisici
```

### Observații despre configurare

- conexiunea la baza de date este configurată în [backend/src/config/db.js](/C:/Users/Mihaela/Desktop/licenta/animal-shelter-management-system/backend/src/config/db.js);
- backend-ul permite cereri CORS din `http://localhost:5173`;
- frontend-ul rulează implicit prin Vite pe portul `5173`;
- linkul de resetare a parolei folosește `CLIENT_URL`;
- funcționalitatea AI nu va funcționa fără `GEMINI_API_KEY`;
- încărcarea imaginilor depinde de setările Cloudinary.

## Pornirea aplicației

### Backend

Din directorul `backend/`:

```bash
npm start
```

Acest script pornește serverul cu `nodemon`.

### Frontend

Din directorul `frontend/`:

```bash
npm run dev
```

După pornire:

- frontend: `http://localhost:5173`
- backend: `http://localhost:3000`

## Scripturi disponibile

### Backend

- `npm start` pornește serverul în modul de dezvoltare cu `nodemon`

### Frontend

- `npm run dev` pornește serverul Vite
- `npm run build` generează versiunea de producție
- `npm run preview` rulează build-ul local
- `npm run lint` verifică regulile ESLint

## Funcționalitatea AI Match

Una dintre funcționalitățile distinctive ale proiectului este modulul de recomandare AI pentru adopție.

Pe scurt, fluxul este următorul:

1. utilizatorul descrie ce tip de animal își dorește;
2. descrierea este trimisă către un serviciu AI;
3. criteriile sunt extrase și validate;
4. animalele candidate sunt comparate cu aceste criterii;
5. sistemul întoarce o listă ordonată de recomandări, însoțită de explicații în limba română.

Această componentă este implementată în principal în [backend/src/services/aiCriteria.services.js](/C:/Users/Mihaela/Desktop/licenta/animal-shelter-management-system/backend/src/services/aiCriteria.services.js).

## Rapoarte și analiză

Aplicația include și o zonă de raportare, iar dashboard-ul managerului afișează indicatori precum:

- numărul total de animale;
- animale disponibile și adoptate;
- cereri de adopție în așteptare;
- programări din ziua curentă;
- rata de adopție;
- durata medie de ședere;
- gradul de ocupare al adăpostului;
- numărul total de membri ai personalului.

## Puncte forte ale proiectului

- separare clară între frontend și backend;
- organizare modulară pe controllere, rute, modele și feature slices;
- suport pentru mai multe roluri în aceeași aplicație;
- integrare cu servicii externe reale;
- includerea unei componente AI utile într-un scenariu practic;
- bază bună pentru extindere ulterioară.

## Posibile direcții de dezvoltare

- adăugarea unui sistem complet de notificări;
- audit log pentru acțiunile importante din sistem;
- panou admin suplimentar pentru configurări globale;
- suport pentru mai multe adăposturi;
- filtrare și căutare mai avansată;
- dashboard-uri analitice extinse.

## Limitări actuale

- anumite funcționalități depind de servicii externe și de chei API valide;
- rularea completă necesită configurarea manuală a bazei de date și a variabilelor de mediu.

## Concluzie

Animal Shelter Management System este o aplicație full-stack orientată spre nevoile reale ale unui adăpost de animale. Proiectul combină administrarea operațională, interacțiunea cu utilizatorii și automatizările moderne într-o platformă unificată, fiind potrivit atât ca demonstrație academică, cât și ca bază pentru dezvoltare ulterioară într-un context real.
