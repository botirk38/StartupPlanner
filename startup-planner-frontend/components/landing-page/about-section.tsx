import { Button } from "../ui/button";


const AboutSection: React.FC = () => {

  return (
    <section id="about" className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="/about-image.webp"
              width={600}
              height={400}
              alt="About Canva Startup Planner"
              className="mx-auto"
            />
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">About Canva Startup Planner</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Canva Startup Planner is an AI-driven platform designed to help entrepreneurs and small business owners
              streamline their business planning and branding processes. Our suite of powerful tools, including the
              Business Plan Generator, Copywriting Tool, and Logo and Branding Generator, leverages the latest
              advancements in artificial intelligence to provide you with professional-grade results in a fraction of
              the time and cost.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              Our mission is to empower entrepreneurs and small business owners with the tools and resources they need
              to turn their dreams into reality. With Canva Startup Planner, you can focus on what matters most –
              growing your business – while we take care of the rest.
            </p>
            <Button variant="default" size="lg">
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
