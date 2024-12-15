import Head from 'next/head';

interface SEOProps {
    title: string;
    description?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description = "Platform pembelajaran pemrograman berbasis blok yang interaktif dan menyenangkan"
}) => {
    const fullTitle = `${title} | e-Block`;

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
        </Head>
    );
};

export default SEO;
