# Checkwatt - Unofficial (Homey)

Inofficiell [Homey](https://homey.app)-app för [Checkwatt](https://checkwatt.se) / **EnergyInBalance** — batteri, **momentan effekt** (elnät/sol/batteri från EiB), **nettointäkter** (samma som i portalen: **alla** intäkter), och status i flöden och på enhetens platta. **Spotpris** i Homey får du via en **annan app**; kombinera med flöden om du vill styra mot lågt pris.

> **Butik:** `readme.txt` är den korta texten för Homey App Store (inga URL:er enligt deras regler). **Denna `README.md`** har utökad information på svenska och engelska — det återfinns inte i `readme.txt`.
>
> **Developers:** `readme.txt` is the plain-text App Store blurb (no URLs per store rules). **This `README.md`** adds expanded Swedish and English sections — not duplicated in `readme.txt`.

---

## Svenska

### Vad appen gör

Appen kopplar Homey till din Checkwatt-anläggning i EnergyInBalance. 
Du kan följa batterinivå, **momentan effekt** mot elnät, batteri och sol (i watt, när EiB levererar värdena), nettointäkter för anläggningen, och status.
I **Flöden** finns villkor som jämför **elnät-, batteri- och soleffekt** med en tröskel i watt (t.ex. styra förbrukning när importen är låg).
Logga in med samma användarnamn och lösenord som till tjänsten EnergyInBalance. Appen är community-utvecklad, är inte officiell från Checkwatt och använder inofficiell åtkomst till samma webb-API:er som de officiella klienterna. Tack till bidragsgivare står i appmanifestet under `contributors`.

### Så här får du appen på Homey

Öppna: https://homey.app/sv-se/apps/homey-pro/
Sök efter checkwatt
Välj installera
Gå till din Homey: https://my.homey.app/
Klicka på plustecknet längst upp till höger, lägg till
Leta upp eller sök efter checkwatt
Logga in på ditt Energy In Balance konto
Därefter bör du kunna se Checkwatt ikonen i ditt hem


## Support / Stöd

<a href="https://www.buymeacoffee.com/andnil84"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy me a coffee" width="200"></a>

**English:** If this app saves you time, you can [**buy me a coffee**](https://www.buymeacoffee.com/andnil84) — completely optional. This is a community project and is not affiliated with Checkwatt or Athom.

**Svenska:** Om appen hjälper dig får du gärna [**bjuda på en kaffe**](https://www.buymeacoffee.com/andnil84) — frivilligt. Projektet är hobbydrivet och oberoende av Checkwatt och Athom.

---

## English

Unofficial [Homey](https://homey.app) app for [Checkwatt](https://checkwatt.se) / **EnergyInBalance** — battery, **instantaneous power** (grid, solar, battery from EiB where available), **net income** (same totals as the portal: **all** revenue streams), and site status in Flows and on the device tile. **Spot prices** need a **separate Homey app**; combine with Flows if you want price-based automation.

### What this app does

The app connects Homey to your Checkwatt site in **EnergyInBalance**. You can monitor battery level, **instantaneous power** to the grid, battery and solar (in watts, when EiB provides the values), net income for the site, and status. In **Flows**, **conditions** let you compare **grid, battery, and solar power** to a threshold in watts (for example, steer consumption when import is low). Sign in with the **same username and password** as for the EnergyInBalance service. The app is **community-developed**, is **not** official Checkwatt software, and uses **unofficial** access to the same web APIs as Checkwatt’s official clients. Contributor credits are listed under **`contributors`** in the app manifest.

### How to get the app on Homey

Open: https://homey.app/en-us/apps/homey-pro/  
Search for **checkwatt**  
Choose **Install**  
Go to your Homey: https://my.homey.app/  
Tap **+** at the top right, **Add**  
Find or search for **checkwatt**  
Sign in with your **EnergyInBalance** account  
After that, you should see the Checkwatt icon in your home.


---
## License

MIT — see [LICENSE](LICENSE).
