# AI Society — Minecraft Edition · Setup Guide (Windows)

Ek Minecraft world jisme **5 AI agents apni society bana ke rehte hain** — kheti, building, mining, khana, security — sab khud. Tum spectator ban ke live dekhte ho.

Ye project successful open-source project **[Mindcraft](https://github.com/kolbytn/mindcraft)** (MIT License, by Kolby Nottingham & the mindcraft-bots community) par based hai. Upar se humne society layer add ki hai: 5 founders with personalities & roles, ek shared village mission ("New Haven"), survival mode, aur persistent memory (society agle din wahi se continue hoti hai jahan chhodi thi).

---

## Pehle ye chahiye (Requirements)

| Cheez | Detail |
|---|---|
| **Minecraft Java Edition** | PC version. **1.21.6 recommended** (server aur tumhara game — dono same version) |
| **Java 21** | Paper server chalane ke liye (Adoptium / Oracle JDK 21) |
| **Node.js 20 LTS** | ⚠️ Node 24 mat use karna — native dependencies (`canvas`) fail ho sakti hain. Node 20 LTS sabse safe hai |
| **Gemini API Key (free)** | Google AI Studio se free key milti hai. Yehi agents ka "dimaag" hai |

> 🔑 **API key sirf `keys.json` file me dalegi — kabhi chat me mat bhejna.**

---

## Step 1 — Minecraft Server (Paper)

1. Ek folder banao: `C:\Users\khele\mc-server`
2. [papermc.io](https://papermc.io/downloads/paper) se **Paper 1.21.6** ki jar download karke us folder me rakho, naam `paper.jar` kar do.
3. Us folder me PowerShell kholo aur server pehli baar chalao:
   ```powershell
   java -Xmx2G -Xms1G -jar paper.jar nogui
   ```
4. Pehli baar chalega to `eula.txt` banegi — usme `eula=false` ko **`eula=true`** karke save karo, phir wahi command dobara chalao.
5. `server.properties` file me ye do cheezein confirm karo (server band karke edit karna):
   - `online-mode=false` ← **sabse zaroori** — bots bina Microsoft login ke (offline auth) join karte hain
   - `server-port=25565` (default yahi hota hai)
6. Server dobara start karo. Console me `Done` aa jaye matlab world ready hai. **Server chalta rehne do** — bots aur tum isi me join karoge.

## Step 2 — Society ka code setup

```powershell
cd C:\Users\khele\OneDrive\Documents\model
git clone https://github.com/Khelendrameena/ai-society-minecraft
cd ai-society-minecraft
npm install
```

`npm install` me 2–5 minute lag sakte hain (Mineflayer + dependencies). Agar `canvas` par error aaye to Node 20 LTS confirm karo.

## Step 3 — Gemini API key lagao

Repo me `keys.json` file kholo aur sirf ye line bharo:

```json
"GEMINI_API_KEY": "apni-key-yahan",
```

Baaki keys khaali chhod do. (Free key: Google AI Studio → "Get API key".)

## Step 4 — Agents ko duniya me bhejo 🚀

```powershell
node main.js
```

- Teeno cheezein ek saath chalni chahiye: **Paper server** (Step 1) → phir ye command.
- 5 bots ek-ek karke join karenge: **Aarav** (farmer), **Meera** (builder), **Kabir** (miner), **Zara** (cook), **Rohan** (guard).
- Browser me **http://localhost:8080** kholo — MindServer UI me har agent ki live status, chat aur activity dikhegi.

## Step 5 — Tum khud andar jaake dekho 👀

1. Minecraft Java (1.21.6) kholo → **Multiplayer → Add Server** → address: `localhost:25565` → Join.
2. Khud ko spectator + OP banao — **server wale console** me ye commands likho:
   ```
   op <tumhara-minecraft-username>
   gamemode spectator <tumhara-minecraft-username>
   ```
3. Ab tum udte hue ghost ban ke poori society live dekh sakte ho. In-game chat me agents ki baatein bhi padh sakte ho.
4. Kisi agent se baat karni ho to in-game chat me likho: `/msg Aarav kaise ho?`

---

## Kaise chalti hai society

- Har agent ka apna **role + personality** hai (`profiles/society/*.json`) aur sabko ek shared mission mila hai: **New Haven** gaon banana aur badhana.
- Agents ke paas **memory** hai — `load_memory: true` rakha hai, to `node main.js` band karke dobara chalane par society wahi se aage badhegi (memory `bots/` folder me save hoti hai, git me nahi jaati).
- Rokna ho to `node main.js` wale terminal me **Ctrl+C**. Server alag se band karna ho to server console me `stop`.

## Agents kam/zyada karna

- Pehle din API slow lage to 2–3 agents se start karo: `settings.js` ki `profiles` list me baaki profiles ke aage `//` laga do.
- Naya agent = `profiles/society/` me ek aur JSON (kisi existing ko copy karke naam/personality badal do) + `settings.js` me uski line add.

## Bilkul free option — Local Ollama (bina API key)

Agar Gemini ki jagah apne PC ka local model use karna ho (free, par slow aur thoda kam smart):

1. Ollama me ek model pull karo, jaise `ollama pull qwen2.5:7b`
2. Agent profile me `"model": "gemini-3.8-flash"` ki jagah ye lagao:
   ```json
   "model": { "api": "ollama", "model": "qwen2.5:7b", "url": "http://127.0.0.1:11434" }
   ```
   Aur `"embedding"` wali line hata do (local mode me simple fallback chalega).

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Bots connect hi nahi ho rahe / `ECONNREFUSED` | Paper server chal raha hai? Pehle server, phir `node main.js` — yehi order |
| Bot join hote hi disconnect | `server.properties` me `online-mode=false` hai na? Aur tumhara game bhi 1.21.6 hai? |
| "Outdated server/client" error | Server (Paper), tumhara Minecraft aur bots — teeno ka version **1.21.6** rakho |
| Gemini `429` / quota error | Free tier ki limit — agents 5 se kam karke 2–3 rakho, ya profile me `cooldown` badhao |
| `npm install` fail — `gl` package, 'No prebuilt binaries' / 'Could not find any Visual Studio' | **Node version galat hai.** Node 24/26 ke liye `gl` ke prebuilt binaries nahi hain, isliye wo compile karne ki koshish karta hai aur Visual Studio maangta hai. Fix: **Node 20 LTS** install karo (nvm-windows se `nvm install 20` + `nvm use 20`, ya nodejs.org se 20 LTS installer), phir `node_modules` aur `package-lock.json` delete karke `npm install` dobara chalao. Visual Studio wala raasta mat lo — heavy hai aur Node 26 par phir bhi risky hai |
| Agents kuch kar hi nahi rahe | MindServer UI (localhost:8080) me error dekho; aksar wajah galat API key hoti hai |
| `patch-package` ERROR — mineflayer patch fail | Versions drift ka issue tha — repo me ab versions pin kiye hue hain aur `package-lock.json` committed hai. Fix: `git pull`, phir `rm -rf node_modules` karke `npm install` (lockfile ko mat delete karna — wahi exact versions laati hai). Saare 6 patches ✔ lagne chahiye |
| Duniya reset karni hai | Server band karke `mc-server` ka `world` folder delete kar do; society ki memory reset karni ho to repo ka `bots/` folder delete karo |

## Safety notes

- Server sirf tumhare PC (`localhost`) par hai — bahar se koi join nahi kar sakta, port forward mat karna.
- `settings.js` me `allow_insecure_coding: false` hi rakho (default) — agents ko tumhare PC par code chalane ki permission mat do.
- API key wali `keys.json` git me commit nahi hoti (`.gitignore` me hai) — phir bhi key kahin share mat karna.
