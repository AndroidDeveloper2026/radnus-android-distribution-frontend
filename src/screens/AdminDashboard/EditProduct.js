import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct } from '../../services/features/products/productSlice';
import Input from '../../components/Input';
import AddProductStyle from './AddProductStyle';
import Header from '../../components/Header';

const EditProduct = ({ route, navigation }) => {
  const { id } = route.params;
  const dispatch = useDispatch();

  const product = useSelector(state =>
    state.products.list.find(p => p._id === id),
  );

  console.log('--- product(edit) ---', product);

  const [form, setForm] = useState({});

  useEffect(() => {
    if (product) {
      setForm(product);
    }
  }, [product]);

  console.log('--- form(edit) ---', form.mrp);

  const onChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const onUpdate = async () => {
    const formData = new FormData();

    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });

    await dispatch(updateProduct({ id, formData })).unwrap();
    navigation.goBack();
  };

  return (
    <View style={AddProductStyle.container}>
      <Header title={'Edit Product'} />

      <ScrollView
        contentContainerStyle={AddProductStyle.form}
        showsVerticalScrollIndicator={false}
      >
        {/* 🖼 PRODUCT IMAGE */}
        <Text style={AddProductStyle.label}>Product Image</Text>

        {/* <TouchableOpacity style={AddProductStyle.imageBox} onPress={pickImage}>
          {form.image ? (
            <Image
              source={{ uri: form.image.uri }}
              style={AddProductStyle.productImage}
            />
          ) : (
            <Text style={AddProductStyle.imagePlaceholder}>
              Tap to add image
            </Text>
          )}
        </TouchableOpacity> */}

        <Input
          label="Product Name"
          value={form.name}
          onChangeText={v => onChange('name', v)}
        />

        <Input
          label="Category"
          value={form.category}
          onChangeText={v => onChange('category', v)}
        />

        <Input
          label="SKU"
          value={form.sku}
          onChangeText={v => onChange('sku', v)}
        />

        <Input
          label="MRP (₹)"
          keyboardType="numeric"
          value={form.mrp?.toString()}
          onChangeText={v => onChange('mrp', v)}
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
        <TouchableOpacity style={AddProductStyle.saveButton} onPress={onUpdate}>
          <Text style={AddProductStyle.saveButtonText}>Update Product</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProduct;
