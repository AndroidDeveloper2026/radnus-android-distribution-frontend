import React, { useState, useEffect } from 'react';
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
import { updateProduct, fetchProducts } from '../../services/features/products/productSlice';
import { createActivityLog } from '../../services/features/activity/activitySlice';
import Input from '../../components/Input';
import AddProductStyle from './AddProductStyle';
import Header from '../../components/Header';

const EditProduct = ({ route, navigation }) => {
  const { id } = route.params;
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);
  const productsList = useSelector(state => state.products.list);
  const product = productsList.find(p => p._id === id);

  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);

  // Fetch products if list is empty
  useEffect(() => {
    if (productsList.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, productsList.length]);

  // Populate form when product is available
  useEffect(() => {
    if (product) {
      setForm(product);
    }
  }, [product]);

  const onChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  // 📸 Pick image from gallery (same as AddProduct)
  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.7,
      },
      response => {
        if (response.didCancel) return;
        if (response.assets && response.assets.length > 0) {
          setForm({ ...form, image: response.assets[0] });
          setImageChanged(true);
        }
      },
    );
  };

  // 🔄 Validate before submit
  const validateForm = () => {
    const required = ['name', 'category', 'sku', 'mrp', 'distributorPrice', 'retailerPrice', 'itemCost', 'gst', 'moq', 'walkinPrice'];
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

      // Allowed fields to send (avoid _id, __v, timestamps)
      const allowedFields = [
        'name', 'category', 'sku', 'batchNo', 'rackNo',
        'mrp', 'distributorPrice', 'retailerPrice', 'walkinPrice',
        'itemCost', 'gst', 'moq', 'status'
      ];

      for (let key of allowedFields) {
        if (form[key] !== undefined && form[key] !== null && form[key] !== '') {
          // Convert numeric fields to numbers
          const numericFields = ['mrp', 'distributorPrice', 'retailerPrice', 'walkinPrice', 'itemCost', 'gst', 'moq'];
          let value = form[key];
          if (numericFields.includes(key)) {
            value = Number(value);
            if (isNaN(value)) continue; // skip invalid numbers
          }
          formData.append(key, value);
        }
      }

      // Handle image: only append if user picked a new one
      if (imageChanged && form.image && typeof form.image !== 'string') {
        formData.append('image', {
          uri: form.image.uri,
          type: form.image.type || 'image/jpeg',
          name: form.image.fileName || 'product.jpg',
        });
      }

      const resultAction = await dispatch(updateProduct({ id, formData })).unwrap();

      // Log activity
      await dispatch(
        createActivityLog({
          action: 'EDIT_PRODUCT',
          productId: resultAction._id,
          productName: resultAction.name,
          user: currentUser?.name || currentUser?.fullName || currentUser?.email || 'Unknown',
          role: currentUser?.role || 'Radnus',
        }),
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
        {/* PRODUCT IMAGE */}
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
        <Input
          label="MOQ (Units)"
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