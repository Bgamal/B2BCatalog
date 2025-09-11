"use client";
import { useEffect, useState } from 'react';
const API = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337') + '/api';

type Supplier = { id: number; name: string };

export default function SuppliersPage() {
	const [items, setItems] = useState<Supplier[]>([]);
	useEffect(() => {
		fetch(`${API}/suppliers?pagination[limit]=100`)
			.then(r => r.json())
			.then(json => setItems((json?.data ?? []).map((i: any) => ({ id: i.id, name: i.attributes.name }))));
	}, []);
	return (
		<ul>
			{items.map(s => <li key={s.id}><a href={`/supplier/${s.id}`}>{s.name}</a></li>)}
		</ul>
	);
} 