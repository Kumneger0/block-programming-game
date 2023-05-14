import { Helmet } from 'react-helmet';

export default function LoadImages({ images }: { images: string[] }) {
  return (
    <>
      <Helmet>
        {images.map((img) => {
          return <link key={img} rel="preload" href={img} as="image" />;
        })}{' '}
      </Helmet>
    </>
  );
}
