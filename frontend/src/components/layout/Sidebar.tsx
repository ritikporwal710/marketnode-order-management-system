import { ListBox } from '@heroui/react';

const imsItems = [
  { id: 'products', label: 'Products', disabled: false },
  { id: 'suppliers', label: 'Suppliers', disabled: true },
  { id: 'warehouses', label: 'Warehouses', disabled: true },
  { id: 'billing', label: 'Billing', disabled: true },
  { id: 'reports', label: 'Reports', disabled: true },
];

const omsItems = [
  { id: 'store-catalog', label: 'Product Catalog', disabled: false },
  { id: 'order-history', label: 'Order History', disabled: false },
];

export default function Sidebar({ active, onNavigate }: any) {
  return (
    <aside className="w-56 border-r border-default-200 bg-default-50 min-h-0 shrink-0">
      {/* IMS section */}
      <div className="p-3">
        <p className="text-xs font-semibold text-default-400 uppercase tracking-wider px-2 mb-2">
          Inventory Management
        </p>
        <ListBox
          aria-label="IMS Navigation"
          selectionMode="single"
          selectedKeys={new Set(imsItems.map((i) => i.id).includes(active) ? [active] : [])}
          disabledKeys={new Set(imsItems.filter((i) => i.disabled).map((i) => i.id))}
          onSelectionChange={(keys: any) => {
            const key = [...keys][0];
            if (key && onNavigate) onNavigate(key);
          }}
        >
          {imsItems.map((item) => (
            <ListBox.Item key={item.id} id={item.id}>
              {item.label}
            </ListBox.Item>
          ))}
        </ListBox>
      </div>

      {/* OMS section */}
      <div className="p-3 border-t border-default-200">
        <p className="text-xs font-semibold text-default-400 uppercase tracking-wider px-2 mb-2">
          Order Management
        </p>
        <ListBox
          aria-label="OMS Navigation"
          selectionMode="single"
          selectedKeys={new Set(omsItems.map((i) => i.id).includes(active) ? [active] : [])}
          disabledKeys={new Set()}
          onSelectionChange={(keys: any) => {
            const key = [...keys][0];
            if (key && onNavigate) onNavigate(key);
          }}
        >
          {omsItems.map((item) => (
            <ListBox.Item key={item.id} id={item.id}>
              {item.label}
            </ListBox.Item>
          ))}
        </ListBox>
      </div>
    </aside>
  );
}
