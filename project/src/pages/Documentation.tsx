import React, { useState } from 'react';
import { 
  BookOpen, 
  Code, 
  GitBranch, 
  Shield, 
  Database, 
  Zap, 
  ChevronRight,
  ExternalLink,
  Search,
  FileText,
  Video,
  HelpCircle
} from 'lucide-react';

const Documentation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('getting-started');

  const categories = [
    { id: 'getting-started', label: 'Getting Started', icon: Zap },
    { id: 'integration', label: 'GitHub Integration', icon: GitBranch },
    { id: 'blockchain', label: 'Blockchain Proofs', icon: Shield },
    { id: 'ipfs', label: 'IPFS Storage', icon: Database },
    { id: 'api', label: 'API Reference', icon: Code },
    { id: 'tutorials', label: 'Tutorials', icon: Video },
    { id: 'faq', label: 'FAQ', icon: HelpCircle }
  ];

  const documentationContent = {
    'getting-started': {
      title: 'Getting Started with ChainGit',
      content: [
        {
          title: 'What is ChainGit?',
          type: 'article',
          description: 'Learn about ChainGit\'s decentralized trust layer for code and AI development',
          readTime: '5 min read'
        },
        {
          title: 'Quick Start Guide',
          type: 'guide',
          description: 'Get up and running with ChainGit in minutes',
          readTime: '10 min read'
        },
        {
          title: 'Installation & Setup',
          type: 'guide',
          description: 'Step-by-step installation process for different environments',
          readTime: '15 min read'
        },
        {
          title: 'Creating Your First Proof',
          type: 'tutorial',
          description: 'Walk through creating your first cryptographic commit proof',
          readTime: '20 min read'
        }
      ]
    },
    'integration': {
      title: 'GitHub Integration',
      content: [
        {
          title: 'Connecting Your GitHub Account',
          type: 'guide',
          description: 'Learn how to securely connect your GitHub repositories to ChainGit',
          readTime: '8 min read'
        },
        {
          title: 'Repository Configuration',
          type: 'guide',
          description: 'Configure repository settings for automatic proof generation',
          readTime: '12 min read'
        },
        {
          title: 'Webhook Setup',
          type: 'technical',
          description: 'Set up webhooks for real-time commit verification',
          readTime: '15 min read'
        },
        {
          title: 'GitHub Actions Integration',
          type: 'tutorial',
          description: 'Integrate ChainGit into your CI/CD workflow',
          readTime: '25 min read'
        }
      ]
    },
    'blockchain': {
      title: 'Blockchain Proofs',
      content: [
        {
          title: 'Understanding Cryptographic Proofs',
          type: 'article',
          description: 'Deep dive into how ChainGit creates immutable proofs',
          readTime: '12 min read'
        },
        {
          title: 'Proof Verification',
          type: 'guide',
          description: 'Learn how to verify proofs on the blockchain',
          readTime: '10 min read'
        },
        {
          title: 'Multi-signature Proofs',
          type: 'advanced',
          description: 'Set up multi-signature proofs for team projects',
          readTime: '20 min read'
        },
        {
          title: 'Smart Contract Architecture',
          type: 'technical',
          description: 'Understanding ChainGit\'s smart contract implementation',
          readTime: '30 min read'
        }
      ]
    },
    'ipfs': {
      title: 'IPFS Storage',
      content: [
        {
          title: 'IPFS Basics',
          type: 'article',
          description: 'Introduction to IPFS and decentralized storage',
          readTime: '8 min read'
        },
        {
          title: 'Storing Audit Documents',
          type: 'guide',
          description: 'How to attach and store audit documents on IPFS',
          readTime: '12 min read'
        },
        {
          title: 'File Retrieval & Verification',
          type: 'guide',
          description: 'Retrieve and verify files stored on IPFS',
          readTime: '10 min read'
        },
        {
          title: 'IPFS Node Configuration',
          type: 'technical',
          description: 'Configure your own IPFS node for ChainGit',
          readTime: '25 min read'
        }
      ]
    },
    'api': {
      title: 'API Reference',
      content: [
        {
          title: 'Authentication',
          type: 'api',
          description: 'API authentication and authorization methods',
          readTime: '5 min read'
        },
        {
          title: 'Commits API',
          type: 'api',
          description: 'Endpoints for managing commits and proofs',
          readTime: '15 min read'
        },
        {
          title: 'IPFS API',
          type: 'api',
          description: 'Endpoints for IPFS file operations',
          readTime: '12 min read'
        },
        {
          title: 'Webhooks API',
          type: 'api',
          description: 'Configure and manage webhooks',
          readTime: '10 min read'
        }
      ]
    },
    'tutorials': {
      title: 'Video Tutorials',
      content: [
        {
          title: 'ChainGit Overview (Video)',
          type: 'video',
          description: 'Complete overview of ChainGit features and benefits',
          readTime: '15 min watch'
        },
        {
          title: 'Setting Up Your First Repository',
          type: 'video',
          description: 'Video walkthrough of repository setup process',
          readTime: '12 min watch'
        },
        {
          title: 'Creating and Verifying Proofs',
          type: 'video',
          description: 'Step-by-step proof creation and verification',
          readTime: '20 min watch'
        },
        {
          title: 'Advanced Workflows',
          type: 'video',
          description: 'Advanced ChainGit workflows for enterprise teams',
          readTime: '25 min watch'
        }
      ]
    },
    'faq': {
      title: 'Frequently Asked Questions',
      content: [
        {
          title: 'How secure are ChainGit proofs?',
          type: 'faq',
          description: 'Learn about the cryptographic security behind ChainGit proofs',
          readTime: '3 min read'
        },
        {
          title: 'Can I use ChainGit with private repositories?',
          type: 'faq',
          description: 'Understanding ChainGit\'s privacy-first approach',
          readTime: '2 min read'
        },
        {
          title: 'What blockchains does ChainGit support?',
          type: 'faq',
          description: 'Current and planned blockchain network support',
          readTime: '2 min read'
        },
        {
          title: 'How much does ChainGit cost?',
          type: 'faq',
          description: 'Pricing information and plan comparisons',
          readTime: '3 min read'
        }
      ]
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'api': return Code;
      case 'tutorial': return BookOpen;
      case 'faq': return HelpCircle;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'text-purple-400 bg-purple-900/30';
      case 'api': return 'text-blue-400 bg-blue-900/30';
      case 'tutorial': return 'text-green-400 bg-green-900/30';
      case 'faq': return 'text-orange-400 bg-orange-900/30';
      case 'advanced': return 'text-red-400 bg-red-900/30';
      case 'technical': return 'text-gray-400 bg-gray-800/50';
      default: return 'text-indigo-400 bg-indigo-900/30';
    }
  };

  const currentContent = documentationContent[selectedCategory];

  return (
    <div className="min-h-screen pt-8 pb-12 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Documentation</h1>
          <p className="text-gray-400">
            Everything you need to know about ChainGit
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-700 bg-gray-800 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
              <nav className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-900/50 text-blue-400'
                        : 'text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    <category.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{category.label}</span>
                    <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${
                      selectedCategory === category.id ? 'rotate-90' : ''
                    }`} />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-white">
                  {currentContent.title}
                </h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {currentContent.content.map((item, index) => {
                    const TypeIcon = getTypeIcon(item.type);
                    const typeColor = getTypeColor(item.type);
                    
                    return (
                      <div
                        key={index}
                        className="border border-gray-700 bg-gray-900/50 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`p-2 rounded-lg ${typeColor}`}>
                              <TypeIcon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white mb-2">
                                {item.title}
                              </h3>
                              <p className="text-gray-400 mb-3">
                                {item.description}
                              </p>
                              <div className="flex items-center gap-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${typeColor}`}>
                                  {item.type}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {item.readTime}
                                </span>
                              </div>
                            </div>
                          </div>
                          <ExternalLink className="h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-xl p-8 text-white">
              <div className="text-center">
                <HelpCircle className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Need More Help?</h3>
                <p className="mb-6 opacity-90">
                  Can't find what you're looking for? Our team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Contact Support
                  </button>
                  <button className="px-6 py-3 border border-white text-white rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors">
                    Join Community
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;