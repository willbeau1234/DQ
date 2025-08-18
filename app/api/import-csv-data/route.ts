import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get current user (for auth check)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    console.log('[IMPORT] Starting CSV data import...')
    
    // Read the CSV file
    const csvPath = path.join(process.cwd(), 'daily.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    
    const lines = csvContent.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const dataRows = lines.slice(1)
    
    console.log('[IMPORT] Processing', dataRows.length, 'data rows')
    
    // Column mapping
    const columnMap: { [key: string]: string } = {
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
    }
    
    // First, ensure stores exist
    const storeIds = new Set<string>()
    for (const row of dataRows) {
      const values = row.split(',').map(v => v.trim())
      if (values.length >= 2 && values[1]) {
        storeIds.add(values[1])
      }
    }
    
    console.log('[IMPORT] Creating stores:', Array.from(storeIds))
    
    for (const storeId of storeIds) {
      const { error: storeError } = await supabase
        .from('stores')
        .upsert({
          id: storeId,
          name: `${storeId} - Dairy Queen`,
          address: '123 Main St'
        }, { 
          onConflict: 'id',
          ignoreDuplicates: false
        })
      
      if (storeError) {
        console.error('[IMPORT] Error creating store:', storeId, storeError)
      }
    }
    
    // Process and insert daily data
    let processedCount = 0
    const processedRows = []
    
    for (const row of dataRows) {
      const values = row.split(',').map(v => v.trim())
      if (values.length !== headers.length) continue
      
      const rowData: any = {}
      
      headers.forEach((header, index) => {
        const dbColumn = columnMap[header]
        if (dbColumn && values[index]) {
          if (dbColumn === 'data_date') {
            const date = new Date(values[index])
            if (!isNaN(date.getTime())) {
              rowData[dbColumn] = date.toISOString().split('T')[0]
            }
          } else if (dbColumn === 'store_id') {
            rowData[dbColumn] = values[index]
          } else {
            const numValue = parseFloat(values[index])
            if (!isNaN(numValue)) {
              rowData[dbColumn] = numValue
            }
          }
        }
      })
      
      // Calculate derived metrics
      if (rowData.total_sales && rowData.transaction_count) {
        rowData.average_ticket = rowData.total_sales / rowData.transaction_count
      }
      if (rowData.labor_cost && rowData.total_sales) {
        rowData.labor_percentage = (rowData.labor_cost / rowData.total_sales) * 100
      }
      if (rowData.food_cost && rowData.total_sales) {
        rowData.food_cost_percentage = (rowData.food_cost / rowData.total_sales) * 100
      }
      
      if (rowData.data_date && rowData.store_id) {
        processedRows.push(rowData)
      }
    }
    
    console.log('[IMPORT] Inserting', processedRows.length, 'processed rows')
    
    // Batch insert the data
    const { data: insertResult, error: insertError } = await supabase
      .from('daily_data')
      .upsert(processedRows, {
        onConflict: 'store_id,data_date',
        ignoreDuplicates: false
      })
      .select()
    
    if (insertError) {
      console.error('[IMPORT] Insert error:', insertError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to insert data: ' + insertError.message 
      }, { status: 500 })
    }
    
    processedCount = processedRows.length
    
    console.log('[IMPORT] Successfully imported', processedCount, 'records')
    
    return NextResponse.json({
      success: true,
      message: `Successfully imported ${processedCount} records`,
      stores: Array.from(storeIds),
      recordCount: processedCount
    })

  } catch (error: any) {
    console.error('[IMPORT] Import error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Import failed'
    }, { status: 500 })
  }
}