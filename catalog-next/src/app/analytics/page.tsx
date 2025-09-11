"use client";
import { useEffect, useState } from 'react';
const API = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337') + '/api';

type Product = { id: number; name: string; viewCount?: number };

export default function AnalyticsPage() {
	const [items, setItems] = useState<Product[]>([]);
	useEffect(() => {
		fetch(`${API}/products?sort=viewCount:desc&pagination[pageSize]=20`)
			.then(r => r.json())
			.then(json => {
				const mapped = (json?.data ?? []).map((i: any) => ({ id: i.id, name: i.attributes.name, viewCount: i.attributes.viewCount }));
				setItems(mapped);
			});
	}, []);
	return (
		<ul>
			{items.map(p => <li key={p.id}><a href={`/product/${p.id}`}>{p.name}</a> – {typeof p.viewCount === 'number' ? p.viewCount : 0} views</li>)}
		</ul>
	);
} 