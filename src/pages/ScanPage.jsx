import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";
import "./scan-page.css"

const ScanPage = () => {
    const [message, setMessage] = useState("");
    const [isScanning, setIsScanning] = useState(false)
    const navigate = useNavigate();

    const startScan = () => {
        setIsScanning(true)
        const html5QrCode = new Html5Qrcode("reader");
        html5QrCode
        .start(
            { facingMode: "environment" },
            {
            fps: 10, // Frames per second
            qrbox: { width: 250, height: 250 },
            },
            async (decodedText) => {
            try {
                const fields = decodedText.split("\t"); // Assuming tab separation
                if (fields.length < 1) {
                    setMessage("Invalid QR code format");
                    return;
                }

                const parsedData = {
                    id: fields[0],
                    name: fields[1],
                    position: fields[2],
                    organization: fields[3],
                    country: fields[4],
                    email: fields[5],
                    phoneNo: fields[6],
                };

                // Send parsed data to the backend
                await axios.post("https://qr-code-backend-4z2z.onrender.com/api/information/add",parsedData);

                setMessage("Data saved successfully!");
            } catch (error) {
                setMessage("Error saving data.");
                console.error(error);
            } finally {
                // Stop the QR scanner and navigate regardless of success or failure
                await html5QrCode.stop(); // Stop scanner
                setIsScanning(false)
                navigate("/data"); // Redirect
            }
            },
            (error) => {
                console.error("QR Code scanning error:", error);
            }
        )
        .catch((err) => {
            console.error("Error starting QR Code scanner:", err)
            setIsScanning(false)
        });
    };

    return (
        <div className="scan-page">
            <div className="scan-container">
                <div className="scan-content">
                    <h1 className="scan-title">Scan QR Code</h1>
                    <div id="reader" className="reader"></div>
                    <div>
                    <button className="scan-button" onClick={startScan} disabled={isScanning}>
                        {isScanning ? "Scanning..." : "Start Scanning"}
                        </button>
                        <p className={`scan-message ${message.includes("Error") ? "error" : "success"}`}>{message}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScanPage;
