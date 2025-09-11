"use client";
import { useEffect, useState } from 'react';

type Product = {
	id: number;
	name: string;
	description?: string;
	sku: string;
	price: number;
	stock: number;
	viewCount?: number;
};

const API = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337') + '/api';

export default function ProductPage({ params }: { params: { id: string } }) {
	const [product, setProduct] = useState<Product | null>(null);
	useEffect(() => {
		const url = `${API}/products/${params.id}?populate=*`;
		fetch(url).then(r => r.json()).then(json => {
			if (!json?.data) return;
			const p = json.data;
			setProduct({
				id: p.id,
				name: p.attributes.name,
				sku: p.attributes.sku,
				description: p.attributes.description,
				price: p.attributes.price,
				stock: p.attributes.stock,
				viewCount: p.attributes.viewCount
			});
		});
	}, [params.id]);
	if (!product) return <div>Loading...</div>;
	return (
		<div>
			<h1>{product.name}</h1>
			<div>SKU: {product.sku}</div>
			<p>{product.description}</p>
			<div>Price: ${product.price.toFixed(2)}</div>
			<div>Stock: {product.stock}</div>
			{typeof product.viewCount === 'number' && <div>Views: {product.viewCount}</div>}
		</div>
	);
} 