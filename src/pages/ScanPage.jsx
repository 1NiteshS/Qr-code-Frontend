import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";
import "./scan-page.css";

const ScanPage = () => {
    const [message, setMessage] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [isProcessed, setIsProcessed] = useState(false); // Flag to ensure QR code is processed only once
    const navigate = useNavigate();

    const startScan = () => {
        if (isScanning || isProcessed) return; // Prevent re-scanning if already scanning or processed
    
        setIsScanning(true); // Mark the scanner as active
        const html5QrCode = new Html5Qrcode("reader");
    
        html5QrCode
            .start(
                { facingMode: "environment" },
                {
                    fps: 10, // Frames per second
                    qrbox: { width: 250, height: 250 },
                },
                async (decodedText) => {
                    if (isProcessed) return; // Skip processing if already processed
    
                    setIsProcessed(true); // Mark as processed once we start handling
                    try {
                        const fields = decodedText.split("\t"); // Assuming tab separation
                        if (fields.length < 3) {
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
    
                        // Fetch all data from the backend
                        const response = await axios.get(
                            "https://qr-code-backend-4z2z.onrender.com/api/information/get"
                        );

                        // Check if the scanned id already exists in the backend data
                        const dataExists = response.data.data.some((item) => item.id === parsedData.id);
    
                        if (dataExists) {
                            setMessage("Data already exists.");
                        } else {
                            // Send parsed data to the backend if it doesn't exist
                            await axios.post("https://qr-code-backend-4z2z.onrender.com/api/information/add", parsedData);
                            setMessage("Data saved successfully!");
                            // Only navigate to '/data' after successful scan and data handling
                            navigate("/data");
                        }
                        
                    } catch (error) {
                        setMessage("Error saving data.");
                        console.error(error);
                    } finally {
                        // Stop the QR scanner
                        await html5QrCode.stop();
                        setIsScanning(false); // Disable scanning
                    }
                },
                (error) => {
                    console.error("QR Code scanning error:", error);
                    setMessage("Error scanning QR code.");
                }
            )
            .catch((err) => {
                console.error("Error starting QR Code scanner:", err);
                setIsScanning(false);
                setMessage("Error initializing scanner.");
            });
    };

    return (
        <div className="scan-page">
            <div className="scan-container">
                <div className="scan-content">
                    <h1 className="scan-title">Scan QR Code</h1>
                    <div id="reader" className="reader"></div>
                    <div>
                        <button className="scan-button" onClick={startScan} disabled={isScanning || isProcessed}>
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
