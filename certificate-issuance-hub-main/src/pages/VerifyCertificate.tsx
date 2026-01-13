import { useState } from "react";
import { ShieldCheck, ShieldX, Loader2, Search, User, GraduationCap, Building2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QRScanner from "@/components/QRScanner";
import { useToast } from "@/hooks/use-toast";

interface CertificateDetails {
  studentName: string;
  course: string;
  college: string;
  year: string;
}

interface VerificationResult {
  verified: boolean;
  details?: CertificateDetails;
}

const VerifyCertificate = () => {
  const [credentialId, setCredentialId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const { toast } = useToast();

  const handleVerify = async (id: string) => {
    if (!id.trim()) {
      toast({
        title: "Error",
        description: "Please enter a credential ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("https://hackathon-production-7d15.up.railway.app/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credentialId: id.trim() }),
      });

      if (!response.ok) {
        throw new Error("Verification request failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify certificate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleScan = (scannedId: string) => {
    setCredentialId(scannedId);
    handleVerify(scannedId);
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <ShieldCheck className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Verify Certificate</h1>
        <p className="mt-2 text-muted-foreground">
          Scan a QR code or enter a credential ID to verify
        </p>
      </div>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Verification Method</CardTitle>
          <CardDescription>
            Choose how you'd like to verify the certificate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="scan" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="scan">Scan QR Code</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>

            <TabsContent value="scan" className="mt-6">
              <QRScanner
                onScan={handleScan}
                onError={(error) => {
                  toast({
                    title: "Scanner Error",
                    description: error,
                    variant: "destructive",
                  });
                }}
              />
            </TabsContent>

            <TabsContent value="manual" className="mt-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="credentialId" className="text-sm font-medium text-foreground">
                    Credential ID
                  </label>
                  <Input
                    id="credentialId"
                    placeholder="Enter credential ID..."
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleVerify(credentialId)}
                  />
                </div>
                <Button
                  onClick={() => handleVerify(credentialId)}
                  disabled={isLoading || !credentialId.trim()}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Verify Certificate
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {result && (
        <Card
          className={`mt-6 card-shadow ${
            result.verified
              ? "border-success/30 bg-success/5"
              : "border-destructive/30 bg-destructive/5"
          }`}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              {result.verified ? (
                <>
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
                    <ShieldCheck className="h-8 w-8 text-success" />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold text-success">
                    Certificate Verified
                  </h3>
                  <p className="mb-6 text-sm text-muted-foreground">
                    This certificate is authentic and valid
                  </p>

                  {result.details && (
                    <div className="w-full max-w-sm space-y-3 rounded-xl border border-border bg-card p-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Student Name</p>
                          <p className="font-medium text-foreground">{result.details.studentName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <GraduationCap className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Course</p>
                          <p className="font-medium text-foreground">{result.details.course}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">College</p>
                          <p className="font-medium text-foreground">{result.details.college}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Year</p>
                          <p className="font-medium text-foreground">{result.details.year}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20">
                    <ShieldX className="h-8 w-8 text-destructive" />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold text-destructive">
                    Invalid Certificate
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This credential ID could not be verified
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VerifyCertificate;
