import { ParsedRecord, CLWDPATEntry, ParserConfig, AnalysisStats } from '@/types/trillium';
import { calculateMaxNumbNames, calculateMaxin } from './validation';

/**
 * Format CLWDPAT entry with proper spacing and syntax
 * Pattern must be followed by exactly 4+ spaces, then the command
 */
function formatCLWDPATEntry(entry: CLWDPATEntry): string {
  // Pattern in quotes, padded to 30 chars total
  const pattern = `'${entry.pattern}'`.padEnd(30);
  // Instruction padded to 15 chars
  const instruction = entry.instruction.padEnd(15);
  // Attributes at the end
  return `${pattern} ${instruction} ${entry.attributes}`;
}

/**
 * Group patterns by type for better organization
 */
function groupPatternsByType(entries: CLWDPATEntry[]): Map<string, CLWDPATEntry[]> {
  const groups = new Map<string, CLWDPATEntry[]>();
  
  entries.forEach(entry => {
    const type = entry.attributes.includes('BUSINESS') ? 'business' :
                 entry.attributes.includes('SUFFIX') || entry.attributes.includes('GEN=') ? 'generation' :
                 entry.attributes.includes('ADDRESS') ? 'address' :
                 entry.attributes.includes('LAST') && !entry.attributes.includes('FIRST') ? 'surname' :
                 'person';
    
    if (!groups.has(type)) {
      groups.set(type, []);
    }
    groups.get(type)!.push(entry);
  });
  
  return groups;
}

/**
 * Generate CLWDPAT patterns from analyzed records
 * Following Trillium v7.15 format specifications
 */
export function generateCLWDPAT(records: ParsedRecord[]): string {
  const entries = new Map<string, CLWDPATEntry>();

  records.forEach(record => {
    record.issues.forEach(issue => {
      switch (issue.type) {
        case 'spanish_name':
        case 'cultural_name': {
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
          
          // Particle connector pattern (for multi-token particles)
          const tokens = issue.pattern.split(' ');
          if (tokens.length > 1) {
            const particle = tokens.slice(0, -1).join(' ');
            entries.set(particle, {
              pattern: particle,
              instruction: 'INS NAME MID',
              attributes: 'ATT=CONNECTOR'
            });
          }
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

  // Group entries by type
  const grouped = groupPatternsByType(Array.from(entries.values()));
  
  // Generate output with headers
  const lines: string[] = [
    '*****************************************',
    '* GENERATED CLWDPAT PATTERNS FOR V7.15',
    `* Generated on: ${new Date().toLocaleString()}`,
    '* BY: Trillium Pattern Analyzer',
    '*',
    '* IMPORTANT: Add these patterns to your',
    '* existing CLWDPAT file in order shown.',
    '* Longer patterns MUST come first!',
    '*****************************************',
    ''
  ];

  // Add person name patterns
  if (grouped.has('person')) {
    lines.push('*****************************************');
    lines.push('* PERSON NAME PATTERNS');
    lines.push('* Full names with cultural particles');
    lines.push('*****************************************');
    const personPatterns = grouped.get('person')!
      .sort((a, b) => b.pattern.length - a.pattern.length);
    personPatterns.forEach(entry => lines.push(formatCLWDPATEntry(entry)));
    lines.push('');
  }

  // Add surname patterns
  if (grouped.has('surname')) {
    lines.push('*****************************************');
    lines.push('* SURNAME PATTERNS');
    lines.push('* Last names with particles');
    lines.push('*****************************************');
    const surnamePatterns = grouped.get('surname')!
      .sort((a, b) => b.pattern.length - a.pattern.length);
    surnamePatterns.forEach(entry => lines.push(formatCLWDPATEntry(entry)));
    lines.push('');
  }

  // Add generation patterns
  if (grouped.has('generation')) {
    lines.push('*****************************************');
    lines.push('* GENERATION SUFFIX PATTERNS');
    lines.push('* JR, SR, II, III, etc.');
    lines.push('*****************************************');
    grouped.get('generation')!.forEach(entry => lines.push(formatCLWDPATEntry(entry)));
    lines.push('');
  }

  // Add business patterns
  if (grouped.has('business')) {
    lines.push('*****************************************');
    lines.push('* BUSINESS INDICATOR PATTERNS');
    lines.push('* LLC, INC, CORP, etc.');
    lines.push('*****************************************');
    grouped.get('business')!.forEach(entry => lines.push(formatCLWDPATEntry(entry)));
    lines.push('');
  }

  // Add address patterns
  if (grouped.has('address')) {
    lines.push('*****************************************');
    lines.push('* ADDRESS NUMBER PATTERNS');
    lines.push('* Remove long numbers from name parsing');
    lines.push('*****************************************');
    grouped.get('address')!.forEach(entry => lines.push(formatCLWDPATEntry(entry)));
    lines.push('');
  }

  lines.push('*****************************************');
  lines.push('* END OF GENERATED PATTERNS');
  lines.push('*****************************************');

  return lines.join('\n');
}

/**
 * Generate parser configuration file (pfprsdrv.par)
 */
export function generateParserConfig(
  records: ParsedRecord[],
  config?: Partial<ParserConfig>
): string {
  // Calculate recommended values based on data
  const allTokens = records.map(r => r.tokens);
  const allOriginals = records.map(r => r.original);
  
  const recommendedMaxNames = calculateMaxNumbNames(allTokens);
  const recommendedMaxin = calculateMaxin(allOriginals);
  
  const hasAddressIssues = records.some(r => 
    r.issues.some(i => i.type === 'address_number')
  );
  
  const hasComplexNames = records.some(r =>
    r.issues.some(i => i.type === 'spanish_name' || i.type === 'cultural_name')
  );

  const defaultConfig: ParserConfig = {
    maxNumberNames: recommendedMaxNames,
    maxin: recommendedMaxin || 99999,
    threshold: hasComplexNames ? -2 : -1,
    genBusinessNames: true,
    ...config
  };

  const lines = [
    '****************************************************',
    '* TRILLIUM v7.15 PARSER CONFIGURATION UPDATES',
    `* Generated: ${new Date().toLocaleString()}`,
    '* BY: Trillium Pattern Analyzer',
    '****************************************************',
    '',
    '# INSTRUCTIONS:',
    '# 1. Locate these parameters in your pfprsdrv.par file',
    '# 2. Update the values as shown below',
    '# 3. Add any missing parameters',
    '# 4. Keep all other parameters unchanged',
    '',
    '****************************************************',
    '* RECOMMENDED PARAMETER CHANGES',
    '****************************************************',
    ''
  ];

  // MAX_NUMB_NAMES
  lines.push('# Maximum number of name parts to parse');
  lines.push(`# Current data contains up to ${Math.max(...allTokens.map(t => t.length))} tokens`);
  lines.push(`# Recommended: ${recommendedMaxNames} (includes safety buffer)`);
  lines.push(`MAX_NUMB_NAMES          ${defaultConfig.maxNumberNames}`);
  lines.push('');

  // MAXIN (only if needed)
  if (hasAddressIssues) {
    lines.push('# Maximum length of input address numbers');
    lines.push('# Your data contains 5+ digit numbers');
    lines.push(`# Recommended: ${defaultConfig.maxin}`);
    lines.push(`MAXIN ${defaultConfig.maxin}`);
    lines.push('');
  }

  // THRESHOLD
  lines.push('# Parsing confidence threshold');
  lines.push(`# ${hasComplexNames ? 'Complex names detected - lowering threshold' : 'Standard threshold'}`);
  lines.push(`THRESHOLD          ${defaultConfig.threshold}`);
  lines.push('');

  // GEN_BUSINESS_NAMES
  lines.push('# Generate business name output');
  lines.push('# Recommended: Y to handle business entities properly');
  lines.push(`GEN_BUSINESS_NAMES          ${defaultConfig.genBusinessNames ? 'Y' : 'N'}`);
  lines.push('');

  lines.push('****************************************************');
  lines.push('* VALIDATION NOTES');
  lines.push('****************************************************');
  lines.push('');
  lines.push('After making changes:');
  lines.push('1. Backup your current pfprsdrv.par file');
  lines.push('2. Apply these changes to YOUR file (do not replace entire file)');
  lines.push('3. Test with sample data before production use');
  lines.push('4. Monitor parser logs for unexpected behavior');
  lines.push('');
  
  if (recommendedMaxNames > 15) {
    lines.push('WARNING: MAX_NUMB_NAMES > 15 may impact performance');
    lines.push('');
  }

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
  const recordsWithIssues = records.filter(r => r.issues.length > 0);
  const uniquePatterns = new Set<string>();
  records.forEach(r => r.issues.forEach(i => uniquePatterns.add(i.pattern)));

  const lines = [
    '# Trillium v7.15 Implementation Guide',
    '',
    `Generated: ${new Date().toLocaleString()}`,
    '',
    '## Summary Statistics',
    '',
    `- **Total Records Analyzed**: ${stats.totalRecords}`,
    `- **Records with Issues**: ${recordsWithIssues.length}`,
    `- **Unique Patterns Found**: ${uniquePatterns.size}`,
    `- **Spanish Name Issues**: ${stats.spanishNames}`,
    `- **Cultural Name Issues**: ${stats.culturalNames}`,
    `- **Generation Suffixes**: ${stats.generationSuffixes}`,
    `- **Business Indicators**: ${stats.businessIndicators}`,
    `- **Address Number Issues**: ${stats.addressIssues}`,
    '',
    '## Files to Update',
    '',
    '### 1. CLWDPAT File',
    '',
    '**Location**: Typically in your Trillium data quality project directory',
    '',
    '**Steps**:',
    '1. **Backup current file**: `cp CLWDPAT CLWDPAT.backup.$(date +%Y%m%d)`',
    '2. **Open CLWDPAT in editor**: Use mainframe editor or download to workstation',
    '3. **Find insertion point**: Locate existing name patterns section',
    '4. **Add generated patterns**: Copy patterns from CLWDPAT tab',
    '5. **Check pattern order**: Ensure longer patterns appear before shorter ones',
    '6. **Save file**: Upload back to mainframe if edited locally',
    '',
    '**Important Notes**:',
    '- DO NOT replace entire file - only add new patterns',
    '- Pattern order matters: longest patterns must be first',
    '- Check for duplicate patterns before adding',
    '- Test syntax with a few patterns before adding all',
    '',
    '### 2. pfprsdrv.par File',
    '',
    '**Location**: Typically `pfprsdrv.par` in your Trillium directory',
    '',
    '**Steps**:',
    '1. **Backup current file**: `cp pfprsdrv.par pfprsdrv.par.backup.$(date +%Y%m%d)`',
    '2. **Open file in editor**',
    '3. **Locate these parameters**:',
    '   - `MAX_NUMB_NAMES` (typically around line 10-20)',
    '   - `MAXIN` (add if missing)',
    '   - `THRESHOLD` (typically around line 15-25)',
    '   - `GEN_BUSINESS_NAMES` (typically around line 20-30)',
    '4. **Update values**: Use values from pfprsdrv.par tab',
    '5. **Save file**',
    '',
    '**Parameter Explanations**:',
    '',
    '- **MAX_NUMB_NAMES**: Maximum tokens in a name',
    '  - Too low: Names get truncated',
    '  - Too high: Performance impact',
    '  - Recommended: Actual max + 50% buffer',
    '',
    '- **MAXIN**: Maximum length of address number',
    '  - Only needed if you have 5+ digit numbers',
    '  - Set to 10^(number of digits) - 1',
    '',
    '- **THRESHOLD**: Parsing confidence threshold',
    '  - Lower = more lenient parsing',
    '  - -2 is good for complex multicultural names',
    '  - -1 is standard',
    '',
    '- **GEN_BUSINESS_NAMES**: Generate business entity output',
    '  - Y = Yes (recommended)',
    '  - N = No',
    '',
    '## Testing Procedure',
    '',
    '### Step 1: Syntax Validation',
    '```bash',
    '# Test CLWDPAT syntax',
    'trillium_validator CLWDPAT',
    '',
    '# If no validator available, manually check:',
    '# - All patterns have opening and closing quotes',
    '# - At least 4 spaces between pattern and command',
    '# - Valid commands (INS, MOD, DEL)',
    '# - Valid attributes (ATT=PERSON, ATT=BUSINESS, etc.)',
    '```',
    '',
    '### Step 2: Small Sample Test',
    '```bash',
    '# Create test file with 10-20 records',
    'head -20 problem_data.txt > test_sample.txt',
    '',
    '# Run parser',
    'trillium_parser -input test_sample.txt -output test_results.txt',
    '',
    '# Review results',
    'diff test_sample.txt test_results.txt',
    '```',
    '',
    '### Step 3: Full Dataset Test',
    '```bash',
    '# Run on full dataset',
    'trillium_parser -input full_data.txt -output parsed_results.txt',
    '',
    '# Check for errors',
    'grep ERROR parser.log',
    '',
    '# Verify name party counts',
    '# BEFORE: Names split into multiple parties',
    '# AFTER: Names in single party',
    '```',
    '',
    '## Rollback Procedure',
    '',
    'If patterns cause issues:',
    '',
    '```bash',
    '# Restore backups',
    'cp CLWDPAT.backup.YYYYMMDD CLWDPAT',
    'cp pfprsdrv.par.backup.YYYYMMDD pfprsdrv.par',
    '',
    '# Restart parser service if needed',
    'trillium_restart',
    '```',
    '',
    '## Common Issues',
    '',
    '### Pattern Not Matching',
    '- Check for extra spaces in pattern',
    '- Verify uppercase/lowercase',
    '- Ensure pattern appears before shorter variants',
    '',
    '### Parser Errors',
    '- Validate CLWDPAT syntax (quotes, spacing)',
    '- Check pfprsdrv.par parameters are numeric where required',
    '- Review parser log for specific error messages',
    '',
    '### Performance Issues',
    '- Reduce MAX_NUMB_NAMES if possible',
    '- Remove very long patterns if not needed',
    '- Consider pattern optimization',
    '',
    '## Pattern Examples from Your Data',
    ''
  ];

  // Add some example patterns
  const exampleIssues = recordsWithIssues.slice(0, 5);
  exampleIssues.forEach(record => {
    lines.push(`### Example: ${record.original}`);
    record.issues.forEach(issue => {
      lines.push(`- **Issue**: ${issue.type.replace('_', ' ')}`);
      lines.push(`- **Pattern**: \`${issue.pattern}\``);
      lines.push(`- **Confidence**: ${Math.round(issue.confidence * 100)}%`);
      lines.push(`- **Suggestion**: ${issue.suggestion}`);
    });
    lines.push('');
  });

  lines.push('## Support and Maintenance');
  lines.push('');
  lines.push('- Keep backup files for at least 30 days');
  lines.push('- Document all changes in your change log');
  lines.push('- Monitor parser logs regularly');
  lines.push('- Re-analyze data quarterly for new patterns');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('Generated by Trillium Pattern Analyzer');
  lines.push(`Analysis Date: ${new Date().toLocaleString()}`);

  return lines.join('\n');
}
