interface BannerProps {
  title: string;
}

const Banner = ({ title }: BannerProps) => (
  <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
);

export default Banner;
