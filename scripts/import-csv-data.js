const fs = require('fs');
const path = require('path');

// Simple script to import CSV data directly
async function importCSVData() {
  try {
    // Read the CSV file
    const csvPath = path.join(__dirname, '..', 'daily.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    const lines = csvContent.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const dataRows = lines.slice(1);
    
    console.log('CSV Headers:', headers);
    console.log('Data rows found:', dataRows.length);
    
    // Map CSV columns to database schema
    const columnMap = {
      'date': 'data_date',
      'location': 'store_id',
      'total_sales': 'total_sales',
      'transaction_count': 'transaction_count',
      'customer_count': 'customer_count',
      'labor_hours': 'labor_hours',
      'labor_cost': 'labor_cost',
      'food_cost': 'food_cost',
      'waste_amount': 'waste_amount',
      'drive_thru_time': 'drive_thru_time',
      'order_accuracy': 'order_accuracy',
      'customer_satisfaction': 'customer_satisfaction'
    };
    
    const processedRows = [];
    
    for (const row of dataRows) {
      const values = row.split(',').map(v => v.trim());
      if (values.length !== headers.length) continue;
      
      const rowData = {};
      
      headers.forEach((header, index) => {
        const dbColumn = columnMap[header];
        if (dbColumn && values[index]) {
          if (dbColumn === 'data_date') {
            // Parse date to YYYY-MM-DD format
            const date = new Date(values[index]);
            if (!isNaN(date.getTime())) {
              rowData[dbColumn] = date.toISOString().split('T')[0];
            }
          } else if (dbColumn === 'store_id') {
            // Keep store ID as string
            rowData[dbColumn] = values[index];
          } else {
            // Parse numeric values
            const numValue = parseFloat(values[index]);
            if (!isNaN(numValue)) {
              rowData[dbColumn] = numValue;
            }
          }
        }
      });
      
      // Calculate derived metrics
      if (rowData.total_sales && rowData.transaction_count) {
        rowData.average_ticket = rowData.total_sales / rowData.transaction_count;
      }
      if (rowData.labor_cost && rowData.total_sales) {
        rowData.labor_percentage = (rowData.labor_cost / rowData.total_sales) * 100;
      }
      if (rowData.food_cost && rowData.total_sales) {
        rowData.food_cost_percentage = (rowData.food_cost / rowData.total_sales) * 100;
      }
      
      if (rowData.data_date && rowData.store_id) {
        processedRows.push(rowData);
      }
    }
    
    console.log('Processed rows:', processedRows.length);
    console.log('Sample processed data:');
    console.log(JSON.stringify(processedRows[0], null, 2));
    
    // Generate SQL insert statements
    console.log('\n-- SQL INSERT statements for your data:');
    console.log('-- First, ensure stores exist:');
    const storeIds = [...new Set(processedRows.map(row => row.store_id))];
    storeIds.forEach(storeId => {
      console.log(`INSERT INTO stores (id, name, address) VALUES ('${storeId}', '${storeId} - Dairy Queen', '123 Main St') ON CONFLICT (id) DO NOTHING;`);
    });
    
    console.log('\n-- Then insert daily data:');
    processedRows.forEach(row => {
      const columns = Object.keys(row);
      const values = columns.map(col => {
        const value = row[col];
        if (typeof value === 'string') {
          return `'${value}'`;
        }
        return value;
      });
      
      console.log(`INSERT INTO daily_data (${columns.join(', ')}) VALUES (${values.join(', ')}) ON CONFLICT (store_id, data_date) DO UPDATE SET ${columns.map(col => `${col} = EXCLUDED.${col}`).join(', ')};`);
    });
    
  } catch (error) {
    console.error('Error processing CSV:', error);
  }
}

importCSVData();