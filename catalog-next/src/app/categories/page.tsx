"use client";
import { useEffect, useState } from 'react';
const API = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337') + '/api';

type Category = { id: number; name: string; slug?: string };

export default function CategoriesPage() {
	const [cats, setCats] = useState<Category[]>([]);
	useEffect(() => {
		fetch(`${API}/categories?pagination[limit]=100`)
			.then(r => r.json())
			.then(json => {
				const items = (json?.data ?? []).map((i: any) => ({ id: i.id, name: i.attributes.name, slug: i.attributes.slug }));
				setCats(items);
			});
	}, []);
	return (
		<ul>
			{cats.map(c => <li key={c.id}>{c.name} {c.slug ? `(${c.slug})` : ''}</li>)}
		</ul>
	);
} 