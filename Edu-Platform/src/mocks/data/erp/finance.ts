import { allStudents } from "./studentsGuardians";
import { programmes } from "../programmes";
import type { FeeHead, FeeStructure, Invoice, InvoiceStatus, Payment, PaymentMode } from "@/types";

export const feeHeads: FeeHead[] = [
  { id: "fh-tuition", institutionId: "school", name: "Tuition Fee", frequency: "Term" },
  { id: "fh-transport", institutionId: "school", name: "Transport Fee", frequency: "Term" },
  { id: "fh-activity", institutionId: "school", name: "Activity Fee", frequency: "Annual" },
  { id: "fh-col-tuition", institutionId: "college", name: "Tuition Fee", frequency: "Term" },
  { id: "fh-col-exam", institutionId: "college", name: "Examination Fee", frequency: "Term" },
  { id: "fh-col-lab", institutionId: "college", name: "Laboratory Fee", frequency: "Annual" },
];

const feeStructures: FeeStructure[] = [];
feeHeads
  .filter((h) => h.institutionId === "school")
  .forEach((h, hi) => {
    feeStructures.push({
      id: `fs-sch-${hi}`,
      institutionId: "school",
      classOrProgrammeId: "all",
      className: "All Classes",
      academicYear: "2026-27",
      feeHeadId: h.id,
      feeHeadName: h.name,
      amount: h.name === "Tuition Fee" ? 12000 : h.name === "Transport Fee" ? 3500 : 1500,
      dueDate: "2026-11-15",
    });
  });

programmes.forEach((prog, pi) => {
  feeHeads
    .filter((h) => h.institutionId === "college")
    .forEach((h, hi) => {
      feeStructures.push({
        id: `fs-col-${pi}-${hi}`,
        institutionId: "college",
        classOrProgrammeId: prog.id,
        className: prog.name,
        academicYear: "2026-27",
        feeHeadId: h.id,
        feeHeadName: h.name,
        amount: h.name === "Tuition Fee" ? Math.round(prog.feePerYear / 2) : h.name === "Examination Fee" ? 1200 : 1800,
        dueDate: "2026-11-20",
      });
    });
});

export const allFeeStructures = feeStructures;

const invoices: Invoice[] = [];
const payments: Payment[] = [];
let invoiceSeed = 0;
let paymentSeed = 0;

const STATUS_CYCLE: InvoiceStatus[] = ["Paid", "Paid", "Partially Paid", "Unpaid", "Overdue"];
const MODES: PaymentMode[] = ["Cash", "Online", "Bank Transfer", "Cheque"];

allStudents
  .filter((s) => s.status === "Active")
  .forEach((student) => {
    const isSchool = student.institutionId === "school";
    const amount = isSchool ? 12000 : 20000;
    const concession = invoiceSeed % 11 === 0 ? Math.round(amount * 0.1) : 0;
    const payable = amount - concession;
    const status = STATUS_CYCLE[invoiceSeed % STATUS_CYCLE.length]!;
    const amountPaid = status === "Paid" ? payable : status === "Partially Paid" ? Math.round(payable * 0.5) : 0;

    const invoice: Invoice = {
      id: `inv-${invoiceSeed}`,
      institutionId: student.institutionId,
      invoiceNo: `${isSchool ? "PSPS" : "PSC"}-INV-2026-${String(1000 + invoiceSeed)}`,
      studentId: student.id,
      description: isSchool ? "Term 1 Fees — 2026-27" : "Odd Semester Fees — 2026-27",
      academicYear: "2026-27",
      amount,
      amountPaid,
      dueDate: "2026-11-15",
      issueDate: "2026-10-01",
      status: status === "Overdue" && amountPaid > 0 ? "Partially Paid" : status,
      concession,
      concessionReason: concession > 0 ? "Sibling concession" : undefined,
    };
    invoices.push(invoice);

    if (amountPaid > 0) {
      payments.push({
        id: `pay-${paymentSeed}`,
        institutionId: student.institutionId,
        receiptNo: `${isSchool ? "PSPS" : "PSC"}-RCT-2026-${String(1000 + paymentSeed)}`,
        invoiceId: invoice.id,
        studentId: student.id,
        amount: amountPaid,
        mode: MODES[paymentSeed % MODES.length]!,
        date: `2026-10-${String(10 + (paymentSeed % 9)).padStart(2, "0")}`,
        recordedBy: isSchool ? "Kabita Das" : "Accounts Office",
      });
      paymentSeed += 1;
    }
    invoiceSeed += 1;
  });

export const allInvoices = invoices;
export const allPayments = payments;

export function getInvoicesByInstitution(id: "school" | "college"): Invoice[] {
  return allInvoices.filter((i) => i.institutionId === id);
}
export function getInvoicesByStudent(studentId: string): Invoice[] {
  return allInvoices.filter((i) => i.studentId === studentId);
}
export function getPaymentsByInvoice(invoiceId: string): Payment[] {
  return allPayments.filter((p) => p.invoiceId === invoiceId);
}
export function getPaymentsByInstitution(id: "school" | "college"): Payment[] {
  return allPayments.filter((p) => p.institutionId === id);
}
