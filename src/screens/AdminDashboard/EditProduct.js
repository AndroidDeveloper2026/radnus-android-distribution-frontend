// import React, { useState, useEffect } from 'react';
// import { View, TouchableOpacity, Text, ScrollView, Image } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { updateProduct } from '../../services/features/products/productSlice';
// import Input from '../../components/Input';
// import AddProductStyle from './AddProductStyle';
// import Header from '../../components/Header';
// import { openCamera } from '../../utils/cameraHelper';

// const EditProduct = ({ route, navigation }) => {
//   const { id } = route.params;
//   const dispatch = useDispatch();

//   const product = useSelector(state =>
//     state.products.list.find(p => p._id === id),
//   );

//   const [form, setForm] = useState({});

//   useEffect(() => {
//     if (product) {
//       setForm(product);
//     }
//   }, [product]);

//   const onChange = (key, value) => {
//     setForm({ ...form, [key]: value });
//   };

//   /* 📸 Pick Image */
//   const pickImage = () => {
//     openCamera(image => {
//       setForm({ ...form, image });
//     });
//   };

//   /* 🔄 Update Product */
//   const onUpdate = async () => {
//     try {
//       const formData = new FormData();

//       Object.keys(form).forEach(key => {
//         if (key === 'image' && typeof form.image !== 'string') {
//           formData.append('image', {
//             uri: form.image.uri,
//             type: form.image.type,
//             name: form.image.name,
//           });
//         } else {
//           formData.append(key, form[key]);
//         }
//       });

//       await dispatch(updateProduct({ id, formData })).unwrap();

//       navigation.goBack();
//     } catch (err) {
//       console.log('Update error:', err);
//     }
//   };

//   return (
//     <View style={AddProductStyle.container}>
//       <Header title={'Edit Product'} />

//       <ScrollView
//         contentContainerStyle={AddProductStyle.form}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* PRODUCT IMAGE */}
//         <Text style={AddProductStyle.label}>Product Image</Text>

//         <TouchableOpacity style={AddProductStyle.imageBox} onPress={pickImage}>
//           {form.image ? (
//             <Image
//               source={{
//                 uri:
//                   typeof form.image === 'string' ? form.image : form.image.uri,
//               }}
//               style={AddProductStyle.productImage}
//             />
//           ) : (
//             <Text style={AddProductStyle.imagePlaceholder}>
//               Tap to add image
//             </Text>
//           )}
//         </TouchableOpacity>

//         {/* PRODUCT NAME */}
//         <Input
//           label="Product Name"
//           value={form.name}
//           onChangeText={v => onChange('name', v)}
//         />

//         {/* CATEGORY */}
//         <Input
//           label="Category"
//           value={form.category}
//           onChangeText={v => onChange('category', v)}
//         />

//         {/* SKU */}
//         <Input
//           label="SKU"
//           value={form.sku}
//           onChangeText={v => onChange('sku', v)}
//         />

//         {/* ITEM COST */}
//         <Input
//           label="Item Cost (₹)"
//           keyboardType="numeric"
//           value={form.itemCost?.toString()}
//           onChangeText={v => onChange('itemCost', v)}
//         />

//         {/* DISTRIBUTOR PRICE */}
//         <Input
//           label="Distributor Price (₹)"
//           keyboardType="numeric"
//           value={form.distributorPrice?.toString()}
//           onChangeText={v => onChange('distributorPrice', v)}
//         />

//         {/* RETAILER PRICE */}
//         <Input
//           label="Retailer Price (₹)"
//           keyboardType="numeric"
//           value={form.retailerPrice?.toString()}
//           onChangeText={v => onChange('retailerPrice', v)}
//         />

//         {/* WALK-IN PRICE */}
//         <Input
//           label="Walk-in Price (₹)"
//           keyboardType="numeric"
//           value={form.walkinPrice?.toString()}
//           onChangeText={v => onChange('walkinPrice', v)}
//         />

//         {/* MRP */}
//         <Input
//           label="MRP (₹)"
//           keyboardType="numeric"
//           value={form.mrp?.toString()}
//           onChangeText={v => onChange('mrp', v)}
//         />

//         {/* STATUS */}
//         <Input
//           label="Status"
//           value={form.status}
//           onChangeText={v => onChange('status', v)}
//         />

//         {/* GST */}
//         <Input
//           label="GST (%)"
//           keyboardType="numeric"
//           value={form.gst?.toString()}
//           onChangeText={v => onChange('gst', v)}
//         />

//         {/* MOQ */}
//         <Input
//           label="MOQ (Units)"
//           keyboardType="numeric"
//           value={form.moq?.toString()}
//           onChangeText={v => onChange('moq', v)}
//         />
//       </ScrollView>

//       {/* SAVE BUTTON */}
//       <View style={AddProductStyle.saveBtnCard}>
//         <TouchableOpacity style={AddProductStyle.saveButton} onPress={onUpdate}>
//           <Text style={AddProductStyle.saveButtonText}>Update Product</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default EditProduct;

import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct } from '../../services/features/products/productSlice';
import Input from '../../components/Input';
import AddProductStyle from './AddProductStyle';
import Header from '../../components/Header';
import { openCamera } from '../../utils/cameraHelper';

const EditProduct = ({ route, navigation }) => {
  const { id } = route.params;
  const dispatch = useDispatch();

  const product = useSelector(state =>
    state.products.list.find(p => p._id === id),
  );

  const [form, setForm] = useState({});

  useEffect(() => {
    if (product) {
      setForm(product);
    }
  }, [product]);

  const onChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  /* 📸 Pick Image */
  const pickImage = () => {
    openCamera(image => {
      setForm({ ...form, image });
    });
  };

  /* 🔄 Update Product */
  const onUpdate = async () => {
    try {
      const formData = new FormData();

      Object.keys(form).forEach(key => {
        if (key === 'image' && typeof form.image !== 'string') {
          formData.append('image', {
            uri: form.image.uri,
            type: form.image.type,
            name: form.image.name,
          });
        } else {
          formData.append(key, form[key]);
        }
      });

      await dispatch(updateProduct({ id, formData })).unwrap();
      navigation.goBack();
    } catch (err) {
      console.log('Update error:', err);
    }
  };

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
            <Text style={AddProductStyle.imagePlaceholder}>
              Tap to add image
            </Text>
          )}
        </TouchableOpacity>

        {/* PRODUCT NAME */}
        <Input
          label="Product Name"
          value={form.name}
          onChangeText={v => onChange('name', v)}
        />

        {/* CATEGORY */}
        <Input
          label="Category"
          value={form.category}
          onChangeText={v => onChange('category', v)}
        />

        {/* SKU */}
        <Input
          label="SKU"
          value={form.sku}
          onChangeText={v => onChange('sku', v)}
        />

        {/* BATCH NO ✅ NEW */}
        <Input
          label="Batch No"
          value={form.batchNo}
          onChangeText={v => onChange('batchNo', v)}
        />

        {/* RACK NO ✅ NEW */}
        <Input
          label="Rack No"
          value={form.rackNo}
          onChangeText={v => onChange('rackNo', v)}
        />

        {/* ITEM COST */}
        <Input
          label="Item Cost (₹)"
          keyboardType="numeric"
          value={form.itemCost?.toString()}
          onChangeText={v => onChange('itemCost', v)}
        />

        {/* DISTRIBUTOR PRICE */}
        <Input
          label="Distributor Price (₹)"
          keyboardType="numeric"
          value={form.distributorPrice?.toString()}
          onChangeText={v => onChange('distributorPrice', v)}
        />

        {/* RETAILER PRICE */}
        <Input
          label="Retailer Price (₹)"
          keyboardType="numeric"
          value={form.retailerPrice?.toString()}
          onChangeText={v => onChange('retailerPrice', v)}
        />

        {/* WALK-IN PRICE */}
        <Input
          label="Walk-in Price (₹)"
          keyboardType="numeric"
          value={form.walkinPrice?.toString()}
          onChangeText={v => onChange('walkinPrice', v)}
        />

        {/* MRP */}
        <Input
          label="MRP (₹)"
          keyboardType="numeric"
          value={form.mrp?.toString()}
          onChangeText={v => onChange('mrp', v)}
        />

        {/* STATUS */}
        <Input
          label="Status"
          value={form.status}
          onChangeText={v => onChange('status', v)}
        />

        {/* GST */}
        <Input
          label="GST (%)"
          keyboardType="numeric"
          value={form.gst?.toString()}
          onChangeText={v => onChange('gst', v)}
        />

        {/* MOQ */}
        <Input
          label="MOQ (Units)"
          keyboardType="numeric"
          value={form.moq?.toString()}
          onChangeText={v => onChange('moq', v)}
        />
      </ScrollView>

      {/* SAVE BUTTON */}
      <View style={AddProductStyle.saveBtnCard}>
        <TouchableOpacity style={AddProductStyle.saveButton} onPress={onUpdate}>
          <Text style={AddProductStyle.saveButtonText}>Update Product</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProduct;