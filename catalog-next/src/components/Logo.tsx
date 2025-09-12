import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="d-flex align-items-center text-decoration-none">
      <Image 
        src="/logo.svg" 
        alt="B2B Catalog Logo" 
        width={150} 
        height={40}
        className="d-inline-block align-top"
        priority
      />
    </Link>
  );
};

export default Logo;
