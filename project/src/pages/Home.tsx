import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  GitBranch, 
  Database, 
  Lock, 
  CheckCircle, 
  ArrowRight, 
  Code, 
  Users, 
  Globe,
  Zap,
  FileText
} from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-20 bg-gray-900 text-gray-200">
      {/* Hero Section */}
      <section className="pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
                ChainGit
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              A Decentralized Trust Layer for Code and AI Development
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
              Bridge GitHub, blockchain, and decentralized storage to create cryptographic, 
              immutable proofs of your commits and model versions without exposing sensitive code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-green-500 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/docs"
                className="px-8 py-3 border border-gray-600 text-gray-300 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <FileText className="h-5 w-5" />
                <span>Documentation</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why ChainGit?
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Traditional version control lacks cryptographic immutability. 
              ChainGit provides the trust layer that high-stakes development needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Immutable Proofs",
                description: "Create cryptographic proofs of commits that can never be altered or deleted"
              },
              {
                icon: Lock,
                title: "Privacy First",
                description: "Record development history without exposing sensitive source code or models"
              },
              {
                icon: CheckCircle,
                title: "Audit Compliance",
                description: "Attach audit documents and maintain compliance for regulated industries"
              },
              {
                icon: GitBranch,
                title: "Version Control+",
                description: "Enhanced GitHub integration with blockchain-backed version history"
              },
              {
                icon: Database,
                title: "IPFS Storage",
                description: "Decentralized storage for metadata and audit documents"
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Multi-signature proofs and team-based development workflows"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-700"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-green-400 rounded-xl mb-6">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Simple integration with your existing workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Code,
                title: "Develop & Commit",
                description: "Continue using GitHub as usual. Develop, commit, and push your code normally."
              },
              {
                step: "02",
                icon: Shield,
                title: "Create Proof",
                description: "Select commits to create immutable blockchain proofs with optional audit attachments."
              },
              {
                step: "03",
                icon: Globe,
                title: "Verify & Share",
                description: "Share verifiable proofs with stakeholders while keeping source code private."
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-green-400 rounded-2xl mx-auto mb-6">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-green-400 mb-2">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-400">
                    {step.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-8 h-0.5 bg-gradient-to-r from-blue-500 to-green-400 transform -translate-x-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-green-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Commits Verified" },
              { number: "500+", label: "Repositories" },
              { number: "50+", label: "Organizations" },
              { number: "99.9%", label: "Uptime" }
            ].map((stat, index) => (
              <div key={index} className="text-white">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-green-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Secure Your Code?
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Join the future of trusted development. Create immutable proofs of your work today.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-green-500 transition-all duration-200 space-x-2 shadow-lg"
          >
            <Zap className="h-5 w-5" />
            <span>Start Building Trust</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
