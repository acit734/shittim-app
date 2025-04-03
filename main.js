//yt-dlp -f bestaudio --extract-audio --audio-format mp3 --embed-metadata --embed-thumbnail "https://music.youtube.com/watch?v=PtKS1M4H9LQ&si=qooJq1Jrdkqncpt9"
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const { app, BrowserWindow, ipcMain, ipcRenderer } = require("electron");
const { open } = require("lmdb");
const bcrypt = require("bcrypt");
const http = require("http");
const path = require("path");
const fs = require("fs");
let music_metadata;

(async () => {
    music_metadata = await import("music-metadata")
})()

const __interface = path.join(__dirname, "interface");
const __assets = path.join(__interface, "assets");

const mime = JSON.parse(fs.readFileSync(path.join(__dirname, "mime.json")));

app.whenReady().then(() => {
    const win = new BrowserWindow({
        icon: path.join(__assets, "icon.ico"),
        width: 800,
        height: 590,
        minWidth: 800,
        minHeight: 590,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile(path.join(__interface, "index.html"));
    http.createServer((req, res) => {
        let body = "";
        req.on("data", chunk => body += chunk);
        if (req.method === "POST" && req.url === "/req-asset") {
            req.on("end", () => {
                body = JSON.parse(body);

                const file_path = path.join(__assets, ...body);
                const file_buffer = fs.readFileSync(file_path);
                const file_mime = mime[path.parse(file_path).ext.split('.')[1]];

                res.writeHead(200, {
                    "Content-type": file_mime
                });
                res.end(file_buffer)
            })
        } else if (req.method === "POST" && req.url === "/login-page") {
            req.on("end", () => {
                body = JSON.parse(body);

                const db = open("./data/database", {
                    compression: true,
                    maxDbs: 1
                })

                const login_page = db.openDB("login-page");
                const userData = login_page.get("user-credential");

                bcrypt.compare(body.pass, userData.password, (err, result) => {
                    if (err) console.log(err);
                    res.writeHead(200, {
                        "Content-Type" : "application/json"
                    });
                    if (body.user === userData.username && result === true) res.end(JSON.stringify({respond: result}));
                    else if (result === false && body.user === userData.username) res.end(JSON.stringify({respond: false, why: "pass"}));
                    else res.end(JSON.stringify({respond: false, why: "user"}));
                    login_page.close();
                    db.close();
                });
            })
        } else {
            res.writeHead(404);
            res.end("Not Found")
        }
    }).listen(3000)
});