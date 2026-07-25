import { useEffect, useState } from 'react';
import { Button, Card, Chip } from '@heroui/react';

export default function StoreProductDetailPage({ id, currentUser, onBack, onOrderPlaced }: any) {
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/store/products/${id}`)
      .then((r) => r.json())
      .then((data) => setProduct(data));
  }, [id]);

  const parseStockError = (message: string): string => {
    const match = message.match(/Available:\s*(\d+)/i);
    if (match) {
      const available = parseInt(match[1], 10);
      if (available === 0) return 'This item is currently out of stock.';
      return `Not enough stock. Please order ${available} or fewer units.`;
    }
    return message;
  };

  const handleBuy = () => {
    setError('');
    setLoading(true);
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser?.id ?? 1, productId: product.id, quantity }),
    })
      .then(async (r) => {
        if (!r.ok) {
          const json = await r.json().catch(() => null);
          throw new Error(json?.message || 'Order failed. Please try again.');
        }
        return r.json();
      })
      .then(() => { if (onOrderPlaced) onOrderPlaced(); })
      .catch((e) => setError(parseStockError(e.message)))
      .finally(() => setLoading(false));
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center h-48 text-default-400 text-sm">
        Loading product...
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className="max-w-3xl space-y-6">
      {/* Breadcrumb-style back nav */}
      <div className="flex items-center gap-2 text-sm text-default-500">
        <button
          onClick={onBack}
          className="hover:text-default-800 transition-colors cursor-pointer"
        >
          Product Catalog
        </button>
        <span>/</span>
        <span className="text-default-800 font-medium truncate">{product.name}</span>
      </div>

      {/* Main product card */}
      <Card>
        {/* Header band */}
        <div className="px-6 pt-6 pb-5 border-b border-default-100">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-widest text-default-400 font-semibold mb-1">
                {product.category || 'Product'}
              </p>
              <h1 className="text-xl font-semibold text-default-900">{product.name}</h1>
            </div>
            <Chip
              size="sm"
              color={inStock ? 'success' : 'danger'}
            >
              <Chip.Label>{inStock ? '● In Stock' : '○ Out of Stock'}</Chip.Label>
            </Chip>
          </div>
        </div>

        <Card.Content className="px-6 py-6 space-y-6">
          {/* Key metrics row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-default-50 rounded-lg px-4 py-3 border border-default-100">
              <p className="text-xs text-default-400 uppercase tracking-wide font-medium mb-1">Unit Price</p>
              <p className="text-2xl font-bold text-default-900">${product.price?.toFixed(2)}</p>
            </div>
            <div className="bg-default-50 rounded-lg px-4 py-3 border border-default-100">
              <p className="text-xs text-default-400 uppercase tracking-wide font-medium mb-1">Availability</p>
              <p className={`text-base font-semibold ${inStock ? 'text-success-600' : 'text-danger-600'}`}>
                {inStock ? 'Available to order' : 'Currently unavailable'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs uppercase tracking-widest text-default-400 font-semibold mb-2">Description</p>
            <p className="text-sm text-default-700 leading-relaxed">
              {product.description || 'No description provided for this product.'}
            </p>
          </div>

          {/* Order section */}
          <div className="border border-default-200 rounded-xl p-5 bg-white">
            <p className="text-sm font-semibold text-default-700 mb-4">Place an Order</p>

            {error && (
              <div className="mb-4 flex items-start gap-3 rounded-lg bg-danger-50 border border-danger-200 px-4 py-3">
                <span className="text-danger-500 text-base mt-0.5 shrink-0">⚠</span>
                <p className="text-sm text-danger-700">{error}</p>
              </div>
            )}

            <div className="flex flex-wrap items-end gap-6">
              {/* Quantity stepper */}
              <div>
                <label className="block text-xs text-default-400 uppercase tracking-wide font-medium mb-2">
                  Quantity
                </label>
                <div className="inline-flex items-center border border-default-200 rounded-lg overflow-hidden bg-default-50">
                  <button
                    className="w-9 h-9 flex items-center justify-center text-default-500 hover:bg-default-100 hover:text-default-800 transition-colors text-lg font-light disabled:opacity-40"
                    onClick={() => { setQuantity((q) => Math.max(1, q - 1)); setError(''); }}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-default-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    className="w-9 h-9 flex items-center justify-center text-default-500 hover:bg-default-100 hover:text-default-800 transition-colors text-lg font-light"
                    onClick={() => { setQuantity((q) => q + 1); setError(''); }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Order total */}
              <div>
                <label className="block text-xs text-default-400 uppercase tracking-wide font-medium mb-2">
                  Order Total
                </label>
                <p className="text-xl font-bold text-default-900">
                  ${(product.price * quantity).toFixed(2)}
                </p>
              </div>

              {/* CTA */}
              <div className="flex-1 flex justify-end">
                <Button
                  variant="primary"
                  onPress={handleBuy}
                  isDisabled={!inStock || loading}
                  className="min-w-32"
                >
                  {loading ? 'Placing order…' : 'Place Order'}
                </Button>
              </div>
            </div>

            {!inStock && (
              <p className="text-xs text-danger-500 mt-3 flex items-center gap-1">
                <span>○</span>
                This product is unavailable and cannot be ordered at this time.
              </p>
            )}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
