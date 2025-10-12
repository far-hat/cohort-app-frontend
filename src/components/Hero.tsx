import heroImage2 from "../assets/heroImage2.webp"

const Hero = () => {
  return (
    <div className="flex justify-center">
      <img
        src={heroImage2}
        alt="Hero"
        className="w-2/4 h-1/4 object-cover "
      />
    </div>
  );
};

export default Hero;