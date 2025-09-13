"use client";
import { useEffect, useState, use } from 'react';
const API = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337') + '/api';

type Product = { id: number; name: string; sku: string };

export default function SupplierPage({ params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = use(params);
	const [products, setProducts] = useState<Product[]>([]);
	
	useEffect(() => {
		const url = `${API}/products?filters[supplier][id][$eq]=${resolvedParams.id}&populate=*&pagination[pageSize]=100`;
		fetch(url)
			.then(r => r.json())
			.then(json => {
				const items = (json?.data ?? []).map((i: any) => ({ id: i.id, name: i.name, sku: i.sku }));
				setProducts(items);
			})
			.catch(error => {
				console.error('Error fetching supplier products:', error);
			});
	}, [resolvedParams.id]);
	
	return (
		<div>
			<h2>Supplier Id: {resolvedParams.id}</h2>
			<ul>
				{products.map(p => <li key={p.id}><a href={`/product/${p.id}`}>{p.name} ({p.sku})</a></li>)}
			</ul>
		</div>
	);
}