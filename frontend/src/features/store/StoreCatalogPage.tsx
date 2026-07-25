import { useEffect, useState } from 'react';
import { Table, Chip } from '@heroui/react';

export default function StoreCatalogPage({ onSelectProduct }: any) {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/store/products')
      .then((r) => r.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Product Catalog</h1>
        <p className="text-sm text-default-500 mt-1">Browse available products and place orders</p>
      </div>

      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Product catalog table">
            <Table.Header>
              <Table.Column isRowHeader>NAME</Table.Column>
              <Table.Column>CATEGORY</Table.Column>
              <Table.Column>PRICE</Table.Column>
              <Table.Column>AVAILABILITY</Table.Column>
            </Table.Header>
            <Table.Body>
              {products.map((p: any) => (
                <Table.Row
                  key={p.id}
                  className="cursor-pointer"
                  onAction={() => onSelectProduct(p.id)}
                >
                  <Table.Cell className="font-medium">{p.name}</Table.Cell>
                  <Table.Cell>{p.category || '—'}</Table.Cell>
                  <Table.Cell>${p.price?.toFixed(2)}</Table.Cell>
                  <Table.Cell>
                    <Chip size="sm" color={p.stock > 0 ? 'success' : 'danger'}>
                      <Chip.Label>{p.stock > 0 ? 'In Stock' : 'Out of Stock'}</Chip.Label>
                    </Chip>
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
