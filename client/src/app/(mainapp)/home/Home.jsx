import HeroBanner from "./_components/HeroBanner";
import CategorySection from "./_components/CategorySection";
import FeaturedProducts from "./_components/FeaturedProducts";
import LatestProducts from "./_components/LatestProducts";

const Home = () => {
  return (
    <div className="space-y-14 pb-12">
      <HeroBanner />
      <CategorySection />
      <FeaturedProducts />
      <LatestProducts />
    </div>
  );
};

export default Home;
