import express from "express";
import cors from "cors";
import { ethers } from "ethers";
import { randomUUID } from "crypto";
import QRCode from "qrcode";
import { contract } from "./blockchain.js";

const app = express();
app.use(cors());
app.use(express.json());

// In-memory DB (hackathon safe)
const db = {};




//ISSUE API
app.post("/api/issue", async (req, res) => {
  try {
    const data = req.body;

    const credentialId = randomUUID();
    const issuedAt = Date.now();

    const payload = {
      credentialId,
      issuedAt,
      ...data
    };

    db[credentialId] = payload;

    const hash = ethers.keccak256(
      ethers.toUtf8Bytes(JSON.stringify(payload))
    );

    await contract.issueCredential(hash);

    const qrCode = await QRCode.toDataURL(
      JSON.stringify({ credentialId })
    );

    res.json({ credentialId, qrCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//VERIFY API

app.post("/api/verify", async (req, res) => {
  try {
    const { credentialId } = req.body;

    const data = db[credentialId];
    if (!data) return res.json({ verified: false });

    const hash = ethers.keccak256(
      ethers.toUtf8Bytes(JSON.stringify(data))
    );

    const isValid = await contract.verifyCredential(hash);

    res.json({
      verified: isValid,
      certificate: isValid ? data : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

