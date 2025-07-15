import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Edit3, Save, X, Plus, DollarSign } from 'lucide-react';
import { resellerService, ResellerUser } from '../../lib/resellerService';

// Use ResellerUser from the service instead of local interface

const ResellerManagement: React.FC = () => {
  const [resellers, setResellers] = useState<ResellerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCommission, setEditCommission] = useState<number>(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReseller, setNewReseller] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    commissionRate: 10
  });

  // Fetch resellers from API
  useEffect(() => {
    const fetchResellers = async () => {
      try {
        const response = await resellerService.getResellers();
        setResellers(response.resellers);
      } catch (error) {
        console.error('Error fetching resellers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResellers();
  }, []);

  const handleEditCommission = (reseller: ResellerUser) => {
    setEditingId(reseller.id);
    setEditCommission(reseller.commissionRate);
  };

  const handleSaveCommission = async (id: string) => {
    try {
      console.log('Updating commission rate for reseller:', id, 'to:', editCommission);
      const response = await resellerService.updateCommissionRate(id, editCommission);
      console.log('Update response:', response);
      setResellers(resellers.map(r => 
        r.id === id ? { ...r, commissionRate: editCommission } : r
      ));
      setEditingId(null);
      setEditCommission(0);
    } catch (error: any) {
      console.error('Error updating commission rate:', error);
      console.error('Error response:', error.response);
      alert(`Failed to update commission rate: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditCommission(0);
  };

  const handleToggleActive = async (id: string) => {
    const reseller = resellers.find(r => r.id === id);
    if (!reseller) return;

    try {
      await resellerService.updateResellerStatus(id, !reseller.isActive);
      setResellers(resellers.map(r => 
        r.id === id ? { ...r, isActive: !r.isActive } : r
      ));
    } catch (error) {
      console.error('Error updating reseller status:', error);
      alert('Failed to update reseller status. Please try again.');
    }
  };

  const handleAddReseller = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await resellerService.createReseller(newReseller);
      setResellers([...resellers, response.reseller]);
      setShowAddModal(false);
      setNewReseller({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        commissionRate: 10
      });
      alert('Reseller created successfully!');
    } catch (error: any) {
      console.error('Error creating reseller:', error);
      alert(error.response?.data?.message || 'Failed to create reseller. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reseller Management</h1>
          <p className="text-gray-600">Manage reseller accounts and commission rates</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Reseller</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Resellers</p>
              <p className="text-2xl font-bold text-gray-900">
                {resellers.filter(r => r.isActive).length}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Commissions Paid</p>
              <p className="text-2xl font-bold text-gray-900">
                ${resellers.reduce((sum, r) => sum + r.totalCommissions, 0).toFixed(2)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Commission Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {(resellers.reduce((sum, r) => sum + r.commissionRate, 0) / resellers.length).toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Resellers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Resellers</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reseller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Commissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resellers.map((reseller) => (
                <tr key={reseller.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {reseller.firstName} {reseller.lastName}
                      </div>
                      <div className="text-sm text-gray-500">@{reseller.username}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reseller.email}</div>
                    <div className="text-sm text-gray-500">Since {new Date(reseller.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === reseller.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          max="50"
                          step="0.5"
                          value={editCommission}
                          onChange={(e) => setEditCommission(Number(e.target.value))}
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {reseller.commissionRate}%
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${reseller.totalCommissions.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(reseller.id)}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        reseller.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      } transition-colors duration-200`}
                    >
                      {reseller.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingId === reseller.id ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSaveCommission(reseller.id)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Save"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Cancel"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditCommission(reseller)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Edit Commission Rate"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Reseller Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add New Reseller</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddReseller} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newReseller.firstName}
                      onChange={(e) => setNewReseller({...newReseller, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newReseller.lastName}
                      onChange={(e) => setNewReseller({...newReseller, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={newReseller.username}
                    onChange={(e) => setNewReseller({...newReseller, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newReseller.email}
                    onChange={(e) => setNewReseller({...newReseller, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={newReseller.password}
                    onChange={(e) => setNewReseller({...newReseller, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Commission Rate (%) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.5"
                    required
                    value={newReseller.commissionRate}
                    onChange={(e) => setNewReseller({...newReseller, commissionRate: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Add Reseller
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResellerManagement;