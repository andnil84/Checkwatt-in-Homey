# Checkwatt in Homey

Inofficiell [Homey](https://homey.app)-app för [Checkwatt](https://checkwatt.se) / **EnergyInBalance** — batteri, **momentan effekt** (elnät/sol/batteri från EiB), **nettointäkter** (samma som i portalen: **alla** intäkter), och status i flöden och på enhetens platta. **Spotpris** i Homey får du via en **annan app**; kombinera med flöden om du vill styra mot lågt pris.

> **Butik:** `readme.txt` är den korta texten för Homey App Store (inga URL:er enligt deras regler). **Denna `README.md`** har installation från källkod och FAQ för utvecklare — det återfinns inte i `readme.txt`.
>
> **Developers:** `readme.txt` is the plain-text App Store blurb (no URLs per store rules). **This `README.md`** adds install-from-source steps and a **FAQ** — not duplicated in `readme.txt`.

---

## Svenska

### Vad appen gör

Appen kopplar Homey till din Checkwatt-anläggning i EnergyInBalance. Du kan följa batterinivå, **momentan effekt** mot elnät, batteri och sol (i watt, när EiB levererar värdena), nettointäkter för anläggningen (samma som i portalen—**alla** intäkter), och status på enhetens platta, i Insights och i flöden. I **Flöden** finns villkor som jämför **elnät-, batteri- och soleffekt** med en tröskel i watt (t.ex. styra förbrukning när importen är låg). **Elspot / timpris** ingår inte här — använd en **spotpris- eller elpris-app** i Homey och koppla ihop med flöden om du vill optimera mot pris. Logga in med samma användarnamn och lösenord som till tjänsten EnergyInBalance. Appen är community-utvecklad, är inte officiell från Checkwatt och använder inofficiell åtkomst till samma webb-API:er som de officiella klienterna. Tack till bidragsgivare står i appmanifestet under `contributors`.

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

## Support / Stöd

<a href="https://www.buymeacoffee.com/andnil84"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy me a coffee" width="200"></a>

**English:** If this app saves you time, you can [**buy me a coffee**](https://www.buymeacoffee.com/andnil84) — completely optional. This is a community project and is not affiliated with Checkwatt or Athom.

**Svenska:** Om appen hjälper dig får du gärna [**bjuda på en kaffe**](https://www.buymeacoffee.com/andnil84) — frivilligt. Projektet är hobbydrivet och oberoende av Checkwatt och Athom.

---

## English

Unofficial [Homey](https://homey.app) app for [Checkwatt](https://checkwatt.se) / **EnergyInBalance** — battery, **instantaneous power** (grid, solar, battery from EiB where available), **net income** (same totals as the portal: **all** revenue streams), and site status in Flows and on the device tile. **Spot prices** need a **separate Homey app**; combine with Flows if you want price-based automation.

### What this app does

**In plain terms:** This app connects your **Homey** to your **Checkwatt EnergyInBalance** site (your battery / energy installation). You can use it to:

- See **battery level** (how full the battery is).
- See **instantaneous power** in watts — **grid** (import/export sign as reported by EiB), **battery**, and **solar** when the API provides them (same underlying snapshot as the portal’s energy flow).
- See **net income** for the site — the **same totals** as in the EnergyInBalance portal (**all** revenue streams together, not a single product line).
- See **status** on the **device tile**, in **Insights** (history / graphs), and in **Flows** (automations). Flow **conditions** include comparing **grid, battery, and solar power** (W) to thresholds (e.g. reduce loads when import is high).
- **Spot / day-ahead price** is **not** included — use another Homey app for electricity prices and combine with these sensors in Flows.

**Signing in:** Use the **same username and password** you already use for the EnergyInBalance website and official Checkwatt apps. You are **not** creating a new account — Homey only stores what you enter so it can log in for you.

**Please note:** This app is **community-made**. It is **not** official Checkwatt software. It talks to Checkwatt’s servers using the same kind of **unofficial** web API access as other community tools. API / reverse-engineering credit is listed under **`contributors`** in the app manifest.

### How to get the app on Homey (when it is in the App Store)

**This is the normal, easy path.** You do **not** need a PC, Node.js, Git, or a “developer” setup.

1. **Open Homey** on your phone or tablet, **or** open **[homey.app](https://homey.app)** in a browser (you can use a computer just to click — you still install to your Homey in the cloud).
2. When this app is **published** in the Homey App Store, use **Search** and type **Checkwatt** (or the exact name shown in the store).
3. Tap **Install** and wait until the download finishes.
4. Go to **Apps** → find **Checkwatt** → tap **Add device** (wording may be **Pair** / **Lägg till enhet** depending on language).
5. When the app asks for login, enter your **EnergyInBalance** username and password — the **same** ones you use for the [Checkwatt / EnergyInBalance](https://checkwatt.se) web portal. If your account has **several sites**, pick the site you want when the list appears.
6. You can **change or re-enter** login later under **Device settings** for this app.

If something fails: try on **Wi‑Fi**, confirm your **Athom / Homey** account is the one linked to your **Homey Pro**, and that the app is actually **published** in your region’s store. **Building from Git** is only for testers and developers (see below).

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
Paste the line below, press **Enter**, and wait until the text stops scrolling. You should **not** see a red “error” at the end.

```bash
npm install -g homey
```

**3. Log in to Athom (same account as your Homey)**  
Paste:

```bash
homey login
```

A **browser window** should open. Log in with the **same Athom account** you use in the Homey mobile app, and approve access. Do not close the browser too early.

**4. Validate the app package**  
Paste:

```bash
npx homey app validate
```

Wait until it finishes. It should say the app **validated** successfully. If you see **errors**, read the message — often a typo in `app.json` or a missing file. Fix, then run the command again.

**5. Send the app to your Homey over the internet**  
Paste:

```bash
homey app install --remote
```

You do **not** need **Docker** on your PC for this. Wait until the command **exits** on its own (it can take a minute).

**6. On Homey: add your site**  
On your phone or **[homey.app](https://homey.app)**: **Apps** → this app → **Add device**. Enter your **EnergyInBalance** username and password (the **Checkwatt / portal** login — **not** a special “Homey-only” password). If several sites appear, choose the right one.

**7. (Optional) Development with live logs**  
Paste:

```bash
homey app run --remote
```

Leave the window open while you test. Press **Ctrl+C** to stop.

#### Quick troubleshooting

- **`npm` or `node` is not recognized:** Install Node.js LTS from [nodejs.org](https://nodejs.org/), then **restart the PC**. Open a **new** terminal in the project folder and try again.
- **`homey login` does nothing or hangs:** Check firewall / VPN / ad-blockers; set a **different default browser** temporarily; try again.
- **Git:** Only if you **clone** the repo. If you used **ZIP**, you can ignore Git completely.
- **Docker:** **Not** needed on your PC for `install --remote` or `run --remote`.
- **“No driver” / cannot add device:** Run `npx homey app validate` again. Use **Add device** under **this** app, not only the generic Homey device list.
- **Update after you changed code:** From the project folder, run `homey app install --remote` again (or `homey app run --remote` while testing).
- **Change EnergyInBalance password / username:** Device **settings** for this app in Homey, or remove the device and add it again.

### FAQ

| Question | Answer |
|----------|--------|
| Why doesn't `git` work? | **Git is optional** if you downloaded a ZIP. If you need Git: install [Git for Windows](https://git-scm.com/download/win) (or Mac/Linux package), **restart the terminal**, then run `git --version`. If it still fails, search “add Git to PATH” for your OS. |
| Do I need Docker? | **No** for `homey app install --remote` or `homey app run --remote`. Docker is used for other advanced CLI setups; remote install talks to Athom’s cloud. |
| No driver / can't add device | Run `npx homey app validate`. In Homey, go to **Apps** → **Checkwatt** → **Add device** (not “generic Z-Wave” pairing). |
| How do I update after code changes? | In the project folder: `homey app install --remote` again. For live testing: `homey app run --remote`. |
| Where do I enter EnergyInBalance? | During **Add device** / pairing, **or** later under **Device settings** for the Checkwatt device. |

---

## License

MIT — see [LICENSE](LICENSE).
