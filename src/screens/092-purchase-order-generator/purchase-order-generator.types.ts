/** Screen 092 — Purchase Order Generator Screen. Types and translation keys only. */

export type PurchaseOrderGeneratorStatus = 'loading' | 'ready' | 'error';

export const PURCHASE_ORDER_GENERATOR_KEYS = {
  title: 'purchaseOrderGenerator.title',
  loading: 'purchaseOrderGenerator.loading',
  error: { title: 'purchaseOrderGenerator.error.title', body: 'purchaseOrderGenerator.error.body' },
  notReady: { title: 'purchaseOrderGenerator.notReady.title', body: 'purchaseOrderGenerator.notReady.body' },
  empty: { title: 'purchaseOrderGenerator.empty.title', body: 'purchaseOrderGenerator.empty.body' },

  status: {
    triggered: 'purchaseOrderGenerator.status.triggered',
    failed: 'purchaseOrderGenerator.status.failed',
    draft: 'purchaseOrderGenerator.status.draft',
    pending_approval: 'purchaseOrderGenerator.status.pending_approval',
    approved: 'purchaseOrderGenerator.status.approved',
    sent: 'purchaseOrderGenerator.status.sent',
  },

  po: {
    supplierLabel: 'purchaseOrderGenerator.po.supplierLabel',
    notEligible: 'purchaseOrderGenerator.po.notEligible',
    reassign: 'purchaseOrderGenerator.po.reassign',
    deliveryLabel: 'purchaseOrderGenerator.po.deliveryLabel',
    totalLabel: 'purchaseOrderGenerator.po.totalLabel',
    approvalNeeded: 'purchaseOrderGenerator.po.approvalNeeded',
    approvePricing: 'purchaseOrderGenerator.po.approvePricing',
    send: 'purchaseOrderGenerator.po.send',
    sentNote: 'purchaseOrderGenerator.po.sentNote',
  },

  line: {
    quantityLabel: 'purchaseOrderGenerator.line.quantityLabel',
    catalogPriceLabel: 'purchaseOrderGenerator.line.catalogPriceLabel',
    agreedPriceLabel: 'purchaseOrderGenerator.line.agreedPriceLabel',
    priceChanged: 'purchaseOrderGenerator.line.priceChanged',
  },

  reassignSheet: {
    title: 'purchaseOrderGenerator.reassignSheet.title',
    hint: 'purchaseOrderGenerator.reassignSheet.hint',
    supplierLabel: 'purchaseOrderGenerator.reassignSheet.supplierLabel',
    submit: 'purchaseOrderGenerator.reassignSheet.submit',
  },

  toast: {
    lineUpdated: 'purchaseOrderGenerator.toast.lineUpdated',
    reassigned: 'purchaseOrderGenerator.toast.reassigned',
    deliverySet: 'purchaseOrderGenerator.toast.deliverySet',
    approved: 'purchaseOrderGenerator.toast.approved',
    sent: 'purchaseOrderGenerator.toast.sent',
    error: 'purchaseOrderGenerator.toast.error',
  },
} as const;
