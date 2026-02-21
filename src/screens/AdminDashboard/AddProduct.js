import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
// import { SafeAreaView } from 'react-native-safe-area-context';
import AddProductStyle from './AddProductStyle';
import Input from '../../components/Input';
import Header from '../../components/Header';
import { useDispatch } from 'react-redux';
import { addProduct } from '../../services/features/products/productSlice';
import { Picker } from '@react-native-picker/picker';
import styles from './AdminDashboardStyle';

const AddProduct = ({ navigation }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: '',
    sku: '',
    mrp: '',
    distributorPrice: '',
    retailerPrice: '',
    gst: '',
    moq: '',
    image: null,
  });

  const onChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  /* 📸 PICK PRODUCT IMAGE */
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
        }
      },
    );
  };

  const onSave = async () => {
    console.log('--- save product ---');

    try {
      const formData = new FormData();

      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('sku', form.sku);

      formData.append('mrp', form.mrp);
      formData.append('distributorPrice', form.distributorPrice);
      formData.append('retailerPrice', form.retailerPrice);

      formData.append('gst', form.gst);
      formData.append('moq', form.moq);

      if (form.image) {
        formData.append('image', {
          uri: form.image.uri,
          type: form.image.type || 'image/jpeg',
          name: form.image.fileName || 'product.jpg',
        });
      }

      await dispatch(addProduct(formData)).unwrap();

      navigation.goBack();
    } catch (error) {
      console.log('Add product failed:', error);
    }

    // const payload = {
    //   ...form,
    //   image: form.image, // send as multipart later
    // };

    // console.log('Product Data:', payload);

    // // TODO: API call (multipart/form-data)
    // navigation.goBack();
  };

  return (
    <View style={AddProductStyle.container}>
      <Header title={'Add Product'} />

      <ScrollView
        contentContainerStyle={AddProductStyle.form}
        showsVerticalScrollIndicator={false}
      >
        {/* 🖼 PRODUCT IMAGE */}
        <Text style={AddProductStyle.label}>Product Image</Text>

        <TouchableOpacity style={AddProductStyle.imageBox} onPress={pickImage}>
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
        </TouchableOpacity>

        <Input
          label="Product Name"
          value={form.name}
          onChangeText={v => onChange('name', v)}
        />

        {/* <Input
          label="Category"
          value={form.category}
          onChangeText={v => onChange('category', v)}
        /> */}

        <Text style={AddProductStyle.label}>Category</Text>

        <View style={AddProductStyle.dropDown}>
          <Picker
            selectedValue={form.category}
            onValueChange={value => onChange('category', value)}
          >
            <Picker.Item label="Select Category" value=""  color='#757575'/>
            <Picker.Item label="PD Chargers & Car Chargers" value="PD Chargers & Car Chargers" />
            <Picker.Item label="Charger" value="Charger" />
            <Picker.Item label="Data Cables" value="Data Cables" />
            <Picker.Item label="Handsfree" value="Handsfree" />
            <Picker.Item label="Bluetooth Neckband" value="Bluetooth Neckband" />
            <Picker.Item label="Ear Buds" value="Ear Buds" />
            <Picker.Item label="Speakers" value="Speakers" />
            <Picker.Item label="Radnus Battery" value="Speakers" />
          </Picker>
        </View>

        <Input
          label="SKU"
          value={form.sku}
          onChangeText={v => onChange('sku', v)}
        />

        <Input
          label="MRP (₹)"
          keyboardType="numeric"
          value={form.mrp}
          onChangeText={v => onChange('mrp', v)}
        />

        <Input
          label="Distributor Price (₹)"
          keyboardType="numeric"
          value={form.distributorPrice}
          onChangeText={v => onChange('distributorPrice', v)}
        />

        <Input
          label="Retailer Price (₹)"
          keyboardType="numeric"
          value={form.retailerPrice}
          onChangeText={v => onChange('retailerPrice', v)}
        />

        <Input
          label="GST (%)"
          keyboardType="numeric"
          value={form.gst}
          onChangeText={v => onChange('gst', v)}
        />

        <Input
          label="MOQ (Units)"
          keyboardType="numeric"
          value={form.moq}
          onChangeText={v => onChange('moq', v)}
        />
      </ScrollView>
      <View style={AddProductStyle.saveBtnCard}>
        <TouchableOpacity style={AddProductStyle.saveButton} onPress={onSave}>
          <Text style={AddProductStyle.saveButtonText}>Save Product</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddProduct;
