'use client';
import React from 'react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import { Globe } from 'lucide-react';
import { t } from '@/lib/i18n';

export function Header({ 
	language = 'en', 
	isLoggedIn = false,
	setLanguage
}: { 
	language?: 'en' | 'fr', 
	isLoggedIn?: boolean,
	setLanguage?: (lang: 'en' | 'fr') => void 
}) {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);

	const links = [
		{
			label: t('nav.features', language),
			href: '#features',
		},
		{
			label: t('nav.pricing', language),
			href: '#pricing',
		},
	];

	const toggleLanguage = () => {
		if (setLanguage) {
			const newLang = language === 'en' ? 'fr' : 'en';
			setLanguage(newLang);
		}
	}

	React.useEffect(() => {
		if (open) {
			// Disable scroll
			document.body.style.overflow = 'hidden';
		} else {
			// Re-enable scroll
			document.body.style.overflow = '';
		}

		// Cleanup when component unmounts (important for Next.js)
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
		<header
			className={cn(
				'absolute inset-x-0 top-0 z-50 mx-auto w-full max-w-5xl transition-all duration-700 ease-out',
				{
					'fixed px-4 md:px-0 bg-white/5 dark:bg-black/5 border border-white/10 backdrop-blur-2xl md:top-6 md:max-w-4xl md:rounded-full md:shadow-[0_0_80px_rgba(0,0,0,0.1)]':
						scrolled && !open,
					'fixed inset-0 h-screen bg-background/95 backdrop-blur-3xl md:h-auto md:bg-transparent': open,
				},
			)}
		>
			<nav
				className={cn(
					'flex h-14 w-full items-center justify-between px-6 md:h-12 md:transition-all md:ease-out',
					{
						'md:px-4': scrolled,
					},
				)}
			>
				<Link href="/" className="flex items-center gap-2 group transition-all">
					<WordmarkIcon className="h-4 text-primary group-hover:drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)] transition-all" />
					<div className="flex items-baseline gap-1">
						<span className="font-black text-xs tracking-[0.3em] uppercase opacity-90 group-hover:opacity-100 transition-opacity">Aurith</span>
						<span className="font-light text-[9px] tracking-[0.2em] uppercase opacity-50 group-hover:opacity-80 transition-opacity">Recruit</span>
					</div>
				</Link>
				
				<div className="hidden items-center gap-4 md:flex">
					<div className="flex items-center gap-1">
						{links.map((link, i) => (
							<a key={i} className={cn(buttonVariants({ variant: 'ghost' }), "text-[10px] font-bold uppercase tracking-[0.15em] h-8 px-3 text-foreground/70 hover:text-foreground hover:bg-white/5 transition-all")} href={link.href}>
								{link.label}
							</a>
						))}
					</div>
					
					<div className="w-[1px] h-4 bg-white/10 dark:bg-white/5 mx-1" />
					
					<Button 
						variant="ghost" 
						size="sm" 
						onClick={toggleLanguage}
						className="h-8 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] px-3 text-foreground/70 hover:bg-white/10 hover:text-foreground transition-all flex items-center gap-1.5"
					>
						<Globe className="size-3" />
						{language === 'en' ? t('nav.lang_fr', language) : t('nav.lang_en', language)}
					</Button>

					{isLoggedIn ? (
						<Link href="/dashboard">
							<Button size="sm" className="h-8 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] px-6 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-all">
								Dashboard
							</Button>
						</Link>
					) : (
						<div className="flex items-center gap-2 ml-2">
							<Link href="/login">
								<Button variant="ghost" size="sm" className="h-8 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] px-5 text-foreground/80 hover:text-foreground hover:bg-white/5 transition-all">
									{t('auth.sign_in', language)}
								</Button>
							</Link>
							<Link href="/login?tab=signup">
								<Button size="sm" className="h-8 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] px-6 bg-foreground text-background shadow-xl hover:scale-105 transition-all border border-white/10">
									{t('auth.sign_up', language)}
								</Button>
							</Link>
						</div>
					)}
				</div>
				<Button size="icon" variant="outline" onClick={() => setOpen(!open)} className="md:hidden border-none bg-transparent hover:bg-transparent">
					<MenuToggleIcon open={open} className="size-6" duration={300} />
				</Button>
			</nav>

			<div
				className={cn(
					'bg-background/95 backdrop-blur-xl fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden md:hidden transition-all duration-300',
					open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
				)}
			>
				<div
					data-slot={open ? 'open' : 'closed'}
					className={cn(
						'flex h-full w-full flex-col justify-between gap-y-2 p-8 pt-12',
					)}
				>
					<div className="grid gap-y-6">
						{links.map((link) => (
							<a
								key={link.label}
								onClick={() => setOpen(false)}
								className={cn(buttonVariants({
									variant: 'ghost',
									className: 'justify-start text-3xl font-bold uppercase tracking-[0.15em] h-14 pl-0 text-foreground/80 hover:text-foreground hover:bg-transparent',
								}))}
								href={link.href}
							>
								{link.label}
							</a>
						))}
					</div>
					<div className="flex flex-col gap-4 mb-20">
						{isLoggedIn ? (
							<Link href="/dashboard" onClick={() => setOpen(false)}>
								<Button className="w-full h-14 rounded-2xl text-sm font-bold uppercase tracking-[0.15em] bg-primary text-primary-foreground shadow-lg shadow-primary/20">
									Dashboard
								</Button>
							</Link>
						) : (
							<div className="flex flex-col gap-3">
								<Link href="/login" onClick={() => setOpen(false)}>
									<Button variant="outline" className="w-full h-14 rounded-2xl text-sm font-bold uppercase tracking-[0.15em] border-white/20 bg-white/5 text-foreground hover:bg-white/10 hover:text-foreground">
										{t('auth.sign_in', language)}
									</Button>
								</Link>
								<Link href="/login?tab=signup" onClick={() => setOpen(false)}>
									<Button className="w-full h-14 rounded-2xl text-sm font-bold uppercase tracking-[0.15em] bg-foreground text-background shadow-xl border border-white/10">
										{t('auth.sign_up', language)}
									</Button>
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}

export const WordmarkIcon = (props: React.ComponentProps<"svg">) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);
