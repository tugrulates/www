declare module 'astro:env/client' {
	
}

declare module 'astro:env/server' {
	export const GENERATE_RICH_OPENGRAPH_IMAGES: boolean;	


	export const getSecret: (key: string) => string | undefined;
}
