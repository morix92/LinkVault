# LinkVault

LinkVault è una web application full stack sviluppata con l'obiettivo di approfondire la progettazione architetturale di applicazioni moderne, la separazione delle responsabilità tra i componenti applicativi e la containerizzazione dell'ambiente di esecuzione tramite Docker.

L'applicazione consente agli utenti di archiviare, organizzare e gestire raccolte personali di link attraverso un sistema di autenticazione dedicato e categorie personalizzabili.

---

# Obiettivi del progetto

Il progetto nasce con finalità formative e di portfolio e pone particolare attenzione a:

- progettazione di un'architettura full stack modulare;
- realizzazione di API REST mediante Node.js ed Express;
- persistenza dei dati tramite PostgreSQL;
- autenticazione stateless tramite JWT;
- isolamento dei dati tra utenti;
- containerizzazione dei servizi applicativi;
- riproducibilità dell'ambiente di esecuzione tramite Docker Compose;
- verifica automatizzata delle principali funzionalità backend tramite script di integrazione.

---

# Quick Start

## Prerequisiti

Assicurarsi di avere installato:

- Docker Desktop

Verifica installazione:

```bash
docker --version
docker compose version
```

---

## Avvio dell'applicazione

Dalla root del progetto eseguire:

```bash
docker compose up --build -d
```

Il comando:

- crea le immagini Docker necessarie;
- avvia i container;
- inizializza il database PostgreSQL;
- avvia il backend Express;
- genera una build di produzione del frontend Angular;
- distribuisce gli artefatti compilati tramite Nginx.

---

## Verifica stato dei servizi

```bash
docker ps
```

Output atteso:

```text
linkvault-postgres   healthy
linkvault-backend    healthy
linkvault-frontend   healthy
```

---

## Accesso all'applicazione

Frontend:

```text
http://localhost:4200
```

Backend Health Check:

```text
http://localhost:3000/health
```

---

## Credenziali Demo

Username:
demo

Password:
demo12345

Le credenziali demo vengono caricate automaticamente durante la prima inizializzazione del database PostgreSQL.
---

## Arresto dell'applicazione

```bash
docker compose down
```

---

## Rimozione completa dell'ambiente

```bash
docker compose down -v
```

⚠️ Attenzione: il comando elimina anche il volume PostgreSQL e tutti i dati memorizzati nel database.

---

## Struttura dei servizi

```text
Frontend (Angular)
    ↓
Backend (Node.js / Express)
    ↓
Database (PostgreSQL)
```

Tutti i componenti vengono eseguiti come servizi distinti e comunicano attraverso la rete interna creata automaticamente da Docker Compose.

---

# Architettura

```text
┌─────────────────┐
│     Angular     │
│    Frontend     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Node.js         │
│ Express API     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ PostgreSQL      │
│ Persistence     │
└─────────────────┘
```

I componenti applicativi vengono eseguiti come servizi distinti e orchestrati tramite Docker Compose.

---

# Tecnologie utilizzate

## Frontend

- Angular 21
- TypeScript
- HTML
- CSS

## Backend

- Node.js
- Express
- TypeScript
- JWT
- bcrypt

## Database

- PostgreSQL

## Infrastructure

- Docker
- Docker Compose

---

# Scelte progettuali

## Configurazione sviluppo e distribuzione

Durante lo sviluppo il frontend può essere eseguito tramite Angular Dev Server (`ng serve`) per favorire un ciclo di sviluppo rapido.

La configurazione containerizzata destinata alla distribuzione utilizza invece una build ottimizzata dell'applicazione Angular che viene servita tramite Nginx.

Questa separazione consente di distinguere chiaramente l'ambiente di sviluppo da quello di esecuzione finale, riducendo le dipendenze runtime ed avvicinando l'applicazione ad uno scenario reale di deploy.

---

## Perché Docker Compose

Frontend, backend e database sono gestiti come servizi distinti.

Questo consente di:

- ridurre la configurazione manuale;
- semplificare l'avvio dell'applicazione;
- garantire una maggiore riproducibilità dell'ambiente.

---

## Perché JWT

È stato adottato un approccio stateless basato su token per favorire l'integrazione con una Single Page Application Angular e per semplificare la scalabilità del backend.

---

## Perché non vengono persistiti i JWT

Per la versione attuale del progetto i token non vengono salvati nel database.

Il backend ne verifica esclusivamente:

- firma;
- scadenza;
- validità dell'utente associato.

Soluzioni come blacklist, refresh token e revoca centralizzata non rientrano negli obiettivi della versione MVP.

---

# Funzionalità implementate

## Autenticazione

- registrazione utenti;
- login utenti;
- hashing password tramite bcrypt;
- autenticazione JWT;
- middleware di autorizzazione;
- endpoint protetti.

### Endpoint

```http
POST /api/auth/register
POST /api/auth/login
```

---

## Gestione profilo utente

### Endpoint

```http
GET    /api/users/me
PUT    /api/users/me
DELETE /api/users/me
```

Funzionalità:

- recupero dati profilo;
- aggiornamento username;
- aggiornamento password;
- eliminazione account.

---

## Gestione categorie

### Endpoint

```http
POST   /api/categories
GET    /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

Caratteristiche:

- ogni categoria appartiene a un singolo utente;
- isolamento completo delle risorse;
- impossibilità di accedere o modificare categorie di altri utenti.

### Categoria Default

Al momento della registrazione viene generata automaticamente una categoria:

```text
Default
```

Questo consente all'utente di utilizzare immediatamente l'applicazione senza dover creare manualmente una categoria.

---

## Gestione link

### Endpoint

```http
POST   /api/links
GET    /api/links
PUT    /api/links/:id
DELETE /api/links/:id
```

Caratteristiche:

- ogni link appartiene a un utente;
- ogni link appartiene a una categoria;
- supporto a descrizione opzionale;
- supporto a immagine associata;
- verifica dell'appartenenza della categoria all'utente autenticato.

### Favicon automatica

Se non viene specificata alcuna immagine personalizzata, il backend genera automaticamente il percorso alla favicon del sito utilizzando l'URL fornito.

Esempio:

```text
https://angular.dev
```

↓

```text
https://angular.dev/favicon.ico
```

---

# Sicurezza

## Password

Le password non vengono mai salvate in chiaro.

Vengono memorizzati esclusivamente hash generati tramite:

```text
bcrypt
```

---

## JWT

L'autenticazione utilizza JSON Web Token.

Il backend verifica:
- validità della firma;
- scadenza del token;
- esistenza dell'utente associato.

Non sono previsti meccanismi di revoca dei token JWT, che restano validi fino alla scadenza configurata. 
In un contesto produttivo si potrebbe introdurre una strategia basata su refresh token o tracciamento della data di modifica della password.
Sul frontend, per semplicità, il JWT viene memorizzato nel localStorage, ma in un contesto produttivo sarebbe preferibile utilizzare cookie HttpOnly.

---

# Test automatici

Il progetto include uno script di integrazione backend che esegue automaticamente verifiche end-to-end sulle API.

Lo script testa:

- registrazione utenti;
- autenticazione JWT;
- gestione profilo;
- gestione categorie;
- gestione link;
- isolamento dei dati tra utenti;
- controllo delle autorizzazioni;
- gestione degli errori.

Esecuzione:

```bash
backend\test-backend.bat
```

Durante l'esecuzione viene generato automaticamente un report dettagliato nella directory:

```text
backend/reports
```

contenente:

- chiamate effettuate;
- codici HTTP restituiti;
- risposte ricevute;
- riepilogo finale dei test.

---

# Roadmap

## Completato

- [x] Inizializzazione repository
- [x] PostgreSQL containerizzato
- [x] Schema database iniziale
- [x] Backend Express containerizzato
- [x] Autenticazione JWT
- [x] Gestione profilo utente
- [x] Gestione categorie
- [x] Gestione link
- [x] Test automatici di integrazione backend
- [x] Frontend Angular containerizzato
- [x] Build frontend tramite Nginx

## In sviluppo

- [ ] Sviluppo dettagliato interfaccia utente

---

# Stato del progetto

🚧 Work in progress

Attualmente il backend e il database sono completati e testati.

Lo sviluppo proseguirà con la realizzazione del frontend Angular e con l'integrazione completa dell'interfaccia utente.