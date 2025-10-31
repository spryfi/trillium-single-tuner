import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AnyPattern } from '@/engine/patterns';
import { generateReleaseZip } from '@/utils/zipGenerator';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CompilePanelProps {
  queue: AnyPattern[];
  defaultCountryCode: string;
}

export const CompilePanel = ({ queue, defaultCountryCode }: CompilePanelProps) => {
  const [releaseTag, setReleaseTag] = useState('');
  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const [commentChar, setCommentChar] = useState('#');
  const [isCompiling, setIsCompiling] = useState(false);

  // Parser parameters
  const [streetParsingDepth, setStreetParsingDepth] = useState('9');
  const [noSpecialComma, setNoSpecialComma] = useState('N');
  const [noSpecialOrdinal, setNoSpecialOrdinal] = useState('');
  const [originalMeanings, setOriginalMeanings] = useState('1');

  // Driver paths
  const [inpDdname, setInpDdname] = useState('./data/input.txt');
  const [outDdname, setOutDdname] = useState('./data/parsout.txt');
  const [paParmname, setPaParmname] = useState('./parms/pfparser.par');
  const [statFname, setStatFname] = useState('./data/pastat.txt');
  const [ddlInpFname, setDdlInpFname] = useState('./dict/input.ddl');
  const [ddlPreposFname, setDdlPreposFname] = useState('./dict/prepos.ddl');
  const [ddlOutFname, setDdlOutFname] = useState('./dict/parsout.ddl');
  const [ddlInpRname, setDdlInpRname] = useState('INPUT');
  const [ddlPreposRname, setDdlPreposRname] = useState('PREPOS');
  const [ddlOutRname, setDdlOutRname] = useState('PARSOUT');
  const [printNthCount, setPrintNthCount] = useState('100');

  const handleCompile = async () => {
    if (!releaseTag.trim()) {
      toast.error('Release tag is required');
      return;
    }

    if (queue.length === 0) {
      toast.error('Queue is empty');
      return;
    }

    setIsCompiling(true);
    try {
      const blob = await generateReleaseZip(queue, {
        releaseTag,
        countryCode,
        commentChar,
        parserParams: {
          STREET_PARSING_DEPTH: streetParsingDepth,
          NO_SPECIAL_COMMA_NAME_REVERSE_SERVICE: noSpecialComma,
          NO_SPECIAL_ORDINAL_STREET_SERVICE: noSpecialOrdinal,
          ORIGINAL_MEANINGS_OPTION: originalMeanings
        },
        driverPaths: {
          inp: inpDdname,
          outp: outDdname,
          pfparser: paParmname,
          stat: statFname,
          ddlIn: ddlInpFname,
          ddlPrepos: ddlPreposFname,
          ddlOut: ddlOutFname,
          rIn: ddlInpRname,
          rPrepos: ddlPreposRname,
          rOut: ddlOutRname,
          printNth: parseInt(printNthCount) || 100
        }
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${releaseTag.replace(/\s+/g, '_')}_${countryCode}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Release compiled and downloaded');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Compilation failed');
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compile & Download</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Release Tag *</label>
            <Input
              value={releaseTag}
              onChange={(e) => setReleaseTag(e.target.value)}
              placeholder="e.g., R1.0"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Country Code</label>
            <Input
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
              maxLength={2}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Comment Char</label>
            <Input
              value={commentChar}
              onChange={(e) => setCommentChar(e.target.value.slice(0, 1))}
              maxLength={1}
            />
          </div>
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="parser-params">
            <AccordionTrigger>Parser Parameters</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">STREET_PARSING_DEPTH</label>
                  <Input value={streetParsingDepth} onChange={(e) => setStreetParsingDepth(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">NO_SPECIAL_COMMA_NAME_REVERSE_SERVICE</label>
                  <Input value={noSpecialComma} onChange={(e) => setNoSpecialComma(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">NO_SPECIAL_ORDINAL_STREET_SERVICE</label>
                  <Input value={noSpecialOrdinal} onChange={(e) => setNoSpecialOrdinal(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">ORIGINAL_MEANINGS_OPTION</label>
                  <Input value={originalMeanings} onChange={(e) => setOriginalMeanings(e.target.value)} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="driver-paths">
            <AccordionTrigger>Driver File Paths</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-3">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">INP_DDNAME</label>
                  <Input value={inpDdname} onChange={(e) => setInpDdname(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">OUT_DDNAME</label>
                  <Input value={outDdname} onChange={(e) => setOutDdname(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">PA_PARMNAME</label>
                  <Input value={paParmname} onChange={(e) => setPaParmname(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">STAT_FNAME</label>
                  <Input value={statFname} onChange={(e) => setStatFname(e.target.value)} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ddl-paths">
            <AccordionTrigger>DDL Paths</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-3">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">DDL_INP_FNAME</label>
                  <Input value={ddlInpFname} onChange={(e) => setDdlInpFname(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">DDL_PREPOS_FNAME</label>
                  <Input value={ddlPreposFname} onChange={(e) => setDdlPreposFname(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">DDL_OUT_FNAME</label>
                  <Input value={ddlOutFname} onChange={(e) => setDdlOutFname(e.target.value)} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-sm font-medium mb-1 block">DDL_INP_RNAME</label>
                    <Input value={ddlInpRname} onChange={(e) => setDdlInpRname(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">DDL_PREPOS_RNAME</label>
                    <Input value={ddlPreposRname} onChange={(e) => setDdlPreposRname(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">DDL_OUT_RNAME</label>
                    <Input value={ddlOutRname} onChange={(e) => setDdlOutRname(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">PRINT_NTH_COUNT</label>
                  <Input value={printNthCount} onChange={(e) => setPrintNthCount(e.target.value)} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button
          onClick={handleCompile}
          disabled={isCompiling || queue.length === 0}
          size="lg"
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          {isCompiling ? 'Compiling...' : 'Close Release & Download ZIP'}
        </Button>
      </CardContent>
    </Card>
  );
};
