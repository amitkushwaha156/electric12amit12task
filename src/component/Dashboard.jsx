import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

function Dashboard() {
  const styles = {
  
 
    chartContainer: {
      marginBottom: '40px',
    },
    chartTitle: {
      fontSize: '1.5rem',
      marginBottom: '15px',
    },
  };

  const [data, setData] = useState({
    totalByType: [],
    makeDistribution: [],
    adoptionTrend: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(
        'https://raw.githubusercontent.com/vedant-patil-mapup/analytics-dashboard-assessment/refs/heads/main/data-to-visualize/Electric_Vehicle_Population_Data.csv'
      )
      .then((response) => {
        const csvData = response.data.split('\n').map((row) => row.split(','));
        const headers = csvData[0];
        const rows = csvData.slice(1);

        const typeCounts = {};
        const makeCounts = {};
        const yearCounts = {};

        rows.forEach((row) => {
          const rowData = Object.fromEntries(headers.map((header, index) => [header, row[index]]));
          const type = rowData['Electric Vehicle Type'];
          if (type) typeCounts[type] = (typeCounts[type] || 0) + 1;

          const make = rowData['Make'];
          if (make) makeCounts[make] = (makeCounts[make] || 0) + 1;

          const year = rowData['Model Year'];
          if (year) yearCounts[year] = (yearCounts[year] || 0) + 1;
        });

        const totalByType = Object.entries(typeCounts).map(([type, count]) => ({ type, count }));
        const makeDistribution = Object.entries(makeCounts).map(([make, count]) => ({ make, count }));
        const adoptionTrend = Object.entries(yearCounts)
          .map(([year, count]) => ({ year: parseInt(year, 10), count }))
          .sort((a, b) => a.year - b.year);

        setData({ totalByType, makeDistribution, adoptionTrend });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching the data:', error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Electric Vehicle Dashboard</h1>
      {isLoading ? (
        <p>Loading data...</p>
      ) : (
        <>
        <div style={{display:"flex"}}>

     
          <div style={styles.chartContainer}>
            <h2 style={styles.chartTitle}>EV Distribution by Type</h2>
            <BarChart width={500} height={300} data={data.totalByType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </div>

          <div style={styles.chartContainer}>
            <h2 style={styles.chartTitle}>Vehicle Make Distribution</h2>
            <PieChart width={500} height={300}>
              <Pie
                data={data.makeDistribution}
                dataKey="count"
                nameKey="make"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#82ca9d"
                label
              />
              <Tooltip />
            </PieChart>
          </div>

          <div style={styles.chartContainer}>
            <h2 style={styles.chartTitle}>EV Adoption Trend by Year</h2>
            <LineChart width={500} height={300} data={data.adoptionTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </div>
          </div>
        </>
      )}
    </div>
  );
}
 export default  Dashboard;