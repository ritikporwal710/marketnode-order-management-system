import { useState } from 'react';
import AppLayout from './components/layout/AppLayout';

// IMS screens
import ProductListPage from './features/products/ProductListPage';
import ProductDetailPage from './features/products/ProductDetailPage';

// OMS screens
import StoreCatalogPage from './features/store/StoreCatalogPage';
import StoreProductDetailPage from './features/store/StoreProductDetailPage';
import OrderHistoryPage from './features/store/OrderHistoryPage';
import OrderDetailPage from './features/store/OrderDetailPage';

const USERS = [
  { id: 1, name: 'Alice Martin', email: 'alice@marketnode.com' },
  { id: 2, name: 'Bob Chen', email: 'bob@marketnode.com' },
  { id: 3, name: 'Carol Smith', email: 'carol@marketnode.com' },
];

function App() {
  const [page, setPage] = useState('products');
  const [selectedProductId, setSelectedProductId] = useState<any>(null);
  const [selectedStoreProductId, setSelectedStoreProductId] = useState<any>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState(USERS[0]);

  const navigate = (key: string) => {
    setPage(key);
    setSelectedProductId(null);
    setSelectedStoreProductId(null);
    setSelectedOrderId(null);
  };

  // Determine the active sidebar key
  const sidebarActive = (() => {
    if (page === 'products' || page === 'product-detail') return 'products';
    if (page === 'store-catalog' || page === 'store-product-detail') return 'store-catalog';
    if (page === 'order-history' || page === 'order-detail') return 'order-history';
    return page;
  })();

  const content = (() => {
    // ── IMS ──────────────────────────────────────────────────────────────
    if (page === 'product-detail' && selectedProductId) {
      return (
        <ProductDetailPage
          id={selectedProductId}
          onBack={() => setPage('products')}
        />
      );
    }
    if (page === 'products') {
      return (
        <ProductListPage
          onSelectProduct={(id: any) => {
            setSelectedProductId(id);
            setPage('product-detail');
          }}
        />
      );
    }

    // ── OMS: Store Catalog ───────────────────────────────────────────────
    if (page === 'store-product-detail' && selectedStoreProductId) {
      return (
        <StoreProductDetailPage
          id={selectedStoreProductId}
          currentUser={currentUser}
          onBack={() => setPage('store-catalog')}
          onOrderPlaced={() => {
            setSelectedStoreProductId(null);
            setPage('order-history');
          }}
        />
      );
    }

    if (page === 'store-catalog') {
      return (
        <StoreCatalogPage
          onSelectProduct={(id: any) => {
            setSelectedStoreProductId(id);
            setPage('store-product-detail');
          }}
        />
      );
    }

    // ── OMS: Order History ───────────────────────────────────────────────
    if (page === 'order-detail' && selectedOrderId) {
      return (
        <OrderDetailPage
          id={selectedOrderId}
          onBack={() => setPage('order-history')}
          onOrderUpdated={() => {/* optionally refresh */}}
        />
      );
    }
    if (page === 'order-history') {
      return (
        <OrderHistoryPage
          onSelectOrder={(id: any) => {
            setSelectedOrderId(id);
            setPage('order-detail');
          }}
        />
      );
    }

    // Fallback
    return (
      <ProductListPage
        onSelectProduct={(id: any) => {
          setSelectedProductId(id);
          setPage('product-detail');
        }}
      />
    );
  })();

  return (
    <AppLayout
      currentUser={currentUser}
      users={USERS}
      onUserChange={setCurrentUser}
      activePage={sidebarActive}
      onNavigate={navigate}
    >
      {content}
    </AppLayout>
  );
}

export default App;
