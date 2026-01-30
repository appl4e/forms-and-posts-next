"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
	const pathname = usePathname();

	return (
		<header className="bg-white shadow-md">
			<div className="container mx-auto px-4 flex justify-between items-center">
				<div className="text-2xl font-bold text-gray-800 py-3">
					<Link href="/">Forms & Posts</Link>
				</div>
				<nav className="flex space-x-6">
					<Link href="/" className={`py-4 text-gray-600 hover:text-indigo-600 border-b-3 ${pathname === "/" ? "border-indigo-600" : "border-transparent"}`}>
						Home
					</Link>
					<Link href="/submissions" className={`py-4 text-gray-600 hover:text-indigo-600 border-b-3 ${pathname === "/submissions" ? "border-indigo-600" : "border-transparent"}`}>
						Submissions
					</Link>
				</nav>
			</div>
		</header>
	);
};

export default Header;
