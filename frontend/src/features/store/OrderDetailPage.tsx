import { useEffect, useState } from 'react';
import { Button, Card, Chip } from '@heroui/react';

const STATUS_META: Record<string, { color: 'success' | 'danger' | 'default'; label: string; dot: string }> = {
  CREATED:   { color: 'success', label: 'Active',    dot: '●' },
  CANCELLED: { color: 'danger',  label: 'Cancelled', dot: '○' },
};

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-default-400 font-semibold mb-1">{label}</p>
      <div className="text-sm font-medium text-default-800">{value}</div>
    </div>
  );
}

export default function OrderDetailPage({ id, onBack, onOrderUpdated }: any) {
  const [order, setOrder] = useState<any>(null);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => setOrder(data));
  }, [id]);

  const handleCancel = () => {
    setError('');
    setCancelling(true);
    fetch(`/api/orders/${id}/cancel`, { method: 'PUT' })
      .then(async (r) => {
        if (!r.ok) {
          const json = await r.json().catch(() => null);
          throw new Error(json?.message || 'Cancellation failed');
        }
        return r.json();
      })
      .then((updated) => {
        setOrder(updated);
        if (onOrderUpdated) onOrderUpdated();
      })
      .catch((e) => setError(e.message))
      .finally(() => setCancelling(false));
  };

  if (!order) {
    return (
      <div className="flex items-center justify-center h-48 text-default-400 text-sm">
        Loading order…
      </div>
    );
  }

  const meta = STATUS_META[order.status] ?? { color: 'default', label: order.status, dot: '●' };
  const isCancellable = order.status === 'CREATED';

  return (
    <div className="max-w-3xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-default-500">
        <button
          onClick={onBack}
          className="hover:text-default-800 transition-colors cursor-pointer"
        >
          Order History
        </button>
        <span>/</span>
        <span className="text-default-800 font-medium">Order #{order.id}</span>
      </div>

      {/* Main card */}
      <Card>
        {/* Header band */}
        <div className="px-6 pt-6 pb-5 border-b border-default-100">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-widest text-default-400 font-semibold mb-1">
                Order Reference
              </p>
              <h1 className="text-xl font-semibold text-default-900">#{order.id}</h1>
            </div>
            <Chip size="sm" color={meta.color}>
              <Chip.Label>{meta.dot} {meta.label}</Chip.Label>
            </Chip>
          </div>
        </div>

        <Card.Content className="px-6 py-6 space-y-6">
          {error && (
            <div className="flex items-start gap-3 rounded-lg bg-danger-50 border border-danger-200 px-4 py-3">
              <span className="text-danger-500 text-base mt-0.5 shrink-0">⚠</span>
              <p className="text-sm text-danger-700">{error}</p>
            </div>
          )}

          {/* Summary metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-default-50 border border-default-100 rounded-lg px-4 py-3">
              <p className="text-xs text-default-400 uppercase tracking-wide font-medium mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-default-900">${order.totalAmount?.toFixed(2)}</p>
            </div>
            <div className="bg-default-50 border border-default-100 rounded-lg px-4 py-3">
              <p className="text-xs text-default-400 uppercase tracking-wide font-medium mb-1">Quantity</p>
              <p className="text-2xl font-bold text-default-900">{order.quantity}</p>
            </div>
            <div className="bg-default-50 border border-default-100 rounded-lg px-4 py-3">
              <p className="text-xs text-default-400 uppercase tracking-wide font-medium mb-1">Unit Price</p>
              <p className="text-2xl font-bold text-default-900">${order.unitPrice?.toFixed(2)}</p>
            </div>
          </div>

          {/* Order details grid */}
          <div className="border border-default-100 rounded-xl divide-y divide-default-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0 px-5">
              <div className="py-4 border-b border-default-100 sm:border-b-0">
                <Field
                  label="Product"
                  value={<span className="text-base font-semibold">{order.productName}</span>}
                />
              </div>
              <div className="py-4">
                <Field
                  label="Status"
                  value={
                    <Chip size="sm" color={meta.color}>
                      <Chip.Label>{meta.dot} {meta.label}</Chip.Label>
                    </Chip>
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 px-5">
              <div className="py-4 border-b border-default-100 sm:border-b-0">
                <Field label="Order ID" value={`#${order.id}`} />
              </div>
              <div className="py-4">
                <Field
                  label="Date Placed"
                  value={order.createdAt ? new Date(order.createdAt).toLocaleString() : '—'}
                />
              </div>
            </div>
          </div>

          {/* Cancel action */}
          {isCancellable && (
            <div className="flex items-center justify-between bg-danger-50 border border-danger-100 rounded-xl px-5 py-4 gap-4 flex-wrap">
              <div>
                <p className="text-sm font-semibold text-danger-700">Cancel this order</p>
                <p className="text-xs text-danger-500 mt-0.5">
                  Stock will be restored to inventory upon cancellation.
                </p>
              </div>
              <Button
                variant="outline"
                onPress={handleCancel}
                isDisabled={cancelling}
                className="border-danger-300 text-danger-600 hover:bg-danger-100 shrink-0"
              >
                {cancelling ? 'Cancelling…' : 'Cancel Order'}
              </Button>
            </div>
          )}

          {!isCancellable && (
            <div className="flex items-center gap-3 bg-default-50 border border-default-100 rounded-xl px-5 py-3">
              <span className="text-default-400 text-sm">○</span>
              <p className="text-sm text-default-500">This order has been cancelled and is no longer active.</p>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}
