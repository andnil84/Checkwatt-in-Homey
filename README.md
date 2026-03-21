# Checkwatt in Homey

Inofficiell [Homey](https://homey.app)-app för [Checkwatt](https://checkwatt.se) / **EnergyInBalance** — batteri, **nettointäkter** (samma som i portalen: **alla** intäkter), och status i flöden och på enhetens platta.

> **Butik:** `readme.txt` är den korta texten för Homey App Store (inga URL:er enligt deras regler). **Denna `README.md`** har installation från källkod och FAQ för utvecklare — det återfinns inte i `readme.txt`.
>
> **Developers:** `readme.txt` is the plain-text App Store blurb (no URLs per store rules). **This `README.md`** adds install-from-source steps and a **FAQ** — not duplicated in `readme.txt`.

---

## Svenska

### Vad appen gör

Appen kopplar Homey till din Checkwatt-anläggning i EnergyInBalance. Du kan följa batterinivå, nettointäkter för anläggningen (samma som i portalen—**alla** intäkter), och status på enhetens platta, i Insights och i flöden. Logga in med samma användarnamn och lösenord som till tjänsten EnergyInBalance. Appen är community-utvecklad, är inte officiell från Checkwatt och använder inofficiell åtkomst till samma webb-API:er som de officiella klienterna. Tack till bidragsgivare står i appmanifestet under `contributors`.

### Så här får du appen på Homey (när den finns i App Store)

När appen finns i Homey App Store: öppna Homey på mobilen eller i webbläsaren, sök efter appen, välj **Installera** och följ guiden. Lägg till en enhet och logga in med EnergyInBalance. Där räcker Homeys egna gränssnitt; du behöver inte Node.js, Git eller Homey CLI, och du behöver inte klona det här repot. Du kan gärna läsa koden på GitHub på datorn — men den vanliga installationen från butiken kräver inte utvecklarverktyg. Att bygga från källkod är bara för test eller utveckling (se nedan).

### Så här installerar du från källkod (utvecklare och testare)

**Börja inte här om du bara vill använda appen.** Den enkla vägen är att installera från **Homey App Store** (avsnittet ovan) — då behöver du aldrig öppna en terminal eller installera Node.js.

Att följa stegen nedan innebär att du skriver **kommandon** i ett svart/vitt fönster på datorn (en **terminal**). Det är samma typ av fönster som IT-support ibland ber dig öppna. Om det känns obekant: **det är helt okej att be någon som brukar datorer** om hjälp, eller **vänta** tills appen finns i butiken.

#### Innan du börjar — checklista

- [ ] **Homey Pro** är igång och kopplad till ditt Athom-konto (samma inloggning som i Homey-appen).
- [ ] Du har **internet** på datorn.
- [ ] Du har **projektmappen** med appens kod: ladda ner **ZIP** från GitHub (**Code** → **Download ZIP**), packa upp någonstans du hittar (t.ex. Skrivbordet), och döp gärna mappen till något kort namn. *Alternativ:* om du redan använder Git kan du klona repot i stället.
- [ ] Du har installerat **Node.js** (LTS) från [https://nodejs.org/](https://nodejs.org/) med standardinställningarna. Efter installation: **starta om datorn** om kommandona `node` eller `npm` inte hittas (vanligt på Windows).

#### Så vet du att du står i rätt mapp

Öppna mappen du packade upp. Inuti ska du se filerna **`app.json`** och **`package.json`**. Ser du dem i Utforskaren är du på rätt ställe.

#### Steg-för-steg

**1. Öppna terminalen *i* projektmappen**

- **Windows 10/11:** Öppna mappen i Utforskaren. Klicka i **adressfältet** (där sökvägen står), skriv `powershell`, tryck **Enter**. Ett nytt fönster öppnas och du ska redan stå i rätt mapp.  
  *Alternativ:* högerklicka i mappens tomma yta → **Visa fler alternativ** → **Öppna i Terminal** (om det finns).  
- **Mac:** Högerklicka på mappen → **Ny terminal här** (eller öppna Terminal och skriv `cd ` med ett mellanslag, dra in mappen från skrivbordet och tryck Enter).

**2. Installera Homey-kommandon på datorn (görs en gång)**  
Klistra in raden nedan, tryck **Enter**, och vänta tills texten slutar rulla utan rött felmeddelande.

```bash
npm install -g homey
```

**3. Logga in mot Athom (samma konto som till Homey)**  
Klistra in:

```bash
homey login
```

Webbläsaren öppnas — logga in och godkänn. Stäng inte för tidigt.

**4. Kontrollera att app-paketet är helt**  
Klistra in:

```bash
npx homey app validate
```

Det ska avslutas med att valideringen lyckades. Står det fel: läs meddelandet, eller se **Felsökning** nedan.

**5. Skicka appen till din Homey över internet**  
Klistra in:

```bash
homey app install --remote
```

Du behöver **inte** installera Docker på datorn för detta. Vänta tills kommandot är färdigt.

**6. I Homey: lägg till din anläggning**  
Öppna Homey (mobil eller webb) → **Appar** → hitta den här appen → **Lägg till enhet**. Ange **samma användarnamn och lösenord som du använder till EnergyInBalance** (Checkwatts webbportal — det är alltså inte ett separat “Homey-lösenord” för detta steg).

**7. (Valfritt) Utveckling med loggar i terminalen**  
Klistra in:

```bash
homey app run --remote
```

Låt fönstret vara öppet medan du testar. Avsluta med **Ctrl+C** när du är klar.

#### Felsökning (kort)

- **`npm` eller `node` hittas inte:** Starta om datorn efter Node-installation. Öppna terminalen på nytt i projektmappen.
- **`homey login` hänger:** Kontrollera brandvägg/adblocker, prova annan webbläsare som standard.
- **Git:** Behövs bara om du ska *klona*; för ZIP räcker Utforskaren.
- **Docker:** Krävs **inte** för `install --remote` eller `run --remote` på din PC.
- **Kan inte lägga till enhet:** Kör `npx homey app validate` igen. Lägg till enhet under **just den här appen** i Homey.
- **Uppdatera efter ändringar i koden:** Kör `homey app install --remote` igen från samma mapp.
- **Var ändrar jag inloggning till EnergyInBalance?** Under enhetens inställningar för appen, eller när du lägger till enheten från början.

### Frågor som ofta dyker upp

- **Git fungerar inte:** Installera [Git för Windows](https://git-scm.com/download/win) eller lägg till PATH — testa med `git --version` i terminalen. *Du kan hoppa över Git om du använder ZIP.*
- **Docker?** Inte för `--remote`
- **Ingen drivrutin:** Kör `homey app validate`, lägg till enhet under appen
- **Uppdatering:** `homey app install --remote` igen
- **Var loggar jag in EiB?** Vid pairing eller under enhetens appinställningar

---

## English

Unofficial [Homey](https://homey.app) app for [Checkwatt](https://checkwatt.se) / **EnergyInBalance** — battery, **net income** (same totals as the portal: **all** revenue streams), and site status in Flows and on the device tile.

### What this app does

This app connects Homey to your CheckWatt EnergyInBalance account. You can see battery level, net income for the site (the same totals as in EnergyInBalance—**all** revenue streams), and site status on the device tile, in Insights and in Flows. Sign in with the same username and password you use for the EnergyInBalance service. This app is made by the community, is not official Checkwatt software, and uses unofficial access to the same web APIs the mobile and web clients use. Credit for API understanding belongs in the app manifest contributors section.

### How to get the app on Homey (when it is in the App Store)

When the app is published in the Homey App Store, open Homey on your phone or in the browser, search for Checkwatt or the app name, tap **Install**, and follow the prompts. Then add a device under the app and enter your EnergyInBalance login. For that route you only use Homey's own screens—you do not need Node.js, Git, or the Homey CLI, and you do not need to clone this repository. Many people use a computer to browse the store; the point is that the normal install does not use developer tools. Building from Git is only for testing or development (see below).

### How to install from source (developers and testers)

**Do not start here if you only want to use the app.** The easy path is the **Homey App Store** (section above): no terminal, no Node.js.

The steps below mean typing **commands** in a terminal window. If that feels unfamiliar, ask someone comfortable with PCs, or wait for the store release.

#### Before you start — checklist

- [ ] **Homey Pro** is online and linked to your Athom account (same login as the Homey mobile app).
- [ ] Your **PC has internet**.
- [ ] You have the **project folder**: download the repo as **ZIP** from GitHub (**Code** → **Download ZIP**), unzip somewhere easy to find. *Or* clone with Git if you already use it.
- [ ] **Node.js** (LTS) installed from [https://nodejs.org/](https://nodejs.org/) with defaults. If `node` or `npm` is “not recognized”, **restart the PC** after install (common on Windows).

#### You are in the right folder when…

You see **`app.json`** and **`package.json`** in that folder.

#### Step-by-step

**1. Open a terminal *in* the project folder**

- **Windows:** In File Explorer, open the folder. Click the **address bar**, type `powershell`, press **Enter**.  
  *Or* right-click empty space → **Show more options** → **Open in Terminal** if available.
- **Mac:** Right-click the folder → open Terminal here, or in Terminal type `cd `, drag the folder in, press Enter.

**2. Install the Homey CLI (once)**

```bash
npm install -g homey
```

**3. Log in to Athom**

```bash
homey login
```

Complete the browser login.

**4. Validate the app package**

```bash
npx homey app validate
```

Fix any errors before continuing.

**5. Install to your Homey over the internet (no Docker on your PC)**

```bash
homey app install --remote
```

Wait until it finishes.

**6. On Homey: add your site**

Apps → this app → **Add device**. Use your **EnergyInBalance** username and password (the Checkwatt / portal login — not a separate Homey-only password for this step).

**7. (Optional) Dev mode with logs**

```bash
homey app run --remote
```

Stop with **Ctrl+C** when done.

#### Quick troubleshooting

- **`npm` / `node` not found:** Reboot after installing Node; open a new terminal in the project folder.
- **`homey login` stuck:** Check firewall / adblock; try setting another browser as default.
- **Git:** Only needed to clone; ZIP users can skip Git.
- **Docker:** **Not** required for `install --remote` or `run --remote` on your PC.
- **Re-login / change EnergyInBalance credentials:** Device settings for this app, or pair again.

### FAQ

| Question | Answer |
|----------|--------|
| Why doesn't `git` work? | Git may be missing or not on your `PATH`. Install Git for Windows, restart the terminal, or add Git's `cmd` folder to the system `PATH`. Check with `git --version`. |
| Do I need Docker? | **No** for `homey app install --remote` or `homey app run --remote`. Docker is for other CLI workflows; remote install uses the cloud. |
| No driver / can't add device | The app manifest must list drivers and capabilities correctly. After changes, run `homey app validate` again. Use **Add device** under the app. |
| How do I update after code changes? | Run `homey app install --remote` again from the project folder, or `homey app run --remote` while testing. |
| Where do I enter EnergyInBalance? | In the pairing flow when you add a CheckWatt site, or later under the device settings for the app. |

---

## License

MIT — see [LICENSE](LICENSE).
