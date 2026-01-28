import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/admin/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/admin/products/${productId}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  const toggleProductAvailability = async (productId, currentStatus) => {
    try {
      await api.put(`/api/admin/products/${productId}`, {
        is_available: !currentStatus
      });
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px'
      }}>
        <div style={{ color: '#1e3c72' }}>Loading products...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h2 style={{ 
            margin: '0 0 8px 0', 
            color: '#1e3c72',
            fontSize: '28px',
            fontWeight: '700'
          }}>Products Management</h2>
          <p style={{
            margin: '0',
            color: '#64748b',
            fontSize: '16px'
          }}>Manage your product inventory and listings</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ➕ Add Product
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {products.map((product) => (
          <ProductCard
            key={product.id || product._id}
            product={product}
            onEdit={() => setEditingProduct(product)}
            onDelete={deleteProduct}
            onToggleAvailability={toggleProductAvailability}
          />
        ))}
      </div>

      {products.length === 0 && (
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px',
            opacity: '0.5'
          }}>📦</div>
          <h3 style={{
            margin: '0 0 8px 0',
            color: '#1e3c72'
          }}>No Products Found</h3>
          <p style={{
            margin: '0',
            color: '#64748b'
          }}>Get started by adding your first product</p>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              marginTop: '20px'
            }}
          >
            Add First Product
          </button>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {(showAddModal || editingProduct) && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
          onSave={fetchProducts}
        />
      )}
    </div>
  );
};

// Separate Product Card Component
const ProductCard = ({ product, onEdit, onDelete, onToggleAvailability }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Ensure images is always an array
  const images = product.images || [];
  
  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };
  
  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Get product ID (handles both MongoDB _id and regular id)
  const productId = product.id || product._id;

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e1e8ed',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
      onMouseOver={(e) => {
        e.target.style.transform = 'translateY(-5px)';
        e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
      }}
      onMouseOut={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
      }}
    >
      {/* Image Gallery Section */}
      <div style={{ position: 'relative' }}>
        {images.length > 0 ? (
          <>
            <div 
              style={{
                height: '200px',
                backgroundImage: `url(${images[currentImageIndex]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderBottom: '1px solid #e1e8ed'
              }}
            />
            
            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ‹
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ›
                </button>
                
                {/* Image Indicators */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '5px'
                }}>
                  {images.map((_, index) => (
                    <div
                      key={index}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: index === currentImageIndex ? '#3b82f6' : 'rgba(255, 255, 255, 0.5)',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* Image Count Badge */}
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '600'
            }}>
              {images.length} image{images.length !== 1 ? 's' : ''}
            </div>
          </>
        ) : (
          <div style={{
            height: '200px',
            background: '#f8fafc',
            borderBottom: '1px solid #e1e8ed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            fontSize: '14px'
          }}>
            No images
          </div>
        )}
      </div>
      
      {/* Product Details */}
      <div style={{ padding: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '10px'
        }}>
          <h3 style={{
            margin: '0',
            color: '#1e3c72',
            fontSize: '18px',
            fontWeight: '600'
          }}>{product.name}</h3>
          <span style={{
            background: product.is_available ? '#10b98120' : '#ef444420',
            color: product.is_available ? '#10b981' : '#ef4444',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '600'
          }}>
            {product.is_available ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <p style={{
          margin: '0 0 15px 0',
          color: '#64748b',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>{product.description}</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '15px'
        }}>
          <div>
            <div style={{
              fontSize: '12px',
              color: '#64748b',
              fontWeight: '600',
              marginBottom: '2px'
            }}>Price</div>
            <div style={{
              color: '#1e3c72',
              fontWeight: '700',
              fontSize: '16px'
            }}>MK {product.price ? product.price.toLocaleString() : '0'}</div>
          </div>
          <div>
            <div style={{
              fontSize: '12px',
              color: '#64748b',
              fontWeight: '600',
              marginBottom: '2px'
            }}>Stock</div>
            <div style={{
              color: product.stock_quantity > 10 ? '#10b981' : '#f59e0b',
              fontWeight: '600',
              fontSize: '14px'
            }}>{product.stock_quantity} units</div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => onEdit(product)}
            style={{
              flex: 1,
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            Edit
          </button>
          <button
            onClick={() => onToggleAvailability(productId, product.is_available)}
            style={{
              flex: 1,
              background: product.is_available ? '#f59e0b' : '#10b981',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            {product.is_available ? 'Disable' : 'Enable'}
          </button>
          <button
            onClick={() => onDelete(productId)}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Updated Product Modal Component with Image Upload
const ProductModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || 'fire_extinguishers',
    price: product?.price || '',
    stock_quantity: product?.stock_quantity || 0,
    specifications: product?.specifications ? JSON.stringify(product.specifications, null, 2) : '{\n  \n}',
    is_available: product?.is_available ?? true
  });
  const [images, setImages] = useState(product?.images || []);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  // Handle file selection
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Check total images won't exceed 5
    if (images.length + newImages.length + files.length > 5) {
      alert('You can only upload up to 5 images total');
      return;
    }
    
    // Check file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
      
      if (!isValidType) {
        alert(`${file.name} is not a valid image type (JPEG, PNG, WebP only)`);
        return false;
      }
      
      if (!isValidSize) {
        alert(`${file.name} is too large (max 5MB)`);
        return false;
      }
      
      return true;
    });
    
    setNewImages(prev => [...prev, ...validFiles]);
  };

  // Remove existing image
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Remove new image before upload
  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Add product data
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add new images (multiple)
      newImages.forEach((image) => {
        formDataToSend.append('images', image);
      });
      
      // Add existing image URLs (for updates)
      images.forEach(image => {
        if (typeof image === 'string') {
          formDataToSend.append('existing_images', image);
        }
      });

      if (product) {
        const productId = product.id || product._id;
        await api.put(`/api/admin/products/${productId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress({ percent: percentCompleted });
          }
        });
      } else {
        await api.post('/api/admin/products', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress({ percent: percentCompleted });
          }
        });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.message || 'Error saving product');
    } finally {
      setLoading(false);
      setUploadProgress({});
    }
  };

  // Format specifications for display
  const formatSpecifications = (specs) => {
    if (!specs) return {};
    try {
      return typeof specs === 'string' ? JSON.parse(specs) : specs;
    } catch (error) {
      console.error('Error parsing specifications:', error);
      return {};
    }
  };

  const specs = formatSpecifications(formData.specifications);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px'
        }}>
          <h3 style={{
            margin: 0,
            color: '#1e3c72',
            fontSize: '20px'
          }}>
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Product Images Section */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              color: '#1e3c72',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              Product Images ({images.length + newImages.length}/5 max)
            </label>
            
            {/* Existing Images */}
            <div style={{ marginBottom: '15px' }}>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '10px',
                marginBottom: '10px'
              }}>
                {images.map((image, index) => (
                  <div key={`existing-${index}`} style={{ position: 'relative' }}>
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid #e1e8ed'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div style="width: 80px; height: 80px; border: 1px solid #e1e8ed; border-radius: 6px; display: flex; align-items: center; justify-content: center; background: #f8fafc; color: #94a3b8; font-size: 12px;">
                            Invalid Image
                          </div>
                        `;
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {/* New Images */}
                {newImages.map((image, index) => (
                  <div key={`new-${index}`} style={{ position: 'relative' }}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`New ${index + 1}`}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid #3b82f6'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Upload Button */}
              {images.length + newImages.length < 5 && (
                <label
                  style={{
                    display: 'inline-block',
                    padding: '10px 16px',
                    background: '#f1f5f9',
                    border: '2px dashed #cbd5e1',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#64748b',
                    textAlign: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#e2e8f0';
                    e.target.style.borderColor = '#94a3b8';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#f1f5f9';
                    e.target.style.borderColor = '#cbd5e1';
                  }}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  📸 Add Images ({5 - (images.length + newImages.length)} remaining)
                </label>
              )}
              
              <p style={{
                margin: '8px 0 0 0',
                fontSize: '12px',
                color: '#94a3b8'
              }}>
                Upload up to 5 images (JPEG, PNG, WebP, max 5MB each)
              </p>
            </div>
          </div>

          {/* Product Details */}
          <div style={{ display: 'grid', gap: '15px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: '#1e3c72',
                fontWeight: '600',
                fontSize: '14px'
              }}>Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e1e8ed',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: '#1e3c72',
                fontWeight: '600',
                fontSize: '14px'
              }}>Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e1e8ed',
                  borderRadius: '6px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="Enter product description"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#1e3c72',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e1e8ed',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="fire_extinguishers">Fire Extinguishers</option>
                  <option value="safety_equipment">Safety Equipment</option>
                  <option value="maintenance_kits">Maintenance Kits</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#1e3c72',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>Price (MK) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e1e8ed',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#1e3c72',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e1e8ed',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#1e3c72',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>Status</label>
                <select
                  value={formData.is_available}
                  onChange={(e) => setFormData({ ...formData, is_available: e.target.value === 'true' })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e1e8ed',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value={true}>Available</option>
                  <option value={false}>Unavailable</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: '#1e3c72',
                fontWeight: '600',
                fontSize: '14px'
              }}>Specifications (JSON)</label>
              <textarea
                value={formData.specifications}
                onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                rows="4"
                placeholder='Enter specifications as JSON, e.g.: {"weight": "6kg", "fire_class": "A, B, C", "material": "Steel"}'
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e1e8ed',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  resize: 'vertical'
                }}
              />
              <p style={{
                margin: '5px 0 0 0',
                fontSize: '12px',
                color: '#94a3b8'
              }}>
                Enter valid JSON format. Leave as {"{}"} for no specifications.
              </p>
            </div>
          </div>

          {/* Upload Progress */}
          {uploadProgress.percent > 0 && (
            <div style={{ marginTop: '20px' }}>
              <div style={{
                width: '100%',
                background: '#e1e8ed',
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <div
                  style={{
                    width: `${uploadProgress.percent}%`,
                    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                    height: '8px',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
              <p style={{
                margin: '5px 0 0 0',
                textAlign: 'center',
                fontSize: '12px',
                color: '#64748b'
              }}>
                Uploading: {uploadProgress.percent}%
              </p>
            </div>
          )}

          {/* Form Actions */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginTop: '25px',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '1px solid #e1e8ed',
                borderRadius: '6px',
                background: 'white',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                background: loading 
                  ? '#cbd5e1' 
                  : 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Products;