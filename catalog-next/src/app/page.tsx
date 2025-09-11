"use client";
import { useEffect, useMemo, useState } from 'react';

type Category = { id: number; name: string };
type Supplier = { id: number; name: string };

type Product = {
	id: number;
	name: string;
	sku: string;
	price: number;
	stock: number;
	categoryId?: number;
	supplierId?: number;
};

const API = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337') + '/api';

function mapStrapiList<T>(res: any, mapper: (item: any) => T): T[] {
	if (!res || !Array.isArray(res.data)) return [];
	return res.data.filter((item: any) => item && item.attributes).map(mapper);
}

export default function ProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [suppliers, setSuppliers] = useState<Supplier[]>([]);
	const [q, setQ] = useState('');
	const [categoryId, setCategoryId] = useState<number | ''>('');
	const [supplierId, setSupplierId] = useState<number | ''>('');
	const [sortBy, setSortBy] = useState('');

	useEffect(() => {
		fetch(`${API}/categories?pagination[limit]=100`)
			.then(r => r.json())
			.then(json => {
				console.log('Categories response:', json);
				setCategories(mapStrapiList(json, (i) => ({ id: i.id, name: i.attributes?.name || 'Unknown' })));
			})
			.catch(err => console.error('Categories fetch error:', err));
		fetch(`${API}/suppliers?pagination[limit]=100`)
			.then(r => r.json())
			.then(json => {
				console.log('Suppliers response:', json);
				setSuppliers(mapStrapiList(json, (i) => ({ id: i.id, name: i.attributes?.name || 'Unknown' })));
			})
			.catch(err => console.error('Suppliers fetch error:', err));
	}, []);

	const queryString = useMemo(() => {
		const params = new URLSearchParams();
		params.set('populate', '*');
		if (q) params.set('filters[$or][0][name][$containsi]', q);
		if (q) params.set('filters[$or][1][sku][$containsi]', q);
		if (categoryId) params.set('filters[category][id][$eq]', String(categoryId));
		if (supplierId) params.set('filters[supplier][id][$eq]', String(supplierId));
		switch (sortBy) {
			case 'price_asc': params.set('sort', 'price:asc'); break;
			case 'price_desc': params.set('sort', 'price:desc'); break;
			case 'stock_desc': params.set('sort', 'stock:desc'); break;
			case 'views_desc': params.set('sort', 'viewCount:desc'); break;
			default: params.set('sort', 'name:asc'); break;
		}
		params.set('pagination[pageSize]', '100');
		return params.toString();
	}, [q, categoryId, supplierId, sortBy]);

	useEffect(() => {
		fetch(`${API}/products?${queryString}`)
			.then(r => r.json())
			.then(json => {
				console.log('Products response:', json);
				setProducts(mapStrapiList(json, (i) => ({
					id: i.id,
					name: i.attributes?.name || 'Unknown Product',
					sku: i.attributes?.sku || 'N/A',
					price: i.attributes?.price || 0,
					stock: i.attributes?.stock || 0,
					categoryId: i.attributes?.category?.data?.id,
					supplierId: i.attributes?.supplier?.data?.id
				})));
			})
			.catch(err => console.error('Products fetch error:', err));
	}, [queryString]);

	return (
		<div>
			<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
				<input placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} />
				<select value={categoryId} onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : '')}>
					<option value="">All categories</option>
					{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
				</select>
				<select value={supplierId} onChange={e => setSupplierId(e.target.value ? Number(e.target.value) : '')}>
					<option value="">All suppliers</option>
					{suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
				</select>
				<select value={sortBy} onChange={e => setSortBy(e.target.value)}>
					<option value="">Sort: Name</option>
					<option value="price_asc">Price ↑</option>
					<option value="price_desc">Price ↓</option>
					<option value="stock_desc">Stock ↓</option>
					<option value="views_desc">Views ↓</option>
				</select>
			</div>
			<ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, listStyle: 'none', padding: 0 }}>
				{products.map(p => (
					<li key={p.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
						<div style={{ fontWeight: 600 }}>{p.name}</div>
						<div style={{ color: '#666' }}>{p.sku}</div>
						<div style={{ marginTop: 6 }}>${p.price.toFixed(2)} · Stock: {p.stock}</div>
						<a href={`/product/${p.id}`}>View</a>
					</li>
				))}
			</ul>
		</div>
	);
} 