import { useEffect, useState } from 'react';
import { Table, Chip } from '@heroui/react';

const statusColor: Record<string, 'success' | 'danger' | 'default'> = {
  CREATED: 'success',
  CANCELLED: 'danger',
};

export default function OrderHistoryPage({ onSelectOrder }: any) {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Order History</h1>
        <p className="text-sm text-default-500 mt-1">View and manage your past orders</p>
      </div>

      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Order history table">
            <Table.Header>
              <Table.Column isRowHeader>ORDER ID</Table.Column>
              <Table.Column>PRODUCT</Table.Column>
              <Table.Column>QTY</Table.Column>
              <Table.Column>TOTAL</Table.Column>
              <Table.Column>STATUS</Table.Column>
              <Table.Column>DATE</Table.Column>
            </Table.Header>
            <Table.Body>
              {orders.map((o: any) => (
                <Table.Row
                  key={o.id}
                  className="cursor-pointer"
                  onAction={() => onSelectOrder(o.id)}
                >
                  <Table.Cell className="font-medium">#{o.id}</Table.Cell>
                  <Table.Cell>{o.productName}</Table.Cell>
                  <Table.Cell>{o.quantity}</Table.Cell>
                  <Table.Cell>${o.totalAmount?.toFixed(2)}</Table.Cell>
                  <Table.Cell>
                    <Chip size="sm" color={statusColor[o.status] ?? 'default'}>
                      <Chip.Label>{o.status}</Chip.Label>
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>
                    {o.createdAt
                      ? new Date(o.createdAt).toLocaleDateString()
                      : '—'}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
}
