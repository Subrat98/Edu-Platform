import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactService } from "@/features/content/contactService";
import { useInstitutionData } from "@/features/institutions/useInstitutionData";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().optional(),
  subject: z.string().min(3, "Please add a short subject."),
  message: z.string().min(10, "Please enter at least 10 characters."),
});

type FormValues = z.infer<typeof schema>;

export interface ContactFormProps {
  title?: string;
  showInstitutionDetails?: boolean;
}

export function ContactForm({ title = "Get in Touch", showInstitutionDetails = true }: ContactFormProps) {
  const { institution } = useInstitutionData();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: contactService.submit,
    onSuccess: (res) => {
      toast.success("Enquiry submitted", {
        description: `Thanks for reaching out — your reference number is ${res.ticketId}. We'll get back to you soon.`,
      });
      reset();
    },
    onError: () => {
      toast.error("Couldn't submit your enquiry", {
        description: "Something went wrong on our end. Please try again in a moment.",
      });
    },
  });

  return (
    <section className="bg-surface">
      <Container className="py-14 sm:py-16">
        <SectionHeading eyebrow="Contact" title={title} />
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
          {showInstitutionDetails && institution ? (
            <div className="space-y-5">
              <div className="flex gap-3">
                <MapPin className="text-accent mt-0.5 size-5 shrink-0" />
                <p className="text-muted-foreground text-sm">
                  {institution.contact.address}, {institution.contact.city}, {institution.contact.state} —{" "}
                  {institution.contact.pincode}
                </p>
              </div>
              <div className="flex gap-3">
                <Phone className="text-accent mt-0.5 size-5 shrink-0" />
                <p className="text-muted-foreground text-sm">
                  {institution.contact.phone}
                  {institution.contact.altPhone ? ` · ${institution.contact.altPhone}` : ""}
                </p>
              </div>
              <div className="flex gap-3">
                <Mail className="text-accent mt-0.5 size-5 shrink-0" />
                <p className="text-muted-foreground text-sm">{institution.contact.email}</p>
              </div>
              <div className="border-border bg-background flex aspect-video items-center justify-center rounded-lg border text-sm">
                <span className="text-muted-foreground">Map: {institution.contact.mapQuery}</span>
              </div>
            </div>
          ) : null}

          <form
            className="space-y-4"
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
            noValidate
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="contact-name">Full name</Label>
                <Input id="contact-name" className="mt-1.5" {...register("name")} aria-invalid={!!errors.name} />
                {errors.name ? <p className="text-destructive mt-1 text-xs">{errors.name.message}</p> : null}
              </div>
              <div>
                <Label htmlFor="contact-email">Email</Label>
                <Input id="contact-email" type="email" className="mt-1.5" {...register("email")} aria-invalid={!!errors.email} />
                {errors.email ? <p className="text-destructive mt-1 text-xs">{errors.email.message}</p> : null}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="contact-phone">Phone (optional)</Label>
                <Input id="contact-phone" type="tel" className="mt-1.5" {...register("phone")} />
              </div>
              <div>
                <Label htmlFor="contact-subject">Subject</Label>
                <Input id="contact-subject" className="mt-1.5" {...register("subject")} aria-invalid={!!errors.subject} />
                {errors.subject ? <p className="text-destructive mt-1 text-xs">{errors.subject.message}</p> : null}
              </div>
            </div>
            <div>
              <Label htmlFor="contact-message">Message</Label>
              <Textarea id="contact-message" rows={5} className="mt-1.5" {...register("message")} aria-invalid={!!errors.message} />
              {errors.message ? <p className="text-destructive mt-1 text-xs">{errors.message.message}</p> : null}
            </div>
            <Button type="submit" disabled={isSubmitting || mutation.isPending} className="w-full sm:w-auto">
              {mutation.isPending ? "Sending…" : "Send Enquiry"}
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}
