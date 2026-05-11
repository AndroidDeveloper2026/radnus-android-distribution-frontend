import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  updateProduct,
  fetchProducts,
} from '../../services/features/products/productSlice';
import { fetchInvoices } from '../../services/features/retailer/invoiceSlice'; // <-- Added
import { createActivityLog } from '../../services/features/activity/activitySlice';
import Input from '../../components/Input';
import AddProductStyle from './AddProductStyle';
import Header from '../../components/Header';

const EditProduct = ({ route, navigation }) => {
  const { id } = route.params;
  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.auth.user);
  const productsList = useSelector(state => state.products.list);
  const invoices = useSelector(state => state.invoice?.data || []);   // <-- Get invoices

  const product = productsList.find(p => p._id === id);

  // ✅ Calculate total sold for this product (same as on the web)
  const totalSold = useMemo(() => {
    if (!product || !invoices.length) return 0;
    return invoices.reduce((sum, inv) => {
      const item = inv.items?.find(i => i.productId === product._id);
      return sum + (item?.qty || 0);
    }, 0);
  }, [product, invoices]);

  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);

  // Fetch products if not already loaded
  useEffect(() => {
    if (productsList.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, productsList.length]);

  // Fetch invoices if not already loaded (so totalSold is accurate)
  useEffect(() => {
    if (!invoices.length) {
      dispatch(fetchInvoices('all')); // adjust if your thunk expects a different argument
    }
  }, [dispatch, invoices.length]);

  // Populate form when product is available, including corrected stock
  useEffect(() => {
    if (product) {
      const displayStock = Math.max(0, (product.moq ?? 0) - totalSold);
      setForm({ ...product, moq: displayStock }); // Override moq with display stock
    }
  }, [product, totalSold]);

  const onChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const pickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.7 },
      response => {
        if (response.didCancel) return;
        if (response.assets && response.assets.length > 0) {
          setForm({ ...form, image: response.assets[0] });
          setImageChanged(true);
        }
      },
    );
  };

  const validateForm = () => {
    const required = [
      'name', 'category', 'sku', 'mrp', 'distributorPrice',
      'retailerPrice', 'itemCost', 'gst', 'moq', 'walkinPrice',
    ];
    for (let field of required) {
      if (!form[field] || form[field].toString().trim() === '') {
        Alert.alert('Validation Error', `${field} is required`);
        return false;
      }
    }
    if (!imageChanged && !form.image) {
      Alert.alert('Validation Error', 'Product image is required');
      return false;
    }
    return true;
  };

  const onUpdate = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const formData = new FormData();

      // ✅ Convert displayed stock back to real moq
      const finalForm = { ...form };
      finalForm.moq = Number(form.moq) + totalSold; // real stock = displayed + sold

      const allowedFields = [
        'name', 'category', 'sku', 'batchNo', 'rackNo',
        'mrp', 'distributorPrice', 'retailerPrice', 'walkinPrice',
        'itemCost', 'gst', 'moq', 'status', 'vendorName',
      ];

      for (let key of allowedFields) {
        if (finalForm[key] !== undefined && finalForm[key] !== null && finalForm[key] !== '') {
          const numericFields = [
            'mrp', 'distributorPrice', 'retailerPrice', 'walkinPrice',
            'itemCost', 'gst', 'moq',
          ];
          let value = finalForm[key];
          if (numericFields.includes(key)) {
            value = Number(value);
            if (isNaN(value)) continue;
          }
          formData.append(key, value);
        }
      }

      if (imageChanged && form.image && typeof form.image !== 'string') {
        formData.append('image', {
          uri: form.image.uri,
          type: form.image.type || 'image/jpeg',
          name: form.image.fileName || 'product.jpg',
        });
      }

      const resultAction = await dispatch(
        updateProduct({ id, formData })
      ).unwrap();

      await dispatch(
        createActivityLog({
          action: 'EDIT_PRODUCT',
          productId: resultAction._id,
          productName: resultAction.name,
          user:
            currentUser?.name ||
            currentUser?.fullName ||
            currentUser?.email ||
            'Unknown',
          role: currentUser?.role || 'Radnus',
        })
      ).unwrap();

      Alert.alert('Success', 'Product updated successfully');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Update Failed', err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!product && productsList.length > 0) {
    return <Text style={AddProductStyle.centerText}>Product not found</Text>;
  }

  if (!product && productsList.length === 0) {
    return <Text style={AddProductStyle.centerText}>Loading product...</Text>;
  }

  return (
    <View style={AddProductStyle.container}>
      <Header title={'Edit Product'} />

      <ScrollView
        contentContainerStyle={AddProductStyle.form}
        showsVerticalScrollIndicator={false}
      >
        <Text style={AddProductStyle.label}>Product Image</Text>
        <TouchableOpacity style={AddProductStyle.imageBox} onPress={pickImage}>
          {form.image ? (
            <Image
              source={{
                uri: typeof form.image === 'string' ? form.image : form.image.uri,
              }}
              style={AddProductStyle.productImage}
            />
          ) : (
            <Text style={AddProductStyle.imagePlaceholder}>Tap to add image</Text>
          )}
        </TouchableOpacity>

        <Input label="Product Name" value={form.name} onChangeText={v => onChange('name', v)} />
        <Input label="Category" value={form.category} onChangeText={v => onChange('category', v)} />
        <Input label="SKU" value={form.sku} onChangeText={v => onChange('sku', v)} />
        <Input label="Batch No" value={form.batchNo} onChangeText={v => onChange('batchNo', v)} />
        <Input label="Rack No" value={form.rackNo} onChangeText={v => onChange('rackNo', v)} />
        <Input label="Vendor Name" value={form.vendorName || ''} onChangeText={v => onChange('vendorName', v)} />

        <Input
          label="Item Cost (₹)"
          keyboardType="numeric"
          value={form.itemCost?.toString()}
          onChangeText={v => onChange('itemCost', v)}
        />
        <Input
          label="Distributor Price (₹)"
          keyboardType="numeric"
          value={form.distributorPrice?.toString()}
          onChangeText={v => onChange('distributorPrice', v)}
        />
        <Input
          label="Retailer Price (₹)"
          keyboardType="numeric"
          value={form.retailerPrice?.toString()}
          onChangeText={v => onChange('retailerPrice', v)}
        />
        <Input
          label="Walk-in Price (₹)"
          keyboardType="numeric"
          value={form.walkinPrice?.toString()}
          onChangeText={v => onChange('walkinPrice', v)}
        />
        <Input
          label="MRP (₹)"
          keyboardType="numeric"
          value={form.mrp?.toString()}
          onChangeText={v => onChange('mrp', v)}
        />
        <Input label="Status" value={form.status} onChangeText={v => onChange('status', v)} />
        <Input
          label="GST (%)"
          keyboardType="numeric"
          value={form.gst?.toString()}
          onChangeText={v => onChange('gst', v)}
        />
        {/* ✅ Stock field now shows current stock, not raw moq */}
        <Input
          label="Stock (Units)"
          keyboardType="numeric"
          value={form.moq?.toString()}
          onChangeText={v => onChange('moq', v)}
        />
      </ScrollView>

      <View style={AddProductStyle.saveBtnCard}>
        <TouchableOpacity
          style={[AddProductStyle.saveButton, loading && { opacity: 0.7 }]}
          onPress={onUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={AddProductStyle.saveButtonText}>Update Product</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProduct;