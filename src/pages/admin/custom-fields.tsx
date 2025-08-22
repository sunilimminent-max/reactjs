import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../layouts/AdminLayout';
import { connect } from 'react-redux';
import agent from '@/agent'

interface CustomFieldGroup {
  id: number;
  name: string;
  key: string;
  description?: string;
  active: boolean;
  menu_order: number;
  created_at: string;
  updated_at: string;
}

interface CustomField {
  id: number;
  field_group_id: number;
  name: string;
  key: string;
  type: string;
  label: string;
  instructions?: string;
  required: boolean;
  field_config?: any;
  menu_order: number;
  created_at: string;
  updated_at: string;
}

interface CustomFieldsPageProps {
  currentUser: any;
}

const CustomFieldsPage: React.FC<CustomFieldsPageProps> = ({ currentUser }) => {
  const router = useRouter();
  const [fieldGroups, setFieldGroups] = useState<CustomFieldGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<CustomFieldGroup | null>(null);
  const [fields, setFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showCreateFieldModal, setShowCreateFieldModal] = useState(false);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [showEditFieldModal, setShowEditFieldModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CustomFieldGroup | null>(null);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  
  const [groupFormData, setGroupFormData] = useState({
    name: '',
    key: '',
    description: '',
    active: true
  });
  
  const [fieldFormData, setFieldFormData] = useState({
    name: '',
    key: '',
    type: 'text',
    label: '',
    instructions: '',
    required: false,
    field_config: {}
  });

  useEffect(() => {
    fetchFieldGroups();
  }, []);

  const fetchFieldGroups = async () => {
    try {
      
      const response = await agent.Group.getGroup(); 
            
      if (response.isSuccess) {
        setFieldGroups(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching field groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFieldsByGroup = async (groupId: number) => {
    try {
    
      
      const response = await agent.Group.groupFields(groupId); 
            
      if (response.isSuccess) {
        setFields(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching fields:', error);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {

      const response = await agent.Group.createGroup(groupFormData); 
            
      if (response.isSuccess) {
        setShowCreateGroupModal(false);
        setGroupFormData({ name: '', key: '', description: '', active: true });
        fetchFieldGroups();
      }
    } catch (error) {
      console.error('Error creating field group:', error);
    }
  };

  const handleCreateField = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGroup) return;
    
    try {
     
      const formData = {
          ...fieldFormData,
          field_group_id: selectedGroup.id
      }

      const response = await agent.Group.createField(formData); 
            
      if (response.isSuccess) {
        setShowCreateFieldModal(false);
        setFieldFormData({ name: '', key: '', type: 'text', label: '', instructions: '', required: false, field_config: {} });
        fetchFieldsByGroup(selectedGroup.id);
      }
    } catch (error) {
      console.error('Error creating field:', error);
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    if (!confirm('Are you sure you want to delete this field group? This will also delete all fields in the group.')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/custom-fields/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchFieldGroups();
        if (selectedGroup?.id === groupId) {
          setSelectedGroup(null);
          setFields([]);
        }
      }
    } catch (error) {
      console.error('Error deleting field group:', error);
    }
  };

  const handleDeleteField = async (fieldId: number) => {
    if (!confirm('Are you sure you want to delete this field?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/custom-fields/fields/${fieldId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok && selectedGroup) {
        fetchFieldsByGroup(selectedGroup.id);
      }
    } catch (error) {
      console.error('Error deleting field:', error);
    }
  };

  const openEditGroupModal = (group: CustomFieldGroup) => {
    setEditingGroup(group);
    setGroupFormData({
      name: group.name,
      key: group.key,
      description: group.description || '',
      active: group.active
    });
    setShowEditGroupModal(true);
  };

  const openEditFieldModal = (field: CustomField) => {
    setEditingField(field);
    setFieldFormData({
      name: field.name,
      key: field.key,
      type: field.type,
      label: field.label,
      instructions: field.instructions || '',
      required: field.required,
      field_config: field.field_config || {}
    });
    setShowEditFieldModal(true);
  };

  const getFieldTypeIcon = (type: string) => {
    const icons = {
      text: '📝',
      textarea: '📄',
      image: '🖼️',
      select: '📋',
      checkbox: '☑️',
      radio: '🔘',
      number: '🔢',
      email: '📧',
      url: '🔗',
      date: '📅',
      file: '📁',
      wysiwyg: '✏️'
    };
    return icons[type as keyof typeof icons] || '❓';
  };

  if (loading) {
    return (
      <AdminLayout currentUser={currentUser}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentUser={currentUser}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Custom Fields</h1>
          <button
            onClick={() => setShowCreateGroupModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Field Group
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Field Groups Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Field Groups</h2>
              </div>
              
              {fieldGroups.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No field groups found. Create your first field group to get started.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {fieldGroups.map((group) => (
                    <div
                      key={group.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedGroup?.id === group.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                      }`}
                      onClick={() => {
                        setSelectedGroup(group);
                        fetchFieldsByGroup(group.id);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{group.name}</h3>
                          <p className="text-sm text-gray-500">{group.key}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditGroupModal(group);
                            }}
                            className="text-blue-600 hover:text-blue-900 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteGroup(group.id);
                            }}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Fields Content */}
          <div className="lg:col-span-2">
            {selectedGroup ? (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">{selectedGroup.name}</h2>
                    <p className="text-sm text-gray-500">{selectedGroup.description}</p>
                  </div>
                  <button
                    onClick={() => setShowCreateFieldModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Field
                  </button>
                </div>
                
                {fields.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">No fields in this group. Add your first field to get started.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {fields.map((field) => (
                      <div key={field.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getFieldTypeIcon(field.type)}</span>
                            <div>
                              <h3 className="font-medium text-gray-900">{field.label}</h3>
                              <p className="text-sm text-gray-500">{field.key}</p>
                              {field.instructions && (
                                <p className="text-sm text-gray-400 mt-1">{field.instructions}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              field.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {field.required ? 'Required' : 'Optional'}
                            </span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openEditFieldModal(field)}
                                className="text-blue-600 hover:text-blue-900 text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteField(field.id)}
                                className="text-red-600 hover:text-red-900 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Field Group</h3>
                <p className="text-gray-500">Choose a field group from the sidebar to view and manage its fields.</p>
              </div>
            )}
          </div>
        </div>

        {/* Create Field Group Modal */}
        {showCreateGroupModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Create Field Group</h3>
                <form onSubmit={handleCreateGroup}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Group Name
                    </label>
                    <input
                      type="text"
                      value={groupFormData.name}
                      onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Group Key
                    </label>
                    <input
                      type="text"
                      value={groupFormData.key}
                      onChange={(e) => setGroupFormData({ ...groupFormData, key: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., page_fields"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={groupFormData.description}
                      onChange={(e) => setGroupFormData({ ...groupFormData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={groupFormData.active}
                        onChange={(e) => setGroupFormData({ ...groupFormData, active: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active</span>
                    </label>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateGroupModal(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Create Group
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Create Field Modal */}
        {showCreateFieldModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add Field to {selectedGroup?.name}</h3>
                <form onSubmit={handleCreateField}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Field Name
                      </label>
                      <input
                        type="text"
                        value={fieldFormData.name}
                        onChange={(e) => setFieldFormData({ ...fieldFormData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Field Key
                      </label>
                      <input
                        type="text"
                        value={fieldFormData.key}
                        onChange={(e) => setFieldFormData({ ...fieldFormData, key: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., hero_title"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Field Type
                      </label>
                      <select
                        value={fieldFormData.type}
                        onChange={(e) => setFieldFormData({ ...fieldFormData, type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="text">Text</option>
                        <option value="textarea">Textarea</option>
                        <option value="wysiwyg">WYSIWYG Editor</option>
                        <option value="image">Image</option>
                        <option value="file">File</option>
                        <option value="select">Select</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="radio">Radio</option>
                        <option value="number">Number</option>
                        <option value="email">Email</option>
                        <option value="url">URL</option>
                        <option value="date">Date</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Field Label
                      </label>
                      <input
                        type="text"
                        value={fieldFormData.label}
                        onChange={(e) => setFieldFormData({ ...fieldFormData, label: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instructions
                    </label>
                    <textarea
                      value={fieldFormData.instructions}
                      onChange={(e) => setFieldFormData({ ...fieldFormData, instructions: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Help text for content editors"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={fieldFormData.required}
                        onChange={(e) => setFieldFormData({ ...fieldFormData, required: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Required Field</span>
                    </label>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateFieldModal(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Add Field
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

const mapStateToProps = (state: any) => ({
  currentUser: state.common.currentUser,
});

export default connect(mapStateToProps)(CustomFieldsPage); 