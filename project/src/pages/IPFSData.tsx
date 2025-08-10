import React, { useState } from 'react';
import { 
  Database, 
  FileText, 
  Download, 
  Eye, 
  Hash, 
  Calendar, 
  User, 
  Shield,
  Search,
  Filter,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

const IPFSData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const ipfsData = [
    {
      id: 'QmYwAPJzv5CZsnAzt8auVZRn9LtPGTQDjdyVGj8GfmNeNx',
      name: 'ml-model-v2.1-audit.pdf',
      type: 'Audit Document',
      size: '2.4 MB',
      timestamp: '2024-01-15T10:30:00Z',
      author: 'Alice Johnson',
      verified: true,
      commitHash: '1a2b3c4d',
      description: 'Security audit for machine learning model version 2.1'
    },
    {
      id: 'QmNrEidVTTqGHNvEYhEzd8yJkRFzS2JQQ5Q5v8yF4gHnQm',
      name: 'code-review-report-q1-2024.json',
      type: 'Metadata',
      size: '145 KB',
      timestamp: '2024-01-12T14:22:00Z',
      author: 'Bob Smith',
      verified: true,
      commitHash: '5e6f7g8h',
      description: 'Q1 2024 code review findings and recommendations'
    },
    {
      id: 'QmPvZr1Z6pNqXvYYmqNzJwQ8mR4T7sH9xF2qW1eR3t4Y5u',
      name: 'deployment-config.yaml',
      type: 'Configuration',
      size: '89 KB',
      timestamp: '2024-01-10T09:15:00Z',
      author: 'Carol White',
      verified: false,
      commitHash: '9i0j1k2l',
      description: 'Production deployment configuration file'
    },
    {
      id: 'QmTxVp8qX2mN7r9wE1sFgH4jK6lM8nO9pQ0rS3tU4vW5x',
      name: 'test-results-2024-01.xml',
      type: 'Test Data',
      size: '512 KB',
      timestamp: '2024-01-08T16:45:00Z',
      author: 'David Lee',
      verified: true,
      commitHash: '3m4n5o6p',
      description: 'Automated test results for January 2024'
    },
    {
      id: 'QmZyXwVu7sRqP6oN5mL4kJ3iH2gF1eD0cB9aS8tY6rE5q',
      name: 'compliance-checklist.md',
      type: 'Documentation',
      size: '67 KB',
      timestamp: '2024-01-05T11:20:00Z',
      author: 'Eva Martinez',
      verified: true,
      commitHash: '7q8w9e0r',
      description: 'GDPR and SOX compliance verification checklist'
    },
    {
      id: 'QmAzByCxDwEvFuGtHsIjKlMnOpQrStUvWxYz',
      name: 'security-scan-results.json',
      type: 'Security',
      size: '234 KB',
      timestamp: '2024-01-03T13:30:00Z',
      author: 'Frank Wilson',
      verified: true,
      commitHash: 't5y6u7i8',
      description: 'Vulnerability scan results and remediation plan'
    }
  ];

  const filteredData = ipfsData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         item.type.toLowerCase() === selectedFilter.toLowerCase() ||
                         (selectedFilter === 'verified' && item.verified) ||
                         (selectedFilter === 'unverified' && !item.verified);
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'audit document': return FileText;
      case 'metadata': return Database;
      case 'configuration': return Hash;
      case 'test data': return Shield;
      case 'documentation': return FileText;
      case 'security': return Shield;
      default: return FileText;
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalSize = ipfsData.reduce((acc, item) => {
    const sizeValue = parseFloat(item.size.split(' ')[0]);
    const unit = item.size.split(' ')[1];
    return acc + (unit === 'MB' ? sizeValue : sizeValue / 1000);
  }, 0);

  return (
    <div className="min-h-screen pt-8 pb-12 bg-[#0f172a] text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">IPFS Data Storage</h1>
          <p className="text-gray-400">
            Decentralized storage for your development artifacts and audit documents
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Files', value: ipfsData.length, icon: Database, color: 'text-blue-400' },
            { label: 'Storage Used', value: `${totalSize.toFixed(1)} MB`, icon: Hash, color: 'text-green-400' },
            { label: 'Verified Files', value: ipfsData.filter(i => i.verified).length, icon: Shield, color: 'text-purple-400' },
            { label: 'Contributors', value: new Set(ipfsData.map(i => i.author)).size, icon: User, color: 'text-orange-400' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#1e293b] rounded-xl p-6 shadow-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg border border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg bg-[#0f172a] text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-600 rounded-lg bg-[#0f172a] text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Files</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                  <option value="audit document">Audit Documents</option>
                  <option value="metadata">Metadata</option>
                  <option value="security">Security</option>
                </select>
              </div>
              
              <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-[#334155] rounded-lg transition-colors">
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Files List */}
        <div className="bg-[#1e293b] rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">
              IPFS Files ({filteredData.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-700">
            {filteredData.map((file, index) => {
              const TypeIcon = getTypeIcon(file.type);
              return (
                <div key={index} className="p-6 hover:bg-[#334155] transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                          <TypeIcon className="h-5 w-5 text-blue-400" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-sm font-medium text-white truncate">
                            {file.name}
                          </h4>
                          {file.verified && (
                            <Shield className="h-4 w-4 text-green-400" />
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-400 mb-2">
                          {file.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            {file.id.substring(0, 20)}...
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(file.timestamp)}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {file.author}
                          </span>
                          <span>{file.size}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            file.verified 
                              ? 'bg-green-900 text-green-300' 
                              : 'bg-orange-900 text-orange-300'
                          }`}>
                            {file.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-[#334155] rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-400 hover:bg-[#334155] rounded-lg transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-purple-400 hover:bg-[#334155] rounded-lg transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Database className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No files match your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IPFSData;
