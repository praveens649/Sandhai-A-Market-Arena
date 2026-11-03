import HeroBanner from "./_components/HeroBanner";
import CategorySection from "./_components/CategorySection";
import FeaturedProducts from "./_components/FeaturedProducts";
import LatestProducts from "./_components/LatestProducts";

const Home = () => {
  return (
    <>
      <HeroBanner />
      <CategorySection />
      <FeaturedProducts />
      <LatestProducts />
    </>
  );
};

export default Home;