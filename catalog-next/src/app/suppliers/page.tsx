"use client";
import { useEffect, useState } from 'react';
const API = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337') + '/api';

type Supplier = { id: number; name: string };

export default function SuppliersPage() {
  const [items, setItems] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch(`${API}/suppliers?pagination[limit]=100`);
        if (!response.ok) {
          throw new Error('Failed to fetch suppliers');
        }
        const json = await response.json();
        debugger;
        // Safely map the response data with null checks
        const suppliers = (json?.data ?? [])
          .filter((item: any) => item?.id && item?.name)
          .map((item: any) => ({
            id: item.id,
            name: item?.name || 'Unnamed Supplier'
          }));
          
        setItems(suppliers);
      } catch (err) {
        console.error('Error fetching suppliers:', err);
        setError('Failed to load suppliers. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  if (isLoading) {
    return <div className="p-4">Loading suppliers...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (items.length === 0) {
    return <div className="p-4">No suppliers found.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Suppliers</h1>
      <ul className="space-y-2">
        {items.map(supplier => (
          <li key={supplier.id} className="hover:bg-gray-100 p-2 rounded">
            <a 
              href={`/supplier/${supplier.id}`} 
              className="text-blue-600 hover:underline"
            >
              {supplier.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}