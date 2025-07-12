import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Background from '../assets/images/Background.avif';
import OP from '../assets/images/OP.jpg';
import HR from '../assets/images/HR.jpg';
import Executives from '../assets/images/Executives.jpg';
import AI from '../assets/images/AI.jpg';
import SM from '../assets/images/SM.jpg';
import PM from '../assets/images/PM.jpg';
import { useEffect, useRef, useState } from 'react';



const solutionSlides = [
  [
    {
      img: HR,
      title: 'For HR Managers',
      description: 'Streamline onboarding, automate time tracking, and manage performance with ease.',
      highlight: 'HR automation & compliance',
    },
    {
      img: Executives,
      title: 'For Executives',
      description: 'Gain real-time insights into workforce performance and make data-driven decisions.',
      highlight: 'Executive dashboards',
    },
    {
      img: OP,
      title: 'For Operations Teams',
      description: 'Optimize processes, ensure compliance, and boost operational efficiency.',
      highlight: 'Process optimization',
    },
  ],
  [
    {
      img: SM,
      title: 'For Sales Managers',
      description: 'Monitor sales team activity, track targets, and boost conversions.',
      highlight: 'Sales analytics',
    },
    {
      img: PM,
      title: 'For Project Managers',
      description: 'Track project timelines, allocate resources, and ensure on-time delivery.',
      highlight: 'Project tracking',
    },
    {
      img: AI,
      title: 'For IT Managers',
      description: 'Oversee IT operations, monitor system uptime, and ensure data security.',
      highlight: 'IT oversight',
    },
  ],
];

const SLIDE_INTERVAL = 10000; // 10 seconds

const companyBenefits = [
  {
    img: HR,
    title: 'Enhanced Compliance',
    description: 'Stay ahead of labor regulations and ensure accurate record-keeping with automated compliance tools.',
  },
  {
    img: Executives,
    title: 'Data-Driven Decisions',
    description: 'Leverage real-time analytics to make informed decisions that drive business growth and efficiency.',
  },
  {
    img: OP,
    title: 'Operational Efficiency',
    description: 'Automate repetitive tasks and streamline workflows to maximize productivity across all departments.',
  },
];

const caseStudies = [
  {
    img: HR,
    title: 'Maureen IT Solutions: 30% Productivity Boost',
    description: 'Maureen IT Solutions used SmartPulse to automate time tracking and saw a 30% increase in productivity within 3 months.',
  },
  {
    img: Executives,
    title: 'Ghana Bank: Data-Driven Growth',
    description: 'Ghana Bank leveraged SmartPulse analytics to identify bottlenecks and improve team efficiency across departments.',
  },
  {
    img: OP,
    title: 'Banks Army: Streamlined Operations',
    description: 'Banks Army streamlined their workflows and reduced manual errors by 40% using SmartPulse automation tools.',
  },
];

const GetStarted: React.FC = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const location = useLocation();

  // Auto-slide effect
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % solutionSlides.length);
    }, SLIDE_INTERVAL);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  // Manual navigation (optional)
  const goToSlide = (idx: number) => setCurrentSlide(idx);

  // Scroll to anchor and switch slide if hash is present
const [highlightedId, setHighlightedId] = useState<string | null>(null);
const featureRefs = useRef<Record<string, HTMLDivElement | null>>({});
const solutionRefs = useRef<Record<string, HTMLDivElement | null>>({});
const lastHighlightedRef = useRef<string | null>(null);


useEffect(() => {
  const hash = location.hash.replace('#', '');
  const allRefs = { ...featureRefs.current};
  if (hash && allRefs[hash]) {
    featureRefs.current[hash]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightedId(hash);

    const timer = setTimeout(() => setHighlightedId(null), 10000);
    return () => clearTimeout(timer);
  }
}, [location]);

useEffect(() => {
  const hash = location.hash.replace('#', '');
  if (!hash) return;

  const solutionIndexMap: Record<string, number> = {
    'solution-hr-manager': 0,
    'solution-executive': 0,
    'solution-operations': 0,
    'solution-sales-manager': 1,
    'solution-project-manager': 1,
    'solution-it-manager': 1,
  };

  const slide = solutionIndexMap[hash];
  if (slide !== undefined && slide !== currentSlide) {
    goToSlide(slide);
  }

  // Only highlight if this hash hasn't been highlighted yet
  if (lastHighlightedRef.current === hash) return;

  // Delay scroll & highlight until slide content is rendered
  const scrollAndHighlight = () => {
    const ref = solutionRefs.current[hash];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedId(hash);
      lastHighlightedRef.current = hash;
      setTimeout(() => setHighlightedId(null), 2500);
    }
  };

  // Delay slightly after slide switch
  setTimeout(scrollAndHighlight, 400);
}, [location, currentSlide]);



  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section 
        className="flex-1 w-full min-w-full bg-gradient-to-r from-primary to-secondary text-white pt-24 pb-20 flex items-center justify-center m-0 p-0 box-border"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(59,130,246,0.85), rgba(124,58,237,0.85)), url(${Background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="text-center w-full min-w-full px-0 mx-0 box-border">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Track Time, Monitor Performance & Boost Workforce Productivity
          </h1>
          <h4 className="text-lg text-black sm:text-xl mb-8">
            Key to Unleash <span className="font-semibold text-pink-400">Profit</span> & <span className="font-semibold text-pink-400">Productivity</span>
          </h4>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-white text-primary px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
            >
              Get Started
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-primary transition"
            >
              Request Demo
            </Link>
          </div>
          <p className="text-sm text-gray-200 mt-4 text-center">  
            Oversee teams, optimize processes, automate timesheets, and protect your workspace data with SmartPulse—the comprehensive solution for employee time tracking and productivity monitoring. 
          </p>
          <p className="text-sm text-gray-200 mt-2 text-center">
            SmartPulse provides full 360-degree insight into the performance of your remote, hybrid, and in-office teams, driving efficiency gains of up to 30%.
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold mt-16">
            The Most Versatile Workforce Management Software
          </h3>
          <h4 className="text-xl text-orange-400 mt-2">One platform, total control: Manage teams, workflows, and time tracking with SmartPulse.</h4>
          <div className="mt-8 flex flex-wrap justify-center space-x-4 items-center gap-8">
            {[
              { src: HR, label: 'HR' },
              { src: Executives, label: 'Executives' },
              { src: OP, label: 'Operations' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img
                  src={item.src}
                  alt={item.label}
                  className="rounded-xl w-42 h-40 object-cover border-4 border-white shadow-lg"
                />
                <span className="mt-2 text-white font-semibold">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center space-x-4 items-center gap-8">
            {[
              { src: SM, label: 'Sales Manager' },
              { src: PM, label: 'Project Manager' },
              { src: AI, label: 'IT Manager' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img
                  src={item.src}
                  alt={item.label}
                  className="rounded-xl w-42 h-40 object-cover border-4 border-white shadow-lg"
                />
                <span className="mt-2 text-white font-semibold">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#e0e7ff] via-white to-[#f3e8ff] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[180vw] h-[180vw] bg-indigo-200 opacity-30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-pink-200 opacity-20 rounded-full blur-2xl"></div>
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 text-primary drop-shadow-lg">Why Choose SmartPulse?</h2>
          <p className="text-lg text-gray-700 mb-14 max-w-2xl mx-auto">
            SmartPulse is designed to streamline your workforce management, providing you with the tools you need to enhance productivity and ensure compliance.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                id: 'feature-time-tracking',
                icon: (
                  <svg className="w-12 h-12 mb-4 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: ' Time Tracking',
                description: 'Track employee hours, breaks, and overtime with ease.',
                moreInfo: 'Detailed insights into time usage, productivity, and compliance with labor laws.',
              },
              {
                id: 'feature-performance-monitoring',
                icon: (
                  <svg className="w-12 h-12 mb-4 text-pink-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
                    <path d="M9 9h6v6H9z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ),
                title: 'Performance Monitoring',
                description: 'Gain insights into team performance and productivity.',
                moreInfo: 'Identify bottlenecks and optimize workflows for better efficiency.',
              },
              { 
                id: 'feature-automated-reporting',
                icon: (
                  <svg className="w-12 h-12 mb-4 text-orange-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 8h8v8H8z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ),
                title: 'Automated Reporting',
                description: 'Generate detailed reports to analyze workforce efficiency.',
                moreInfo: 'Customizable reports to meet your specific needs.',
              },
            ].map((feature) => {
              const [flipped, setFlipped] = React.useState(false);
              return (
                <div
                  key={feature.id}
                  ref={(el) => { featureRefs.current[feature.id] = el; }} // store ref
                  id={feature.id}
                  className={`relative group cursor-pointer transition-shadow duration-700 rounded-2xl ${
                    highlightedId === feature.id ? 'ring-4 ring-yellow-400 bg-yellow-50 h-80' : ''
                  }`}
                  onClick={() => setFlipped(f => !f)}
                  tabIndex={0}
                  onBlur={() => setFlipped(false)}
                >
                <div className={`transition-transform duration-700 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
                    {/* Front */}
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-lg border border-indigo-100 shadow-2xl rounded-2xl flex flex-col items-center justify-center px-8 py-10 h-80 backface-hidden">
                      {feature.icon}
                      <h3 className="text-2xl font-bold mb-2 text-indigo-700">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                    {/* Back */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-pink-400 text-white rounded-2xl flex flex-col items-center justify-center px-8 py-10 h-80 [transform:rotateY(180deg)] backface-hidden shadow-2xl">
                      <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-orange-200">{feature.moreInfo}</p>
                    </div>
                  </div>
                  {/* Card container to maintain layout */}
                  <div className="invisible h-64">
                    
                  </div>
                </div>

              );
            })}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#e0f2fe] via-white to-[#f0fdf4] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-green-200 opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-200 opacity-20 rounded-full blur-2xl"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 text-green-700 drop-shadow-lg text-center">Solutions for Every Role</h2>
          <p className="text-lg text-gray-700 mb-14 max-w-2xl mx-auto text-center">
            SmartPulse adapts to every department, empowering your entire organization with actionable insights and seamless workflows.
          </p>
          <div className="transition-all duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {solutionSlides[currentSlide].map((solution, idx) => {
                let id = '';
                if (currentSlide === 0) {
                  if (idx === 0) id = 'solution-hr-manager';
                  if (idx === 1) id = 'solution-executive';
                  if (idx === 2) id = 'solution-operations';
                } else if (currentSlide === 1) {
                  if (idx === 0) id = 'solution-sales-manager';
                  if (idx === 1) id = 'solution-project-manager';
                  if (idx === 2) id = 'solution-it-manager';
                }
                return (
                  <div
                    key={idx}
                    id={id}
                    ref={(el) => { solutionRefs.current[id] = el; }}
                    className={`relative rounded-2xl overflow-hidden shadow-2xl group hover:scale-105 transition-transform duration-500 bg-white ${
                      highlightedId === id ? 'ring-4 ring-yellow-400 bg-yellow-50 animate-pulse' : ''
                    }`}
    >
                    <img
                      src={solution.img}
                      alt={solution.title}
                      className="w-full h-64 object-cover opacity-90 group-hover:opacity-100 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8">
                      <h3 className="text-2xl font-bold text-white mb-2">{solution.title}</h3>
                      <p className="text-gray-100 mb-2">{solution.description}</p>
                      <span className="inline-block bg-green-400/80 text-green-900 font-semibold px-4 py-1 rounded-full text-xs mb-4">{solution.highlight}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Navigation dots */}
            <div className="flex justify-center mt-8 space-x-3">
              {solutionSlides.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 border-green-400 transition-all duration-300 focus:outline-none ${currentSlide === idx ? 'bg-green-400' : 'bg-white'}`}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Company Benefits Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#f0fdf4] via-white to-[#e0f2fe] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-green-200 opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-200 opacity-20 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 text-green-700 drop-shadow-lg text-center">Company Benefits</h2>
          <p className="text-lg text-gray-700 mb-14 max-w-2xl mx-auto text-center">
            SmartPulse empowers your entire organization with actionable insights and seamless workflows, driving innovation and efficiency.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {companyBenefits.map((benefit, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl overflow-hidden shadow-2xl group hover:scale-105 transition-transform duration-500 bg-white"
              >
                <img
                  src={benefit.img}
                  alt={benefit.title}
                  className="w-full h-64 object-cover opacity-90 group-hover:opacity-100 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-100 mb-2">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#f0fdf4] via-white to-[#e0f2fe] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-green-200 opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-200 opacity-20 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 text-green-700 drop-shadow-lg text-center">Case Studies</h2>
          <p className="text-lg text-gray-700 mb-14 max-w-2xl mx-auto text-center">
            See how SmartPulse has transformed the way your organization works and drives innovation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {caseStudies.map((study, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl overflow-hidden shadow-2xl group hover:scale-105 transition-transform duration-500 bg-white"
              >
                <img
                  src={study.img}
                  alt={study.title}
                  className="w-full h-64 object-cover opacity-90 group-hover:opacity-100 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{study.title}</h3>
                  <p className="text-gray-100 mb-2">{study.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#f0fdf4] via-white to-[#e0f2fe] overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 text-green-700 drop-shadow-lg text-center">Ready to take your business to the next level?</h2>
          <p className="text-lg text-gray-700 mb-14 max-w-2xl mx-auto text-center">
            Join our growing community of satisfied customers and unlock the full potential of SmartPulse.
          </p>
          <div className="flex justify-center">
            <a
              href="/register"
              className="inline-block bg-green-400 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-full transition duration-300"
            >
              Get Started
            </a>
            
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default GetStarted;