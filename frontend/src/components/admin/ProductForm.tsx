'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Layers,
  ChevronLeft,
} from 'lucide-react';
import { Product, ProductVariant } from '@/types';

interface ProductFormProps {
  initialData?: Product | null;
  isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit }: ProductFormProps) {
  const router = useRouter();

  // Tab State
  const [activeTab, setActiveTab] = useState<'general' | 'pricing' | 'media' | 'variants' | 'specs'>('general');

  // General Fields
  const [name, setName] = useState(initialData?.name || '');
  const [brand, setBrand] = useState(initialData?.brand || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || 'cat-electronics');
  const [categoryName, setCategoryName] = useState(initialData?.categoryName || 'Electronics & Audio');
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || '');
  const [description, setDescription] = useState(initialData?.description || '');

  // Pricing & Status
  const [basePrice, setBasePrice] = useState(initialData?.basePrice?.toString() || '');
  const [originalPrice, setOriginalPrice] = useState(initialData?.originalPrice?.toString() || '');
  const [stock, setStock] = useState(initialData?.stock?.toString() || '20');
  const [sku, setSku] = useState(initialData?.sku || '');
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [isBestSeller, setIsBestSeller] = useState(initialData?.isBestSeller ?? false);
  const [isNew, setIsNew] = useState(initialData?.isNew ?? false);

  // Images
  const [images, setImages] = useState<string[]>(
    initialData?.images?.length ? initialData.images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80']
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  // Variants Matrix
  const [variants, setVariants] = useState<ProductVariant[]>(initialData?.variants || []);

  // Features & Specifications
  const [features, setFeatures] = useState<string[]>(
    initialData?.features || ['Aerospace-grade materials', 'Fast recharge protocol']
  );
  const [newFeature, setNewFeature] = useState('');

  const [specs, setSpecs] = useState<{ key: string; val: string }[]>(
    initialData?.specifications
      ? Object.entries(initialData.specifications).map(([key, val]) => ({ key, val }))
      : [{ key: 'Warranty', val: '2 Years Official' }]
  );

  // Submission State
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    const newVar: ProductVariant = {
      id: `var-${Date.now()}`,
      productId: initialData?.id || '',
      sku: `${sku || 'SKU'}-${variants.length + 1}`,
      colorName: 'Space Black',
      colorHex: '#1E1E24',
      price: Number(basePrice) || 199,
      stock: 15,
      lowStockThreshold: 4,
      images: images.length ? [images[0]] : [],
    };
    setVariants([...variants, newVar]);
  };

  const handleUpdateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { key: 'Spec Name', val: 'Spec Value' }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const specMap: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key && s.val) specMap[s.key] = s.val;
    });

    const payload = {
      name,
      brand,
      categoryId,
      categoryName,
      shortDescription,
      description,
      basePrice: Number(basePrice),
      originalPrice: Number(originalPrice || basePrice),
      stock: Number(stock),
      sku: sku || `NOV-${Date.now()}`,
      isPublished,
      isFeatured,
      isBestSeller,
      isNew,
      images,
      variants,
      features,
      specifications: specMap,
    };

    try {
      const url = isEdit ? `/api/products/${initialData?.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save product');

      setMessage('Product saved successfully! Redirecting...');
      setTimeout(() => {
        router.push('/admin/products');
      }, 1000);
    } catch (err: any) {
      setMessage(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Products
        </button>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          {isEdit ? 'Editing Existing Product' : 'Creating New Product'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tabs Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex flex-wrap gap-1 shadow-2xs">
          {[
            { id: 'general', label: '1. General Info' },
            { id: 'pricing', label: '2. Pricing & Stock' },
            { id: 'media', label: '3. Media Gallery' },
            { id: 'variants', label: '4. Variants Matrix' },
            { id: 'specs', label: '5. Specifications' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#0B132B] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: General */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-[#0B132B] mb-2">Core Product Identity</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nova Pro Studio Headphones"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Brand / Manufacturer
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Novasound Atelier"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category / Department
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    const sel = e.target.options[e.target.selectedIndex].text;
                    setCategoryName(sel);
                  }}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 font-semibold"
                >
                  <option value="cat-electronics">Electronics & Audio</option>
                  <option value="cat-fashion">Luxury & Apparel</option>
                  <option value="cat-footwear">Footwear & Sneakers</option>
                  <option value="cat-accessories">Watches & Accessories</option>
                  <option value="cat-gaming">Gaming & Workstation</option>
                  <option value="cat-home">Smart Living & Climate</option>
                  <option value="cat-beauty">Grooming & Skincare</option>
                  <option value="cat-smart-devices">Smart Devices & IoT</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Short Description (Appears on cards & summary)
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="A brief editorial summary of this product"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Description
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive technical details and design story..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Pricing & Stock */}
        {activeTab === 'pricing' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-[#0B132B] mb-2">Pricing & Inventory Thresholds</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Base Retail Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="349.00"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Original Strikethrough Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="399.00"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Initial Stock Units *
                </label>
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="50"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Base SKU Code
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="NOV-AUD-01"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 font-mono"
              />
            </div>

            {/* Badges & Flags */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Published on Store</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Featured Product</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBestSeller}
                  onChange={(e) => setIsBestSeller(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Best Seller Badge</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>New Arrival Badge</span>
              </label>
            </div>
          </div>
        )}

        {/* Tab 3: Media Gallery */}
        {activeTab === 'media' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-[#0B132B] mb-2">High-Resolution Product Images</h3>

            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-[#0B132B] text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors"
              >
                Add Image URL
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group">
                  <Image src={img} alt={`Image ${i + 1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Variants Matrix */}
        {activeTab === 'variants' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0B132B]">Multi-Attribute Variant Matrix</h3>
                <p className="text-xs text-slate-500">Configure colors, sizes, storage, dedicated SKUs, and stock.</p>
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Color Variant
              </button>
            </div>

            {variants.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                No variants added yet. Click &quot;Add Color Variant&quot; above to create options.
              </div>
            ) : (
              <div className="space-y-4">
                {variants.map((v, idx) => (
                  <div key={v.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-slate-300"
                          style={{ backgroundColor: v.colorHex }}
                        />
                        <span className="text-xs font-bold text-slate-800">
                          Variant #{idx + 1}: {v.colorName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Color Name</label>
                        <input
                          type="text"
                          value={v.colorName}
                          onChange={(e) => handleUpdateVariant(idx, 'colorName', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Color Hex</label>
                        <input
                          type="text"
                          value={v.colorHex}
                          onChange={(e) => handleUpdateVariant(idx, 'colorHex', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Variant SKU</label>
                        <input
                          type="text"
                          value={v.sku}
                          onChange={(e) => handleUpdateVariant(idx, 'sku', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Price ($)</label>
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) => handleUpdateVariant(idx, 'price', Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Stock</label>
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => handleUpdateVariant(idx, 'stock', Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Specifications & Features */}
        {activeTab === 'specs' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Features */}
            <div>
              <h3 className="text-base font-bold text-[#0B132B] mb-2">Key Highlight Bullets</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="e.g. 52-Hour Long Life Battery"
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-1 text-xs">
                {features.map((f, i) => (
                  <li key={i} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                    <span>{f}</span>
                    <button
                      type="button"
                      onClick={() => setFeatures(features.filter((_, idx) => idx !== i))}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Specs */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-bold text-[#0B132B]">Technical Specifications</h3>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  + Add Spec Row
                </button>
              </div>

              <div className="space-y-2">
                {specs.map((s, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={s.key}
                      onChange={(e) => {
                        const updated = [...specs];
                        updated[idx].key = e.target.value;
                        setSpecs(updated);
                      }}
                      placeholder="Property (e.g. Driver Size)"
                      className="w-1/3 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                    <input
                      type="text"
                      value={s.val}
                      onChange={(e) => {
                        const updated = [...specs];
                        updated[idx].val = e.target.value;
                        setSpecs(updated);
                      }}
                      placeholder="Value (e.g. 40mm Planar)"
                      className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setSpecs(specs.filter((_, i) => i !== idx))}
                      className="p-2 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Status Message */}
        {message && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {/* Global Save Button */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="px-6 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-md"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Committing to Database...' : isEdit ? 'Save Changes' : 'Publish Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
