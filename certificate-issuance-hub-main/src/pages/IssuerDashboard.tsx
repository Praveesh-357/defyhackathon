import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { QRCodeSVG } from "qrcode.react";
import { Award, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  studentName: z.string().min(2, "Student name must be at least 2 characters"),
  course: z.string().min(2, "Course name must be at least 2 characters"),
  college: z.string().min(2, "College name must be at least 2 characters"),
  year: z.string().regex(/^\d{4}$/, "Please enter a valid year (e.g., 2024)"),
});

type FormData = z.infer<typeof formSchema>;

interface IssuedCredential {
  credentialId: string;
  studentName: string;
  course: string;
  college: string;
  year: string;
}

const IssuerDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [issuedCredential, setIssuedCredential] = useState<IssuedCredential | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      course: "",
      college: "",
      year: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setIssuedCredential(null);

    try {
      const response = await fetch("https://hackathon-production-7d15.up.railway.app/api/issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to issue credential");
      }

      const result = await response.json();
      
      setIssuedCredential({
        credentialId: result.credentialId,
        studentName: data.studentName,
        course: data.course,
        college: data.college,
        year: data.year,
      });

      toast({
        title: "Certificate Issued Successfully!",
        description: `Credential ID: ${result.credentialId}`,
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to issue certificate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Award className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Issue Certificate</h1>
        <p className="mt-2 text-muted-foreground">
          Generate verifiable credentials for students
        </p>
      </div>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Certificate Details</CardTitle>
          <CardDescription>
            Fill in the student information to generate a new certificate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <Input placeholder="Bachelor of Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="college"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College</FormLabel>
                    <FormControl>
                      <Input placeholder="University of Technology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input placeholder="2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Award className="mr-2 h-4 w-4" />
                    Generate & Issue Certificate
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {issuedCredential && (
        <Card className="mt-6 card-shadow border-success/30 bg-success/5">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/20">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <h3 className="mb-1 text-lg font-semibold text-foreground">
                Certificate Issued Successfully!
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Credential ID: <code className="rounded bg-secondary px-2 py-0.5 font-mono text-xs">{issuedCredential.credentialId}</code>
              </p>

              <div className="mb-4 rounded-xl border border-border bg-card p-4">
                <QRCodeSVG
                  value={issuedCredential.credentialId}
                  size={180}
                  level="H"
                  includeMargin
                  className="rounded-lg"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Scan this QR code to verify the certificate
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IssuerDashboard;
