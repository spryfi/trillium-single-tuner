import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { validateCLWDPATSection } from "@/utils/validation";

interface ValidationStatusProps {
  clwdpat: string;
}

export const ValidationStatus = ({ clwdpat }: ValidationStatusProps) => {
  const patterns = clwdpat.split('\n').filter(line => 
    !line.trim().startsWith('*') && line.trim().length > 0
  );
  
  const validation = validateCLWDPATSection(patterns);

  if (validation.valid && validation.warnings.length === 0) {
    return (
      <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900">
        <CheckCircle2 className="w-4 h-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          All patterns validated successfully! Ready to implement.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      {validation.errors.length > 0 && (
        <Alert variant="destructive">
          <XCircle className="w-4 h-4" />
          <AlertDescription>
            <p className="font-semibold mb-2">Validation Errors:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {validation.errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {validation.warnings.length > 0 && (
        <Alert className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-900">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            <p className="font-semibold mb-2">Warnings:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {validation.warnings.map((warning, idx) => (
                <li key={idx}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
