import { ParsedRecord, CLWDPATEntry, ParserConfig, AnalysisStats } from '@/types/trillium';

/**
 * Generate CLWDPAT entries from analyzed records
 * Following Trillium v7.15 format specifications
 */
export function generateCLWDPAT(records: ParsedRecord[]): string {
  const entries = new Map<string, CLWDPATEntry>();

  records.forEach(record => {
    record.issues.forEach(issue => {
      switch (issue.type) {
        case 'spanish_name': {
          // Full name pattern with first name
          if (issue.position > 0) {
            const firstName = record.tokens[issue.position - 1];
            const fullPattern = `${firstName} ${issue.pattern}`;
            entries.set(fullPattern, {
              pattern: fullPattern,
              instruction: 'INS NAME DEF',
              attributes: `ATT=PERSON,FIRST='${firstName}',LAST='${issue.pattern}'`
            });
          }
          
          // Surname-only pattern
          entries.set(issue.pattern, {
            pattern: issue.pattern,
            instruction: 'INS NAME END',
            attributes: 'ATT=LAST'
          });
          break;
        }

        case 'cultural_name': {
          // Similar to Spanish names
          if (issue.position > 0) {
            const firstName = record.tokens[issue.position - 1];
            const fullPattern = `${firstName} ${issue.pattern}`;
            entries.set(fullPattern, {
              pattern: fullPattern,
              instruction: 'INS NAME DEF',
              attributes: `ATT=PERSON,FIRST='${firstName}',LAST='${issue.pattern}'`
            });
          }
          
          entries.set(issue.pattern, {
            pattern: issue.pattern,
            instruction: 'INS NAME END',
            attributes: 'ATT=LAST'
          });
          break;
        }

        case 'generation_suffix': {
          // Generation suffixes need MOD patterns
          entries.set(issue.pattern, {
            pattern: issue.pattern,
            instruction: 'INS NAME MOD',
            attributes: 'ATT=SUFFIX'
          });
          break;
        }

        case 'business_indicator': {
          // Business indicators
          entries.set(issue.pattern, {
            pattern: issue.pattern,
            instruction: 'INS NAME END',
            attributes: 'ATT=BUSINESS'
          });
          break;
        }

        case 'address_number': {
          // Address numbers should be excluded from name parsing
          entries.set(issue.pattern, {
            pattern: issue.pattern,
            instruction: 'DEL NAME',
            attributes: 'ATT=ADDRESS'
          });
          break;
        }
      }
    });
  });

  // Format entries according to CLWDPAT specifications
  const lines: string[] = [
    '* Generated CLWDPAT patterns for Trillium v7.15',
    '* Date: ' + new Date().toISOString(),
    '*',
    '* IMPORTANT: Longer patterns must come before shorter patterns',
    '* to ensure correct matching precedence',
    '*',
    ''
  ];

  // Sort patterns by length (longest first) to ensure proper precedence
  const sortedEntries = Array.from(entries.values()).sort((a, b) => 
    b.pattern.length - a.pattern.length
  );

  sortedEntries.forEach(entry => {
    const pattern = `'${entry.pattern}'`.padEnd(30);
    const instruction = entry.instruction.padEnd(15);
    lines.push(`${pattern} ${instruction} ${entry.attributes}`);
  });

  return lines.join('\n');
}

/**
 * Generate parser configuration file (pfprsdrv.par)
 */
export function generateParserConfig(config?: Partial<ParserConfig>): string {
  const defaultConfig: ParserConfig = {
    maxNumberNames: 15,
    maxin: 99999,
    threshold: -2,
    genBusinessNames: true,
    ...config
  };

  const lines = [
    '* Trillium v7.15 Parser Configuration',
    '* Generated: ' + new Date().toISOString(),
    '*',
    '* This configuration is optimized for handling cultural name patterns',
    '* and business indicators in personal name fields',
    '*',
    '',
    `MAX_NUMB_NAMES          ${defaultConfig.maxNumberNames}`,
    `MAXIN                   ${defaultConfig.maxin}`,
    `THRESHOLD               ${defaultConfig.threshold}`,
    `GEN_BUSINESS_NAMES      ${defaultConfig.genBusinessNames ? 'Y' : 'N'}`,
    '',
    '* Additional recommendations:',
    '* - Use CLWDPAT patterns for all cultural name particles',
    '* - Test with sample data before production deployment',
    '* - Monitor parsing logs for new pattern discoveries',
    ''
  ];

  return lines.join('\n');
}

/**
 * Calculate statistics from analyzed records
 */
export function calculateStats(records: ParsedRecord[]): AnalysisStats {
  const stats: AnalysisStats = {
    totalRecords: records.length,
    spanishNames: 0,
    culturalNames: 0,
    generationSuffixes: 0,
    businessIndicators: 0,
    addressIssues: 0
  };

  records.forEach(record => {
    record.issues.forEach(issue => {
      switch (issue.type) {
        case 'spanish_name':
          stats.spanishNames++;
          break;
        case 'cultural_name':
          stats.culturalNames++;
          break;
        case 'generation_suffix':
          stats.generationSuffixes++;
          break;
        case 'business_indicator':
          stats.businessIndicators++;
          break;
        case 'address_number':
          stats.addressIssues++;
          break;
      }
    });
  });

  return stats;
}

/**
 * Generate implementation report
 */
export function generateImplementationReport(
  records: ParsedRecord[],
  stats: AnalysisStats
): string {
  const lines = [
    '# Trillium v7.15 Pattern Analysis Report',
    '',
    `Generated: ${new Date().toLocaleString()}`,
    '',
    '## Summary Statistics',
    '',
    `- Total Records Analyzed: ${stats.totalRecords}`,
    `- Spanish Name Issues: ${stats.spanishNames}`,
    `- Other Cultural Names: ${stats.culturalNames}`,
    `- Generation Suffixes: ${stats.generationSuffixes}`,
    `- Business Indicators: ${stats.businessIndicators}`,
    `- Address Number Issues: ${stats.addressIssues}`,
    '',
    '## Implementation Steps',
    '',
    '### 1. Backup Current Configuration',
    '```bash',
    'cp CLWDPAT CLWDPAT.backup',
    'cp pfprsdrv.par pfprsdrv.par.backup',
    '```',
    '',
    '### 2. Update CLWDPAT File',
    '- Add the generated patterns to your CLWDPAT file',
    '- Ensure longer patterns appear before shorter ones',
    '- Test pattern matching with sample data',
    '',
    '### 3. Update Parser Configuration',
    '- Apply the pfprsdrv.par settings',
    '- Adjust MAX_NUMB_NAMES if you have very complex names',
    '- Set GEN_BUSINESS_NAMES=Y to handle business indicators',
    '',
    '### 4. Testing',
    '```bash',
    '# Run parser with test data',
    'trillium_parser -test -input test_data.txt',
    '',
    '# Review parsing logs',
    'tail -f parser.log',
    '```',
    '',
    '### 5. Validation',
    '- Verify all patterns match correctly',
    '- Check for any new parsing errors',
    '- Monitor performance impact',
    '',
    '## Known Limitations (v7.15)',
    '',
    '- NO JOIN_LINES support (requires v14+)',
    '- All multi-token handling requires explicit patterns',
    '- Pattern precedence is length-based only',
    '- Complex regex patterns not supported',
    '',
    '## Pattern Examples',
    ''
  ];

  // Add unique pattern examples
  const uniquePatterns = new Set<string>();
  records.forEach(record => {
    record.issues.forEach(issue => {
      uniquePatterns.add(issue.pattern);
    });
  });

  Array.from(uniquePatterns).slice(0, 10).forEach(pattern => {
    lines.push(`- \`${pattern}\``);
  });

  lines.push('');
  lines.push('## Support');
  lines.push('');
  lines.push('For additional assistance with Trillium v7.15 name parsing:');
  lines.push('- Review the mainframe documentation');
  lines.push('- Test patterns incrementally');
  lines.push('- Keep this report for future reference');

  return lines.join('\n');
}
