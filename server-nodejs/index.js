const express = require("express");
const Database = require("@codegame/open-db");
const argon = require("argon2");
const uuid = require("uuid");

const DATABASE = new Database("vermaps", "main-0.db");
DATABASE.setScheme({
    id: {
        type: "string",
        required: true
    },
    name: {
        type: "string",
        required: true
    },
    platform: {
        type: "string",
        required: true
    },
    url: {
        type: "string",
        required: true
    },
    releaseTime: {
        type: "number",
        required: true
    },
    owner: {
        type: "string",
        required: true
    },
    version: {
        type: "string",
        required: true
    },
    verMajor: {
        type: "number",
        required: true
    },
    verMinor: {
        type: "number",
        required: true
    },
    verPatch: {
        type: "number",
        required: true
    },
})

const app = express();

app.use(express.json());

app.get("/version/:appid", (req, res) => {
    const appid = req.params.appid;
    try {
        let data = DATABASE.getItem(appid);
        if (data) {
            res.status(200).json(data);
        } else {
            throw "PROVIDED KEY DOES NOT EXIST"
        }
    } catch (error) {
        res.status(500).json({
            message: "Error fetching data: " + error
        });
    }
});

app.post("/version/:appid", async (req, res) => {
    const appid = req.params.appid;

    try {
        let data = DATABASE.getItem(appid);
        if (data) {
            if (await argon.verify(data.owner, `${req.body.username}+${req.body.password}`)) {
                data.name = req.body.name;
                data.platform = req.body.platform;
                data.url = req.body.url;
                data.releaseTime = Date.now();
                data.version = `${req.body.verMajor}.${req.body.verMinor}.${req.body.verPatch}`;
                data.verMajor = req.body.verMajor;
                data.verMinor = req.body.verMinor;
                data.verPatch = req.body.verPatch;
                DATABASE.setItem(appid, data);
                res.status(200).json(data);
            } else {
                throw "INVALID CREDENTIALS"
            }
        } else {
            throw "PROVIDED KEY DOES NOT EXIST"
        }
    } catch (error) {
        res.status(500).json({
            message: "Error updating data: " + error
        });
    }
});

app.post("/version", async (req, res) => {
    try {
        let data = {}
        data.id = uuid.v4();
        data.name = req.body.name;
        data.platform = req.body.platform;
        data.url = req.body.url;
        data.releaseTime = Date.now();
        data.owner = await argon.hash(`${req.body.username}+${req.body.password}`);
        data.version = `${req.body.verMajor}.${req.body.verMinor}.${req.body.verPatch}`;
        data.verMajor = req.body.verMajor;
        data.verMinor = req.body.verMinor;
        data.verPatch = req.body.verPatch;
        DATABASE.createItem(data.id, data);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: "Error creating data: " + error
        });
    }
});

app.listen(5500, () => {
    console.log("Server started on port 5500");
});

