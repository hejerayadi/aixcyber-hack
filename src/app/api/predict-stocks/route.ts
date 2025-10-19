import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Run the Python script to get predictions
    const { stdout, stderr } = await execAsync('python test_model.py', {
      cwd: process.cwd() + '/bourse_ai_workflow'
    });

    if (stderr) {
      console.error('Python script error:', stderr);
      return NextResponse.json({ error: 'Model prediction failed' }, { status: 500 });
    }

    // Parse the output to extract predictions
    const lines = stdout.trim().split('\n');
    const predictions: { [key: string]: number } = {};
    
    for (const line of lines) {
      if (line.includes(':')) {
        const [ticker, price] = line.split(':');
        const cleanTicker = ticker.trim();
        const cleanPrice = parseFloat(price.trim());
        
        // Map the tickers to match our frontend
        if (cleanTicker === 'GOOG') {
          predictions['GOOGL'] = cleanPrice;
        } else {
          predictions[cleanTicker] = cleanPrice;
        }
      }
    }

    return NextResponse.json({ predictions });
  } catch (error) {
    console.error('Error running prediction model:', error);
    return NextResponse.json({ error: 'Failed to run prediction model' }, { status: 500 });
  }
}
