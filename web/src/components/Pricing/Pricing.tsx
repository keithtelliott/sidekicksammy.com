import ThreeTierPricing from 'src/components/ThreeTierPricing/ThreeTierPricing'
const Pricing = () => {
  let offerings = [
    /*{
      name: "Grow",
      price: "free",
      features: [
        "Outcome based Chatbot",
        "Remove Sidekick Sammy branding",
        "25 pages of content",
        "Embeddable on any website",
        "Native Hubspot integration",
      ],
      buttonLabel: "Get Started",
      buttonLink: "#get-started",
      mostPopular: false
    },*/
    {
      name: "Business",
      price: 59,
      features: [
        "Outcome based Chatbot",
        "Remove Sidekick Sammy branding",
        "25 pages of content",
        "Embeddable on any website",
        "Native Hubspot integration",
      ],
      buttonLabel: "Get Started",
      buttonLink: "#get-started",
      mostPopular: true
    },
  ]

  return <ThreeTierPricing
  heading={'Plans that fit your need'}
  subheading={'Start for free. No credit card needed.'}
  offerings={offerings} />
}

export default Pricing
