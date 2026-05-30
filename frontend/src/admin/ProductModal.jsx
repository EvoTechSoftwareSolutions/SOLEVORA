import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { XMarkIcon, ArrowUpTrayIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { showSuccess, showError } from '../utils/notifications';


const BASE_URL = 'http://localhost:5001';

// Only allow letters, numbers, spaces, hyphens, apostrophes for name/description
const ALPHA_REGEX = /^[a-zA-Z0-9 '\-.,()&]+$/;
// Slug: only lowercase letters, numbers, hyphens
const SLUG_REGEX = /^[a-z0-9-]+$/;

const generateSlug = (name) =>
    name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

const ProductModal = ({ isOpen, onClose, onProductSaved, product = null }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [allProducts, setAllProducts] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        descriptionOne: '',
    descriptionTwo: '',
    descriptionThree: '',
        price: '',
        discountPrice: '',
        categoryId: '',
        gender: 'ALL',
    });

    const [stocks, setStocks] = useState([{ size: '7', costPrice: '', sellingPrice: '', quantity: '' }]);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [specifications, setSpecifications] = useState([  { key: '', value: '' } ]);
  

    // Field-level errors
    const [fieldErrors, setFieldErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    // ─── Data Fetching ────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/products/all`);
                setAllProducts(res.data.data || []);
            } catch { /* silent */ }
        };
        fetchAll();
    }, []);

    useEffect(() => {
        if (isOpen) {
            const fetchCategories = async () => {
                try {
                    const { data } = await axios.get(`${BASE_URL}/api/category`);
                    setCategories(data.data || []);
                } catch (err) {
                    console.error('Error fetching categories:', err);
                }
            };
            fetchCategories();
        }
    }, [isOpen]);

    // ─── Normalize Helpers ────────────────────────────────────────────────────
    const normalizeStocks = (items) => {
        if (!Array.isArray(items) || items.length === 0)
            return [{ size: '7', costPrice: '', sellingPrice: '', quantity: '' }];
        return items.map((s) => ({
            id: s.id ?? null,
            size: s.size ?? '',
            costPrice: s.costPrice ?? '',
            sellingPrice: s.sellingPrice ?? '',
            quantity: s.quantity ?? '',
        }));
    };

  const normalizeFormData = (item) => ({
    name: item?.name ?? '',
    slug: item?.slug ?? '',

    descriptionOne: item?.descriptionOne ?? '',
    descriptionTwo: item?.descriptionTwo ?? '',
    descriptionThree: item?.descriptionThree ?? '',

    price: item?.price ?? '',
    discountPrice: item?.discountPrice ?? '',
    categoryId: item?.categoryId ?? '',
    gender: item?.gender ?? 'ALL',
});

    //  Reset / Pre-fill
    useEffect(() => {
        if (isOpen) {
            setFieldErrors({});
            setSubmitError('');
            if (product) {
                setFormData(normalizeFormData(product));
                setStocks(normalizeStocks(product.stocks));
                setImagePreviews(product.images?.map((img) => `${BASE_URL}${img.url}`) || []);
                setImages([]);
                setSpecifications(product.specifications || [{ key: '', value: '' }]);
            } else {
                setFormData(normalizeFormData(null));
                setStocks(normalizeStocks([]));
                setImages([]);
                setImagePreviews([]);
                setSpecifications([{ key: '', value: '' }]);
            }
        }
    }, [isOpen, product]);

    //  Field Validation 
    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                if (!value.trim()) return 'Product name is required.';
                if (value.trim().length < 3) return 'Name must be at least 3 characters.';
                if (value.trim().length > 100) return 'Name must be under 100 characters.';
                if (!ALPHA_REGEX.test(value)) return 'Name must not contain special symbols.';
                return '';
            case 'slug':
                if (!value.trim()) return 'Slug is required.';
                if (!SLUG_REGEX.test(value)) return 'Slug may only contain lowercase letters, numbers, and hyphens.';
                if (value.length > 120) return 'Slug must be under 120 characters.';
                return '';
            case 'descriptionOne':
                if (!value.trim()) return 'Description is required.';
                if (value.trim().length < 10) return 'Description must be at least 10 characters.';
                if (value.trim().length > 500) return 'Description must be under 500 characters.';
                if (!ALPHA_REGEX.test(value)) return 'Description must not contain special symbols.';
                return '';
            case 'price':
                if (!value && value !== 0) return 'Price is required.';
                if (isNaN(value) || Number(value) <= 0) return 'Price must be a positive number.';
                return '';
            case 'discountPrice':
                if (value === '' || value === null) return '';
                if (isNaN(value) || Number(value) <= 0) return 'Discount price must be positive.';
                if (formData.price && Number(value) >= Number(formData.price))
                    return 'Discount price must be less than the main price.';
                return '';
            case 'categoryId':
                if (!value) return 'Please select a category.';
                return '';
            default:
                return '';
        }
    };

    const setFieldError = (name, msg) =>
        setFieldErrors((prev) => ({ ...prev, [name]: msg }));

    const clearFieldError = (name) =>
        setFieldErrors((prev) => ({ ...prev, [name]: '' }));

    // ─── Handlers ─────────────────────────────────────────────────────────────

    // Block symbols for name field + autocomplete
    const handleNameChange = (e) => {
        const raw = e.target.value;
        // Strip disallowed characters silently while typing
        const sanitized = raw.replace(/[^a-zA-Z0-9 '\-.,()&]/g, '');

        setFormData((prev) => ({
            ...prev,
            name: sanitized,
            // Auto-generate slug only when adding a new product
            slug: !product ? generateSlug(sanitized) : prev.slug,
        }));
        setSearchTerm(sanitized);
        clearFieldError('name');
        if (!product) clearFieldError('slug');

        if (sanitized.length > 1) {
            const filtered = allProducts.filter((p) =>
                p.name.toLowerCase().includes(sanitized.toLowerCase())
            );
            setSuggestions(filtered);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

 const handleSelectProduct = (p) => {
    setFormData(normalizeFormData(p));
    setStocks(normalizeStocks(p.stocks));

    setImagePreviews(
        p.images?.map((img) => `${BASE_URL}${img.url}`) || []
    );

    setSpecifications(
        p.specifications || [{ key: '', value: '' }]
    );

    setShowDropdown(false);
    setFieldErrors({});
};

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Block symbols for slug
        if (name === 'slug') {
            const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
            setFormData((prev) => ({ ...prev, slug: sanitized }));
            const err = validateField('slug', sanitized);
            setFieldError('slug', err);
            return;
        }

        // Block symbols for description
      if (
    name === 'descriptionOne' ||
    name === 'descriptionTwo' ||
    name === 'descriptionThree'
) {
    const sanitized = value.replace(
        /[^a-zA-Z0-9 '\-.,()&]/g,
        ''
    );

    setFormData((prev) => ({
        ...prev,
        [name]: sanitized,
    }));

    if (name === 'descriptionOne') {
        const err = validateField(name, sanitized);
        setFieldError(name, err);
    }

    return;
}

        setFormData((prev) => ({
            ...prev,
            [name]: name === 'categoryId' ? Number(value) : value,
        }));
        const err = validateField(name, name === 'categoryId' ? Number(value) : value);
        setFieldError(name, err);
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const err = validateField(name, value);
        setFieldError(name, err);
    };

const handleStockChange = (index, field, value) => {
    if (Number(value) < 0) return;

    const updated = [...stocks];

    updated[index] = {
        ...updated[index],
        [field]: value,
    };

    setStocks(updated);
};

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const totalImages = imagePreviews.length + files.length;

        if (totalImages > 10) {
            setFieldError('images', 'A maximum of 10 images are allowed per product.');
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5 MB

        const invalid = files.find((f) => !allowedTypes.includes(f.type));
        if (invalid) {
            setFieldError('images', 'Only JPG, PNG, WebP, or GIF images are allowed.');
            return;
        }
        const tooBig = files.find((f) => f.size > maxSize);
        if (tooBig) {
            setFieldError('images', 'Each image must be under 5 MB.');
            return;
        }

        clearFieldError('images');
        setImages((prev) => [...prev, ...files]);
        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...previews]);
    };

    const handleRemoveImage = (index) => {
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    // ─── Submit ───────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        // Run all field validations
        const errors = {
            name: validateField('name', formData.name),
            slug: validateField('slug', formData.slug),
            descriptionOne: validateField('descriptionOne', formData.descriptionOne),
            descriptionTwo: validateField('descriptionTwo', formData.descriptionTwo),
            descriptionThree: validateField('descriptionThree', formData.descriptionThree),
            price: validateField('price', formData.price),
            discountPrice: validateField('discountPrice', formData.discountPrice),
            categoryId: validateField('categoryId', formData.categoryId),
        };
        setFieldErrors(errors);
        if (Object.values(errors).some(Boolean)) return;

        // Stocks validation
        const validStocks = stocks.filter((s) => s.size && s.quantity !== '' && s.quantity !== null);
        if (validStocks.length === 0) {
            setSubmitError('Please add at least one size with a size label and quantity.');
            return;
        }
        for (const s of validStocks) {
            if (Number(s.quantity) < 0) {
                setSubmitError('Stock quantity cannot be negative.');
                return;
            }
            if (s.costPrice && Number(s.costPrice) < 0) {
                setSubmitError('Cost price cannot be negative.');
                return;
            }
        }


        // Images required on create
        const hasExistingImages = imagePreviews.length > 0;
const hasNewImages = images.length > 0;

if (!product && !hasNewImages) {
    setFieldError('images', 'Please upload at least one product image.');
    return;
}

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    data.append(key, value);
                }
            });
            data.append('stocks', JSON.stringify(stocks || []));
            data.append( 'specifications',   JSON.stringify(specifications || []) );
   
  

            images.forEach((file) => data.append('images', file));

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            };

            if (product) {
                await axios.put(`${BASE_URL}/api/products/${product.id}`, data, config);
            } else {
                await axios.post(`${BASE_URL}/api/products`, data, config);
            }

            showSuccess(product ? 'Product updated successfully!' : 'Product added successfully!');

            onProductSaved();
            onClose();
        } catch (err) {
            console.error('Error saving product:', err);
            showError('Error', err.response?.data?.error || 'Failed to save product.');
        } finally {

            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // ─── Render Helpers ───────────────────────────────────────────────────────
    const ErrorMsg = ({ field }) =>
        fieldErrors[field] ? (
            <p className="text-red-500 text-xs mt-1">{fieldErrors[field]}</p>
        ) : null;

    const inputCls = (field) =>
        `w-full border rounded-lg p-2 ${fieldErrors[field] ? 'border-red-400 bg-red-50' : ''}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white px-6 py-4 flex justify-between items-center border-b z-10">
                    <h2 className="text-xl font-bold">{product ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
                    {submitError && (
                        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                            {submitError}
                        </div>
                    )}

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Product Name */}
                        <div className="relative">
                            <label className="block text-sm font-medium mb-1">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={handleNameChange}
                                onBlur={() => setFieldError('name', validateField('name', formData.name))}
                                className={inputCls('name')}
                                placeholder="e.g. Nike Air Max"
                                maxLength={100}
                            />
                            <ErrorMsg field="name" />
                            {showDropdown && suggestions.length > 0 && (
                                <div className="absolute z-50 bg-white border w-full mt-1 rounded shadow max-h-40 overflow-y-auto">
                                    {suggestions.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => handleSelectProduct(item)}
                                            className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                                        >
                                            {item.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Slug <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={inputCls('slug')}
                                placeholder="e.g. nike-air-max"
                                maxLength={120}
                            />
                            <p className="text-[10px] text-gray-400 mt-0.5">Auto-generated. Only lowercase letters, numbers, hyphens.</p>
                            <ErrorMsg field="slug" />
                        </div>
                    </div>

               {/* Category + Gender (BEFORE description) */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    {/* Category */}
    <div>
        <label className="block text-sm font-medium mb-1">
            Category <span className="text-red-500">*</span>
        </label>
        <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputCls('categoryId')}
        >
            <option value="">Select Category</option>
            {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                    {cat.name}
                </option>
            ))}
        </select>
        <ErrorMsg field="categoryId" />
    </div>

    {/* Gender */}
    <div>
        <label className="block text-sm font-medium mb-1">
            Gender <span className="text-red-500">*</span>
        </label>
        <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
        >
            <option value="ALL">All</option>
            <option value="MEN">Men</option>
            <option value="WOMEN">Women</option>
            <option value="KIDS">Kids</option>
        </select>
    </div>
</div>
{/* Descriptions (3 columns in one row) */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">

    <div>
        <label className="block text-sm font-medium mb-1">
            Description One <span className="text-red-500">*</span>
        </label>
        <textarea
            name="descriptionOne"
            value={formData.descriptionOne}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            rows={6}
            placeholder="Main product description..."
        />
    </div>

    <div>
        <label className="block text-sm font-medium mb-1">
            Description Two
        </label>
        <textarea
            name="descriptionTwo"
            value={formData.descriptionTwo}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            rows={6}
            placeholder="Additional description..."
        />
    </div>

    <div>
        <label className="block text-sm font-medium mb-1">
            Description Three
        </label>
        <textarea
            name="descriptionThree"
            value={formData.descriptionThree}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            rows={6}
            placeholder="Extra details..."
        />
    </div>

</div>

                    {/* Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Price (Rs.) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                min={0}
                                className={inputCls('price')}
                                placeholder="0.00"
                            />
                            <ErrorMsg field="price" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Discount Price</label>
                            <input
                                type="number"
                                name="discountPrice"
                                value={formData.discountPrice}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                min={0}
                                className={inputCls('discountPrice')}
                                placeholder="0.00 (optional)"
                            />
                            <ErrorMsg field="discountPrice" />
                        </div>
                    </div>

                    {/* Stocks Section */}
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="font-bold text-gray-700">Stock & Sizes</h3>
                            <button
                                type="button"
                                onClick={() =>
                                    setStocks([...stocks, { id: null, size: '', costPrice: '', sellingPrice: '', quantity: '' }])
                                }
                                className="text-sm flex items-center text-blue-600"
                            >
                                <PlusIcon className="w-4 h-4 mr-1" /> Add Size
                            </button>
                        </div>
                        <p className="text-[11px] text-gray-500 mb-3">
                            Set a unique <span className="font-semibold">Selling Price</span> per size if needed.
                        </p>
                        {stocks.map((stock, idx) => (
                            <div key={idx} className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4 sm:mb-2 items-end border-b sm:border-none pb-4 sm:pb-0">
                                <div>
                                    <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Size</label>
                                    <input
                                        placeholder="e.g. 42"
                                        value={stock.size}
                                        onChange={(e) => handleStockChange(idx, 'size', e.target.value)}
                                        className="w-full border rounded-lg p-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Cost</label>
                                    <input
                                        placeholder="Cost"
                                        type="number"
                                        min={0}
                                        value={stock.costPrice}
                                        onChange={(e) => handleStockChange(idx, 'costPrice', e.target.value)}
                                        className="w-full border rounded-lg p-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Selling</label>
                                    <input
                                        placeholder="Price"
                                        type="number"
                                        min={0}
                                        value={stock.sellingPrice}
                                        onChange={(e) => handleStockChange(idx, 'sellingPrice', e.target.value)}
                                        className="w-full border rounded-lg p-2 text-sm bg-orange-50 border-orange-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Qty</label>
                                    <input
                                        placeholder="Qty"
                                        type="number"
                                        min={0}
                                        value={stock.quantity}
                                        onChange={(e) => handleStockChange(idx, 'quantity', e.target.value)}
                                        className="w-full border rounded-lg p-2 text-sm"
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => setStocks(stocks.filter((_, i) => i !== idx))}
                                        className="text-red-500 p-2 hover:bg-red-50 rounded-lg"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                        {/* Product Specifications */}
<div className="border-t pt-4">

    <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-700">
            Product Specifications
        </h3>

        <button
            type="button"
            onClick={() =>
                setSpecifications([
                    ...specifications,
                    { key: '', value: '' }
                ])
            }
            className="text-sm flex items-center text-blue-600"
        >
            <PlusIcon className="w-4 h-4 mr-1" />
            Add Specification
        </button>
    </div>

    {specifications.map((spec, index) => (
        <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-3"
        >

            <input
                type="text"
                placeholder="Key (Example: Material)"
                value={spec.key}
                onChange={(e) => {
                    const updated = [...specifications];
                    updated[index].key = e.target.value;
                    setSpecifications(updated);
                }}
                className="sm:col-span-2 border rounded-lg p-2"
            />

            <input
                type="text"
                placeholder="Value (Example: Leather)"
                value={spec.value}
                onChange={(e) => {
                    const updated = [...specifications];
                    updated[index].value = e.target.value;
                    setSpecifications(updated);
                }}
                className="sm:col-span-2 border rounded-lg p-2"
            />

            <button
                type="button"
                onClick={() =>
                    setSpecifications(
                        specifications.filter((_, i) => i !== index)
                    )
                }
                className="text-red-500 hover:bg-red-50 rounded-lg p-2"
            >
                <TrashIcon className="w-5 h-5 mx-auto" />
            </button>

        </div>
    ))}
</div>
                    {/* Images */}
                    <div className="border-t pt-4">
                        <label className="block text-sm font-medium mb-2">
                            Product Images {!product && <span className="text-red-500">*</span>}
                        </label>
                        <div className="flex flex-wrap gap-3 mb-3">
                            {imagePreviews.map((src, i) => (
                                <div key={i} className="relative group">
                                    <img
                                        src={src}
                                        alt={`preview ${i + 1}`}
                                        className="w-20 h-20 object-cover rounded-lg border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(i)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <XMarkIcon className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                                <ArrowUpTrayIcon className="w-6 h-6 text-gray-400" />
                                <span className="text-xs text-gray-500 mt-1">Add</span>
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={handleImageChange}
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                />
                            </label>
                        </div>
                        <p className="text-xs text-gray-500">JPG, PNG, WebP or GIF · Max 5 MB each · Max 10 images.</p>
                        <ErrorMsg field="images" />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg font-semibold">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold disabled:bg-blue-300"
                        >
                            {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;