"use client";
import { useEffect, useState } from 'react';
const API = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337') + '/api';

type Product = { id: number; name: string; sku: string };

export default function SupplierPage({ params }: { params: { id: string } }) {
	const [products, setProducts] = useState<Product[]>([]);
	useEffect(() => {
		const url = `${API}/products?filters[supplier][id][$eq]=${params.id}&populate=*`;
		fetch(url)
			.then(r => r.json())
			.then(json => {
				const items = (json?.data ?? []).map((i: any) => ({ id: i.id, name: i.attributes.name, sku: i.attributes.sku }));
				setProducts(items);
			});
	}, [params.id]);
	return (
		<div>
			<h2>Supplier {params.id}</h2>
			<ul>
				{products.map(p => <li key={p.id}><a href={`/products/${p.id}`}>{p.name} ({p.sku})</a></li>)}
			</ul>
		</div>
	);
} 