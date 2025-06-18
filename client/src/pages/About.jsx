import Footer from "../components/common/Footer";

const About = () => {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Staff Management",
      description: "Efficiently manage your team members with comprehensive staff profiles, role assignments, and performance tracking."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: "Product Management",
      description: "Organize and categorize your products with ease. Add new items, manage categories, and maintain detailed product information."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Analytics & Reporting",
      description: "Gain valuable insights with comprehensive analytics, revenue tracking, profit/loss reports, and quarterly performance metrics."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Transaction Processing",
      description: "Streamline your financial operations with automated transaction processing, CSV imports, and real-time financial tracking."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Secure & Reliable",
      description: "Built with security in mind, featuring robust authentication, data encryption, and reliable cloud-based infrastructure."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Customizable",
      description: "Adapt the system to your business needs with flexible configurations, custom categories, and personalized dashboard views."
    }
  ];

  const stats = [
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" },
    { value: "1000+", label: "Businesses" },
    { value: "50+", label: "Features" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex flex-col w-full dark:bg-gray-900 overflow-y-auto">
          {/* Hero Section */}
          <div className="dark:bg-gray-700 px-6 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold dark:text-gray-200 mb-6">
                About Our Platform
              </h1>
              <p className="text-xl dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
                Empowering businesses with comprehensive management solutions that streamline 
                operations, enhance productivity, and drive growth through intelligent automation 
                and insightful analytics.
              </p>
            </div>
          </div>

          {/* Mission Section */}
          <div className="px-6 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold dark:text-gray-200 mb-8">
                Our Mission
              </h2>
              <p className="text-lg dark:text-gray-400 leading-relaxed mb-8">
                We believe that every business, regardless of size, deserves access to powerful 
                management tools that were once only available to large enterprises. Our mission 
                is to democratize business management technology and help companies of all sizes 
                achieve operational excellence.
              </p>
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div className="dark:bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold dark:text-gray-200 mb-4">
                    Innovation First
                  </h3>
                  <p className="dark:text-gray-400">
                    We continuously evolve our platform with cutting-edge technologies 
                    and user-centered design to stay ahead of business needs.
                  </p>
                </div>
                <div className="dark:bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold dark:text-gray-200 mb-4">
                    Customer Success
                  </h3>
                  <p className="dark:text-gray-400">
                    Your success is our success. We provide comprehensive support 
                    and resources to ensure you get the most out of our platform.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="px-6 py-16 dark:bg-gray-700">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold dark:text-gray-200 mb-4">
                  Platform Features
                </h2>
                <p className="text-lg dark:text-gray-400 max-w-2xl mx-auto">
                  Discover the comprehensive suite of tools designed to transform 
                  your business operations and drive sustainable growth.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="dark:bg-gray-900 p-6 rounded-lg transition-colors"
                  >
                    <div className="dark:text-gray-400 mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold dark:text-gray-200 mb-3">
                      {feature.title}
                    </h3>
                    <p className="dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Technology Section */}
          <div className="px-6 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold dark:text-gray-200 mb-8">
                Built with Modern Technology
              </h2>
              <p className="text-lg dark:text-gray-400 leading-relaxed mb-12">
                Our platform leverages the latest technologies to ensure scalability, 
                security, and performance that grows with your business.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="dark:bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold dark:text-gray-200 mb-3">
                    Cloud-Native Architecture
                  </h3>
                  <p className="dark:text-gray-400 text-sm">
                    Built for the cloud with microservices architecture ensuring 
                    high availability and seamless scaling.
                  </p>
                </div>
                <div className="dark:bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold dark:text-gray-200 mb-3">
                    Real-time Processing
                  </h3>
                  <p className="dark:text-gray-400 text-sm">
                    Instant data processing and updates across all modules for 
                    real-time business insights and decision making.
                  </p>
                </div>
                <div className="dark:bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold dark:text-gray-200 mb-3">
                    Enterprise Security
                  </h3>
                  <p className="dark:text-gray-400 text-sm">
                    Bank-level security with encryption, secure authentication, 
                    and compliance with industry standards.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="px-6 py-16 dark:bg-gray-700">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold dark:text-gray-200 mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-lg dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of businesses that trust our platform to streamline 
                their operations and accelerate growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white rounded-lg font-medium transition-colors">
                  Get Started Today
                </button>
                <button className="px-8 py-3 border border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;