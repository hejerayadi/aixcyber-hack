import { NextResponse } from 'next/server';

export async function GET() {
  // Test with the exact output from your terminal
  const testOutput = `=== 🧠 TOP 3 STARTUP RECOMMENDATIONS ===
                   name  sector country score_total
             Cole Group Fintech      US       1.092
          Hughes-Miller Fintech      US       0.994
Willis Boone and Larson Fintech      US       0.873

📊 AI Portfolio Summary:

Based on the investor profile, the current portfolio, and the top 3 recommended startups, I recommend the following startups as they are aligned with the investor's focus on Fintech sector and the US region. These startups, Cole Group, Hughes-Miller, and Willis Boone and Larson, demonstrate growth potential and are well-suited for a balanced risk tolerance, as they operate in the same sector and region as the existing portfolio, providing a familiar and low-risk investment opportunity.`;

  const lines = testOutput.trim().split('\n');
  const recommendations = [];
  let aiSummary = '';
  let inRecommendations = false;
  let inSummary = false;

  console.log('Test parsing lines:', lines);

  for (const line of lines) {
    if (line.includes('=== 🧠 TOP 3 STARTUP RECOMMENDATIONS ===')) {
      inRecommendations = true;
      continue;
    }
    
    if (line.includes('📊 AI Portfolio Summary:')) {
      inRecommendations = false;
      inSummary = true;
      continue;
    }

    if (inRecommendations && line.trim() && !line.includes('name') && !line.includes('sector') && !line.includes('country') && !line.includes('score_total')) {
      const trimmedLine = line.trim();
      console.log('Processing line:', trimmedLine);
      
      // Try different parsing approaches
      const parts1 = trimmedLine.split(/\s{2,}/);
      const parts2 = trimmedLine.split(/\s+/);
      
      console.log('Split by 2+ spaces:', parts1);
      console.log('Split by single space:', parts2);
      
      if (parts1.length >= 4) {
        const name = parts1[0].trim();
        const sector = parts1[1].trim();
        const country = parts1[2].trim();
        const score = parseFloat(parts1[3].trim());
        
        recommendations.push({
          name,
          sector,
          country,
          score: score,
          scorePercentage: Math.round(score * 100)
        });
      }
    }

    if (inSummary && line.trim()) {
      aiSummary += line.trim() + ' ';
    }
  }

  return NextResponse.json({
    recommendations,
    aiSummary: aiSummary.trim(),
    debug: {
      totalLines: lines.length,
      inRecommendations,
      inSummary
    }
  });
}
