import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'B2B Catalog',
	description: 'Browse products'
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial', margin: 0 }}>
				<div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', display: 'flex', gap: 16 }}>
					<a href="/">Products</a>
					<a href="/categories">Categories</a>
					<a href="/suppliers">Suppliers</a>
					<a href="/analytics">Most viewed</a>
				</div>
				<main style={{ padding: 16 }}>{children}</main>
			</body>
		</html>
	);
} 