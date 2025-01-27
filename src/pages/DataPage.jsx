import { useEffect, useState } from 'react';
import axios from 'axios';
import "./data-page.css"

const DataPage = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/information/get');
            
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
        };
        fetchData();
    }, []);

    return (
        <div className="data-page">
        <h1 className="data-title">Stored Data</h1>
        {data.length === 0 ? (
            <p className="no-data">No data found.</p>
        ) : (
            <div className="table-container">
            <table className="data-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Organization</th>
                    <th>Country</th>
                    <th>Email</th>
                    <th>Phone No</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.position}</td>
                    <td>{item.organization}</td>
                    <td>{item.country}</td>
                    <td>{item.email}</td>
                    <td>{item.phoneNo}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        </div>
    );
};

export default DataPage;
