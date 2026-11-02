import { mockRequest } from "@/mocks/api/client";
import {
  allInvoices,
  allPayments,
  feeHeads,
  allFeeStructures,
  getInvoicesByInstitution,
  getPaymentsByInvoice,
  getPaymentsByInstitution,
} from "@/mocks/data/erp/finance";
import { getStudent } from "@/mocks/data/erp/studentsGuardians";
import { logActivity } from "@/mocks/data/activityLog";
import { pushNotification } from "@/mocks/data/notifications";
import type { FeeHead, FeeStructure, InstitutionType, Invoice, Payment, PaymentMode } from "@/types";

export const financeService = {
  listInvoices: (institutionId: InstitutionType) => mockRequest<Invoice[]>(() => [...getInvoicesByInstitution(institutionId)].sort((a, b) => b.issueDate.localeCompare(a.issueDate))),

  listFeeStructures: (institutionId: InstitutionType) => mockRequest<FeeStructure[]>(() => allFeeStructures.filter((f) => f.institutionId === institutionId)),

  listFeeHeads: (institutionId: InstitutionType) => mockRequest<FeeHead[]>(() => feeHeads.filter((h) => h.institutionId === institutionId)),

  getPaymentsForInvoice: (invoiceId: string) => mockRequest<Payment[]>(() => getPaymentsByInvoice(invoiceId)),

  recordPayment: (invoiceId: string, amount: number, mode: PaymentMode, recordedBy: string) =>
    mockRequest<{ ok: true; payment: Payment } | { ok: false; error: string }>(() => {
      const invoice = allInvoices.find((i) => i.id === invoiceId);
      if (!invoice) return { ok: false, error: "Invoice not found." };
      const balance = invoice.amount - invoice.concession - invoice.amountPaid;
      if (amount <= 0 || amount > balance) return { ok: false, error: `Amount must be between ₹1 and ₹${balance}.` };

      invoice.amountPaid += amount;
      invoice.status = invoice.amountPaid >= invoice.amount - invoice.concession ? "Paid" : "Partially Paid";

      const payment: Payment = {
        id: `pay-live-${Date.now()}`,
        institutionId: invoice.institutionId,
        receiptNo: `${invoice.institutionId === "school" ? "PSPS" : "PSC"}-RCT-2026-${String(9000 + allPayments.length)}`,
        invoiceId,
        studentId: invoice.studentId,
        amount,
        mode,
        date: "2026-10-30",
        recordedBy,
      };
      allPayments.unshift(payment);
      const studentName = getStudent(invoice.studentId)?.name ?? invoice.studentId;
      logActivity({
        institutionId: invoice.institutionId,
        category: "Finance",
        action: `Recorded payment of ₹${amount} for ${studentName} (${invoice.invoiceNo})`,
        actor: recordedBy,
      });
      pushNotification({
        institutionId: invoice.institutionId,
        category: "Finance",
        title: "Payment received",
        body: `₹${amount} received against invoice ${invoice.invoiceNo}. Receipt: ${payment.receiptNo}.`,
        roles: ["parent", "student"],
        studentId: invoice.studentId,
      });
      return { ok: true, payment };
    }, { latencyMs: [400, 800] }),

  getDashboardStats: (institutionId: InstitutionType) =>
    mockRequest(() => {
      const invoices = getInvoicesByInstitution(institutionId);
      const totalDue = invoices.reduce((sum, i) => sum + (i.amount - i.concession), 0);
      const totalCollected = invoices.reduce((sum, i) => sum + i.amountPaid, 0);
      return {
        totalInvoices: invoices.length,
        totalDue,
        totalCollected,
        outstanding: totalDue - totalCollected,
        overdueCount: invoices.filter((i) => i.status === "Overdue").length,
        paidCount: invoices.filter((i) => i.status === "Paid").length,
      };
    }),

  listPayments: (institutionId: InstitutionType) => mockRequest<Payment[]>(() => [...getPaymentsByInstitution(institutionId)].sort((a, b) => b.date.localeCompare(a.date))),
};

export function studentNameFor(studentId: string): string {
  return getStudent(studentId)?.name ?? studentId;
}
