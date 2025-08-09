import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  GitCommit, 
  Shield, 
  Database, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const commitData = [
    { month: 'Jan', commits: 45, verified: 40 },
    { month: 'Feb', commits: 52, verified: 48 },
    { month: 'Mar', commits: 38, verified: 35 },
    { month: 'Apr', commits: 65, verified: 58 },
    { month: 'May', commits: 72, verified: 68 },
    { month: 'Jun', commits: 58, verified: 55 },
  ];

  const trustScoreData = [
    { day: 'Mon', score: 85 },
    { day: 'Tue', score: 87 },
    { day: 'Wed', score: 90 },
    { day: 'Thu', score: 88 },
    { day: 'Fri', score: 92 },
    { day: 'Sat', score: 89 },
    { day: 'Sun', score: 94 },
  ];

  const repositoryData = [
    { name: 'Verified', value: 75, color: '#10B981' },
    { name: 'Pending', value: 15, color: '#F59E0B' },
    { name: 'Unverified', value: 10, color: '#EF4444' },
  ];

  const recentCommits = [
    { id: '1a2b3c4d', message: 'Add machine learning model validation', timestamp: '2 hours ago', verified: true, author: 'Alice Johnson' },
    { id: '5e6f7g8h', message: 'Update security protocols', timestamp: '4 hours ago', verified: true, author: 'Bob Smith' },
    { id: '9i0j1k2l', message: 'Optimize database queries', timestamp: '6 hours ago', verified: false, author: 'Carol White' },
    { id: '3m4n5o6p', message: 'Fix authentication bug', timestamp: '8 hours ago', verified: true, author: 'David Lee' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Monitor your repository verification status and blockchain activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Total Commits', value: '1,247', change: '+12%', icon: GitCommit, color: 'blue' },
            { title: 'Verified Proofs', value: '1,156', change: '+8%', icon: Shield, color: 'green' },
            { title: 'IPFS Storage', value: '2.4 GB', change: '+15%', icon: Database, color: 'purple' },
            { title: 'Trust Score', value: '94%', change: '+2%', icon: TrendingUp, color: 'orange' }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-green-400 font-medium">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}-900`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-400`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Commit Activity Chart */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Commit Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={commitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F9FAFB' }} />
                <Bar dataKey="commits" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="verified" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Trust Score Trend */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Trust Score Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trustScoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F9FAFB' }} />
                <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Repository Status */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Repository Status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={repositoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
                  {repositoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F9FAFB' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {repositoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Commits */}
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Commits</h3>
              <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {recentCommits.map((commit, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {commit.verified ? <CheckCircle className="h-5 w-5 text-green-400" /> : <AlertCircle className="h-5 w-5 text-yellow-400" />}
                    <div>
                      <p className="text-sm font-medium">{commit.message}</p>
                      <p className="text-sm text-gray-400">{commit.id} • by {commit.author}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400">{commit.timestamp}</span>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${commit.verified ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                      {commit.verified ? 'Verified' : 'Pending'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
