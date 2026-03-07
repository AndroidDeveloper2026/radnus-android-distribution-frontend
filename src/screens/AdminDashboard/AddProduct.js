// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
// import { launchImageLibrary } from 'react-native-image-picker';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// import AddProductStyle from './AddProductStyle';
// import Input from '../../components/Input';
// import Header from '../../components/Header';
// import { useDispatch } from 'react-redux';
// import { addProduct } from '../../services/features/products/productSlice';
// import { Picker } from '@react-native-picker/picker';
// // import styles from './AdminDashboardStyle';

// const AddProduct = ({ navigation }) => {
//   const dispatch = useDispatch();

//   const [form, setForm] = useState({
//     name: '',
//     sku: '',
//     mrp: '',
//     distributorPrice: '',
//     retailerPrice: '',
//     gst: '',
//     moq: '',
//     image: null,
//   });

//   const onChange = (key, value) => {
//     setForm({ ...form, [key]: value });
//   };

//   /* 📸 PICK PRODUCT IMAGE */
//   const pickImage = () => {
//     launchImageLibrary(
//       {
//         mediaType: 'photo',
//         quality: 0.7,
//       },
//       response => {
//         if (response.didCancel) return;

//         if (response.assets && response.assets.length > 0) {
//           setForm({ ...form, image: response.assets[0] });
//         }
//       },
//     );
//   };

//   const onSave = async () => {
//     console.log('--- save product ---');

//     try {
//       const formData = new FormData();

//       formData.append('name', form.name);
//       formData.append('category', form.category);
//       formData.append('sku', form.sku);

//       formData.append('mrp', form.mrp);
//       formData.append('distributorPrice', form.distributorPrice);
//       formData.append('retailerPrice', form.retailerPrice);

//       formData.append('gst', form.gst);
//       formData.append('moq', form.moq);

//       if (form.image) {
//         formData.append('image', {
//           uri: form.image.uri,
//           type: form.image.type || 'image/jpeg',
//           name: form.image.fileName || 'product.jpg',
//         });
//       }

//       await dispatch(addProduct(formData)).unwrap();

//       navigation.goBack();
//     } catch (error) {
//       console.log('Add product failed:', error);
//     }

//     // const payload = {
//     //   ...form,
//     //   image: form.image, // send as multipart later
//     // };

//     // console.log('Product Data:', payload);

//     // // TODO: API call (multipart/form-data)
//     // navigation.goBack();
//   };

//   return (
//     <View style={AddProductStyle.container}>
//       <Header title={'Add Product'} />

//       <ScrollView
//         contentContainerStyle={AddProductStyle.form}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* 🖼 PRODUCT IMAGE */}
//         <Text style={AddProductStyle.label}>Product Image</Text>

//         <TouchableOpacity style={AddProductStyle.imageBox} onPress={pickImage}>
//           {form.image ? (
//             <Image
//               source={{ uri: form.image.uri }}
//               style={AddProductStyle.productImage}
//             />
//           ) : (
//             <Text style={AddProductStyle.imagePlaceholder}>
//               Tap to add image
//             </Text>
//           )}
//         </TouchableOpacity>

//         <Input
//           label="Product Name"
//           value={form.name}
//           onChangeText={v => onChange('name', v)}
//         />

//         <Text style={AddProductStyle.label}>Category</Text>

//         <View style={AddProductStyle.dropDown}>
//           <Picker
//             selectedValue={form.category}
//             onValueChange={value => onChange('category', value)}
//           >
//             <Picker.Item label="Select Category" value=""  color='#757575'/>
//             <Picker.Item label="PD Chargers & Car Chargers" value="PD Chargers & Car Chargers" color="#000000"/>
//             <Picker.Item label="Charger" value="Charger" color="#000000"/>
//             <Picker.Item label="Data Cables" value="Data Cables" color="#000000"/>
//             <Picker.Item label="Handsfree" value="Handsfree" color="#000000"/>
//             <Picker.Item label="Bluetooth Neckband" value="Bluetooth Neckband" color="#000000"/>
//             <Picker.Item label="Ear Buds" value="Ear Buds" color="#000000"/>
//             <Picker.Item label="Speakers" value="Speakers" color="#000000"/>
//             <Picker.Item label="Radnus Battery" value="Speakers" color="#000000"/>
//           </Picker>
//         </View>

//         <Input
//           label="SKU"
//           value={form.sku}
//           onChangeText={v => onChange('sku', v)}
//         />

//         <Input
//           label="MRP (₹)"
//           keyboardType="numeric"
//           value={form.mrp}
//           onChangeText={v => onChange('mrp', v)}
//         />

//         <Input
//           label="Distributor Price (₹)"
//           keyboardType="numeric"
//           value={form.distributorPrice}
//           onChangeText={v => onChange('distributorPrice', v)}
//         />

//         <Input
//           label="Retailer Price (₹)"
//           keyboardType="numeric"
//           value={form.retailerPrice}
//           onChangeText={v => onChange('retailerPrice', v)}
//         />

//         <Input
//           label="GST (%)"
//           keyboardType="numeric"
//           value={form.gst}
//           onChangeText={v => onChange('gst', v)}
//         />

//         <Input
//           label="MOQ (Units)"
//           keyboardType="numeric"
//           value={form.moq}
//           onChangeText={v => onChange('moq', v)}
//         />
//       </ScrollView>
//       <View style={AddProductStyle.saveBtnCard}>
//         <TouchableOpacity style={AddProductStyle.saveButton} onPress={onSave}>
//           <Text style={AddProductStyle.saveButtonText}>Save Product</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default AddProduct;


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
  gst: Yup.number().typeError('GST must be number').required('GST required'),
  moq: Yup.number().typeError('MOQ must be number').required('MOQ required'),
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
          gst: '',
          moq: '',
        }}
        validationSchema={validationSchema}
        onSubmit={async values => {
          try {

            if(!image){
              alert("Product image is required");
              return;
            }
            
            const formData = new FormData();

            formData.append('name', values.name);
            formData.append('category', values.category);
            formData.append('sku', values.sku);

            formData.append('mrp', values.mrp);
            formData.append('distributorPrice', values.distributorPrice);
            formData.append('retailerPrice', values.retailerPrice);

            formData.append('gst', values.gst);
            formData.append('moq', values.moq);

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
                  <Picker.Item
                    label="Select Category"
                    value=""
                    color="#757575"
                  />
                  <Picker.Item
                    label="PD Chargers & Car Chargers"
                    value="PD Chargers & Car Chargers"
                    color="#000"
                  />
                  <Picker.Item label="Charger" value="Charger" color="#000" />
                  <Picker.Item
                    label="Data Cables"
                    value="Data Cables"
                    color="#000"
                  />
                  <Picker.Item
                    label="Handsfree"
                    value="Handsfree"
                    color="#000"
                  />
                  <Picker.Item
                    label="Bluetooth Neckband"
                    value="Bluetooth Neckband"
                    color="#000"
                  />
                  <Picker.Item label="Ear Buds" value="Ear Buds" color="#000" />
                  <Picker.Item label="Speakers" value="Speakers" color="#000" />
                  <Picker.Item
                    label="Radnus Battery"
                    value="Radnus Battery"
                    color="#000"
                  />
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

              {/* DISTRIBUTOR PRICE */}
              <Input
                label="Distributor Price (₹)"
                keyboardType="numeric"
                value={values.distributorPrice}
                onChangeText={handleChange('distributorPrice')}
              />
              {errors.distributorPrice && touched.distributorPrice && (
                <Text style={{ color: 'red' }}>
                  {errors.distributorPrice}
                </Text>
              )}

              {/* RETAILER PRICE */}
              <Input
                label="Retailer Price (₹)"
                keyboardType="numeric"
                value={values.retailerPrice}
                onChangeText={handleChange('retailerPrice')}
              />
              {errors.retailerPrice && touched.retailerPrice && (
                <Text style={{ color: 'red' }}>
                  {errors.retailerPrice}
                </Text>
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
                <Text style={AddProductStyle.saveButtonText}>
                  Save Product
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

export default AddProduct;

