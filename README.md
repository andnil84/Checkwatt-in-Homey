# Checkwatt in Homey

Unofficial [Homey](https://homey.app) app for [Checkwatt](https://checkwatt.se) / **EnergyInBalance** — battery, FCR-D income, and site status in Flows and on the device tile.

> **App Store:** Homey expects the plain-text file `readme.txt` in the repo (no URLs in that file per store rules). This `README.md` is for **GitHub** and stays in sync with the same instructions.

---

## English

### What this app does

This app connects Homey to your CheckWatt EnergyInBalance account. You can see battery level, FCR-D income and site status on the device tile, in Insights and in Flows. Sign in with the same username and password you use for the EnergyInBalance service. This app is made by the community, is not official Checkwatt software, and uses unofficial access to the same web APIs the mobile and web clients use. Credit for API understanding belongs in the app manifest contributors section.

### How to get the app on Homey (when it is in the App Store)

When the app is published in the Homey App Store, open Homey on your phone or in the browser, search for Checkwatt or the app name, tap **Install**, and follow the prompts. Then add a device under the app and enter your EnergyInBalance login. For that route you only use Homey's own screens—you do not need Node.js, Git, or the Homey CLI, and you do not need to clone this repository. Many people use a computer to browse the store; the point is that the normal install does not use developer tools. Building from Git is only for testing or development (see below).

### How to install from source (developers and testers)

Use this if you are testing a build from Git, or developing the app yourself.

1. **Prerequisites on your PC:** Install [Node.js](https://nodejs.org/) (LTS recommended). Install [Git](https://git-scm.com/) if you want to clone the repository. Install the Homey CLI globally:
   ```bash
   npm install -g homey
   ```
2. Log in to your Athom account in the CLI:
   ```bash
   homey login
   ```
   Follow the browser step so the CLI is allowed to talk to your Homey.
3. Get the project files on your computer — clone this repo or download the source as ZIP and unpack.
4. In a terminal, `cd` into the project folder (the one that contains `app.json` and `package.json`).
5. Validate the app:
   ```bash
   npx homey app validate
   ```
   Fix any errors before continuing.
6. Install on your Homey Pro over the internet (**no Docker** needed on your PC for this):
   ```bash
   homey app install --remote
   ```
   Wait until the command finishes.
7. On Homey, open the app list, find this app, and **Add device**. Use your EnergyInBalance username and password. If you have several sites under one login, pick the one that appears in the list.
8. For development with live logs in the terminal:
   ```bash
   homey app run --remote
   ```

### FAQ

| Question | Answer |
|----------|--------|
| Why doesn't `git` work? | Git may be missing or not on your `PATH`. Install Git for Windows, restart the terminal, or add Git's `cmd` folder to the system `PATH`. Check with `git --version`. |
| Do I need Docker? | **No** for `homey app install --remote` or `homey app run --remote`. Docker is for other CLI workflows; remote install uses the cloud. |
| No driver / can't add device | The app manifest must list drivers and capabilities correctly. After changes, run `homey app validate` again. Use **Add device** under the app. |
| How do I update after code changes? | Run `homey app install --remote` again from the project folder, or `homey app run --remote` while testing. |
| Where do I enter EnergyInBalance? | In the pairing flow when you add a CheckWatt site, or later under the device settings for the app. |

---

## Svenska

### Vad appen gör

Appen kopplar Homey till din Checkwatt-anläggning i EnergyInBalance. Du kan följa batterinivå, FCR-D-intäkter och status på enhetens platta, i Insights och i flöden. Logga in med samma användarnamn och lösenord som till tjänsten EnergyInBalance. Appen är community-utvecklad, är inte officiell från Checkwatt och använder inofficiell åtkomst till samma webb-API:er som de officiella klienterna. Tack till bidragsgivare står i appmanifestet under `contributors`.

### Så här får du appen på Homey (när den finns i App Store)

När appen finns i Homey App Store: öppna Homey på mobilen eller i webbläsaren, sök efter appen, välj **Installera** och följ guiden. Lägg till en enhet och logga in med EnergyInBalance. Där räcker Homeys egna gränssnitt; du behöver inte Node.js, Git eller Homey CLI, och du behöver inte klona det här repot. Du kan gärna läsa koden på GitHub på datorn — men den vanliga installationen från butiken kräver inte utvecklarverktyg. Att bygga från källkod är bara för test eller utveckling (se nedan).

### Så här installerar du från källkod (utvecklare och testare)

1. Installera Node.js (gärna LTS), ev. Git, sedan: `npm install -g homey`
2. `homey login` — följ webbläsaren.
3. Klona repot eller ladda ner ZIP.
4. Terminal i projektmappen (`app.json` + `package.json`).
5. `npx homey app validate`
6. `homey app install --remote` (ingen Docker på PC för detta).
7. I Homey: lägg till enhet, ange EnergyInBalance.
8. Utveckling: `homey app run --remote`

### Frågor som ofta dyker upp

- **Git fungerar inte:** Installera Git / lägg till PATH — `git --version`
- **Docker?** Inte för `--remote`
- **Ingen drivrutin:** Kör `homey app validate`, lägg till enhet under appen
- **Uppdatering:** `homey app install --remote` igen
- **Var loggar jag in EiB?** Vid pairing eller under enhetens appinställningar

---

## License

MIT — see [LICENSE](LICENSE).
