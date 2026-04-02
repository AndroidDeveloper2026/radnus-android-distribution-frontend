import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import AddProductStyle from './AddProductStyle';
import Input from '../../components/Input';
import Header from '../../components/Header';
import { useDispatch } from 'react-redux';
import { addProduct } from '../../services/features/products/productSlice';
import { Picker } from '@react-native-picker/picker';

import { Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required('Product name is required'),
  category: Yup.string().required('Category is required'),
  sku: Yup.string().trim().required('SKU is required'),
  mrp: Yup.number().typeError('MRP must be number').required('MRP required'),
  distributorPrice: Yup.number()
    .typeError('Distributor price must be number')
    .required('Distributor price required'),
  retailerPrice: Yup.number()
    .typeError('Retailer price must be number')
    .required('Retailer price required'),
  itemCost: Yup.number()
    .typeError('Item cost must be number')
    .required('Item cost required'),
  gst: Yup.number().typeError('GST must be number').required('GST required'),
  moq: Yup.number().typeError('MOQ must be number').required('MOQ required'),
  walkinPrice: Yup.number()
    .typeError('Walk-in price must be number')
    .required('Walk-in price required'),
  batchNo: Yup.string().trim(),  // ✅ optional
  rackNo: Yup.string().trim(),   // ✅ optional
});

const AddProduct = ({ navigation }) => {
  const dispatch = useDispatch();

  const [image, setImage] = useState(null);

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
          setImage(response.assets[0]);
        }
      },
    );
  };

  return (
    <View style={AddProductStyle.container}>
      <Header title={'Add Product'} />

      <Formik
        initialValues={{
          name: '',
          category: '',
          sku: '',
          mrp: '',
          distributorPrice: '',
          retailerPrice: '',
          itemCost: '',
          gst: '',
          moq: '',
          walkinPrice: '',
          batchNo: '',   // ✅ NEW
          rackNo: '',    // ✅ NEW
        }}
        validationSchema={validationSchema}
        onSubmit={async values => {
          try {
            if (!image) {
              alert('Product image is required');
              return;
            }

            const formData = new FormData();

            formData.append('name', values.name);
            formData.append('category', values.category);
            formData.append('sku', values.sku);
            formData.append('mrp', values.mrp);
            formData.append('distributorPrice', values.distributorPrice);
            formData.append('retailerPrice', values.retailerPrice);
            formData.append('itemCost', values.itemCost);
            formData.append('gst', values.gst);
            formData.append('moq', values.moq);
            formData.append('walkinPrice', values.walkinPrice);
            formData.append('batchNo', values.batchNo);   // ✅ NEW
            formData.append('rackNo', values.rackNo);     // ✅ NEW

            if (image) {
              formData.append('image', {
                uri: image.uri,
                type: image.type || 'image/jpeg',
                name: image.fileName || 'product.jpg',
              });
            }

            await dispatch(addProduct(formData)).unwrap();
            navigation.goBack();
          } catch (error) {
            console.log('Add product failed:', error);
          }
        }}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <>
            <ScrollView
              contentContainerStyle={AddProductStyle.form}
              showsVerticalScrollIndicator={false}
            >
              {/* PRODUCT IMAGE */}
              <Text style={AddProductStyle.label}>Product Image</Text>
              <TouchableOpacity
                style={AddProductStyle.imageBox}
                onPress={pickImage}
              >
                {image ? (
                  <Image
                    source={{ uri: image.uri }}
                    style={AddProductStyle.productImage}
                  />
                ) : (
                  <Text style={AddProductStyle.imagePlaceholder}>
                    Tap to add image
                  </Text>
                )}
              </TouchableOpacity>

              {/* PRODUCT NAME */}
              <Input
                label="Product Name"
                value={values.name}
                onChangeText={handleChange('name')}
              />
              {errors.name && touched.name && (
                <Text style={{ color: 'red' }}>{errors.name}</Text>
              )}

              {/* CATEGORY */}
              <Text style={AddProductStyle.label}>Category</Text>
              <View style={AddProductStyle.dropDown}>
                <Picker
                  selectedValue={values.category}
                  onValueChange={value => setFieldValue('category', value)}
                >
                  <Picker.Item label="Select Category" value="" color="#757575" />
                  <Picker.Item label="PD Chargers & Car Chargers" value="PD Chargers & Car Chargers" color="#000" />
                  <Picker.Item label="Charger" value="Charger" color="#000" />
                  <Picker.Item label="Data Cables" value="Data Cables" color="#000" />
                  <Picker.Item label="Handsfree" value="Handsfree" color="#000" />
                  <Picker.Item label="Bluetooth Neckband" value="Bluetooth Neckband" color="#000" />
                  <Picker.Item label="Ear Buds" value="Ear Buds" color="#000" />
                  <Picker.Item label="Speakers" value="Speakers" color="#000" />
                  <Picker.Item label="Radnus Battery" value="Radnus Battery" color="#000" />
                </Picker>
              </View>
              {errors.category && touched.category && (
                <Text style={{ color: 'red' }}>{errors.category}</Text>
              )}

              {/* SKU */}
              <Input
                label="SKU"
                value={values.sku}
                onChangeText={handleChange('sku')}
              />
              {errors.sku && touched.sku && (
                <Text style={{ color: 'red' }}>{errors.sku}</Text>
              )}

              {/* BATCH NO ✅ NEW */}
              <Input
                label="Batch No"
                value={values.batchNo}
                onChangeText={handleChange('batchNo')}
              />
              {errors.batchNo && touched.batchNo && (
                <Text style={{ color: 'red' }}>{errors.batchNo}</Text>
              )}

              {/* RACK NO ✅ NEW */}
              <Input
                label="Rack No"
                value={values.rackNo}
                onChangeText={handleChange('rackNo')}
              />
              {errors.rackNo && touched.rackNo && (
                <Text style={{ color: 'red' }}>{errors.rackNo}</Text>
              )}

              {/* ITEM COST */}
              <Input
                label="Item Cost (₹)"
                keyboardType="numeric"
                value={values.itemCost}
                onChangeText={handleChange('itemCost')}
              />
              {errors.itemCost && touched.itemCost && (
                <Text style={{ color: 'red' }}>{errors.itemCost}</Text>
              )}

              {/* DISTRIBUTOR PRICE */}
              <Input
                label="Distributor Price (₹)"
                keyboardType="numeric"
                value={values.distributorPrice}
                onChangeText={handleChange('distributorPrice')}
              />
              {errors.distributorPrice && touched.distributorPrice && (
                <Text style={{ color: 'red' }}>{errors.distributorPrice}</Text>
              )}

              {/* RETAILER PRICE */}
              <Input
                label="Retailer Price (₹)"
                keyboardType="numeric"
                value={values.retailerPrice}
                onChangeText={handleChange('retailerPrice')}
              />
              {errors.retailerPrice && touched.retailerPrice && (
                <Text style={{ color: 'red' }}>{errors.retailerPrice}</Text>
              )}

              {/* WALK-IN PRICE */}
              <Input
                label="Walk-in Price (₹)"
                keyboardType="numeric"
                value={values.walkinPrice}
                onChangeText={handleChange('walkinPrice')}
              />
              {errors.walkinPrice && touched.walkinPrice && (
                <Text style={{ color: 'red' }}>{errors.walkinPrice}</Text>
              )}

              {/* MRP */}
              <Input
                label="MRP (₹)"
                keyboardType="numeric"
                value={values.mrp}
                onChangeText={handleChange('mrp')}
              />
              {errors.mrp && touched.mrp && (
                <Text style={{ color: 'red' }}>{errors.mrp}</Text>
              )}

              {/* GST */}
              <Input
                label="GST (%)"
                keyboardType="numeric"
                value={values.gst}
                onChangeText={handleChange('gst')}
              />
              {errors.gst && touched.gst && (
                <Text style={{ color: 'red' }}>{errors.gst}</Text>
              )}

              {/* MOQ */}
              <Input
                label="MOQ (Units)"
                keyboardType="numeric"
                value={values.moq}
                onChangeText={handleChange('moq')}
              />
              {errors.moq && touched.moq && (
                <Text style={{ color: 'red' }}>{errors.moq}</Text>
              )}
            </ScrollView>

            {/* SAVE BUTTON */}
            <View style={AddProductStyle.saveBtnCard}>
              <TouchableOpacity
                style={AddProductStyle.saveButton}
                onPress={handleSubmit}
              >
                <Text style={AddProductStyle.saveButtonText}>Save Product</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

export default AddProduct;