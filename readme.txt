WHAT THIS APP DOES

This app connects Homey to your CheckWatt EnergyInBalance account. You can see battery level, FCR-D income and site status on the device tile, in Insights and in Flows. Sign in with the same username and password you use for the EnergyInBalance service. This app is made by the community, is not official CheckWatt software, and uses unofficial access to the same web APIs the mobile and web clients use. Credit for API understanding belongs in the app manifest contributors section.


HOW TO GET THE APP ON HOMEY (WHEN IT IS IN THE APP STORE)

When the app is published in the Homey App Store, open Homey on your phone or in the browser, search for Checkwatt or the app name, tap Install, and follow the prompts. Then add a device under the app and enter your EnergyInBalance login. For that route you only use Homey's own screens—you do not need Node.js, Git, or the Homey CLI, and you do not need to clone this repository. Many people use a computer to browse the store; the point is that the normal install does not use developer tools. Building from Git is only for testing or development (see below).


HOW TO INSTALL FROM SOURCE (DEVELOPERS AND TESTERS)

Use this if you are testing a build from Git, or developing the app yourself.

1) Prerequisites on your PC: install Node.js (LTS recommended). Install Git if you want to clone the repository. Install the Homey CLI globally: open a terminal and run: npm install -g homey

2) Log in to your Athom account in the CLI: homey login
   Follow the browser step so the CLI is allowed to talk to your Homey.

3) Get the project files on your computer, for example by cloning the GitHub repository, or download the source as a ZIP and unpack it.

4) In a terminal, go into the project folder (the one that contains app.json and package.json).

5) Check that the app validates: npx homey app validate
   Fix any errors before continuing.

6) Install the app on your Homey Pro over the internet (no Docker needed on your PC for this): homey app install --remote
   This uploads the app to your paired Homey and installs it. Wait until the command finishes.

7) On Homey, open the app list, find this app, and add a device. Use the EnergyInBalance username and password when asked. If you have several sites under one login, pick the one that appears in the list.

8) To run the app in development mode with live logs in the terminal instead of a full install, you can use: homey app run --remote


QUESTIONS THAT OFTEN COME UP

Why does the command "git" not work? Git might not be installed, or not on your PATH. Install Git for Windows, then close and reopen the terminal, or add the Git "cmd" folder to your system PATH. After that, "git --version" should print a version number.

Do I need Docker? Not for homey app install --remote or homey app run --remote. Docker is used for some other Homey CLI workflows, but remote install talks to your Homey over the cloud.

The app installs but I cannot add a device or I see no driver. The app manifest must include drivers and capabilities correctly. If you change driver files, run homey app validate again. After installing on Homey, open the app and use Add device.

How do I update the app after changing code? Run homey app install --remote again from the project folder, or use run --remote while testing.

Where do I enter EnergyInBalance? In the device pairing flow after you choose to add a CheckWatt site, or later under the device settings for the app.


---

VAD APPEN GÖR

Appen kopplar Homey till din CheckWatt-anläggning i EnergyInBalance. Du kan följa batterinivå, FCR-D-intäkter och status på enhetens platta, i Insights och i flöden. Logga in med samma användarnamn och lösenord som till tjänsten EnergyInBalance. Appen är community-utvecklad, är inte officiell från CheckWatt och använder inofficiell åtkomst till samma webb-API:er som de officiella klienterna. Tack till bidragsgivare står i appmanifestet under contributors.


SÅ HÄR FÅR DU APPEN PÅ HOMEY (NÄR DEN FINNS I APP STORE)

När appen finns i Homey App Store: öppna Homey på mobilen eller i webbläsaren, sök efter appen, välj Installera och följ guiden. Lägg till en enhet och logga in med EnergyInBalance. Där räcker Homeys egna gränssnitt; du behöver inte Node.js, Git eller Homey CLI, och du behöver inte klona det här repot. Du kan gärna läsa koden på GitHub på datorn—men den vanliga installationen från butiken kräver inte utvecklarverktyg. Att bygga från källkod är bara för test eller utveckling (se nedan).


SÅ HÄR INSTALLERAR DU FRÅN KÄLLKOD (UTVECKLARE OCH TESTARE)

Använd detta om du testar en version från Git eller utvecklar själv.

1) På datorn: installera Node.js (gärna LTS). Installera Git om du ska klona projektet. Installera Homey CLI globalt: npm install -g homey

2) Logga in mot ditt Athom-konto i CLI: homey login
   Följ webbläsaren så att CLI får ansluta till din Homey.

3) Hämta projektfilerna till datorn, till exempel genom att klona GitHub-repot eller ladda ner ZIP och packa upp.

4) Öppna en terminal och gå till projektmappen (den som innehåller app.json och package.json).

5) Kontrollera att appen är giltig: npx homey app validate
   Åtgärda fel innan du går vidare.

6) Installera appen på din Homey Pro över nätet (du behöver inte Docker på PC för detta): homey app install --remote
   Vänta tills kommandot är klart.

7) I Homey: hitta appen, lägg till en enhet och ange användarnamn och lösenord för EnergyInBalance när du uppmanas.

8) För utveckling med loggar i terminalen kan du använda: homey app run --remote


FRÅGOR SOM OFTA DYKER UPP

Varför fungerar inte kommandot git? Git kan saknas eller ligga utanför PATH. Installera Git för Windows, starta om terminalen eller lägg till Gits cmd-mapp i PATH. Testa med git --version.

Måste jag ha Docker? Inte för homey app install --remote eller homey app run --remote. Docker används till andra saker i Homey CLI, men fjärrinstallation pratar med Homey via molnet.

Appen finns men jag kan inte lägga till enhet / ser ingen drivrutin. Manifestet måste innehålla drivrutiner och capabilities korrekt. Kör homey app validate efter ändringar. Lägg till enheten under appen med Lägg till enhet.

Hur uppdatar jag efter kodändring? Kör homey app install --remote igen från projektmappen, eller run --remote under test.

Var anger jag EnergyInBalance? I guiden när du lägger till enheten, eller senare under enhetens inställningar för appen.
